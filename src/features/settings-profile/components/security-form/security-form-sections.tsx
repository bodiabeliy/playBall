import { 
  Box, 
  FormControl, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Switch, 
  FormControlLabel,
  Slider,
  Stack
} from '@mui/material';
import { useState } from 'react';
import type { IClub } from '../../../../app/providers/types/club';

import ForgotPassword from '../../../../shared/assets/icons/forgot-password.svg?react'
import { Visibility } from '@mui/icons-material';

// Original security form data type for password change
export type SecurityFormData = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

type SecuritySectionProps = {
  formData: SecurityFormData;
  handleFieldChange: <T extends keyof SecurityFormData>(field: T, value: SecurityFormData[T]) => void;
  errors?: {
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
  };
};

// Club security section props
type SectionProps = {
  formData: IClub;
  handleFieldChange: <T extends keyof IClub>(field: T, value: IClub[T]) => void;
  handleFileUpload?: (field: keyof IClub, files: File[] | null) => void;
};

export const SecuritySection = ({ formData, handleFieldChange, errors }: SecuritySectionProps) => {
  const [passwordVisible, setPasswordVisible] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false
  });
  
  const togglePasswordVisibility = (field: keyof typeof passwordVisible) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" color="rgba(21, 22, 24, 0.6);" sx={{ mb: 3 }}>
        Your password must be at least 8 characters long and include a number or symbol
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <FormControl fullWidth sx={{ borderRadius: '8px' }}>
          <TextField
            type={passwordVisible.new_password ? 'text' : 'password'}
            value={formData.new_password}
            onChange={(e) => handleFieldChange('new_password', e.target.value)}
            fullWidth
            placeholder="Create New Password"
            error={Boolean(errors?.new_password)}
            helperText={errors?.new_password}
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
            type={passwordVisible.confirm_password ? 'text' : 'password'}
            value={formData.confirm_password}
            onChange={(e) => handleFieldChange('confirm_password', e.target.value)}
            fullWidth
            placeholder="Confirm Password"
            error={Boolean(errors?.confirm_password)}
            helperText={errors?.confirm_password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={passwordVisible.confirm_password ? 'hide the password' : 'display the password'}
                    onClick={() => togglePasswordVisibility('confirm_password')}
                    edge="end">
                    {passwordVisible.confirm_password ? <ForgotPassword /> : <Visibility />}
                  </IconButton>

                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export const CancellationSection = ({ formData, handleFieldChange }: SectionProps) => {
  // Safely handle security_settings if it's not defined
  const securitySettings = formData.security_settings || {
    cancellation_policy: { enabled: false, time_limit: 0, penalty_percentage: 0 }
  };
  
  // Handle toggling cancellation policy
  const handleToggleCancellation = (checked: boolean) => {
    handleFieldChange('security_settings', {
      ...securitySettings,
      cancellation_policy: {
        ...securitySettings.cancellation_policy,
        enabled: checked
      }
    });
  };
  
  // Handle changing time limit value
  const handleTimeLimit = (value: number) => {
    handleFieldChange('security_settings', {
      ...securitySettings,
      cancellation_policy: {
        ...securitySettings.cancellation_policy,
        time_limit: value
      }
    });
  };
  
  // Handle changing penalty percentage
  const handlePenaltyChange = (value: number) => {
    handleFieldChange('security_settings', {
      ...securitySettings,
      cancellation_policy: {
        ...securitySettings.cancellation_policy,
        penalty_percentage: value
      }
    });
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Enable cancellation policy</Typography>
        <Switch
          checked={securitySettings.cancellation_policy.enabled}
          onChange={(_, checked) => handleToggleCancellation(checked)}
          color="primary"
        />
      </Box>
      
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Time limit before session (hours)
        </Typography>
        <Slider
          disabled={!securitySettings.cancellation_policy.enabled}
          value={securitySettings.cancellation_policy.time_limit}
          onChange={(_, value) => handleTimeLimit(value as number)}
          step={1}
          marks
          min={0}
          max={24}
          valueLabelDisplay="auto"
        />
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          Penalty (% of session cost)
        </Typography>
        <Slider
          disabled={!securitySettings.cancellation_policy.enabled}
          value={securitySettings.cancellation_policy.penalty_percentage}
          onChange={(_, value) => handlePenaltyChange(value as number)}
          step={5}
          marks
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export const LightingSection = ({ formData, handleFieldChange }: SectionProps) => {
  // Safely handle security_settings if it's not defined
  const securitySettings = formData.security_settings || {
    lighting_control: { automatic: false, turn_on_before: 0 }
  };
  
  // Handle toggling automatic lighting
  const handleToggleAutomatic = (checked: boolean) => {
    handleFieldChange('security_settings', {
      ...securitySettings,
      lighting_control: {
        ...securitySettings.lighting_control,
        automatic: checked
      }
    });
  };
  
  // Handle changing turn on time
  const handleTurnOnTime = (value: number) => {
    handleFieldChange('security_settings', {
      ...securitySettings,
      lighting_control: {
        ...securitySettings.lighting_control,
        turn_on_before: value
      }
    });
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Automatic lighting control</Typography>
        <Switch
          checked={securitySettings.lighting_control.automatic}
          onChange={(_, checked) => handleToggleAutomatic(checked)}
          color="primary"
        />
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          Turn on lights before session (minutes)
        </Typography>
        <Slider
          disabled={!securitySettings.lighting_control.automatic}
          value={securitySettings.lighting_control.turn_on_before}
          onChange={(_, value) => handleTurnOnTime(value as number)}
          step={5}
          marks
          min={0}
          max={30}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export const AccessCodeSection = ({ formData, handleFieldChange }: SectionProps) => {
  // Safely handle security_settings if it's not defined
  const securitySettings = formData.security_settings || {
    access_code: { enabled: false, code: '' }
  };
  
  // Handle toggling access code system
  const handleToggleAccessCode = (checked: boolean) => {
    handleFieldChange('security_settings', {
      ...securitySettings,
      access_code: {
        ...securitySettings.access_code,
        enabled: checked
      }
    });
  };
  
  // Handle changing access code
  const handleCodeChange = (code: string) => {
    handleFieldChange('security_settings', {
      ...securitySettings,
      access_code: {
        ...securitySettings.access_code,
        code: code
      }
    });
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Enable access code system</Typography>
        <Switch
          checked={securitySettings.access_code.enabled}
          onChange={(_, checked) => handleToggleAccessCode(checked)}
          color="primary"
        />
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth sx={{ borderRadius: '8px' }}>
          <TextField
            disabled={!securitySettings.access_code.enabled}
            value={securitySettings.access_code.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            fullWidth
            placeholder="Enter access code"
            sx={{ mb: 2 }}
          />
        </FormControl>
      </Box>
    </Box>
  );
};
