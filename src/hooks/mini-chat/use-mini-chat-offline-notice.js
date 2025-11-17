import {useCallback, useEffect, useState} from "react";
import {settingsApi} from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatOfflineNotice = () => {
  const [offlineNotice, setOfflineNotice] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const handleOfflineNoticeGet = async () => {
      const { appearance } = await settingsApi.getMiniChatAppearance();
      setOfflineNotice(appearance?.offline_notice_message);
      setEnabled(appearance?.offline_notice);
    }

    handleOfflineNoticeGet();
  }, []);

  const handleUpdateOfflineNotice = useCallback(async () => {
    if (!offlineNotice) return;
    await settingsApi.updateMiniChatAppearance({ offline_notice_message: offlineNotice });
    toast("Mini chat offline notice updated!");
  }, [offlineNotice]);

  const handleEnabledChange = useCallback(async () => {
    setEnabled(!enabled);
    await settingsApi.updateMiniChatAppearance({ offline_notice: !enabled });
    toast("Mini chat offline notice status updated!");
  })

  return { offlineNotice, setOfflineNotice, handleUpdateOfflineNotice, enabled, handleEnabledChange };
}