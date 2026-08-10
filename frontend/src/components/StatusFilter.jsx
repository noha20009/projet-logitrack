import { STATUTS, STATUT_LABELS } from '../utils/constants'
import './StatusFilter.css'

export default function StatusFilter({ value, onChange, withAll = true }) {
  return (
    <div className="field status-filter">
      <label htmlFor="status-filter-select">Statut</label>
      <select id="status-filter-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {withAll && <option value="">Tous les statuts</option>}
        {STATUTS.map((s) => (
          <option key={s} value={s}>
            {STATUT_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  )
}
