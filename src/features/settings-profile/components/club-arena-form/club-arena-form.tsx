import {
  Box,
  // Button,
  // TextField,
  Typography,
  FormControl,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  TextField,
} from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FileUpload from '../../../file-upload';
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers';
import { useEffect } from 'react';
import { getAllClubs } from '../../../../app/services/ClubService';
import { clubSelector, clubsSelector } from '../../../../app/providers/reducers/ClubSlice';

export function ClubArenaForm() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useAppDispatch()
  const clubList = useAppSelector(clubsSelector)
  const currentClub = useAppSelector(clubSelector)

  useEffect(() => {
    dispatch(getAllClubs())
  }, [])

  console.log("clubList", clubList);
  console.log("currentClub", currentClub);

  return (
    <Accordion
      defaultExpanded={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? '100%' : 'auto',
        justifyContent: 'space-between',
        boxShadow:
          '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        background: '#fff',
        borderRadius: '16px',
        p: isMobile ? 2 : 3,
        mt: isMobile ? '16px' : '0',
        '&.MuiAccordion-root': {
          padding:1
        }
      }}>
      <Box>
          <AccordionSummary
            expandIcon={<ArrowForwardIosIcon />}
            sx={{
              padding: 0,
            }}>
            <Typography variant="h6">Contact info</Typography>
          </AccordionSummary>
      </Box>
       <form style={{ width: '100%', marginTop: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <span>ssas</span>
                <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
            </Box>
            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
            </Box>
            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
            </Box>
            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
            </Box>
            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
            </Box>
            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    rows={6}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="des"
                  />
              </FormControl>
            </Box>

            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <FileUpload />
              </FormControl>
            </Box>
            
          </form>
    </Accordion>
  )
}
