import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAssetPath } from 'src/utils/asset-path';
import { paths } from 'src/paths';

const currencyLabels = {
  USD: '$ - US Dollar (USD)',
  EUR: '€ - Euro (EUR)',
  GBP: '£ - British Pound (GBP)',
  CAD: '$ - Canadian Dollar (CAD)',
  AUD: '$ - Australian Dollar (AUD)',
  BRL: 'R$ - Brazilian Real (BRL)',
  BTC: '₿ - Bitcoin (BTC)',
  ETH: 'Ξ - Ethereum (ETH)',
  SEK: 'kr - Swedish Krona (SEK)',
  NOK: 'kr - Norwegian Krone (NOK)'
};

const languageLabels = {
  en: 'English (en)',
  de: 'Germany (de)',
  es: 'Spanish (es)',
  fr: 'French (fr)',
  it: 'Italian (it)',
  pt: 'Portuguese (pt)',
  ru: 'Russian (ru)',
  zh: 'Chinese (zh)',
  sv: 'Swedish (sv)'
};

const languageFlags = {
  en: '🇬🇧',
  de: '🇩🇪',
  es: '🇪🇸',
  fr: '🇫🇷',
  it: '🇮🇹',
  pt: '🇵🇹',
  ru: '🇷🇺',
  zh: '🇨🇳',
  sv: '🇸🇪'
};

