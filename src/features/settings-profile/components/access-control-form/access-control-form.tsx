import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  Stack,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material'
import { useState } from 'react';
import type { ReactNode } from 'react';
import { UpdateSectionButton } from '../../update-section-button/update-section-button';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
// Define interface for section configuration
interface SectionConfig {
  id: string;
  title: string;
  subTitle?: string,
  content: (props: {
    formData: AccessControlData;
    handleFieldChange: <T extends keyof AccessControlData>(field: T, value: AccessControlData[T]) => void;
  }) => ReactNode;
}

// Define the type for our form data
interface AccessControlData {
  minutesBeforeBooking: number;
  minutesAfterBooking: number;
}

export function AccessControlForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    accessControl: false,
  });

  // Initialize form data
  const [formData, setFormData] = useState<AccessControlData>({
    minutesBeforeBooking: 30,
    minutesAfterBooking: 30,
  });

  const handleFieldChange = <T extends keyof AccessControlData>(field: T, value: AccessControlData[T]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Define AccessControlSection component here
  const AccessControlSection = ({ formData, handleFieldChange }: {
    formData: AccessControlData;
    handleFieldChange: <T extends keyof AccessControlData>(field: T, value: AccessControlData[T]) => void;
  }) => {
    return (
      <Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          width: '100%', 
          maxWidth: '100%',
          mt: 2
        }}>
          {/* Time selection row */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: {xs: 'column', md: 'row'},
            gap: {xs: '24px', md: '40px'},
            width: '100%'
          }}>
            {/* Minutes before booking */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              width: {xs: '100%', md: '50%'},
              gap: 1
            }}>
              <Typography variant="body1" sx={{color: 'rgba(21, 22, 24, 0.6)'}}>
                Prior the booking
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.minutesBeforeBooking}
                  onChange={(e) => handleFieldChange('minutesBeforeBooking', Number(e.target.value))}
                  displayEmpty
                  sx={{ 
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E5E5'
                    }
                  }}
                >
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                  <MenuItem value={90}>90 minutes</MenuItem>
                  <MenuItem value={120}>120 minutes</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Minutes after booking */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              width: {xs: '100%', md: '50%'},
              gap: 1
            }}>
              <Typography variant="body1" sx={{color: 'rgba(21, 22, 24, 0.6)'}}>
                After the booking
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.minutesAfterBooking}
                  onChange={(e) => handleFieldChange('minutesAfterBooking', Number(e.target.value))}
                  displayEmpty
                  sx={{ 
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E5E5'
                    }
                  }}
                >
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                  <MenuItem value={90}>90 minutes</MenuItem>
                  <MenuItem value={120}>120 minutes</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Info note */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#E2EAEA',
            borderRadius: '12px',
            padding: 2,
            gap: 2,
            mt: 1
          }}>
           <InfoOutlineIcon />
            <Typography variant="body2" sx={{color: 'rgba(21, 22, 24, 0.8)'}}>
              This setting applies to all the access codes of the arena
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // Define sections configuration
  const sections: SectionConfig[] = [
    {
      id: 'accessControl',
      title: !expandedSections.accessControl ? 'Access Control Settings' : 'Access code validity',
      subTitle: 'Define how many minutes before and after a booking the access code that a player receives in Playball app is valid to open the doors in the Arena.',
      content: ({ formData, handleFieldChange }) => (
        <AccessControlSection 
          formData={formData} 
          handleFieldChange={handleFieldChange}
        />
      ),
    },
    // Add more sections as needed
  ];

  // Common accordion styles
  const accordionStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: isMobile ? '100%' : 'auto',
    justifyContent: 'space-between',
    boxShadow: '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    background: '#fff',
    borderRadius: '16px',
    p: isMobile ? 2 : 3,
    '&.MuiAccordion-root': {
      padding: 1
    }
  };

  return (
    <Stack spacing={2}>
      {sections.map((section) => (
        <Accordion
          key={section.id}
          defaultExpanded={false}
          expanded={expandedSections[section.id]}
          onChange={() => {}} // Disable accordion's default toggle behavior
          sx={accordionStyles}
        >
          <Box>
            <AccordionSummary
              expandIcon={
                <UpdateSectionButton 
                  onClick={() => toggleSection(section.id)} 
                  isAccordionCollapse={expandedSections[section.id]} 
                />
              }
              onClick={(e) => e.preventDefault()} // Prevent the default accordion behavior
              sx={{
                padding: 0,
                cursor: 'default', // Remove pointer cursor
                '& .MuiAccordionSummary-content': {
                  pointerEvents: 'none' // Make sure clicking on the content doesn't trigger accordion
                }
              }}
            >
             <Box sx={{display:"flex", flexDirection:"column"}}>
                 <Typography variant="h6">{section.title}</Typography>
                {
                    section?.subTitle && (
                    <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" sx={{ mb: 3, maxWidth:"65%" }}>
                        {section.subTitle}
                    </Typography>
                    )
                }
             </Box>
            </AccordionSummary>
          </Box>
          <Box sx={{ mt: expandedSections[section.id] ? 2 : 0 }}>
            {expandedSections[section.id] && section.content({
              formData,
              handleFieldChange
            })}
          </Box>
        </Accordion>
      ))}
    </Stack>
  );
}
