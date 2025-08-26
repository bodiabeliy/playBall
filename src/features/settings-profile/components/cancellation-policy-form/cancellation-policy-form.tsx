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
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { UpdateSectionButton } from '../../update-section-button/update-section-button';
import type { IClubSettings } from '../../../../app/providers/types/club';
import { getClubSettings, updateClubSettings } from '../../../../app/services/ClubService';
import { useAppSelector, useAppDispatch } from '../../../../app/providers/store-helpers';
import { clubSelector, clubSettingsSelector } from '../../../../app/providers/reducers/ClubSlice';

// Define interface for section configuration
interface SectionConfig {
  id: string;
  title: string;
  subTitle?:string,
  content: (props: {
    formData: IClubSettings;
    handleFieldChange: <T extends keyof IClubSettings>(field: T, value: IClubSettings[T]) => void;
  }) => ReactNode;
}


export function CancellationPolicyForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentClub = useAppSelector(clubSelector);
  const clubSettings = useAppSelector(clubSettingsSelector);
  const dispatch = useAppDispatch();

  // Initialize form data with default values
  const [formData, setFormData] = useState<IClubSettings>({
    cancellation_enabled: false,
    cancellation_duration: 1
  });

  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cancellationPolicy: false,
  });
  
  // Fetch club settings when component mounts or club changes
  useEffect(() => {
    if (currentClub?.id) {
      dispatch(getClubSettings(currentClub.id));
    }
  }, [currentClub?.id, dispatch]);
  
  // Update form data when club settings change in Redux store
  useEffect(() => {
    if (clubSettings) {
      console.log('Updating form data with club settings:', clubSettings);
      setFormData(clubSettings);
    }
  }, [clubSettings]);

  const handleFieldChange = <T extends keyof IClubSettings>(field: T, value: IClubSettings[T]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = useCallback((sectionId: string) => {
    // If the section is currently expanded and we're closing it, save the data
    if (expandedSections[sectionId] && currentClub?.id) {
      console.log("Saving cancellation policy data:", formData);
      
      // Only dispatch if we have values to update
      if (formData && (formData.cancellation_enabled !== undefined || formData.cancellation_duration !== undefined)) {
        dispatch(updateClubSettings(currentClub.id, formData));
      }
    }
    
    // Toggle the section
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, [currentClub, formData, expandedSections, dispatch]);

  // Define CancellationPolicySection component here
  const CancellationPolicySection = ({ formData, handleFieldChange }: {
    formData: IClubSettings;
    handleFieldChange: <T extends keyof IClubSettings>(field: T, value: IClubSettings[T]) => void;
  }) => {
    // Ensure we have default values for form fields
    const cancellationEnabled = formData.cancellation_enabled !== undefined ? formData.cancellation_enabled : false;
    const cancellationDuration = formData.cancellation_duration !== undefined ? formData.cancellation_duration : 1;

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
                  backgroundColor: cancellationEnabled ? '#034C53' : '#E5E5E5',
                  transition: 'background-color 0.3s ease'
                }}
              />
              <Box
                component="span"
                onClick={() => handleFieldChange('cancellation_enabled', !cancellationEnabled)}
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
                  left: cancellationEnabled ? '18px' : '2px',
                  bottom: '2px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: 'left 0.3s ease'
                }}
              />
            </Box>
          </Box>

          {/* Hours Selection - only shown if cancellations are allowed */}
          {cancellationEnabled && (
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
                  value={cancellationDuration}
                  onChange={(e) => handleFieldChange('cancellation_duration', Number(e.target.value))}
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
                <UpdateSectionButton<IClubSettings>
                  onClick={() => toggleSection(section.id)} 
                  isAccordionCollapse={expandedSections[section.id]} 
                  formData={formData}
                  sectionId={section.id}
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
