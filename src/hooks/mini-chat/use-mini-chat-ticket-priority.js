import { useCallback, useEffect, useState } from "react";
import {settingsApi} from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatTicketPriority = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const handleTicketPriorityGet = async () => {
      const { appearance } = await settingsApi.getMiniChatAppearance();
      setEnabled(appearance?.online_priority);
    }

    handleTicketPriorityGet();
  }, []);

  const handleEnabledChange = useCallback(async () => {
    setEnabled(!enabled);
    await settingsApi.updateMiniChatAppearance({ online_priority: !enabled });
    toast("Mini chat ticket priority status updated!");
  })

  return { enabled, handleEnabledChange };
}