"use client";

import {
  BookOpen,
  FileQuestion,
  GraduationCap,
  Layers,
  ListChecks,
  LucideIcon,
  Users,
  Trophy,
  BarChart3,
  CreditCard,
} from "lucide-react";
import {
  Menu as RaMenu,
  useSidebarState,
  useTranslate,
} from "react-admin";

import { Button } from "@/components/ui/button";

type MenuItem = {
  name: string;
  label: string;
  icon: LucideIcon;
  children?: { name: string; label: string; icon: LucideIcon }[];
};

const menuItems: MenuItem[] = [
  {
    name: "dashboard",
    label: "Painel",
    icon: BarChart3,
  },
  {
    name: "courses",
    label: "Cursos",
    icon: GraduationCap,
  },
  {
    name: "units",
    label: "Unidades",
    icon: Layers,
  },
  {
    name: "lessons",
    label: "Aulas",
    icon: BookOpen,
  },
  {
    name: "challenges",
    label: "Questões",
    icon: FileQuestion,
  },
  {
    name: "challengeOptions",
    label: "Opções",
    icon: ListChecks,
  },
  {
    name: "userProgress",
    label: "Usuários",
    icon: Users,
  },
  {
    name: "challengeProgress",
    label: "Progresso",
    icon: Trophy,
  },
  {
    name: "userSubscription",
    label: "Assinaturas",
    icon: CreditCard,
  },
];

export const Menu = () => {
  const [open] = useSidebarState();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {open && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">Aprova Mais</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">Admin</span>
          </div>
        )}
      </div>
      <RaMenu>
        {menuItems.map((item) => (
          <RaMenu.Item
            key={item.name}
            to={item.name === "dashboard" ? "/" : `/${item.name}`}
            primaryText={item.label}
            leftIcon={<item.icon className="w-5 h-5" />}
          />
        ))}
      </RaMenu>
    </div>
  );
};
