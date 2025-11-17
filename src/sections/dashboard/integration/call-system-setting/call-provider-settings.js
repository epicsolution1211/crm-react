import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from '@mui/lab/LoadingButton';
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import { settingsApi } from "src/api/settings";
import { callProvidersApi } from "src/api/call-providers";
import { useMounted } from "src/hooks/use-mounted";
import { useDebounce } from "src/hooks/use-debounce";
import { SmsFrom } from "../sms-from";
import { getAPIUrl } from "src/config";
import { useAuth } from "src/hooks/use-auth";
import { useCompany } from "../../settings/platform/settings-platform";
import { Iconify } from 'src/components/iconify';

const NAME_TO_ID = {
  twilio: 1,
  coperato: 2,
  voiso: 3,
  "cypbx": 4,
  squaretalk: 5,
  commpeak: 6,
  mmdsmart: 7,
  "prime_voip": 8,
  voicespin: 9,
  didglobal: 10,
};

const useMembers = () => {
  const isMounted = useMounted();
  const [members, setMembers] = useState([]);

  const handleMembersGet = useCallback(async (q = "*") => {
    const members = await settingsApi.getMembers([], q, { per_page: 1000 });

    if (isMounted()) {
      setMembers(members?.accounts);
    }
  }, []);

  useEffect(() => {
    handleMembersGet();
  }, []);

  return {
    members,
    handleMembersGet,
  };
};

