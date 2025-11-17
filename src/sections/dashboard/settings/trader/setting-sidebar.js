import { Fragment } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

import { SettingLabel } from "./setting-label";
import { SelectMenu } from "src/components/customize/select-menu";
import { Iconify } from "src/components/iconify";

export const SettingSidebar = (props) => {
  const {
    container,
    onClose,
    control,
    currentMenu,
    setCurrentMenu,
    brands,
    open,
    ...other
  } = props;

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const sideMenuList = [
    { label: "Account type", value: "account_type" },
    { label: "Settings", value: "settings" },
    { label: "Tickers", value: "tickers" },
    { label: "Spreads", value: "spreads" },
    { label: "Branding", value: "branding" },
    { label: "Wallets", value: "wallets" },
    { label: "Deposit Option", value: "deposit_option" },
    { label: "Bank Deposit", value: "bank_deposit" },
    { label: "WD Form", value: "wd_form" },
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
        <SelectMenu
          label="Internal Brand"
          control={control}
          name="internal_brand_id"
          list={brands}
        />
        <Stack direction="column" mt={2} gap={1}>
          {sideMenuList.map((item) => (
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
