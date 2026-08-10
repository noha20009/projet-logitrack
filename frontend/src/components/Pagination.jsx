import TablePagination from '@mui/material/TablePagination'
import { PAGE_SIZES } from '../utils/constants'
import './Pagination.css'

export default function Pagination({ page, size, totalElements, onPageChange, onSizeChange, showSize = true }) {
  if (!totalElements) return null

  return (
    <TablePagination
      component="div"
      page={page}
      rowsPerPage={size}
      count={totalElements}
      rowsPerPageOptions={showSize ? PAGE_SIZES : []}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      onRowsPerPageChange={(e) => onSizeChange(Number(e.target.value))}
      labelRowsPerPage="Lignes par page"
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
      className="mui-pagination"
    />
  )
}
