import { MenuItem, TextField } from '@mui/material'
import { STATUTS, STATUT_LABELS } from '../utils/constants'

export default function StatusFilter({ value, onChange, withAll = true }) {
  return (
    <TextField
      select
      label="Statut"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ minWidth: 180 }}
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
