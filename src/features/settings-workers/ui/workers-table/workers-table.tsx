import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TableSortLabel,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { SelectChangeEvent } from '@mui/material'
import { useState, useMemo } from 'react'
import { PaginationFooter } from '../pagination-footer'
import type { ICourt, ICourtItem } from '../../../../app/providers/types/court'

type SortField = 'name' | 'email' | 'branch' | 'role' | 'apiId'
type SortDirection = 'asc' | 'desc'

interface CourtsTableProps {
  courts: ICourt
  totalRows: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onEdit?: (court: ICourtItem) => void
  onDelete?: (court: ICourtItem) => void
}

const getRolePriority = (role: string): number => {
  switch (role) {
    case 'Адміністратор':
      return 1
    case 'Лікар':
      return 2
    case 'Асистент':
      return 3
    default:
      return 4
  }
}

export function CourtsTable({
  courts,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: CourtsTableProps) {
  const [sortField, setSortField] = useState<SortField>('role')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value - 1)
  }

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    onRowsPerPageChange(Number(event.target.value))
    onPageChange(0)
  }

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortDirection === 'asc'
    setSortDirection(isAsc ? 'desc' : 'asc')
    setSortField(field)
  }
  console.log("courts", courts);
  

  const sortedICourts = useMemo(() => {
    const tableCourts = courts.items ?? []
    
    return [...tableCourts].sort((a, b) => {
      let comparison = 0

      if (sortField === 'role') {
        // const roleA = getRolePriority(a.role)
        // const roleB = getRolePriority(b.role)
        // comparison = roleA - roleB
      } else {
        // const valueA = a[sortField].toLowerCase()
        // const valueB = b[sortField].toLowerCase()
        // comparison = valueA.localeCompare(valueB)
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [courts, sortField, sortDirection])

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
      <TableContainer sx={{
        boxShadow: 'none', borderRadius: 0 
        }}
      >
        <Table
          sx={{
            minWidth: 1200,
            overflow:"scroll",
            borderCollapse: 'separate',
            borderSpacing: 0,
            tableLayout: 'auto',
          }}>
          <TableHead>
            <TableRow sx={{ background: '#f8f9fb' }}>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', minWidth: 180, width: 220 }}>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                  sx={{ color: '#000' }}>
                  Court
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'email'}
                  direction={sortField === 'email' ? sortDirection : 'asc'}
                  onClick={() => handleSort('email')}
                  sx={{ color: '#000' }}>
                  Sport
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'branch'}
                  direction={sortField === 'branch' ? sortDirection : 'asc'}
                  onClick={() => handleSort('branch')}
                  sx={{ color: '#000' }}>
                  Court Type
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'role'}
                  direction={sortField === 'role' ? sortDirection : 'asc'}
                  onClick={() => handleSort('role')}
                  sx={{ color: '#000' }}>
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'apiId'}
                  direction={sortField === 'apiId' ? sortDirection : 'asc'}
                  onClick={() => handleSort('apiId')}
                  sx={{ color: '#000' }}>
                  Descriptions
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ background: '#f8f9fb', border: 'none' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedICourts.map((court, idx) => (
              <TableRow
                key={court.id}
                sx={{
                  background: idx % 2 === 0 ? '#fff' : '#f8f9fb',
                  '&:last-child td, &:last-child th': { border: 0 },
                  border: 'none',
                  boxShadow: 'none',
                  minHeight: 56,
                }}>
                <TableCell
                  sx={{
                    border: 'none',
                    fontSize: 16,
                    minWidth: 250,
                    width: 300,
                  }}>
                  {court.name}
                </TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{court.name}</TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{court.sport_type}</TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{court.court_type}</TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{court.is_active}</TableCell>
                <TableCell align="right" sx={{ border: 'none', minWidth: 100, width: 100 }}>
                  <IconButton size="small" sx={{ mr: 1 }} onClick={() => onEdit?.(court)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete?.(court)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        count={Math.ceil(totalRows / rowsPerPage)}
        page={page + 1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        totalRows={totalRows}
      />
    </Box>
  )
}
