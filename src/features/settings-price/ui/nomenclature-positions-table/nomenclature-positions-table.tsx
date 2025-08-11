import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material'
import SettingsIcon from '../../../../shared/assets/icons/settings_general.svg?react'
import type { NomenclaturePosition } from '../../model/types'
import ChevronIcon from '../../../../shared/assets/icons/chevron.svg?react'

interface NomenclaturePositionsTableProps {
  positions: NomenclaturePosition[]
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
}

export function NomenclaturePositionsTable({ positions, onMenuOpen }: NomenclaturePositionsTableProps) {
  return (
    <TableContainer sx={{ boxShadow: 'none', borderRadius: 0 }}>
      <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: 0 }}>
        <TableHead>
          <TableRow sx={{ background: '#f5f5f5' }}>
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1, pl: 2 }}>ID</TableCell>
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1 }}>Назва позиції</TableCell>
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1 }}>Тип</TableCell>
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1 }}>Кількість</TableCell>
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1 }}>Сума</TableCell>
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1 }}>Собівартість</TableCell>
            <TableCell align="right" sx={{ border: 'none', p: 1 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((row, idx) => (
            <TableRow
              key={row.id + idx}
              sx={{
                background: idx % 2 === 0 ? '#fff' : '#f5f7fe',
                '&:last-child td, &:last-child th': { border: 0 },
                border: 'none',
                boxShadow: 'none',
                minHeight: 56,
              }}>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5, pl: 2 }}>{row.id}</TableCell>
              <TableCell contentEditable sx={{ border: 'none', fontSize: 16, p: 0.5 }}>
                {row.name}
              </TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5, display: 'flex', alignItems: 'center' }}>
                <Select
                  value={row.type}
                  variant="standard"
                  onChange={(e) => {
                    console.log(e.target.value)
                  }}
                  sx={{
                    border: 'none',
                    width: 'auto',
                    minWidth: 'auto',
                    '& .MuiInputBase-input': {
                      paddingRight: '4px !important',
                    },
                    '& .MuiSelect-icon': {
                      display: 'none',
                    },
                    '&:before': {
                      display: 'none',
                    },
                    '&:after': {
                      display: 'none',
                    },
                  }}>
                  <MenuItem value="product">Товар</MenuItem>
                  <MenuItem value="service">Послуга</MenuItem>
                </Select>
                <ChevronIcon style={{ transform: 'rotate(90deg)' }} />
              </TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5 }}>{row.cost.toFixed(2)} ₴</TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5 }}>{row.quantity}</TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5 }}>{row.sum.toFixed(2)} грн.</TableCell>
              <TableCell align="right" sx={{ border: 'none', p: 0.5 }}>
                <IconButton size="small" onClick={onMenuOpen}>
                  <SettingsIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
