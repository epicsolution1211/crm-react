import {useCallback, useEffect, useState} from "react";
import {settingsApi} from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatNotice = () => {
  const [notice, setNotice] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const handleNoticeGet = async () => {
      const { starting_notice } = await settingsApi.getMiniChatNotice();
      setNotice(starting_notice?.description);
      setEnabled(starting_notice?.enabled);
    }

    handleNoticeGet();
  }, []);

  const handleUpdateNotice = useCallback(async () => {
    if (!notice) return;
    await settingsApi.updateMiniChatNotice({ description: notice });
    toast("Mini chat starting notice updated!");
  }, [notice]);

  const handleEnabledChange = useCallback(async () => {
    setEnabled(!enabled);
    await settingsApi.updateMiniChatNotice({ enabled: !enabled });
    toast("Mini chat starting notice status updated!");
  })

  return { notice, setNotice, handleUpdateNotice, enabled, handleEnabledChange };
}