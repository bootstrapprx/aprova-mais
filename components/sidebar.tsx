"use client";

import { Loader, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useSupabase } from "@/components/supabase-provider";

import { SidebarItem } from "./sidebar-item";

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  const { user, loading, supabase } = useSupabase();

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
  };

  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]",
        className
      )}
    >
      <Link href="/learn">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <Image src="/mascot.svg" alt="Mascot" height={40} width={40} />

          <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
            Aprova+
          </h1>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="Estudar" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem
          label="Ranking"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem label="Metas" href="/quests" iconSrc="/quests.svg" />
        <SidebarItem label="Loja" href="/shop" iconSrc="/shop.svg" />
      </div>

      <div className="p-4">
        {loading && (
          <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
        )}

        {!loading && user && (
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-x-2 rounded-lg p-2 text-neutral-600 transition hover:bg-neutral-100"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        )}
      </div>
    </div>
  );
};
