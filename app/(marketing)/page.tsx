"use client";

import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/supabase-provider";

export default function MarketingPage() {
  const { user, loading } = useSupabase();

  return (
    <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 p-4 lg:flex-row">
      <div className="relative mb-8 h-[240px] w-[240px] lg:mb-0 lg:h-[424px] lg:w-[424px]">
        <Image src="/hero.svg" alt="Hero" fill />
      </div>

      <div className="flex flex-col items-center gap-y-8">
        <h1 className="max-w-[480px] text-center text-xl font-bold text-neutral-600 lg:text-3xl">
          Estude para concursos públicos, pratique com simulados e conquiste sua
          aprovação.
        </h1>

        <div className="flex w-full max-w-[330px] flex-col items-center gap-y-3">
          {loading && (
            <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
          )}

          {!loading && user && (
            <Button size="lg" variant="secondary" className="w-full" asChild>
              <Link href="/learn">Continuar Estudando</Link>
            </Button>
          )}

          {!loading && !user && (
            <>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link href="/sign-up">Começar Agora</Link>
              </Button>

              <Button
                size="lg"
                variant="primaryOutline"
                className="w-full"
                asChild
              >
                <Link href="/sign-in">Já tenho uma conta</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
