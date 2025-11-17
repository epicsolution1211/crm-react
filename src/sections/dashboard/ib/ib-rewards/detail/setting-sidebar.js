import { Fragment } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { SettingLabel } from "./setting-label";
import { Iconify } from "src/components/iconify";

export const SettingSidebar = (props) => {
  const {
    container,
    onClose,
    currentMenu,
    setCurrentMenu,
    brand,
    open,
    ...other
  } = props;

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const sideMenuList = [
    { label: "Setting", value: "setting" },
    { label: "Account Type", value: "account_type" },
    { label: "Assets", value: "assets" },
  ];

  const content = (
    <div>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        sx={{
          pt: 2,
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
          pt: 2,
        }}
      >
        <Typography variant="h6" px={1}>Internal Brand : {brand?.company_name}</Typography>
        <Stack direction="column" mt={2} gap={1}>
          {sideMenuList?.map((item) => (
            <Fragment key={item?.value}>
              <List disablePadding>
                <SettingLabel
                  menu={item}
                  active={currentMenu === item?.value}
                  onClick={() => {
                    setCurrentMenu(item?.value);
                    !mdUp && onClose();
                  }}
                />
              </List>
            </Fragment>
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
        PaperProps={{
          sx: {
            position: "relative",
            width: 280,
            zIndex: 1100
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
      hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: "none",
          position: "absolute",
          zIndex: 1100
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
