/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trophy, Timer, Medal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Player {
  _id: string;
  nickname: string;
  points?: number;
  score?: number;
  timeRemaining?: number;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("global");

  useEffect(() => {
    setLoading(true);
    const endpoint =
      activeTab === "global"
        ? "/leaderboard/global"
        : "/leaderboard/time-attack";

    api
      .get(endpoint)
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const formatTime = (seconds: number) => {
    if (seconds === undefined || seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const renderList = (themeColor: string) => {
    if (loading)
      return (
        <div className="text-center py-10 text-zinc-500">Carregando...</div>
      );
    if (players.length === 0)
      return (
        <div className="text-center py-10 text-zinc-500">Nenhum registro.</div>
      );

    return (
      <div className="space-y-2 animate-in fade-in duration-500">
        {players.map((player, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 hover:border-${themeColor}-500/30 transition-colors group`}
          >
            <div className="flex items-center gap-4">
              {/* Posição e Avatar (Manteve igual) */}
              <div
                className={`font-bold text-lg w-8 text-center flex justify-center ${index < 3 ? `text-${themeColor}-400` : "text-zinc-500"}`}
              >
                {index === 0 ? (
                  <Medal className={`w-6 h-6 text-${themeColor}-500`} />
                ) : (
                  `#${index + 1}`
                )}
              </div>
              <Avatar
                className={`border-2 border-transparent group-hover:border-${themeColor}-500/50 transition-colors`}
              >
                <AvatarFallback>
                  {player.nickname[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-lg text-zinc-200">
                  {player.nickname}
                </span>
                {index === 0 && (
                  <span
                    className={`text-[10px] text-${themeColor}-500 font-bold uppercase`}
                  >
                    Lenda Viva
                  </span>
                )}
              </div>
            </div>

            {/* PONTUAÇÃO E TEMPO */}
            <div className="text-right">
              <div
                className={`font-mono font-bold text-xl text-${themeColor}-400`}
              >
                {player.points || player.score} pts
              </div>

              {/* SÓ MOSTRA O TEMPO SE FOR A ABA TIME ATTACK E TIVER DADOS */}
              {activeTab === "time-attack" && (
                <div className="text-xs text-zinc-500 font-mono flex items-center justify-end gap-1">
                  <Timer className="w-3 h-3" />
                  Sobrou: {formatTime(player.timeRemaining || 0)}s
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-red-500 inline-block">
            Hall da Fama
          </h1>
          <p className="text-zinc-400 mt-2">
            Veja quem são os melhores invocadores de Runeterra.
          </p>
        </div>

        {/* Abas de Navegação */}
        <Tabs
          defaultValue="global"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800">
            <TabsTrigger
              value="global"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold"
            >
              <Trophy className="w-4 h-4 mr-2" /> Global (Diário)
            </TabsTrigger>
            <TabsTrigger
              value="time-attack"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-bold"
            >
              <Timer className="w-4 h-4 mr-2" /> Time Attack
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo Aba Global */}
          <TabsContent value="global" className="mt-6">
            <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 border-t-4 border-t-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Trophy className="w-5 h-5" /> Ranking Acumulado
                  </div>
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500/20"
                  >
                    Top 100
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Soma de pontos de todos os desafios diários.
                </CardDescription>
              </CardHeader>
              <CardContent>{renderList("yellow")}</CardContent>
            </Card>
          </TabsContent>

          {/* Conteúdo Aba Time Attack */}
          <TabsContent value="time-attack" className="mt-6">
            <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 border-t-4 border-t-red-600">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-500">
                    <Timer className="w-5 h-5" /> Ranking Speedrun
                  </div>
                  <Badge
                    variant="outline"
                    className="text-red-500 border-red-500/20"
                  >
                    Recordes
                  </Badge>
                </CardTitle>
                <CardDescription>
                  As pontuações mais altas em uma única partida cronometrada.
                </CardDescription>
              </CardHeader>
              <CardContent>{renderList("red")}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
