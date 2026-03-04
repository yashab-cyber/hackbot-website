import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use in Server Components and Route Handlers.
 * Uses the anon key for public access with RLS.
 */
export function createClient() {
  return supabaseCreateClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Alias for Route Handlers — uses the same client configuration.
 */
export function createRouteClient() {
  return supabaseCreateClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
