interface NextPieceProps {
  nextPiece: { shape: number[][]; color: string } | null
}

export function NextPiece({ nextPiece }: NextPieceProps) {
  if (!nextPiece) return null

  return (
    <div className="flex flex-col items-center gap-2">
      <h3 className="text-sm text-gray-400 uppercase tracking-wider">Next</h3>
      <div className="bg-gray-900 p-2 rounded-lg border border-gray-700">
        {nextPiece.shape.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`w-5 h-5 ${cell ? `rounded-sm` : ''}`}
                style={cell ? { backgroundColor: nextPiece.color } : undefined}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
