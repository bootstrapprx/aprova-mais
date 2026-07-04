"use client";

import { useState } from "react";

import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Banner from "@/components/banner";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/supabase-provider";
import { links } from "@/config";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { user, loading, supabase } = useSupabase();
  const [hideBanner, setHideBanner] = useState(true);

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
  };

  return (
    <>
      <Banner hide={hideBanner} setHide={setHideBanner} />

      <header
        className={cn(
          "h-20 w-full border-b-2 border-border px-4",
          !hideBanner ? "mt-20 sm:mt-16 lg:mt-10" : "mt-0"
        )}
      >
        <div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
          <Link href="/" className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
            <Image src="/mascot.svg" alt="Mascot" height={40} width={40} />

            <h1 className="text-2xl font-extrabold tracking-wide text-green-600 dark:text-green-400">
              Aprova+
            </h1>
          </Link>

          <div className="flex gap-x-3">
            {loading && (
              <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
            )}

            {!loading && !user && (
              <Link href="/sign-in">
                <Button size="lg" variant="ghost">
                  Entrar
                </Button>
              </Link>
            )}

            {!loading && user && (
              <Button
                size="lg"
                variant="ghost"
                onClick={handleSignOut}
              >
                Sair
              </Button>
            )}

            <Link
              href={links.sourceCode}
              target="_blank"
              rel="noreferrer noopener"
              className={user ? "pt-1.5" : "pt-3"}
            >
              <Image
                src="/github.svg"
                alt="Source Code"
                height={20}
                width={20}
              />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
