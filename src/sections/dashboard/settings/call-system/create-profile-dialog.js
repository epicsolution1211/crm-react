import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  provider_type: yup.string().required('Provider type is required'),
  enabled: yup.boolean(),
  is_default: yup.boolean(),
});

const PROVIDERS_TO_TYPES = {
  twilio: 'twilio',
  coperato: 'coperato',
  voiso: 'voiso',
  "cyprus bpx": 'cypbx',
  squaretalk: 'squaretalk',
  commpeak: 'commpeak',
  mmdsmart: 'mmdsmart',
  "prime voip": 'prime_voip',
  voicespin: 'voicespin',
  "perfect money": 'perfect_money',
  nuvei: 'nuvei',
  didglobal: 'didglobal',
}

const StepIcon = ({ icon }) => {
  return (
    <Box
      sx={{
        width: 29,
        height: 29,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.selected',
        color: 'text.primary',
        fontWeight: 700,
        fontSize: '16px'
      }}
    >
      {icon}
    </Box>
  );
};

const ProviderTypeCard = ({ provider, isSelected, onSelect }) => {
  const displayName = provider.name === 'Cyprus BPX' ? 'Cyprus P.B.X' : provider.name;
  
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        borderRadius: 2,
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
        boxShadow: isSelected ? (theme) => theme.shadows[4] : (theme) => theme.shadows[1],
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
          borderColor: 'primary.main',
        },
      }}
      onClick={() => onSelect(provider)}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
          {console.log(provider)}
            {provider.logo_url ? (
              <img 
                src={provider.logo_url}
                alt={displayName}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  padding: '4px'
                }}
              />
            ) : (
              <Icon 
                icon="mdi:phone-in-talk" 
                width={24} 
                height={24} 
                style={{ color: '#1976d2' }}
              />
            )}
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={600}>
                {displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Call System Provider
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const CreateProfileDialog = ({ open, onClose, onSubmit, providers = [], preselectedProvider = null }) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      provider_type: '',
      enabled: true,
      is_default: false,
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
      setSelectedProvider(null);
      setActiveStep(0);
    } else if (preselectedProvider) {
      const providerType = PROVIDERS_TO_TYPES[preselectedProvider.name?.toLowerCase()];
      setSelectedProvider(preselectedProvider);
      reset({
        name: '',
        description: '',
        provider_type: providerType || '',
        enabled: true,
        is_default: false,
      });
      setActiveStep(1);
    }
  }, [open, reset, preselectedProvider]);

  const handleProviderSelect = (provider) => {
    const providerType = PROVIDERS_TO_TYPES[provider.name?.toLowerCase()];
    setSelectedProvider(provider);
    setValue('provider_type', providerType || '');
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedProvider) {
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const steps = [
    {
      label: 'Select Provider Type',
      content: (
        <Stack spacing={3}>
          <Grid container spacing={2}>
            {providers.map((provider) => {
              const actualProvider = provider.provider ?? provider;
              const providerType = PROVIDERS_TO_TYPES[actualProvider.name?.toLowerCase()];
              const isSelected = selectedProvider?.name?.toLowerCase() === actualProvider.name?.toLowerCase();
              
              return (
                <Grid item xs={12} md={6} key={providerType || actualProvider.name}>
                  <ProviderTypeCard
                    provider={actualProvider}
                    isSelected={isSelected}
                    onSelect={handleProviderSelect}
                  />
                </Grid>
              );
            })}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedProvider}
              endIcon={<Icon icon="mdi:arrow-right" />}
              sx={{ 
                px: 2,
                py: 0.75,
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '8px'
              }}
            >
              Next
            </Button>
          </Box>
        </Stack>
      ),
    },
    {
      label: 'Profile Details',
      content: (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={2.5}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: 1.2,
                mb: 0.5
              }}
            >
              Profile Details
            </Typography>

            {selectedProvider && (
              <Box
                sx={{
                  bgcolor: 'action.hover',
                  borderRadius: '10px',
                  p: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.paper'
                  }}
                >
                  {selectedProvider.logo_url ? (
                    <img 
                      src={selectedProvider.logo_url}
                      alt={selectedProvider.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        padding: '4px'
                      }}
                    />
                  ) : (
                    <Icon 
                      icon="mdi:phone-in-talk" 
                      width={20} 
                      height={20} 
                      style={{ color: '#1976d2' }}
                    />
                  )}
                </Box>
                <Stack spacing={0.625} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: 1.2
                    }}
                  >
                    {selectedProvider.name === 'Cyprus BPX' ? 'Cyprus P.B.X' : selectedProvider.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '14px',
                      lineHeight: 'normal',
                      color: 'text.secondary',
                      fontWeight: 300
                    }}
                  >
                    Call System Provider
                  </Typography>
                </Stack>
              </Box>
            )}

            <Stack spacing={0.375}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: 1.5,
                  mb: 0.375
                }}
              >
                Profile Name
              </Typography>
              <TextField
                {...register('name')}
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder="Enter profile name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      fontSize: '16px',
                      lineHeight: '24px',
                      py: 1
                    },
                    '& fieldset': {
                      borderRadius: '8px'
                    }
                  }
                }}
              />
            </Stack>

            <Stack spacing={0.375}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: 1.5,
                  mb: 0.375
                }}
              >
                Description (optional)
              </Typography>
              <TextField
                {...register('description')}
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                placeholder="Enter description"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& textarea': {
                      fontSize: '16px',
                      lineHeight: '24px'
                    },
                    '& fieldset': {
                      borderRadius: '8px'
                    }
                  }
                }}
              />
            </Stack>

            <Stack direction="row" spacing={3}>
              <Box sx={{ 
                flex: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
                px: 1.5,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Enabled"
                      sx={{
                        margin: 0,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '16px'
                        }
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ 
                flex: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
                px: 1.5,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Controller
                  name="is_default"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Set as Default"
                      sx={{
                        margin: 0,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '16px'
                        }
                      }}
                    />
                  )}
                />
              </Box>
            </Stack>

            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
                pt: 2,
                mt: 1,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Button
                onClick={handleBack}
                sx={{ 
                  px: 2,
                  py: 0.75,
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none'
                }}
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                endIcon={<Icon icon="mdi:check" />}
                sx={{ 
                  px: 2,
                  py: 0.75,
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderRadius: '8px'
                }}
              >
                Create Profile
              </LoadingButton>
            </Box>
          </Stack>
        </form>
      ),
    },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '18px', lineHeight: 1.57 }}>
          Create Call System Profile
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 300, mt: 0.5, color: 'text.secondary' }}>
          Configure your call system provider profile
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            '& .MuiStepConnector-line': {
              borderLeftColor: 'divider',
              borderLeftWidth: 2,
              ml: .5,
            },
            '& .MuiStep-root': {
              '& .MuiStepLabel-root': {
                alignItems: 'flex-start',
              },
              '& .MuiStepConnector-root': {
                ml: '16px',
              },
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                StepIconComponent={(props) => <StepIcon {...props} icon={index + 1} />}
                sx={{
                  '& .MuiStepLabel-iconContainer': {
                    pr: 2,
                  },
                }}
              >
                <Stack spacing={1.25}>
                  <Typography variant="overline" fontWeight={600} sx={{ fontSize: '20px', lineHeight: 1.2 }}>
                    {step.label}
                  </Typography>
                  
                  {index === 0 && selectedProvider && activeStep > 0 && (
                    <Box
                      sx={{
                        bgcolor: 'action.hover',
                        borderRadius: '10px',
                        p: 1.25,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        maxWidth: 233
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'background.paper'
                        }}
                      >
                        {selectedProvider.logo_url ? (
                          <img 
                            src={selectedProvider.logo_url}
                            alt={selectedProvider.name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'contain',
                              padding: '4px'
                            }}
                          />
                        ) : (
                          <Icon 
                            icon="mdi:phone-in-talk" 
                            width={20} 
                            height={20} 
                            style={{ color: '#1976d2' }}
                          />
                        )}
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 500,
                          fontSize: '16px',
                          lineHeight: 1.2,
                          flex: 1,
                          minWidth: 0
                        }}
                      >
                        {selectedProvider.name === 'Cyprus BPX' ? 'Cyprus P.B.X' : selectedProvider.name}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </StepLabel>
              <StepContent
                sx={{
                  borderLeftColor: 'divider',
                  borderLeftWidth: 2,
                  ml: '16px',
                  pl: 3,
                  py: 2,
                }}
              >
                {step.content}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
}; 