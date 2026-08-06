import { SearchIcon } from './Icons'
import './SearchBar.css'

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Rechercher...', label }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="field search-bar">
      {label && <label htmlFor="search-bar-input">{label}</label>}
      <div className="search-bar-input-wrap">
        <span className="search-bar-start-icon">
          <SearchIcon size="sm" />
        </span>
        <input
          id="search-bar-input"
          className="search-bar-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        {value && (
          <button type="button" className="search-bar-submit" onClick={onSearch} title="Rechercher">
            <SearchIcon size="sm" className="search-bar-submit-icon" />
          </button>
        )}
      </div>
    </div>
  )
}
