import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from "@mui/material/Unstable_Grid2";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import { Icon } from '@iconify/react';

import { PaymentSystemFilters } from './payment-system-filters';
import { paymentProvidersApi } from 'src/api/payment-providers';
import { TableSkeleton } from 'src/components/table-skeleton';

export const AvailableOptions = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    currencies: [],
    reviews: []
  });
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const response = await paymentProvidersApi.getPaymentProviders();
        if (response.success && response.data?.providers) {
          const mappedProviders = response.data.providers.map(item => item.provider);
          setProviders(mappedProviders);
        }
      } catch (error) {
        console.error('Error fetching payment providers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleProviderClick = (provider) => {
    navigate(`/dashboard/integration/payment-system/${provider.type}`);
  };

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      if (filters.currencies.length > 0) {
        const hasMatchingCurrency = provider.supported_currencies?.some(currency => 
          filters.currencies.includes(currency)
        );
        if (!hasMatchingCurrency) return false;
      }

      if (filters.reviews.length > 0) {
        const minRating = Math.min(...filters.reviews);
        const providerRating = provider.rating || 0;
        if (providerRating < minRating) return false;
      }

      return true;
    });
  }, [providers, filters]);

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

  if (isLoading) {
    return (
      <>
        <PaymentSystemFilters onFiltersChange={handleFiltersChange} />
        <Stack
          component="main"
          sx={{
            flexGrow: 1,
            py: 2
          }}
        >
          <Container maxWidth="xl">
            <TableSkeleton />
          </Container>
        </Stack>
      </>
    );
  }

  return (
    <>
      <PaymentSystemFilters onFiltersChange={handleFiltersChange} />
      
      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          py: 2
        }}
      >
        <Container maxWidth="xl">
          {filteredProviders.length === 0 ? (
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
              icon="mdi:filter-off" 
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
              No payment providers available
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
            {filteredProviders.map((provider) => (
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
                    <Box
                      component="img"
                      src={provider.logo_url}
                      alt={provider.display_name || provider.name}
                      sx={{
                        width: 90,
                        height: 48,
                        borderRadius: '5px',
                        objectFit: 'contain',
                        backgroundColor: '#fff'
                      }}
                    />
                    
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
                        {provider.display_name || provider.name}
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
                          {provider.review_count || 0}
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
                  {provider.supported_currencies?.slice(0, 3).map((currency) => (
                    <Chip
                      key={currency}
                      label={currency}
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
              </Card>
            </Grid>
          ))}
        </Grid>
        )}
        </Container>
      </Stack>
    </>
  );
};
