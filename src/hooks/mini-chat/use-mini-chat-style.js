import { useCallback, useEffect, useState } from "react";
import { settingsApi } from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatStyle = () => {
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [lineCountEnabled, setLineCountEnabled] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [logo, setLogo] = useState("");
  const [launcherLogo, setLauncherLogo] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [actionColor, setActionColor] = useState("");
  const [launcherColor, setLauncherColor] = useState("");
  const [position, setPosition] = useState(1);
  const [sidePadding, setSidePadding] = useState("");
  const [bottomPadding, setBottomPadding] = useState("");

  useEffect(() => {
    const handleStyleGet = async () => {
      const { appearance } = await settingsApi.getMiniChatAppearance();

      setBackgroundEnabled(appearance?.background_enabled);
      setSoundsEnabled(appearance?.sound);
      setLineCountEnabled(appearance?.inline_count);
      setBackgroundImage(appearance?.header_background);
      setLogo(appearance?.header_logo_url);
      setLauncherLogo(appearance?.btn_background);
      setBackgroundColor(appearance?.background_color);
      setActionColor(appearance?.action_color);
      setLauncherColor(appearance?.launcher_color);
      setPosition(appearance?.position);
      setSidePadding(appearance?.side_padding);
      setBottomPadding(appearance?.bottom_padding);
    }

    handleStyleGet();
  }, []);

  const handleBackgroundEnabledChange = useCallback(async () => {
    setBackgroundEnabled(!backgroundEnabled);
    await settingsApi.updateMiniChatAppearance({ background_enabled: !backgroundEnabled });
    toast("Mini chat background image status updated!");
  }, [backgroundEnabled]);

  const handleSoundsEnabledChange = useCallback(async () => {
    setSoundsEnabled(!soundsEnabled);
    await settingsApi.updateMiniChatAppearance({ sound: !soundsEnabled });
    toast("Mini chat sounds status updated!");
  }, [soundsEnabled]);

  const handleLineCountEnabledChange = useCallback(async () => {
    setLineCountEnabled(!lineCountEnabled);
    await settingsApi.updateMiniChatAppearance({ inline_count: !lineCountEnabled });
    toast("Mini chat line count status updated!");
  }, [lineCountEnabled]);

  const handleChangeBackgroundImage = useCallback(async (event) => {
    const file = event?.target?.files[0];
    const formData = new FormData();
    formData.append("header_background", file);
    const appearance = await settingsApi.updateMiniChatAppearance(formData);
    setBackgroundImage(appearance?.header_background);
    toast("Mini chat background image is updated!");
  }, []);

  const handleChangeLogo = useCallback(async (event) => {
    const file = event?.target?.files[0];
    const formData = new FormData();
    formData.append("header_logo", file);
    const appearance = await settingsApi.updateMiniChatAppearance(formData);
    setLogo(appearance?.header_logo_url);
    toast("Mini chat logo is updated!");
  }, []);

  const handleChangeLauncherLogo = useCallback(async (event) => {
    const file = event?.target?.files[0];
    const formData = new FormData();
    formData.append("btn_background", file);
    const appearance = await settingsApi.updateMiniChatAppearance(formData);
    setLauncherLogo(appearance?.btn_background);
    toast("Mini chat launcher button is updated!");
  }, []);

  const handleChangeBackgroundColor = useCallback(async (color) => {
    await settingsApi.updateMiniChatAppearance({ background_color: color });
    toast("Mini chat background color is updated!");
  }, []);

  const handleChangeActionColor = useCallback(async (color) => {
    await settingsApi.updateMiniChatAppearance({ action_color: color });
    toast("Mini chat action color is updated!");
  }, []);

  const handleChangeLauncherColor = useCallback(async (color) => {
    await settingsApi.updateMiniChatAppearance({ launcher_color: color });
    toast("Mini chat launcher color is updated!");
  }, []);

  const handlePositionChange = useCallback(async (event) => {
    setPosition(event.target.value);
    await settingsApi.updateMiniChatAppearance({ position: event.target.value });
    toast("Mini chat position is updated!");
  }, []);

  const handleSidePaddingChange = useCallback(async () => {
    await settingsApi.updateMiniChatAppearance({ side_padding: sidePadding });
    toast("Mini chat side padding is updated!");
  }, [sidePadding]);

  const handleBottomPaddingChange = useCallback(async () => {
    await settingsApi.updateMiniChatAppearance({ bottom_padding: bottomPadding });
    toast("Mini chat bottom padding is updated!");
  }, [bottomPadding]);

  return {
    sidePadding,
    bottomPadding,
    setBottomPadding,
    setSidePadding,
    position,
    logo,
    launcherLogo,
    backgroundImage,
    backgroundColor,
    actionColor,
    launcherColor,
    backgroundEnabled,
    soundsEnabled,
    lineCountEnabled,
    handleBackgroundEnabledChange,
    handleSoundsEnabledChange,
    handleLineCountEnabledChange,
    handleChangeBackgroundImage,
    handleChangeLogo,
    handleChangeLauncherLogo,
    handleChangeBackgroundColor,
    handleChangeActionColor,
    handleChangeLauncherColor,
    handlePositionChange,
    handleBottomPaddingChange,
    handleSidePaddingChange,
  };
}
