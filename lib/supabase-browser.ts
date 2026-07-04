import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabaseClient() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatório");
  }

  const authUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth`;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000",
    key,
    {
      // @ts-expect-error - auth.url não está no tipo público, mas é suportado internamente
      auth: { url: authUrl },
    }
  );
}
