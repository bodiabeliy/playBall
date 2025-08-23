import {
  Box,
  // Button,
  // TextField,
  Typography,
  FormControl,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  TextField,
} from '@mui/material'
import FileUpload from '../../../file-upload';
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers';
import { useEffect } from 'react';
import { getAllClubs, getClubById } from '../../../../app/services/ClubService';
import { clubSelector, clubsSelector } from '../../../../app/providers/reducers/ClubSlice';
import { useFormValidation } from '../../../../shared/hooks/use-form-field';
import type { IClub } from '../../../../app/providers/types/club';
import {MuiPhoneInput} from '../../../../shared/components/ui/mui-phone-input/mui-phone-input';
import PhoneInput from 'react-phone-number-input'
import { UpdateSectionButton } from '../../update-section-button/update-section-button';

export function ClubArenaForm() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useAppDispatch()
  const clubList = useAppSelector(clubsSelector)
  const currentClub = useAppSelector(clubSelector)

  useEffect(() => {
    dispatch(getAllClubs())
  }, [])

  useEffect(() => {
    if (clubList.length > 0) {
      dispatch(getClubById(clubList[0].id))
    }
  }, [clubList])

   const validateSignUp = (data: IClub) => ({
    id: '',
    name: data.name ? '' : 'Name is required',
    address: data.address ? '' : 'Address is required',
    city: data.city ? '' : 'City is required',
    // Add more validations as needed
  })
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
      facebook:"",
      logo_image:"",
      banner_image:"",
      gallery:[]
    },
    validateSignUp
  )

  useEffect(() => {
    if (currentClub) {
      setFormData({
        id: currentClub.id,
        name: currentClub.name ,
        address: currentClub.address ,
        city: currentClub.city ,
        latitude: currentClub.latitude || 0,
        longitude: currentClub.longitude || 0,
        phone: currentClub.phone ,
        email: currentClub.email ,
        about: currentClub.about ,
        website: currentClub.website ,
        instagram: currentClub.instagram ,
        facebook: currentClub.facebook ,
        logo_image: currentClub.logo_image ,
        banner_image: currentClub.banner_image ,
        amenities: currentClub.amenities || [],
        gallery: currentClub.gallery || [],
        working_hours: currentClub.working_hours || []
      });
    }
  }, [currentClub, setFormData])


  const openEditSection = () => {

  }

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


  return (
    <Accordion
      defaultExpanded={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? '100%' : 'auto',
        justifyContent: 'space-between',
        boxShadow:
          '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        background: '#fff',
        borderRadius: '16px',
        p: isMobile ? 2 : 3,
        mt: isMobile ? '16px' : '0',
        '&.MuiAccordion-root': {
          padding:1
        }
      }}>
      <Box>
          <AccordionSummary
            expandIcon={<UpdateSectionButton onClick={() => openEditSection} />}
            sx={{
              padding: 0,
            }}>
            <Typography variant="h6">Contact info</Typography>
          </AccordionSummary>
      </Box>
       <form style={{ width: '100%', marginTop: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть назву"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    value={formData.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Вкажіть адресу"
                  />
              </FormControl>
            </Box>
            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    value={formData.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Enter city"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px', mt:2 }}>
                  <PhoneInput
                    id="phone-input"
                    placeholder="Введіть номер телефону"
                    value={formData.phone}
                    onChange={(value) => handleFieldChange('phone', value ?? '')}
                    defaultCountry="UA"
                    maxLength={9}
                    countrySelectComponent={(props) => <MuiPhoneInput {...props}/>}
            />
              </FormControl>
            </Box>
            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    value={formData.email }
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Enter email"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    value={formData.website }
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Enter website"
                  />
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    value={formData.instagram }
                    onChange={(e) => handleFieldChange('instagram', e.target.value)}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Enter Instagram"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    value={formData.facebook }
                    onChange={(e) => handleFieldChange('facebook', e.target.value)}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Enter Facebook"
                  />
              </FormControl>
            </Box>
            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    value={formData.latitude?.toString() }
                    onChange={(e) => handleFieldChange('latitude', parseFloat(e.target.value) || 0)}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Enter latitude"
                    type="number"
                  />
              </FormControl>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                 <TextField
                    value={formData.longitude?.toString() }
                    onChange={(e) => handleFieldChange('longitude', parseFloat(e.target.value) || 0)}
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Enter longitude"
                    type="number"
                  />
              </FormControl>
            </Box>
            <Box sx={{  display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <TextField
                    value={formData.about }
                    onChange={(e) => handleFieldChange('about', e.target.value)}
                    rows={6}
                    multiline
                    fullWidth
                    sx={{
                      mt: 2,
                    }}
                    placeholder="Enter description"
                  />
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', mt: 3 }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <FileUpload 
                  helperText='Club Image' 
                  type="small"
                  onFileChange={(files) => handleFileUpload('logo_image', files)}
                />
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', mt: 3 }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <FileUpload 
                  helperText='Banner' 
                  type="big"
                  onFileChange={(files) => handleFileUpload('banner_image', files)}
                />
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', mt: 3 }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                <FileUpload 
                  helperText='Gallery Images' 
                  type="small"
                  onFileChange={(files) => handleFileUpload('gallery', files)}
                />
              </FormControl>
            </Box>
            
          </form>
    </Accordion>
  )
}
