import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { SelectChangeEvent } from '@mui/material'
import { PaginationFooter } from '../pagination-footer'
import type { Brance } from '../../model'

interface BrancesTableProps {
  brances: Brance[]
  totalRows: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onEdit?: (brance: Brance) => void
  onDelete?: (brance: Brance) => void
}

export function BrancesTable({
  brances,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: BrancesTableProps) {
  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value - 1)
  }

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    onRowsPerPageChange(Number(event.target.value))
    onPageChange(0)
  }

  return (
    <Box
      sx={{
        borderRadius: '16px',
        background: '#fff',
        p: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}>
      <TableContainer sx={{ boxShadow: 'none', borderRadius: 0 }}>
        <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow sx={{ background: '#f8f9fb' }}>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>Назва</TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>Кількість</TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>Адреса</TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>ID для API</TableCell>
              <TableCell align="right" sx={{ background: '#f8f9fb', border: 'none' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brances.map((brance, idx) => (
              <TableRow
                key={brance.id}
                sx={{
                  background: idx % 2 === 0 ? '#fff' : '#f8f9fb',
                  '&:last-child td, &:last-child th': { border: 0 },
                  border: 'none',
                  boxShadow: 'none',
                  minHeight: 56,
                }}>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{brance.name}</TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{brance.usersCount}</TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{brance.address}</TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{brance.id}</TableCell>
                <TableCell align="right" sx={{ border: 'none' }}>
                  <IconButton size="small" sx={{ mr: 1 }} onClick={() => onEdit?.(brance)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete?.(brance)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 'auto' }}>
        <PaginationFooter
          count={Math.ceil(totalRows / rowsPerPage)}
          page={page + 1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalRows={totalRows}
        />
      </Box>
    </Box>
  )
}
