import { createServerClient } from "@supabase/ssr";

export interface SyncAuthUser {
  userId: string;
  email: string;
}

export async function getSyncUser(req: Request): Promise<SyncAuthUser | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  if (!token) return null;

  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authUrl = process.env.SUPABASE_URL || "http://auth:9999";

  if (!key) return null;

  const supabase = createServerClient(authUrl, key, {
    // @ts-expect-error - auth.url não está no tipo público
    auth: { url: authUrl },
    cookies: {
      get() {
        return undefined;
      },
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return {
    userId: data.user.id,
    email: data.user.email || "",
  };
}

export function jsonError(message: string, status: number = 401) {
  return Response.json({ error: message }, { status });
}
