interface GameOverOverlayProps {
  score: number
  highScore: number
  onRestart: () => void
}

export function GameOverOverlay({ score, highScore, onRestart }: GameOverOverlayProps) {
  const isNewHighScore = score >= highScore

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h2>
        <p className="text-xl mb-2">Score: {score.toLocaleString()}</p>
        {isNewHighScore && (
          <p className="text-yellow-400 font-bold mb-4 animate-pulse">
            ★ NEW HIGH SCORE! ★
          </p>
        )}
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-colors"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  )
}
