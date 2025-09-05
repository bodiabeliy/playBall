import { Box, FormControl, Typography, TextField, InputAdornment, IconButton, Popover, MenuItem, Button } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import FileUpload from '../../../file-upload';
import WebsiteIcon from "../../../../shared/assets/icons/website.svg?react";
import InstagramIcon from "../../../../shared/assets/icons/instagram.svg?react";
import FacebookIcon from "../../../../shared/assets/icons/facebook.svg?react";
import type { IClub } from '../../../../app/providers/types/club';
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers';
import { getAllClubStatistic, uploadClubSingleImage, uploadClubGalleryImages } from '../../../../app/services/ClubService';
import { clubStatisticSelector } from '../../../../app/providers/reducers/ClubSlice';
import { getClubGallery, deleteDirectusFile } from '../../../../app/services/FileService';
import MapPinIcon from "../../../../shared/assets/icons/map-pin.svg?react"

type SectionProps = {
  formData: IClub;
  handleFieldChange: <T extends keyof IClub>(field: T, value: IClub[T]) => void;
  handleFileUpload: (field: keyof IClub, files: File[] | null) => void;
};

export const ContactInfoSection = ({ formData, handleFieldChange, handleFileUpload }: SectionProps) => {
  // List of countries with their codes and dial codes
  const countries = [
    { code: 'CZ', dialCode: '+420', name: 'Czech Republic' },
    { code: 'UA', dialCode: '+380', name: 'Ukraine' },
    { code: 'US', dialCode: '+1', name: 'United States' },
    { code: 'GB', dialCode: '+44', name: 'United Kingdom' },
    { code: 'DE', dialCode: '+49', name: 'Germany' }
  ];

  const dispatch = useAppDispatch();
  const clubStatistic = useAppSelector(clubStatisticSelector);
  
  // States for upload operations
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const loadGalleryImages = useCallback(async () => {
    if (formData.id) {
      try {
        const images = await getClubGallery(formData.id);
        setGalleryImages(images);
      } catch (error) {
        console.error('Failed to load gallery images:', error);
      }
    }
  }, [formData.id]);

  useEffect(() => {
    if (formData.id) {
      dispatch(getAllClubStatistic(formData.id));
      
      // Load gallery images from Directus
      loadGalleryImages();
    }
  }, [dispatch, formData.id, loadGalleryImages]);
  
  // States for upload status messages
  const [logoUploadStatus, setLogoUploadStatus] = useState<{message: string, isError: boolean} | null>(null);
  const [bannerUploadStatus, setBannerUploadStatus] = useState<{message: string, isError: boolean} | null>(null);
  const [galleryUploadStatus, setGalleryUploadStatus] = useState<{message: string, isError: boolean} | null>(null);

  // Custom file upload handlers
  const handleLogoUpload = async (files: File[] | null) => {
    if (!files || files.length === 0 || !formData.id) return;
    
    try {
      setIsUploadingLogo(true);
      setLogoUploadStatus({ message: 'Compressing and uploading image...', isError: false });
      
      // Upload the image
      await dispatch(uploadClubSingleImage(formData.id, 'logo_image', files[0]));
      
      // Call the original handleFileUpload for UI update
      handleFileUpload('logo_image', files);
      
      setLogoUploadStatus({ message: 'Logo uploaded successfully!', isError: false });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setLogoUploadStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      setLogoUploadStatus({ 
        message: 'Failed to upload logo. Please try again.', 
        isError: true 
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };
  
  const handleBannerUpload = async (files: File[] | null) => {
    if (!files || files.length === 0 || !formData.id) return;
    
    try {
      setIsUploadingBanner(true);
      setBannerUploadStatus({ message: 'Compressing and uploading banner...', isError: false });
      
      // Upload the image and get the response
      await dispatch(uploadClubSingleImage(formData.id, 'banner_image', files[0]));
      
      // Call the original handleFileUpload for UI update
      handleFileUpload('banner_image', files);
      
      setBannerUploadStatus({ message: 'Banner uploaded successfully!', isError: false });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setBannerUploadStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading banner:', error);
      setBannerUploadStatus({ 
        message: 'Failed to upload banner. Please try again.', 
        isError: true 
      });
    } finally {
      setIsUploadingBanner(false);
    }
  };
  
  const handleGalleryUpload = async (files: File[] | null) => {
    if (!files || files.length === 0 || !formData.id) return;
    
    try {
      setIsUploadingGallery(true);
      setGalleryUploadStatus({ 
        message: `Compressing and uploading ${files.length} ${files.length === 1 ? 'image' : 'images'}...`, 
        isError: false 
      });
      
      // Upload the images and get the response
      await dispatch(uploadClubGalleryImages(formData.id, Array.from(files)));
      
      // Reload gallery images
      await loadGalleryImages();
      
      // Call the original handleFileUpload for UI update
      handleFileUpload('gallery', files);
      
      setGalleryUploadStatus({ 
        message: `${files.length} ${files.length === 1 ? 'image' : 'images'} uploaded successfully!`, 
        isError: false 
      });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setGalleryUploadStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading gallery:', error);
      setGalleryUploadStatus({ 
        message: 'Failed to upload gallery images. Please try again.', 
        isError: true 
      });
    } finally {
      setIsUploadingGallery(false);
    }
  };
  
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  
  const handleDeleteGalleryImage = async (fileId: string) => {
    if (!formData.id) return;
    
    try {
      setDeletingImageId(fileId);
      setGalleryUploadStatus({ message: 'Deleting image...', isError: false });
      
      await deleteDirectusFile(fileId);
      await loadGalleryImages();
      
      setGalleryUploadStatus({ message: 'Image deleted successfully!', isError: false });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setGalleryUploadStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      setGalleryUploadStatus({ message: 'Failed to delete image. Please try again.', isError: true });
    } finally {
      setDeletingImageId(null);
    }
  };
  
  // State for selected country
  const [selectedCountry, setSelectedCountry] = useState(
    // Set default based on phone value or default to Ukraine
    countries.find(c => formData.phone?.startsWith(c.dialCode)) || countries.find(c => c.code === 'UA') || countries[0]
  );

  // State for country selector popover
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleCountryClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCountryClose = () => {
    setAnchorEl(null);
  };

  const handleCountrySelect = (country: typeof selectedCountry) => {
    setSelectedCountry(country);
    // Update phone with new country code
    const phoneNumber = formData.phone?.replace(/^\+\d+\s+/, '') || '';
    handleFieldChange('phone', `${country.dialCode} ${phoneNumber}`);
    handleCountryClose();
  };

  return (
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
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </FormControl>
    </Box>
    <Box sx={{ display: 'flex', alignItems: "strech", gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Website
        </Typography>
        <TextField
          value={formData.website}
          onChange={(e) => handleFieldChange('website', e.target.value)}
          fullWidth
          placeholder="Enter website"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
      <FormControl fullWidth sx={{ borderRadius: '8px', }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Club phone number
        </Typography>
        <TextField
          fullWidth
          placeholder="000 000 000"
          value={formData.phone?.replace(/^\+\d+\s+/, '') || ''} 
          onChange={(e) => {
            handleFieldChange('phone', `${selectedCountry.dialCode} ${e.target.value}`);
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              paddingLeft: 0
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  onClick={handleCountryClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    marginRight: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <Box
                    component="img"
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry.code}.svg`}
                    alt={selectedCountry.name}
                    sx={{ width: 24, height: 18 }}
                  />
                  <Typography sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>{selectedCountry.dialCode}</Typography>
                </Box>
              </InputAdornment>
            )
          }}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCountryClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ maxHeight: 300, overflow: 'auto', width: 250 }}>
            {countries.map((country) => (
              <MenuItem 
                key={country.code} 
                onClick={() => handleCountrySelect(country)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px'
                }}
              >
                <Box
                  component="img"
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code}.svg`}
                  alt={country.name}
                  sx={{ width: 24, height: 18 }}
                />
                <Typography sx={{ flex: 1 }}>{country.name}</Typography>
                <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>{country.dialCode}</Typography>
              </MenuItem>
            ))}
          </Box>
        </Popover>
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
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
          Indoor Padel courts
        </Typography>
        <TextField
          disabled
          value={clubStatistic.indoor_padel}
          onChange={(e) => handleFieldChange('facebook', e.target.value)}
          fullWidth
          placeholder="Enter Facebook"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Outdoor Padel courts
        </Typography>
        <TextField
          disabled
          value={clubStatistic.indoor_padel}
          onChange={(e) => handleFieldChange('instagram', e.target.value)}
          fullWidth
          placeholder=""
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </FormControl>
    </Box>
     <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Indoor Tennis courts
        </Typography>
        <TextField
          disabled
          value={clubStatistic.indoor_tennis}
          onChange={(e) => handleFieldChange('facebook', e.target.value)}
          fullWidth
          placeholder="Enter Facebook"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Outdoor Tennis courts
        </Typography>
        <TextField
          disabled
          value={clubStatistic.outdoor_tennis}
          onChange={(e) => handleFieldChange('instagram', e.target.value)}
          fullWidth
          placeholder="Enter Instagram"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </FormControl>
    </Box>
     <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Indoor Pickleball courts
        </Typography>
        <TextField
          disabled
          value={clubStatistic.outdoor_tennis}
          onChange={(e) => handleFieldChange('facebook', e.target.value)}
          fullWidth
          placeholder="Enter Facebook"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ borderRadius: '8px' }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Outdoor Pickleball courts
        </Typography>
        <TextField
          disabled
          value={clubStatistic.outdoor_tennis}
          onChange={(e) => handleFieldChange('instagram', e.target.value)}
          fullWidth
          placeholder="Enter Instagram"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
          onFileChange={handleLogoUpload}
          isLoading={isUploadingLogo}
        />
        {logoUploadStatus && (
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 1, 
              color: logoUploadStatus.isError ? 'error.main' : 'success.main',
              display: 'block' 
            }}
          >
            {logoUploadStatus.message}
          </Typography>
        )}
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
          onFileChange={handleBannerUpload}
          isLoading={isUploadingBanner}
        />
        {bannerUploadStatus && (
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 1, 
              color: bannerUploadStatus.isError ? 'error.main' : 'success.main',
              display: 'block' 
            }}
          >
            {bannerUploadStatus.message}
          </Typography>
        )}
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
          onFileChange={handleGalleryUpload}
          isLoading={isUploadingGallery}
          multiple
        />
        {galleryUploadStatus && (
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 1, 
              color: galleryUploadStatus.isError ? 'error.main' : 'success.main',
              display: 'block' 
            }}
          >
            {galleryUploadStatus.message}
          </Typography>
        )}
      </FormControl>
    </Box>
    
    {galleryImages.length > 0 && (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mt: 3 }}>
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Current Gallery Images
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {galleryImages.map((imageUrl, index) => {
            // Extract file ID from URL
            const fileId = imageUrl.split('/').pop() || '';
            const isDeleting = deletingImageId === fileId;
            
            return (
              <Box 
                key={index} 
                sx={{ 
                  position: 'relative',
                  width: 120, 
                  height: 120,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  opacity: isDeleting ? 0.7 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  sx={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'cover' 
                  }}
                />
                {isDeleting ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.3)'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#fff" strokeWidth="2" strokeOpacity="0.5"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                        <animateTransform 
                          attributeName="transform" 
                          type="rotate" 
                          from="0 12 12" 
                          to="360 12 12" 
                          dur="1s" 
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </Box>
                ) : (
                  <IconButton
                    onClick={() => handleDeleteGalleryImage(fileId)}
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }
                    }}
                  >
                    ×
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    )}
  </form>
  );
};

