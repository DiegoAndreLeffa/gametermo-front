/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/store/use-auth";
import { ChampionSearch } from "@/components/game/champion-search";
import { AttributeCell } from "@/components/game/attribute-cell";

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center p-4">
      <header className="w-full max-w-5xl flex justify-between items-center mb-8 py-4 border-b border-zinc-800">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
          Loldle Clone
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            Olá,{" "}
            <span className="font-bold text-blue-400">{user?.nickname}</span>
          </div>
        </div>
      </header>

      <div className="w-full max-w-md mb-8">
        {game?.status === "WON" ? (
          <div className="bg-green-900/30 border border-green-500 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-2">GG WP!</h2>
            <p>Você acertou o campeão de hoje.</p>
            <p className="text-sm text-zinc-400 mt-2">
              Volte amanhã para mais.
            </p>
          </div>
        ) : (
          <ChampionSearch
            champions={champions}
            onSelect={handleGuess}
            disabled={game?.status !== "PLAYING"}
          />
        )}
      </div>

      <div className="w-full max-w-6xl overflow-x-auto pb-10">
        {game?.history.length! > 0 && (
          <div className="flex gap-2 min-w-max mb-2 justify-center font-bold text-zinc-500 text-sm uppercase tracking-wider">
            <div className="w-20 md:w-24 text-center">Champion</div>
            <div className="w-20 md:w-24 text-center">Gender</div>
            <div className="w-20 md:w-24 text-center">Position</div>
            <div className="w-20 md:w-24 text-center">Species</div>
            <div className="w-20 md:w-24 text-center">Resource</div>
            <div className="w-20 md:w-24 text-center">Range</div>
            <div className="w-20 md:w-24 text-center">Region</div>
            <div className="w-20 md:w-24 text-center">Year</div>
          </div>
        )}

        {/* Linhas de Tentativas */}
        <div className="flex flex-col gap-2 min-w-max items-center">
          {game?.history.map((turn, index) => (
            <div key={index} className="flex gap-2">
              {/* Foto do Campeão */}
              <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-zinc-700 rounded-md overflow-hidden bg-zinc-900">
                <img
                  src={turn.guessedEntity.imageUrl}
                  alt={turn.guessedEntity.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Atributos (Gênero, Posição, etc) */}
              {/* Nota: A ordem aqui DEVE bater com o header acima. 
                  O Backend retorna um array 'results', precisamos garantir a ordem ou mapear pelo nome.
                  O Backend retorna na ordem das Keys do Theme. 
                  Vamos assumir que o Theme LoL foi criado na ordem correta.
              */}
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
