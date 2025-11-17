import { Fragment, useState, useRef } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from "@mui/material/Divider";

import { TrafficManagement } from "./traffic-management";
import { GeoCountryRouting } from "./geo-country-routing";
import { MailContainer } from "../../mail/mail-container";
import { Scrollbar } from "src/components/scrollbar";
import { Iconify } from "src/components/iconify";

const RoutingLabel = ({ active, menu, onClick }) => {
  const icon = {
    "desk-agents": <Iconify icon="solar:users-group-rounded-bold" width={20} />,
    "geo-country": <Iconify icon="solar:map-point-bold" width={20} />,
  };

  return (
    <List disablePadding dense>
      <Box
        component="button"
        onClick={onClick}
        sx={{
          borderRadius: 1,
          color: "text.secondary",
          flexGrow: 1,
          fontSize: (theme) => theme.typography.body2.fontSize,
          fontWeight: (theme) => theme.typography.button.fontWeight,
          justifyContent: "flex-start",
          lineHeight: (theme) => theme.typography.body2.lineHeight,
          py: 0.75,
          px: 1.5,
          textAlign: "left",
          width: "100%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          "&:hover": {
            backgroundColor: "action.hover",
          },
          ...(active && {
            backgroundColor: "action.selected",
            color: "text.primary",
          }),
        }}
      >
        {icon[menu?.value]}
        <Box sx={{ flexGrow: 1, ml: 1 }}>{menu?.label ?? ""}</Box>
      </Box>
    </List>
  );
};

const useSidebar = () => {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = useState(mdUp);

  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {
    handleToggle,
    handleClose,
    open,
    smUp,
    mdUp
  };
};

export const AffiliateRouting = ({ affiliate, updateAffiliate, container }) => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const [currentTab, setCurrentTab] = useState("desk-agents");

  const tabs = [
    { label: "Desk & Agents", value: "desk-agents" },
    { label: "Geo & Country", value: "geo-country" },
  ];

  const getTabTitle = () => {
    switch (currentTab) {
      case "desk-agents": return "Desk & Agents";
      case "geo-country": return "Geo & Country";
      default: return "Desk & Agents";
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "desk-agents":
        return (
          <TrafficManagement
            affiliate={affiliate}
            updateAffiliate={updateAffiliate}
          />
        );
      case "geo-country":
        return (
          <GeoCountryRouting
            affiliate={affiliate}
            updateAffiliate={updateAffiliate}
          />
        );
      default:
        return null;
    }
  };

  const sidebarContent = (
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
          {!sidebar.mdUp && (
            <IconButton onClick={sidebar.handleClose} size="small">
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
          {tabs.map((tab) => (
            <Fragment key={tab.value}>
              <RoutingLabel
                menu={tab}
                active={currentTab === tab.value}
                onClick={() => {
                  setCurrentTab(tab.value);
                  !sidebar.mdUp && sidebar.handleClose();
                }}
              />
            </Fragment>
          ))}
        </Stack>
      </Box>
    </div>
  );

  return (
    <Card>
      <CardContent sx={{ p: sidebar.smUp ? 2 : 1 }}>
        <Box
          component="main"
          sx={{
            minHeight: { xs: 600, sm: 700, md: 880 },
            backgroundColor: "background.paper",
            flex: "1 1 auto",
            position: "relative",
          }}
        >
          <Box
            ref={rootRef}
            sx={{
              bottom: 0,
              display: "flex",
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
            }}
          >
            {sidebar.mdUp ? (
              <Drawer
                anchor="left"
                open={sidebar.open}
                PaperProps={{
                  sx: {
                    position: "relative",
                    width: sidebar.open ? 220 : 280,
                    zIndex: 1100,
                  },
                }}
                variant="persistent"
              >
                {sidebarContent}
              </Drawer>
            ) : (
              <Drawer
                anchor="left"
                hideBackdrop
                ModalProps={{
                  container: container || undefined,
                  sx: {
                    pointerEvents: "none",
                    position: "absolute",
                    zIndex: 1100,
                  },
                }}
                onClose={sidebar.handleClose}
                open={sidebar.open}
                PaperProps={{
                  sx: {
                    maxWidth: "100%",
                    width: 280,
                    pointerEvents: "auto",
                    position: "absolute",
                  },
                }}
                SlideProps={{ container: container || undefined }}
                variant="temporary"
              >
                {sidebarContent}
              </Drawer>
            )}

            <MailContainer 
              open={sidebar.open}
              sx={{ 
                transition: 'margin 0.3s ease-in-out',
                width: '100%'
              }}
            >
              <Scrollbar sx={{ height: 1 }}>
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1, 
                    ml: 1,
                    mr: 1,
                    justifyContent: 'space-between'
                  }}>
                    <IconButton
                      onClick={sidebar.handleToggle}
                      sx={{ 
                        display: 'flex',
                        p: sidebar.smUp ? 1 : 0.5
                      }}
                    >
                      <Iconify icon="lucide:menu" width={24} height={24} />
                    </IconButton>
                    {!sidebar.open && (
                      <Typography 
                        variant={sidebar.smUp ? "h6" : "subtitle1"}
                        sx={{ fontWeight: 'medium' }}
                      >
                        {getTabTitle()}
                      </Typography>
                    )}
                  </Box>
                  <Divider />
                </Box>
                <Stack p={sidebar.smUp ? 2 : 1}>
                  {renderContent()}
                </Stack>
              </Scrollbar>
            </MailContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};