export const LocationSection = ({ formData, handleFieldChange, openMapPicker }: SectionProps & { openMapPicker?: () => void }) => {
  return (
    <form style={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
        <FormControl fullWidth sx={{ borderRadius: '8px' }}>
          <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
            Country
          </Typography>
          <TextField
            value={formData.country || ''}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            fullWidth
            placeholder="Enter country"
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <FormControl fullWidth sx={{ borderRadius: '8px' }}>
          <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" gutterBottom>
            Address
          </Typography>
          <TextField
            value={formData.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            fullWidth
            placeholder="Enter address"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </FormControl>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          {/* <TextField
            label="Latitude"
            value={formData.latitude ?? ''}
            onChange={(e) => handleFieldChange('latitude', Number(e.target.value))}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            label="Longitude"
            value={formData.longitude ?? ''}
            onChange={(e) => handleFieldChange('longitude', Number(e.target.value))}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          /> */}
        </Box>
        <Box sx={{mx:"auto",}}>
          <Button
            type="button"
            onClick={() => openMapPicker && openMapPicker()}
            startIcon={<MapPinIcon />}
            variant="text"
            disableElevation
            sx={{
              mt: 1,
              px: 0,
              py: 0,
              
              minWidth: 'auto',
              textTransform: 'none',
              color: '#0C6C70',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#0A595C',
              },
            }}
          >
            Choose on map
          </Button>
        </Box>
      </Box>
    </form>
  );
};

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
