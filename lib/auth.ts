import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '');

export async function getSupabaseAuthToken(): Promise<string | undefined> {
  const authTokenResponse = await supabase.auth.signInWithPassword({
    email: process.env.USER_EMAIL ?? '',
    password: process.env.USER_PASSWORD ?? '',
  });

  if (authTokenResponse.error) {
    console.error('Supabase sign-in failed:', authTokenResponse.error.message);
    return undefined;
  }

  return authTokenResponse.data.session?.access_token;
}