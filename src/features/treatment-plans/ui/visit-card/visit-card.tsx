import { Box, Typography, TextField, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { VisitHeader } from '../visit-header'
import { TreatmentItem } from '../treatment-item'
import { TimeSelector, TeethSelector, TeethChart } from '../../../../shared/ui'
import type { TeethChartType } from '../../../../shared/ui/teeth-chart/teeth-chart'

interface TreatmentItemData {
  id: string
  name: string
  quantity: number
  price: number
  statusColor: string
}

interface VisitCardProps {
  visitNumber: number
  doctorImage: string
  doctorName: string
  treatments: TreatmentItemData[]
  timeValue: string
  timeType: { label: string; value: string }
  comment: string
  onTimeTypeChange: (type: { label: string; value: string }) => void
  onTimeValueChange: (value: string) => void
  onTeethSelect: (option: TeethChartType) => void
  onCommentChange: (value: string) => void
  onDeleteVisit: () => void
  onDeleteTreatment: (id: string) => void
  teethType: TeethChartType
}

export function VisitCard({
  visitNumber,
  doctorImage,
  doctorName,
  treatments,
  timeValue,
  timeType,
  comment,
  onTimeTypeChange,
  onTimeValueChange,
  onTeethSelect,
  onCommentChange,
  onDeleteVisit,
  onDeleteTreatment,
  teethType,
}: VisitCardProps) {
  const totalPrice = treatments.reduce((sum, treatment) => sum + treatment.price * treatment.quantity, 0)

  return (
    <Box sx={{ borderRadius: 2, mb: { xs: 1, sm: 2 }, boxShadow: 1 }}>
      <VisitHeader
        visitNumber={visitNumber}
        doctorImage={doctorImage}
        doctorName={doctorName}
        onDelete={onDeleteVisit}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        <TimeSelector
          selectedType={timeType}
          onTypeChange={onTimeTypeChange}
          value={timeValue}
          onValueChange={onTimeValueChange}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TeethSelector onSelect={(option) => onTeethSelect(option as TeethChartType)} />
          <IconButton>
            <Delete />
          </IconButton>
        </Box>
      </Box>
      <TeethChart type={teethType} />
      <Box>
        {treatments.map((treatment) => (
          <TreatmentItem
            key={treatment.id}
            name={treatment.name}
            quantity={treatment.quantity}
            price={treatment.price}
            statusColor={treatment.statusColor}
            onDelete={() => onDeleteTreatment(treatment.id)}
          />
        ))}
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: 12, sm: 14 },
            lineHeight: '171%',
            letterSpacing: '0.01em',
            color: '#0029d9',
            textAlign: 'right',
            px: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 1 },
          }}>
          Ціна візиту: ₴ {totalPrice.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <TextField
          sx={{
            width: '100%',
            backgroundColor: '#f0f0f0',
          }}
          placeholder="Напишіть свій коментар..."
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
        />
      </Box>
    </Box>
  )
}
