import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authUrl = process.env.SUPABASE_URL || "http://auth:9999";

  if (!key) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const supabase = createServerClient(authUrl, key, {
    // @ts-expect-error - auth.url
    auth: { url: authUrl },
    cookies: {
      get() {
        return undefined;
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message || "Authentication failed" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    token: data.session.access_token,
    userId: data.user.id,
    expiresAt: data.session.expires_at,
  });
}
