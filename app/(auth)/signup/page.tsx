// FILE: app/(auth)/signup/page.tsx
"use client";

export const runtime = "edge";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-12 w-12" />
            <span className="text-3xl font-bold">EduCard AI</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Start learning smarter today
          </h1>
          <p className="text-lg opacity-90">
            Create your free account and transform any video or document into
            interactive study material.
          </p>
          <div className="mt-8 space-y-3 text-sm opacity-80">
            <p>✓ 5 free documents per day</p>
            <p>✓ AI-generated flashcards & quizzes</p>
            <p>✓ Spaced repetition study mode</p>
            <p>✓ Share decks with anyone</p>
          </div>
        </div>
      </div>

      {/* Right side - auth form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EduCard AI</span>
          </div>

          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-muted-foreground mb-6">
            Sign up to start creating flashcards and quizzes
          </p>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(221.2, 83.2%, 53.3%)",
                    brandAccent: "hsl(217.2, 91.2%, 59.8%)",
                  },
                },
              },
              className: {
                button: "!rounded-lg !font-medium",
                input: "!rounded-lg",
                label: "!text-foreground",
                anchor: "!text-primary",
              },
            }}
            theme={resolvedTheme === "dark" ? "dark" : "default"}
            providers={[]}
            redirectTo={`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`}
            view="sign_up"
            showLinks={false}
          />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
