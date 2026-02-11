/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Champion {
  id: string;
  name: string;
  imageUrl: string;
}

interface ChampionSearchProps {
  champions: Champion[];
  onSelect: (championName: string) => void;
  disabled?: boolean;
}

export function ChampionSearch({
  champions,
  onSelect,
  disabled,
}: ChampionSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-zinc-900 border-zinc-700 text-white"
          disabled={disabled}
        >
          {value
            ? champions.find((champion) => champion.name === value)?.name
            : "Selecione um campeão..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-75 p-0 bg-zinc-900 border-zinc-800">
        <Command className="bg-zinc-900 text-white">
          <CommandInput placeholder="Digite o nome..." className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhum campeão encontrado.</CommandEmpty>
            <CommandGroup>
              {champions.map((champion) => (
                <CommandItem
                  key={champion.id}
                  value={champion.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                    onSelect(champion.name); // Envia para o pai
                    setValue(""); // Reseta o input após selecionar
                  }}
                  className="cursor-pointer hover:bg-zinc-800"
                >
                  <img
                    src={champion.imageUrl}
                    alt={champion.name}
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                  {champion.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === champion.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
