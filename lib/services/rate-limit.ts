// FILE: lib/services/rate-limit.ts

import { createAdminClient } from "@/lib/supabase/admin";

const FREE_DAILY_LIMIT = 5;

export class RateLimitService {
  /**
   * Checks if user has credits remaining and increments usage.
   * Free plan: 5 documents/day. Pro: unlimited.
   * Resets daily_credits_used if last_credit_reset was yesterday or earlier.
   * Throws 429 error if over limit.
   */
  static async checkAndIncrement(userId: string): Promise<void> {
    const supabase = createAdminClient();

    // Fetch user profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("plan, daily_credits_used, last_credit_reset")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      throw new Error("Failed to fetch user profile for rate limiting.");
    }

    // Pro users have unlimited access
    if (profile.plan === "pro") {
      await this.incrementCredits(userId);
      return;
    }

    // Check if we need to reset the daily counter
    const lastReset = new Date(profile.last_credit_reset);
    const now = new Date();
    const isNewDay =
      lastReset.toDateString() !== now.toDateString();

    if (isNewDay) {
      // Reset the counter
      const { error: resetError } = await supabase
        .from("profiles")
        .update({
          daily_credits_used: 1,
          last_credit_reset: now.toISOString(),
        })
        .eq("id", userId);

      if (resetError) {
        throw new Error("Failed to reset daily credits.");
      }
      return;
    }

    // Check if over limit
    if (profile.daily_credits_used >= FREE_DAILY_LIMIT) {
      throw new RateLimitError(
        `Daily limit of ${FREE_DAILY_LIMIT} documents reached. Upgrade to Pro for unlimited access.`
      );
    }

    // Increment credits
    await this.incrementCredits(userId);
  }

  private static async incrementCredits(userId: string): Promise<void> {
    const supabase = createAdminClient();

    const { error } = await supabase.rpc("increment_credits" as never, {
      user_id: userId,
    } as never);

    // Fallback: if RPC doesn't exist, do manual increment
    if (error) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_credits_used")
        .eq("id", userId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            daily_credits_used: profile.daily_credits_used + 1,
          })
          .eq("id", userId);
      }
    }
  }

  /**
   * Returns remaining credits for the user
   */
  static async getRemainingCredits(userId: string): Promise<number> {
    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, daily_credits_used, last_credit_reset")
      .eq("id", userId)
      .single();

    if (!profile) return 0;
    if (profile.plan === "pro") return Infinity;

    const lastReset = new Date(profile.last_credit_reset);
    const now = new Date();
    const isNewDay = lastReset.toDateString() !== now.toDateString();

    if (isNewDay) return FREE_DAILY_LIMIT;

    return Math.max(0, FREE_DAILY_LIMIT - profile.daily_credits_used);
  }
}

export class RateLimitError extends Error {
  statusCode = 429;

  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}
