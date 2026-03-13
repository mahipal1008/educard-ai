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
