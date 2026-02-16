"use client";

import { GameInterface } from "@/components/game/game-interface";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function InfiniteGamePage() {
  // Função para recarregar a página e iniciar novo jogo quando ganhar
  // O componente GameInterface já tem um botão de "Tentar Novamente" no derrota,
  // mas no vitória ele mostra o campeão.
  // Vamos deixar o fluxo natural: O usuário clica em "Modo Infinito" na navbar para jogar outro.

  return (
    <div className="min-h-screen bg-zinc-950 p-4 pt-10 relative">
      {/* Botão Flutuante para Resetar Rápido (Opcional, mas útil no infinito) */}
      <div className="absolute top-20 right-4 md:right-10 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.location.reload()}
          title="Pular / Novo Jogo"
          className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
        >
          <RefreshCw className="w-4 h-4 text-zinc-400" />
        </Button>
      </div>

      <GameInterface
        startEndpoint="/gameplay/infinite/lol/start"
        title="Modo Infinito (Treino)"
      />
    </div>
  );
}
