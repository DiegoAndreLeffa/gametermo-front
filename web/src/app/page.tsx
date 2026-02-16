/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/store/use-auth";
import { ChampionSearch } from "@/components/game/champion-search";
import { AttributeCell } from "@/components/game/attribute-cell";
import { GameInterface } from "@/components/game/game-interface";

interface GameState {
  sessionId: string;
  status: "PLAYING" | "WON" | "LOST";
  history: any[];
}

interface Champion {
  id: string;
  name: string;
  imageUrl: string;
}

export default function GamePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [game, setGame] = useState<GameState | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const initGame = async () => {
      try {
        const champsRes = await api.get("/content/lol/entities");
        const formattedChamps = champsRes.data.map((c: any) => ({
          id: c._id,
          name: c.name,
          imageUrl: c.imageUrl,
        }));
        setChampions(formattedChamps);

        const sessionRes = await api.post("/gameplay/daily/lol/start");
        setGame({
          sessionId: sessionRes.data.sessionId,
          status: sessionRes.data.status,
          history: sessionRes.data.history,
        });
      } catch (error) {
        toast.error("Erro ao carregar o jogo.");
      } finally {
        setLoading(false);
      }
    };

    initGame();
  }, [user, authLoading, router]);

  const handleGuess = async (championName: string) => {
    if (!game) return;

    try {
      const res = await api.post(`/gameplay/${game.sessionId}/guess`, {
        guess: championName,
      });

      const newTurn = res.data.turnResult;
      const newStatus = res.data.gameStatus;

      setGame((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: newStatus,
          history: [newTurn, ...prev.history],
        };
      });

      if (newStatus === "WON") {
        toast.success("Parabéns! Você acertou! 🎉");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao processar chute");
    }
  };

  if (loading || authLoading)
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Carregando Summoner&rsquo;s Rift...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 p-4 pt-10">
      <GameInterface
        startEndpoint="/gameplay/daily/lol/start"
        title="Desafio Diário Global"
      />
    </div>
  );
}
