export default function Confetti() {
  return <div className="birthday-confetti" aria-hidden="true">{Array.from({ length: 32 }, (_, i) => <span key={i} style={{ '--i': i, '--left': `${i * 37 % 100}%`, '--confetti-color': ['#e9a9c5', '#c1a9db', '#d5bd75', '#aad0b3'][i % 4] }} />)}</div>;
}
