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
  Chip,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState, useMemo } from 'react'
import { PaginationFooter } from '..'
import type { IPricing, PricingResponse } from '../../../../app/providers/types/pricing'
import { EditPricingDialog } from '../edit-pricing/edit-pricing'

import EditIcon from "../../../../shared/assets/icons/edit.svg?react"
import TrashIcon from "../../../../shared/assets/icons/trash.svg?react"
import ViewIcon from "../../../../shared/assets/icons/eye.svg?react"

type SortField = 'name' | 'start_date' | 'end_date' | 'is_timed'
type SortDirection = 'asc' | 'desc'

interface PricingTableProps {
  pricings: PricingResponse;
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onEdit?: (pricing: IPricing) => void;
  onDelete?: (pricing: IPricing) => void;
  onView?: (pricing: IPricing) => void;
  searchQuery?: string;
  isLoading?: boolean;
}

export function PricingTable({
  pricings,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onView,
  searchQuery = '',
  isLoading = false
}: PricingTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [selectedPricing, setSelectedPricing] = useState<IPricing | null>(null)

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

  const sortedPricings = useMemo(() => {
    if (!pricings || !pricings.items || !Array.isArray(pricings.items)) {
      return [];
    }
    
    const pricingsList = [...pricings.items];
    
    return pricingsList.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '');
      } else if (sortField === 'start_date') {
        comparison = (a.start_date || '').localeCompare(b.start_date || '');
      } else if (sortField === 'end_date') {
        comparison = (a.end_date || '').localeCompare(b.end_date || '');
      } else if (sortField === 'is_timed') {
        comparison = (a.is_timed === b.is_timed) ? 0 : a.is_timed ? -1 : 1;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [pricings, sortField, sortDirection]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };



  const formatDaysOfWeek = (segments: IPricing['price_segments']) => {
    if (!segments || segments.length === 0) return 'All Days';
    
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const allDays = new Set<number>();
    
    segments.forEach(segment => {
      segment.days_of_week?.forEach(day => allDays.add(day));
    });
    
    if (allDays.size === 7) return 'All Days';
    
    return Array.from(allDays)
      .sort()
      .map(day => daysMap[day])
      .join(', ');
  };

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
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          flex: 1,
          minHeight: 0,
          padding: '0 1px',
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 1400,
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}>
          <TableHead>
            <TableRow sx={{ background: '#f8f9fb' }}>
              <TableCell 
                align="left"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none', 
                  minWidth: 120,
                }}
              >
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                  sx={{ color: '#000' }}>
                  Court
                </TableSortLabel>
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  minWidth: 100,
                }}
              >
                <TableSortLabel
                  active={sortField === 'start_date'}
                  direction={sortField === 'start_date' ? sortDirection : 'asc'}
                  onClick={() => handleSort('start_date')}
                  sx={{ color: '#000' }}>
                  Season
                </TableSortLabel>
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  minWidth: 80,
                }}
              >
                Sport
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  minWidth: 120,
                }}
              >
                Pricing Name
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  minWidth: 150,
                }}
              >
                Day of the week
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  minWidth: 120,
                }}
              >
                Time
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontSize: 14, 
                  background: '#f8f9fb', 
                  border: 'none',
                  minWidth: 80,
                }}
              >
                Price
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  fontSize: 14,
                  background: '#f8f9fb', 
                  border: 'none',
                  minWidth: 120,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                    <CircularProgress size={32} sx={{ color: '#034C53' }} />
                    <Box sx={{ ml: 2, fontSize: 16, color: '#666' }}>Loading pricing policies...</Box>
                  </Box>
                </TableCell>
              </TableRow>
            ) : Array.isArray(sortedPricings) && sortedPricings.length > 0 ? sortedPricings.map((pricing, idx) => (
              <TableRow
                key={pricing.id || idx}
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
                    fontWeight: 500,
                    verticalAlign: 'top',
                    padding: '16px',
                  }}>
                  {pricing.courts?.map(court => court.name).join(', ') || '-'}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    border: 'none', 
                    fontSize: 14,
                    verticalAlign: 'top',
                  }}>
                  <Typography variant="body2">
                    {formatDate(pricing.start_date)} - {formatDate(pricing.end_date)}
                  </Typography>
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    border: 'none', 
                    fontSize: 14,
                    verticalAlign: 'top',
                  }}>
                  <Chip 
                    label="Padel" 
                    size="small"
                    sx={{ 
                      backgroundColor: '#034C53', 
                      color: 'white',
                      fontSize: '12px',
                    }}
                  />
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    border: 'none', 
                    fontSize: 14,
                    verticalAlign: 'top',
                  }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {pricing.name}
                    </Typography>
                    {pricing.price_segments?.map((segment, segIdx) => (
                      <Typography key={segIdx} variant="body2" sx={{ fontSize: '12px', color: '#666' }}>
                        {segment.name}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    border: 'none', 
                    fontSize: 14,
                    verticalAlign: 'top',
                  }}>
                  <Typography variant="body2">
                    {formatDaysOfWeek(pricing.price_segments)}
                  </Typography>
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    border: 'none', 
                    fontSize: 14,
                    verticalAlign: 'top',
                  }}>
                  <Box>
                    {pricing.price_segments?.map((segment, segIdx) => (
                      <Typography key={segIdx} variant="body2">
                        {segment.start_time && segment.end_time ? (
                          `${new Date(segment.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - ${new Date(segment.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
                        ) : '-'}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    border: 'none', 
                    fontSize: 14,
                    verticalAlign: 'top',
                  }}>
                  <Box>
                    {pricing.price_segments?.map((segment, segIdx) => (
                      <Typography key={segIdx} variant="body2" sx={{ fontWeight: 500 }}>
                        €{segment.price}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    border: 'none', 
                    minWidth: 120,
                    verticalAlign: 'top',
                  }}>
                  <IconButton 
                    size="small" 
                    sx={{ mr: 1 }} 
                    onClick={() => onView?.(pricing)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    sx={{ mr: 1 }} 
                    onClick={() => {
                      setSelectedPricing(pricing);
                      setEditDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete?.(pricing)}>
                    <TrashIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  {searchQuery ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ fontSize: 16, fontWeight: 500, color: '#666' }}>
                        No pricing policies match your search
                      </Box>
                      <Box sx={{ fontSize: 14, color: '#888' }}>
                        Try using different keywords or checking for typos
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ fontSize: 16, fontWeight: 500, color: '#666' }}>
                        No pricing policies found
                      </Box>
                      <Box sx={{ fontSize: 14, color: '#888' }}>
                        Create your first pricing policy using the "New Price" button
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
      
      {/* Edit Pricing Dialog */}
      <EditPricingDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={(updatedPricing) => {
          if (onEdit && selectedPricing) {
            onEdit(updatedPricing);
          }
          setEditDialogOpen(false);
        }}
        pricing={selectedPricing}
      />
    </Box>
  )
}
