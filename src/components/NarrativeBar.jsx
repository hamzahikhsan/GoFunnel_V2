import Icon from './Icon.jsx';
import { narrative } from '../data/gofunnel.js';

export default function NarrativeBar({ onNavigate }) {
  return (
    <section className="narrative-bar" aria-label="Helios summary">
      <span className="narrative-icon">
        <Icon name="spark" size={14} />
      </span>
      <p className="narrative-text" style={{ margin: 0 }}>
        <strong>{narrative.lead}</strong> {narrative.body}
      </p>
      <button className="narrative-link" onClick={() => onNavigate?.('Helios')}>
        Ask Helios →
      </button>
    </section>
  );
}
