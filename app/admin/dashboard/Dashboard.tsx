"use client";

import {
  BookOpen,
  FileQuestion,
  GraduationCap,
  Layers,
  ListChecks,
  Users,
  Trophy,
  CreditCard,
  TrendingUp,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRedirect } from "react-admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const statsConfig = [
  { key: "courses", resource: "courses", label: "Cursos", icon: GraduationCap, color: "from-indigo-500 to-purple-600" },
  { key: "units", resource: "units", label: "Unidades", icon: Layers, color: "from-emerald-500 to-teal-600" },
  { key: "lessons", resource: "lessons", label: "Aulas", icon: BookOpen, color: "from-blue-500 to-cyan-600" },
  { key: "challenges", resource: "challenges", label: "Questões", icon: FileQuestion, color: "from-orange-500 to-red-600" },
  { key: "challengeOptions", resource: "challengeOptions", label: "Opções", icon: ListChecks, color: "from-pink-500 to-rose-600" },
  { key: "users", resource: "userProgress", label: "Usuários", icon: Users, color: "from-violet-500 to-purple-600" },
  { key: "progress", resource: "challengeProgress", label: "Progressos", icon: Trophy, color: "from-amber-500 to-yellow-600" },
  { key: "subscriptions", resource: "userSubscription", label: "Assinaturas", icon: CreditCard, color: "from-sky-500 to-indigo-600" },
];

const mascotPhrases = [
  "Pronto para gerenciar o conteúdo? 🦉",
  "Organizando o conhecimento! 📚",
  "Vamos turbinar os estudos! 🚀",
  "Educação que transforma! ✨",
  "Cada questão importa! 🎯",
  "Aprovados começam aqui! 🏆",
];

export const Dashboard = () => {
  const redirect = useRedirect();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resources = ["courses", "units", "lessons", "challenges", "challengeOptions", "userProgress", "challengeProgress", "userSubscription"];
        const results = await Promise.all(
          resources.map(async (r) => {
            const res = await fetch(`/api/${r}`);
            const data = await res.json();
            return { key: r, count: Array.isArray(data) ? data.length : 1 };
          })
        );
        const map: Record<string, number> = {};
        results.forEach((r) => {
          const keyMap: Record<string, string> = {
            courses: "courses",
            units: "units",
            lessons: "lessons",
            challenges: "challenges",
            challengeOptions: "challengeOptions",
            userProgress: "users",
            challengeProgress: "progress",
            userSubscription: "subscriptions",
          };
          map[keyMap[r.key]] = r.count;
        });
        setStats(map);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const phrase = mascotPhrases[Math.floor(Math.random() * mascotPhrases.length)];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-emerald-500/5 to-transparent border border-border/50">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-emerald-400 flex items-center justify-center shadow-lg animate-pulse">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 text-xl">🦉</span>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-foreground">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            {phrase}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Target className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Gestão Completa
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          const count = stats[stat.key] ?? 0;
          return (
            <Card
              key={stat.key}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden cursor-pointer"
              onClick={() => redirect("list", stat.resource)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-extrabold text-foreground">
                    {count}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  total cadastrado
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 border-dashed">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg">
              <FileQuestion className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                Bem-vindo ao painel de gestão
              </h3>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Utilize o menu lateral para navegar entre os recursos. 
                Você pode criar, editar e gerenciar cursos, unidades, aulas, 
                questões e opções. Acompanhe o progresso dos usuários e 
                gerencie assinaturas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
