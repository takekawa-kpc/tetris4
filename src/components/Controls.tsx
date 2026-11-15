interface ControlsProps {
  status: string
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
}

export function Controls({ status, onStart, onPause, onResume, onReset }: ControlsProps) {
  return (
    <div className="flex gap-2">
      {status === 'idle' && (
        <button
          onClick={onStart}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors"
        >
          START
        </button>
      )}

      {status === 'playing' && (
        <button
          onClick={onPause}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold transition-colors"
        >
          PAUSE
        </button>
      )}

      {status === 'paused' && (
        <button
          onClick={onResume}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
        >
          RESUME
        </button>
      )}

      {(status === 'playing' || status === 'paused') && (
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
        >
          RESET
        </button>
      )}
    </div>
  )
}
