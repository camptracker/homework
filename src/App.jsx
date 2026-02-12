import { useState, useEffect, useCallback } from 'react'
import Settings from './components/Settings'
import ScoreBoard from './components/ScoreBoard'
import NumberPad from './components/NumberPad'
import Celebration from './components/Celebration'

function generateProblem(difficulty, operation) {
  const ranges = { easy: 9, medium: 99, hard: 999 }
  const max = ranges[difficulty]
  const min = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 10 : 100
  const a = Math.floor(Math.random() * (max - min + 1)) + min
  const b = Math.floor(Math.random() * (max - min + 1)) + min

  let op = operation
  if (operation === 'mixed') op = Math.random() < 0.5 ? 'add' : 'subtract'

  if (op === 'add') return { a, b, operator: '+', answer: a + b }
  return { a, b, operator: '−', answer: a - b }
}

const ENCOURAGEMENTS = ['Almost! Try again 💪', 'So close! 🌈', 'Keep going! 🚀', 'You got this! ✨', 'Not quite — try once more! 🎯']

export default function App() {
  const [difficulty, setDifficulty] = useState('easy')
  const [operation, setOperation] = useState('add')
  const [timerOn, setTimerOn] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(true)

  const [problem, setProblem] = useState(() => generateProblem('easy', 'add'))
  const [input, setInput] = useState('')
  const [isNegative, setIsNegative] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [celebrating, setCelebrating] = useState(false)
  const [stars, setStars] = useState([])

  const newProblem = useCallback(() => {
    setProblem(generateProblem(difficulty, operation))
    setInput('')
    setIsNegative(false)
    setFeedback(null)
  }, [difficulty, operation])

  // New problem when settings change
  useEffect(() => { newProblem() }, [difficulty, operation])

  // Timer
  useEffect(() => {
    if (!timerOn) { setTimeLeft(60); setGameActive(true); return }
    setTimeLeft(60); setGameActive(true)
    setCorrect(0); setWrong(0); setStreak(0)
    newProblem()
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); setGameActive(false); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerOn])

  // Keyboard input
  useEffect(() => {
    const handler = (e) => {
      if (!gameActive) return
      if (e.key >= '0' && e.key <= '9') handleDigit(parseInt(e.key))
      else if (e.key === 'Backspace') handleBackspace()
      else if (e.key === 'Enter') handleSubmit()
      else if (e.key === '-') setIsNegative(n => !n)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const handleDigit = (d) => {
    if (!gameActive) return
    setInput(prev => prev.length < 4 ? prev + d : prev)
  }
  const handleBackspace = () => setInput(prev => prev.slice(0, -1))
  const handleNegative = () => setIsNegative(n => !n)

  const handleSubmit = () => {
    if (!input || !gameActive) return
    const userAnswer = parseInt((isNegative ? '-' : '') + input)

    if (userAnswer === problem.answer) {
      setCorrect(c => c + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) setBestStreak(newStreak)
      setFeedback({ type: 'correct', text: ['🎉 Awesome!', '⭐ Amazing!', '🌟 Perfect!', '🔥 On fire!', '💫 Brilliant!'][Math.floor(Math.random() * 5)] })
      setCelebrating(true)
      setStars(s => [...s.slice(-9), '⭐'])
      setTimeout(() => { setCelebrating(false); newProblem() }, 1200)
    } else {
      setWrong(w => w + 1)
      setStreak(0)
      setFeedback({ type: 'wrong', text: ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)] })
      setInput('')
      setIsNegative(false)
    }
  }

  const resetGame = () => {
    setCorrect(0); setWrong(0); setStreak(0); setStars([])
    setGameActive(true); setTimeLeft(60)
    newProblem()
  }

  const displayValue = input ? (isNegative ? '−' + input : input) : ''

  return (
    <div className="app">
      <div className="header">
        <h1>Math Homework Fun! 🧮</h1>
        <p>Practice makes perfect!</p>
      </div>

      <Settings
        difficulty={difficulty} setDifficulty={setDifficulty}
        operation={operation} setOperation={setOperation}
        timerOn={timerOn} setTimerOn={setTimerOn}
      />

      <ScoreBoard correct={correct} wrong={wrong} streak={streak} timeLeft={timeLeft} timerOn={timerOn} />

      {stars.length > 0 && (
        <div className="progress-bar">
          {stars.map((s, i) => <span key={i}>{s}</span>)}
        </div>
      )}

      {!gameActive ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>⏱️ Time's Up!</div>
          <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>You got <b style={{ color: 'var(--green)' }}>{correct}</b> correct!</div>
          <div style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: 16 }}>Best streak: {bestStreak} 🔥</div>
          <button className="numpad-btn submit" style={{ padding: '12px 32px', fontSize: '1.1rem' }} onClick={resetGame}>
            Play Again 🎮
          </button>
        </div>
      ) : (
        <>
          <div className="card problem-area">
            <div className="problem">
              {problem.a}
              <span className="operator">{problem.operator}</span>
              {problem.b}
              <span className="equals">=</span>
              <span className={`answer-display ${!displayValue ? 'empty' : ''}`}>
                {displayValue || '?'}
              </span>
            </div>
          </div>

          <div className={`feedback ${feedback?.type || ''}`}>
            {feedback?.text || '\u00A0'}
          </div>

          <NumberPad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            onSubmit={handleSubmit}
            onNegative={handleNegative}
          />
        </>
      )}

      <Celebration show={celebrating} />
    </div>
  )
}
