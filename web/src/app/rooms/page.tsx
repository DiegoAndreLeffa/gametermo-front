/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, Plus, Users, Crown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/store/use-auth";

interface Room {
  _id: string;
  name: string;
  code: string;
  owner: { _id: string; nickname: string };
  members: string[];
}

export default function RoomsHub() {
  const { user } = useAuth();
  const router = useRouter();
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [joinCode, setJoinCode] = useState("");
  const [createName, setCreateName] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/mine");
        setMyRooms(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleCreate = async () => {
    if (!createName.trim()) return;
    try {
      const res = await api.post("/rooms", {
        name: createName,
        themeSlug: "lol",
      });
      toast.success("Sala criada!");
      router.push(`/rooms/${res.data._id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao criar sala";
      toast.error(message);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    try {
      const res = await api.post("/rooms/join", {
        code: joinCode.toUpperCase(),
      });
      toast.success("Você entrou na sala!");
      router.push(`/rooms/${res.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Sala não encontrada");
    }
  };

  const goToRoom = (id: string) => router.push(`/rooms/${id}`);

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
      <div className="w-full md:w-1/3 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Social</h1>
          <p className="text-zinc-400">
            Jogue com amigos e suba no ranking privado.
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardContent className="p-6">
            <Tabs defaultValue="join" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-950 mb-6">
                <TabsTrigger value="join">Entrar</TabsTrigger>
                <TabsTrigger value="create">Criar Nova</TabsTrigger>
              </TabsList>

              <TabsContent value="join" className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Código (Ex: X7Z9)"
                    className="bg-zinc-800 border-zinc-700 uppercase tracking-widest text-center h-12 text-lg"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    maxLength={4}
                  />
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                    onClick={handleJoin}
                  >
                    <LogIn className="w-4 h-4 mr-2" /> Entrar na Sala
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="create" className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Nome da Sala"
                    className="bg-zinc-800 border-zinc-700 h-12"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                  />
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 h-12"
                    onClick={handleCreate}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Criar Sala
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* DIREITA: Minhas Salas */}
      <div className="w-full md:w-2/3">
        <h2 className="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" /> Minhas Salas
        </h2>

        {loading ? (
          <div className="text-zinc-500">Carregando salas...</div>
        ) : myRooms.length === 0 ? (
          <Card className="bg-zinc-900/50 border-zinc-800 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <Users className="w-12 h-12 mb-4 opacity-50" />
              <p>Você ainda não participa de nenhuma sala.</p>
              <p className="text-sm">
                Crie uma ou entre com um código ao lado.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {myRooms.map((room) => (
              <Card
                key={room._id}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-600 transition-colors cursor-pointer group"
                onClick={() => goToRoom(room._id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold truncate pr-2">
                      {room.name}
                    </CardTitle>
                    {room.owner._id === user?.id && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-900/30 text-yellow-500 border-yellow-700/50 text-xs"
                      >
                        <Crown className="w-3 h-3 mr-1" /> DONO
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="font-mono text-zinc-500 text-xs">
                    CÓDIGO: <span className="text-blue-400">{room.code}</span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between items-center text-sm text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{room.members.length} membros</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
