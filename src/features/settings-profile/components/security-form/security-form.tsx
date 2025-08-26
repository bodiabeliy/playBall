import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  Stack,
} from '@mui/material'
import { useState } from 'react';
import type { ReactNode } from 'react';
import { UpdateSectionButton } from '../../update-section-button/update-section-button';
// Import the section component from the same directory
import { SecuritySection } from './security-section';
import type { IProfile } from '../../../../app/providers/types/user';

// Define interface for section configuration
interface SectionConfig {
  id: string;
  title: string;
  subTitle?: string;
  content: (props: {
    formData: IProfile;
    handleFieldChange: <T extends keyof IProfile>(field: T, value: IProfile[T]) => void;
  }) => ReactNode;
}

export function SecurityForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    security: false,
  });

  // Initialize form data with IProfile structure
  const [formData, setFormData] = useState<IProfile>({
    first_name: '',
    last_name: '',
    middle_name: '',
    phone: '',
    email: '',
    current_password: '',
    new_password: '',
    repeat_password: '',
  });

  const handleFieldChange = <T extends keyof IProfile>(field: T, value: IProfile[T]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = (sectionId: string, data?: IProfile) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
    
    // If data is provided (on save) and section is being closed, handle the update
    if (data && expandedSections[sectionId]) {
      console.log(`Saving security data for ${sectionId}:`, data);
      // Here you would typically call an API to save the data
      // For example: api.updateUserPassword(data);
    }
  };

  // Define sections configuration
  const sections: SectionConfig[] = [
    {
      id: 'security',
      title: 'Change Password',
      subTitle:!expandedSections.security ? 'To change your password, we’ll first send a confirmation link to your email.':"Your password must be at least 8 characters long and include a number or symbol",
      content: ({ formData, handleFieldChange }) => (
        <SecuritySection 
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
                <UpdateSectionButton<IProfile> 
                  onClick={(data) => toggleSection(section.id, data)} 
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
