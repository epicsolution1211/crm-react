import { useCallback, useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { paymentProvidersApi } from "src/api/payment-providers";
import { PaymentProviderSettings } from "../../../sections/dashboard/integration/payment-system/payment-provider-settings";
import { getAssetPath } from "src/utils/asset-path";
import { useNavigate } from "react-router-dom";
import { useInternalBrands } from "src/hooks/custom/use-brand";
import { paths } from "src/paths";
import { DeleteModal } from "src/components/customize/delete-modal";
import { getAPIUrl } from "src/config";
import { PaymentProviderReceivedWebhooks } from "src/sections/dashboard/integration/payment-system/payment-provider-received-webhooks";

const NAME_TO_LOGO = {
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

const currencyLabels = {
  USD: "$ - US Dollar (USD)",
  EUR: "€ - Euro (EUR)",
  GBP: "£ - British Pound (GBP)",
  CAD: "$ - Canadian Dollar (CAD)",
  AUD: "$ - Australian Dollar (AUD)",
  BRL: "R$ - Brazilian Real (BRL)",
  BTC: "₿ - Bitcoin (BTC)",
  ETH: "Ξ - Ethereum (ETH)",
  SEK: "kr - Swedish Krona (SEK)",
  NOK: "kr - Norwegian Krone (NOK)",
};

const languageLabels = {
  en: "English (en)",
  de: "Germany (de)",
  es: "Spanish (es)",
  fr: "French (fr)",
  it: "Italian (it)",
  pt: "Portuguese (pt)",
  ru: "Russian (ru)",
  zh: "Chinese (zh)",
  sv: "Swedish (sv)",
};

const languageFlags = {
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
  pt: "🇵🇹",
  ru: "🇷🇺",
  zh: "🇨🇳",
  sv: "🇸🇪",
};

const usePaymentProvider = (id) => {
  const isMounted = useMounted();
  const [provider, setProvider] = useState({});

  const handleProviderGet = useCallback(async () => {
    const response = await paymentProvidersApi.getManagedPaymentProvider(id);
    if (isMounted()) {
      setProvider(response?.data);
    }
  }, [isMounted, id]);

  useEffect(() => {
    handleProviderGet();
  }, [handleProviderGet]);

  return { provider, handleProviderGet };
};

const usePaymentProviderTemplates = () => {
  const isMounted = useMounted();
  const [providerTemplates, setProviderTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await paymentProvidersApi.getPaymentProviders();
      if (isMounted() && response?.data?.providers) {
        const templates = response.data.providers.map((item) => item.provider);
        setProviderTemplates(templates);
      }
    } catch (error) {
      console.error("Error fetching payment provider templates:", error);
    } finally {
      if (isMounted()) {
        setIsLoading(false);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { providerTemplates, isLoading, refetch: fetchTemplates };
};

const Page = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const providerId = params?.providerId;
  const { provider, handleProviderGet } = usePaymentProvider(providerId);
  const { providerTemplates } = usePaymentProviderTemplates();
  const { internalBrandsList, isLoading: isBrandsLoading } =
    useInternalBrands();

  usePageView();

  console.log(provider?.logo_url);

  const mergedProvider = useMemo(() => {
    if (!provider?.provider_type || !providerTemplates.length) return provider;
    const template = providerTemplates.find(
      (p) => p.type === provider.provider_type
    );
    if (!template) return provider;
    return {
      ...template,
      ...provider,
      name: provider?.name || template?.name,
      display_name: provider?.provider_display_name || template?.display_name,
      logo_url:
        provider?.logo_url && provider?.logo_url?.includes('http') ? provider?.logo_url : provider?.logo_url ? `${getAPIUrl()}/${provider?.logo_url}` : null || provider?.avatar_url || template?.logo_url,
      description: template?.description,
      website: template?.website,
    };
  }, [provider, providerTemplates, getAPIUrl]);

  useEffect(() => {
    if (mergedProvider && !activeTab) {
      const hasPdf = !!mergedProvider?.pdf_url;
      setActiveTab(hasPdf ? "brochure" : "about");
    }
  }, [mergedProvider, activeTab]);

  useEffect(() => {
    let objectUrl = null;

    const fetchPdf = async () => {
      if (!mergedProvider?.pdf_url) {
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

        const response = await axios.get(mergedProvider.pdf_url, {
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
  }, [mergedProvider?.pdf_url]);

  const tabs = useMemo(() => {
    const hasPdf = !!mergedProvider?.pdf_url;
    const baseTabs = hasPdf ? [{ id: 'brochure', label: 'Brochure' }] : [];

    return [
      ...baseTabs,
      { id: "about", label: "About" },
      { id: "settings", label: "Settings" },
      { id: "support_chat", label: "Support Chat" },
      { id: "reviews", label: "Reviews" },
      { id: "contacts", label: "Contacts" },
      { id: "offers", label: "Received Offers" },
      { id: "webhooks", label: "Received Webhooks" },
    ];
  }, [mergedProvider?.pdf_url]);

  const handleBackToIntegrations = () => {
    navigate(`${paths.dashboard.integration.index}?tab=payment_system`);
  };

  const handleWebsiteClick = () => {
    if (mergedProvider?.website) {
      window.open(mergedProvider.website, "_blank");
    }
  };

  const handleOpenDeleteModal = useCallback(() => {
    if (isDeleting) {
      return;
    }

    setDeleteModalOpen(true);
  }, [isDeleting]);

  const handleSetDeleteModalOpen = useCallback(
    (isOpen) => {
      if (isDeleting) {
        return;
      }

      setDeleteModalOpen(isOpen);
    },
    [isDeleting]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (isDeleting) {
      return;
    }

    if (!providerId) {
      toast.error("Unable to delete payment provider. Missing identifier.");
      setDeleteModalOpen(false);
      return;
    }

    try {
      setIsDeleting(true);
      await paymentProvidersApi.deleteManagedPaymentProvider(providerId);
      toast.success("Payment provider successfully deleted!");
      setDeleteModalOpen(false);
      navigate(`${paths.dashboard.integration.index}?tab=payment_system`);
    } catch (error) {
      console.error("Error deleting payment provider:", error);
      toast.error("Failed to delete payment provider");
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, navigate, providerId]);

  const renderAboutTab = () => {
    const providerName =
      mergedProvider?.display_name || mergedProvider?.name || "Provider";

    return (
      <Box sx={{ px: 2.5 }}>
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
            p: 2.5,
            borderRadius: "8px",
          })}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              color: "text.primary",
              mb: 1.5,
            }}
          >
            Disclaimer
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 300,
              fontFamily: "Poppins, sans-serif",
              color: "text.primary",
              lineHeight: 1.6,
              maxWidth: "900px",
            }}
          >
            {mergedProvider?.description ||
              `${providerName} is a leading payment service provider, recognized for its innovative approach to payment processing and financial technology solutions. Built to provide secure, efficient, and scalable payment solutions for businesses worldwide.`}
          </Typography>
        </Box>

        <Box sx={{ py: 2.5 }}>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              color: "text.primary",
              mb: 1.5,
            }}
          >
            Step in to the world of modern payment processing
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 300,
              fontFamily: "Poppins, sans-serif",
              color: "text.primary",
              lineHeight: 1.6,
              maxWidth: "900px",
            }}
          >
            {providerName} offers advanced payment processing solutions designed
            to streamline transactions, reduce fraud, and enhance the customer
            payment experience across multiple channels and currencies.
          </Typography>
        </Box>

        {mergedProvider?.supported_languages &&
          mergedProvider.supported_languages.length > 0 && (
            <Box sx={{ py: 2 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  color: "text.primary",
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                Supported Languages
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {mergedProvider.supported_languages
                  .filter((lang) => lang)
                  .map((lang) => (
                    <Box
                      key={lang}
                      sx={(theme) => ({
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 0, 0, 0.08)",
                        px: 2.5,
                        py: 0.75,
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      })}
                    >
                      <Typography sx={{ fontSize: "16px" }}>
                        {languageFlags[lang] || "🌐"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                          color: "text.primary",
                          lineHeight: 1.57,
                        }}
                      >
                        {languageLabels[lang] || lang}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
          )}

        {mergedProvider?.supported_currencies &&
          mergedProvider.supported_currencies.length > 0 && (
            <Box sx={{ py: 2 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  color: "text.primary",
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                Supported Currencies
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {mergedProvider.supported_currencies.map((currency) => (
                  <Box
                    key={currency}
                    sx={(theme) => ({
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(0, 0, 0, 0.08)",
                      px: 2.5,
                      py: 0.75,
                      borderRadius: "5px",
                    })}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        fontFamily: "Inter, sans-serif",
                        color: "text.primary",
                        lineHeight: 1.57,
                      }}
                    >
                      {currencyLabels[currency] || currency}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

        {mergedProvider?.supported_regions &&
          mergedProvider.supported_regions.length > 0 && (
            <Box sx={{ py: 2 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  color: "text.primary",
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                Supported Regions
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {mergedProvider.supported_regions.map((region) => (
                  <Box
                    key={region}
                    sx={(theme) => ({
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(0, 0, 0, 0.08)",
                      px: 2.5,
                      py: 0.75,
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                    })}
                  >
                    <Icon icon="mdi:earth" width={16} height={16} />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        fontFamily: "Inter, sans-serif",
                        color: "text.primary",
                        lineHeight: 1.57,
                        textTransform: "capitalize",
                      }}
                    >
                      {region}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

        {mergedProvider?.technical_specs && (
          <Box sx={{ py: 2 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                color: "text.primary",
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              Technical Specifications
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {mergedProvider.technical_specs.api_version && (
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.08)",
                    px: 2,
                    py: 1,
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    API Version
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    {mergedProvider.technical_specs.api_version}
                  </Typography>
                </Box>
              )}

              {mergedProvider.technical_specs.base_url_production && (
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.08)",
                    px: 2,
                    py: 1,
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    Production URL
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    {mergedProvider.technical_specs.base_url_production}
                  </Typography>
                </Box>
              )}

              {mergedProvider.technical_specs.base_url_sandbox && (
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.08)",
                    px: 2,
                    py: 1,
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    Sandbox URL
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    {mergedProvider.technical_specs.base_url_sandbox}
                  </Typography>
                </Box>
              )}

              {mergedProvider.technical_specs.supports_https !== undefined && (
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.08)",
                    px: 2,
                    py: 1,
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    HTTPS Support
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    {mergedProvider.technical_specs.supports_https
                      ? "Yes"
                      : "No"}
                  </Typography>
                </Box>
              )}

              {mergedProvider.technical_specs.ip_whitelist_required !==
                undefined && (
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.08)",
                    px: 2,
                    py: 1,
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    IP Whitelist Required
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    {mergedProvider.technical_specs.ip_whitelist_required
                      ? "Yes"
                      : "No"}
                  </Typography>
                </Box>
              )}

              {mergedProvider.technical_specs.max_transaction_amount !==
                undefined && (
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.08)",
                    px: 2,
                    py: 1,
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    Max Transaction Amount
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    {mergedProvider.technical_specs.max_transaction_amount.toLocaleString()}
                  </Typography>
                </Box>
              )}

              {mergedProvider.technical_specs.min_transaction_amount !==
                undefined && (
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.08)",
                    px: 2,
                    py: 1,
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    Min Transaction Amount
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    {mergedProvider.technical_specs.min_transaction_amount}
                  </Typography>
                </Box>
              )}

              {mergedProvider.technical_specs.rate_limit && (
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.08)",
                    px: 2,
                    py: 1,
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    Rate Limit
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    {mergedProvider.technical_specs.rate_limit}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}


      </Box>
    );
  };

  const renderBrochureTab = () => {
    if (!mergedProvider?.pdf_url) {
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
              onClick={() => window.open(mergedProvider?.pdf_url, '_blank')}
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
      case "about":
        return renderAboutTab();
      case "settings":
        return provider?.provider_type !== "twilio" ? (
          <Box sx={{ px: 2.5, py: 3 }}>
            <PaymentProviderSettings
              provider={provider}
              handleProviderGet={handleProviderGet}
            />
          </Box>
        ) : (
          <Box
            sx={{
              px: 2.5,
              py: 3,
              textAlign: "center",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Settings content coming soon
            </Typography>
          </Box>
        );
      case "support_chat":
        return (
          <Box
            sx={{
              px: 2.5,
              py: 3,
              textAlign: "center",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Support Chat content coming soon
            </Typography>
          </Box>
        );
      case "reviews":
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
                icon="mdi:star-outline"
                width={40}
                height={40}
                style={{
                  color: "rgba(255, 215, 0, 0.5)",
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
              No Reviews Yet
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
              Reviews for this provider will appear here
            </Typography>
          </Box>
        );
      case "contacts":
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
      case "offers":
        return (
          <Box
            sx={{
              px: 2.5,
              py: 3,
              textAlign: "center",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Received Offers content coming soon
            </Typography>
          </Box>
        );
      case "webhooks":
        return (
          <PaymentProviderReceivedWebhooks
            provider={provider}
            selectedBrandId={selectedBrandId}
          />
        );
      default:
        return renderAboutTab();
    }
  };

  if (!provider) return null;

  return (
    <>
      <Seo title={`Integration: Payment Provider`} />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 2.5, py: 2 }}>
          <Button
            onClick={handleBackToIntegrations}
            startIcon={<Icon icon="octicon:arrow-left-16" width={20} />}
            sx={{
              color: "text.primary",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              textTransform: "none",
              mb: 1.5,
              px: 0,
              "&:hover": {
                backgroundColor: "transparent",
                opacity: 0.7,
              },
            }}
          >
            Back to Integrations
          </Button>
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              color: "text.primary",
            }}
          >
            Integrations / Payment System
          </Typography>
        </Box>

        <Box
          sx={(theme) => ({
            borderBottom: 1,
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.2)"
                : "divider",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1.5,
          })}
        >
          <Box
            component="img"
            src={
              mergedProvider?.logo_url || NAME_TO_LOGO[provider?.provider_type]
            }
            alt={mergedProvider?.display_name || mergedProvider?.name}
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "contain",
              backgroundColor: "#fff",
            }}
          />

          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              color: "text.primary",
            }}
          >
            {mergedProvider?.display_name || mergedProvider?.name}
          </Typography>

          {mergedProvider?.website && (
            <Typography
              onClick={handleWebsiteClick}
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                fontFamily: "Inter, sans-serif",
                color: "#00bbff",
                textDecoration: "underline",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              View Website
            </Typography>
          )}
        </Box>

        <Box
          sx={(theme) => ({
            borderBottom: 1,
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.2)"
                : "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
          })}
        >
          <Box sx={{ display: "flex", gap: 2.5 }}>
            {tabs.map((tab) => (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={(theme) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 0,
                  py: 1.5,
                  cursor: "pointer",
                  borderBottom: activeTab === tab.id ? 2 : 0,
                  borderColor:
                    activeTab === tab.id ? "primary.main" : "transparent",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)",
                  },
                })}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                    color:
                      activeTab === tab.id
                        ? "text.primary"
                        : theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.5)"
                        : "text.secondary",
                    lineHeight: "20px",
                  })}
                >
                  {tab.id === "about"
                    ? `About ${
                        mergedProvider?.display_name ||
                        mergedProvider?.name ||
                        "Provider"
                      }`
                    : tab.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Internal Brand</InputLabel>
              <Select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                label="Internal Brand"
                disabled={isBrandsLoading}
              >
                <MenuItem value="">
                  <em>Select Brand</em>
                </MenuItem>
                {internalBrandsList.map((brand) => (
                  <MenuItem key={brand.value} value={brand.value}>
                    {brand.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpenDeleteModal}
              startIcon={<Icon icon="mdi:trash-outline" width={18} />}
              aria-label="Delete payment provider"
              disabled={isDeleting || !providerId}
            >
              Delete Provider
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          {renderTabContent()}
        </Box>
      </Box>
      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={handleSetDeleteModalOpen}
        onDelete={handleConfirmDelete}
        title="Delete Provider"
        description={`Are you sure you want to delete the payment provider "${mergedProvider?.display_name || mergedProvider?.name || "provider"}"?`}
        isLoading={isDeleting}
        buttonTitle="Delete"
      />
    </>
  );
};

export default Page;
