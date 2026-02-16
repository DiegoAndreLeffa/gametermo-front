"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface GameTimerProps {
  expiresAt: string; // Data ISO vinda do backend
  onExpire: () => void; // Função para chamar quando acabar visualmente
  stop: boolean; // Para parar o relógio se ganhar antes
}

export function GameTimer({ expiresAt, onExpire, stop }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stop) return;

      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const diff = Math.floor((end - now) / 1000);

      if (diff <= 0) {
        setTimeLeft(0);
        onExpire();
        clearInterval(interval);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire, stop]);

  // Formata MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Cores de alerta (Amarelo < 30s, Vermelho < 10s)
  let colorClass = "text-blue-400 border-blue-500/30 bg-blue-500/10";
  if (timeLeft < 30)
    colorClass =
      "text-yellow-400 border-yellow-500/30 bg-yellow-500/10 animate-pulse";
  if (timeLeft < 10)
    colorClass = "text-red-500 border-red-500/30 bg-red-500/10 animate-ping";

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-xl font-bold ${colorClass}`}
    >
      <Timer className="w-5 h-5" />
      {formatted}
    </div>
  );
}