export const PaymentSystemProviderDetail = ({ provider, onStartIntegration }) => {
  const [activeTab, setActiveTab] = useState(provider?.pdf_path ? 'brochure' : 'about');
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const navigate = useNavigate();

  const tabs = useMemo(() => {
    const baseTabs = provider?.pdf_path ? [{ id: 'brochure', label: 'Brochure' }] : [];
    return [
      ...baseTabs,
      { id: 'about', label: 'About' },
      { id: 'reviews', label: 'Reviews' },
      { id: 'contacts', label: 'Contacts' },
      { id: 'offers', label: 'Received Offers' }
    ];
  }, [provider?.pdf_path]);

  useEffect(() => {
    let objectUrl = null;

    const fetchPdf = async () => {
      if (!provider?.pdf_path) {
        setPdfBlobUrl(null);
        return;
      }

      setPdfLoading(true);
      setPdfError(null);

      try {
        const token = localStorage.getItem('token');
        const headers = {};
        
        if (token) {
          headers.Authorization = token;
        }

        const pdfUrl = getAssetPath(provider.pdf_path);
        const response = await axios.get(pdfUrl, {
          headers: headers,
          responseType: 'blob',
        });

        objectUrl = URL.createObjectURL(response.data);
        setPdfBlobUrl(objectUrl);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setPdfError(error?.response?.statusText || error.message || 'Failed to load PDF');
      } finally {
        setPdfLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [provider?.pdf_path]);

  const handleBackToIntegrations = () => {
    navigate(`${paths.dashboard.integration.index}?tab=payment_system`);
  };

  const handleWebsiteClick = () => {
    if (provider.website) {
      window.open(provider.website, '_blank');
    }
  };

  const renderAboutTab = () => (
    <Box sx={{ px: 2.5 }}>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
          p: 2.5,
          borderRadius: '8px'
        })}
      >
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: 'text.primary',
            mb: 1.5
          }}
        >
          Disclaimer
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 300,
            fontFamily: 'Poppins, sans-serif',
            color: 'text.primary',
            lineHeight: 1.6,
            maxWidth: '900px'
          }}
        >
          {provider.description || `${provider.name} is a leading payment service provider, recognized for its innovative approach to payment processing and financial technology solutions. Built to provide secure, efficient, and scalable payment solutions for businesses worldwide.`}
        </Typography>
      </Box>

      <Box sx={{ py: 2.5 }}>
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: 'text.primary',
            mb: 1.5
          }}
        >
          {provider.description}
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 300,
            fontFamily: 'Poppins, sans-serif',
            color: 'text.primary',
            lineHeight: 1.6,
            maxWidth: '900px'
          }}
        >
          {provider.name} offers advanced payment processing solutions designed to streamline transactions, reduce fraud, and enhance the customer payment experience across multiple channels and currencies.
        </Typography>
      </Box>

      {provider.supported_languages && provider.supported_languages.length > 0 && (
        <Box sx={{ py: 2 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              color: 'text.primary',
              textTransform: 'uppercase',
              mb: 1.5
            }}
          >
            Supported Languages
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {provider.supported_languages.filter(lang => lang).map((lang) => (
              <Box
                key={lang}
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2.5,
                  py: 0.75,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75
                })}
              >
                <Typography sx={{ fontSize: '16px' }}>
                  {languageFlags[lang] || '🌐'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {languageLabels[lang] || lang}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {provider.supported_currencies && provider.supported_currencies.length > 0 && (
        <Box sx={{ py: 2 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              color: 'text.primary',
              textTransform: 'uppercase',
              mb: 1.5
            }}
          >
            Supported Currencies
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {provider.supported_currencies.map((currency) => (
              <Box
                key={currency}
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2.5,
                  py: 0.75,
                  borderRadius: '5px'
                })}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {currencyLabels[currency] || currency}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {provider.supported_regions && provider.supported_regions.length > 0 && (
        <Box sx={{ py: 2 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              color: 'text.primary',
              textTransform: 'uppercase',
              mb: 1.5
            }}
          >
            Supported Regions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {provider.supported_regions.map((region) => (
              <Box
                key={region}
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2.5,
                  py: 0.75,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75
                })}
              >
                <Icon icon="mdi:earth" width={16} height={16} />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57,
                    textTransform: 'capitalize'
                  }}
                >
                  {region}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {provider.technical_specs && (
        <Box sx={{ py: 2 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              color: 'text.primary',
              textTransform: 'uppercase',
              mb: 1.5
            }}
          >
            Technical Specifications
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {provider.technical_specs.api_version && (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2,
                  py: 1,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                })}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  API Version
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {provider.technical_specs.api_version}
                </Typography>
              </Box>
            )}

            {provider.technical_specs.base_url_production && (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2,
                  py: 1,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                })}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  Production URL
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {provider.technical_specs.base_url_production}
                </Typography>
              </Box>
            )}

            {provider.technical_specs.base_url_sandbox && (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2,
                  py: 1,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                })}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  Sandbox URL
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {provider.technical_specs.base_url_sandbox}
                </Typography>
              </Box>
            )}

            {provider.technical_specs.supports_https !== undefined && (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2,
                  py: 1,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                })}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  HTTPS Support
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {provider.technical_specs.supports_https ? 'Yes' : 'No'}
                </Typography>
              </Box>
            )}

            {provider.technical_specs.ip_whitelist_required !== undefined && (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2,
                  py: 1,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                })}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  IP Whitelist Required
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {provider.technical_specs.ip_whitelist_required ? 'Yes' : 'No'}
                </Typography>
              </Box>
            )}

            {provider.technical_specs.max_transaction_amount !== undefined && (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2,
                  py: 1,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                })}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  Max Transaction Amount
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {provider.technical_specs.max_transaction_amount.toLocaleString()}
                </Typography>
              </Box>
            )}

            {provider.technical_specs.min_transaction_amount !== undefined && (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2,
                  py: 1,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                })}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  Min Transaction Amount
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {provider.technical_specs.min_transaction_amount}
                </Typography>
              </Box>
            )}

            {provider.technical_specs.rate_limit && (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.08)',
                  px: 2,
                  py: 1,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                })}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  Rate Limit
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {provider.technical_specs.rate_limit}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      <Box sx={{ py: 2 }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            color: 'text.primary',
            textTransform: 'uppercase',
            mb: 1.5
          }}
        >
          Provider Information
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
          {provider.existing_count !== undefined && (
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.08)',
                px: 2,
                py: 1,
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: '280px'
              })}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  color: 'text.primary',
                  lineHeight: 1.57
                }}
              >
                Existing Integrations
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  color: 'text.primary',
                  lineHeight: 1.57
                }}
              >
                {provider.existing_count}
              </Typography>
            </Box>
          )}

          {provider.rating !== undefined && (
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.08)',
                px: 2,
                py: 1,
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: '280px'
              })}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  color: 'text.primary',
                  lineHeight: 1.57
                }}
              >
                Average Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Icon icon="mdi:star" width={16} height={16} style={{ color: '#FFD700' }} />
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57
                  }}
                >
                  {provider.rating.toFixed(1)}
                </Typography>
              </Box>
            </Box>
          )}

          {provider.review_count !== undefined && (
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.08)',
                px: 2,
                py: 1,
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: '280px'
              })}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  color: 'text.primary',
                  lineHeight: 1.57
                }}
              >
                Total Reviews
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  color: 'text.primary',
                  lineHeight: 1.57
                }}
              >
                {provider.review_count.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

    </Box>
  );

  const renderBrochureTab = () => {
    if (!provider?.pdf_path) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '500px',
            px: 2.5,
            py: 6
          }}
        >
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.02)',
              mb: 3
            })}
          >
            <Icon 
              icon="mdi:file-document-outline" 
              width={40} 
              height={40}
              style={{ 
                color: 'rgba(99, 102, 241, 0.5)'
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: 'text.primary',
              mb: 1
            }}
          >
            No Brochure Available
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
              color: 'text.secondary',
              textAlign: 'center',
              maxWidth: '400px'
            }}
          >
            Documentation for this provider is not available at the moment
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ px: 2.5 }}>
        <Box sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            
            <Button
              variant="contained"
              size="small"
              startIcon={<Icon icon="mdi:open-in-new" width={16} />}
              onClick={() => window.open(getAssetPath(provider.pdf_path), '_blank')}
              sx={{
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              Open in New Tab
            </Button>
          </Box>
          
          <Box
            sx={(theme) => ({
              border: 1,
              borderColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'divider',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.02)' 
                : 'background.paper',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& iframe': {
                overflow: 'hidden !important',
                scrollbarWidth: 'none !important',
                msOverflowStyle: 'none !important',
                '&::-webkit-scrollbar': {
                  display: 'none !important',
                  width: '0 !important',
                  height: '0 !important'
                },
                '&::-webkit-scrollbar-track': {
                  display: 'none !important'
                },
                '&::-webkit-scrollbar-thumb': {
                  display: 'none !important'
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '20px',
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.02)' 
                  : 'background.paper',
                pointerEvents: 'none',
                zIndex: 1
              }
            })}
          >
            {pdfLoading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={40} />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.secondary'
                  }}
                >
                  Loading PDF...
                </Typography>
              </Box>
            )}

            {pdfError && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3 }}>
                <Icon icon="mdi:alert-circle-outline" width={48} height={48} style={{ color: '#f44336' }} />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    textAlign: 'center'
                  }}
                >
                  Failed to load PDF
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 400,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.secondary',
                    textAlign: 'center'
                  }}
                >
                  {pdfError}
                </Typography>
              </Box>
            )}

            {!pdfLoading && !pdfError && pdfBlobUrl && (
              <Box
                component="iframe"
                src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-width`}
                sx={{
                  width: 'calc(100% + 20px)',
                  height: '1400px',
                  border: 'none',
                  display: 'block',
                  marginRight: '-20px'
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'brochure':
        return renderBrochureTab();
      case 'about':
        return renderAboutTab();
      case 'reviews':
        return (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '500px',
              px: 2.5,
              py: 6
            }}
          >
            <Box
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.02)',
                mb: 3
              })}
            >
              <Icon 
                icon="mdi:star-outline" 
                width={40} 
                height={40}
                style={{ 
                  color: 'rgba(255, 215, 0, 0.5)'
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                color: 'text.primary',
                mb: 1
              }}
            >
              No Reviews Yet
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'Inter, sans-serif',
                color: 'text.secondary',
                textAlign: 'center',
                maxWidth: '400px'
              }}
            >
              Reviews for this provider will appear here
            </Typography>
          </Box>
        );
      case 'contacts':
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "500px",
              px: 2.5,
              py: 6,
            }}
          >
            <Box
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                mb: 3,
              })}
            >
              <Icon
                icon="mdi:account-multiple-outline"
                width={40}
                height={40}
                style={{
                  color: "rgba(99, 102, 241, 0.5)",
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                color: "text.primary",
                mb: 1,
              }}
            >
              No Contacts Yet
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                fontFamily: "Inter, sans-serif",
                color: "text.secondary",
                textAlign: "center",
                maxWidth: "400px",
              }}
            >
              Contact information for this provider will appear here
            </Typography>
          </Box>
        );
      case 'offers':
        return (
          <Box sx={{ px: 2.5, py: 3, textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Received Offers content coming soon
            </Typography>
          </Box>
        );
      default:
        return renderAboutTab();
    }
  };

  if (!provider) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, py: 2 }}>
        <Button
          onClick={handleBackToIntegrations}
          startIcon={<Icon icon="octicon:arrow-left-16" width={20} />}
          sx={{
            color: 'text.primary',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'none',
            mb: 1.5,
            px: 0,
            '&:hover': {
              backgroundColor: 'transparent',
              opacity: 0.7
            }
          }}
        >
          Back to Integrations
        </Button>
        <Typography
          sx={{
            fontSize: '28px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: 'text.primary'
          }}
        >
          Integrations
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          borderBottom: 1,
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 1.5
        })}
      >
        <Box
          component="img"
          src={provider.logo_url}
          alt={provider.name}
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            objectFit: 'contain',
            backgroundColor: '#fff'
          }}
        />

        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: 'text.primary'
          }}
        >
          {provider.name}
        </Typography>

        {provider.website && (
          <Typography
            onClick={handleWebsiteClick}
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
              color: '#00bbff',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            View Website
          </Typography>
        )}
      </Box>

      <Box
        sx={(theme) => ({
          borderBottom: 1,
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5
        })}
      >
        <Box sx={{ display: 'flex', gap: 2.5 }}>
          {tabs.map((tab) => (
            <Box
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 0,
                py: 1.5,
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? 2 : 0,
                borderColor: activeTab === tab.id 
                  ? 'primary.main' 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)'
                }
              })}
            >
              <Typography
                sx={(theme) => ({
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  color: activeTab === tab.id 
                    ? 'text.primary' 
                    : theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.5)'
                      : 'text.secondary',
                  lineHeight: '20px'
                })}
              >
                {tab.id === 'about' ? `About ${provider.name}` : tab.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={onStartIntegration}
          sx={{
            height: '36px',
            borderRadius: '8px',
            px: 2,
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'none',
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
            backgroundColor: '#fff',
            color: '#000',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          Start integration
        </Button>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto'
        }}
      >
        {renderTabContent()}
      </Box>
    </Box>
  );
};

PaymentSystemProviderDetail.propTypes = {
  provider: PropTypes.object,
  onStartIntegration: PropTypes.func
};
