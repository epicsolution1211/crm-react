import { Fragment } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Iconify } from "src/components/iconify";
import { SettingLabel } from "./setting-label";
import { useAuth } from "src/hooks/use-auth";

export const LogsSidebar = (props) => {
  const {
    container,
    onClose,
    currentMenu,
    setCurrentMenu,
    open,
    ...other
  } = props;

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { company } = useAuth();

  const sideMenuList = [
    { label: "Client", value: "Client" },
    { label: "Transactions", value: "TTransaction" },
    { label: "Positions", value: "Position" },
    { label: "Comments", value: "ClientComment" },
    { label: "Calls", value: "Calls" },
    ...(company?.company_type === 2 ? [{ label: "Bets", value: "Bet" }] : []),
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
            <Fragment key={item?.value}>
              <List disablePadding>
                <SettingLabel
                  menu={item}
                  active={currentMenu === item?.value}
                  onClick={() => setCurrentMenu(item?.value)}
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
