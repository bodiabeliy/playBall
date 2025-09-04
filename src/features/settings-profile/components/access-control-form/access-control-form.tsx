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
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import type { IClubSettings } from '../../../../app/providers/types/club';
import { getClubSettings, updateClubSettings } from '../../../../app/services/ClubService';
import { useAppSelector, useAppDispatch } from '../../../../app/providers/store-helpers';
import { clubSelector, clubSettingsSelector } from '../../../../app/providers/reducers/ClubSlice';
// Define interface for section configuration
interface SectionConfig {
  id: string;
  title: string;
  subTitle?: string,
  content: (props: {
    formData: IClubSettings;
    handleFieldChange: <T extends keyof IClubSettings>(field: T, value: IClubSettings[T]) => void;
  }) => ReactNode;
}

export function AccessControlForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentClub = useAppSelector(clubSelector);
  const clubSettings = useAppSelector(clubSettingsSelector);
  const dispatch = useAppDispatch();
  
  // Initialize form data with default values
  const [formData, setFormData] = useState<IClubSettings>({
    access_code_prior_duration: 30,
    access_code_after_duration: 30,
  });

  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    accessControl: false,
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
      console.log('Updating access control form data with club settings:', clubSettings);
      // Only update the fields that exist in clubSettings
      setFormData(prev => ({
        ...prev,
        access_code_prior_duration: clubSettings.access_code_prior_duration ?? prev.access_code_prior_duration,
        access_code_after_duration: clubSettings.access_code_after_duration ?? prev.access_code_after_duration,
      }));
    }
  }, [clubSettings]);

  const handleFieldChange = <T extends keyof IClubSettings>(field: T, value: IClubSettings[T]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = useCallback((sectionId: string, options?: { save?: boolean }) => {
    const shouldSave = options?.save !== false; // default true
    // If the section is currently expanded and we're closing it, save the data
    if (expandedSections[sectionId] && currentClub?.id && shouldSave) {
      console.log('Saving access control data:', formData);
      
      // Only dispatch if we have values to update
      if (formData && (formData.access_code_prior_duration !== undefined || formData.access_code_after_duration !== undefined)) {
        dispatch(updateClubSettings(currentClub.id, formData));
      }
    }
    
    // Toggle the section
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, [currentClub, formData, expandedSections, dispatch]);

  // Define AccessControlSection component here
  const AccessControlSection = ({ formData, handleFieldChange }: {
    formData: IClubSettings;
    handleFieldChange: <T extends keyof IClubSettings>(field: T, value: IClubSettings[T]) => void;
  }) => {
    // Ensure we have default values for form fields
    const priorDuration = formData.access_code_prior_duration !== undefined ? formData.access_code_prior_duration : 30;
    const afterDuration = formData.access_code_after_duration !== undefined ? formData.access_code_after_duration : 30;

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
                  value={priorDuration}
                  onChange={(e) => handleFieldChange('access_code_prior_duration', Number(e.target.value))}
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
                  value={afterDuration}
                  onChange={(e) => handleFieldChange('access_code_after_duration', Number(e.target.value))}
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
    // Figma: X:0, Y:0, Blur:30, Spread:0, Color #343434 @ 6%
    boxShadow: '0 0 30px rgba(52, 52, 52, 0.06)',
    background: '#fff',
    borderRadius: '16px',
    p: isMobile ? 2 : 3,
    // Remove the default MUI Accordion top divider
    '&::before': {
      display: 'none',
    },
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
          sx={accordionStyles}
        >
          <Box>
            <AccordionSummary
              expandIcon={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <UpdateSectionButton<IClubSettings> 
                    onClick={() => toggleSection(section.id)} 
                    isAccordionCollapse={expandedSections[section.id]} 
                    formData={formData}
                    sectionId={section.id}
                    expandedLabel="Update"
                    collapsedLabel="Show"
                  />
                  {expandedSections[section.id] && (
                    <UpdateSectionButton<IClubSettings>
                      onClick={() => toggleSection(section.id, { save: false })}
                      isAccordionCollapse={expandedSections[section.id]}
                      formData={formData}
                      sectionId={section.id}
                      expandedLabel="Close"
                      collapsedLabel="Show"
                    />
                  )}
                </Box>
              }
              onClick={(e) => e.preventDefault()} // Prevent the default accordion behavior
              sx={{
                padding: 0,
                cursor: 'default', // Remove pointer cursor
                // prevent MUI from rotating the expandIcon container or adding transitions
                '& .MuiAccordionSummary-expandIconWrapper': {
                  transform: 'none !important',
                  transition: 'none !important',
                },
                '& .MuiAccordionSummary-content': {
                  pointerEvents: 'none' // Make sure clicking on the content doesn't trigger accordion
                },
                boxShadow: 'none',
                '&:before': { display: 'none' },
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
