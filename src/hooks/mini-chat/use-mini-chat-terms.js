import {useCallback, useEffect, useState} from "react";
import {settingsApi} from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatTerms = () => {
  const [terms, setTerms] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const handleTermsGet = async () => {
      const terms = await settingsApi.getMiniChatAppearance();
      setTerms(terms?.appearance?.terms_value);
      setEnabled(terms?.appearance?.terms);
    }

    handleTermsGet();
  }, []);

  const handleUpdateTerms = useCallback(async () => {
    if (!terms) return;
    await settingsApi.updateMiniChatAppearance({ terms_value: terms });
    toast("Mini chat terms & conditions updated!");
  }, [terms]);

  const handleEnabledChange = useCallback(async () => {
    setEnabled(!enabled);
    await settingsApi.updateMiniChatAppearance({ terms: !enabled });
    toast("Mini chat welcome message status updated!");
  })

  return { terms, setTerms, handleUpdateTerms, enabled, handleEnabledChange };
}