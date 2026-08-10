import { PAGE_SIZES } from '../utils/constants'
import './Pagination.css'

function getPages(current, count) {
  const wanted = new Set([1, count, current - 1, current, current + 1])
  const pages = []
  let prev = 0
  for (let i = 1; i <= count; i++) {
    if (wanted.has(i)) {
      if (i - prev > 1) pages.push('...')
      pages.push(i)
      prev = i
    }
  }
  return pages
}

export default function Pagination({ page, size, totalElements, totalPages, onPageChange, onSizeChange, showSize = true }) {
  if (!totalElements) return null

  const start = totalElements === 0 ? 0 : page * size + 1
  const end = Math.min((page + 1) * size, totalElements)

  return (
    <div className="pagination-bar">
      <span className="pagination-info">
        {start} - {end} sur {totalElements} élément(s)
      </span>
      <div className="pagination-controls">
        {showSize && (
          <select className="pagination-size" value={size} onChange={(e) => onSizeChange(Number(e.target.value))}>
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        )}
        <div className="pagination-pages">
          <button
            type="button"
            className="pagination-btn"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            title="Page précédente"
          >
            ‹
          </button>
          {getPages(page + 1, totalPages).map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="pagination-ellipsis">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`pagination-btn${p === page + 1 ? ' pagination-btn--active' : ''}`}
                onClick={() => onPageChange(p - 1)}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            className="pagination-btn"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            title="Page suivante"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
