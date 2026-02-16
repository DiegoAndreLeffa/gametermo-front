"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Trophy,
  Users,
  Gamepad2,
  InfinityIcon,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/use-auth";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500"
        >
          <Gamepad2 className="text-blue-500" />
          Loldle
        </Link>

        {/* Menu Items */}
        <div className="flex items-center gap-4">
          <Link href="/leaderboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Ranking
            </Button>
          </Link>

          <Link href="/rooms">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Salas
            </Button>
          </Link>

          <Link href="/time-attack">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Timer className="w-4 h-4 mr-2" />
              Time Attack
            </Button>
          </Link>

          <Link href="/infinite">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              <InfinityIcon className="w-4 h-4 mr-2" />
              Infinito
            </Button>
          </Link>

          <div className="h-6 w-px bg-zinc-800 mx-2" />

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden md:block text-zinc-300">
              {user.nickname}
            </span>
            <Button
              variant="destructive"
              size="icon"
              className="w-8 h-8"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
