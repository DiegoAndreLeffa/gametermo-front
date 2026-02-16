"use client";

import { GameInterface } from "@/components/game/game-interface";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function TimeAttackPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-4 pt-10 relative">
      <div className="absolute top-20 right-4 md:right-10 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.location.reload()}
          className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
        >
          <RefreshCw className="w-4 h-4 text-zinc-400" />
        </Button>
      </div>

      <GameInterface
        startEndpoint="/gameplay/time-attack/lol/start"
        title="Time Attack (2 Min)"
      />
    </div>
  );
}
