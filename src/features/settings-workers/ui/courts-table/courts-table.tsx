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
import type { SelectChangeEvent } from '@mui/material'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { PaginationFooter } from '../pagination-footer'
import type { ICourt } from '../../../../app/providers/types/court'

import EditIcon from "../../../../shared/assets/icons/edit.svg?react"
import TrashIcon from "../../../../shared/assets/icons/trash.svg?react"


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
  
  // State for column resizing
  const [columnWidths, setColumnWidths] = useState({
    name: 100,
    sport_type: 120,
    court_type: 120,
    status: 120,
    description: 200,
    actions: 120
  })
  const [resizing, setResizing] = useState<{column: string; startX: number} | null>(null)

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
  
  // Column resize handlers
  const handleResizeStart = (column: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizing({
      column,
      startX: e.clientX
    });
  };
  
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;
    
    const difference = e.clientX - resizing.startX;
    const newWidth = Math.max(100, columnWidths[resizing.column as keyof typeof columnWidths] + difference);
    
    setColumnWidths(prev => ({
      ...prev,
      [resizing.column]: newWidth
    }));
    
    setResizing({
      ...resizing,
      startX: e.clientX
    });
  }, [resizing, columnWidths]);
  
  const handleResizeEnd = useCallback(() => {
    setResizing(null);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.body.style.userSelect = '';
  }, [handleResizeMove]);

  // Add and remove event listeners
  useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.userSelect = 'none';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.userSelect = '';
    };
  }, [resizing, handleResizeMove, handleResizeEnd]);
  
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
  }, [courts, sortField, sortDirection, currentSportType, searchQuery]);

  // Create a resizer component for reuse
  const ColumnResizer = ({ column }: { column: string }) => (
    <Box
      sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        height: '100%',
        width: '8px',
        cursor: 'col-resize',
        zIndex: 1,
        opacity: 0, 
        '&:hover': {
          opacity: 0.3,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          right: '2px',
          transform: 'translateY(-50%)',
          height: '24px',
          width: '2px',
          backgroundColor: '#6e6e6e',
          opacity: resizing?.column === column ? 1 : 0.3,
        }
      }}
      onMouseDown={(e) => handleResizeStart(column, e)}
    />
  );

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
      <TableContainer 
        sx={{
          boxShadow: 'none', 
          borderRadius: 0,
          position: 'relative',
          cursor: resizing ? 'col-resize' : 'default'
        }}
      >
        <Table
          sx={{
            minWidth: 1200,
            overflow: "scroll",
            borderCollapse: 'separate',
            borderSpacing: 0,
            tableLayout: 'fixed', // Changed from 'auto' to 'fixed' for resizable columns
          }}>
          <TableHead>
            <TableRow sx={{ background: '#f8f9fb' }}>
              <TableCell 
                align="left"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none', 
                  position: 'relative',
                  minWidth: 160, 
                  width: `${columnWidths.name}px`,
                  transition: resizing ? 'none' : 'width 0.2s ease',
                }}
              >
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                  sx={{ color: '#000' }}>
                  Court
                </TableSortLabel>
                <ColumnResizer column="name" />
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  position: 'relative',
                  width: `${columnWidths.sport_type}px`,
                  transition: resizing ? 'none' : 'width 0.2s ease',
                }}
              >
                <TableSortLabel
                  active={sortField === 'sport_type'}
                  direction={sortField === 'sport_type' ? sortDirection : 'asc'}
                  onClick={() => handleSort('sport_type')}
                  sx={{ color: '#000' }}>
                  Sport
                </TableSortLabel>
                <ColumnResizer column="sport_type" />
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  position: 'relative',
                  width: `${columnWidths.court_type}px`,
                  transition: resizing ? 'none' : 'width 0.2s ease',
                }}
              >
                <TableSortLabel
                  active={sortField === 'court_type'}
                  direction={sortField === 'court_type' ? sortDirection : 'asc'}
                  onClick={() => handleSort('court_type')}
                  sx={{ color: '#000' }}>
                  Court Type
                </TableSortLabel>
                <ColumnResizer column="court_type" />
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  position: 'relative',
                  width: `${columnWidths.status}px`,
                  transition: resizing ? 'none' : 'width 0.2s ease',
                }}
              >
                <TableSortLabel
                  active={sortField === 'is_active'}
                  direction={sortField === 'is_active' ? sortDirection : 'asc'}
                  onClick={() => handleSort('is_active')}
                  sx={{ color: '#000' }}>
                  Status
                </TableSortLabel>
                <ColumnResizer column="status" />
              </TableCell>
              <TableCell 
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  position: 'relative',
                  minWidth:800,
                  width: `${columnWidths.description}px`,
                  transition: resizing ? 'none' : 'width 0.2s ease',
                }}
              >
                <TableSortLabel
                  active={sortField === 'description'}
                  direction={sortField === 'description' ? sortDirection : 'asc'}
                  onClick={() => handleSort('description')}
                  sx={{ color: '#000' }}>
                  Description
                </TableSortLabel>
                <ColumnResizer column="description" />
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  fontSize: 14,
                  background: '#f8f9fb', 
                  border: 'none',
                  width: `${columnWidths.actions}px`,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                    <CircularProgress size={32} sx={{ color: '#034C53' }} />
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
                    width: `${columnWidths.name}px`,
                    maxWidth: `${columnWidths.name}px`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {court.name}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    border: 'none', 
                    fontSize: 16,
                    width: `${columnWidths.sport_type}px`,
                    maxWidth: `${columnWidths.sport_type}px`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {court.sport_type}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    border: 'none', 
                    fontSize: 16,
                    width: `${columnWidths.court_type}px`,
                    maxWidth: `${columnWidths.court_type}px`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {court.court_type}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    border: 'none', 
                    fontSize: 16,
                    width: `${columnWidths.status}px`,
                    maxWidth: `${columnWidths.status}px`,
                  }}>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      backgroundColor: court.is_active ? '#034C53' : '#DFDFDF',
                      color: court.is_active ? 'white' : 'black',
                    }}>
                    {court.is_active ? 'Active' : 'Inactive'}
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  border: 'none', 
                  fontSize: 16,
                  width: `${columnWidths.description}px`,
                  maxWidth: `${columnWidths.description}px`,
                  padding: '16px',
                  verticalAlign: 'top',
                }}>
                  <Box sx={{ 
                    padding: court.description?.length > 30 ? '8px' : '0',
                    borderRadius: '4px',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    lineHeight: 1.5,
                    minHeight: '24px',
                  }}>
                    {court.description || ''}
                  </Box>
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    border: 'none', 
                    minWidth: `${columnWidths.actions}px`, 
                    width: `${columnWidths.actions}px`,
                    maxWidth: `${columnWidths.actions}px`,
                  }}>
                  <IconButton size="small" sx={{ mr: 1 }} onClick={() => onEdit?.(court)}>
                    <EditIcon  />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete?.(court)}>
                    <TrashIcon />
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
