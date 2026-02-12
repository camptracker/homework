export default function Settings({ difficulty, setDifficulty, operation, setOperation, timerOn, setTimerOn }) {
  return (
    <div className="card">
      <div className="settings">
        <div className="settings-group">
          {['easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              className={`settings-btn ${difficulty === d ? 'active' : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d === 'easy' ? '😊 Easy' : d === 'medium' ? '🤔 Medium' : '🧠 Hard'}
            </button>
          ))}
        </div>
        <div className="settings-group">
          {['add', 'subtract', 'mixed'].map(o => (
            <button
              key={o}
              className={`settings-btn ${operation === o ? 'active' : ''}`}
              onClick={() => setOperation(o)}
            >
              {o === 'add' ? '➕' : o === 'subtract' ? '➖' : '🔀'}
            </button>
          ))}
        </div>
        <label className="timer-toggle">
          <input type="checkbox" checked={timerOn} onChange={e => setTimerOn(e.target.checked)} />
          ⏱️ Timer (60s)
        </label>
      </div>
    </div>
  )
}
