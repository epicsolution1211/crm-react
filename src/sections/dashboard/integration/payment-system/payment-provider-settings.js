import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import { Iconify } from 'src/components/iconify';
import { paymentProvidersApi } from 'src/api/payment-providers';
import { getAssetPath } from "src/utils/asset-path";
import { getAPIUrl } from "src/config";

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

export const PaymentProviderSettings = ({ provider, handleProviderGet }) => {
  const [providerEnabled, setProviderEnabled] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [providerName, setProviderName] = useState("");
  const [providerNameError, setProviderNameError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priority, setPriority] = useState(1);
  const [priorityError, setPriorityError] = useState("");
  const [testMode, setTestMode] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState("");
  const [sessionExpiryError, setSessionExpiryError] = useState("");
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const providerLogo = useMemo(() => {
    if (!provider?.provider_type) return null;
    if (provider?.logo_url) {
      return provider?.logo_url?.includes('http') ? provider?.logo_url : `${getAPIUrl()}/${provider?.logo_url}`;
    }
    if (provider?.logo) {
      return getAssetPath(provider.logo);
    }
    return NAME_TO_LOGO[provider?.provider_type];
  }, [provider, provider?.logo, provider?.logo_url]);

  const activeLogoSrc = useMemo(() => {
    if (logoPreview) {
      return logoPreview;
    }
    if (provider?.logo_url) {
      return provider?.logo_url?.includes('http') ? provider?.logo_url : `${getAPIUrl()}/${provider?.logo_url}`;
    }
    if (provider?.logo) {
      return getAssetPath(provider.logo);
    }
    return NAME_TO_LOGO[provider?.provider_type] || null;
  }, [logoPreview, provider?.logo_url, provider?.logo, provider?.provider_type]);

  useEffect(() => {
    handleProviderGet();
  }, []);

  useEffect(() => {
    if (provider) {
      setProviderEnabled(provider?.enabled);
      setProviderName(provider?.name || "");
      setDescription(provider?.description || "");
      setPriority(provider?.priority || 1);
      setTestMode(provider?.settings?.test_mode || false);
      setSessionExpiry(provider?.settings?.session_expiry || "");
      
      setEnabled(true);
    }
    setSelectedLogoFile(null);
    setLogoFileName("");
    setLogoPreview("");
  }, [provider]);

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleProviderNameChange = useCallback((e) => {
    setProviderName(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setDescription(e.target.value);
  }, []);

  const handlePriorityChange = useCallback((e) => {
    setPriority(e.target.value);
  }, []);

  const handleTestModeChange = useCallback((e) => {
    setTestMode(e.target.checked);
  }, []);

  const handleSessionExpiryChange = useCallback((e) => {
    setSessionExpiry(e.target.value);
  }, []);
  const handleLogoChooseKeyDown = useCallback((event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    const input = event.currentTarget.querySelector('input[type="file"]');
    if (input) {
      input.click();
    }
  }, []);

  const handleLogoChange = useCallback((event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      if (event.target.value) {
        event.target.value = "";
      }
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      event.target.value = "";
      return;
    }
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setSelectedLogoFile(file);
    setLogoPreview(previewUrl);
    setLogoFileName(file.name);
    event.target.value = "";
  }, [logoPreview]);

  const handleLogoUpload = useCallback(async () => {
    if (!selectedLogoFile) {
      toast.error("Select a logo before uploading.");
      return;
    }
    if (!provider?.id) {
      toast.error("Unable to upload logo. Missing identifier.");
      return;
    }
    try {
      setIsUploadingLogo(true);
      const formData = new FormData();
      formData.append("logo", selectedLogoFile);
      await paymentProvidersApi.uploadPaymentProviderLogo(provider.id, formData);
      toast.success("Logo uploaded successfully.");
      setSelectedLogoFile(null);
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoPreview("");
      setLogoFileName("");
      setTimeout(() => {
        handleProviderGet();
      }, 2000);
    } catch (error) {
      console.error("Failed to upload payment provider logo:", error);
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setIsUploadingLogo(false);
    }
  }, [selectedLogoFile, provider?.id, logoPreview, handleProviderGet]);
  
  const handleProviderUpdate = useCallback(async (data) => {
    await paymentProvidersApi.updateManagedPaymentProvider(provider?.id, data);
    toast.success("Payment provider successfully updated!");
    setTimeout(() => {
      handleProviderGet();
    }, 1000);
  }, [provider?.id, handleProviderGet]);

  const handleProviderEnableChange = useCallback(
    (name) => {
      const id = name;
      handleProviderUpdate({
        payment_provider: id,
        enabled: !providerEnabled,
        is_default: provider?.is_default ?? false,
      });
      setProviderEnabled(!providerEnabled);
    },
    [providerEnabled, handleProviderUpdate, provider]
  );

  // const handleProviderDefaultChange = useCallback(
  //   async () => {
  //     setProviderDefault(true);
  //     await paymentProvidersApi.updateManagedPaymentProvider(provider?.id, { is_default: true });
  //     toast.success("Payment provider successfully set as default!");
  //     setTimeout(() => {
  //       handleProviderGet();
  //     }, 1000);
  //   },
  //   [provider, handleProviderGet]
  // );

  const handleProviderNameSave = useCallback(async () => {
    if (!providerName.trim()) {
      setProviderNameError("Provider name is required");
      return;
    }
    setProviderNameError("");
    await handleProviderUpdate({ name: providerName });
  }, [providerName, handleProviderUpdate]);

  const handleDescriptionSave = useCallback(async () => {
    if (!description.trim()) {
      setDescriptionError("Description is required");
      return;
    }
    setDescriptionError("");
    await handleProviderUpdate({ description });
  }, [description, handleProviderUpdate]);

  const handlePrioritySave = useCallback(async () => {
    if (!priority || priority < 1 || priority > 3) {
      setPriorityError("Priority must be 1, 2, or 3");
      return;
    }
    setPriorityError("");
    await handleProviderUpdate({ priority });
  }, [priority, handleProviderUpdate]);

  const handleSettingsSave = useCallback(async () => {
    if (!sessionExpiry || isNaN(sessionExpiry) || sessionExpiry <= 0) {
      setSessionExpiryError("Session expiry must be a positive number");
      return;
    }
    setSessionExpiryError("");
    await handleProviderUpdate({ 
      settings: { 
        test_mode: testMode, 
        session_expiry: parseInt(sessionExpiry) 
      } 
    });
  }, [testMode, sessionExpiry, handleProviderUpdate]);

  return (
    <Stack spacing={4} mb={2}>
      <Card
        sx={{
          bgcolor: '#8a98af',
          border: '1px solid #111927',
          borderRadius: 2.5,
          overflow: 'hidden',
          maxWidth: 418
        }}
      >
        <Box sx={{ height: 4, width: '100%' }} />
        <Box sx={{ px: 3, pt: 3, pb: 0 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 107.5,
                height: 57.47,
                borderRadius: 0.625,
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              {providerLogo ? (
                <Box
                  component="img"
                  src={providerLogo}
                  alt={provider?.name || provider?.provider_type}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : null}
            </Box>
            <Stack spacing={0.375} sx={{ flex: 1, justifyContent: 'center', height: 57 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  lineHeight: 1.57,
                  textTransform: 'uppercase',
                  color: '#000'
                }}
              >
                {provider?.name || provider?.provider_type}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Box sx={{ px: 3, py: 1.25 }}>
          <Stack direction="row" spacing={1.25} flexWrap="wrap">
            {provider?.categories && provider.categories.length > 0 ? (
              provider.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#000',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    height: 20,
                    borderRadius: 0.625,
                    '& .MuiChip-label': {
                      px: 2.5,
                      py: 0.25,
                      lineHeight: 1.57
                    }
                  }}
                />
              ))
            ) : (
              <>
                <Chip
                  label="Payment"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#000',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    height: 20,
                    borderRadius: 0.625,
                    '& .MuiChip-label': {
                      px: 2.5,
                      py: 0.25,
                      lineHeight: 1.57
                    }
                  }}
                />
                <Chip
                  label="Gateway"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#000',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    height: 20,
                    borderRadius: 0.625,
                    '& .MuiChip-label': {
                      px: 2.5,
                      py: 0.25,
                      lineHeight: 1.57
                    }
                  }}
                />
              </>
            )}
          </Stack>
        </Box>
        <Box sx={{ px: 3.125, pb: 1.25 }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              lineHeight: 1.57,
              color: '#000',
              fontWeight: 400
            }}
          >
            {provider?.description || "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC,"}
          </Typography>
        </Box>
        <Box sx={{ px: 2, pb: 1.875, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:checkmark-fill" width={20} />}
            onClick={() => handleProviderEnableChange(provider?.provider_type)}
            disabled={!enabled}
            sx={{
              bgcolor: '#fff',
              color: '#000',
              height: 24,
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: '24px',
              px: 2,
              py: 0.75,
              borderRadius: 1,
              boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.08)',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#f5f5f5'
              },
              '&.Mui-disabled': {
                bgcolor: '#e0e0e0',
                color: '#9e9e9e'
              }
            }}
          >
            {providerEnabled ? 'Active' : 'Inactive'}
          </Button>
        </Box>
      </Card>

      {/* <Card>
        <CardHeader
          title="General"
          action={
            !enabled && (
              <Tooltip title="You have to update setting first!">
                <Iconify icon="mdi:error-outline" width={24} color="error.main" />
              </Tooltip>
            )
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Default payment provider:</Typography>
                {providerDefault ? (
                  <Chip label="Default" />
                ) : (
                  <Button
                    disabled={!enabled}
                    variant="contained"
                    onClick={() => handleProviderDefaultChange(provider?.id)}
                  >
                    Make default
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
          Branding
        </Typography>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 260,
                height: 160,
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.neutral',
                overflow: 'hidden'
              }}
            >
              {activeLogoSrc ? (
                <Box
                  component="img"
                  src={activeLogoSrc}
                  alt={`${provider?.name || provider?.provider_type || "Payment provider"} logo`}
                  sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 2 }}
                />
              ) : (
                <Stack spacing={1} alignItems="center">
                  <Iconify icon="solar:image-add-linear" width={32} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Logo preview
                  </Typography>
                </Stack>
              )}
            </Box>
          </Grid>
          <Grid xs={12} md={8}>
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Upload provider logo
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  Use JPG, PNG, or SVG images up to 5 MB. The logo updates immediately after upload.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Iconify icon="solar:upload-linear" width={20} />}
                  tabIndex={0}
                  aria-label="Choose logo file"
                  onKeyDown={handleLogoChooseKeyDown}
                  sx={{ width: 'fit-content' }}
                >
                  Choose file
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLogoUpload}
                  disabled={isUploadingLogo}
                  startIcon={
                    isUploadingLogo ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Iconify icon="solar:check-circle-linear" width={20} />
                    )
                  }
                  tabIndex={0}
                  aria-label="Upload selected logo"
                  sx={{ width: 'fit-content' }}
                >
                  {isUploadingLogo ? "Uploading..." : "Upload logo"}
                </Button>
              </Stack>
              {logoFileName ? (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Selected file: {logoFileName}
                </Typography>
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
          Provider Configuration
        </Typography>

        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Provider Name
            </Typography>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <OutlinedInput
                fullWidth
                name="provider_name"
                onChange={handleProviderNameChange}
                value={providerName}
                placeholder="Provider Name"
                error={!!providerNameError}
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleProviderNameSave}
                sx={{ minWidth: 100, height: 42 }}
              >
                Save
              </Button>
            </Stack>
            {providerNameError && (
              <Typography color="error" variant="caption">
                {providerNameError}
              </Typography>
            )}
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Description
            </Typography>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <TextField
                fullWidth
                name="description"
                onChange={handleDescriptionChange}
                value={description}
                placeholder="Provider Description"
                multiline
                rows={3}
                error={!!descriptionError}
                helperText={descriptionError}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.neutral'
                  }
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleDescriptionSave}
                sx={{ minWidth: 100, height: 42 }}
              >
                Save
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Priority Level
            </Typography>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <FormControl fullWidth error={!!priorityError}>
                <Select
                  value={priority}
                  onChange={handlePriorityChange}
                  sx={{
                    bgcolor: 'background.neutral',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    }
                  }}
                >
                  <MenuItem value={1}>1 - High Priority</MenuItem>
                  <MenuItem value={2}>2 - Medium Priority</MenuItem>
                  <MenuItem value={3}>3 - Low Priority</MenuItem>
                </Select>
                {priorityError && (
                  <Typography color="error" variant="caption">
                    {priorityError}
                  </Typography>
                )}
              </FormControl>
              <Button 
                variant="contained" 
                onClick={handlePrioritySave}
                sx={{ minWidth: 100, height: 42 }}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
          Payment Settings
        </Typography>

        <Stack spacing={3}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6">Test Mode:</Typography>
            <Switch
              checked={testMode}
              onChange={handleTestModeChange}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Session Expiry (minutes)
            </Typography>
            <OutlinedInput
              fullWidth
              name="session_expiry"
              onChange={handleSessionExpiryChange}
              value={sessionExpiry}
              placeholder="Session expiry in minutes"
              type="number"
              error={!!sessionExpiryError}
              sx={{
                bgcolor: 'background.neutral',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider'
                }
              }}
            />
            {sessionExpiryError && (
              <Typography color="error" variant="caption">
                {sessionExpiryError}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSettingsSave}>
              Save Settings
            </Button>
          </Stack>
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, lineHeight: 1.6, mt: 3 }}>
          Configure payment provider settings including test mode for development and session expiry for security. Ensure proper configuration before enabling the provider for production use.
        </Typography>
      </Box>
    </Stack>
  );
};
