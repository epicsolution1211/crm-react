import { useCallback, useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "src/hooks/use-router";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { CallProviderReceivedWebhooks } from "src/sections/dashboard/integration/call-system/call-provider-received-webhooks";

import { CallProviderSettings } from "src/sections/dashboard/integration/call-system-setting/call-provider-settings";
import { Seo } from "src/components/seo";
import { SupportChat } from "src/sections/dashboard/integration/support-chat";
import { TwilioSettings } from "src/sections/dashboard/integration/call-system-setting/twilio-settings";
import { paths } from "src/paths";
import { callProvidersApi } from "src/api/call-providers";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useSearchParams } from "src/hooks/use-search-params";
import { DeleteModal } from "src/components/customize/delete-modal";
import { getAPIUrl } from "src/config";

const PROVIDER_DETAILS = {
  coperato: "Coperato is a VoIP provider that supports direct calling, click-to-call functionality, and real-time communication between agents and clients.",
  commpeak: "Commpeak is a VoIP communication provider that facilitates call operations, allowing teams to initiate and manage calls through an integrated interface.",
  cypbx: "Cyprus P.B.X offers VoIP services for managing and routing client calls across different departments and regions.",
  didglobal: "DID Global provides VoIP solutions using virtual phone numbers (DIDs), enabling international communication and efficient call management.",
  mmdsmart: "MMD Smart delivers global voice and messaging services, supporting both inbound and outbound call traffic through its VoIP infrastructure.",
  prime_voip: "Primecall is a telecommunications provider tailored for high-volume call centers and global outreach, enabling seamless and stable voice connectivity.",
  squaretalk: "Squaretalk is a cloud-based communication platform that offers VoIP capabilities with features such as smart routing, automation, and analytics.",
  twilio: "Twilio is a cloud communications platform that supports voice, messaging, and other channels for business communication needs.",
  voicespin: "VoiceSpin offers VoIP and communication services for sales and support operations, helping teams manage and monitor calls effectively.",
  voiso: "Voiso is a cloud VoIP solution with global calling support and smart routing features designed to streamline communication processes.",
};

