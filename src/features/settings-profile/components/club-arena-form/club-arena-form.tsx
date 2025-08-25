import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  Stack,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getAllClubs, getClubById } from '../../../../app/services/ClubService';
import { clubSelector, clubsSelector } from '../../../../app/providers/reducers/ClubSlice';
import { useFormValidation } from '../../../../shared/hooks/use-form-field';
import type { IClub } from '../../../../app/providers/types/club';
import { UpdateSectionButton } from '../../update-section-button/update-section-button';
import { ContactInfoSection, LocationSection, AmenitiesSection } from './club-arena-form-sections';
import { WorkingDaysSection } from '../../../settings-schedule/components/working-days-section/working-days-section';

// Define interface for section configuration
interface SectionConfig {
  id: string;
  title: string;
  content: (props: {
    formData: IClub;
    handleFieldChange: <T extends keyof IClub>(field: T, value: IClub[T]) => void;
    handleFileUpload: (field: keyof IClub, files: File[] | null) => void;
  }) => ReactNode;
}

export function ClubArenaForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const clubList = useAppSelector(clubsSelector);
  const currentClub = useAppSelector(clubSelector);

  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contactInfo: false,
    location: false,
    openHours: false,
    amenities: false,
    images: false,
    // Add more sections as needed
  });

  useEffect(() => {
    dispatch(getAllClubs());
  }, [dispatch]);

  useEffect(() => {
    if (clubList.length > 0) {
      dispatch(getClubById(clubList[0].id));
    }
  }, [clubList, dispatch]);

  const validateSignUp = (data: IClub) => ({
    id: '',
    name: data.name ? '' : 'Name is required',
    address: data.address ? '' : 'Address is required',
    city: data.city ? '' : 'City is required',
    // Add more validations as needed
  });

  const { formData, setFormData, handleFieldChange } = useFormValidation<IClub>(
    {
      id: 1,
      name: '',
      address: '',
      city: '',
      latitude: 1,
      longitude: 1,
      amenities: [],
      phone: '',
      email: '',
      about: '',
      website: '',
      instagram: '',
      facebook: "",
      logo_image: "",
      banner_image: "",
      gallery: [],
      working_hours: []
    },
    validateSignUp
  );

  useEffect(() => {
    if (currentClub) {
      setFormData({
        id: currentClub.id,
        name: currentClub.name,
        address: currentClub.address,
        city: currentClub.city,
        latitude: currentClub.latitude || 0,
        longitude: currentClub.longitude || 0,
        phone: currentClub.phone,
        email: currentClub.email,
        about: currentClub.about,
        website: currentClub.website,
        instagram: currentClub.instagram,
        facebook: currentClub.facebook,
        logo_image: currentClub.logo_image,
        banner_image: currentClub.banner_image,
        amenities: currentClub.amenities || [],
        gallery: currentClub.gallery || [],
        working_hours: currentClub.working_hours || []
      });
    }
  }, [currentClub, setFormData]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleFileUpload = (field: keyof IClub, files: File[] | null) => {
    if (!files || files.length === 0) {
      // Clear the field if no files are provided
      if (field === 'gallery') {
        handleFieldChange(field, []);
      } else {
        handleFieldChange(field, '');
      }
      return;
    }

    if (field === 'gallery') {
      // For gallery, create an array of URLs
      const galleryUrls = files.map(file => URL.createObjectURL(file));
      handleFieldChange(field, galleryUrls);
    } else {
      // For single image fields, use the first file
      handleFieldChange(field, URL.createObjectURL(files[0]));
    }
  };

  // Define sections configuration
  const sections: SectionConfig[] = [
    {
      id: 'contactInfo',
      title: 'Contact Info',
      content: ({ formData, handleFieldChange, handleFileUpload }) => (
        <ContactInfoSection 
          formData={formData} 
          handleFieldChange={handleFieldChange} 
          handleFileUpload={handleFileUpload}
        />
      ),
    },
    {
      id: 'location',
      title: 'Location',
      content: ({ formData, handleFieldChange, handleFileUpload }) => (
        <LocationSection 
          formData={formData} 
          handleFieldChange={handleFieldChange} 
          handleFileUpload={handleFileUpload}
        />
      ),
    },
    {
      id: 'openHours',
      title: 'Opening Hours',
      content: ({ formData, handleFieldChange, handleFileUpload }) => (
        <WorkingDaysSection 
          formData={formData} 
          handleFieldChange={handleFieldChange} 
          handleFileUpload={handleFileUpload}
        />
      ),
    },
    {
      id: 'amenities',
      title: 'Amenities',
      content: ({ formData, handleFieldChange, handleFileUpload }) => (
        <AmenitiesSection 
          formData={formData} 
          handleFieldChange={handleFieldChange} 
          handleFileUpload={handleFileUpload}
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
              handleFieldChange,
              handleFileUpload
            })}
          </Box>
        </Accordion>
      ))}
    </Stack>
  );
}
