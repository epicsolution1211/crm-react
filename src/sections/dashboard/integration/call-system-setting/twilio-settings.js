import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from '@mui/lab/LoadingButton';
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { settingsApi } from "src/api/settings";
import { useMounted } from "src/hooks/use-mounted";
import { getAPIUrl } from "src/config";
import { useAuth } from "src/hooks/use-auth";
import { useCompany } from "../../settings/platform/settings-platform";
import { Iconify } from "src/components/iconify";

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

  const handleMembersGet = useCallback(async () => {
    const members = await settingsApi.getMembers([], "*", {
      per_page: 30,
      active: true,
    });

    if (isMounted()) {
      setMembers(members?.accounts);
    }
  }, []);

  useEffect(() => {
    handleMembersGet();
  }, []);

  return {
    members,
  };
};

export const TwilioSettings = ({ profile, handleProfileGet }) => {
  const { updateCompany } = useAuth();
  const { company, handleCompanyGet } = useCompany();

  const { members } = useMembers();
  const [apiKey, setApiKey] = useState("");
  const [clientSid, setClientSid] = useState("");
  const [appSid, setAppSid] = useState("");
  const [agents, setAgents] = useState([]);
  const [profileEnabled, setProfileEnabled] = useState(null);
  const [profileDefault, setProfileDefault] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [isSMSLoading, setIsSMSLoading] = useState(false);
  const [profileName, setProfileName] = useState("");

  const hanldeEnableSmsMessage = async () => {
    setIsSMSLoading(true);
    try {
      await settingsApi.updateCompany({ id: company?.id, data: { sms_provider : profile?.id} });
      toast.success('SMS message successfully enabled!');
      updateCompany({...company, sms_provider : profile?.id });
      setTimeout(() => {
        handleCompanyGet();
      }, 1000);
    } catch (error) {
      console.error('error: ', error);
    }
    setIsSMSLoading(false);
  };


  useEffect(() => {
    if (profile?.settings) {
      setEnabled(true);
    }
    if (profile?.name) {
      setProfileName(profile.name);
    }
    if (profile?.settings?.api_key) {
      setApiKey(profile?.settings?.api_key);
    }
    if (profile?.settings?.client_sid)
      setClientSid(profile?.settings?.client_sid);
    if (profile?.settings?.application_sid)
      setAppSid(profile?.settings?.application_sid);
    if (profile) {
      setProfileDefault(profile?.is_default);
      setProfileEnabled(profile?.enabled);
    }
  }, [profile]);

  useEffect(() => {
    if (profile?.settings?.agent_ids) {
      setAgents(
        members?.map((member) => {
          const phone = profile?.settings?.agent_ids[member?.id];

          return {
            id: member?.id,
            name: member?.first_name + " " + member?.last_name,
            avatar: member?.avatar,
            phone: phone ? phone : "",
          };
        })
      );
    } else {
      setAgents(
        members.map((member) => ({
          id: member?.id,
          name: member?.first_name + " " + member?.last_name,
          avatar: member?.avatar,
          phone: "",
        }))
      );
    }
  }, [members, profile]);

  const handleApiKeyChange = useCallback((event) => {
    const { value } = event?.target;
    setApiKey(value);
  }, []);

  const handleClientSidChange = useCallback((event) => {
    const { value } = event?.target;
    setClientSid(value);
  }, []);

  const handleAppSidChange = useCallback((event) => {
    const { value } = event?.target;
    setAppSid(value);
  }, []);

  const handleAgentPhoneChange = useCallback((event, id) => {
    const { value } = event?.target;

    setAgents((prevState) =>
      prevState.map((agent) => {
        if (agent.id === id) {
          return {
            ...agent,
            phone: value,
          };
        } else {
          return agent;
        }
      })
    );
  }, []);

  const handleProfileNameChange = useCallback((event) => {
    const { value } = event?.target;
    setProfileName(value);
  }, []);

  const handleSettingSave = useCallback(async () => {
    const id = NAME_TO_ID[profile?.provider_type];
    const agentIds = agents.reduce((acc, { id, phone }) => {
      acc[id] = phone;
      return acc;
    }, {});

    const setting = {
      agent_ids: agentIds,
      api_key: apiKey,
      client_sid: clientSid,
      application_sid: appSid,
    };

    await settingsApi.updateCallProfile(profile?.id, {
      call_system: id,
      is_default: profile?.is_default ?? false,
      settings: JSON.stringify(setting),
      name: profileName
    });
    setEnabled(true);
    toast("Call profile settings saved!");
    handleProfileGet();
  }, [agents, profile, clientSid, appSid, apiKey, profileName]);

  const handleProfileUpdate = useCallback(async (data) => {
    try {
      await settingsApi.updateCallProfile(profile?.id, data);
      toast("Twilio config successfully updated!");
    } catch (error) {
      toast(error?.response?.data?.message);
    }
  }, [profile]);

  const handleProviderEnableChange = useCallback(
    (name) => {
      const id = NAME_TO_ID[name];
      handleProfileUpdate({
        call_system: id,
        enabled: !profileEnabled,
        is_default: profile?.is_default ?? false,
      });
      setProfileEnabled(!profileEnabled);
    },
    [profileEnabled, handleProfileUpdate, profile]
  );

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader
          title="General"
          avatar={
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
                <Typography variant="h6">Call profile enabled:</Typography>
                <Switch
                  disabled={!enabled}
                  checked={profileEnabled}
                  onChange={() => handleProviderEnableChange(profile?.provider_type)}
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 3 }}
              >
                <Typography variant="h6">Use this profile for sending SMS messages to clients:</Typography>
                {company?.sms_provider == profile?.id ? (
                  <Chip label="Enabled" />
                ) : (
                  <LoadingButton
                    loading={isSMSLoading}
                    disabled={!enabled}
                    variant="contained"
                    onClick={() => hanldeEnableSmsMessage()}
                  >
                    Enable
                  </LoadingButton>
                )}
              </Stack>
              
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 3 }}
              >
                <Typography variant="h6">Default call profile:</Typography>
                {profileDefault ? (
                  <Chip label="Default" />
                ) : (
                  <Button
                    disabled={!enabled}
                    variant="contained"
                    onClick={() => handleProfileDefaultChange(profile?.provider_type)}
                  >
                    Make default
                  </Button>
                )}
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 3 }}
              >
                <Typography variant="h6">Your server IP address:</Typography>
                <Chip variant="soft" label={company?.server_ip ?? "n/a"} />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Profile Name" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack
                spacing={3}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <OutlinedInput
                  fullWidth
                  name="profile_name"
                  onChange={handleProfileNameChange}
                  value={profileName}
                  placeholder="Profile Name"
                />
                <Button onClick={handleSettingSave} variant="contained">
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="SMS API key" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack
                spacing={3}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <OutlinedInput
                  fullWidth
                  name="api_key"
                  onChange={handleApiKeyChange}
                  value={apiKey}
                  placeholder="SMS API key"
                />
                <Button onClick={handleSettingSave} variant="contained">
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Client SID" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack
                spacing={3}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <OutlinedInput
                  fullWidth
                  name="client_sid"
                  onChange={handleClientSidChange}
                  value={clientSid}
                  placeholder="Client SID"
                />
                <Button onClick={handleSettingSave} variant="contained">
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Application SID" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack
                spacing={3}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <OutlinedInput
                  fullWidth
                  name="application_sid"
                  onChange={handleAppSidChange}
                  value={appSid}
                  placeholder="Application SID"
                />
                <Button onClick={handleSettingSave} variant="contained">
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Assign phone numbers to agents" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack spacing={3} direction="column">
                {agents?.map((agent) => (
                  <Stack
                    key={agent.id}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: { xs: 0, md: 5, lg: 5, sm: 5, xl: 5 } }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        src={agent?.avatar ? agent?.avatar?.includes('http') ? agent?.avatar : `${getAPIUrl()}/${agent?.avatar}` : ""}
                        alt="agent avatar" />
                      <Typography>{agent?.name}</Typography>
                    </Stack>

                    <OutlinedInput
                      value={agent?.phone}
                      placeholder="eg. +38 (073) 921 38 99"
                      onChange={(event) =>
                        handleAgentPhoneChange(event, agent?.id)
                      }
                    />
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>

        <Typography variant="body1" sx={{ pl: 3 }}>
          Note: Set phone numbers for agents to let call system work.
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ pb: 4, pr: 8 }}
        >
          <Button onClick={handleSettingSave} variant="contained">
            Save
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};