const useCallProfile = (id) => {
  const isMounted = useMounted();
  const [profile, setProfile] = useState({});

  const handleProfileGet = useCallback(async () => {
    const response = await callProvidersApi.getManagedCallProvider(id);
    if (isMounted()) {
      setProfile(response?.data);
    }
  }, [isMounted]);

  useEffect(() => {
    handleProfileGet();
  }, [isMounted]);

  return { profile, handleProfileGet };
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const isMounted = useMounted();
  const [activeTab, setActiveTab] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [providersData, setProvidersData] = useState([]);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const providerId = params?.providerId;
  const { profile, handleProfileGet } = useCallProfile(providerId);
  const searchParams = useSearchParams();
  const pageInfo = searchParams.get("pageInfo");

  usePageView();

  const providerLogo = useMemo(() => {
    const providerData = providersData?.find(
      p => p?.provider?.type === profile?.provider_type || 
      p?.provider?.name?.toLowerCase() === profile?.provider_type?.toLowerCase()
    )?.provider;
    if (profile?.logo_url) {
      return profile?.logo_url?.includes('http') ? profile?.logo_url : `${getAPIUrl()}/${profile?.logo_url}`;
    } else {
      return providerData?.logo_url || null;
    }
  }, [profile, providersData]);

  useEffect(() => {
    if (providersData.length > 0 && profile?.provider_type && !activeTab) {
      const providerData = providersData?.find(
        p => p?.provider?.type === profile?.provider_type || 
        p?.provider?.name?.toLowerCase() === profile?.provider_type?.toLowerCase()
      )?.provider;

      const hasPdf = !!providerData?.pdf_url;
      setActiveTab(hasPdf ? "brochure" : "about");
    }
  }, [providersData, profile?.provider_type, activeTab]);

  const handleProvidersGet = useCallback(async () => {
    try {
      const response = await callProvidersApi.getCallProviders();
      if (isMounted()) {
        setProvidersData(response?.data?.providers || []);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  }, [isMounted]);

  useEffect(() => {
    handleProvidersGet();
  }, [handleProvidersGet]);

  useEffect(() => {
    let objectUrl = null;

    const fetchPdf = async () => {
      const providerData = providersData?.find(
        p => p?.provider?.type === profile?.provider_type || 
        p?.provider?.name?.toLowerCase() === profile?.provider_type?.toLowerCase()
      )?.provider;

      if (!providerData?.pdf_url) {
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

        const response = await axios.get(providerData.pdf_url, {
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
  }, [providersData, profile?.provider_type]);

  const tabs = useMemo(() => {
    const providerData = providersData?.find(
      p => p?.provider?.type === profile?.provider_type || 
      p?.provider?.name?.toLowerCase() === profile?.provider_type?.toLowerCase()
    )?.provider;

    const hasPdf = !!providerData?.pdf_url;

    const baseTabs = hasPdf ? [{ id: 'brochure', label: 'Brochure' }] : [];

    if (pageInfo === "call-system") {
      return [
        ...baseTabs,
        { id: 'about', label: 'About' },
        { id: 'settings', label: 'Settings' },
        { id: 'installation', label: 'Installation Guide' },
        { id: 'support_chat', label: 'Support Chat' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'contacts', label: 'Contacts' },
        { id: 'offers', label: 'Received Offers' },
        { id: 'received_webhooks', label: 'Received Webhooks' },
      ];
    } else {
      return [
        ...baseTabs,
        { id: 'about', label: 'About' },
        { id: 'support_chat', label: 'Support Chat' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'contacts', label: 'Contacts' },
        { id: 'offers', label: 'Received Offers' }
      ];
    }
  }, [pageInfo, providersData, profile?.provider_type]);

  const handleBackToIntegrations = () => {
    navigate(`${paths.dashboard.integration.index}?tab=call_system`);
  };

  const handleDeleteProfile = async () => {
    try {
      await callProvidersApi.deleteManagedCallProvider(providerId);
      toast.success("Profile successfully deleted!");
      router.push(`${paths.dashboard.integration.index}?tab=call_system`);
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile");
    }
  };

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

  const renderAboutTab = () => {
    const { provider: providerData } = providersData?.find(p => p?.provider?.type === profile?.provider_type || p?.provider?.name?.toLowerCase() === profile?.provider_type?.toLowerCase()) || {};

    return (
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
            {providerData?.description || PROVIDER_DETAILS[profile?.provider_type] || "No specific details available for this provider."}
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
            {providerData?.description}
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
            {PROVIDER_DETAILS[profile?.provider_type]}
          </Typography>
        </Box>

        {providerData?.supported_features && providerData.supported_features.length > 0 && (
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
              {providerData.supported_features.map((feature, index) => (
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

        {providerData?.supported_regions && providerData.supported_regions.length > 0 && (
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
              {providerData.supported_regions.map((region, index) => (
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

        {providerData?.supported_languages && providerData.supported_languages.length > 0 && (
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
              {providerData.supported_languages.filter(lang => lang).map((lang) => (
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

        {providerData?.required_credentials && providerData.required_credentials.length > 0 && (
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
              {providerData.required_credentials.map((credential, index) => (
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
                    {credential?.label || credential?.key?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {providerData?.technical_specs && Object.keys(providerData.technical_specs).length > 0 && (
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
              {Object.entries(providerData.technical_specs).map(([key, value]) => (
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
                    minWidth: '280px',
                    gap: 2
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                      color: 'text.primary',
                      lineHeight: 1.57,
                      flexShrink: 0
                    }}
                  >
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                      color: 'text.primary',
                      lineHeight: 1.57,
                      textAlign: 'right',
                      wordBreak: 'break-all'
                    }}
                  >
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {providerData?.pricing && Object.keys(providerData.pricing).length > 0 && (
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
              {Object.entries(providerData.pricing).map(([key, value]) => (
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
                    minWidth: '280px',
                    gap: 2
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                      color: 'text.primary',
                      lineHeight: 1.57,
                      flexShrink: 0
                    }}
                  >
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                      color: 'text.primary',
                      lineHeight: 1.57,
                      textAlign: 'right',
                      wordBreak: 'break-all'
                    }}
                  >
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

      </Box>
    );
  };

  const renderBrochureTab = () => {
    const { provider: providerData } = providersData?.find(p => p?.provider?.type === profile?.provider_type || p?.provider?.name?.toLowerCase() === profile?.provider_type?.toLowerCase()) || {};

    if (!providerData?.pdf_url) {
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
              onClick={() => window.open(providerData?.pdf_url, '_blank')}
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

  const renderContactsTab = () => {
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
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'brochure':
        return renderBrochureTab();
      case 'about':
        return renderAboutTab();
      case 'settings':
        return profile?.provider_type !== "twilio" ? (
          <Box sx={{ px: 2.5, py: 3 }}>
            <CallProviderSettings
              profile={profile}
              handleProfileGet={handleProfileGet}
            />
          </Box>
        ) : (
          <Box sx={{ px: 2.5, py: 3 }}>
            <TwilioSettings
              profile={profile}
              handleProfileGet={handleProfileGet}
            />
          </Box>
        );
      case 'received_webhooks':
        return (
          <Box sx={{ px: 2.5, py: 3 }}>
            <CallProviderReceivedWebhooks provider={profile} />
          </Box>
        );
      case 'installation':
        return (
          <Box sx={{ px: 2.5, py: 3, textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Installation Guide coming soon
            </Typography>
          </Box>
        );
      case 'support_chat':
        return (
          <Box sx={{ px: 2.5, py: 3 }}>
            <SupportChat pageInfo={pageInfo} providerId={providerId} />
          </Box>
        );
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
        return renderContactsTab();
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

  if (!profile) return null;

  return (
    <>
      <Seo title={`Integration: ${profile?.name || 'Call Provider'}`} />
      <Box 
        component="main" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh',
          overflow: 'hidden'
        }}
      >
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
            Integrations / Call System
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
            src={providerLogo}
            alt={profile?.name}
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
            {profile?.name}
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
                  {tab.id === 'about' ? `About ${profile?.name || 'Provider'}` : tab.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={() => setDeleteModalOpen(true)}
            sx={{
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 500
            }}
          >
            Delete Profile
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

      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={handleDeleteProfile}
        title="Delete Profile"
        description={`Are you sure you want to delete the profile "${profile?.name}"?`}
      />
    </>
  );
};

export default Page;
