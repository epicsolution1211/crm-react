import { useCallback, useRef } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system/colorManipulator";

import { DebouncedColorPicker } from "../../debounced-color-picker";
import { Iconify } from 'src/components/iconify';
import { getAPIUrl } from "src/config";

export const SettingsMiniChatStyle = (props) => {
  const {
    sidePadding,
    bottomPadding,
    setSidePadding,
    setBottomPadding,
    position,
    backgroundColor,
    actionColor,
    launcherColor,
    logo,
    launcherLogo,
    backgroundImage,
    backgroundEnabled,
    soundsEnabled,
    lineCountEnabled,
    handleBackgroundEnabledChange,
    handleSoundsEnabledChange,
    handleLineCountEnabledChange,
    handleChangeBackgroundImage,
    handleChangeLogo,
    handleChangeLauncherLogo,
    handleChangeActionColor,
    handleChangeBackgroundColor,
    handleChangeLauncherColor,
    handlePositionChange,
    handleSidePaddingChange,
    handleBottomPaddingChange,
  } = props;

  const backgroundRef = useRef(null);
  const logoRef = useRef(null);
  const launcherRef = useRef(null);

  const handleBackgroundAttach = useCallback(() => {
    backgroundRef?.current?.click();
  }, []);

  const handleLogoAttach = useCallback(() => {
    logoRef?.current?.click();
  }, []);

  const handleLauncherAttach = useCallback(() => {
    launcherRef?.current?.click();
  }, []);

  const handleChangeSidePaddingValue = useCallback((e) => {
    setSidePadding(e.target.value);
  }, [setSidePadding]);

  const handleChangeBottomPaddingValue = useCallback((e) => {
    setBottomPadding(e.target.value);
  }, [setBottomPadding]);

  return (
    <Stack spacing={3}>
      <Stack
        spacing={4}
        sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography variant="h6">Set your Mini Chat look and style</Typography>
          <Typography variant="h7">Choose color and image for your mini chat</Typography>
        </Stack>
        <Stack
          spacing={3}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Stack spacing={1}>
            <Typography
              gutterBottom
              variant="subtitle1"
            >
              Background image
            </Typography>
          </Stack>
          <Switch
            checked={backgroundEnabled}
            color="primary"
            edge="start"
            name="background_enabled"
            onChange={handleBackgroundEnabledChange}
            value={backgroundEnabled}
          />
        </Stack>

        <Stack spacing={2}>
          {/* Background image uplaod */}
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Box
              sx={{
                borderColor: 'neutral.300',
                borderRadius: '50%',
                borderStyle: 'dashed',
                borderWidth: 1,
                p: '4px'
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  height: '100%',
                  width: '100%',
                  position: 'relative'
                }}
              >
                <Box
                  onClick={handleBackgroundAttach}
                  sx={{
                    alignItems: 'center',
                    backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                    borderRadius: '50%',
                    color: 'common.white',
                    cursor: 'pointer',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    left: 0,
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    zIndex: 1,
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
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
                  src={backgroundImage ? backgroundImage?.includes('http') ? backgroundImage : `${getAPIUrl()}/${backgroundImage}` : ""}
                  sx={{
                    height: 100,
                    width: 100
                  }}
                >
                  <Iconify icon="mage:file-2" width={24} />
                </Avatar>
              </Box>

              <input
                hidden
                ref={backgroundRef}
                onChange={handleChangeBackgroundImage}
                type="file"
              />
            </Box>
            <Typography variant="h6">Change background image</Typography>
          </Stack>

          {/* Logo upload */}
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Box
              sx={{
                borderColor: 'neutral.300',
                borderRadius: '50%',
                borderStyle: 'dashed',
                borderWidth: 1,
                p: '4px'
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  height: '100%',
                  width: '100%',
                  position: 'relative'
                }}
              >
                <Box
                  onClick={handleLogoAttach}
                  sx={{
                    alignItems: 'center',
                    backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                    borderRadius: '50%',
                    color: 'common.white',
                    cursor: 'pointer',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    left: 0,
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    zIndex: 1,
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
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
                  src={logo ? logo?.includes('http') ? logo : `${getAPIUrl()}/${logo}` : ""}
                  sx={{
                    height: 100,
                    width: 100
                  }}
                >
                  <Iconify icon="mage:file-2" width={24} />
                </Avatar>
              </Box>

              <input
                hidden
                ref={logoRef}
                type="file"
                onChange={handleChangeLogo}
              />
            </Box>
            <Typography variant="h6">Change logo</Typography>
          </Stack>

          {/* Launcher button upload */}
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Box
              sx={{
                borderColor: 'neutral.300',
                borderRadius: '50%',
                borderStyle: 'dashed',
                borderWidth: 1,
                p: '4px'
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  height: '100%',
                  width: '100%',
                  position: 'relative'
                }}
              >
                <Box
                  onClick={handleLauncherAttach}
                  sx={{
                    alignItems: 'center',
                    backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                    borderRadius: '50%',
                    color: 'common.white',
                    cursor: 'pointer',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    left: 0,
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    zIndex: 1,
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
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
                  src={launcherLogo ? launcherLogo?.includes('http') ? launcherLogo : `${getAPIUrl()}/${launcherLogo}` : ""}
                  sx={{
                    height: 100,
                    width: 100
                  }}
                >
                  <Iconify icon="mage:file-2" width={24} />
                </Avatar>
              </Box>

              <input
                hidden
                ref={launcherRef}
                type="file"
                onChange={handleChangeLauncherLogo}
              />
            </Box>
            <Typography variant="h6">Change launcher button</Typography>
          </Stack>

          <Stack spacing={6} direction="row" alignItems="center">
            <Stack spacing={2} alignItems="center">
              {<DebouncedColorPicker color={backgroundColor} onChange={handleChangeBackgroundColor} />}
              <Typography variant="h6">Background color</Typography>
            </Stack>

            <Stack spacing={2} alignItems="center">
              {<DebouncedColorPicker color={actionColor} onChange={handleChangeActionColor} />}
              <Typography variant="h6">Action color</Typography>
            </Stack>

            <Stack spacing={2} alignItems="center">
              {<DebouncedColorPicker color={launcherColor} onChange={handleChangeLauncherColor} />}
              <Typography variant="h6">Launcher color</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="h6">Launcher position</Typography>
          <Typography variant="h7">Adjust your launcher's positioning on computer and tablets :</Typography>
        </Stack>
        <Stack
          spacing={3}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >

          <Select value={position} sx={{ width: 300 }} onChange={handlePositionChange}>
            <MenuItem value="1">Right</MenuItem>
            <MenuItem value="2">Left</MenuItem>
          </Select>
        </Stack>

        <Stack
          spacing={3}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Stack spacing={3}>
            <Stack spacing={2}>
              <Typography variant="h6">Side spacing:</Typography>
              <Stack spacing={2} direction="row" alignItems="center">
                <TextField
                  label="Side spacing (px)"
                  sx={{ width: 300 }}
                  value={sidePadding}
                  onChange={handleChangeSidePaddingValue}
                />
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleSidePaddingChange}
                >
                  Save
                </Button>
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <Typography variant="h6">Bottom spacing:</Typography>
              <Stack spacing={2} direction="row" alignItems="center">
                <TextField
                  label="Bottom spacing (px)"
                  sx={{ width: 300 }}
                  value={bottomPadding}
                  onChange={handleChangeBottomPaddingValue}
                />
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleBottomPaddingChange}
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* Sounds */}
        <Typography variant="h6">Sounds</Typography>
        <Stack
          spacing={3}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Stack spacing={1}>
            <Typography
              gutterBottom
              variant="subtitle1"
            >
              Play a sound for incoming messages
            </Typography>
          </Stack>
          <Switch
            checked={soundsEnabled}
            color="primary"
            edge="start"
            name="sound_enabled"
            onChange={handleSoundsEnabledChange}
            value={soundsEnabled}
          />
        </Stack>

        {/* Line count */}
        <Typography variant="h6">Line count</Typography>
        <Stack
          spacing={3}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Stack spacing={1}>
            <Typography
              gutterBottom
              variant="subtitle1"
            >
              Enable line count to let client know his position in the queue
            </Typography>
          </Stack>
          <Switch
            checked={lineCountEnabled}
            color="primary"
            edge="start"
            name="sound_enabled"
            onChange={handleLineCountEnabledChange}
            value={lineCountEnabled}
          />
        </Stack>
      </Stack>
    </Stack>
  )
};

SettingsMiniChatStyle.propTypes = {
  backgroundImage: PropTypes.string,
  backgroundEnabled: PropTypes.bool,
  soundsEnabled: PropTypes.bool,
  lineCountEnabled: PropTypes.bool,
  handleBackgroundEnabledChange: PropTypes.func,
  handleSoundsEnabledChange: PropTypes.func,
  handleLineCountEnabledChange: PropTypes.func,
  handleChangeBackgroundImage: PropTypes.func,
}
