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

// Define interface for section configuration
interface SectionConfig {
  id: string;
  title: string;
  subTitle?:string,
  content: (props: {
    formData: CancellationPolicyData;
    handleFieldChange: <T extends keyof CancellationPolicyData>(field: T, value: CancellationPolicyData[T]) => void;
  }) => ReactNode;
}

// Define the type for our form data
interface CancellationPolicyData {
  allowCancellations: boolean;
  hoursBeforeStart: number;
}

export function CancellationPolicyForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cancellationPolicy: false,
  });

  
  // Initialize form data
  const [formData, setFormData] = useState<CancellationPolicyData>({
    allowCancellations: true,
    hoursBeforeStart: 6,
  });

  const handleFieldChange = <T extends keyof CancellationPolicyData>(field: T, value: CancellationPolicyData[T]) => {
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

  // Define CancellationPolicySection component here
  const CancellationPolicySection = ({ formData, handleFieldChange }: {
    formData: CancellationPolicyData;
    handleFieldChange: <T extends keyof CancellationPolicyData>(field: T, value: CancellationPolicyData[T]) => void;
  }) => {

    return (
      <Box sx={{}}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: '16px', 
          width: '100%', 
          mt: 2
        }}>
          {/* Allow Cancellations Toggle */}
          <Box sx={{ 
            display: 'block',
            alignItems: 'center',
            py: 2,
            width:"40%"
          }}>
            <Typography variant="body1">
              Allow clients to cancel bookings
            </Typography>
            <Box 
              component="span"
              sx={{ 
                display: 'inline-flex',
                width: 42,
                height: 24,
                position: 'relative'
              }}
            >
              <Box 
                component="span"
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '34px',
                  backgroundColor: formData.allowCancellations ? '#034C53' : '#E5E5E5',
                  transition: 'background-color 0.3s ease'
                }}
              />
              <Box
                component="span"
                onClick={() => handleFieldChange('allowCancellations', !formData.allowCancellations)}
                sx={{
                  position: 'absolute',
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  zIndex: 1
                }}
              />
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  height: '20px',
                  width: '20px',
                  left: formData.allowCancellations ? '18px' : '2px',
                  bottom: '2px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: 'left 0.3s ease'
                }}
              />
            </Box>
          </Box>

          {/* Hours Selection - only shown if cancellations are allowed */}
          {formData.allowCancellations && (
            <Box sx={{ 
              display: 'block',
              justifyContent: 'space-between',
              borderLeft: '1px solid #E5E5E5',
              alignItems: 'center',
              pt: 2,
              pl:4,
              width:"100%"
            }}>
              <Typography variant="body1">
                Cancellation allowed up to
              </Typography>
              <FormControl sx={{ width: '100%' }}>
                <Select
                  value={formData.hoursBeforeStart}
                  onChange={(e) => handleFieldChange('hoursBeforeStart', Number(e.target.value))}
                  displayEmpty
                  sx={{ 
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E5E5'
                    }
                  }}
                >
                  <MenuItem value={1}>1 hour before start</MenuItem>
                  <MenuItem value={2}>2 hours before start</MenuItem>
                  <MenuItem value={3}>3 hours before start</MenuItem>
                  <MenuItem value={6}>6 hours before start</MenuItem>
                  <MenuItem value={12}>12 hours before start</MenuItem>
                  <MenuItem value={24}>24 hours before start</MenuItem>
                  <MenuItem value={48}>48 hours before start</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // Define sections configuration
  const sections: SectionConfig[] = [
    {
      id: 'cancellationPolicy',
      title:!expandedSections.cancellationPolicy? 'Cancellation Policy':"Client Booking Cancellation",
      subTitle:'Allow clients to cancel their bookings from the app before the activity starts. Set how much time in advance cancellation is allowed',
      content: ({ formData, handleFieldChange }) => (
        <CancellationPolicySection 
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
