import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BOARD_WIDTH,
  Board,
  clearLines,
  createEmptyBoard,
  getGhostPosition,
  isValidPosition,
  placePiece,
} from '../lib/board'
import { getNextPiece, rotateMatrix, Tetromino } from '../lib/tetromino'
import { calculateLevel, calculateScore } from '../lib/scoring'
import { saveHighScore } from '../lib/storage'

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover'

export interface GameState {
  board: Board
  currentPiece: Tetromino | null
  currentRow: number
  currentCol: number
  nextPiece: Tetromino | null
  score: number
  level: number
  lines: number
  status: GameStatus
}

const INITIAL_SPEED = 1000
const SPEED_DECREASE = 50
const MIN_SPEED = 100

function createInitialState(): GameState {
  const next = getNextPiece()
  const spawnCol = Math.floor((BOARD_WIDTH - next.shape[0].length) / 2)
  return {
    board: createEmptyBoard(),
    currentPiece: next,
    currentRow: 0,
    currentCol: spawnCol,
    nextPiece: getNextPiece(),
    score: 0,
    level: 0,
    lines: 0,
    status: 'idle',
  }
}

export function useGame(initialState?: GameState) {
  const [state, setState] = useState<GameState>(
    initialState ?? createInitialState(),
  )
  const stateRef = useRef(state)
  stateRef.current = state

  const setStateAndRef = useCallback(
    (updater: GameState | ((prev: GameState) => GameState)) => {
      const prev = stateRef.current
      const newState = typeof updater === 'function' ? updater(prev) : updater
      setState(newState)
      stateRef.current = newState
    },
    [],
  )

  const startGame = useCallback(() => {
    setStateAndRef({
      ...createInitialState(),
      status: 'playing',
    })
  }, [setStateAndRef])

  const pauseGame = useCallback(() => {
    if (stateRef.current.status === 'playing') {
      setStateAndRef((prev) => ({ ...prev, status: 'paused' }))
    }
  }, [])

  const resumeGame = useCallback(() => {
    if (stateRef.current.status === 'paused') {
      setStateAndRef((prev) => ({ ...prev, status: 'playing' }))
    }
  }, [])

  const moveLeft = useCallback(() => {
    const s = stateRef.current
    if (s.status !== 'playing' || !s.currentPiece) return
    if (isValidPosition(s.board, s.currentPiece.shape, s.currentRow, s.currentCol - 1)) {
      setStateAndRef((prev) => ({ ...prev, currentCol: prev.currentCol - 1 }))
    }
  }, [])

  const moveRight = useCallback(() => {
    const s = stateRef.current
    if (s.status !== 'playing' || !s.currentPiece) return
    if (isValidPosition(s.board, s.currentPiece.shape, s.currentRow, s.currentCol + 1)) {
      setStateAndRef((prev) => ({ ...prev, currentCol: prev.currentCol + 1 }))
    }
  }, [])

  const moveDown = useCallback(() => {
    const s = stateRef.current
    if (s.status !== 'playing' || !s.currentPiece) return false
    if (isValidPosition(s.board, s.currentPiece.shape, s.currentRow + 1, s.currentCol)) {
      setStateAndRef((prev) => ({ ...prev, currentRow: prev.currentRow + 1, score: prev.score + 1 }))
      return true
    }
    return false
  }, [])

  const hardDrop = useCallback(() => {
    const s = stateRef.current
    if (s.status !== 'playing' || !s.currentPiece) return
    let row = s.currentRow
    while (isValidPosition(s.board, s.currentPiece.shape, row + 1, s.currentCol)) {
      row++
    }
    const dropDistance = row - s.currentRow
    setStateAndRef((prev) => ({ ...prev, currentRow: row, score: prev.score + dropDistance * 2 }))
  }, [])

  const rotate = useCallback(() => {
    const s = stateRef.current
    if (s.status !== 'playing' || !s.currentPiece) return
    const rotated = rotateMatrix(s.currentPiece.shape)
    // Try normal rotation
    if (isValidPosition(s.board, rotated, s.currentRow, s.currentCol)) {
      setStateAndRef((prev) => ({ ...prev, currentPiece: { ...prev.currentPiece!, shape: rotated } }))
      return
    }
    // Wall kick: try shifting left/right
    for (const offset of [-1, 1, -2, 2]) {
      if (isValidPosition(s.board, rotated, s.currentRow, s.currentCol + offset)) {
        setStateAndRef((prev) => ({
          ...prev,
          currentPiece: { ...prev.currentPiece!, shape: rotated },
          currentCol: prev.currentCol + offset,
        }))
        return
      }
    }
  }, [])

  // Lock piece — uses stateRef for latest data
  const lockPiece = useCallback(() => {
    const s = stateRef.current
    if (!s.currentPiece) return

    const newBoard = placePiece(s.board, s.currentPiece.shape, s.currentRow, s.currentCol, '#888')

    // Check for completed lines
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)

    // Spawn next piece
    const next = getNextPiece()
    const spawnRow = 0
    const spawnCol = Math.floor((BOARD_WIDTH - next.shape[0].length) / 2)

    // Check game over
    const gameEnded = !isValidPosition(clearedBoard, next.shape, spawnRow, spawnCol)

    if (gameEnded) {
      const finalScore = s.score
      saveHighScore(finalScore)
      setStateAndRef({
        board: clearedBoard,
        currentPiece: null,
        currentRow: 0,
        currentCol: 0,
        nextPiece: null,
        score: finalScore,
        level: calculateLevel(s.lines),
        lines: s.lines + linesCleared,
        status: 'gameover',
      })
      return
    }

    setStateAndRef({
      board: clearedBoard,
      currentPiece: next,
      currentRow: spawnRow,
      currentCol: spawnCol,
      nextPiece: getNextPiece(),
      score: s.score + calculateScore(linesCleared, calculateLevel(s.lines + linesCleared)),
      level: calculateLevel(s.lines + linesCleared),
      lines: s.lines + linesCleared,
      status: 'playing',
    })
  }, [])

  // Auto-drop
  const speed = Math.max(MIN_SPEED, INITIAL_SPEED - state.level * SPEED_DECREASE)

  useEffect(() => {
    if (state.status !== 'playing' || !state.currentPiece) return

    const interval = setInterval(() => {
      const s = stateRef.current
      if (s.status !== 'playing' || !s.currentPiece) {
        clearInterval(interval)
        return
      }

      if (!isValidPosition(s.board, s.currentPiece.shape, s.currentRow + 1, s.currentCol)) {
        lockPiece()
      } else {
        setStateAndRef((prev) => ({ ...prev, currentRow: prev.currentRow + 1 }))
      }
    }, speed)

    return () => clearInterval(interval)
  }, [state.status, state.currentPiece, state.currentRow, speed, lockPiece])

  return {
    state,
    startGame,
    pauseGame,
    resumeGame,
    moveLeft,
    moveRight,
    moveDown,
    hardDrop,
    rotate,
    lockPiece,
    ghostRow: state.currentPiece
      ? getGhostPosition(state.board, state.currentPiece.shape, state.currentRow, state.currentCol)
      : 0,
  }
}
