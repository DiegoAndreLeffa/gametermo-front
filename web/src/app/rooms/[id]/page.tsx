/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Copy, Play } from "lucide-react";
import { toast } from "sonner";

export default function RoomLobby() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    // Carrega detalhes da sala
    api
      .get(`/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch(() => router.push("/rooms"));
  }, [id, router]);

  const copyCode = () => {
    navigator.clipboard.writeText(room.code);
    toast.success("Código copiado!");
  };

  const startGame = () => {
    // Redireciona para a página de jogo da sala
    router.push(`/rooms/${id}/play`);
  };

  if (!room)
    return (
      <div className="p-10 text-center text-white">Carregando Lobby...</div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header da Sala */}
        <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-white">{room.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-zinc-400">Código:</span>
              <code className="bg-zinc-950 px-2 py-1 rounded text-blue-400 font-mono text-xl tracking-widest">
                {room.code}
              </code>
              <Button size="icon" variant="ghost" onClick={copyCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={startGame}
          >
            <Play className="mr-2 w-5 h-5" /> JOGAR HOJE
          </Button>
        </div>

        {/* Lista de Membros */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Membros ({room.members.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {room.members.map((member: any) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800"
              >
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.nickname[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium truncate">{member.nickname}</span>
                {room.owner === member._id && (
                  <span className="text-xs text-yellow-500 ml-auto">DONO</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
