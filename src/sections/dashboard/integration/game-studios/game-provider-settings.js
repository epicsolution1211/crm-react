import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { gameProvidersApi } from 'src/api/game-providers';
import { getAPIUrl } from "src/config";

export const GameProviderSettings = ({ provider, handleProviderGet }) => {
  const [providerEnabled, setProviderEnabled] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [maxBetLimit, setMaxBetLimit] = useState(0);
  const [maxBetLimitEuro, setMaxBetLimitEuro] = useState(0);
  const [maxBetLimitBitcoin, setMaxBetLimitBitcoin] = useState(0);
  
  const [selectedGameTypes, setSelectedGameTypes] = useState([]);
  const [providersData, setProvidersData] = useState([]);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  const [merchantKey, setMerchantKey] = useState("");
  const [merchantKeyError, setMerchantKeyError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [merchantIdError, setMerchantIdError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [signKey, setSignKey] = useState("");
  const [signKeyError, setSignKeyError] = useState("");

  const providerLogo = useMemo(() => {
    if (!provider?.provider_type || !providersData.length) return null;
    const providerType = provider.provider_type.toLowerCase().trim();
    const matchedProvider = providersData.find(p => 
      p.provider.type.toLowerCase().trim() === providerType
    );

    if (provider?.logo_url) {
      return provider?.logo_url?.includes('http') ? provider?.logo_url : `${getAPIUrl()}/${provider?.logo_url}`;
    } else {
      return matchedProvider?.provider?.logo_url || null;
    }
  }, [provider, providersData, getAPIUrl]);

  useEffect(() => {
    handleProviderGet();
    const fetchGameProviders = async () => {
      try {
        const response = await gameProvidersApi.getGameProviders();
        if (response?.data?.providers) {
          setProvidersData(response.data.providers);
        }
      } catch (error) {
        console.error('Failed to fetch game providers:', error);
      }
    };
    fetchGameProviders();
  }, []);

  useEffect(() => {
    if (provider) {
      setProviderEnabled(provider?.enabled);
      setMaxBetLimit(provider?.settings?.max_bet_limit || 0);
      setMaxBetLimitEuro(provider?.settings?.max_bet_limit_euro || 0);
      setMaxBetLimitBitcoin(provider?.settings?.max_bet_limit_bitcoin || 0);
      setSelectedGameTypes(provider?.settings?.game_types || []);
      
      setMerchantKey(provider?.credentials?.merchant_key || "");
      setPassword(provider?.credentials?.password || "");
      setMerchantId(provider?.credentials?.merchant_id || "");
      setApiKey(provider?.credentials?.api_key || "");
      setSignKey(provider?.credentials?.sign_key || "");
      
      setEnabled(true);
    }
    setSelectedLogoFile(null);
    setLogoFileName("");
    setLogoPreview("");
  }, [provider]);

  const handleMaxBetLimitChange = useCallback((e) => {
    setMaxBetLimit(e.target.value);
  }, []);

  const handleMaxBetLimitEuroChange = useCallback((e) => {
    setMaxBetLimitEuro(e.target.value);
  }, []);

  const handleMaxBetLimitBitcoinChange = useCallback((e) => {
    setMaxBetLimitBitcoin(e.target.value);
  }, []);

  // const handleSessionTimeoutChange = useCallback((e) => {
  //   setSessionTimeout(e.target.value);
  // }, []);

  const handleGameTypeToggle = useCallback((gameType) => {
    setSelectedGameTypes((prev) => {
      if (prev.includes(gameType)) {
        return prev.filter((type) => type !== gameType);
      }
      return [...prev, gameType];
    });
  }, []);

  const handleMerchantKeyChange = useCallback((e) => {
    setMerchantKey(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleMerchantIdChange = useCallback((e) => {
    setMerchantId(e.target.value);
  }, []);

  const handleApiKeyChange = useCallback((e) => {
    setApiKey(e.target.value);
  }, []);

  const handleSignKeyChange = useCallback((e) => {
    setSignKey(e.target.value);
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
      await gameProvidersApi.uploadGameProviderLogo(provider.id, formData);
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
      console.error("Failed to upload game provider logo:", error);
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setIsUploadingLogo(false);
    }
  }, [selectedLogoFile, provider?.id, logoPreview, handleProviderGet]);
  
  const handleProviderUpdate = useCallback(async (data) => {
    await gameProvidersApi.updateManagedGameProvider(provider?.id, data);
    toast.success("Game provider successfully updated!");
    setTimeout(() => {
      handleProviderGet();
    }, 1000);
  }, [provider?.id, handleProviderGet]);

  const handleProviderEnableChange = useCallback(
    (name) => {
      const id = name;
      handleProviderUpdate({
        gaming_provider: id,
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
  //     await gameProvidersApi.updateManagedGameProvider(provider?.id, { is_default: true });
  //     toast.success("Game provider successfully set as default!");
  //     setTimeout(() => {
  //       handleProviderGet();
  //     }, 1000);
  //   },
  //   [provider, handleProviderGet]
  // );


  // const handleSettingsSave = useCallback(async () => {
  //   let hasError = false;

  //   if (!maxBetLimit || isNaN(maxBetLimit) || maxBetLimit <= 0) {
  //     setMaxBetLimitError("Max bet limit must be a positive number");
  //     hasError = true;
  //   } else {
  //     setMaxBetLimitError("");
  //   }

  //   if (!sessionTimeout || isNaN(sessionTimeout) || sessionTimeout <= 0) {
  //     setSessionTimeoutError("Session timeout must be a positive number");
  //     hasError = true;
  //   } else {
  //     setSessionTimeoutError("");
  //   }

  //   if (!hasError) {
  //     await handleProviderUpdate({ 
  //       enabled: providerEnabled,
  //       settings: { 
  //         max_bet_limit: parseInt(maxBetLimit),
  //         max_bet_limit_euro: parseInt(maxBetLimitEuro) || 0,
  //         max_bet_limit_bitcoin: parseFloat(maxBetLimitBitcoin) || 0,
  //         session_timeout: parseInt(sessionTimeout),
  //         game_types: selectedGameTypes
  //       } 
  //     });
  //   }
  // }, [maxBetLimit, maxBetLimitEuro, maxBetLimitBitcoin, sessionTimeout, selectedGameTypes, providerEnabled, handleProviderUpdate]);

  const handleCredentialsSave = useCallback(async () => {
    let hasError = false;
    const providerType = provider?.provider_type?.toLowerCase();

    if (providerType === 'interio') {
      if (!merchantKey.trim()) {
        setMerchantKeyError("Merchant key is required");
        hasError = true;
      } else {
        setMerchantKeyError("");
      }

      if (!password.trim()) {
        setPasswordError("Password is required");
        hasError = true;
      } else {
        setPasswordError("");
      }

      if (!hasError) {
        await handleProviderUpdate({ 
          credentials: { 
            merchant_key: merchantKey, 
            password: password 
          } 
        });
      }
    } else if (providerType === 'paypros' || providerType === 'pay_pros') {
      if (!merchantId.trim()) {
        setMerchantIdError("Merchant ID is required");
        hasError = true;
      } else {
        setMerchantIdError("");
      }

      if (!apiKey.trim()) {
        setApiKeyError("API key is required");
        hasError = true;
      } else {
        setApiKeyError("");
      }

      if (!signKey.trim()) {
        setSignKeyError("Sign key is required");
        hasError = true;
      } else {
        setSignKeyError("");
      }

      if (!hasError) {
        await handleProviderUpdate({ 
          credentials: { 
            merchant_id: merchantId, 
            api_key: apiKey, 
            sign_key: signKey 
          } 
        });
      }
    }
  }, [merchantKey, password, merchantId, apiKey, signKey, provider, handleProviderUpdate]);

  const gameTypes = [
    { value: 'slot_games', label: 'Slot Games' },
    { value: 'video_poker', label: 'Video Poker' },
    { value: 'table_games', label: 'Table Games' }
  ];
  const activeLogoSrc = useMemo(() => {
    if (logoPreview) {
      return logoPreview;
    }
    if (provider?.logo_url) {
      return provider?.logo_url?.includes('http') ? provider?.logo_url : `${getAPIUrl()}/${provider?.logo_url}`;
    }
    return providerLogo;
  }, [logoPreview, provider?.logo_url, providerLogo]);

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

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
                  label="Slots"
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
                  label="Video Poker"
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
                <Typography variant="h6">Default game provider:</Typography>
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
                  alt={`${provider?.name || provider?.provider_type || "Game provider"} logo`}
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
          Set Maximum Bet
        </Typography>

        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
          <Grid xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                Maximum bet limit - Euro
              </Typography>
              <OutlinedInput
                fullWidth
                name="max_bet_limit_euro"
                onChange={handleMaxBetLimitEuroChange}
                value={maxBetLimitEuro}
                placeholder="Type your amount here"
                type="number"
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="mdi:currency-eur" width={24} />
                  </InputAdornment>
                }
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                Maximum bet limit
              </Typography>
              <OutlinedInput
                fullWidth
                name="max_bet_limit"
                onChange={handleMaxBetLimitChange}
                value={maxBetLimit}
                placeholder="Type your amount here"
                type="number"
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="mdi:currency-usd" width={24} />
                  </InputAdornment>
                }
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
              {/* {maxBetLimitError && (
                <Typography color="error" variant="caption">
                  {maxBetLimitError}
                </Typography>
              )} */}
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                Maximum bet limit - Bitcoin
              </Typography>
              <OutlinedInput
                fullWidth
                name="max_bet_limit_bitcoin"
                onChange={handleMaxBetLimitBitcoinChange}
                value={maxBetLimitBitcoin}
                placeholder="Type your amount here"
                type="number"
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="mdi:bitcoin" width={24} />
                  </InputAdornment>
                }
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, lineHeight: 1.6, mb: 2.5 }}>
          All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
          Game Type
        </Typography>

        <Stack direction="row" spacing={2.5} sx={{ mb: 2.5 }}>
          {gameTypes.map((gameType) => {
            const isSelected = selectedGameTypes.includes(gameType.value);
            return (
              <Chip
                key={gameType.value}
                label={gameType.label}
                onClick={() => handleGameTypeToggle(gameType.value)}
                icon={
                  isSelected ? (
                    <Iconify icon="eva:checkmark-fill" width={20} />
                  ) : (
                    <Iconify icon="eva:plus-outline" width={20} />
                  )
                }
                sx={{
                  height: 42,
                  px: 1.5,
                  fontSize: '1rem',
                  bgcolor: isSelected ? '#DFDFDF' : 'action.hover',
                  color: isSelected ? '#000' : 'text.secondary',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  border: 1,
                  '&:hover': {
                    bgcolor: isSelected ? '#DFDFDF' : 'action.focus'
                  },
                  '& .MuiChip-icon': {
                    marginLeft: 0,
                    marginRight: 0.5,
                    color: isSelected ? '#000' : 'inherit'
                  }
                }}
              />
            );
          })}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, lineHeight: 1.6, mb: 2.5 }}>
          All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* <Card>
        <CardHeader title="Additional Settings" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h6">Session Timeout (seconds):</Typography>
                  <OutlinedInput
                    fullWidth
                    name="session_timeout"
                    onChange={handleSessionTimeoutChange}
                    value={sessionTimeout}
                    placeholder="Session timeout in seconds"
                    type="number"
                    error={!!sessionTimeoutError}
                  />
                  {sessionTimeoutError && (
                    <Typography color="error" variant="caption">
                      {sessionTimeoutError}
                    </Typography>
                  )}
                </Stack>

                <Stack direction="row" justifyContent="flex-end">
                  <Button variant="contained" onClick={handleSettingsSave}>
                    Save Settings
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}

      {(provider?.provider_type?.toLowerCase() === 'interio' || provider?.provider_type?.toLowerCase() === 'paypros' || provider?.provider_type?.toLowerCase() === 'pay_pros') && (
        <Card>
          <CardHeader title="Credentials" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack spacing={3}>
                  {provider?.provider_type?.toLowerCase() === 'interio' && (
                    <>
                      <Stack spacing={1}>
                        <Typography variant="h6">Merchant Key:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="merchant_key"
                          onChange={handleMerchantKeyChange}
                          value={merchantKey}
                          placeholder="Enter merchant key"
                          error={!!merchantKeyError}
                        />
                        {merchantKeyError && (
                          <Typography color="error" variant="caption">
                            {merchantKeyError}
                          </Typography>
                        )}
                      </Stack>

                      <Stack spacing={1}>
                        <Typography variant="h6">Password:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="password"
                          type="password"
                          onChange={handlePasswordChange}
                          value={password}
                          placeholder="Enter password"
                          error={!!passwordError}
                        />
                        {passwordError && (
                          <Typography color="error" variant="caption">
                            {passwordError}
                          </Typography>
                        )}
                      </Stack>
                    </>
                  )}

                  {(provider?.provider_type?.toLowerCase() === 'paypros' || provider?.provider_type?.toLowerCase() === 'pay_pros') && (
                    <>
                      <Stack spacing={1}>
                        <Typography variant="h6">Merchant ID:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="merchant_id"
                          onChange={handleMerchantIdChange}
                          value={merchantId}
                          placeholder="Enter merchant ID"
                          error={!!merchantIdError}
                        />
                        {merchantIdError && (
                          <Typography color="error" variant="caption">
                            {merchantIdError}
                          </Typography>
                        )}
                      </Stack>

                      <Stack spacing={1}>
                        <Typography variant="h6">API Key:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="api_key"
                          onChange={handleApiKeyChange}
                          value={apiKey}
                          placeholder="Enter API key"
                          error={!!apiKeyError}
                        />
                        {apiKeyError && (
                          <Typography color="error" variant="caption">
                            {apiKeyError}
                          </Typography>
                        )}
                      </Stack>

                      <Stack spacing={1}>
                        <Typography variant="h6">Sign Key:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="sign_key"
                          onChange={handleSignKeyChange}
                          value={signKey}
                          placeholder="Enter sign key"
                          error={!!signKeyError}
                        />
                        {signKeyError && (
                          <Typography color="error" variant="caption">
                            {signKeyError}
                          </Typography>
                        )}
                      </Stack>
                    </>
                  )}

                  <Stack direction="row" justifyContent="flex-end">
                    <Button variant="contained" onClick={handleCredentialsSave}>
                      Save Credentials
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};
