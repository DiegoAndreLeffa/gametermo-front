"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface Player {
  _id: string;
  nickname: string;
  avatar: string;
  points: number;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/leaderboard/global")
      .then((res) => setPlayers(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-500 text-2xl">
              <Trophy /> Ranking Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10 text-zinc-500">
                Carregando os melhores...
              </div>
            ) : (
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={player._id}
                    className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-bold text-lg w-8 text-center ${index < 3 ? "text-yellow-400" : "text-zinc-500"}`}
                      >
                        #{index + 1}
                      </span>
                      <Avatar>
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback>{player.nickname[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-lg">
                        {player.nickname}
                      </span>
                    </div>
                    <div className="font-mono text-blue-400 font-bold">
                      {player.points} pts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
