interface HeaderProps {
  score: number
  highScore: number
  level: number
  lines: number
}

export function Header({ score, highScore, level, lines }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <h1 className="text-3xl font-bold text-center text-white mb-4">TETRIS</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">SCORE</p>
          <p className="text-xl font-bold text-white">{score.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">HIGH SCORE</p>
          <p className="text-xl font-bold text-yellow-400">{highScore.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">LEVEL</p>
          <p className="text-xl font-bold text-white">{level}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">LINES</p>
          <p className="text-xl font-bold text-white">{lines}</p>
        </div>
      </div>
    </div>
  )
}
