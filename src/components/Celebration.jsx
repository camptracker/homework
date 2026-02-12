import { useEffect, useState } from 'react'

const EMOJIS = ['🎉', '✨', '🌟', '💫', '⭐', '🎊', '🔥', '💪', '🏆', '👏']

export default function Celebration({ show }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!show) { setPieces([]); return }
    const newPieces = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 1,
    }))
    setPieces(newPieces)
    const t = setTimeout(() => setPieces([]), 2000)
    return () => clearTimeout(t)
  }, [show])

  if (!pieces.length) return null

  return (
    <div className="celebration">
      {pieces.map(p => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
