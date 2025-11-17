import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { paths } from 'src/paths';

const gameTypeLabels = {
  slots: 'Slots',
  table_games: 'Table Games',
  video_poker: 'Video Poker',
  live_casino: 'Live Casino',
  live_game_shows: 'Live Game Shows',
  crash_games: 'Crash Games'
};

const currencyLabels = {
  USD: '$ - US Dollar (USD)',
  EUR: '€ - Euro (EUR)',
  GBP: '£ - British Pound (GBP)',
  CAD: '$ - Canadian Dollar (CAD)',
  AUD: '$ - Australian Dollar (AUD)',
  BTC: '₿ - Bitcoin (BTC)',
  ETH: 'Ethereum (ETH)',
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

export const GameStudioProviderDetail = ({ 
  provider, 
  onStartIntegration,
  selectedBrandId,
  onBrandChange,
  internalBrandsList,
  isBrandsLoading
}) => {
  const [activeTab, setActiveTab] = useState(provider?.pdf_url ? 'brochure' : 'about');
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const navigate = useNavigate();

  const tabs = useMemo(() => {
    const baseTabs = provider?.pdf_url ? [{ id: 'brochure', label: 'Brochure' }] : [];
    return [
      ...baseTabs,
      { id: 'about', label: 'About' },
      { id: 'reviews', label: 'Reviews' },
      { id: 'contacts', label: 'Contacts' },
      { id: 'offers', label: 'Received Offers' }
    ];
  }, [provider?.pdf_url]);

  useEffect(() => {
    let objectUrl = null;

    const fetchPdf = async () => {
      if (!provider?.pdf_url) {
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

        const response = await axios.get(provider.pdf_url, {
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
  }, [provider?.pdf_url]);

  const handleBackToIntegrations = () => {
    navigate(`${paths.dashboard.integration.index}?tab=game_studios`);
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
          OCTOLIT provides technology and integration solutions that connect casino game providers with their clients. We are not involved in, nor responsible for, any transactions, agreements, or interactions between providers and their clients. OCTOLIT’s role is limited to offering the technical platform and gaming environment connection, and we assume no liability for any disputes, losses, or issues arising between third parties.
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
            maxWidth: '900px',
            whiteSpace: 'pre-line'
          }}
        >
          {provider.full_description}
        </Typography>
      </Box>

      {provider.game_types && provider.game_types.length > 0 && (
        <>
          <Box sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                color: 'text.primary',
                textTransform: 'uppercase',
                flexShrink: 0
              }}
            >
              Game Types
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {provider.game_types.map((gameType) => (
                <Box
                  key={gameType}
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
                    {gameTypeLabels[gameType] || gameType}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Divider sx={{ my: 1, borderBottomWidth: 2 }} />
        </>
      )}

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
            Technical Specification
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
            {provider.technical_specs.max_concurrent_sessions && (
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
                  Max Concurrent Sessions
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
                  {provider.technical_specs.max_concurrent_sessions.toLocaleString()}
                </Typography>
              </Box>
            )}

            {provider.technical_specs.session_timeout_minutes && (
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
                  Session Timeout
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
                  {provider.technical_specs.session_timeout_minutes} minutes
                </Typography>
              </Box>
            )}

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
                  Existing Instances
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

            {provider.can_add_more !== undefined && (
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
                  Can Add More
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
                  {provider.can_add_more ? 'Yes' : 'No'}
                </Typography>
              </Box>
            )}

            {provider.has_engine !== undefined && (
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
                  Has Engine
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
                  {provider.has_engine ? 'Yes' : 'No'}
                </Typography>
              </Box>
            )}

            {provider.required_credentials && provider.required_credentials.length > 0 && (
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
                  minWidth: '280px',
                  flex: 1
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
                  Required Credentials
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: 'text.primary',
                    lineHeight: 1.57,
                    textAlign: 'right'
                  }}
                >
                  {provider.required_credentials.map(cred => cred.label).join(' . ')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

    </Box>
  );

  const renderBrochureTab = () => {
    if (!provider?.pdf_url) {
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
          <Box sx={{ display: 'flex',  alignItems: 'center', mb: 1.5 }}>
            
            <Button
              variant="contained"
              size="small"
              startIcon={<Icon icon="mdi:open-in-new" width={16} />}
              onClick={() => window.open(provider.pdf_url, '_blank')}
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
          <Box sx={{ px: 2.5, py: 3 }}>
            {provider?.contact_information?.contacts && provider.contact_information.contacts.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: 2.5
                }}
              >
                {provider.contact_information.contacts.map((contact, index) => (
                  <Box
                    key={index}
                    sx={(theme) => ({
                      backgroundColor: theme.palette.mode === 'dark' ? '#3e424d' : '#f5f5f5',
                      borderRadius: '12px',
                      p: 2.5
                    })}
                  >
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: 500,
                        fontFamily: 'Inter, sans-serif',
                        color: 'text.primary',
                        mb: 0.5
                      }}
                    >
                      {contact.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        fontFamily: 'Inter, sans-serif',
                        color: 'text.secondary',
                        mb: 1.5
                      }}
                    >
                      {contact.role}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Icon icon="mdi:email" width={14} height={14} />
                      <Typography
                        sx={{
                          fontSize: '13px',
                          fontWeight: 400,
                          fontFamily: 'Inter, sans-serif',
                          color: 'text.primary'
                        }}
                      >
                        {contact.email}
                      </Typography>
                      <Icon
                        icon="mdi:content-copy"
                        width={14}
                        height={14}
                        style={{ cursor: 'pointer', opacity: 0.7, marginLeft: 'auto' }}
                        onClick={() => {
                          navigator.clipboard.writeText(contact.email);
                          toast.success('Email copied to clipboard');
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No contacts available
                </Typography>
              </Box>
            )}
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
            objectFit: 'cover',
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Internal Brand</InputLabel>
            <Select
              value={selectedBrandId}
              onChange={(e) => onBrandChange(e.target.value)}
              label="Internal Brand"
              disabled={isBrandsLoading}
            >
              <MenuItem value="">
                <em>Select Brand</em>
              </MenuItem>
              {internalBrandsList?.map((brand) => (
                <MenuItem key={brand.value} value={brand.value}>
                  {brand.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            onClick={onStartIntegration}
            disabled={!selectedBrandId}
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

GameStudioProviderDetail.propTypes = {
  provider: PropTypes.object,
  onStartIntegration: PropTypes.func,
  selectedBrandId: PropTypes.string,
  onBrandChange: PropTypes.func,
  internalBrandsList: PropTypes.array,
  isBrandsLoading: PropTypes.bool
};
