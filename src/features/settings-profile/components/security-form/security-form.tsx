import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  Stack,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { UpdateSectionButton } from '../../update-section-button/update-section-button';
// Import the section component from the same directory
import { SecuritySection, type SecurityFormData } from './security-form-sections';
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers';
import { changePassword } from '../../../../app/services/UserService';
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice';
import { getClubSettings } from '../../../../app/services/ClubService';

// Define interface for section configuration
interface SectionConfig {
  id: string;
  title: string;
  subTitle?: string;
  content: (props: {
    formData: SecurityFormData;
    handleFieldChange: <T extends keyof SecurityFormData>(field: T, value: SecurityFormData[T]) => void;
  }) => ReactNode;
}

export function SecurityForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const currentClub = useAppSelector(clubSelector);
  
  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    security: false,
  });

    // Fetch club settings when component mounts or club changes
    useEffect(() => {
      if (currentClub?.id) {
        dispatch(getClubSettings(currentClub.id));
      }
    }, [currentClub?.id, dispatch]);

    
  // Initialize form data with default values
  const [formData, setFormData] = useState<SecurityFormData>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    general: ''
  });

  const handleFieldChange = useCallback(<T extends keyof SecurityFormData>(field: T, value: SecurityFormData[T]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation errors when user types
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [validationErrors]);

  const validateForm = useCallback((): boolean => {
    const errors = {
      current_password: '',
      new_password: '',
      confirm_password: '',
      general: ''
    };
    
    let isValid = true;
    
    if (!formData.current_password) {
      errors.current_password = 'Current password is required';
      isValid = false;
    }
    
    if (!formData.new_password) {
      errors.new_password = 'New password is required';
      isValid = false;
    } else if (formData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters long';
      isValid = false;
    }
    
    if (!formData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
      isValid = false;
    } else if (formData.new_password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  }, [formData]);

  // Validation is now handled in toggleSection when the section is closing

  const toggleSection = useCallback((sectionId: string) => {
    // If the section is currently expanded and we're closing it, save the data
    if (expandedSections[sectionId]) {
      console.log("Saving password data:", formData);
      
      // Only dispatch if form is valid
      if (validateForm()) {
        dispatch(changePassword(formData.current_password, formData.new_password));
      } else {
        // Don't allow closing if validation fails
        return;
      }
      
      // Reset form after saving
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      setValidationErrors({
        current_password: '',
        new_password: '',
        confirm_password: '',
        general: ''
      });
    }
    
    // Toggle the section
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, [expandedSections, formData, dispatch, validateForm]);

  // Define sections configuration
  const sections: SectionConfig[] = [
    {
      id: 'security',
      title: !expandedSections.security ? 'Change Password' : 'Change Password',
      subTitle: !expandedSections.security 
        ? 'Change your account password to maintain security' 
        : 'Your password must be at least 8 characters long and include a number or symbol',
      content: ({ formData, handleFieldChange }) => (
        <SecuritySection 
          formData={formData} 
          handleFieldChange={handleFieldChange}
          errors={validationErrors}
        />
      ),
    },
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
                <UpdateSectionButton<SecurityFormData>
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
            {validationErrors.general && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {validationErrors.general}
              </Typography>
            )}
          </Box>
        </Accordion>
      ))}
    </Stack>
  );
}
