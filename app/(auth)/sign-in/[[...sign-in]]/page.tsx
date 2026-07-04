"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/learn");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-y-6">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Entrar
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg border-2 border-border bg-background p-3 text-foreground outline-none focus:border-green-500 dark:focus:border-green-400"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg border-2 border-border bg-background p-3 text-foreground outline-none focus:border-green-500 dark:focus:border-green-400"
        />

        {error && (
          <p className="text-center text-sm text-rose-500">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          variant="secondary"
          className="w-full"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link href="/sign-up" className="font-bold text-green-600 hover:underline dark:text-green-400">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
