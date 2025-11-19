import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

import { SettingLabel } from "./setting-label";
import { Iconify } from "src/components/iconify";
import { useAuth } from "src/hooks/use-auth";

export const SettingsSidebar = (props) => {
  const { container, onClose, currentMenu, setCurrentMenu, open, ...other } =
    props;

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { company } = useAuth();

  const sideMenuList = [
    { label: "Brand Name & Identity", value: "BrandNameIdentity" },
    {
      label: "Appearance",
      value: "Appearance",
      children: [
        { label: "Theme Selector", value: "ThemeSelector" },
        { label: "Color Scheme", value: "ColorScheme" },
        { label: "Login / Signup BC Image", value: "LoginSignupBCImage" },
      ],
    },
    { label: "Categories", value: "Categories" },
    { label: "Menus", value: "Menus" },
  ];

  const content = (
    <div>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        sx={{
          pt: 1,
          px: 2,
        }}
      >
        <Stack direction="row" width={1} justifyContent="end">
          {!mdUp && (
            <IconButton onClick={onClose}>
              <Iconify icon="iconamoon:close" width={24} />
            </IconButton>
          )}
        </Stack>
      </Stack>
      <Box
        sx={{
          pb: 2,
          px: 2,
        }}
      >
        <Stack direction="column" gap={1}>
          {sideMenuList.map((item) => (
            <List disablePadding key={item?.value}>
              <SettingLabel
                menu={item}
                active={currentMenu === item?.value}
                onClick={() => setCurrentMenu(item?.value)}
              />
            </List>
          ))}
        </Stack>
      </Box>
    </div>
  );

  if (mdUp) {
    return (
      <Drawer
        anchor="left"
        open={open}
        sx={{pt:2}}
        PaperProps={{
          sx: {
            position: "relative",
            width: 280,
            zIndex: 1100,
            backgroundColor: "#0E1320",
          },
        }}
        SlideProps={{ container }}
        variant="persistent"
        {...other}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      sx={{
        pt:2
      }}
      //   hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: "none",
          position: "absolute",
          zIndex: 1100,
        },
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "100%",
          width: 280,
          pointerEvents: "auto",
          position: "absolute",
        },
      }}
      SlideProps={{ container }}
      variant="temporary"
      {...other}
    >
      {content}
    </Drawer>
  );
};
