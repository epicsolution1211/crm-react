import { useCallback, useEffect, useState } from "react";
import { settingsApi } from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatSocial = () => {
  const [socials, setSocials] = useState({
    calendar_url: null,
    messenger_url: null,
    skype_url: null,
    telegram_url: null,
    viber_url: null,
    whatsapp_url: null,
  });

  useEffect(() => {
    const handleSocialsGet = async () => {
      const { appearance } = await settingsApi.getMiniChatAppearance();
      setSocials({
        calendar_url: appearance.calendar_url,
        messenger_url: appearance.messenger_url,
        skype_url: appearance.skype_url,
        telegram_url: appearance.telegram_url,
        viber_url: appearance.viber_url,
        whatsapp_url: appearance.whatsapp_url,
      });
    }

    handleSocialsGet();
  }, []);

  const handleUpdateSocial = useCallback(async (socialName) => {
    await settingsApi.updateMiniChatAppearance({ [socialName]: socials[socialName] });
    toast("Mini chat social URL successfully updated");
  }, [socials]);

  return { socials, setSocials, handleUpdateSocial };
}