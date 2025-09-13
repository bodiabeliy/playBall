import React from 'react'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { UniversalDateTimeRangePicker, SimpleUniversalDateTimeRangePicker } from '../universal-date-time-range-picker'
import type { DateRange } from '@mui/x-date-pickers-pro'

export const DateTimeRangePickerExample = () => {
  const [dateTimeRange, setDateTimeRange] = React.useState<DateRange<Date>>([null, null])

  const handleDateTimeRangeChange = (newValue: DateRange<Date>) => {
    setDateTimeRange(newValue)
    console.log('Date Time Range changed:', newValue)
  }

  const handleSimpleDateTimeRangeChange = (newValue: DateRange<Date>) => {
    console.log('Simple Date Time Range changed:', newValue)
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h5" gutterBottom>Date Time Range Picker Examples</Typography>

      <Stack spacing={4}>
        {/* Example 1: Basic Usage with External State */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 0 30px rgba(52,52,52,0.06)' }}>
          <Typography variant="h6" gutterBottom>Basic Usage with External State</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This example demonstrates the controlled component with external state management.
          </Typography>

          <UniversalDateTimeRangePicker
            value={dateTimeRange}
            onChange={handleDateTimeRangeChange}
            startLabel="Start Date & Time"
            endLabel="End Date & Time"
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" display="block">
              Selected Range:
            </Typography>
            <Typography variant="body2">
              Start: {dateTimeRange[0] ? dateTimeRange[0].toLocaleString() : 'Not selected'}
            </Typography>
            <Typography variant="body2">
              End: {dateTimeRange[1] ? dateTimeRange[1].toLocaleString() : 'Not selected'}
            </Typography>
          </Box>
        </Paper>

        {/* Example 2: Simple Usage with Internal State */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 0 30px rgba(52,52,52,0.06)' }}>
          <Typography variant="h6" gutterBottom>Simple Usage with Internal State</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This example uses the SimpleUniversalDateTimeRangePicker which manages its own state internally.
          </Typography>

          <SimpleUniversalDateTimeRangePicker
            onRangeChange={handleSimpleDateTimeRangeChange}
            startLabel="Check-in"
            endLabel="Check-out"
          />
        </Paper>

        {/* Example 3: Custom Formatting */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 0 30px rgba(52,52,52,0.06)' }}>
          <Typography variant="h6" gutterBottom>Custom Formatting</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This example uses a custom date format and min/max date restrictions.
          </Typography>

          <SimpleUniversalDateTimeRangePicker
            format="yyyy-MM-dd HH:mm"
            startLabel="Season Start"
            endLabel="Season End"
            minDate={new Date('2023-01-01')}
            maxDate={new Date('2025-12-31')}
          />
        </Paper>
      </Stack>
    </Box>
  )
}

export default DateTimeRangePickerExample
