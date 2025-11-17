import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import { useCallback } from "react";
import { Icon } from '@iconify/react';

import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { getAPIUrl } from "src/config";

const featureLabels = {
  outbound_calls: 'Outbound Calls',
  inbound_calls: 'Inbound Calls',
  call_recording: 'Call Recording',
  call_forwarding: 'Call Forwarding',
  ivr: 'IVR',
  sms: 'SMS',
  predictive_dialer: 'Predictive Dialer',
  omnichannel: 'Omnichannel',
  ai_chatbot: 'AI Chatbot',
  crm_integration: 'CRM Integration'
};

export const CallProviderItem = ({ provider, pageInfo, providerInfo }) => {
  const router = useRouter();
  
  const handleSettingsOpen = useCallback(
    () => {
      router.push(`${paths.dashboard.integration.callProviderSettings}/${provider?.id}?pageInfo=${pageInfo}`);
    },
    [router, provider?.id, pageInfo]
  );

  const getProviderLogo = (provider) => {
    if (provider?.logo_url) {
      return provider?.logo_url?.includes('http') ? provider?.logo_url : `${getAPIUrl()}/${provider?.logo_url}`;
    }
    
    if (providerInfo?.logo_url) {
      return providerInfo?.logo_url || null;
    }
  };

  
  const rating = providerInfo?.rating || provider?.rating || 0;
  const reviewCount = providerInfo?.review_count || provider?.review_count || 0;
  const supportedFeatures = providerInfo?.supported_features || [];
  const description = providerInfo?.description;

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
    <Grid xs={6} sm={6} md={6} lg={6} xl={4}>
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
        onClick={handleSettingsOpen}
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
        
        <Box sx={{ p: 2, position: 'relative' }}>
          {pageInfo === 'call-system' && provider?.is_default && (
            <Chip 
              label="Default"
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                height: 20,
                fontSize: '10px',
                fontWeight: 600,
                zIndex: 1
              }}
            />
          )}
          
          <Stack direction="row" spacing={2} alignItems="flex-start">
            {getProviderLogo(provider) ? (
              <Box
                component="img"
                src={getProviderLogo(provider)}
                alt={provider?.name}
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
                {provider?.name}
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
                  {renderStarRating(rating)}
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
                  {reviewCount}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {supportedFeatures.length > 0 && (
          <Stack 
            direction="row" 
            sx={{ 
              px: 2, 
              py: 1,
              flexWrap: 'wrap',
              gap: 1.25
            }}
          >
            {supportedFeatures.slice(0, 3).map((feature) => (
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
        )}

        {description && (
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
              {description}
            </Typography>
          </Box>
        )}
      </Card>
    </Grid>
  );
};

CallProviderItem.propTypes = {
  provider: PropTypes.object.isRequired,
  pageInfo: PropTypes.string,
  providerInfo: PropTypes.object,
};
