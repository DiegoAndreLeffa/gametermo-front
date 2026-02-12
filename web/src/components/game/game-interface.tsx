/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ChampionSearch } from "@/components/game/champion-search";
import { AttributeCell } from "@/components/game/attribute-cell";

interface GameInterfaceProps {
  startEndpoint: string;
  title: string;
}

export function GameInterface({ startEndpoint, title }: GameInterfaceProps) {
  const [loading, setLoading] = useState(true);
  const [champions, setChampions] = useState<any[]>([]);
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    const initGame = async () => {
      try {
        // Carrega campeões
        const champsRes = await api.get("/content/lol/entities");
        const formattedChamps = champsRes.data.map((c: any) => ({
          id: c._id,
          name: c.name,
          imageUrl: c.imageUrl,
        }));
        setChampions(formattedChamps);

        // Inicia Sessão (usa o endpoint dinâmico)
        const sessionRes = await api.post(startEndpoint);
        setGame({
          sessionId: sessionRes.data.sessionId,
          status: sessionRes.data.status,
          history: sessionRes.data.history,
        });
      } catch (error) {
        toast.error("Erro ao iniciar jogo.");
      } finally {
        setLoading(false);
      }
    };

    initGame();
  }, [startEndpoint]);

  const handleGuess = async (championName: string) => {
    if (!game) return;
    try {
      const res = await api.post(`/gameplay/${game.sessionId}/guess`, {
        guess: championName,
      });
      const newTurn = res.data.turnResult;
      const newStatus = res.data.gameStatus;

      setGame((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          status: newStatus,
          history: [newTurn, ...prev.history],
        };
      });

      if (newStatus === "WON") toast.success("Parabéns! Você acertou! 🎉");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro no chute");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-white">Invocando campeões...</div>
    );

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
        {title}
      </h1>

      <div className="w-full max-w-md mb-8">
        {game?.status === "WON" ? (
          <div className="bg-green-900/30 border border-green-500 p-6 rounded-lg text-center text-white">
            <h2 className="text-2xl font-bold text-green-400 mb-2">Vitória!</h2>
            <p>Você completou o desafio.</p>
          </div>
        ) : (
          <ChampionSearch
            champions={champions}
            onSelect={handleGuess}
            disabled={game?.status !== "PLAYING"}
          />
        )}
      </div>

      <div className="w-full overflow-x-auto pb-10">
        <div className="flex flex-col gap-2 min-w-max items-center">
          {game?.history.map((turn: any, index: number) => (
            <div key={index} className="flex gap-2">
              <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-zinc-700 rounded-md overflow-hidden bg-zinc-900">
                <img
                  src={turn.guessedEntity.imageUrl}
                  alt={turn.guessedEntity.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {turn.results.map((attr: any, i: number) => (
                <AttributeCell
                  key={i}
                  value={attr.value}
                  status={attr.status}
                  direction={attr.direction}
                  delay={i * 0.1}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
