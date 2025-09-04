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

export function LightingManagementForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentClub = useAppSelector(clubSelector);
  const clubSettings = useAppSelector(clubSettingsSelector);
  const dispatch = useAppDispatch();
  
  // Initialize form data with default values
  const [formData, setFormData] = useState<IClubSettings>({
    light_prior_duration: 10,
    light_after_duration: 10,
  });

  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    lightingManagement: false,
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
      console.log('Updating lighting management form data with club settings:', clubSettings);
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
      console.log("Saving lighting management data:", formData);
      
      // Only dispatch if we have values to update
      if (formData && (formData.light_prior_duration !== undefined || formData.light_after_duration !== undefined)) {
        dispatch(updateClubSettings(currentClub.id, formData));
      }
    }
    
    // Toggle the section
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, [currentClub, formData, expandedSections, dispatch]);

  // Define LightingManagementSection component here
  const LightingManagementSection = ({ formData, handleFieldChange }: {
    formData: IClubSettings;
    handleFieldChange: <T extends keyof IClubSettings>(field: T, value: IClubSettings[T]) => void;
  }) => {
    // Ensure we have default values for form fields
    const lightPriorDuration = formData.light_prior_duration !== undefined ? formData.light_prior_duration : 10;
    const lightAfterDuration = formData.light_after_duration !== undefined ? formData.light_after_duration : 10;

    return (
      <Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          width: '100%', 
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
                  value={lightPriorDuration}
                  onChange={(e) => handleFieldChange('light_prior_duration', Number(e.target.value))}
                  displayEmpty
                  sx={{ 
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E5E5'
                    }
                  }}
                >
                  <MenuItem value={2}>2 minutes</MenuItem>
                  <MenuItem value={5}>5 minutes</MenuItem>
                  <MenuItem value={10}>10 minutes</MenuItem>
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={20}>20 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
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
                  value={lightAfterDuration}
                  onChange={(e) => handleFieldChange('light_after_duration', Number(e.target.value))}
                  displayEmpty
                  sx={{ 
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E5E5'
                    }
                  }}
                >
                  <MenuItem value={2}>2 minutes</MenuItem>
                  <MenuItem value={5}>5 minutes</MenuItem>
                  <MenuItem value={10}>10 minutes</MenuItem>
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={20}>20 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Info note */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#E2EAEA',
            borderRadius: '8px',
            padding: 2,
            gap: 2,
            mt: 1
          }}>
            <InfoOutlineIcon />
            <Typography variant="body2" sx={{color: 'rgba(21, 22, 24, 0.8)'}}>
              This setting applies to all the courts with light management control
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // Define sections configuration
  const sections: SectionConfig[] = [
    {
      id: 'lightingManagement',
      title: !expandedSections.lightingManagement ? 'Lighting Management Settings' : 'Lights duration',
      subTitle: 'Define the prior and posterior time to the bookings where the lights will be ON on the court.',
      content: ({ formData, handleFieldChange }) => (
        <LightingManagementSection 
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
