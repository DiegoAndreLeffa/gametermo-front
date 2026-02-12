/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RoomsHub() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [createName, setCreateName] = useState("");

  const handleCreate = async () => {
    try {
      // Hardcoded 'lol' theme for now
      const res = await api.post("/rooms", {
        name: createName,
        themeSlug: "lol",
      });
      toast.success("Sala criada!");
      router.push(`/rooms/${res.data._id}`);
    } catch (err) {
      toast.error("Erro ao criar sala");
    }
  };

  const handleJoin = async () => {
    try {
      const res = await api.post("/rooms/join", {
        code: joinCode.toUpperCase(),
      });
      router.push(`/rooms/${res.data._id}`);
    } catch (err) {
      toast.error("Sala não encontrada ou código inválido");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Salas Personalizadas</CardTitle>
          <CardDescription>
            Jogue com amigos usando um código secreto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-950">
              <TabsTrigger value="join">Entrar</TabsTrigger>
              <TabsTrigger value="create">Criar</TabsTrigger>
            </TabsList>

            <TabsContent value="join" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Input
                  placeholder="Código da Sala (Ex: X7Z9)"
                  className="bg-zinc-800 border-zinc-700 uppercase"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  maxLength={4}
                />
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleJoin}
                >
                  Entrar na Sala
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Input
                  placeholder="Nome da Sala (Ex: Galera do Discord)"
                  className="bg-zinc-800 border-zinc-700"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                />
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleCreate}
                >
                  Criar Sala
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
