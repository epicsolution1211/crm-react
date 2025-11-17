import { Fragment } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

import { SettingsLabel } from "./settings-label";
import { Iconify } from "src/components/iconify";

export const SettingsSidebar = ({ 
  container, 
  currentTab, 
  setCurrentTab, 
  onClose, 
  open,
  isMobile 
}) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const sideMenuList = [
    { label: "Members", value: "members" },
    { label: "Teams", value: "teams" },
    { label: "Desk", value: "desk" },
    { label: "Access Roles", value: "roles" },
    { label: "Report Groups", value: "report-groups" },
  ];

  const content = (
    <div>
      <Stack
        alignItems="center"
        direction="row"
        spacing={1}
        sx={{
          pt: 1,
          px: 1,
        }}
      >
        <Stack direction="row" width={1} justifyContent="end">
          {!mdUp && (
            <IconButton onClick={onClose} size="small">
              <Iconify icon="iconamoon:close" width={24} />
            </IconButton>
          )}
        </Stack>
      </Stack>
      <Box
        sx={{
          pb: 1,
          px: 1,
          pt: 1,
        }}
      >
        <Stack direction="column" gap={0.5}>
          {sideMenuList.map((item) => (
            <Fragment key={item?.value}>
              <List disablePadding dense>
                <SettingsLabel
                  menu={item}
                  active={currentTab === item?.value}
                  onClick={() => {
                    setCurrentTab(item?.value);
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
            width: open ? 220 : 280,
            zIndex: 1100
          },
        }}
        SlideProps={{ container }}
        variant="persistent"
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
          width: isMobile ? '80%' : 280,
          pointerEvents: "auto",
          position: "absolute",
          '& .MuiListItemButton-root': {
            py: isMobile ? 1.5 : 1,
            px: isMobile ? 2 : 3
          }
        },
      }}
      SlideProps={{ container }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
}; 