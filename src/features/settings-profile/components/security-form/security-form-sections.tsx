import { Box, FormControl, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';

type SecurityFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type SectionProps = {
  formData: SecurityFormData;
  handleFieldChange: <T extends keyof SecurityFormData>(field: T, value: SecurityFormData[T]) => void;
};

export const SecuritySection = ({ formData, handleFieldChange }: SectionProps) => {
  const [passwordVisible, setPasswordVisible] = useState({
    newPassword: false,
    confirmPassword: false
  });
  
  const togglePasswordVisibility = (field: keyof typeof passwordVisible) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change submission here
    console.log('Changing password:', formData);
  };

  return (
    <form style={{ width: '100%' }} onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Change Password
      </Typography>
      <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" sx={{ mb: 3 }}>
        Your password must be at least 8 characters long and include a number or symbol
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '360px' }}>
        <FormControl fullWidth sx={{ borderRadius: '8px' }}>
          <TextField
            type={passwordVisible.newPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) => handleFieldChange('newPassword', e.target.value)}
            fullWidth
            placeholder="Create Password"
            InputProps={{
              endAdornment: (
                <Box 
                  component="span" 
                  sx={{ 
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'rgba(21, 22, 24, 0.6)'
                  }}
                  onClick={() => togglePasswordVisibility('newPassword')}
                >
                  {passwordVisible.newPassword ? 'Hide' : 'Show'}
                </Box>
              ),
            }}
          />
        </FormControl>
        
        <FormControl fullWidth sx={{ borderRadius: '8px' }}>
          <TextField
            type={passwordVisible.confirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
            fullWidth
            placeholder="Confirm Password"
            InputProps={{
              endAdornment: (
                <Box 
                  component="span" 
                  sx={{ 
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'rgba(21, 22, 24, 0.6)'
                  }}
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {passwordVisible.confirmPassword ? 'Hide' : 'Show'}
                </Box>
              ),
            }}
          />
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            type="submit"
            sx={{
              backgroundColor: '#034C53',
              borderRadius: '8px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: 500,
              fontSize: '14px',
              '&:hover': {
                backgroundColor: '#023c42'
              }
            }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </form>
  );
};
