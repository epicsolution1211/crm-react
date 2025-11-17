import { useCallback, useEffect, useState } from "react";
import {settingsApi} from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatAvailable = () => {
  const [replyTime, setReplyTime] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const handleReplyTimeGet = async () => {
      const { reply_type, enabled } = await settingsApi.getMiniChatAvailable();
      setReplyTime(reply_type);
      setEnabled(enabled);
    }

    handleReplyTimeGet();
  }, []);

  const handleUpdateReplyTime = useCallback(async (e) => {
    if (!e.target.value) return;
    setReplyTime(e.target.value);
    await settingsApi.updateMiniChatAvailable({ reply_type: e.target.value });
    toast("Mini chat reply time is updated!");
  }, [replyTime]);

  const handleEnabledChange = useCallback(async () => {
    setEnabled(!enabled);
    await settingsApi.updateMiniChatAvailable({ enabled: !enabled });
    toast("Mini chat reply status updated!");
  })

  return { replyTime, setReplyTime, handleUpdateReplyTime, enabled, handleEnabledChange };
}