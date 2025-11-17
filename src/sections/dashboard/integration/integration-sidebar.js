import { Fragment } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

import { IntegrationLabel } from "./integration-label";
import { Iconify } from "src/components/iconify";
import { useAuth } from '../../../hooks/use-auth';

export const IntegrationSidebar = ({ 
  container, 
  currentTab, 
  setCurrentTab, 
  onClose, 
  open,
  isMobile 
}) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { company } = useAuth();

  const baseMenuItems = [
    { 
      label: "Call system", 
      value: "call_system",
      icon: <Iconify icon="solar:phone-bold" width={20} />
    },
    { 
      label: "Payment system", 
      value: "payment_system",
      icon: <Iconify icon="solar:card-bold" width={20} />
    },
    {
      label: "KYC & Compliance",
      value: "kyc_and_compliance",
      icon: <Iconify icon="solar:document-bold" width={20} />
    }
  ];

  const conditionalMenuItems = [
    {
      label: "Game providers",
      value: "game_studios",
      icon: <Iconify icon="cil:casino" width={20} />
    },
    {
      label: "Affiliates",
      value: "affiliates",
      icon: <Iconify icon="tabler:affiliate" width={20} />
    }
  ];

  const sideMenuList = company?.company_type === 2 
    ? [...baseMenuItems, ...conditionalMenuItems]
    : baseMenuItems;

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
                <IntegrationLabel
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
