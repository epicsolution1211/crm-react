import { useState, useMemo, useCallback, useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from "@mui/material/Unstable_Grid2";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import { CallSystemFilters } from './call-system-filters';
import { ProviderInfoDialog } from './provider-info-dialog';
import { paths } from 'src/paths';
import { callProvidersApi } from 'src/api/call-providers';

const featureLabels = {
  inbound: 'Inbound Calls',
  outbound: 'Outbound Calls',
  recording: 'Call Recording',
  ivr: 'IVR',
  sms: 'SMS',
  agent_mapping: 'Agent Mapping',
  analytics: 'Call Analytics',
  voicemail: 'Voicemail',
  advanced_routing: 'Advanced Routing',
  hangup: 'Hangup'
};

export const AvailableOptions = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    features: [],
    regions: [],
    reviews: []
  });
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const response = await callProvidersApi.getCallProviders();
        
        if (response?.data?.providers) {
          const transformedProviders = response.data.providers.map(item => ({
            ...item.provider,
            review_count: 0,
            supported_regions: []
          }));
          setProviders(transformedProviders);
        }
      } catch (error) {
        console.error('Error fetching call providers:', error);
        setProviders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleProviderClick = (provider) => {
    navigate(`${paths.dashboard.integration.index}/call-system/${provider.type}`);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProvider(null);
  };

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      if (filters.features.length > 0) {
        const hasMatchingFeature = provider.supported_features?.some(feature => 
          filters.features.includes(feature)
        );
        if (!hasMatchingFeature) return false;
      }

      if (filters.regions.length > 0) {
        const hasMatchingRegion = provider.supported_regions?.some(region => 
          filters.regions.includes(region)
        );
        if (!hasMatchingRegion) return false;
      }

      if (filters.reviews.length > 0) {
        const minRating = Math.min(...filters.reviews);
        if (provider.rating < minRating) return false;
      }

      return true;
    });
  }, [filters, providers]);

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon 
          key={`full-${i}`} 
          icon="mdi:star" 
          width={14} 
          height={14}
          style={{ color: '#FFD700' }}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon 
          key="half" 
          icon="mdi:star-half-full" 
          width={14} 
          height={14}
          style={{ color: '#FFD700' }}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon 
          key={`empty-${i}`} 
          icon="mdi:star-outline" 
          width={14} 
          height={14}
          style={{ color: '#FFD700' }}
        />
      );
    }

    return stars;
  };

  return (
    <>
      <CallSystemFilters onFiltersChange={handleFiltersChange} />
      
      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          py: 2
        }}
      >
        <Container maxWidth="xl">
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8
              }}
            >
              <Icon 
                icon="mdi:loading" 
                width={64} 
                height={64}
                style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }}
              />
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 1,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Loading providers...
              </Typography>
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </Box>
          ) : filteredProviders.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8
              }}
            >
              <Icon 
                icon="mdi:phone-off" 
                width={64} 
                height={64}
                style={{ marginBottom: '16px', opacity: 0.3 }}
              />
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 1,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                No providers found
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: 'text.secondary',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Try adjusting your filters to see more results
              </Typography>
            </Box>
          ) : (
            <Grid
              container
              spacing={3}
              sx={{
                mt: 2,
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(10px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              {filteredProviders.map((provider) => {
                const logoPath = provider?.logo_url;

                return (
                  <Grid key={provider.type} xs={6} sm={6} md={6} lg={6} xl={4}>
                    <Card
                      sx={(theme) => ({
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: theme.palette.mode === 'dark' 
                          ? '0 0 15px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.08)'
                          : 1,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.palette.mode === 'dark'
                            ? '0 0 20px rgba(0, 0, 0, 0.4), 0 0 35px rgba(255, 255, 255, 0.15)'
                            : 4,
                        }
                      })}
                      onClick={() => handleProviderClick(provider)}
                    >
                      <LinearProgress 
                        variant="determinate" 
                        value={0} 
                        sx={{ 
                          height: 4,
                          backgroundColor: 'transparent',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'primary.main'
                          }
                        }}
                      />
                      
                      <Box sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          {logoPath ? (
                            <Box
                              component="img"
                              src={logoPath}
                              alt={provider.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                              sx={{
                                width: 90,
                                height: 48,
                                borderRadius: '5px',
                                objectFit: 'contain',
                                backgroundColor: '#fff',
                                padding: '4px'
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 90,
                                height: 48,
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'action.hover'
                              }}
                            >
                              <Icon 
                                icon="mdi:phone" 
                                width={24} 
                                height={24}
                                style={{ opacity: 0.5 }}
                              />
                            </Box>
                          )}
                          
                          <Stack spacing={0.25} flex={1}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: '16px',
                                color: 'text.primary',
                                textTransform: 'uppercase',
                                lineHeight: 1.4,
                                fontFamily: 'Inter, sans-serif'
                              }}
                            >
                              {provider.name}
                            </Typography>
                            
                            <Box
                              sx={(theme) => ({
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.625,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.20)' : 'action.hover',
                                borderRadius: '5px',
                                px: 2.5,
                                py: 0.25,
                                width: 'fit-content'
                              })}
                            >
                              <Typography
                                sx={{
                                  fontSize: '10px',
                                  fontWeight: 500,
                                  color: 'text.primary',
                                  lineHeight: 1.57,
                                  fontFamily: 'Inter, sans-serif'
                                }}
                              >
                                Reviews
                              </Typography>
                              
                              <Stack direction="row" spacing={0} alignItems="center">
                                {renderStarRating(provider.rating || 0)}
                              </Stack>
                              
                              <Typography
                                sx={{
                                  fontSize: '10px',
                                  fontWeight: 500,
                                  color: 'text.primary',
                                  lineHeight: 1.57,
                                  fontFamily: 'Inter, sans-serif'
                                }}
                              >
                                {provider.review_count}
                              </Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      </Box>

                      <Stack 
                        direction="row" 
                        sx={{ 
                          px: 2, 
                          py: 1,
                          flexWrap: 'wrap',
                          gap: 1.25
                        }}
                      >
                        {provider.supported_features?.slice(0, 3).map((feature) => (
                          <Chip
                            key={feature}
                            label={featureLabels[feature] || feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            sx={(theme) => ({
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.20)' : 'action.hover',
                              color: 'text.primary',
                              fontSize: '10px',
                              fontWeight: 500,
                              height: 'auto',
                              py: 0.25,
                              px: 2.5,
                              borderRadius: '5px',
                              fontFamily: 'Inter, sans-serif',
                              '& .MuiChip-label': {
                                px: 0,
                                py: 0
                              }
                            })}
                          />
                        ))}
                      </Stack>

                      {provider.description && (
                        <Box sx={{ px: 2, py: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              fontWeight: 400,
                              color: 'text.primary',
                              lineHeight: 1.57,
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            {provider.description}
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Stack>

      <ProviderInfoDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        provider={selectedProvider}
        providers={filteredProviders}
      />
    </>
  );
};
