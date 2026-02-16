/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface Champion {
  id: string;
  name: string;
  imageUrl: string;
}

interface ChampionGridProps {
  champions: Champion[];
  onSelect: (name: string) => void;
  disabled?: boolean;
  guessedNames: string[];
}

export function ChampionGrid({
  champions,
  onSelect,
  disabled,
  guessedNames,
}: ChampionGridProps) {
  const [search, setSearch] = useState("");

  // Filtra campeões pelo texto digitado
  const filtered = champions.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Barra de Busca (Mantém igual) */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-950 border-zinc-700 text-zinc-100 focus:border-blue-500 h-9 text-sm" // Input mais compacto
            disabled={disabled}
          />
        </div>
      </div>

      {/* Grid Ajustado: 4 Colunas e Gap menor */}
      <div className="h-100 lg:h-150 overflow-y-auto p-3 custom-scrollbar bg-zinc-900/50">
        <div className="grid grid-cols-4 gap-2">
          {" "}
          {/* MUDANÇA: grid-cols-4 e gap-2 */}
          {filtered.map((champ) => {
            const isGuessed = guessedNames.includes(champ.name);

            return (
              <button
                key={champ.id}
                onClick={() => {
                  if (!isGuessed && !disabled) {
                    onSelect(champ.name);
                    setSearch("");
                  }
                }}
                disabled={isGuessed || disabled}
                className={cn(
                  "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                  isGuessed
                    ? "border-zinc-800 opacity-30 grayscale cursor-not-allowed"
                    : "border-zinc-700 hover:border-blue-500 hover:scale-105 cursor-pointer bg-zinc-800",
                )}
                title={champ.name}
              >
                <img
                  src={champ.imageUrl}
                  alt={champ.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                {/* Nome no Hover */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-white text-center px-1 leading-none">
                    {champ.name}
                  </span>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 h-full text-sm">
              <span>Nada encontrado.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
