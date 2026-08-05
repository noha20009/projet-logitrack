import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Rechercher...', label }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      label={label}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <SearchIcon
                onClick={onSearch}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
              />
            </InputAdornment>
          ) : null,
        },
      }}
    />
  )
}
