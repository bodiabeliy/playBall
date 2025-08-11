import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { mockTemplates, mockTemplatesRightSide } from '../../model/mock-data'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { TemplateAccordion } from '../template-accordion'
import { TemplateTable } from '../template-table'
import ArrowsIcon from '../../../../shared/assets/arrows.svg?react'
import ChevronIcon from '../../../../shared/assets/icons/chevron.svg?react'
import DotsIcon from '../../../../shared/assets/icons/dots.svg?react'
import SearchIcon from '@mui/icons-material/Search'
import type { PricePosition } from '../../model/types'

export function TemplatesContent() {
  const [expanded, setExpanded] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [templates, setTemplates] = useState(mockTemplates)
  const [templatesRightSide, setTemplatesRightSide] = useState(mockTemplatesRightSide)

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? [...expanded, panel] : expanded.filter((item) => item !== panel))
  }

  const handleLeftSideReorder = (sectionId: string, reorderedPositions: PricePosition[]) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((section) =>
        section.id === sectionId ? { ...section, positions: reorderedPositions } : section
      )
    )
  }

  const handleRightSideReorder = (sectionId: string, reorderedPositions: PricePosition[]) => {
    setTemplatesRightSide((prevTemplates) =>
      prevTemplates.map((section) =>
        section.id === sectionId ? { ...section, positions: reorderedPositions } : section
      )
    )
  }

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery('(min-width: 800px) and (max-width: 1600px)')
  const isLargeScreen = useMediaQuery('(min-width: 1600px)')

  return (
    <>
      <Box
        sx={{
          display: isSmallScreen ? 'flex' : 'grid',
          flexDirection: isSmallScreen ? 'column' : undefined,
          gridTemplateColumns: isLargeScreen
            ? 'minmax(260px,560px) 60px 1fr'
            : isMediumScreen
              ? '1fr 40px 1.2fr'
              : undefined,
          mt: 2,
          alignItems: 'start',
          mx: isLargeScreen ? 'auto' : 1,
          gap: 2,
          maxWidth: isLargeScreen ? 1400 : '100%',
          width: '100%',
        }}>
        <Box
          sx={{
            boxShadow:
              '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            background: '#fff',
            borderRadius: '16px',
            position: 'relative',
            p: 2,
            height: 'auto',
            mb: isSmallScreen ? 2 : 0,
            width: isSmallScreen ? '100%' : '100%',
            minWidth: isLargeScreen ? 260 : 180,
            maxWidth: isLargeScreen ? 560 : '100%',
            flex: isSmallScreen ? 'unset' : '1 1 auto',
          }}>
          <TextField
            placeholder="Пошук"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              endAdornment: <SearchIcon sx={{ color: '#000', fillOpacity: 0.56 }} />,
            }}
            sx={{ width: 200, background: '#fff' }}
          />
          <Box sx={{ mt: 2 }}>
            {templates.map((section) => (
              <TemplateAccordion
                key={section.id}
                section={section}
                expanded={expanded.includes(section.id)}
                onToggle={handleAccordionChange}>
                <TemplateTable
                  positions={section.positions}
                  onPositionsReorder={(reorderedPositions) => handleLeftSideReorder(section.id, reorderedPositions)}
                />
              </TemplateAccordion>
            ))}
          </Box>
        </Box>
        {isSmallScreen ? (
          <Box sx={{ width: '100%', mt: 3, display: 'flex', justifyContent: 'center' }}>
            <ArrowsIcon style={{ color: '#000', fillOpacity: 0.56 }} />
          </Box>
        ) : (
          <Box sx={{ height: '100%', mt: 3, display: 'flex', justifyContent: 'center' }}>
            <ArrowsIcon style={{ color: '#000', fillOpacity: 0.56 }} />
          </Box>
        )}
        <Box
          sx={{
            boxShadow:
              '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            background: '#fff',
            borderRadius: '16px',
            position: 'relative',
            p: 2,
            mt: isSmallScreen ? 2 : 0,
            width: isSmallScreen ? '100%' : '100%',
            minWidth: 0,
            flex: isSmallScreen ? 'unset' : '2 1 0',
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              justifyContent: 'space-between',
              flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
              gap: isSmallScreen ? 1 : 0,
            }}>
            <TextField
              placeholder="Пошук"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ width: isSmallScreen ? '100%' : 200, background: '#fff', mb: isSmallScreen ? 1 : 0 }}
              InputProps={{
                endAdornment: <SearchIcon sx={{ color: '#000', fillOpacity: 0.56 }} />,
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500, width: isSmallScreen ? '100%' : 'auto' }}>
              ДОДАТИ КАТЕГОРІЮ
            </Button>
          </Box>
          <Box>
            {templatesRightSide.map((section) => (
              <Accordion
                key={section.id}
                sx={{
                  my: 1,
                  borderRadius: 2,
                  border: `1px solid #0000bf`,
                  borderTop: 'none',
                }}>
                <AccordionSummary
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#e8e9fe',
                    borderTop: `1px solid #0000bf`,
                    borderRadius: 2,
                    '& .Mui-expanded': {
                      m: 0,
                    },
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Typography variant="body1" sx={{ flexGrow: 1, color: '#0000bf', fontWeight: 500, fontSize: 14 }}>
                        {section.name}
                      </Typography>
                      <ChevronIcon
                        style={{
                          color: '#0000bf',
                          width: 24,
                          height: 24,
                          transform: expanded ? 'rotate(270deg)' : 'rotate(90deg)',
                        }}
                      />
                    </Box>
                    <DeleteIcon sx={{ color: '#0000bf' }} />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  {section.positions.map((pos, idx) => (
                    <Box
                      key={pos.id + idx}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move'
                        // Store the section ID and position index for reordering
                        e.dataTransfer.setData('text/plain', JSON.stringify({ sectionId: section.id, index: idx }))
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.currentTarget.style.borderTop = '2px solid #1976d2'
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.style.borderTop = 'none'

                        const data = e.dataTransfer.getData('text/plain')
                        if (data) {
                          const { sectionId, index: draggedIndex } = JSON.parse(data)
                          if (sectionId === section.id && draggedIndex !== idx) {
                            const reorderedPositions = Array.from(section.positions)
                            const [removed] = reorderedPositions.splice(draggedIndex, 1)
                            reorderedPositions.splice(idx, 0, removed)
                            handleRightSideReorder(section.id, reorderedPositions)
                          }
                        }
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.borderTop = 'none'
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        background: idx % 2 === 0 ? '#fff' : '#f5f7fe',
                        '&:last-child td, &:last-child th': { border: 0 },
                        border: 'none',
                        boxShadow: 'none',
                        px: 2,
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' },
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        },
                      }}>
                      <DotsIcon style={{ color: '#000', fillOpacity: 0.56, cursor: 'grab' }} />
                      <Typography sx={{ flex: 1, fontSize: 16, ml: 2 }}>{pos.name}</Typography>
                      <Typography sx={{ width: 120, textAlign: 'right', fontSize: 16 }}>
                        {pos.price.toFixed(2)} ₴
                      </Typography>
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <DeleteIcon sx={{ color: '#000', fillOpacity: 0.56 }} />
                      </IconButton>
                    </Box>
                  ))}

                  <Box sx={{ display: 'flex', alignItems: 'end', pr: 3 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: 14, ml: 'auto' }}>Ціна: ₴ 256 287.00</Typography>
                  </Box>
                  <Box sx={{ p: 2, pt: 1, display: 'flex', gap: 1, alignItems: 'center', background: '#f0f0f0' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Коментар</Typography>
                    <TextField
                      variant="filled"
                      size="small"
                      multiline
                      minRows={1}
                      maxRows={3}
                      sx={{
                        width: '100%',
                        border: 'none',
                        borderRadius: 2,
                        '& .MuiFilledInput-root': {
                          background: '#f0f0f0',
                          border: 'none',
                          borderBottom: 'none',
                        },
                        '& .MuiFilledInput-root:before': {
                          borderBottom: 'none',
                        },
                        '& .MuiFilledInput-root:after': {
                          borderBottom: 'none',
                        },
                        '& .MuiFilledInput-root:hover': {
                          border: 'none',
                        },
                      }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}
