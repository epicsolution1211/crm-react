import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { Iconify } from 'src/components/iconify';
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { customersApi } from "src/api/customers";
import { settingsApi } from "src/api/settings";
import { useNotifications } from "src/hooks/use-notifications";
import { useCallProfiles } from 'src/hooks/call-system/useCallProfiles';

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

const CallProviderContext = createContext();

const useInboundCalling = () => {
  const { player } = useNotifications();

  const [calling, setCalling] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [inboundCaller, setInboundCaller] = useState(null);

  return {
    calling,
    inboundCaller,
    setCalling,
    player,
  };
};

const CallProvider = ({ children }) => {
  const router = useRouter();
  const { profiles } = useCallProfiles();

  const twilioEnabled = useMemo(() => {
    if (profiles?.length > 0) {
      const twilioProvider = profiles?.find(p => p?.provider_type === "twilio");
      return twilioProvider?.enabled;
    }
    return false;
  }, [profiles]);

  const [openClientCall, setOpenClientCall] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [caller, setCaller] = useState(null);

  const { calling, inboundCaller, setCalling, player } = useInboundCalling(twilioEnabled);

  // Stop autodial after reload
  useEffect(() => {
    const autodial = localStorage.getItem("autodial");
    if (autodial) {
      localStorage.removeItem("autodial");
      localStorage.removeItem("autodial_call_provider");
      localStorage.removeItem("autodial_label");
      localStorage.removeItem("autodial_max_try");
      customersApi.stopAutodial();
    }
  }, []);

  const handleAutodial = useCallback(async () => {
    const labelId = localStorage.getItem("autodial_label");
    const maxTry = localStorage.getItem("autodial_max_try");
    const request = {};

    request.client_label_id = labelId;
    if (maxTry) request.max_try = maxTry;

    const response = await customersApi.startAutodial(request);
    if (!response.ticket) {
      await customersApi.stopAutodial();
      localStorage.removeItem("autodial");
      localStorage.removeItem("autodial_label");
      localStorage.removeItem("autodial_max_try");
      toast("There are no tickets for this label. Please try another!");
      return;
    }

    const customerPhoneNumber = response?.client_phone_numbers?.[0];

    if (!customerPhoneNumber) {
      toast("Customer does not have a phone number!");
      handleAutodial();
      return;
    }

    handleMakeProviderCall(customerPhoneNumber.id);
  }, [customersApi]);

  const handleMakeProviderCall = useCallback(async (phone) => {
    const callProvider = localStorage.getItem("autodial_call_provider");
    const profile = profiles?.find(p => p?.provider_type === callProvider);
    await settingsApi.callRequest({
      call_system: NAME_TO_ID[profile?.provider_type],
      provider_profile_id: profile?.id,
      phone_number: phone,
    });
    toast(`${callProvider} call has started!`);
  }, [profiles]);

  const handleOpenClientChat = useCallback(() => {
    if (caller) {
      if (player) player.pause();
      router.push(paths.dashboard.chat + `?customer=${caller?.id}`);
    } else if (inboundCaller) {
      if (player) player.pause();
      router.push(paths.dashboard.chat + `?customer=${inboundCaller?.id}`);
      setCalling(false);
    }
  }, [router, caller, inboundCaller]);

  const handleCloseCalling = () => {
    setCalling(false);
    if (player) player.pause();
  }

  const handleCloseClientCalling = () => {
    setOpenClientCall(false);
    if (player) player.pause();
  }

  return (
    <CallProviderContext.Provider value={{}}>
      {children}

      <Snackbar
        open={calling}
        onClose={handleCloseCalling}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Alert severity="info" onClose={handleCloseCalling}>
          <AlertTitle>Incoming inbound call</AlertTitle>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Tooltip title="Open chat">
              <IconButton onClick={handleOpenClientChat}>
                <Iconify icon="fluent:people-chat-16-regular" width={24}/>
              </IconButton>
            </Tooltip>
          </Stack>
        </Alert>
      </Snackbar>

      <Snackbar
        open={openClientCall}
        onClose={handleCloseClientCalling}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Alert severity="info" onClose={handleCloseClientCalling}>
          <AlertTitle>Incoming call</AlertTitle>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Typography variant="h7">{caller?.name} is calling!</Typography>
            <Tooltip title="Open chat">
              <IconButton onClick={handleOpenClientChat}>
                <Iconify icon="fluent:people-chat-16-regular" width={24}/>
              </IconButton>
            </Tooltip>
          </Stack>
        </Alert>
      </Snackbar>
    </CallProviderContext.Provider>
  );
};

export { CallProviderContext, CallProvider };
