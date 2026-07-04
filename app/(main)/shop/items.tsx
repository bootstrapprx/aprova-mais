"use client";

import { useTransition } from "react";

import Image from "next/image";
import { toast } from "sonner";

import { createStripeUrl } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";

type ItemsProps = {
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({
  points,
  hasActiveSubscription,
}: ItemsProps) => {
  const [pending, startTransition] = useTransition();

  const onUpgrade = () => {
    toast.loading("Redirecionando...");
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if (response.data) window.location.href = response.data;
        })
        .catch(() => toast.error("Algo deu errado."));
    });
  };

  return (
    <ul className="w-full">
      <div className="flex w-full items-center gap-x-4 border-t-2 p-4 pt-8">
        <Image src="/unlimited.svg" alt="Unlimited" height={60} width={60} />

        <div className="flex-1">
          <p className="text-base font-bold text-foreground lg:text-xl">
            Aprova+ Pro
          </p>
          <p className="text-sm text-muted-foreground">Em breve</p>
        </div>

        <Button onClick={onUpgrade} disabled={true} aria-disabled={true}>
          {hasActiveSubscription ? "configurações" : "indisponível"}
        </Button>
      </div>
    </ul>
  );
};
