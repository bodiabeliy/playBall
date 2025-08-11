import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import type { PricePosition } from '../../model/types'
import DotsIcon from '../../../../shared/assets/icons/dots.svg?react'
import { useState } from 'react'

interface TemplateTableProps {
  positions: PricePosition[]
  onPositionsReorder?: (reorderedPositions: PricePosition[]) => void
}

export function TemplateTable({ positions, onPositionsReorder }: TemplateTableProps) {
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
                <DotsIcon style={{ color: '#000', fillOpacity: 0.56, cursor: 'grab' }} />
              </TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5 }}>{row.name}</TableCell>
              <TableCell sx={{ border: 'none', fontSize: 16, p: 0.5 }}>{row.price.toFixed(2)} ₴</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
