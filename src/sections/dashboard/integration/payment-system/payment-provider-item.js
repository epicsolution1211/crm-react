import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import { useCallback } from "react";
import { Icon } from '@iconify/react';

import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { getAssetPath } from "src/utils/asset-path";
import { Box } from "@mui/system";
import Chip from "@mui/material/Chip";
import { getAPIUrl } from "src/config";

const featureLabels = {
  cards: 'Cards',
  digital_wallets: 'Digital Wallets',
  bank_transfers: 'Bank Transfers',
  '3ds': '3D Secure',
  webhooks: 'Webhooks',
  refunds: 'Refunds',
  voids: 'Voids',
  recurring: 'Recurring',
  fraud_detection: 'Fraud Detection',
  analytics: 'Analytics',
  tokenization: 'Tokenization',
  subscriptions: 'Subscriptions'
};

const getProviderLogo = (provider) => {
  if (provider?.logo_url) {
    return provider?.logo_url?.includes('http') ? provider?.logo_url : `${getAPIUrl()}/${provider?.logo_url}`;
  }
  
  if (provider?.avatar_url) {
    return provider.avatar_url;
  }
  
  const fallbackLogoMap = {
    payretailers: getAssetPath("/assets/icons/payment/payretailers.png"),
    pay_pros: getAssetPath("/assets/icons/payment/pay-pros.png"),
    awesomepayments: getAssetPath("/assets/icons/payment/awp.png"),
    fintech_pay: getAssetPath("/assets/icons/payment/fintech-pay.webp"),
    gateway_pay: getAssetPath("/assets/icons/payment/gateway-pay.jpeg"),
    paycashio: getAssetPath("/assets/icons/payment/paycashio-pay.png"),
    sky_chain: getAssetPath("/assets/icons/payment/skychain-pay.jpeg"),
    simple_psp: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
    atlas24: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
    interio: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
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

export const PaymentProviderItem = ({ provider, pageInfo }) => {
  const router = useRouter();

  const handleSettingsOpen = useCallback(() => {
    router.push(
      `${paths.dashboard.integration.paymentProviderSettings}/${provider?.id}?pageInfo=${pageInfo}`
    );
  }, [router]);

  return (
    <Grid xs={6} sm={6} md={6} lg={6} xl={4}>
      <Card
        sx={(theme) => ({
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "background.paper",
          border: 1,
          borderColor: theme.palette.mode === "dark" ? "#111927" : "divider",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 0 15px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.08)"
              : 1,
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 0 20px rgba(0, 0, 0, 0.4), 0 0 35px rgba(255, 255, 255, 0.15)"
                : 4,
          },
        })}
        onClick={handleSettingsOpen}
      >
        {console.log(getProviderLogo(provider))}
        <Box sx={{ px: 3, pt: 3, pb: 0 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              component="img"
              src={getProviderLogo(provider)}
              alt={provider?.name}
              sx={{
                width: 107.5,
                height: 57.471,
                borderRadius: "5px",
                objectFit: "contain",
                backgroundColor: "#fff",
              }}
            />

            <Stack
              spacing={0.375}
              flex={1}
              sx={{ height: 57, justifyContent: "center" }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "text.primary",
                  textTransform: "uppercase",
                  lineHeight: 1.57,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {provider?.name}
              </Typography>

              <Box
                sx={(theme) => ({
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.625,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.20)"
                      : "action.hover",
                  borderRadius: "5px",
                  px: 2.5,
                  py: 0.25,
                  width: "fit-content",
                })}
              >
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "text.primary",
                    lineHeight: 1.57,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Reviews
                </Typography>

                <Stack direction="row" spacing={0} alignItems="center">
                  {renderStarRating(provider?.rating || 0)}
                </Stack>

                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "text.primary",
                    lineHeight: 1.57,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {provider?.review_count || 0}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {provider?.providerInfo?.supported_features && provider.providerInfo.supported_features.length > 0 && (
          <Stack
            direction="row"
            sx={{
              px: 3,
              py: 1.25,
              flexWrap: "wrap",
              gap: 1.25
            }}
          >
            {provider.providerInfo.supported_features.slice(0, 3).map((feature) => (
              <Chip
                key={feature}
                label={featureLabels[feature] || feature}
                sx={(theme) => ({
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.20)"
                      : "action.hover",
                  color: "text.primary",
                  fontSize: "10px",
                  fontWeight: 500,
                  height: "auto",
                  py: 0.25,
                  px: 2.5,
                  borderRadius: "5px",
                  fontFamily: "Inter, sans-serif",
                  "& .MuiChip-label": {
                    px: 0,
                    py: 0,
                  },
                })}
              />
            ))}
          </Stack>
        )}

        <Box sx={{ px: 3.125, pb: 1.25, pt: 0 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 400,
              color: "text.primary",
              lineHeight: 1.57,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {provider?.providerInfo?.description ||
              "Click to view and configure provider settings"}
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
};

PaymentProviderItem.propTypes = {
  provider: PropTypes.object.isRequired,
};
