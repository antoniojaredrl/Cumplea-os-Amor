import Mochi from './Mochi.jsx';

export default function ActivityGuide({ title, message, expression = 'happy', scientist = false }) {
  return <aside className="activity-guide"><Mochi className="activity-guide-mochi" expression={expression} costume={scientist ? 'scientist' : undefined} /><div><h2>{title}</h2><p role="status">{message}</p></div></aside>;
}
