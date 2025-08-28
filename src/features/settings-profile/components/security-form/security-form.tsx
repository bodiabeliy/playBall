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
// Import the section components from the same directory
import { SecuritySection, CancellationSection, LightingSection, AccessCodeSection, type SecurityFormData } from './security-form-sections';
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers';
import { changePassword } from '../../../../app/services/UserService';
import { clubSelector, clubsSelector } from '../../../../app/providers/reducers/ClubSlice';
import { getAllClubs, getClubById, updateClub, getClubSettings } from '../../../../app/services/ClubService';
import type { IClub } from '../../../../app/providers/types/club';

// Security form configuration is defined inline in the return statement

// Define interface for club security section configuration
interface ClubSectionConfig {
  id: string;
  title: string;
  subTitle?: string;
  content: (props: {
    formData: IClub;
    handleFieldChange: <T extends keyof IClub>(field: T, value: IClub[T]) => void;
    handleFileUpload?: (field: keyof IClub, files: File[] | null) => void;
  }) => ReactNode;
}

export function SecurityForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const clubList = useAppSelector(clubsSelector);
  const currentClub = useAppSelector(clubSelector);
  
  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    security: false,
    cancellation: false,
    lighting: false,
    accessCode: false
  });

  // Fetch clubs and club data
  useEffect(() => {
    dispatch(getAllClubs());
  }, [dispatch]);

  useEffect(() => {
    if (clubList.length > 0) {
      dispatch(getClubById(clubList[0].id));
    }
  }, [clubList, dispatch]);
  
  // Fetch club settings when component mounts or club changes
  useEffect(() => {
    if (currentClub?.id) {
      dispatch(getClubSettings(currentClub.id));
    }
  }, [currentClub?.id, dispatch]);

  // Initialize club form data with default values
  const [clubFormData, setClubFormData] = useState<IClub>({
    id: 1,
    name: '',
    address: '',
    city: '',
    security_settings: {
      cancellation_policy: {
        enabled: false,
        time_limit: 0,
        penalty_percentage: 0
      },
      lighting_control: {
        automatic: false,
        turn_on_before: 0
      },
      access_code: {
        enabled: false,
        code: ''
      }
    }
  });
    
  // Initialize password form data with default values
  const [passwordFormData, setPasswordFormData] = useState<SecurityFormData>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Update club form data when club data changes in Redux store
  useEffect(() => {
    if (currentClub) {
      setClubFormData({
        ...currentClub,
        security_settings: currentClub.security_settings || {
          cancellation_policy: {
            enabled: false,
            time_limit: 0,
            penalty_percentage: 0
          },
          lighting_control: {
            automatic: false,
            turn_on_before: 0
          },
          access_code: {
            enabled: false,
            code: ''
          }
        }
      });
    }
  }, [currentClub]);

  // Validation state for password
  const [validationErrors, setValidationErrors] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    general: ''
  });

  const handlePasswordFieldChange = useCallback(<T extends keyof SecurityFormData>(field: T, value: SecurityFormData[T]) => {
    setPasswordFormData((prev: SecurityFormData) => ({
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

  const handleClubFieldChange = useCallback(<T extends keyof IClub>(field: T, value: IClub[T]) => {
    setClubFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleFileUpload = useCallback((field: keyof IClub, files: File[] | null) => {
    if (!files || files.length === 0) {
      // Clear the field if no files are provided
      if (field === 'gallery') {
        handleClubFieldChange(field, []);
      } else {
        handleClubFieldChange(field, '');
      }
      return;
    }

    if (field === 'gallery') {
      // For gallery, create an array of URLs
      const galleryUrls = files.map(file => URL.createObjectURL(file));
      handleClubFieldChange(field, galleryUrls);
    } else {
      // For single image fields, use the first file
      handleClubFieldChange(field, URL.createObjectURL(files[0]));
    }
  }, [handleClubFieldChange]);

  const validateForm = useCallback((): boolean => {
    const errors = {
      current_password: '',
      new_password: '',
      confirm_password: '',
      general: ''
    };
    
    let isValid = true;
    
    if (!passwordFormData.current_password) {
      errors.current_password = 'Current password is required';
      isValid = false;
    }
    
    if (!passwordFormData.new_password) {
      errors.new_password = 'New password is required';
      isValid = false;
    } else if (passwordFormData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters long';
      isValid = false;
    }
    
    if (!passwordFormData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
      isValid = false;
    } else if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  }, [passwordFormData]);

  const togglePasswordSection = useCallback((sectionId: string) => {
    // If the section is currently expanded and we're closing it, save the data
    if (expandedSections[sectionId]) {
      console.log("Saving password data:", passwordFormData);
      
      // Only dispatch if form is valid
      if (validateForm()) {
        dispatch(changePassword(passwordFormData.current_password, passwordFormData.new_password));
      } else {
        // Don't allow closing if validation fails
        return;
      }
      
      // Reset form after saving
      setPasswordFormData({
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
  }, [expandedSections, passwordFormData, dispatch, validateForm]);

  const toggleClubSection = useCallback((sectionId: string) => {
    // If the section is currently expanded and we're closing it, save the data
    if (expandedSections[sectionId] && currentClub?.id) {
      console.log(`Saving ${sectionId} data:`, clubFormData);
      
      // Only dispatch if we have values to update
      if (clubFormData) {
        dispatch(updateClub(currentClub.id, clubFormData));
      }
    }
    
    // Toggle the section
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, [currentClub, clubFormData, expandedSections, dispatch]);

  // Password section configuration is defined inline in the return statement

  // Define club security sections configuration
  const clubSections: ClubSectionConfig[] = [
    {
      id: 'cancellation',
      title: !expandedSections.cancellation ? 'Cancellation Policy' : 'Cancellation Policy',
      subTitle: 'Set your club\'s cancellation policy to manage bookings efficiently',
      content: ({ formData, handleFieldChange, handleFileUpload }) => (
        <CancellationSection 
          formData={formData} 
          handleFieldChange={handleFieldChange} 
          handleFileUpload={handleFileUpload}
        />
      ),
    },
    {
      id: 'lighting',
      title: !expandedSections.lighting ? 'Lighting Control' : 'Lighting Control',
      subTitle: 'Configure automatic lighting control for your courts',
      content: ({ formData, handleFieldChange, handleFileUpload }) => (
        <LightingSection 
          formData={formData} 
          handleFieldChange={handleFieldChange} 
          handleFileUpload={handleFileUpload}
        />
      ),
    },
    {
      id: 'accessCode',
      title: !expandedSections.accessCode ? 'Access Code Settings' : 'Access Code Settings',
      subTitle: 'Manage secure access to your club facilities',
      content: ({ formData, handleFieldChange, handleFileUpload }) => (
        <AccessCodeSection 
          formData={formData} 
          handleFieldChange={handleFieldChange} 
          handleFileUpload={handleFileUpload}
        />
      ),
    }
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
      {/* Password security section */}
      <Accordion
        key="security"
        defaultExpanded={false}
        expanded={expandedSections.security}
        onChange={() => {}} // Disable accordion's default toggle behavior
        sx={accordionStyles}
      >
        <Box>
          <AccordionSummary
            expandIcon={
              <UpdateSectionButton<SecurityFormData>
                onClick={() => togglePasswordSection('security')} 
                isAccordionCollapse={expandedSections.security} 
                formData={passwordFormData}
                sectionId="security"
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
              <Typography variant="h6">Change Password</Typography>
              <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" sx={{ mb: 3, maxWidth:"65%" }}>
                {!expandedSections.security 
                  ? 'Change your account password to maintain security' 
                  : 'Your password must be at least 8 characters long and include a number or symbol'}
              </Typography>
            </Box>
          </AccordionSummary>
        </Box>
        <Box sx={{ mt: expandedSections.security ? 2 : 0 }}>
          {expandedSections.security && (
            <SecuritySection 
              formData={passwordFormData} 
              handleFieldChange={handlePasswordFieldChange}
              errors={validationErrors}
            />
          )}
          {validationErrors.general && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {validationErrors.general}
            </Typography>
          )}
        </Box>
      </Accordion>
      
      {/* Club security sections */}
      {clubSections.map((section) => (
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
                <UpdateSectionButton<IClub> 
                  onClick={() => toggleClubSection(section.id)} 
                  isAccordionCollapse={expandedSections[section.id]} 
                  formData={clubFormData}
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
              formData: clubFormData,
              handleFieldChange: handleClubFieldChange,
              handleFileUpload
            })}
          </Box>
        </Accordion>
      ))}
    </Stack>
  );
}
