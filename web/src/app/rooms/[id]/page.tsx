/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Copy, Play, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/store/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RoomLobby() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [room, setRoom] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch(() => {
        toast.error("Sala não encontrada");
        router.push("/rooms");
      });
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    api.get(`/leaderboard/room/${id}`).then((res) => setRanking(res.data));
  }, [id]);

  const copyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    toast.success("Código copiado!");
  };

  const startGame = () => {
    router.push(`/rooms/${id}/play`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Sala desfeita com sucesso.");
      router.push("/rooms");
    } catch (error) {
      toast.error("Erro ao excluir sala.");
      setIsDeleting(false);
    }
  };

  if (!room || !user)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Carregando Lobby...
      </div>
    );

  const ownerId = typeof room.owner === "string" ? room.owner : room.owner._id;
  const isOwner = ownerId === user.id;

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header da Sala */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900 p-6 rounded-xl border border-zinc-800 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{room.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-zinc-400">Código:</span>
              <code className="bg-zinc-950 px-2 py-1 rounded text-blue-400 font-mono text-xl tracking-widest border border-zinc-800">
                {room.code}
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={copyCode}
                className="h-8 w-8 text-zinc-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    title="Desfazer Sala"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Você tem certeza absoluta?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                      Essa ação não pode ser desfeita. Isso excluirá
                      permanentemente a sala
                      <span className="font-bold text-white">
                        {" "}
                        {room.name}{" "}
                      </span>
                      e removerá todos os membros dela.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white hover:text-white">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Excluindo..." : "Sim, excluir sala"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none font-bold shadow-lg shadow-green-900/20"
              onClick={startGame}
            >
              <Play className="mr-2 w-5 h-5 fill-current" /> JOGAR
            </Button>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Ranking da Temporada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ranking.length === 0 ? (
              <p className="text-zinc-500 text-sm">
                Ninguém pontuou nesta sala ainda.
              </p>
            ) : (
              ranking.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-zinc-950/50 rounded border border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold w-6 text-center ${index === 0 ? "text-yellow-400" : "text-zinc-500"}`}
                    >
                      #{index + 1}
                    </span>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{player.nickname[0]}</AvatarFallback>
                    </Avatar>
                    <span>{player.nickname}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-blue-400">
                      {player.totalScore} pts
                    </span>
                    <span className="text-xs text-zinc-500">
                      {player.wins} vitórias
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
