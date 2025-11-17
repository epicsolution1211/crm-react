import {useCallback, useEffect, useState} from "react";
import {settingsApi} from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatWelcomeMessage = () => {
  const [message, setMessage] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const handleMessageGet = async () => {
      const welcomeMessage = await settingsApi.getMiniChatWelcomeMessage();
      setMessage(welcomeMessage.description);
      setEnabled(welcomeMessage.enabled);
    }

    handleMessageGet();
  }, []);

  const handleUpdateMessage = useCallback(async () => {
    if (!message) return;
    await settingsApi.updateMiniChatWelcomeMessage({ description: message });
    toast("Mini chat welcome message updated!");
  }, [message]);

  const handleEnabledChange = useCallback(async () => {
    setEnabled(!enabled);
    await settingsApi.updateMiniChatWelcomeMessage({ enabled: !enabled });
    toast("Mini chat welcome message status updated!");
  })

  return { message, setMessage, handleUpdateMessage, enabled, handleEnabledChange };
}