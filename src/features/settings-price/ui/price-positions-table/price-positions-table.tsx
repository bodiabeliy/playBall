import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import SettingsIcon from '../../../../shared/assets/icons/settings_general.svg?react'
import type { PricePosition } from '../../model/types'
import { useState } from 'react'

interface PricePositionsTableProps {
  positions: PricePosition[]
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
  onPositionsReorder?: (reorderedPositions: PricePosition[]) => void
}

export function PricePositionsTable({ positions, onMenuOpen, onPositionsReorder }: PricePositionsTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const reorderedPositions = Array.from(positions)
    const [removed] = reorderedPositions.splice(draggedIndex, 1)
    reorderedPositions.splice(dropIndex, 0, removed)

    onPositionsReorder?.(reorderedPositions)

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <TableContainer sx={{ boxShadow: 'none', borderRadius: 0 }}>
      <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: 0 }}>
        <TableHead>
          <TableRow sx={{ background: '#f5f5f5' }}>
            <TableCell sx={{ width: 20, p: 0, border: 'none' }} />
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1 }}>ID</TableCell>
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1 }}>Назва позиції</TableCell>
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1 }}>Ціна</TableCell>
            <TableCell sx={{ fontSize: 14, border: 'none', p: 1 }}>Собівартість</TableCell>
            <TableCell align="right" sx={{ border: 'none', p: 1 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((row, idx) => (
            <TableRow
              key={row.id + idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                border: 'none',
                minHeight: 56,
                backgroundColor: draggedIndex === idx ? '#f5f5f5' : idx % 2 === 0 ? '#fff' : '#f5f7fe',
                transform: draggedIndex === idx ? 'rotate(2deg)' : 'none',
                boxShadow: draggedIndex === idx ? '0 5px 10px rgba(0,0,0,0.15)' : 'none',
                opacity: draggedIndex === idx ? 0.5 : 1,
                borderTop:
                  dragOverIndex === idx && draggedIndex !== null && draggedIndex !== idx ? '2px solid #1976d2' : 'none',
              }}>
              <TableCell
                sx={{
                  p: 0,
                  pl: 2,
                  border: 'none',
                  height: '100%',
                }}>
                <DragHandleIcon sx={{ color: '#bdbdbd', cursor: 'grab' }} />
              </TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5 }}>{row.id}</TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5 }}>{row.name}</TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5 }}>{row.price.toFixed(2)} ₴</TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5 }}>{row.cost.toFixed(2)} ₴</TableCell>
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
