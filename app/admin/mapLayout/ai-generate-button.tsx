"use client";

import { useState } from "react";
import { useNotify, useRefresh } from "react-admin";
import { Loader2, Sparkles } from "lucide-react";

interface AiGenerateButtonProps {
  courseId: number;
  courseName: string;
  units: Array<{
    name: string;
    lessons: Array<{ name: string }>;
  }>;
  onSuccess?: (layout: Record<string, unknown>) => void;
}

export function AiGenerateButton({
  courseId,
  courseName,
  units,
  onSuccess,
}: AiGenerateButtonProps) {
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();

  const handleGenerate = async () => {
    if (!units.length) {
      notify("Adicione unidades antes de gerar o mapa", { type: "warning" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mapLayouts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, courseName, units }),
      });

      const data = await res.json();

      if (!res.ok) {
        notify(`Erro: ${data.error || "Falha ao gerar mapa"}`, {
          type: "error",
        });
        return;
      }

      await fetch(`/api/mapLayouts/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      notify("Mapa gerado com sucesso!", { type: "success" });
      refresh();
      onSuccess?.(data);
    } catch (err) {
      notify(`Erro de rede: ${String(err)}`, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {loading ? "Gerando mapa..." : "Gerar Mapa com IA"}
    </button>
  );
}