export const CallProviderSettings = ({ profile, handleProfileGet }) => {
  const { updateCompany } = useAuth();
  const { company, handleCompanyGet } = useCompany();
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [isSMSLoading, setIsSMSLoading] = useState(false);
  const { members, handleMembersGet } = useMembers();
  const [serverUrl, setServerUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiCallToken, setApiCallToken] = useState("");
  const [senderId, setSenderId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [agents, setAgents] = useState([]);
  const [providerEnabled, setProviderEnabled] = useState(null);
  const [providerDefault, setProviderDefault] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useState("");
  const [smsFrom, setSmsFrom] = useState([]);
  const [crmId, setCrmId] = useState("");
  const [clientId, setClientId] = useState("");
  const [login, setLogin] = useState("");
  const [accountId, setAccountId] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileNameError, setProfileNameError] = useState("");
  const [apiCallTokenError, setApiCallTokenError] = useState("");
  const [crmIdError, setCrmIdError] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [providersData, setProvidersData] = useState([]);

  const query = useDebounce(search, 300);

  const providerData = useMemo(() => {
    if (!profile?.provider_type) return null;
    const providerType = profile.provider_type.toLowerCase().trim();
    return providersData.find(p => p.type.toLowerCase().trim() === providerType) || null;
  }, [profile?.provider_type]);

  const providerLogo = useMemo(() => {
    if (!profile?.provider_type || !providersData.length) return null;
    const providerType = profile.provider_type.toLowerCase().trim();
    const matchedProvider = providersData.find(p => 
      p.provider.type.toLowerCase().trim() === providerType
    );

    if (profile?.logo_url) {
      return profile?.logo_url?.includes('http') ? profile?.logo_url : `${getAPIUrl()}/${profile?.logo_url}`;
    } else {
      return matchedProvider?.provider?.logo_url || null;
    }
  }, [profile, providersData, getAPIUrl]);

  const activeLogoSrc = useMemo(() => {
    if (logoPreview) {
      return logoPreview;
    }
    if (profile?.logo_url) {
      return profile.logo_url.includes('http') ? profile.logo_url : `${getAPIUrl()}/${profile.logo_url}`;
    }
    return providerLogo;
  }, [logoPreview, profile?.logo_url, providerLogo]);

  useEffect(() => {
    handleProfileGet();
  }, []);

  useEffect(() => {
    if (profile?.settings) {
      setEnabled(true);
    }
    if (profile?.name) {
      setProfileName(profile.name);
    }
    if (profile?.settings?.login) {
      setLogin(profile?.settings?.login);
    }
    if (profile?.settings?.account_id) {
      setAccountId(profile?.settings?.account_id);
    }
    if (profile?.settings?.api_key) {
      setApiKey(profile?.settings?.api_key);
    }
    if (profile?.settings?.access_token) {
      setAccessToken(profile?.settings?.access_token);
    }
    if (profile?.settings?.crm_id) {
      setCrmId(profile.settings.crm_id);
    }
    if (profile?.settings?.api_call_token) {
      setApiCallToken(profile?.settings?.api_call_token);
    }
    if (profile?.settings?.sender_id) {
      setSenderId(profile?.settings?.sender_id);
    }
    if (profile?.settings?.campaign_id) {
      setCampaignId(profile?.settings?.campaign_id);
    }
    if (profile?.settings?.client_id) {
      setClientId(profile?.settings?.client_id);
    }
    if (profile?.settings?.sms_from) {
      setSmsFrom(profile.settings.sms_from);
    }
    if (profile?.settings?.server_url)
      setServerUrl(profile.settings.server_url);
    if (profile) {
      setProviderDefault(profile?.is_default);
      setProviderEnabled(profile?.enabled);
    }
    setSelectedLogoFile(null);
    setLogoFileName("");
    setLogoPreview("");
  }, [profile]);

  useEffect(() => {
    handleMembersGet(query);
  }, [query]);

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  useEffect(() => {
    handleProfileGet();
    const fetchCallProviders = async () => {
      try {
        const response = await callProvidersApi.getCallProviders();
        if (response?.data?.providers) {
          setProvidersData(response.data.providers);
        }
      } catch (error) {
        console.error('Failed to fetch call providers:', error);
      }
    };
    fetchCallProviders();
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
    if (!profile?.id) {
      toast.error("Unable to upload logo. Missing identifier.");
      return;
    }
    try {
      setIsUploadingLogo(true);
      const formData = new FormData();
      formData.append("logo", selectedLogoFile);
      await callProvidersApi.uploadCallProviderLogo(profile.id, formData);
      toast.success("Logo uploaded successfully.");
      setSelectedLogoFile(null);
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoPreview("");
      setLogoFileName("");
      setTimeout(() => {
        handleProfileGet();
      }, 2000);
    } catch (error) {
      console.error("Failed to upload call provider logo:", error);
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setIsUploadingLogo(false);
    }
  }, [selectedLogoFile, profile?.id, logoPreview, handleProfileGet]);

  useEffect(() => {
    if (profile?.settings?.agent_ids) {
      setAgents(
        members?.map((member) => {
          const settingId = profile?.settings?.agent_ids[member?.id];

          return {
            id: member?.id,
            name: member?.first_name
              ? `${member?.first_name} ${member?.last_name}`
              : member?.email,
            avatar: member?.avatar,
            settingId: settingId ? settingId : "",
          };
        })
      );
    } else {
      setAgents(
        members.map((member) => ({
          id: member?.id,
          name: member?.first_name
            ? `${member?.first_name} ${member?.last_name}`
            : member?.email,
          avatar: member?.avatar,
          settingId: "",
        }))
      );
    }
  }, [members, profile]);

  useEffect(() => {
    if (profile?.provider_type === "commpeak" && providerEnabled) {
      setProfileNameError(!profileName ? "Profile name is required" : "");
      setApiCallTokenError(!apiCallToken ? "API Call Token is required" : "");
      setCrmIdError(!crmId ? "CRM ID is required" : "");
      setApiKeyError(!apiKey ? "SMS API Key is required" : "");
    } else {
      setProfileNameError("");
      setApiCallTokenError("");
      setCrmIdError("");
      setApiKeyError("");
    }
  }, [profile?.provider_type, providerEnabled, profileName, apiCallToken, crmId, apiKey]);

  const handleServerUrlChange = useCallback((event) => {
    const { value } = event?.target;
    setServerUrl(value);
  }, []);

  const handleApiKeyChange = useCallback((event) => {
    const { value } = event?.target;
    setApiKey(value);
  }, []);

  const handleCrmIdChange = useCallback((event) => {
    const { value } = event?.target;
    setCrmId(value);
  }, []);

  const handleClientIdChange = useCallback((event) => {
    const { value } = event?.target;
    setClientId(value);
  }, []);

  const handleApiCallTokenChange = useCallback((event) => {
    const { value } = event?.target;
    setApiCallToken(value);
  }, []);

  const handleSenderIdChange = useCallback((event) => {
    const { value } = event?.target;
    setSenderId(value);
  }, []);

  const handleCampaignIdChange = useCallback((event) => {
    const { value } = event?.target;
    setCampaignId(value);
  }, []);

  const handleLoginChange = useCallback((event) => {
    const { value } = event?.target;
    setLogin(value);
  }, []);

  const handleAccountIdChange = useCallback((event) => {
    const { value } = event?.target;
    setAccountId(value);
  }, []);

  const handleProfileNameChange = useCallback((event) => {
    const { value } = event?.target;
    setProfileName(value);
  }, []);

  const handleAccessTokenChange = useCallback((event) => {
    const { value } = event?.target;
    setAccessToken(value);
  }, []);

  const handleAgentIdChange = useCallback(
    (event, id) => {
      const { value } = event?.target;

      setAgents((prevState) => {
        const updatedState = prevState.map((agent) => {
          if (agent.id === id) {
            return {
              ...agent,
              settingId: value,
            };
          } else {
            return agent;
          }
        });
        return updatedState;
      });
    },
    [agents]
  );

  const handleSettingSave = useCallback(
    async (numbers = []) => {
      // const id = NAME_TO_ID[profile?.provider_type];
      const agentIds = agents.reduce((acc, { id, settingId }) => {
        acc[id] = settingId;
        return acc;
      }, {});

      const setting = {
        agent_ids: { ...profile?.settings?.agent_ids, ...agentIds },
      };

      if (profile?.provider_type !== "commpeak" && profile?.provider_type !== "mmdsmart") {
        setting.server_url = serverUrl;
      }

      if (profile?.provider_type === "mmdsmart" && login) {
        setting.login = login;
      }

      if (profile?.provider_type === "mmdsmart" && accountId) {
        setting.account_id = accountId;
      }

      if (profile?.provider_type === "squaretalk") {
        setting.sender_id = senderId ?? "";
        setting.campaign_id = campaignId ?? "";
      }

      if (profile?.provider_type === "commpeak") {
        setting.sender_id = senderId ?? "";
      }

      if (
        profile?.provider_type === "voiso" ||
        profile?.provider_type === "squaretalk" ||
        profile?.provider_type === "coperato" ||
        profile?.provider_type === "commpeak"
      ) {
        setting.api_key = apiKey;
      }

      if (numbers?.length > 0) {
        setting.sms_from = numbers;
      } else if (smsFrom) {
        setting.sms_from = smsFrom;
      }

      if (profile?.provider_type === "didglobal") {
        setting.access_token = accessToken;
      }

      if (profile?.provider_type === "commpeak" && crmId) {
        setting.crm_id = crmId;
      }

      if (profile?.provider_type === "commpeak" && clientId) {
        setting.client_id = clientId;
      }

      if ((profile?.provider_type === "commpeak" || profile?.provider_type === "mmdsmart" || profile?.provider_type === "didglobal") && apiCallToken) {
        setting.api_call_token = apiCallToken;
      }

      await callProvidersApi.updateManagedCallProvider(profile?.id, {
        provider_type: profile?.provider_type,
        is_default: profile?.is_default === null ? false : profile?.is_default,
        settings: JSON.stringify(setting),
        name: profileName
      });
      setEnabled(true);
      handleProfileGet();
      toast("Call profile settings saved!");
    },
    [
      agents,
      profile,
      serverUrl,
      accountId,
      apiKey,
      handleProfileGet,
      crmId,
      clientId,
      apiCallToken,
      login,
      senderId,
      campaignId,
      smsFrom,
      profileName,
      accessToken,
    ]
  );

  const handleProviderUpdate = useCallback(async (data) => {
    try {
      await callProvidersApi.updateManagedCallProvider(profile?.id, data);
      toast.success("Call profile successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  const handleProviderEnableChange = useCallback(
    (name) => {
      const id = NAME_TO_ID[name];
      handleProviderUpdate({
        call_system: id,
        enabled: !providerEnabled,
        is_default: profile?.is_default ?? false,
      });
      setProviderEnabled(!providerEnabled);
    },
    [providerEnabled, handleProviderUpdate, profile]
  );

  const handleProviderDefaultChange = useCallback(
    async () => {
      setProviderDefault(true);
      await callProvidersApi.updateManagedCallProvider(profile?.id, { is_default: true });
      toast.success("Call profile successfully set as default!");
      setTimeout(() => {
        handleProfileGet();
      }, 1000);
    },
    [profile, handleProfileGet]
  );

  const hanldeEnableOTPSms = async () => {
    setIsOTPLoading(true);
    try {
      if(profile?.provider_type === "commpeak" || profile?.provider_type === "coperato") {
        await settingsApi.updateCompany({ id: company?.id, data: { verification_message: profile?.provider_type === "coperato"? 1 : 2 } });
        toast.success('OTP SMS successfully enabled!');
        updateCompany({...company, verification_message: profile?.provider_type === "coperato"? 1 : 2 });
      }
    } catch (error) {
      console.error('error: ', error);
    }
    setIsOTPLoading(false);
  };

  const hanldeEnableSmsMessage = async () => {
    setIsSMSLoading(true);
    try {
      if (profile?.provider_type === "commpeak" || profile?.provider_type === "coperato" || profile?.provider_type === "mmdsmart" || profile?.provider_type === "squaretalk") {
        await settingsApi.updateCompany({ id: company?.id, data: { sms_provider : profile?.id} });
        toast.success('SMS message successfully enabled!');
        updateCompany({...company, sms_provider : profile?.id });
        setTimeout(() => {
          handleCompanyGet();
        }, 1000);
      }
    } catch (error) {
      console.error('error: ', error);
    }
    setIsSMSLoading(false);
  };

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
                  alt={providerData?.name || profile?.provider_type}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
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
                {providerData?.name || profile?.provider_type}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Box sx={{ px: 3, py: 1.25 }}>
          <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
            {providerData?.supported_features ? (
              providerData.supported_features.slice(0, 4).map((feature, index) => (
                <Chip
                  key={index}
                  label={feature.replace(/_/g, ' ')}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#000',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    height: 20,
                    borderRadius: 0.625,
                    textTransform: 'capitalize',
                    '& .MuiChip-label': {
                      px: 2.5,
                      py: 0.25,
                      lineHeight: 1.57
                    }
                  }}
                />
              ))
            ) : null}
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
            {providerData?.description || "Cloud-based communication platform providing advanced call handling and integration features."}
          </Typography>
        </Box>
        <Box sx={{ px: 2, pb: 1.875, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:checkmark-fill" width={20} />}
            onClick={() => handleProviderEnableChange(profile?.provider_type)}
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

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
          General Settings
        </Typography>

        <Stack spacing={3}>
          {profile?.provider_type === "commpeak" || profile?.provider_type === "coperato" || profile?.provider_type === "mmdsmart" || profile?.provider_type === "squaretalk" ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                Use this provider for sending SMS messages to clients:
              </Typography>
              {company?.sms_provider == profile?.id ? (
                <Chip label="Enabled" />
              ) : (
                <LoadingButton
                  loading={isSMSLoading}
                  variant="contained"
                  onClick={() => hanldeEnableSmsMessage()}
                >
                  Enable
                </LoadingButton>
              )}
            </Stack>
          ) : null}

          {profile?.provider_type === "commpeak" || profile?.provider_type === "coperato" ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                Use this call provider to send OTP SMS messages:
              </Typography>
              {(profile?.provider_type === "coperato" && company?.verification_message == 1) || (profile?.provider_type === "commpeak" && company?.verification_message == 2) ? (
                <Chip label="Enabled" />
              ) : (
                <LoadingButton
                  loading={isOTPLoading}
                  variant="contained"
                  onClick={() => hanldeEnableOTPSms()}
                >
                  Enable
                </LoadingButton>
              )}
            </Stack>
          ) : null}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Default call profile:
            </Typography>
            {providerDefault ? (
              <Chip label="Default" />
            ) : (
              <Button
                disabled={!enabled}
                variant="contained"
                onClick={() => handleProviderDefaultChange(profile?.id)}
              >
                Make default
              </Button>
            )}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Your server IP address:
            </Typography>
            <Chip variant="soft" label={company?.server_ip ?? "n/a"} />
          </Stack>
        </Stack>
      </Box>

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
                  alt={`${profile?.name || profile?.provider_type || "Call provider"} logo`}
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
          Profile Name
        </Typography>
        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={1} sx={{ width: '100%' }}>
            <OutlinedInput
              fullWidth
              name="profile_name"
              onChange={handleProfileNameChange}
              value={profileName}
              placeholder="Profile Name"
              error={!!profileNameError}
              sx={{
                bgcolor: 'background.neutral',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider'
                }
              }}
            />
            {profileNameError && (
              <Typography color="error" variant="caption">
                {profileNameError}
              </Typography>
            )}
          </Stack>
          <Button onClick={handleSettingSave} variant="contained">
            Save
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {profile?.provider_type === "mmdsmart" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
              Login
            </Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <OutlinedInput
                fullWidth
                name="login"
                onChange={handleLoginChange}
                value={login}
                placeholder="Login"
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
              <Button onClick={handleSettingSave} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      {profile?.provider_type === "mmdsmart" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
              Company Account ID
            </Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <OutlinedInput
                fullWidth
                name="accountId"
                onChange={handleAccountIdChange}
                value={accountId}
                placeholder="Account ID"
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
              <Button onClick={handleSettingSave} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      {profile?.provider_type !== "commpeak" && profile?.provider_type !== "mmdsmart" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
              Server URL
            </Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <OutlinedInput
                fullWidth
                name="server_url"
                onChange={handleServerUrlChange}
                value={serverUrl}
                placeholder="Server url"
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
              <Button onClick={handleSettingSave} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      {profile?.provider_type === "commpeak" || profile?.provider_type === "mmdsmart" || profile?.provider_type === "didglobal" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
              API Call Token
            </Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack spacing={1} sx={{ width: '100%' }}>
                <OutlinedInput
                  fullWidth
                  name="api_call_token"
                  value={apiCallToken}
                  onChange={handleApiCallTokenChange}
                  placeholder="API Call Token"
                  error={!!apiCallTokenError}
                  sx={{
                    bgcolor: 'background.neutral',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    }
                  }}
                />
                {apiCallTokenError && (
                  <Typography color="error" variant="caption">
                    {apiCallTokenError}
                  </Typography>
                )}
              </Stack>
              <Button onClick={handleSettingSave} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      {profile?.provider_type === "commpeak" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
              CRM ID
            </Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack spacing={1} sx={{ width: '100%' }}>
                <OutlinedInput
                  fullWidth
                  name="crm_id"
                  value={crmId}
                  onChange={handleCrmIdChange}
                  placeholder="CRM ID"
                  error={!!crmIdError}
                  sx={{
                    bgcolor: 'background.neutral',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    }
                  }}
                />
                {crmIdError && (
                  <Typography color="error" variant="caption">
                    {crmIdError}
                  </Typography>
                )}
              </Stack>
              <Button onClick={handleSettingSave} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      {profile?.provider_type === "voiso" ||
        profile?.provider_type === "squaretalk" ||
        profile?.provider_type === "coperato" ||
        profile?.provider_type === "commpeak" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {profile?.provider_type === "voiso" || profile?.provider_type === "squaretalk" ? "API key" : "SMS API key"}
              </Typography>
              {!enabled && (
                <Tooltip title="You have to update setting first!">
                  <Iconify icon="mdi:error-outline" width={24} color="error.main" />
                </Tooltip>
              )}
            </Stack>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack spacing={1} sx={{ width: '100%' }}>
                <OutlinedInput
                  disabled={!enabled}
                  fullWidth
                  name="api_key"
                  onChange={handleApiKeyChange}
                  value={apiKey}
                  placeholder={profile?.provider_type === "voiso" || profile?.provider_type === "squaretalk" ? "API key" : "SMS API key"}
                  error={!!apiKeyError}
                  sx={{
                    bgcolor: 'background.neutral',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    }
                  }}
                />
                {apiKeyError && (
                  <Typography color="error" variant="caption">
                    {apiKeyError}
                  </Typography>
                )}
              </Stack>
              <Button
                disabled={!enabled}
                onClick={handleSettingSave}
                variant="contained"
              >
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}


      {profile?.provider_type === "squaretalk" || profile?.provider_type === "commpeak" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
              Sender ID
            </Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <OutlinedInput
                fullWidth
                name="sender_id"
                value={senderId}
                onChange={handleSenderIdChange}
                placeholder="Sender Id"
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
              <Button onClick={handleSettingSave} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      {profile?.provider_type === "didglobal" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
              Access Token
            </Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <OutlinedInput
                fullWidth
                name="access_token"
                value={accessToken}
                onChange={handleAccessTokenChange}
                placeholder="Access Token"
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
              <Button onClick={handleSettingSave} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      {profile?.provider_type === "squaretalk" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
              Campaign ID
            </Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <OutlinedInput
                fullWidth
                name="campaign_id"
                value={campaignId}
                onChange={handleCampaignIdChange}
                placeholder="Campaign Id"
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
              <Button onClick={handleSettingSave} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      {profile?.provider_type === "commpeak" ? (
        <>
          <Box sx={{ px: 2.5, py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
              Client ID
            </Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <OutlinedInput
                fullWidth
                name="client_id"
                onChange={handleClientIdChange}
                value={clientId}
                placeholder="Client ID"
                sx={{
                  bgcolor: 'background.neutral',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              />
              <Button onClick={handleSettingSave} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      {profile?.provider_type === "coperato" ? (
        <>
          <SmsFrom
            smsFrom={smsFrom}
            onSave={(data) => {
              setSmsFrom(data);
              handleSettingSave(data);
            }}
          />
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      ) : null}

      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
          Assign Setting ID to Agents
        </Typography>
        
        <TextField
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="lucide:search" color="text.secondary" width={24} />
              </InputAdornment>
            ),
          }}
          label="Search"
          onChange={(e) => setSearch(e?.target?.value)}
          placeholder="Search members..."
          value={search}
          sx={{ mb: 3 }}
        />
        
        <Stack spacing={3} direction="column">
          {agents?.map((agent) => (
            <Stack
              key={agent.id}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
              sx={{ 
                px: { xs: 1, sm: 3 },
                py: { xs: 2, sm: 1 }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: { xs: 2, sm: 0 } }}>
                <Avatar
                  src={agent?.avatar ? agent?.avatar?.includes('http') ? agent?.avatar : `${getAPIUrl()}/${agent?.avatar}` : ""}
                  alt="agent avatar" />
                <Typography noWrap sx={{ maxWidth: { xs: '180px', sm: '250px' } }}>{agent?.name}</Typography>
              </Stack>

              {(agent?.settingId && (!profile?.settings?.agent_ids || agent?.settingId !== profile?.settings?.agent_ids[agent?.id])) && (
                <Button 
                  variant="outlined" 
                  onClick={handleSettingSave}
                  size="small"
                  sx={{ 
                    display: { xs: 'flex', sm: 'none' },
                    mb: 1,
                    alignSelf: 'flex-start'
                  }}
                >
                  Save
                </Button>
              )}

              <Stack 
                direction="row"
                alignItems="center" 
                spacing={1}
                sx={{ 
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {(agent?.settingId && (!profile?.settings?.agent_ids || agent?.settingId !== profile?.settings?.agent_ids[agent?.id])) && (
                  <Button 
                    variant="outlined" 
                    onClick={handleSettingSave}
                    size="small"
                    sx={{ 
                      display: { xs: 'none', sm: 'flex' },
                      height: '40px',
                      my: 0
                    }}
                  >
                    Save
                  </Button>
                )}
                <OutlinedInput
                  sx={{ 
                    width: { xs: '100%', sm: '250px' },
                    my: 0,
                    bgcolor: 'background.neutral',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    }
                  }}
                  value={agent?.settingId}
                  placeholder="Call profile user id..."
                  onChange={(event) =>
                    handleAgentIdChange(event, agent?.id)
                  }
                />
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary', fontWeight: 300, lineHeight: 1.6 }}>
          Note: Put id's for agents from your call profile to let call system work.
        </Typography>
      </Box>
    </Stack>
  );
};
