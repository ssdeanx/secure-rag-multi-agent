import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '');

const authTokenResponse = await supabase.auth.signInWithPassword({
   email: process.env.USER_EMAIL ?? '',
  password: process.env.USER_PASSWORD ?? '',
});

const accessToken = authTokenResponse.data?.session?.access_token;