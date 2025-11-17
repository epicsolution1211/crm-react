import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAssetPath } from 'src/utils/asset-path';
import { paths } from 'src/paths';
import { useSettings } from 'src/hooks/use-settings';

const NAME_TO_LOGO_LIGHT = {
  "cyprus bpx": getAssetPath("/assets/call-system/call-pbx.png"),
  coperato: getAssetPath("/assets/call-system/call-coperato.png"),
  nuvei: getAssetPath("/assets/call-system/call-nuvei.png"),
  perfectMoney: getAssetPath("/assets/call-system/call-perfect-money.png"),
  twilio: getAssetPath("/assets/call-system/call-twilio.png"),
  voiso: getAssetPath("/assets/call-system/call-voiso.png"),
  squaretalk: getAssetPath("/assets/call-system/call-squaretalk.png"),
  commpeak: getAssetPath("/assets/call-system/call-commpeak.png"),
  mmdsmart: getAssetPath("/assets/call-system/call-mmdsmart.svg"),
  "prime_voip": getAssetPath("/assets/call-system/call-prime-light.png"),
  voicespin: getAssetPath("/assets/call-system/call-voicespin.svg"),
  didglobal: getAssetPath("/assets/call-system/call-didglobal.jpg"),
};

const NAME_TO_LOGO_DARK = {
  "cyprus bpx": getAssetPath("/assets/call-system/call-pbx.png"),
  coperato: getAssetPath("/assets/call-system/call-coperato.png"),
  nuvei: getAssetPath("/assets/call-system/call-nuvei.png"),
  perfectMoney: getAssetPath("/assets/call-system/call-perfect-money.png"),
  twilio: getAssetPath("/assets/call-system/call-twilio.png"),
  voiso: getAssetPath("/assets/call-system/call-voiso.png"),
  squaretalk: getAssetPath("/assets/call-system/call-squaretalk.png"),
  commpeak: getAssetPath("/assets/call-system/call-commpeak.png"),
  mmdsmart: getAssetPath("/assets/call-system/call-mmdsmart-dark.webp"),
  "prime_voip": getAssetPath("/assets/call-system/call-prime.png"),
  voicespin: getAssetPath("/assets/call-system/call-voicespin-light.jpg"),
  didglobal: getAssetPath("/assets/call-system/call-didglobal.jpg"),
};

const PROVIDER_DETAILS = {
  coperato: "Coperato is a VoIP provider that supports direct calling, click-to-call functionality, and real-time communication between agents and clients.",
  commpeak: "Commpeak is a VoIP communication provider that facilitates call operations, allowing teams to initiate and manage calls through an integrated interface.",
  "cyprus bpx": "Cyprus P.B.X offers VoIP services for managing and routing client calls across different departments and regions.",
  didglobal: "DID Global provides VoIP solutions using virtual phone numbers (DIDs), enabling international communication and efficient call management.",
  mmdsmart: "MMD Smart delivers global voice and messaging services, supporting both inbound and outbound call traffic through its VoIP infrastructure.",
  "prime voip": "Primecall is a telecommunications provider tailored for high-volume call centers and global outreach, enabling seamless and stable voice connectivity.",
  squaretalk: "Squaretalk is a cloud-based communication platform that offers VoIP capabilities with features such as smart routing, automation, and analytics.",
  twilio: "Twilio is a cloud communications platform that supports voice, messaging, and other channels for business communication needs.",
  voicespin: "VoiceSpin offers VoIP and communication services for sales and support operations, helping teams manage and monitor calls effectively.",
  voiso: "Voiso is a cloud VoIP solution with global calling support and smart routing features designed to streamline communication processes.",
};

export const CallSystemProviderDetail = ({ 
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
  const settings = useSettings();

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

  const handleBackToIntegrations = () => {
    navigate(`${paths.dashboard.integration.index}?tab=call_system`);
  };

  const handleWebsiteClick = () => {
    if (provider.website) {
      window.open(provider.website, '_blank');
    }
  };

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

  const logoMap = settings?.paletteMode === 'light' ? NAME_TO_LOGO_LIGHT : NAME_TO_LOGO_DARK;
  const logoPath = logoMap[provider?.name?.toLowerCase()];

  const languageLabels = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic',
    tr: 'Turkish',
    pl: 'Polish',
    uk: 'Ukrainian',
    nl: 'Dutch',
    el: 'Greek'
  };

  const languageFlags = {
    en: '🇬🇧',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    pt: '🇵🇹',
    ru: '🇷🇺',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
    ar: '🇸🇦',
    tr: '🇹🇷',
    pl: '🇵🇱',
    uk: '🇺🇦',
    nl: '🇳🇱',
    el: '🇬🇷'
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
          {console.log(provider)}
          {provider.description || PROVIDER_DETAILS[provider.name?.toLowerCase()] || `${provider.name} is a leading VoIP and communication provider, recognized for its innovative approach to call management and technological solutions.`}
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
          {PROVIDER_DETAILS[provider.name?.toLowerCase()]}
        </Typography>
      </Box>

      {provider.supported_features && provider.supported_features.length > 0 && (
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
            Supported Features
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {provider.supported_features.map((feature, index) => (
              <Box
                key={index}
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
                  {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
            {provider.supported_regions.map((region, index) => (
              <Box
                key={index}
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
                  {region}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
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
                  {languageLabels[lang] || lang.toUpperCase()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {provider.required_credentials && provider.required_credentials.length > 0 && (
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
            Required Credentials
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {provider.required_credentials.map((credential, index) => (
              <Box
                key={index}
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
                  {credential.label || credential.key?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {provider.technical_specs && Object.keys(provider.technical_specs).length > 0 && (
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
            {Object.entries(provider.technical_specs).map(([key, value]) => {
              if (value === null || value === undefined || value === '') return null;

              const formatLabel = (str) => {
                return str
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());
              };

              const formatValue = (val) => {
                if (typeof val === 'boolean') {
                  return val ? 'Yes' : 'No';
                }
                if (typeof val === 'number') {
                  if (key === 'max_concurrent_calls') {
                    return val.toLocaleString();
                  }
                  if (key === 'call_timeout_minutes') {
                    return `${val} minutes`;
                  }
                  return val.toString();
                }
                if (typeof val === 'string') {
                  return val;
                }
                return JSON.stringify(val);
              };

              return (
                <Box
                  key={key}
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
                    {formatLabel(key)}
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
                    {formatValue(value)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {provider.existing_count !== undefined && (
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
            Provider Status
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
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
                Existing Profiles
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
          </Box>
        </Box>
      )}

      {provider.pricing && (
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
            Pricing
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
            {provider.pricing.type && (
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
                  Pricing Type
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
                  {provider.pricing.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
              </Box>
            )}

            {provider.pricing.starting_price && (
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
                  Starting Price
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
                  {provider.pricing.starting_price}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

    </Box>
  );

  const renderBrochureTab = () => {
    if (!provider.pdf_url) {
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
        {logoPath && (
          <Box
            component="img"
            src={logoPath}
            alt={provider.name}
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              objectFit: 'cover',
              backgroundColor: '#fff'
            }}
          />
        )}

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

CallSystemProviderDetail.propTypes = {
  provider: PropTypes.object,
  onStartIntegration: PropTypes.func,
  selectedBrandId: PropTypes.string,
  onBrandChange: PropTypes.func,
  internalBrandsList: PropTypes.array,
  isBrandsLoading: PropTypes.bool
};

