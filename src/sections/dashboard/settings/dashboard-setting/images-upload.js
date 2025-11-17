import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { InfoOutlined } from "@mui/icons-material";
import { alpha } from "@mui/system/colorManipulator";

import { brandsApi } from "src/api/lead-management/brand";
import { Iconify } from "src/components/iconify";
import { getAPIUrl } from "src/config";

export const ImagesUpload = ({ brandId, brandsInfo = [], getBrands = () => { } }) => {
  const lightLogoRef = useRef(null);
  const darkLogoRef = useRef(null);
  const welcomeRef = useRef(null);
  const welcomeGuideRef = useRef(null);
  const welcomeAvatarRef = useRef(null);
  const favIconRef = useRef(null);
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const [lightLogo, setLightLogo] = useState(null);
  const [darkLogo, setDarkLogo] = useState(null);
  const [welcome, setWelcome] = useState(null);
  const [welcomeGuide, setWelcomeGuide] = useState(null);
  const [welcomeAvatar, setWelcomeAvatar] = useState(null);
  const [favIcon, setFavIcon] = useState(null);
  const [welcomeFullScreen, setWelcomeFullScreen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const brand = brandsInfo?.find((b) => b?.id === brandId);

    if (brand) {
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      setWelcomeFullScreen(
        themeSetting?.welcome_full_screen !== undefined
          ? JSON.parse(themeSetting?.welcome_full_screen)
          : false
      );
      setShowLogo(
        themeSetting?.show_logo !== undefined
          ? JSON.parse(themeSetting?.show_logo)
          : true
      );
      setLightLogo(brand?.dashboard_white_logo);
      setDarkLogo(brand?.dashboard_dark_logo);
      setWelcome(brand?.welcome_image);
      setWelcomeGuide(brand?.welcome_guide_image);
      setWelcomeAvatar(brand?.welcome_avatar);
      setFavIcon(brand?.dashboard_favicon);
    }
  }, [brandId]);

  const handleLightLogoAttach = useCallback(() => {
    lightLogoRef?.current?.click();
  }, []);

  const handleChangeLightLogo = useCallback(
    async (event) => {
      event.preventDefault();
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const request = new FormData();
      const file = event?.target?.files[0];
      const imageUrl = file ? URL.createObjectURL(file) : null;
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};

      const theme_setting = JSON.stringify({
        ...themeSetting,
        welcome_full_screen: welcomeFullScreen,
        show_logo: showLogo,
      });
      request.append("theme_setting", theme_setting);
      request.append("dashboard_white_logo", file);
      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Light logo successfully changed!");

      setLightLogo(imageUrl);
    },
    [brandId, brandsInfo, welcomeFullScreen, showLogo]
  );

  const handleDarkLogoAttach = useCallback(() => {
    darkLogoRef?.current?.click();
  }, []);

  const handleChangeDarkLogo = useCallback(
    async (event) => {
      event.preventDefault();
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const request = new FormData();
      const file = event?.target?.files[0];
      const imageUrl = file ? URL.createObjectURL(file) : null;
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      const theme_setting = JSON.stringify({
        ...themeSetting,
        welcome_full_screen: welcomeFullScreen,
        show_logo: showLogo,
      });
      request.append("theme_setting", theme_setting);

      request.append("dashboard_dark_logo", file);
      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Dark logo successfully changed!");

      setDarkLogo(imageUrl);
    },
    [brandId, brandsInfo, welcomeFullScreen, showLogo]
  );

  const handleWelcomeAttach = useCallback(() => {
    welcomeRef?.current?.click();
  }, []);

  const handleChangeWelcome = useCallback(
    async (event) => {
      event.preventDefault();
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const request = new FormData();
      const file = event?.target?.files[0];
      const imageUrl = file ? URL.createObjectURL(file) : null;
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      const theme_setting = JSON.stringify({
        ...themeSetting,
        welcome_full_screen: welcomeFullScreen,
        show_logo: showLogo,
      });
      request.append("theme_setting", theme_setting);
      request.append("welcome_image", file);

      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Welcome image successfully changed!");

      setWelcome(imageUrl);
    },
    [brandId, brandsInfo, welcomeFullScreen, showLogo]
  );

  const handleWelcomeGuideAttach = useCallback(() => {
    welcomeGuideRef?.current?.click();
  }, []);

  const handleChangeWelcomeGuide = useCallback(
    async (event) => {
      event.preventDefault();
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const request = new FormData();
      const file = event?.target?.files[0];
      const imageUrl = file ? URL.createObjectURL(file) : null;
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      const theme_setting = JSON.stringify({
        ...themeSetting,
        welcome_full_screen: welcomeFullScreen,
        show_logo: showLogo,
      });
      request.append("theme_setting", theme_setting);

      request.append("welcome_guide_image", file);
      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Welcome guide image successfully changed!");

      setWelcomeGuide(imageUrl);
    },
    [brandId, brandsInfo, welcomeFullScreen, showLogo]
  );

  const handleWelcomeAvatarAttach = useCallback(() => {
    welcomeAvatarRef?.current?.click();
  }, []);

  const handleChangeWelcomeAvatar = useCallback(
    async (event) => {
      event.preventDefault();
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const request = new FormData();
      const file = event?.target?.files[0];
      const imageUrl = file ? URL.createObjectURL(file) : null;
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      const theme_setting = JSON.stringify({
        ...themeSetting,
        welcome_full_screen: welcomeFullScreen,
        show_logo: showLogo,
      });
      request.append("theme_setting", theme_setting);

      request.append("welcome_avatar", file);
      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Welcome avatar successfully changed!");

      setWelcomeAvatar(imageUrl);
    },
    [brandId, brandsInfo, welcomeFullScreen, showLogo]
  );

  const handleFavIconAttach = useCallback(() => {
    favIconRef?.current?.click();
  }, []);

  const handleChangeFavIcon = useCallback(
    async (event) => {
      event.preventDefault();
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const request = new FormData();
      const file = event?.target?.files[0];
      const imageUrl = file ? URL.createObjectURL(file) : null;
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};

      const theme_setting = JSON.stringify({
        ...themeSetting,
        welcome_full_screen: welcomeFullScreen,
        show_logo: showLogo,
      });
      request.append("theme_setting", theme_setting);
      request.append("dashboard_favicon", file);
      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Fav icon successfully changed!");

      setFavIcon(imageUrl);
    },
    [brandId, brandsInfo, welcomeFullScreen, showLogo]
  );

  const handleClearLogo = async (type = "dark") => {
    try {
      if (type === "dark") {
        await brandsApi.updateInternalBrand(brandId, {
          delete_dashboard_dark_logo: true,
        });
        setDarkLogo(null);
        toast.success("Dashboard dark logo successfully removed");
      } else if (type === "white") {
        await brandsApi.updateInternalBrand(brandId, {
          delete_dashboard_white_logo: true,
        });
        setLightLogo(null);
        toast.success("Dashboard white logo successfully removed");
      } else if (type === "welcome_image") {
        await brandsApi.updateInternalBrand(brandId, {
          delete_welcome_image: true,
        });
        setWelcome(null);
        toast.success("Dashboard welcome image successfully removed");
      } else if (type === "welcome_avatar") {
        await brandsApi.updateInternalBrand(brandId, {
          delete_welcome_avatar: true,
        });
        setWelcomeAvatar(null);
        toast.success("Dashboard welcome avatar successfully removed");
      } else if (type === "welcome_guide_image") {
        await brandsApi.updateInternalBrand(brandId, {
          delete_welcome_guide_image: true,
        });
        setWelcomeGuide(null);
        toast.success("Dashboard welcome guide image successfully removed");
      } else if (type === "fav_icon") {
        await brandsApi.updateInternalBrand(brandId, {
          dashboard_favicon: true,
        });
        setFavIcon(null);
        toast.success("Fav icon successfully removed");
      }
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChangeFullScreen = async (e) => {
    const checked = e?.target?.checked;
    const brand = brandsInfo?.find((b) => b?.id === brandId);
    const themeSetting = brand?.theme_setting
      ? JSON.parse(brand?.theme_setting)
      : {};

    const request = {
      theme_setting: JSON.stringify({
        ...themeSetting,
        show_logo: showLogo,
        welcome_full_screen: checked,
      }),
    };

    await brandsApi.updateInternalBrand(brandId, request);
    setWelcomeFullScreen(checked);
    setTimeout(() => {
      getBrands();
    }, 1000);
    toast.success("Welcome Image Full Screen successfully changed");
  }

  const handleChangeShowLogo = async (e) => {
    const checked = e?.target?.checked;
    const brand = brandsInfo?.find((b) => b?.id === brandId);
    const themeSetting = brand?.theme_setting
      ? JSON.parse(brand?.theme_setting)
      : {};

    const request = {
      theme_setting: JSON.stringify({
        ...themeSetting,
        show_logo: checked,
        welcome_full_screen: welcomeFullScreen,
      }),
    };

    await brandsApi.updateInternalBrand(brandId, request);
    setShowLogo(checked);
    setTimeout(() => {
      getBrands();
    }, 1000);
    toast.success("Show logo successfully changed");
  }

  return (
    <Grid container direction={mdUp ? "row" : "column"} spacing={4} mt={8}>
      <Grid xs={12}>
        <Typography variant="h5">Images</Typography>
      </Grid>
      <Grid xs={12} md={6}>
        <Stack direction="column" gap={1} pt={2}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="subtitle1" px={1}>
              Make Welcome Image Full Screen
            </Typography>
          </Stack>
          <Switch
            checked={welcomeFullScreen}
            value={welcomeFullScreen}
            onChange={handleChangeFullScreen}
          />
        </Stack>
      </Grid>
      <Grid xs={12} md={6}>
        <Stack direction="column" gap={1} pt={2}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="subtitle1" px={1}>
              Show Logo
            </Typography>
          </Stack>
          <Switch
            checked={showLogo}
            value={showLogo}
            onChange={handleChangeShowLogo}
          />
        </Stack>
      </Grid>
      <Grid xs={3} md={3} ml={mdUp ? 0 : 15}>
        <Stack alignItems="center" spacing={2}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="h6" px={1}>
              Light Logo
            </Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  {
                    "This logo is showing for users if they are enabled light theme"
                  }
                </Typography>
              }
            >
              <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
            </Tooltip>
          </Stack>
          <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing={2}
          >
            <Box
              sx={{
                borderColor: "neutral.300",
                borderRadius: "50%",
                borderStyle: "dashed",
                borderWidth: 1,
                p: "4px",
              }}
            >
              <Box
                sx={{
                  borderRadius: "50%",
                  height: "100%",
                  width: "100%",
                  position: "relative",
                }}
              >
                <Box
                  onClick={handleLightLogoAttach}
                  sx={{
                    alignItems: "center",
                    backgroundColor: (theme) =>
                      alpha(theme.palette.neutral[700], 0.5),
                    borderRadius: "50%",
                    color: "common.white",
                    cursor: "pointer",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    zIndex: 1,
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Iconify icon="famicons:camera-outline" width={24} />
                    <Typography
                      color="inherit"
                      variant="subtitle2"
                      sx={{ fontWeight: 700 }}
                    >
                      Select
                    </Typography>
                  </Stack>
                </Box>
                <Avatar
                  src={
                    lightLogo
                      ? lightLogo?.includes("http")
                        ? lightLogo
                        : `${getAPIUrl()}/${lightLogo}`
                      : ""
                  }
                  sx={{
                    height: 100,
                    width: 100,
                  }}
                >
                  <Iconify icon="mage:file-2" width={24} />
                </Avatar>
              </Box>

              <input
                hidden
                ref={lightLogoRef}
                type="file"
                onChange={handleChangeLightLogo}
              />
            </Box>
          </Stack>
          {!!lightLogo && (
            <IconButton
              onClick={() => handleClearLogo("white")}
              sx={{ color: "error.main", backgroundColor: "error.alpha4" }}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          )}
        </Stack>
      </Grid>
      <Grid xs={3} md={3} ml={mdUp ? 0 : 15}>
        <Stack alignItems="center" spacing={2}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="h6" px={1}>
              Dark Logo
            </Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  {
                    "This logo is showing for users if they are enabled dark theme"
                  }
                </Typography>
              }
            >
              <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
            </Tooltip>
          </Stack>
          <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing={2}
          >
            <Box
              sx={{
                borderColor: "neutral.300",
                borderRadius: "50%",
                borderStyle: "dashed",
                borderWidth: 1,
                p: "4px",
              }}
            >
              <Box
                sx={{
                  borderRadius: "50%",
                  height: "100%",
                  width: "100%",
                  position: "relative",
                }}
              >
                <Box
                  onClick={handleDarkLogoAttach}
                  sx={{
                    alignItems: "center",
                    backgroundColor: (theme) =>
                      alpha(theme.palette.neutral[700], 0.5),
                    borderRadius: "50%",
                    color: "common.white",
                    cursor: "pointer",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    zIndex: 1,
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Iconify icon="famicons:camera-outline" width={24} />
                    <Typography
                      color="inherit"
                      variant="subtitle2"
                      sx={{ fontWeight: 700 }}
                    >
                      Select
                    </Typography>
                  </Stack>
                </Box>
                <Avatar
                  src={
                    darkLogo
                      ? darkLogo?.includes("http")
                        ? darkLogo
                        : `${getAPIUrl()}/${darkLogo}`
                      : ""
                  }
                  sx={{
                    height: 100,
                    width: 100,
                  }}
                >
                  <Iconify icon="mage:file-2" width={24} />
                </Avatar>
              </Box>

              <input
                hidden
                ref={darkLogoRef}
                type="file"
                onChange={handleChangeDarkLogo}
              />
            </Box>
          </Stack>
          {!!darkLogo && (
            <IconButton
              onClick={() => handleClearLogo("dark")}
              sx={{ color: "error.main", backgroundColor: "error.alpha4" }}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          )}
        </Stack>
      </Grid>
      <Grid xs={3} md={3} ml={mdUp ? 0 : 15}>
        <Stack alignItems="center" spacing={2}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="h6" px={1}>
              Welcome Image
            </Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  {
                    "This image is showing for users on the sign-in page at the center of the screen"
                  }
                </Typography>
              }
            >
              <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={3} sx={{ mt: 5 }}>
            <Stack
              alignItems="center"
              justifyContent="center"
              direction="row"
              spacing={2}
            >
              <Box
                sx={{
                  borderColor: "neutral.300",
                  borderRadius: "50%",
                  borderStyle: "dashed",
                  borderWidth: 1,
                  p: "4px",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "50%",
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <Box
                    onClick={handleWelcomeAttach}
                    sx={{
                      alignItems: "center",
                      backgroundColor: (theme) =>
                        alpha(theme.palette.neutral[700], 0.5),
                      borderRadius: "50%",
                      color: "common.white",
                      cursor: "pointer",
                      display: "flex",
                      height: "100%",
                      justifyContent: "center",
                      left: 0,
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      width: "100%",
                      zIndex: 1,
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Iconify icon="famicons:camera-outline" width={24} />
                      <Typography
                        color="inherit"
                        variant="subtitle2"
                        sx={{ fontWeight: 700 }}
                      >
                        Select
                      </Typography>
                    </Stack>
                  </Box>
                  <Avatar
                    src={
                      welcome
                        ? welcome?.includes("http")
                          ? welcome
                          : `${getAPIUrl()}/${welcome}`
                        : ""
                    }
                    sx={{
                      height: 100,
                      width: 100,
                    }}
                  >
                    <Iconify icon="mage:file-2" width={24} />
                  </Avatar>
                </Box>

                <input
                  hidden
                  ref={welcomeRef}
                  type="file"
                  onChange={handleChangeWelcome}
                />
              </Box>
            </Stack>
          </Stack>
          {!!welcome && (
            <IconButton
              onClick={() => handleClearLogo("welcome_image")}
              sx={{ color: "error.main", backgroundColor: "error.alpha4" }}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          )}
        </Stack>
      </Grid>
      <Grid xs={3} md={3} ml={mdUp ? 0 : 15}>
        <Stack alignItems="center" spacing={2}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="h6" px={1}>
              Welcome Avatar
            </Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  {
                    "This image is a background image of the welcome card(first one) on the main dashboard screen"
                  }
                </Typography>
              }
            >
              <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={3} sx={{ mt: 5 }}>
            <Stack
              alignItems="center"
              justifyContent="center"
              direction="row"
              spacing={2}
            >
              <Box
                sx={{
                  borderColor: "neutral.300",
                  borderRadius: "50%",
                  borderStyle: "dashed",
                  borderWidth: 1,
                  p: "4px",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "50%",
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <Box
                    onClick={handleWelcomeAvatarAttach}
                    sx={{
                      alignItems: "center",
                      backgroundColor: (theme) =>
                        alpha(theme.palette.neutral[700], 0.5),
                      borderRadius: "50%",
                      color: "common.white",
                      cursor: "pointer",
                      display: "flex",
                      height: "100%",
                      justifyContent: "center",
                      left: 0,
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      width: "100%",
                      zIndex: 1,
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Iconify icon="famicons:camera-outline" width={24} />
                      <Typography
                        color="inherit"
                        variant="subtitle2"
                        sx={{ fontWeight: 700 }}
                      >
                        Select
                      </Typography>
                    </Stack>
                  </Box>
                  <Avatar
                    src={
                      welcomeAvatar
                        ? welcomeAvatar?.includes("http")
                          ? welcomeAvatar
                          : `${getAPIUrl()}/${welcomeAvatar}`
                        : ""
                    }
                    sx={{
                      height: 100,
                      width: 100,
                    }}
                  >
                    <Iconify icon="mage:file-2" width={24} />
                  </Avatar>
                </Box>

                <input
                  hidden
                  ref={welcomeAvatarRef}
                  type="file"
                  onChange={handleChangeWelcomeAvatar}
                />
              </Box>
            </Stack>
          </Stack>
          {!!welcomeAvatar && (
            <IconButton
              onClick={() => handleClearLogo("welcome_avatar")}
              sx={{ color: "error.main", backgroundColor: "error.alpha4" }}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          )}
        </Stack>
      </Grid>
      <Grid xs={3} md={3} ml={mdUp ? 0 : 15}>
        <Stack alignItems="center" spacing={2}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="h6" px={1}>
              Post Guide
            </Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  {
                    "This image is an avatar of account of the example post in posts card on the main dashboard screen"
                  }
                </Typography>
              }
            >
              <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={3} sx={{ mt: 5 }}>
            <Stack
              alignItems="center"
              justifyContent="center"
              direction="row"
              spacing={2}
            >
              <Box
                sx={{
                  borderColor: "neutral.300",
                  borderRadius: "50%",
                  borderStyle: "dashed",
                  borderWidth: 1,
                  p: "4px",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "50%",
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <Box
                    onClick={handleWelcomeGuideAttach}
                    sx={{
                      alignItems: "center",
                      backgroundColor: (theme) =>
                        alpha(theme.palette.neutral[700], 0.5),
                      borderRadius: "50%",
                      color: "common.white",
                      cursor: "pointer",
                      display: "flex",
                      height: "100%",
                      justifyContent: "center",
                      left: 0,
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      width: "100%",
                      zIndex: 1,
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Iconify icon="famicons:camera-outline" width={24} />
                      <Typography
                        color="inherit"
                        variant="subtitle2"
                        sx={{ fontWeight: 700 }}
                      >
                        Select
                      </Typography>
                    </Stack>
                  </Box>
                  <Avatar
                    src={
                      welcomeGuide
                        ? welcomeGuide?.includes("http")
                          ? welcomeGuide
                          : `${getAPIUrl()}/${welcomeGuide}`
                        : ""
                    }
                    sx={{
                      height: 100,
                      width: 100,
                    }}
                  >
                    <Iconify icon="mage:file-2" width={24} />
                  </Avatar>
                </Box>

                <input
                  hidden
                  ref={welcomeGuideRef}
                  type="file"
                  onChange={handleChangeWelcomeGuide}
                />
              </Box>
            </Stack>
          </Stack>
          {!!welcomeGuide && (
            <IconButton
              onClick={() => handleClearLogo("welcome_guide_image")}
              sx={{ color: "error.main", backgroundColor: "error.alpha4" }}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          )}
        </Stack>
      </Grid>
      <Grid xs={3} md={3} ml={mdUp ? 0 : 15}>
        <Stack alignItems="center" spacing={2}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="h6" px={1}>
              Fav Icon
            </Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  {
                    "This icon is showing for users in the browser tab"
                  }
                </Typography>
              }
            >
              <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
            </Tooltip>
          </Stack>
          <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing={2}
          >
            <Box
              sx={{
                borderColor: "neutral.300",
                borderRadius: "50%",
                borderStyle: "dashed",
                borderWidth: 1,
                p: "4px",
              }}
            >
              <Box
                sx={{
                  borderRadius: "50%",
                  height: "100%",
                  width: "100%",
                  position: "relative",
                }}
              >
                <Box
                  onClick={handleFavIconAttach}
                  sx={{
                    alignItems: "center",
                    backgroundColor: (theme) =>
                      alpha(theme.palette.neutral[700], 0.5),
                    borderRadius: "50%",
                    color: "common.white",
                    cursor: "pointer",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    zIndex: 1,
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Iconify icon="famicons:camera-outline" width={24} />
                    <Typography
                      color="inherit"
                      variant="subtitle2"
                      sx={{ fontWeight: 700 }}
                    >
                      Select
                    </Typography>
                  </Stack>
                </Box>
                <Avatar
                  src={
                    favIcon
                      ? favIcon?.includes("http")
                        ? favIcon
                        : `${getAPIUrl()}/${favIcon}`
                      : ""
                  }
                  sx={{
                    height: 100,
                    width: 100,
                  }}
                >
                  <Iconify icon="mage:file-2" width={24} />
                </Avatar>
              </Box>

              <input
                hidden
                ref={favIconRef}
                type="file"
                onChange={handleChangeFavIcon}
              />
            </Box>
          </Stack>
          {!!favIcon && (
            <IconButton
              onClick={() => handleClearLogo("fav_icon")}
              sx={{ color: "error.main", backgroundColor: "error.alpha4" }}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};
