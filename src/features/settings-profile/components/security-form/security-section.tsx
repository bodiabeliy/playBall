import { Box, FormControl, IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import type { IProfile } from '../../../../app/providers/types/user';
import ForgotPassword from '../../../../shared/assets/icons/forgot-password.svg?react'
import { Visibility } from '@mui/icons-material';


type SectionProps = {
  formData: IProfile;
  handleFieldChange: <T extends keyof IProfile>(field: T, value: IProfile[T]) => void;
};

export const SecuritySection = ({ formData, handleFieldChange }: SectionProps) => {
  const [passwordVisible, setPasswordVisible] = useState({
    current_password: false,
    new_password: false,
    repeat_password: false
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
    
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%'}}>
        <FormControl fullWidth sx={{ borderRadius: '8px' }}>
           <TextField
            // label="Введіть пароль"
            variant="outlined"
            fullWidth
            placeholder='Create Password'
            value={formData.new_password}
            onChange={(event) => handleFieldChange('new_password', event.target.value)}
          
            type={passwordVisible.new_password ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={passwordVisible.new_password ? 'hide the password' : 'display the password'}
                    onClick={() => togglePasswordVisibility('new_password')}
                    edge="end">
                    {passwordVisible.new_password ? <ForgotPassword /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        
        <FormControl fullWidth sx={{ borderRadius: '8px' }}>
          <TextField
            // label="Введіть пароль"
            variant="outlined"
            fullWidth
            placeholder='Confirm Password'
            value={formData.repeat_password}
            onChange={(event) => handleFieldChange('repeat_password', event.target.value)}
          
            type={passwordVisible.repeat_password ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={passwordVisible.repeat_password ? 'hide the password' : 'display the password'}
                    onClick={() => togglePasswordVisibility('repeat_password')}
                    edge="end">
                    {passwordVisible.repeat_password ? <ForgotPassword /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Box>
    </form>
  );
};
