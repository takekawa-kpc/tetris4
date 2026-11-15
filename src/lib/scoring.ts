export const SCORE_TABLE: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
}

export function calculateScore(lines: number, level: number): number {
  const base = SCORE_TABLE[lines] ?? 0
  return base * (level + 1)
}

export function calculateLevel(lines: number): number {
  return Math.floor(lines / 10)
}
