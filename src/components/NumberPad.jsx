export default function NumberPad({ onDigit, onBackspace, onSubmit, onNegative }) {
  return (
    <div className="numpad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <button key={n} className="numpad-btn number" onClick={() => onDigit(n)}>
          {n}
        </button>
      ))}
      <button className="numpad-btn negative" onClick={onNegative}>±</button>
      <button className="numpad-btn number" onClick={() => onDigit(0)}>0</button>
      <button className="numpad-btn backspace" onClick={onBackspace}>⌫</button>
      <button
        className="numpad-btn submit"
        onClick={onSubmit}
        style={{ gridColumn: '1 / -1' }}
      >
        Check ✓
      </button>
    </div>
  )
}
