import { createFileRoute } from "@tanstack/react-router";
import { Gamepad2, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gaming")({
  head: () => ({
    meta: [
      { title: "Gaming | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Take a short break with Tic Tac Toe against the computer on easy, medium or hard.",
      },
      { property: "og:title", content: "Tic Tac Toe vs the computer" },
      {
        property: "og:description",
        content: "Take a short break with Tic Tac Toe against the computer on easy, medium or hard.",
      },
    ],
  }),
  component: GamingPage,
});

type Cell = "X" | "O" | null;
type Difficulty = "Easy" | "Medium" | "Hard";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winnerOf(b: Cell[]): { player: Cell; line: number[] } | null {
  for (const line of LINES) {
    const [a, c, d] = line as [number, number, number];
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { player: b[a], line };
  }
  return null;
}

function minimax(board: Cell[], isAi: boolean): { score: number; move: number } {
  const win = winnerOf(board);
  if (win?.player === "O") return { score: 1, move: -1 };
  if (win?.player === "X") return { score: -1, move: -1 };
  if (board.every(Boolean)) return { score: 0, move: -1 };

  let best = { score: isAi ? -Infinity : Infinity, move: -1 };
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = [...board];
    next[i] = isAi ? "O" : "X";
    const { score } = minimax(next, !isAi);
    if (isAi ? score > best.score : score < best.score) best = { score, move: i };
  }
  return best;
}

function aiMove(board: Cell[], difficulty: Difficulty): number {
  const empty = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
  if (!empty.length) return -1;
  const random = () => empty[Math.floor(Math.random() * empty.length)]!;

  if (difficulty === "Easy") return Math.random() < 0.8 ? random() : minimax(board, true).move;
  if (difficulty === "Medium") return Math.random() < 0.45 ? random() : minimax(board, true).move;
  return minimax(board, true).move;
}

const EMPTY: Cell[] = Array(9).fill(null);

function GamingPage() {
  const { settings, playDing } = useSettings();
  const [board, setBoard] = useState<Cell[]>(EMPTY);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const [settled, setSettled] = useState(false);

  const result = winnerOf(board);
  const full = board.every(Boolean);
  const over = Boolean(result) || full;

  useEffect(() => {
    if (!over || settled) return;
    setSettled(true);
    if (result?.player === "X") setScore((s) => ({ ...s, wins: s.wins + 1 }));
    else if (result?.player === "O") setScore((s) => ({ ...s, losses: s.losses + 1 }));
    else setScore((s) => ({ ...s, draws: s.draws + 1 }));
    if (settings.soundEnabled) playDing();
  }, [over, settled, result, settings.soundEnabled, playDing]);

  useEffect(() => {
    if (over || turn !== "O") return;
    const id = window.setTimeout(() => {
      const move = aiMove(board, difficulty);
      if (move < 0) return;
      setBoard((b) => {
        if (b[move]) return b;
        const next = [...b];
        next[move] = "O";
        return next;
      });
      setTurn("X");
    }, 420);
    return () => window.clearTimeout(id);
  }, [turn, over, board, difficulty]);

  const play = (i: number) => {
    if (board[i] || over || turn !== "X") return;
    const next = [...board];
    next[i] = "X";
    setBoard(next);
    setTurn("O");
  };

  const newGame = useCallback(() => {
    setBoard(EMPTY);
    setTurn("X");
    setSettled(false);
  }, []);

  const resetAll = () => {
    newGame();
    setScore({ wins: 0, losses: 0, draws: 0 });
  };

  const status = result
    ? result.player === "X"
      ? "You win! 🎉"
      : "The computer wins — you lose this round."
    : full
      ? "It's a draw."
      : turn === "X"
        ? "Your turn (X)"
        : "Computer is thinking…";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Gamepad2}
        title="Gaming"
        description="A quick brain break: Tic Tac Toe against the computer."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="surface-card p-5 sm:p-8">
          <div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-3">
            {board.map((cell, i) => {
              const highlighted = result?.line.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => play(i)}
                  disabled={Boolean(cell) || over || turn !== "X"}
                  aria-label={`Square ${i + 1}`}
                  className={cn(
                    "grid aspect-square place-items-center rounded-2xl border border-border bg-muted text-4xl font-black transition-all sm:text-5xl",
                    !cell && !over && turn === "X" && "hover:-translate-y-0.5 hover:bg-primary-soft",
                    cell === "X" && "text-primary",
                    cell === "O" && "text-accent",
                    highlighted && "border-transparent gold-chip",
                  )}
                >
                  {cell}
                </button>
              );
            })}
          </div>

          <p
            className={cn(
              "mt-6 text-center text-lg font-bold",
              result?.player === "X" && "text-success",
              result?.player === "O" && "text-accent",
            )}
          >
            {status}
          </p>
        </div>

        <div className="space-y-4">
          <div className="surface-card space-y-3 p-5">
            <p className="text-sm font-semibold">Difficulty</p>
            <Select
              value={difficulty}
              onValueChange={(v) => {
                setDifficulty(v as Difficulty);
                newGame();
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Hard plays a perfect game — the best you can hope for is a draw.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={newGame}>
                <Sparkles className="h-4 w-4" /> New game
              </Button>
              <Button variant="outline" onClick={resetAll}>
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          <div className="surface-card grid grid-cols-3 gap-2 p-5 text-center">
            {[
              { k: "Wins", v: score.wins, c: "text-success" },
              { k: "Losses", v: score.losses, c: "text-accent" },
              { k: "Draws", v: score.draws, c: "text-muted-foreground" },
            ].map((s) => (
              <div key={s.k}>
                <p className={cn("text-2xl font-extrabold", s.c)}>{s.v}</p>
                <p className="text-xs text-muted-foreground">{s.k}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
