import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) return null;

  const cookieStore = await cookies();

  // Use localhost so auth requests go through Next.js rewrites,
  // which strip /auth/v1 prefix and forward to http://auth:9999/user
  const authUrl = `http://localhost:${process.env.PORT || 3000}`;

  // Derive the storage key from the public supabase URL so it matches
  // what the browser client uses (sb-<project-ref>-auth-token)
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || authUrl;
  const projectRef = new URL(publicUrl).hostname.split(".")[0];
  const storageKey = `sb-${projectRef}-auth-token`;

  return createServerClient(authUrl, key, {
    cookieOptions: { name: storageKey },
    // @ts-expect-error - auth.url não está no tipo público, mas é suportado internamente
    auth: { url: authUrl },
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
