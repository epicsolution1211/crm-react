import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
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
  Chip,
  Autocomplete,
  InputAdornment,
  IconButton,
  Collapse,
  CircularProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';

import { gameProvidersApi } from '../../../../api/game-providers';

const createValidationSchema = (selectedProviderType) => {
  const baseSchema = {
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    provider_type: yup.string().required('Provider type is required'),
    enabled: yup.boolean(),
    is_default: yup.boolean(),
    supported_currencies: yup.array().min(1, 'At least one currency must be selected'),
    supported_languages: yup.array().min(1, 'At least one language must be selected'),
  };

  if (selectedProviderType?.required_credentials) {
    const credentialsSchema = {};
    selectedProviderType.required_credentials.forEach(credential => {
      const key = typeof credential === 'string' ? credential : credential.key;
      const label = typeof credential === 'string' 
        ? credential.replace('_', ' ').toUpperCase() 
        : credential.label;
      
      if (key === 'api_url' || key.includes('url')) {
        credentialsSchema[key] = yup.string().url('Must be a valid URL').required(`${label} is required`);
      } else {
        credentialsSchema[key] = yup.string().required(`${label} is required`);
      }
    });
    baseSchema.credentials = yup.object(credentialsSchema);
  }

  return yup.object(baseSchema);
};

