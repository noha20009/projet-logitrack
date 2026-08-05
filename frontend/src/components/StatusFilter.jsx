import { MenuItem, TextField } from '@mui/material'
import { STATUTS, STATUT_LABELS } from '../utils/constants'
import './StatusFilter.css'

export default function StatusFilter({ value, onChange, withAll = true }) {
  return (
    <TextField
      select
      label="Statut"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="status-filter"
    >
      {withAll && <MenuItem value="">Tous les statuts</MenuItem>}
      {STATUTS.map((s) => (
        <MenuItem key={s} value={s}>
          {STATUT_LABELS[s]}
        </MenuItem>
      ))}
    </TextField>
  )
}
