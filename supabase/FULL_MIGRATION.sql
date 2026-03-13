-- FILE: supabase/migrations/001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: profiles
-- Extends auth.users, created via trigger on signup
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  daily_credits_used INTEGER NOT NULL DEFAULT 0,
  last_credit_reset TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Table: documents
-- Stores every YouTube/PDF source submitted
-- ============================================
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('youtube', 'pdf')),
  title TEXT NOT NULL,
  source_url TEXT,
  storage_path TEXT,
  transcript_text TEXT,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  word_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_created_at ON public.documents(created_at DESC);

-- ============================================
-- Table: decks
-- A flashcard deck belongs to one document
-- ============================================
CREATE TABLE public.decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  card_count INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT false,
  public_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_decks_user_id ON public.decks(user_id);
CREATE INDEX idx_decks_document_id ON public.decks(document_id);
CREATE INDEX idx_decks_public_slug ON public.decks(public_slug) WHERE public_slug IS NOT NULL;

-- ============================================
-- Table: flashcards
-- ============================================
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_flashcards_deck_id ON public.flashcards(deck_id);

-- ============================================
-- Table: quizzes
-- ============================================
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  question_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quizzes_user_id ON public.quizzes(user_id);
CREATE INDEX idx_quizzes_document_id ON public.quizzes(document_id);

-- ============================================
-- Table: quiz_questions
-- ============================================
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer_index INTEGER NOT NULL CHECK (correct_answer_index >= 0 AND correct_answer_index <= 3),
  explanation TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);

-- ============================================
-- Table: quiz_attempts
-- ============================================
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  time_taken_seconds INTEGER,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);

-- ============================================
-- Table: study_progress
-- Tracks per-card spaced repetition state
-- ============================================
CREATE TABLE public.study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  ease_factor DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 1,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMPTZ,
  UNIQUE(user_id, flashcard_id)
);

CREATE INDEX idx_study_progress_user_id ON public.study_progress(user_id);
CREATE INDEX idx_study_progress_next_review ON public.study_progress(next_review_at);

-- ============================================
-- Supabase Storage: pdf-uploads bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pdf-uploads',
  'pdf-uploads',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;
-- FILE: supabase/migrations/002_rls_policies.sql

-- ============================================
-- Enable RLS on all tables
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- profiles policies
-- Users can SELECT and UPDATE only their own row
-- ============================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- documents policies
-- Users can CRUD only their own documents
-- ============================================
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- decks policies
-- Users can manage own decks. Public decks readable by all.
-- ============================================
CREATE POLICY "Users can view own decks"
  ON public.decks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public decks"
  ON public.decks FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own decks"
  ON public.decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own decks"
  ON public.decks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own decks"
  ON public.decks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- flashcards policies
-- Users can access cards from their own decks. Public deck cards readable by all.
-- ============================================
CREATE POLICY "Users can view own flashcards"
  ON public.flashcards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = flashcards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view public deck flashcards"
  ON public.flashcards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = flashcards.deck_id
      AND decks.is_public = true
    )
  );

CREATE POLICY "Users can insert flashcards to own decks"
  ON public.flashcards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = flashcards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update flashcards in own decks"
  ON public.flashcards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = flashcards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete flashcards from own decks"
  ON public.flashcards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = flashcards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- ============================================
-- quizzes policies
-- Users can manage their own quizzes
-- ============================================
CREATE POLICY "Users can view own quizzes"
  ON public.quizzes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quizzes"
  ON public.quizzes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quizzes"
  ON public.quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- quiz_questions policies
-- Users can manage questions for their own quizzes
-- ============================================
CREATE POLICY "Users can view own quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert quiz questions"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own quiz questions"
  ON public.quiz_questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

-- ============================================
-- quiz_attempts policies
-- Users can only read/insert their own attempts
-- ============================================
CREATE POLICY "Users can view own attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- study_progress policies
-- Users can only read/insert/update their own progress
-- ============================================
CREATE POLICY "Users can view own study progress"
  ON public.study_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study progress"
  ON public.study_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study progress"
  ON public.study_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Storage policies for pdf-uploads bucket
-- ============================================
CREATE POLICY "Users can upload their own PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pdf-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read their own PDFs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pdf-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own PDFs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pdf-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
-- FILE: supabase/migrations/003_triggers.sql

-- ============================================
-- Trigger 1: Auto-create profile on auth.users INSERT
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Trigger 2: Increment decks.card_count on flashcards INSERT
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_flashcard_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.decks
  SET card_count = card_count + 1
  WHERE id = NEW.deck_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_flashcard_inserted
  AFTER INSERT ON public.flashcards
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_flashcard_insert();

-- ============================================
-- Trigger 3: Decrement decks.card_count on flashcards DELETE
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_flashcard_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.decks
  SET card_count = GREATEST(card_count - 1, 0)
  WHERE id = OLD.deck_id;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_flashcard_deleted
  AFTER DELETE ON public.flashcards
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_flashcard_delete();

-- ============================================
-- Trigger 4: Update documents.updated_at on status change to 'completed'
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_document_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_document_completed
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_document_completed();
