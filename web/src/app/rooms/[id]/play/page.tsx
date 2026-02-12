"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { GameInterface } from "@/components/game/game-interface";

export default function RoomGamePage() {
  const { id } = useParams();
  const [roomCode, setRoomCode] = useState<string | null>(null);

  useEffect(() => {
    // Busca o código da sala usando o ID
    api.get(`/rooms/${id}`).then((res) => setRoomCode(res.data.code));
  }, [id]);

  if (!roomCode)
    return (
      <div className="text-white text-center p-10">Carregando Sala...</div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 p-4 pt-10">
      <GameInterface
        startEndpoint={`/gameplay/room/${roomCode}/start`}
        title={`Desafio da Sala: ${roomCode}`}
      />
    </div>
  );
}
