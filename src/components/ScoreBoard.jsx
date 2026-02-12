export default function ScoreBoard({ correct, wrong, streak, timeLeft, timerOn }) {
  return (
    <div className="card scoreboard">
      <div className="stat">
        <span className="stat-value correct">{correct}</span>
        <span className="stat-label">Correct ✅</span>
      </div>
      <div className="stat">
        <span className="stat-value wrong">{wrong}</span>
        <span className="stat-label">Wrong ❌</span>
      </div>
      <div className="stat">
        <span className="stat-value streak">{streak} 🔥</span>
        <span className="stat-label">Streak</span>
      </div>
      {timerOn && (
        <div className="stat">
          <span className="stat-value timer">{timeLeft}s</span>
          <span className="stat-label">Time ⏱️</span>
        </div>
      )}
    </div>
  )
}
