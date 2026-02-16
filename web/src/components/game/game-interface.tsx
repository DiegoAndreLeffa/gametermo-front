/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ChampionGrid } from "@/components/game/champion-grid";
import { AttributeCell } from "@/components/game/attribute-cell";
import {
  AlertCircle,
  Trophy,
  Skull,
  Gamepad2,
  ArrowDown,
  Lightbulb,
  HelpCircle,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GameTimer } from "./game-timer";

interface GameInterfaceProps {
  startEndpoint: string;
  title: string;
}

const MAX_ATTEMPTS = 15;

export function GameInterface({ startEndpoint, title }: GameInterfaceProps) {
  const [loading, setLoading] = useState(true);
  const [champions, setChampions] = useState<any[]>([]);
  const [game, setGame] = useState<any>(null);
  const [targetChampion, setTargetChampion] = useState<any>(null);

  const [hint, setHint] = useState<string | null>(null);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const [showRules, setShowRules] = useState(false);

  const [isTimeUp, setIsTimeUp] = useState(false); // Novo state para travar UI

  useEffect(() => {
    const initGame = async () => {
      try {
        const champsRes = await api.get("/content/lol/entities");
        const formattedChamps = champsRes.data.map((c: any) => ({
          id: c._id,
          name: c.name,
          imageUrl: c.imageUrl,
        }));
        setChampions(formattedChamps);

        const sessionRes = await api.post(startEndpoint);
        setGame({
          sessionId: sessionRes.data.sessionId,
          status: sessionRes.data.status,
          history: sessionRes.data.history,
        });
        if (sessionRes.data.usedHint) {
          setHintUsed(true);
        }
      } catch (error) {
        toast.error("Erro ao iniciar jogo.");
      } finally {
        setLoading(false);
      }
    };

    initGame();
  }, [startEndpoint]);

  const handleGuess = async (championName: string) => {
    if (!game) return;

    try {
      const res = await api.post(`/gameplay/${game.sessionId}/guess`, {
        guess: championName,
      });
      const newTurn = res.data.turnResult;
      const newStatus = res.data.gameStatus;

      if (newStatus === "LOST" && res.data.correctEntity) {
        setTargetChampion(res.data.correctEntity);
        toast.error("Game Over! Suas tentativas acabaram.");
      }

      setGame((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          status: newStatus,
          history: [newTurn, ...prev.history],
        };
      });

      if (newStatus === "WON") toast.success("Parabéns! Você acertou! 🎉");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro no chute");
    }
  };

  const handleTimeExpire = () => {
    setIsTimeUp(true);
    toast.error("Tempo Esgotado!");
  };

  const isGameActive = game?.status === "PLAYING" && !isTimeUp;

  const handleUseHint = async () => {
    if (!game) return;

    if (hint) {
      setIsHintOpen(true);
      return;
    }

    try {
      const res = await api.post(`/gameplay/${game.sessionId}/hint`);
      setHint(res.data.hint);
      setHintUsed(true);
      setIsHintOpen(true);
      toast.info("Dica revelada!");
    } catch (error) {
      toast.error("Erro ao pegar dica");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-white">Invocando campeões...</div>
    );

  const guessedNames =
    game?.history.map((turn: any) => turn.guessedEntity.name) || [];
  const winningChampion =
    game?.status === "WON" && game.history.length > 0
      ? game.history[0].guessedEntity
      : null;
  const attemptsUsed = game?.history.length || 0;

  if (game?.status === "WON" && winningChampion) {
    return (
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-10 animate-in fade-in zoom-in duration-700">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 text-center">
          {title}
        </h1>

        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRules(true)}
            className="text-zinc-400 hover:text-white"
          >
            <HelpCircle className="w-6 h-6" />
          </Button>
        </div>

        <div className="relative group cursor-default mb-8">
          <div className="absolute inset-0 bg-green-500 blur-3xl opacity-30 rounded-full animate-pulse"></div>
          <div className="w-64 h-64 md:w-80 md:h-80 border-4 border-green-500 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.4)] relative z-10 bg-zinc-900">
            <img
              src={winningChampion.imageUrl}
              alt={winningChampion.name}
              className="w-full h-full object-cover transform transition-transform group-hover:scale-110 duration-700"
            />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-white uppercase tracking-wider drop-shadow-xl">
            {winningChampion.name}
          </h2>
          <div className="flex items-center justify-center gap-2 text-green-400 bg-green-950/40 px-4 py-2 rounded-full border border-green-500/30">
            <Trophy className="w-5 h-5" />
            <span className="font-bold tracking-wide">DESAFIO CONCLUÍDO</span>
          </div>
          <p className="text-yellow-400 font-bold text-xl">
            Pontuação:{" "}
            {Math.max(10, 100 - (attemptsUsed - 1) * 5 - (hintUsed ? 25 : 0))}
          </p>
          <p className="text-zinc-400 mt-4 max-w-md mx-auto">
            Histórico arquivado com sucesso.
            <br />
            Volte amanhã para um novo desafio!
          </p>
        </div>
      </div>
    );
  }

  if (game?.status === "LOST") {
    return (
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-10 animate-in fade-in zoom-in duration-700">
        <h1 className="text-4xl font-bold mb-8 text-red-500 text-center uppercase tracking-widest">
          DERROTA
        </h1>

        <div className="relative group cursor-default mb-8">
          {targetChampion ? (
            <>
              <div className="w-64 h-64 border-4 border-red-500 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.4)] bg-zinc-900 grayscale">
                <img
                  src={targetChampion.imageUrl}
                  alt={targetChampion.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-zinc-400">O campeão era:</p>
                <h2 className="text-3xl font-bold text-white">
                  {targetChampion.name}
                </h2>
              </div>
            </>
          ) : (
            <div className="text-center p-10 bg-zinc-900 rounded-xl border border-red-900">
              <Skull className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-zinc-300">Você ficou sem tentativas.</p>
            </div>
          )}
        </div>

        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-950"
        >
          Tentar Novamente (Reinicia página)
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[98%] mx-auto px-2 md:px-4 pb-20">
      <div className="text-center mb-8 relative w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
          {title}
        </h1>

        {game?.expiresAt && game?.status === "PLAYING" && (
          <div className="mt-4">
            <GameTimer
              expiresAt={game.expiresAt}
              onExpire={handleTimeExpire}
              stop={game.status !== "PLAYING"}
            />
          </div>
        )}

        {/* Mostra mensagem de Time's Up se acabou */}
        {isTimeUp && game?.status !== "WON" && (
          <div className="mt-4 bg-red-900/50 text-red-200 px-4 py-2 rounded border border-red-500">
            ⌛ Tempo Esgotado! Tente novamente.
          </div>
        )}

        {game?.status === "PLAYING" && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUseHint}
              className={`border-yellow-500/50 hover:bg-yellow-500/10 ${hintUsed ? "text-yellow-500" : "text-zinc-400 hover:text-yellow-400"}`}
            >
              <Lightbulb
                className={`w-4 h-4 mr-2 ${hintUsed ? "fill-yellow-500" : ""}`}
              />
              {hintUsed ? "Ver Dica" : "Dica (-25 pts)"}
            </Button>
          </div>
        )}

        {/* Botão Mobile */}
        <div className="md:hidden mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseHint}
            className="w-full border-yellow-500/50 text-yellow-500"
            disabled={game?.status !== "PLAYING"}
          >
            <Lightbulb
              className={`w-4 h-4 mr-2 ${hintUsed ? "fill-yellow-500" : ""}`}
            />
            {hintUsed ? "Ver Dica" : "Revelar Dica (-25 pts)"}
          </Button>
        </div>

        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRules(true)}
            className="text-zinc-400 hover:text-white"
          >
            <HelpCircle className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2 text-sm font-medium">
          <span
            className={
              attemptsUsed >= MAX_ATTEMPTS - 3
                ? "text-red-500"
                : "text-zinc-400"
            }
          >
            Tentativa {attemptsUsed} / {MAX_ATTEMPTS}
          </span>
          {attemptsUsed >= MAX_ATTEMPTS - 3 && (
            <span className="text-red-500 flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3 h-3" /> Cuidado!
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center">
        {/* ESQUERDA: GRID DE SELEÇÃO */}
        <div className="w-full lg:w-120 xl:w-137.5 lg:sticky lg:top-24 shrink-0 flex flex-col gap-2">
          {game?.history.length === 0 && (
            <div className="flex items-center justify-center gap-2 text-blue-400 font-medium animate-bounce mb-1">
              <ArrowDown className="w-4 h-4" />
              <span>Escolha um campeão para começar</span>
              <ArrowDown className="w-4 h-4" />
            </div>
          )}

          <div className="shadow-2xl rounded-xl overflow-hidden">
            <ChampionGrid
              champions={champions}
              onSelect={handleGuess}
              disabled={game?.status !== "PLAYING"}
              guessedNames={guessedNames}
            />
          </div>

          <div className="w-full bg-zinc-800 h-1 mt-0 rounded-b-xl overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${attemptsUsed > 10 ? "bg-red-500" : "bg-blue-500"}`}
              style={{ width: `${(attemptsUsed / MAX_ATTEMPTS) * 100}%` }}
            />
          </div>
        </div>

        {/* DIREITA: HISTÓRICO */}
        <div className="w-full flex-1 overflow-x-auto custom-scrollbar bg-zinc-900/20 rounded-xl border border-zinc-800/50 p-4 lg:h-162.5 lg:overflow-y-auto">
          {game?.history.length === 0 ? (
            // ESTADO VAZIO
            <div className="h-full min-h-75 flex flex-col items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-800/50 rounded-lg bg-zinc-900/40 p-6 text-center">
              <Gamepad2 className="w-12 h-12 mb-4 text-zinc-600" />
              <h3 className="text-xl font-bold mb-2 text-zinc-300">
                A Arena está vazia
              </h3>
              <p className="text-sm max-w-62.5 leading-relaxed">
                Selecione qualquer campeão no grid ao lado para revelar as
                pistas (Gênero, Região, Espécie...).
              </p>
            </div>
          ) : (
            <div className="min-w-max">
              {/* Cabeçalho Fixo */}
              <div className="flex justify-center items-center gap-12 mb-3 px-1 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2 sticky top-0 bg-zinc-950/80 backdrop-blur z-10">
                <div className="w-20 md:w-24 text-center">Champ</div>
                <div className="w-20 md:w-24 text-center">Gender</div>
                <div className="w-20 md:w-24 text-center">Position</div>
                <div className="w-20 md:w-24 text-center">Species</div>
                <div className="w-20 md:w-24 text-center">Resource</div>
                <div className="w-20 md:w-24 text-center">Range</div>
                <div className="w-20 md:w-24 text-center">Region</div>
                <div className="w-20 md:w-24 text-center">Year</div>
              </div>

              {/* Lista */}
              <div className="flex flex-col justify-center gap-2 pb-4">
                {game?.history.map((turn: any, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 justify-center animate-in slide-in-from-left-4 duration-500 hover:bg-zinc-800/30 p-1 rounded-lg transition-colors"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-zinc-700 rounded-md overflow-hidden bg-zinc-900 shadow-lg shrink-0">
                      <img
                        src={turn.guessedEntity.imageUrl}
                        alt={turn.guessedEntity.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {turn.results.map((attr: any, i: number) => (
                      <AttributeCell
                        key={i}
                        value={attr.value}
                        status={attr.status}
                        direction={attr.direction}
                        delay={i * 0.05}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isHintOpen} onOpenChange={setIsHintOpen}>
        <DialogContent className="bg-zinc-900 border-yellow-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-500">
              <Lightbulb className="fill-yellow-500" /> Dica do Campeão
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              O título oficial deste campeão é:
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <span className="text-2xl font-bold italic text-white font-serif">
              &rdquo;{hint || "Carregando..."}&rdquo;
            </span>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl border-b border-zinc-800 pb-4">
              <HelpCircle className="text-blue-500" /> Como Jogar
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* 1. Objetivo */}
            <section>
              <h3 className="font-bold text-lg text-white mb-2">🎯 Objetivo</h3>
              <p className="text-zinc-400 text-sm">
                Adivinhe o campeão de League of Legends do dia. Simplesmente
                digite o nome de qualquer campeão e revelaremos seus atributos.
              </p>
            </section>

            {/* 2. Cores */}
            <section>
              <h3 className="font-bold text-lg text-white mb-3">
                🎨 O que significam as cores?
              </h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 border border-green-500 rounded flex items-center justify-center font-bold text-xs shadow-lg shadow-green-900/20">
                    Igual
                  </div>
                  <span className="text-sm text-zinc-300">
                    O atributo está <b>correto</b>.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 border border-orange-400 rounded flex items-center justify-center font-bold text-xs shadow-lg shadow-orange-900/20">
                    Parcial
                  </div>
                  <span className="text-sm text-zinc-300">
                    Parcialmente correto. Ex: O campeão é <i>Mid, Top</i> e você
                    chutou alguém que é só <i>Top</i>.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 border border-red-500 rounded flex items-center justify-center font-bold text-xs shadow-lg shadow-red-900/20">
                    Errado
                  </div>
                  <span className="text-sm text-zinc-300">
                    O atributo está incorreto. Tente outra coisa!
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Setas */}
            <section>
              <h3 className="font-bold text-lg text-white mb-3">
                ⬆️ Atributos Numéricos (Ano, Mana, Range)
              </h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 border border-red-500 rounded flex items-center justify-center text-white">
                    <ArrowUp className="w-6 h-6 animate-bounce" />
                  </div>
                  <span className="text-sm text-zinc-300">
                    O valor correto é <b>MAIOR</b> do que o que você chutou.
                    <br />
                    <span className="text-xs text-zinc-500">
                      (Ex: Você chutou 2010, mas o campeão é de 2015).
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 border border-red-500 rounded flex items-center justify-center text-white">
                    <ArrowDown className="w-6 h-6 animate-bounce" />
                  </div>
                  <span className="text-sm text-zinc-300">
                    O valor correto é <b>MENOR</b>.
                  </span>
                </div>
              </div>
            </section>

            {/* 4. Pontuação */}
            <section className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
              <h3 className="font-bold text-base text-white mb-2">
                🏆 Pontuação & Regras
              </h3>
              <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                <li>
                  Você tem{" "}
                  <b className="text-white">{MAX_ATTEMPTS} tentativas</b>.
                </li>
                <li>
                  Começa valendo <b>100 pontos</b>.
                </li>
                <li>
                  Cada erro desconta <b>-5 pontos</b>.
                </li>
                <li>
                  Usar a Dica desconta <b>-25 pontos</b> imediatamente.
                </li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