const ProviderTypeCard = ({ provider, isSelected, onSelect }) => {
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
      onClick={() => {
        onSelect(provider);
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                bgcolor: 'primary.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon 
                icon="cil:casino" 
                width={24} 
                height={24} 
                style={{ color: '#1976d2' }}
              />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={600}>
                {provider.display_name || provider.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {provider.provider_type || provider.type}
              </Typography>
            </Stack>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
            {provider.description}
          </Typography>
          
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Supported Features:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {provider.supported_features?.slice(0, 4).map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {provider.supported_features?.length > 4 && (
                <Chip
                  label={`+${provider.supported_features.length - 4} more`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

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

const LANGUAGE_NAMES = {
  'en': 'English',
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian',
  'fi': 'Finnish',
  'pl': 'Polish',
  'tr': 'Turkish',
  'cs': 'Czech',
};

export const GameStudioProviderCreateDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  preselectedProvider,
  internalBrandId
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedProviderType, setSelectedProviderType] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [providersData, setProvidersData] = useState([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  const getDefaultCredentials = (providerType) => {
    if (!providerType?.required_credentials) return {};
    const credentials = {};
    providerType.required_credentials.forEach(credential => {
      const key = typeof credential === 'string' ? credential : credential.key;
      credentials[key] = '';
    });
    return credentials;
  };

  useEffect(() => {
    const fetchProviders = async () => {
      if (!open) return;
      
      setIsLoadingProviders(true);
      try {
        const response = await gameProvidersApi.getGameProviders();
        if (response.data?.providers) {
          const transformedProviders = response.data.providers.map(item => {
            const provider = item.provider;
            return {
              ...provider,
              logo: provider.logo_url,
              provider_type: provider.type
            };
          });
          setProvidersData(transformedProviders);
        }
      } catch (error) {
        console.error('Error fetching game providers:', error);
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, [open]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createValidationSchema(selectedProviderType)),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: preselectedProvider?.name || '',
      description: preselectedProvider?.description || '',
      provider_type: preselectedProvider?.provider_type || '',
      enabled: true,
      is_default: false,
      credentials: getDefaultCredentials(selectedProviderType),
      supported_currencies: [],
      supported_languages: [],
    },
  });



  useEffect(() => {
    if (open) {
      setSelectedProviderType(null);
    } else {
      reset();
      setActiveStep(0);
      setSelectedProviderType(null);
      setShowCredentials(false);
    }
  }, [open, reset]);

  useEffect(() => {
    if (open && preselectedProvider) {
      const defaultValues = {
        name: preselectedProvider?.name || '',
        description: preselectedProvider?.description || '',
        provider_type: preselectedProvider?.type || '',
        enabled: true,
        is_default: false,
        credentials: {},
        supported_currencies: [],
        supported_languages: [],
      };
      reset(defaultValues);
    }
  }, [open, preselectedProvider, reset]);

  useEffect(() => {
    if (preselectedProvider && open) {
      const matchingProvider = providersData.find(
        (provider) => provider.type === preselectedProvider.type
      );
      if (matchingProvider) {
        setSelectedProviderType(matchingProvider);
        setValue('provider_type', matchingProvider?.type);
        setValue('name', preselectedProvider.name || '');
        setValue('description', preselectedProvider.description || '');
        
        const newCredentials = getDefaultCredentials(matchingProvider);
        setValue('credentials', newCredentials);
        
        setActiveStep(1);
      }
    }
  }, [preselectedProvider, setValue, open, providersData]);

  const handleProviderTypeSelect = (provider) => {
    setSelectedProviderType(provider);
    setValue('provider_type', provider.type);
    
    const newCredentials = getDefaultCredentials(provider);
    setValue('credentials', newCredentials);
    
    if (provider.supported_currencies) {
      setValue('supported_currencies', []);
    }
    if (provider.supported_languages) {
      setValue('supported_languages', []);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedProviderType) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    } else if (activeStep === 2) {
      setActiveStep(1);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const formData = {
        name: data.name,
        description: data.description,
        provider_type: data.provider_type,
        enabled: data.enabled,
        credentials: data.credentials,
        supported_currencies: data.supported_currencies,
        supported_languages: data.supported_languages.map(lang => lang.code),
        internal_brand_id: internalBrandId
      };

      await onSubmit(formData);
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
          {isLoadingProviders ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : providersData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                No providers available
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {providersData.map((provider) => {
                let isSelected = false;
                if (selectedProviderType) {
                  if (selectedProviderType.type && provider.type) {
                    isSelected = selectedProviderType.type === provider.type;
                  } else if (selectedProviderType.id && provider.id) {
                    isSelected = selectedProviderType.id === provider.id;
                  }
                }
                
                return (
                  <Grid item xs={12} md={6} key={provider.type}>
                    <ProviderTypeCard
                      provider={provider}
                      isSelected={isSelected}
                      onSelect={handleProviderTypeSelect}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedProviderType || isLoadingProviders}
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
      label: 'Provider Details',
      content: (
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
            Provider Details
          </Typography>

          {selectedProviderType && (
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
                <img 
                  src={selectedProviderType.logo}
                  alt={selectedProviderType.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                />
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
                  {selectedProviderType.name}
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
                  {selectedProviderType.description}
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
              Your custom name
            </Typography>
            <TextField
              {...register('name')}
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              placeholder="Enter custom name"
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
            <Button
              variant="contained"
              onClick={handleNext}
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
      label: 'Configuration',
      content: (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={3}>
            <Box sx={{ 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: '10px', 
              bgcolor: 'action.hover',
              p: 1.25 
            }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Icon icon="mdi:key-variant" width={20} height={20} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '16px' }}>
                  API Credentials
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowCredentials(!showCredentials)}
                  sx={{ ml: 'auto' }}
                >
                  <Icon icon={showCredentials ? 'mdi:chevron-up' : 'mdi:chevron-down'} width={20} height={20} />
                </IconButton>
              </Stack>
              
              <Collapse in={showCredentials}>
                <Stack spacing={2}>
                  {selectedProviderType?.required_credentials?.map((credential) => {
                    const key = typeof credential === 'string' ? credential : credential.key;
                    const label = typeof credential === 'string' 
                      ? credential.replace('_', ' ').toUpperCase() 
                      : credential.label;
                    const type = typeof credential === 'string' 
                      ? (credential.includes('key') || credential.includes('secret') || credential.includes('token') ? 'password' : 'text')
                      : (credential.type === 'password' || credential.encrypted ? 'password' : 'text');
                    
                    return (
                      <Stack key={key} spacing={0.375}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: 1.5
                          }}
                        >
                          {label}
                        </Typography>
                        <TextField
                          {...register(`credentials.${key}`)}
                          fullWidth
                          type={type}
                          error={!!errors.credentials?.[key]}
                          helperText={errors.credentials?.[key]?.message}
                          placeholder={
                            key.includes('url') || key === 'api_url'
                              ? 'https://api.example.com/' 
                              : `Type your ${label.toLowerCase()}`
                          }
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
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon 
                                  icon={
                                    key.includes('url') 
                                      ? 'mdi:link' 
                                      : type === 'password'
                                      ? 'mdi:eye-off'
                                      : 'mdi:form-textbox'
                                  } 
                                  width={20} 
                                  height={20}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Stack>
                    );
                  })}
                </Stack>
              </Collapse>
            </Box>

            <Controller
              name="supported_currencies"
              control={control}
              render={({ field }) => (
                <Stack spacing={0.375}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: 1.5
                    }}
                  >
                    Supported Currencies
                  </Typography>
                  <Autocomplete
                    multiple
                    options={selectedProviderType?.supported_currencies || []}
                    value={field.value}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    disabled={!selectedProviderType}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                          sx={{
                            bgcolor: 'action.selected',
                            borderRadius: '20px',
                            fontSize: '16px'
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.supported_currencies}
                        helperText={
                          !selectedProviderType 
                            ? 'Please select a provider type first'
                            : errors.supported_currencies?.message
                        }
                        placeholder={
                          !selectedProviderType 
                            ? 'Select a provider type first...'
                            : 'Select currencies...'
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& input': {
                              fontSize: '16px',
                              lineHeight: '24px'
                            },
                            '& fieldset': {
                              borderRadius: '8px'
                            }
                          }
                        }}
                      />
                    )}
                  />
                </Stack>
              )}
            />

            <Controller
              name="supported_languages"
              control={control}
              render={({ field }) => {
                const languageOptions = selectedProviderType?.supported_languages?.map(code => ({
                  code,
                  name: LANGUAGE_NAMES[code] || code.toUpperCase()
                })) || [];
                
                return (
                  <Stack spacing={0.375}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: 1.5
                      }}
                    >
                      Supported Languages
                    </Typography>
                    <Autocomplete
                      multiple
                      options={languageOptions}
                      getOptionLabel={(option) => `${option.name} (${option.code})`}
                      isOptionEqualToValue={(option, value) => option.code === value.code}
                      value={field.value}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      disabled={!selectedProviderType}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={`${option.name} (${option.code})`}
                            {...getTagProps({ index })}
                            key={option.code}
                            sx={{
                              bgcolor: 'action.selected',
                              borderRadius: '20px',
                              fontSize: '16px'
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.supported_languages}
                          helperText={
                            !selectedProviderType 
                              ? 'Please select a provider type first'
                              : errors.supported_languages?.message
                          }
                          placeholder={
                            !selectedProviderType 
                              ? 'Select a provider type first...'
                              : 'Select languages...'
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& input': {
                                fontSize: '16px',
                                lineHeight: '24px'
                              },
                              '& fieldset': {
                                borderRadius: '8px'
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Stack>
                );
              }}
            />

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


            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end', 
              pt: 2,
              mt: 1,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
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
                Create Provider
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
          minHeight: 600,
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '18px', lineHeight: 1.57 }}>
          Create Game Studio Provider
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 300, mt: 0.5, color: 'text.secondary' }}>
          We will submit your request to all related providers
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
                  
                  {index === 0 && selectedProviderType && activeStep > 0 && (
                    <>
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
                          <img 
                            src={selectedProviderType.logo}
                            alt={selectedProviderType.name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover'
                            }}
                          />
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
                          {selectedProviderType.name}
                        </Typography>
                      </Box>
                    </>
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
