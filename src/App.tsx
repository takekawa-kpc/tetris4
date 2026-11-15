import { useEffect } from 'react'
import { getHighScore } from './lib/storage'
import { useGame } from './hooks/useGame'
import { GameBoard } from './components/GameBoard'
import { NextPiece } from './components/NextPiece'
import { Header } from './components/Header'
import { Controls } from './components/Controls'
import { GameOverOverlay } from './components/GameOverOverlay'

export default function App() {
  const highScore = getHighScore()
  const { state, startGame, pauseGame, resumeGame, moveLeft, moveRight, moveDown, hardDrop, rotate, ghostRow } = useGame()

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p') {
        if (state.status === 'playing') pauseGame()
        else if (state.status === 'paused') resumeGame()
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          moveLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          moveRight()
          break
        case 'ArrowDown':
          e.preventDefault()
          moveDown()
          break
        case 'ArrowUp':
        case 'x':
        case 'X':
          e.preventDefault()
          rotate()
          break
        case 'z':
        case 'Z':
          e.preventDefault()
          rotate()
          break
        case ' ':
          e.preventDefault()
          hardDrop()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.status, moveLeft, moveRight, moveDown, hardDrop, rotate, pauseGame, resumeGame])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left panel - Next piece */}
        <div className="hidden lg:flex flex-col gap-4">
          <NextPiece nextPiece={state.nextPiece} />
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Controls</h3>
            <div className="text-xs text-gray-500 space-y-1">
              <p>← → Move</p>
              <p>↓ Soft Drop</p>
              <p>Space Hard Drop</p>
              <p>↑ / X / Z Rotate</p>
              <p>P Pause</p>
            </div>
          </div>
        </div>

        {/* Center - Game Board */}
        <div className="relative">
          <Header
            score={state.score}
            highScore={highScore}
            level={state.level}
            lines={state.lines}
          />
          <GameBoard
            board={state.board}
            currentPiece={state.currentPiece}
            currentRow={state.currentRow}
            currentCol={state.currentCol}
            ghostRow={ghostRow}
          />

          {/* Overlays */}
          {state.status === 'idle' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-400 mb-4">TETRIS</h2>
                <p className="text-gray-400 mb-6">Press START to begin</p>
                <Controls
                  status={state.status}
                  onStart={startGame}
                  onPause={pauseGame}
                  onResume={resumeGame}
                  onReset={startGame}
                />
              </div>
            </div>
          )}

          {state.status === 'paused' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">PAUSED</h2>
                <p className="text-gray-400 mb-4">Press P to resume</p>
                <Controls
                  status={state.status}
                  onStart={startGame}
                  onPause={pauseGame}
                  onResume={resumeGame}
                  onReset={startGame}
                />
              </div>
            </div>
          )}

          {state.status === 'gameover' && (
            <GameOverOverlay
              score={state.score}
              highScore={highScore}
              onRestart={startGame}
            />
          )}
        </div>
      </div>
    </div>
  )
}
