import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  const cookieStore = await cookies();

  const customFetch: typeof fetch = (input, init) => {
    if (typeof input === "string") {
      input = input.replace("/auth/v1/", "/");
    }
    return fetch(input, init);
  };

  return createServerClient(url, key, {
    global: { fetch: customFetch },
    // @ts-expect-error - auth.url não está no tipo público, mas é suportado internamente
    auth: { url },
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
    },
  });
}

export async function getServerUserId() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
