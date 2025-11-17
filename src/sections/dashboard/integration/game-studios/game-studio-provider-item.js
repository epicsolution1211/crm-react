import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { useCallback, useState, useEffect } from "react";
import { Icon } from '@iconify/react';

import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { getAssetPath } from "src/utils/asset-path";
import { gameProvidersApi } from "src/api/game-providers";
import { getAPIUrl } from "src/config";

const gameTypeLabels = {
  slots: 'Slots',
  table_games: 'Table Games',
  video_poker: 'Video Poker',
  live_casino: 'Live Casino',
  live_game_shows: 'Live Game Shows',
  crash_games: 'Crash Games',
  instant_games: 'Instant Games',
  video_slots: 'Video Slots',
  roulette: 'Roulette',
  blackjack: 'Blackjack',
  baccarat: 'Baccarat',
  poker: 'Poker'
};

let providersCache = null;

const fetchProvidersData = async () => {
  if (providersCache) {
    return providersCache;
  }
  
  const response = await gameProvidersApi.getGameProviders();
  if (response?.success && response?.data?.providers) {
    providersCache = response.data.providers.map(item => item.provider);
  }
  return providersCache || [];
};

const getProviderData = (providerType, providersData) => {
  if (!providersData) return null;
  return providersData.find(p => p.type === providerType);
};

const getProviderLogo = (provider, providersData) => {
  const providerData = getProviderData(provider.provider_type, providersData);

  if (provider?.logo_url) {
    return provider?.logo_url?.includes('http') ? provider?.logo_url : `${getAPIUrl()}/${provider?.logo_url}`;
  } else if (providerData?.logo_url) {
    return providerData.logo_url;
  }
  
  const fallbackLogoMap = {
    booming_games: getAssetPath("/assets/icons/gaming/booming_games.jpg"),
    evolution: getAssetPath("/assets/icons/gaming/evolution.png"),
    netent: getAssetPath("/assets/icons/gaming/netent.png"),
    pragmatic_play: getAssetPath("/assets/icons/gaming/pragmatic_play.png"),
  };
  
  return fallbackLogoMap[provider.provider_type] || null;
};

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

export const GameStudioProviderItem = ({ provider, pageInfo }) => {
  const router = useRouter();
  const [providersData, setProvidersData] = useState(null);
  
  useEffect(() => {
    const loadProviders = async () => {
      const data = await fetchProvidersData();
      setProvidersData(data);
    };
    loadProviders();
  }, []);
  
  const providerData = getProviderData(provider.provider_type, providersData);
  
  const handleSettingsOpen = useCallback(
    () => {
      router.push(`${paths.dashboard.integration.gameStudioProviderSettings}/${provider?.id}?pageInfo=${pageInfo}`);
    },
    [router]
  );

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
          borderColor: theme.palette.mode === 'dark' ? '#111927' : 'divider',
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
        <Box sx={{ px: 3, pt: 3, pb: 0 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              component="img"
              src={getProviderLogo(provider, providersData)}
              alt={provider?.name}
              sx={{
                width: 107.5,
                height: 57.471,
                borderRadius: '5px',
                objectFit: 'cover',
                backgroundColor: '#fff'
              }}
            />
            
            <Stack spacing={0.375} flex={1} sx={{ height: 57, justifyContent: 'center' }}>
              <Tooltip 
                title={provider?.name || ''}
                arrow
                placement="top"
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'text.primary',
                    textTransform: 'uppercase',
                    lineHeight: 1.57,
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'help'
                  }}
                >
                  {provider?.name 
                    ? provider.name.length > 15 
                      ? `${provider.name.slice(0, 15)}...` 
                      : provider.name
                    : ''}
                </Typography>
              </Tooltip>
              
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
                  {renderStarRating(0)}
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
                  0
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        <Stack 
          direction="row" 
          sx={{ 
            px: 3, 
            pt: 2,
            pb: 1.25,
            flexWrap: 'wrap',
            gap: 1.25
          }}
        >
          {providerData?.game_types?.slice(0, 3).map((gameType) => (
            <Chip
              key={gameType}
              label={gameTypeLabels[gameType] || gameType}
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

        <Box sx={{ px: 3.125, pb: 1.25, pt: 0 }}>
          <Tooltip 
            title={providerData?.description || 'Click to view and configure provider settings'}
            arrow
            placement="top"
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                color: 'text.primary',
                lineHeight: 1.57,
                fontFamily: 'Inter, sans-serif',
                cursor: 'help'
              }}
            >
              {providerData?.description 
                ? providerData.description.length > 150 
                  ? `${providerData.description.slice(0, 150)}...` 
                  : providerData.description
                : 'Click to view and configure provider settings'}
            </Typography>
          </Tooltip>
        </Box>
      </Card>
    </Grid>
  );
};

GameStudioProviderItem.propTypes = {
  provider: PropTypes.object.isRequired,
  pageInfo: PropTypes.string,
};
