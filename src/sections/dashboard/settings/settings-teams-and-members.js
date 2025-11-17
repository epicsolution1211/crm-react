import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { settingsApi } from "src/api/settings";
import { Roles } from "./teams-members/roles";
import { Members } from "./teams-members/members";
import { Teams } from "./teams-members/teams";
import { Scrollbar } from "src/components/scrollbar";
import { MailContainer } from "../mail/mail-container";
import { SettingsSidebar } from "./teams-members/settings-sidebar";
import { MetabaseGroups } from './teams-members/metabase-groups';
import { SettingsDesk } from "src/sections/dashboard/settings/teams-members/desk";
import { Iconify } from "src/components/iconify";

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
  }, [mdUp, handleScreenResize]);

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
    mdUp
  };
};

export const SettingsTeamsAndMembers = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const members = useSelector((state) => state.settings.members);
  const skillTeams = useSelector((state) => state.settings.skillTeams);
  const location = useLocation();

  const [itemsWithName, setItemsWithName] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("members");

  const getRoles = async () => {
    setIsLoading(true);
    try {
      const res = await settingsApi.getRoles();
      const tempItems = members.accounts?.map(item => {
        const role_temp_name = res.temp_rolls.find(role => role.id == item.role_temp_id) ? res.temp_rolls.find(role => role.id == item.role_temp_id).name : "";
        return { ...item, role_name: role_temp_name }
      });
      setItemsWithName(tempItems);
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  useEffect(() => {
    if (!members.acounts) {
      getRoles();
    }
  }, [members]);

  useEffect(() => {
    const subTab = location.state?.subTab;
    if (subTab) {
      setCurrentTab(subTab);
    }
  }, [location.state]);

  const getTabTitle = () => {
    switch (currentTab) {
      case "members": return "Members";
      case "teams": return "Teams";
      case "desk": return "Desk";
      case "roles": return "Roles";
      case "report-groups": return "Report Groups";
      default: return "Members";
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "members":
        return (
          <Members
            isLoading={isLoading}
            itemsWithName={itemsWithName}
            isMobile={!sidebar.smUp}
          />
        );
      case "teams":
        return <Teams skillTeams={skillTeams} isMobile={!sidebar.smUp} isLoading={isLoading} />;
      case "desk":
        return <SettingsDesk />;
      case "roles":
        return <Roles isMobile={!sidebar.smUp} />;
      case "report-groups":
        return <MetabaseGroups isMobile={!sidebar.smUp} />;
      default:
        return (
          <Members
            isLoading={isLoading}
            itemsWithName={itemsWithName}
            isMobile={!sidebar.smUp}
          />
        );
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: sidebar.smUp ? 2 : 1 }}>
        <Box
            component="main"
            sx={{
              backgroundColor: "background.paper",
              flex: "1 1 auto",
              position: "relative",
            }}
          >
          <Box
            ref={rootRef}
            display='flex'
          >
            <SettingsSidebar
              container={rootRef.current}
              currentTab={currentTab}
              setCurrentTab={(tab) => {
                setCurrentTab(tab);
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
