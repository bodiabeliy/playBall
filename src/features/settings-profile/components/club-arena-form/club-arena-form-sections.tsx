
import { Box, FormControl, Typography, TextField, InputAdornment, IconButton } from '@mui/material';
import FileUpload from '../../../file-upload';
import PhoneInput from 'react-phone-number-input';
import { MuiPhoneInput } from '../../../../shared/components/ui/mui-phone-input/mui-phone-input';
import WebsiteIcon from "../../../../shared/assets/icons/website.svg?react";
import InstagramIcon from "../../../../shared/assets/icons/instagram.svg?react";
import FacebookIcon from "../../../../shared/assets/icons/facebook.svg?react";
import type { IClub } from '../../../../app/providers/types/club';

type SectionProps = {
  formData: IClub;
  handleFieldChange: <T extends keyof IClub>(field: T, value: IClub[T]) => void;
  handleFileUpload: (field: keyof IClub, files: File[] | null) => void;
};

export const ContactInfoSection = ({ formData, handleFieldChange, handleFileUpload }: SectionProps) => (
  <form style={{ width: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Club Name
        </Typography>
        <TextField
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          fullWidth
          placeholder="Enter club name"
          sx={{ mb: 2 }}
        />
      </FormControl>
      
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Club email
        </Typography>
        <TextField
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          fullWidth
          placeholder="Enter email"
          sx={{ mb: 2 }}
        />
      </FormControl>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Website
        </Typography>
        <TextField
          value={formData.website}
          onChange={(e) => handleFieldChange('website', e.target.value)}
          fullWidth
          placeholder="Enter website"
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton aria-label={'website'} edge="end"></IconButton>
                <WebsiteIcon />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ borderRadius: '8px', mt: 2 }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Club phone number
        </Typography>
        <PhoneInput
          id="phone-input"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={(value) => handleFieldChange('phone', value ?? '')}
          defaultCountry="UA"
          maxLength={9}
          countrySelectComponent={(props) => <MuiPhoneInput {...props} />}
        />
      </FormControl>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Facebook
        </Typography>
        <TextField
          value={formData.facebook}
          onChange={(e) => handleFieldChange('facebook', e.target.value)}
          fullWidth
          placeholder="Enter Facebook"
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton aria-label={'facebook'} edge="end"></IconButton>
                <FacebookIcon />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Instagram
        </Typography>
        <TextField
          value={formData.instagram}
          onChange={(e) => handleFieldChange('instagram', e.target.value)}
          fullWidth
          placeholder="Enter Instagram"
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton aria-label={'instagram'} edge="end"></IconButton>
                <InstagramIcon />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Description
        </Typography>
        <TextField
          value={formData.about}
          onChange={(e) => handleFieldChange('about', e.target.value)}
          rows={6}
          multiline
          fullWidth
          placeholder="Enter description"
        />
      </FormControl>
    </Box>
     <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', mt: 3 }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Club Image
        </Typography>
        <FileUpload 
          helperText='Club Image' 
          type="small"
          onFileChange={(files) => handleFileUpload('logo_image', files)}
        />
      </FormControl>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', mt: 3 }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Banner
        </Typography>
        <FileUpload 
          helperText='Banner' 
          type="big"
          onFileChange={(files) => handleFileUpload('banner_image', files)}
        />
      </FormControl>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', mt: 3 }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Arena Gallery
        </Typography>
        <FileUpload 
          helperText='Gallery Images' 
          type="small"
          onFileChange={(files) => handleFileUpload('gallery', files)}
        />
      </FormControl>
    </Box>
  </form>
);

export const LocationSection = ({ formData, handleFieldChange }: SectionProps) => (
  <form style={{ width: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          State/Province
        </Typography>
        <TextField
          value={formData.address}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          fullWidth
          placeholder="Enter address"
          sx={{ mb: 2 }}
        />
      </FormControl>
      
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          City
        </Typography>
        <TextField
          value={formData.city}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          fullWidth
          placeholder="Enter city"
          sx={{ mb: 2 }}
        />
      </FormControl>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Street
        </Typography>
        <TextField
          value={formData.latitude?.toString()}
          onChange={(e) => handleFieldChange('latitude', parseFloat(e.target.value) || 0)}
          fullWidth
          type="number"
          placeholder="Enter number of courts"
          sx={{ mb: 2 }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Postal Code
        </Typography>
        <TextField
          value={formData.longitude?.toString()}
          onChange={(e) => handleFieldChange('longitude', parseFloat(e.target.value) || 0)}
          fullWidth
          type="number"
          placeholder="Enter number of courts"
          sx={{ mb: 2 }}
        />
      </FormControl>
    </Box>
     <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Country
        </Typography>
        <TextField
          value={formData.latitude?.toString()}
          onChange={(e) => handleFieldChange('latitude', parseFloat(e.target.value) || 0)}
          fullWidth
          type="number"
          placeholder="Enter number of courts"
          sx={{ mb: 2 }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Timezone
        </Typography>
        <TextField
          value={formData.longitude?.toString()}
          onChange={(e) => handleFieldChange('longitude', parseFloat(e.target.value) || 0)}
          fullWidth
          type="number"
          placeholder="Enter number of courts"
          sx={{ mb: 2 }}
        />
      </FormControl>
    </Box>
  </form>
);

export const AmenitiesSection = ({ formData, handleFieldChange }: SectionProps) => {
  const amenities = [
    { id: 'changeroom', label: 'Changeroom' },
    { id: 'lockers', label: 'Lockers' },
    { id: 'shower', label: 'Shower' },
    { id: 'sauna', label: 'Sauna' },
    { id: 'disabled_access', label: 'Disabled access' },
    { id: 'private_parking', label: 'Private Parking' },
    { id: 'free_parking', label: 'Free Parking' },
    { id: 'racket_renting', label: 'Racket renting' },
    { id: 'playzone', label: 'Playzone for kids' },
    { id: 'gym', label: 'Gym' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'snack_bar', label: 'Snack Bar' },
    { id: 'sports_store', label: 'Sports store' },
    { id: 'vending_machine', label: 'Vending machine' },
    { id: 'wifi', label: 'Wi-Fi' },
  ];

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = formData.amenities || [];
    let updatedAmenities: string[];
    
    if (currentAmenities.includes(amenity)) {
      updatedAmenities = currentAmenities.filter(a => a !== amenity);
    } else {
      updatedAmenities = [...currentAmenities, amenity];
    }
    
    handleFieldChange('amenities', updatedAmenities);
  };

  return (
    <form style={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%',
          mb: 3
        }}>
        </Box>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '16px', 
          width: '100%',
          mb: 2
        }}>
          {amenities.map((amenity) => (
            <Box 
              key={amenity.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                py: 1
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 24,
                  height: 24,
                  border: formData.amenities?.includes(amenity.id) 
                    ? '2px solid #034C53' 
                    : '2px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: formData.amenities?.includes(amenity.id) 
                    ? '#034C53' 
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => toggleAmenity(amenity.id)}
              >
                {formData.amenities?.includes(amenity.id) && (
                  <Box
                    component="span"
                    sx={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✓
                  </Box>
                )}
                <input 
                  type="checkbox" 
                  id={amenity.id}
                  checked={formData.amenities?.includes(amenity.id) || false}
                  onChange={() => toggleAmenity(amenity.id)}
                  style={{ 
                    opacity: 0,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                />
              </Box>
              <Typography 
                sx={{ 
                  fontSize: '14px',
                  fontWeight: formData.amenities?.includes(amenity.id) ? 500 : 400,
                  color: formData.amenities?.includes(amenity.id) ? '#151618' : 'rgba(21, 22, 24, 0.6)'
                }}
              >
                {amenity.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </form>
  );
};
