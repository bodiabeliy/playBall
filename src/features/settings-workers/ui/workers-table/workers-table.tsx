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
import type { Worker } from '../../model'

type SortField = 'name' | 'email' | 'branch' | 'role' | 'apiId'
type SortDirection = 'asc' | 'desc'

interface WorkersTableProps {
  workers: Worker[]
  totalRows: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onEdit?: (worker: Worker) => void
  onDelete?: (worker: Worker) => void
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

export function WorkersTable({
  workers,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: WorkersTableProps) {
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

  const sortedWorkers = useMemo(() => {
    return [...workers].sort((a, b) => {
      let comparison = 0

      if (sortField === 'role') {
        const roleA = getRolePriority(a.role)
        const roleB = getRolePriority(b.role)
        comparison = roleA - roleB
      } else {
        const valueA = a[sortField].toLowerCase()
        const valueB = b[sortField].toLowerCase()
        comparison = valueA.localeCompare(valueB)
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [workers, sortField, sortDirection])

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
        <Table
          sx={{
            minWidth: { xs: '100%', sm: 650 },
            borderCollapse: 'separate',
            borderSpacing: 0,
            tableLayout: 'auto',
          }}>
          <TableHead>
            <TableRow sx={{ background: '#f8f9fb' }}>
              <TableCell sx={{ width: 8, p: 0, background: '#f8f9fb' }} />
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', minWidth: 180, width: 220 }}>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                  sx={{ color: '#000' }}>
                  ПІБ
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'email'}
                  direction={sortField === 'email' ? sortDirection : 'asc'}
                  onClick={() => handleSort('email')}
                  sx={{ color: '#000' }}>
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'branch'}
                  direction={sortField === 'branch' ? sortDirection : 'asc'}
                  onClick={() => handleSort('branch')}
                  sx={{ color: '#000' }}>
                  Філія
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'role'}
                  direction={sortField === 'role' ? sortDirection : 'asc'}
                  onClick={() => handleSort('role')}
                  sx={{ color: '#000' }}>
                  Роль
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'apiId'}
                  direction={sortField === 'apiId' ? sortDirection : 'asc'}
                  onClick={() => handleSort('apiId')}
                  sx={{ color: '#000' }}>
                  ID для API
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ background: '#f8f9fb', border: 'none' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedWorkers.map((worker, idx) => (
              <TableRow
                key={worker.apiId}
                sx={{
                  background: idx % 2 === 0 ? '#fff' : '#f8f9fb',
                  '&:last-child td, &:last-child th': { border: 0 },
                  border: 'none',
                  boxShadow: 'none',
                  minHeight: 56,
                }}>
                <TableCell
                  sx={{ p: 0, width: 8, background: 'transparent', border: 'none', height: '100%', minHeight: 56 }}>
                  <Box
                    sx={{ width: 4, height: '100%', minHeight: 56, borderRadius: '2px', background: worker.color }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    border: 'none',
                    fontSize: 16,
                    minWidth: 250,
                    width: 300,
                  }}>
                  {worker.name}
                </TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{worker.email}</TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{worker.branch}</TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{worker.role}</TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>{worker.apiId}</TableCell>
                <TableCell align="right" sx={{ border: 'none', minWidth: 100, width: 100 }}>
                  <IconButton size="small" sx={{ mr: 1 }} onClick={() => onEdit?.(worker)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete?.(worker)}>
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
