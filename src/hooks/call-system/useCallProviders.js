import { useCallback, useEffect, useState } from "react";
import { useMounted } from "../use-mounted";
import { settingsApi } from "src/api/settings";

export const useCallProviders = () => {
  const isMounted = useMounted();
  const [providers, setProviders] = useState([]);

  const handleProvidersGet = useCallback(async () => {
    const accountId = localStorage.getItem("account_id");

    if (accountId) {
      const response = await settingsApi.getCallProviders();
      if (isMounted()) {
        setProviders(response?.providers);
      }
    } else {
      setProviders([]);
    }
    
  }, [isMounted]);

  useEffect(() => {
    handleProvidersGet();
  }, [isMounted]);

  return providers;
};