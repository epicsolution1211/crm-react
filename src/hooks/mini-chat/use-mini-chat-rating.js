import { useCallback, useEffect, useState } from "react";
import {settingsApi} from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatRating = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const handleRatingGet = async () => {
      const { settings } = await settingsApi.getMiniChatRating();
      setEnabled(settings.enabled);
    }

    handleRatingGet();
  }, []);

  const handleEnabledChange = useCallback(async () => {
    setEnabled(!enabled);
    await settingsApi.updateMiniChatRating({ enabled: !enabled });
    toast("Mini chat rating status updated!");
  })

  return { enabled, handleEnabledChange };
}