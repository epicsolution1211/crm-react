import { Fragment } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Iconify } from 'src/components/iconify';

const IBSettingsLabel = ({ active, menu, onClick }) => (
  <List disablePadding dense>
    <Box
      component="button"
      onClick={onClick}
      sx={{
        border: 0,
        outline: 0,
        background: 'none',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 1,
        color: active ? 'text.primary' : 'text.secondary',
        fontWeight: theme => theme.typography.button.fontWeight,
        fontSize: theme => theme.typography.body2.fontSize,
        lineHeight: theme => theme.typography.body2.lineHeight,
        py: 0.75,
        px: 1.5,
        textAlign: 'left',
        cursor: 'pointer',
        ...(active && {
          backgroundColor: 'action.selected',
        }),
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      {menu.icon}
      <Box sx={{ flexGrow: 1, ml: 1 }}>{menu.label}</Box>
    </Box>
  </List>
);

export const CustomerIBSidebar = ({ container, currentTab, setCurrentTab, onClose, open, smUp, company }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const tabs = [
    {
      value: 'overview',
      label: 'Overview',
      icon: <Iconify icon="solar:home-2-bold" width={20} />,
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: <Iconify icon="solar:settings-bold" width={20} />,
    },
    {
      value: 'positions',
      label: company?.company_type === 2 ? 'Wagers' : 'Positions',
      icon: <Iconify icon="solar:chart-bold" width={20} />,
    },
    {
      value: 'rewards',
      label: 'Reward Transactions',
      icon: <Iconify icon="solar:money-bag-bold" width={20} />,
    },
    {
      value: 'customers',
      label: 'Customers',
      icon: <Iconify icon="mdi:users" width={20} />,
    },
  ];

  const content = (
    <div>
      <Stack
        alignItems="center"
        direction="row"
        spacing={1}
        sx={{ pt: 1, px: 1 }}
      >
        <Stack direction="row" width={1} justifyContent="end">
          {!mdUp && (
            <IconButton onClick={onClose} size="small">
              <Iconify icon="iconamoon:close" width={24} />
            </IconButton>
          )}
        </Stack>
      </Stack>
      <Box sx={{ pb: 1, px: 1, pt: 1 }}>
        <Stack direction="column" gap={0.5}>
          {tabs.map((tab) => (
            <Fragment key={tab.value}>
              <IBSettingsLabel
                menu={tab}
                active={currentTab === tab.value}
                onClick={() => {
                  setCurrentTab(tab.value);
                  !mdUp && onClose();
                }}
              />
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
      onClose={onClose}
      open={open}
      ModalProps={{
        container,
        sx: {
          pointerEvents: "none",
          position: "absolute",
          zIndex: 1100
        },
      }}
      PaperProps={{
        sx: {
          maxWidth: "100%",
          width: !mdUp ? (!smUp ? '80%' : 320) : 280,
          height: !mdUp ? '80vh' : '100%',
          mt: !mdUp ? 4 : 0,
          borderTopLeftRadius: !mdUp ? 3 : 0,
          borderTopRightRadius: !mdUp ? 3 : 0,
          pointerEvents: "auto",
          position: "absolute",
          '& .MuiListItemButton-root': {
            py: !mdUp ? 1.5 : 1,
            px: !mdUp ? 2 : 3
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