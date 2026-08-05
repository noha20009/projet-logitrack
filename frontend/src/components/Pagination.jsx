import { Box, MenuItem, Pagination as MuiPagination, Select, Typography } from '@mui/material'
import { PAGE_SIZES } from '../utils/constants'

export default function Pagination({ page, size, totalElements, totalPages, onPageChange, onSizeChange, showSize = true }) {
  if (!totalElements) return null

  const start = totalElements === 0 ? 0 : page * size + 1
  const end = Math.min((page + 1) * size, totalElements)

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mt: 3,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {start} - {end} sur {totalElements} élément(s)
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showSize && (
          <Select value={size} onChange={(e) => onSizeChange(Number(e.target.value))} size="small">
            {PAGE_SIZES.map((s) => (
              <MenuItem key={s} value={s}>
                {s} / page
              </MenuItem>
            ))}
          </Select>
        )}
        <MuiPagination
          count={totalPages}
          page={page + 1}
          onChange={(_, value) => onPageChange(value - 1)}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  )
}
