import { BOARD_HEIGHT, BOARD_WIDTH } from '../lib/board'

interface GameBoardProps {
  board: Array<Array<string | number>>
  currentPiece: { shape: number[][]; color: string } | null
  currentRow: number
  currentCol: number
  ghostRow: number
}

export function GameBoard({ board, currentPiece, currentRow, currentCol, ghostRow }: GameBoardProps) {
  const displayBoard = board.map((row) => [...row])

  // Draw ghost piece
  if (currentPiece && ghostRow !== currentRow) {
    for (let r = 0; r < currentPiece.shape.length; r++) {
      for (let c = 0; c < currentPiece.shape[0].length; c++) {
        const boardRow = ghostRow + r
        const boardCol = currentCol + c
        if (boardRow >= 0 && boardRow < BOARD_HEIGHT && boardCol >= 0 && boardCol < BOARD_WIDTH) {
          if (currentPiece.shape[r][c]) {
            displayBoard[boardRow][boardCol] = -1 // Ghost marker
          }
        }
      }
    }
  }

  // Draw current piece
  if (currentPiece) {
    for (let r = 0; r < currentPiece.shape.length; r++) {
      for (let c = 0; c < currentPiece.shape[0].length; c++) {
        const boardRow = currentRow + r
        const boardCol = currentCol + c
        if (boardRow >= 0 && boardRow < BOARD_HEIGHT && boardCol >= 0 && boardCol < BOARD_WIDTH) {
          if (currentPiece.shape[r][c]) {
            displayBoard[boardRow][boardCol] = currentPiece.color
          }
        }
      }
    }
  }

  return (
    <div className="inline-block border-2 border-gray-700 rounded-lg overflow-hidden">
      {displayBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => {
            const isGhost = cell === -1
            const pieceColor = typeof cell === 'string' ? cell : undefined
            const bgColor = isGhost ? 'bg-gray-800' : pieceColor ? cell : 'bg-gray-900'
            const border = pieceColor ? 'border-2' : isGhost ? 'border border-dashed border-gray-600' : 'border border-gray-800'

            return (
              <div
                key={colIndex}
                className={`w-6 h-6 ${bgColor} ${border} box-border`}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
