"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/auth/register", formData);

      toast.success("Conta criada com sucesso!");
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao criar conta";
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-500">
            Crie sua conta
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Comece sua jornada no ranking global
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                name="nickname"
                placeholder="Faker"
                required
                className="bg-zinc-800 border-zinc-700"
                value={formData.nickname}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="bg-zinc-800 border-zinc-700"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-zinc-800 border-zinc-700"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Registrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-zinc-400">
            Já tem conta?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
