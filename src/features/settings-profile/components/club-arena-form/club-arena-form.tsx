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
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getAllClubs, updateClub } from '../../../../app/services/ClubService';
import { updateOpenHours } from '../../../../app/services/ClubService';
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice';
import type { IClub } from '../../../../app/providers/types/club';
import type { IOpenHour } from '../../../../app/providers/types/hours';
import { UpdateSectionButton } from '../../update-section-button/update-section-button';
import { ContactInfoSection, LocationSection, AmenitiesSection } from './club-arena-form-sections';
import { MapPickerDialog } from '../map-picker-dialog/map-picker-dialog';
import { WorkingDaysSection } from '../../../settings-schedule/components/working-days-section/working-days-section';

// Define interface for section configuration
interface SectionConfig {
  id: string;
  title: string;
  subTitle?: string;
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
  const currentClub = useAppSelector(clubSelector);

  // Initialize form data with default values
  const [formData, setFormData] = useState<IClub>({
    id: 1,
    name: '',
  country: '',
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
    facebook: '',
    logo_image: '',
    banner_image: '',
    gallery: [],
    working_hours: []
  });

  // Map picker dialog state
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Track which accordion sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contactInfo: false,
    location: false,
    openHours: false,
    amenities: false,
    images: false,
  });

  // Fetch clubs and club data
  useEffect(() => {
    dispatch(getAllClubs());
  }, [dispatch]);


  // Update form data when club data changes in Redux store
  useEffect(() => {
    if (currentClub) {
      setFormData({
        id: currentClub.id,
        name: currentClub.name,
        // country: currentClub?.country,
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
  }, [currentClub]);

  const handleFieldChange = useCallback(<T extends keyof IClub>(field: T, value: IClub[T]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const openMapPicker = useCallback(() => {
    setIsMapOpen(true);
  }, []);

  const handleMapSelect = useCallback((data: { lat: number; lng: number; country?: string; city?: string; address?: string }) => {
    setFormData(prev => ({
      ...prev,
      latitude: data.lat,
      longitude: data.lng,
      country: data.country ?? prev.country,
      city: data.city ?? prev.city,
      address: data.address ?? prev.address,
    }));
    setIsMapOpen(false);
  }, []);

  const toggleSection = useCallback((sectionId: string, options?: { save?: boolean }) => {
    // If the section is currently expanded and we're closing it, save the data
    const shouldSave = options?.save !== false; // default true
    if (expandedSections[sectionId] && currentClub?.id && shouldSave) {
      console.log("expandedSections[sectionId]", expandedSections[sectionId]);
      
      // Handle working hours section specially
      if (sectionId === 'openHours') {
        // Format working hours for API
        const formatTime = (date: Date | null): string => {
          if (!date) return '09:00:00';
          
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = '00';
          
          return `${hours}:${minutes}:${seconds}`;
        };

        if (formData.working_hours && formData.working_hours.length > 0) {
          const openHoursData: IOpenHour = {
            working_hours: formData.working_hours.map((wh) => ({
              day_of_week: wh.day_of_week,
              is_active: wh.is_active,
              start_time: formatTime(wh.start_time instanceof Date ? wh.start_time : new Date(wh.start_time)),
              end_time: formatTime(wh.end_time instanceof Date ? wh.end_time : new Date(wh.end_time))
            }))
          };
          
          console.log('Saving working hours data:', openHoursData);
          // Save; service will refresh the club to avoid wiping header fields
          dispatch(updateOpenHours(currentClub.id, openHoursData));
        }
      } else {
        // For other sections, use regular updateClub
        if (formData) {
          dispatch(updateClub(currentClub.id, formData));
        }
      }
    }
    
    // Toggle the section
  setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, [currentClub, formData, expandedSections, dispatch]);

  const handleFileUpload = useCallback((field: keyof IClub, files: File[] | null) => {
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
  }, [handleFieldChange]);

  // Define sections configuration
  const sections: SectionConfig[] = [
    {
      id: 'contactInfo',
      title: !expandedSections.contactInfo ? 'Contact Info' : 'Contact Info',
      // subTitle: 'Update your club contact information including name, email, website and social media links',
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
      title: !expandedSections.location ? 'Location' : 'Location',
      // subTitle: 'Specify your club\'s address and coordinates for clients to find you easily',
    content: ({ formData, handleFieldChange, handleFileUpload }) => (
        <LocationSection 
          formData={formData} 
          handleFieldChange={handleFieldChange} 
      handleFileUpload={handleFileUpload}
      openMapPicker={openMapPicker}
        />
      ),
    },
    {
      id: 'openHours',
      title: !expandedSections.openHours ? 'Opening Hours' : 'Opening Hours',
      // subTitle: 'Set your club\'s working hours so clients know when you\'re available',
      content: ({ formData, handleFieldChange }) => (
        <WorkingDaysSection 
          formData={formData} 
          handleFieldChange={handleFieldChange}
        />
      ),
    },
    {
      id: 'amenities',
      title: !expandedSections.amenities ? 'Amenities' : 'Amenities',
      // subTitle: 'Add the facilities and services your club offers to attract more clients',
      content: ({ formData, handleFieldChange, handleFileUpload }) => (
        <AmenitiesSection 
          formData={formData} 
          handleFieldChange={handleFieldChange} 
          handleFileUpload={handleFileUpload}
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
      padding: 1,
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <UpdateSectionButton<IClub>
                    onClick={() => toggleSection(section.id)}
                    isAccordionCollapse={expandedSections[section.id]}
                    formData={formData}
                    sectionId={section.id}
                    expandedLabel="Update"
                    collapsedLabel="Show"
                  />
                  {expandedSections[section.id] && (
                    <UpdateSectionButton<IClub>
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
                // also ensure no shadows on header
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
              handleFieldChange,
              handleFileUpload
            })}
          </Box>
        </Accordion>
      ))}
      {/* Map picker dialog */}
      <MapPickerDialog
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={handleMapSelect}
        initialPosition={{
          lat: Number(formData.latitude) || 54.6872,
          lng: Number(formData.longitude) || 25.2797,
        }}
        title="Choose on map"
      />
    </Stack>
  );
}
