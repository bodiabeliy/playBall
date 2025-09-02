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
  CircularProgress,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { SelectChangeEvent } from '@mui/material'
import { useState, useMemo } from 'react'
import { PaginationFooter } from '../pagination-footer'
import type { ICourt } from '../../../../app/providers/types/court'

type SortField = 'name' | 'sport_type' | 'court_type' | 'is_active' | 'description'
type SortDirection = 'asc' | 'desc'

interface CourtsResponse {
  items: ICourt[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface CourtsTableProps {
  courts: CourtsResponse;
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onEdit?: (court: ICourt) => void;
  onDelete?: (court: ICourt) => void;
  activeTab?: number; // Add activeTab prop to filter by sport type
  searchQuery?: string; // Add searchQuery prop for search filtering
  isLoading?: boolean; // Add loading state
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
  activeTab = 0,
  searchQuery = '',
  isLoading = false
}: CourtsTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Map activeTab to sport type for filtering
  const sportTypeMap = ['padel', 'tennis', 'pickleball'];
  const currentSportType = sportTypeMap[activeTab];

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

  const sortedICourts = useMemo(() => {
    // Check if courts and courts.items exist and courts.items is an array
    if (!courts || !courts.items || !Array.isArray(courts.items)) {
      console.error("Courts data is not in expected format:", courts);
      return [];
    }
    
    // Log for debugging
    console.log(`Table received ${courts.items.length} courts, search: "${searchQuery}", sportType: "${currentSportType}"`);
    
    // We're now using server-side filtering, so we just need to handle sorting
    const courtsList = [...courts.items];
    
    // Sort the courts
    return courtsList.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '');
      } else if (sortField === 'sport_type') {
        comparison = (a.sport_type || '').localeCompare(b.sport_type || '');
      } else if (sortField === 'court_type') {
        comparison = (a.court_type || '').localeCompare(b.court_type || '');
      } else if (sortField === 'description') {
        comparison = (a.description || '').localeCompare(b.description || '');
      } else if (sortField === 'is_active') {
        // Sort booleans - true values first by default
        comparison = (a.is_active === b.is_active) ? 0 : a.is_active ? -1 : 1;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [courts, sortField, sortDirection, currentSportType, searchQuery])

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
                  Court Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'sport_type'}
                  direction={sortField === 'sport_type' ? sortDirection : 'asc'}
                  onClick={() => handleSort('sport_type')}
                  sx={{ color: '#000' }}>
                  Sport Type
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'court_type'}
                  direction={sortField === 'court_type' ? sortDirection : 'asc'}
                  onClick={() => handleSort('court_type')}
                  sx={{ color: '#000' }}>
                  Court Type
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'is_active'}
                  direction={sortField === 'is_active' ? sortDirection : 'asc'}
                  onClick={() => handleSort('is_active')}
                  sx={{ color: '#000' }}>
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none' }}>
                <TableSortLabel
                  active={sortField === 'description'}
                  direction={sortField === 'description' ? sortDirection : 'asc'}
                  onClick={() => handleSort('description')}
                  sx={{ color: '#000' }}>
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ background: '#f8f9fb', border: 'none' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                    <CircularProgress size={32} sx={{ color: '#3b5efb' }} />
                    <Box sx={{ ml: 2, fontSize: 16, color: '#666' }}>Loading courts...</Box>
                  </Box>
                </TableCell>
              </TableRow>
            ) : Array.isArray(sortedICourts) && sortedICourts.length > 0 ? sortedICourts.map((court, idx) => (
              <TableRow
                key={court.id || idx}
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
                    minWidth: 180,
                    fontWeight: 500,
                  }}>
                  {court.name || 'N/A'}
                </TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      backgroundColor: 
                        court.sport_type?.toLowerCase() === 'padel' ? '#E6F0F2' : 
                        court.sport_type?.toLowerCase() === 'tennis' ? '#F2EDE6' : 
                        court.sport_type?.toLowerCase() === 'pickleball' ? '#E6F2E9' : '#f0f0f0',
                      color: 
                        court.sport_type?.toLowerCase() === 'padel' ? '#034C53' : 
                        court.sport_type?.toLowerCase() === 'tennis' ? '#734C09' : 
                        court.sport_type?.toLowerCase() === 'pickleball' ? '#097331' : '#333',
                    }}>
                    {court.sport_type || 'N/A'}
                  </Box>
                </TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>
                  {court.court_type || 'N/A'}
                </TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      backgroundColor: court.is_active ? '#E6F2E9' : '#F9E3E3',
                      color: court.is_active ? '#097331' : '#B30000',
                    }}>
                    {court.is_active ? 'Active' : 'Inactive'}
                  </Box>
                </TableCell>
                <TableCell sx={{ border: 'none', fontSize: 16 }}>
                  {court.description || 'N/A'}
                </TableCell>
                <TableCell align="right" sx={{ border: 'none', minWidth: 100, width: 100 }}>
                  <IconButton size="small" sx={{ mr: 1 }} onClick={() => onEdit?.(court)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete?.(court)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  {searchQuery ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ fontSize: 16, fontWeight: 500, color: '#666' }}>
                        No courts match your search
                      </Box>
                      <Box sx={{ fontSize: 14, color: '#888' }}>
                        Try using different keywords or checking for typos
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ fontSize: 16, fontWeight: 500, color: '#666' }}>
                        No courts available for {currentSportType || 'this sport type'}
                      </Box>
                      <Box sx={{ fontSize: 14, color: '#888' }}>
                        Add your first court using the "New Court" button
                      </Box>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            )}
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
