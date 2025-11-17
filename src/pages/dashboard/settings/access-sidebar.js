import { Fragment } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

import { SettingLabel } from "./setting-label";
import { Iconify } from "src/components/iconify";

export const AccessSidebar = (props) => {
  const {
    container,
    onClose,
    currentMenu,
    setCurrentMenu,
    open,
    ...other
  } = props;

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  // TODO: Add security report back: need to update UI according to response from backend
  const sideMenuList = [
    { label: "Member Info", value: "member_info", icon: <Iconify icon="charm:person" /> },
    { label: "Edit Member Access", value: "member_access", icon: <Iconify icon="mdi:administrator" /> },
    { label: "Update Password", value: "update_password", icon: <Iconify icon="ic:sharp-password" /> },
    { label: "Account IP Address", value: "ip_address", icon: <Iconify icon="mdi:ip-network-outline" /> },
    { label: "Email Setup", value: "email_setup", icon: <Iconify icon="ic:outline-email" /> },
    { label: "2FA", value: "2fa", icon: <Iconify icon="mdi:shield-plus" /> },
    { label: "Assign Desk and Team", value: "desk_team", icon: <Iconify icon="ci:users-group" /> },
    { label: "Data Management", value: "data_management", icon: <Iconify icon="ri:user-settings-line" /> },
    { label: "AI Questions", value: "ai_questions", icon: <Iconify icon="mingcute:ai-fill" /> },
    { label: "Activity Heatmap", value: "activity_heatmap", icon: <Iconify icon="icon-park-outline:sales-report" /> },
    // { label: "Security Report", value: "security_report", icon: <Iconify icon="carbon:document-security" /> },
  ];

  const content = (
    <div>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        sx={{
          pt: 1,
          px: 1,
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
      <Box px={2}>
        <Stack direction="column" gap={1}>
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
          pb: 2,
          borderRadius: 4,
          height: 'auto'
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
