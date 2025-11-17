import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { MailContainer } from "src/sections/dashboard/mail/mail-container";
import { SettingSidebar } from "./setting-sidebar";
import { IBRewardsAccountType } from './ib-rewards-account-type';
import { IBRewardsSetting } from './ib-rewards-setting';
import { Iconify } from 'src/components/iconify';

const useSidebar = () => {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = useState(mdUp);

  const handleScreenResize = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [mdUp]);

  useEffect(() => {
    handleScreenResize();
  }, [mdUp]);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleToggle,
    handleClose,
    open,
    smUp,
    mdUp,
  };
};

export const IBRewardsDetail = ({ brand }) => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const params = useParams();

  const [currentMenu, setCurrentMenu] = useState("");

  useEffect(() => {
    if (currentMenu === "") {
      setCurrentMenu("setting");
    }
  }, [currentMenu]);

  const getMenuTitle = () => {
    switch (currentMenu) {
      case "setting": return "Settings";
      case "account_type": return "Account Type";
      case "assets": return "Assets";
      default: return "IB Rewards Detail";
    }
  };

  return (
    <Card sx={{ height: "100vh" }}>
      <CardContent sx={{ p: sidebar.smUp ? 2 : 1, height: "100%" }}>
        <Box
          component="main"
          sx={{
            minHeight: { xs: 600, sm: 700, md: 800 },
            height: "100%",
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
            <SettingSidebar
              container={rootRef.current}
              currentLabelId={"currentLabelId"}
              brand={brand}
              currentMenu={currentMenu}
              setCurrentMenu={(menu) => {
                setCurrentMenu(menu);
                if (!sidebar.mdUp) {
                  sidebar.handleClose();
                }
              }}
              onClose={sidebar.handleClose}
              open={sidebar.open}
              isMobile={!sidebar.smUp}
            />
            <MailContainer 
              open={sidebar.open}
              sx={{ 
                transition: 'margin 0.3s ease-in-out',
                width: '100%'
              }}
            >
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
                  {!sidebar.open && brand && (
                    <Typography 
                      variant={sidebar.smUp ? "h6" : "subtitle1"}
                      sx={{ fontWeight: 'medium' }}
                    >
                      {getMenuTitle()}
                    </Typography>
                  )}
                </Box>
                <Divider />
              </Box>
              {brand && currentMenu === "setting" ? (
                <IBRewardsSetting rewardId={params?.ibRewardId} />
              ) : null}
              {brand && currentMenu === "account_type" ? (
                <IBRewardsAccountType brandId={brand?.id} rewardId={params?.ibRewardId} />
              ) : null}
              {brand && currentMenu === "assets" ? (
                <IBRewardsAccountType brandId={brand?.id} rewardId={params?.ibRewardId} hasSymbol/>
              ) : null}
            </MailContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
