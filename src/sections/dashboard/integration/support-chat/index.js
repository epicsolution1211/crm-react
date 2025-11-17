import { useSettings } from 'src/hooks/use-settings';
import { useSelector, useDispatch } from "react-redux";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";

import { thunks } from "../../../../thunks/provider";

const useProviders = () => {
  const dispatch = useDispatch();

  const { provider, pending } = useSelector((state) => state.providers)

  const handleGetProvider = () => dispatch(thunks.getProviderInfo());

  useEffect(() => {
    handleGetProvider();
  }, []);

  return {
    providers: provider, isLoading: pending
  };
};

export const SupportChat = ({ providerId, pageInfo }) => {
  const settings = useSettings();
  const { providers, isLoading } = useProviders();
  const [provider, setProvider] = useState();

  useEffect(() => {
    if (pageInfo === 'call-system') {
      setProvider(providers?.call_system?.find((item) => item?.id === parseInt(providerId)))
    }
    if (pageInfo === 'payment-service-providers') {
      setProvider(providers?.payment_system?.find((item) => item?.id === parseInt(providerId)))
    }
    if (pageInfo === 'marketing-agencies') {
      setProvider(providers?.marketing_agencies?.find((item) => item?.id === parseInt(providerId)))
    }
    if (pageInfo === 'law-firms') {
      setProvider(providers?.law_firms?.find((item) => item?.id === parseInt(providerId)))
    }
  }, [providers, providerId, pageInfo])

  return (
    <Stack
      spacing={4}
      sx={{ flexFlow: 1, height: settings?.layout === 'horizontal' ? 'calc(100vh - 420px)' : 'calc(100vh - 340px)' }}>
      {!isLoading && <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ flexGrow: 1, height: 1 }}
      >
        <iframe
          title="Example Iframe"
          src={`https://${provider?.chat_url}?chat_token=${provider?.chat_token}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
        />
      </Stack>}
    </Stack>
  );
};
