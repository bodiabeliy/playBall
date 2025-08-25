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

// Define interface for section configuration
interface SectionConfig {
  id: string;
  title: string;
  content: (props: {
    formData: SecurityFormData;
    handleFieldChange: <T extends keyof SecurityFormData>(field: T, value: SecurityFormData[T]) => void;
  }) => ReactNode;
}

// Define the type for our form data
interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function SecurityForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    security: false,
  });

  // Initialize form data
  const [formData, setFormData] = useState<SecurityFormData>({
    currentPassword: '', // Kept for API compatibility but not used in UI
    newPassword: '',
    confirmPassword: '',
  });

  const handleFieldChange = <T extends keyof SecurityFormData>(field: T, value: SecurityFormData[T]) => {
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

  // Define sections configuration
  const sections: SectionConfig[] = [
    {
      id: 'security',
      title: 'Security & Password',
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
              <Typography variant="h6">{section.title}</Typography>
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
