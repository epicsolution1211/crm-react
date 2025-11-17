import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import toast from 'react-hot-toast';
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import { DebouncedColorPicker } from "src/components/debounced-color-picker";
import { brandsApi } from "src/api/lead-management/brand";
import { getAPIUrl } from "src/config";
import { useInternalBrands } from "src/sections/dashboard/settings/dashboard-setting";
import { Iconify } from 'src/components/iconify';

export const Branding = ({ brandId }) => {
  const [logo, setLogo] = useState({
    whiteLogo: null,
    darkLogo: null
  });
  const [favIcon, setFavIcon] = useState();

  const [themeColor, setThemeColor] = useState(null);
  const [defaultDark, setDefaultDark] = useState(false);

  const { internalBrandsInfo: brandsInfo, getBrands } =
    useInternalBrands();

  const getLogoData = async () => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);

      setLogo({
        darkLogo: brand?.trader_dark_logo,
        whiteLogo: brand?.trader_white_logo,
      })
      setFavIcon(brand?.trader_favicon);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const handleChangeLogo = async (event, isWhite, newLogo) => {
    try {
      const formData = new FormData();
      formData.append(isWhite ? 'trader_white_logo' : 'trader_dark_logo', event.target.files[0]);
      formData.append("internal_brand_id", brandId);

      const res = await brandsApi.updateInternalBrand(brandId, formData);
      setLogo({
        darkLogo: res?.internal_brand?.trader_dark_logo,
        whiteLogo: res?.internal_brand?.trader_light_logo,
      })
      event.target.value = null;
      newLogo ? toast(isWhite ? `Trader white logo successfully added.` : `Trader dark logo successfully added.`) :
        toast(isWhite ? `Trader white logo successfully updated.` : `Trader dark logo successfully updated.`);
      setTimeout(() => {
        getBrands();
      }, 500)
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const handleChangeFavIcon = async (event) => {
    try {
      const formData = new FormData();
      formData.append('trader_favicon', event.target.files[0]);
      formData.append("internal_brand_id", brandId);

      const res = await brandsApi.updateInternalBrand(brandId, formData);
      setFavIcon(res?.internal_brand?.trader_favicon);
      event.target.value = null;
      toast.success("Trader fav icon successfully uploaded");
      setTimeout(() => {
        getBrands();
      }, 1000)
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    getLogoData();
  }, [brandId, brandsInfo]);

  useEffect(() => {
    const brand = brandsInfo?.find((b) => b?.id === brandId);

    if (brand) {
      setThemeColor(brand?.theme_color);
      setDefaultDark(brand?.theme_dark ?? false);
    }
  }, [brandId, brandsInfo]);

  const handleDefaultDarkChange = async () => {
    try {
      await brandsApi.updateInternalBrand(brandId, { theme_dark: !defaultDark });
      setDefaultDark(!defaultDark);
      toast.success("Theme dark successfully changed!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  }

  const handleThemeColorChange = async (color) => {
    try {
      await brandsApi.updateInternalBrand(brandId, { theme_color: color });
      setThemeColor(color);
      toast.success("Theme color successfully changed!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  }

  const handleClearLogo = async (type = "dark") => {
    try {
      if (type === "dark") {
        await brandsApi.updateInternalBrand(brandId, { delete_trader_dark_logo: true });
        setLogo(prev => ({ ...prev, darkLogo: null }));
        toast.success("Trader dark logo successfully removed");
      } else {
        await brandsApi.updateInternalBrand(brandId, { delete_trader_white_logo: true });
        setLogo(prev => ({ ...prev, whiteLogo: null }));
        toast.success("Trader white logo successfully removed");
      }
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <Stack
      sx={{
        height: '100%',
        p: 3,
        width: '100%',
      }}
    >
      <Stack sx={{ gap: 1, mb: 4 }}>
        <Typography
          variant='h4'
          sx={{ color: 'text.primary', fontWeight: 'bold' }}
        >
          Branding
        </Typography>
        <Typography
          variant='body1'
          sx={{ color: 'text.secondary' }}
        >
          Customize look of your trading platform
        </Typography>
      </Stack>

      <Stack 
        direction="row" 
        spacing={3} 
        sx={{ 
          flexGrow: 1,
          width: '100%'
        }}
      >
        <Stack spacing={3} sx={{ flex: 2 }}>
          <Stack
            sx={{
              p: 2.5,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant='subtitle1'
              sx={{ color: 'text.primary', mb: 2 }}
            >
              Light Theme Logo
            </Typography>
            
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                component="label"
                size="small"
              >
                {logo?.whiteLogo ? "Update" : "Add"}
                <input
                  id="btn-upload1"
                  onChange={(event) => { logo?.whiteLogo ? handleChangeLogo(event, true) : handleChangeLogo(event, true, true) }}
                  type="file"
                  hidden
                />
              </Button>

              {logo?.whiteLogo && (
                <>
                  <Box
                    sx={{
                      width: 100,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={logo?.whiteLogo ? logo?.whiteLogo?.includes('http') ? logo?.whiteLogo : `${getAPIUrl()}/${logo?.whiteLogo}` : ""}
                      alt="Light logo"
                      loading="lazy"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: "contain" }}
                    />
                  </Box>
                  <IconButton 
                    size="small"
                    onClick={() => handleClearLogo("white")}
                    sx={{ 
                      color: 'error.main',
                      '&:hover': { bgcolor: 'error.lighter' }
                    }}
                  >
                    <Iconify icon="heroicons:trash" width={20} />
                  </IconButton>
                </>
              )}
            </Stack>
          </Stack>

          <Stack
            sx={{
              p: 2.5,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant='subtitle1'
              sx={{ color: 'text.primary', mb: 2 }}
            >
              Dark Theme Logo
            </Typography>
            
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                component="label"
                size="small"
              >
                {logo?.darkLogo ? "Update" : "Add"}
                <input
                  id="btn-upload2"
                  type="file"
                  onChange={(event) => { logo?.darkLogo ? handleChangeLogo(event, false) : handleChangeLogo(event, false, true) }}
                  hidden
                />
              </Button>

              {logo?.darkLogo && (
                <>
                  <Box
                    sx={{
                      width: 100,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={logo?.darkLogo ? logo?.darkLogo?.includes('http') ? logo?.darkLogo : `${getAPIUrl()}/${logo?.darkLogo}` : ""}
                      alt="Dark logo"
                      loading="lazy"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: "contain" }}
                    />
                  </Box>
                  <IconButton 
                    size="small"
                    onClick={() => handleClearLogo("dark")}
                    sx={{ 
                      color: 'error.main',
                      '&:hover': { bgcolor: 'error.lighter' }
                    }}
                  >
                    <Iconify icon="heroicons:trash" width={20} />
                  </IconButton>
                </>
              )}
            </Stack>
          </Stack>

          <Stack
            sx={{
              p: 2.5,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant='subtitle1'
              sx={{ color: 'text.primary', mb: 2 }}
            >
              Fav Icon
            </Typography>
            
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                component="label"
                size="small"
              >
                {favIcon ? "Update" : "Add"}
                <input
                  id="btn-upload3"
                  onChange={(event) => handleChangeFavIcon(event)}
                  type="file"
                  hidden
                />
              </Button>

              {favIcon && (
                <>
                  <Box
                    sx={{
                      width: 100,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={favIcon ? favIcon?.includes('http') ? favIcon : `${getAPIUrl()}/${favIcon}` : ""}
                      alt="Fav Icon"
                      loading="lazy"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: "contain" }}
                    />
                  </Box>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={3} sx={{ flex: 1 }}>
          <Stack
            sx={{
              p: 2.5,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
              height: 'fit-content'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 3 }}>Theme Settings</Typography>
            
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2">Default Dark Theme</Typography>
                <Switch 
                  checked={defaultDark} 
                  onChange={handleDefaultDarkChange}
                  size="small"
                />
              </Stack>

              <Stack spacing={2}>
                <Typography variant="body2">Theme Color</Typography>
                <DebouncedColorPicker 
                  color={themeColor} 
                  onChange={handleThemeColorChange}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
