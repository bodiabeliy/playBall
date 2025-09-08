import { Box, Pagination, useMediaQuery, useTheme, PaginationItem } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

interface PaginationFooterProps {
  count: number
  page: number
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void
  rowsPerPage: number
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void
  totalRows: number
}

export function PaginationFooter({
  count,
  page,
  onPageChange,
  rowsPerPage,
  // onRowsPerPageChange,
  totalRows,
}: PaginationFooterProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // Only show actual page range based on the current page and items per page
  const startItem = Math.min((page - 1) * rowsPerPage + 1, totalRows)
  const endItem = Math.min(page * rowsPerPage, totalRows)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'space-between',
        px: 2.5,
        py: 2,
        background: '#fff',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        marginTop: 'auto',
        borderTop: '1px solid #eee',
      }}>
      {!isMobile ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 14, color: '#444' }}>
          <span>Showing {startItem} to {endItem}</span>
          <span>of {totalRows} entries</span>
        </Box>
      ) : null}
      <Pagination
        count={count}
        page={page}
        onChange={onPageChange}
        shape="circular"
        color="standard"
        siblingCount={1}
        boundaryCount={1}
        renderItem={(item) => (
        <PaginationItem
          slots={{ previous: KeyboardDoubleArrowLeftIcon, next: KeyboardArrowRightIcon, last:KeyboardDoubleArrowRightIcon }}
          {...item}
        />
        )}
        sx={{
          '& .MuiPaginationItem-root': {
            minWidth: 36,
            height: 36,
            margin: '0 4px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#444',
            border: 'none',
            backgroundColor: '#f1f1f1',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          },
          '& .Mui-selected': {
            backgroundColor: '#034C53 !important',
            color: 'white !important',
            '&:hover': {
              backgroundColor: '#023940 !important',
            },
          },
          '& .MuiPaginationItem-previousNext': {
            backgroundColor: '#f1f1f1',
            color: '#444',
          },
          '& .MuiPaginationItem-firstLast': {
            backgroundColor: '#f1f1f1',
            color: '#444',
          },
        }}
      />
    </Box>
  )
}
