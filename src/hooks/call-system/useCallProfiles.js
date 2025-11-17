import { useCallback, useEffect, useState } from "react";
import { settingsApi } from "src/api/settings";

export const useCallProfiles = () => {
  const accountId = localStorage.getItem("account_id");
  const [profiles, setProfiles] = useState([]);

  const handleProfilesGet = useCallback(async () => {
    if (accountId) {
      const response = await settingsApi.getCallProfiles();
      setProfiles(response?.provider_profiles);
    }
  }, [accountId]);

  useEffect(() => {
    handleProfilesGet();
  }, [handleProfilesGet]);

  return {
    profiles,
    handleProfilesGet,
  };
};