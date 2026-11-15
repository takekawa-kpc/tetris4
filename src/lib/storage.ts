const HIGH_SCORE_KEY = 'tetris.highScore'

export function getHighScore(): number {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY)
    return stored ? parseInt(stored, 10) || 0 : 0
  } catch {
    return 0
  }
}

export function saveHighScore(score: number): void {
  try {
    const current = getHighScore()
    if (score > current) {
      localStorage.setItem(HIGH_SCORE_KEY, String(score))
    }
  } catch {
    // localStorage unavailable
  }
}
