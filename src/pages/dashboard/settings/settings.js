import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";
import { SettingsClientDashboard } from "src/sections/dashboard/settings/dashboard-setting";
import { SettingsMiniChat } from "src/sections/dashboard/settings/mini-chat/settings-mini-chat";
import { SettingsPlatform } from "src/sections/dashboard/settings/platform/settings-platform";
import { SettingsTeamsAndMembers } from "src/sections/dashboard/settings/settings-teams-and-members";
import { SettingsTrader } from "src/sections/dashboard/settings/trader/settings-trader";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { Forms } from "src/sections/dashboard/settings/forms";
import { SettingsEmails } from "src/sections/dashboard/settings/emails/settings-emails";
import { SettingsAnnouncements } from "src/sections/dashboard/settings/announcements";
import { SettingsWhatsApp } from "src/sections/dashboard/settings/whatsapp/settings-whatsapp";

export const TABS = [
  { label: "Teams and members", value: "team" },
  { label: "Platform settings", value: "platform" },
  { label: "Licenses", value: "licenses" },
  { label: "Trader", value: "trader" },
  { label: "Client dashboard", value: "client_dashboard" },
  { label: "Forms", value: "forms" },
  { label: "Announcements", value: "announcements" },
  { label: "Emails", value: "emails" },
  { label: "WhatsApp", value: "whatsapp" },
];

const Page = () => {
  const [currentTab, setCurrentTab] = useState("team");
  const searchParams = useSearchParams();
  const { company, user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_settings === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user]);

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab) setCurrentTab(tab);
  }, [searchParams]);

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const renderTabs = TABS.map((tab) => {
    if (tab.value === "team") {
      if (!user?.acc?.acc_e_setting_team) return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
    if (tab.value === "platform") {
      if (!user?.acc?.acc_e_setting_platform) return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
    if (tab.value === "mini_chat") {
      if (!user?.acc?.acc_e_setting_chat) return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
    // if (tab.value === "installation") {
    //   if (!user?.acc?.acc_e_setting_installation) return null;
    //   return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    // }
    if (tab.value === "licenses") {
      if (!user?.acc?.acc_e_setting_license) return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
    if (tab.value === "trader") {
      if (!user?.acc?.acc_e_setting_trader || company?.company_type === 2) return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
    if (tab.value === "client_dashboard") {
      if (
        !user?.acc?.acc_e_setting_client_dashboard &&
        user?.acc?.acc_e_setting_client_dashboard !== undefined
      )
        return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
    if (tab.value === "forms") {
      if (
        !user?.acc?.acc_e_setting_forms &&
        user?.acc?.acc_e_setting_forms !== undefined
      )
        return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
    if (tab.value === "emails") {
      if (
        !user?.acc?.acc_v_settings_emails &&
        user?.acc?.acc_v_settings_emails !== undefined
      )
        return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
    if (tab.value === "announcements") {
      if (
        !user?.acc?.acc_e_setting_announcements &&
        user?.acc?.acc_e_setting_announcements !== undefined
      )
        return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
    if (tab.value === "whatsapp") {
      if (
        !user?.acc?.acc_e_settings_whatsapp &&
        user?.acc?.acc_e_settings_whatsapp !== undefined
      )
        return null;
      return <Tab key={tab.value} label={tab.label} value={tab.value} />;
    }
  });

  const renderTabContent = (
    <>
      {currentTab === "team" &&
        (user?.acc?.acc_e_setting_team ||
          user?.acc?.acc_e_setting_team === undefined) && (
          <SettingsTeamsAndMembers />
        )}
      {currentTab === "platform" &&
        (user?.acc?.acc_e_setting_platform ||
          user?.acc?.acc_e_setting_platform === undefined) && (
          <SettingsPlatform />
        )}
      {currentTab === "trader" &&
        (user?.acc?.acc_e_setting_trader ||
          user?.acc?.acc_e_setting_trader === undefined) &&
        company?.company_type !== 2 && <SettingsTrader />}
      {currentTab === "mini_chat" &&
        (user?.acc?.acc_e_setting_chat ||
          user?.acc?.acc_e_setting_chat === undefined) && <SettingsMiniChat />}
      {/* {currentTab === "installation" &&
        (user?.acc?.acc_e_setting_installation ||
          user?.acc?.acc_e_setting_installation === undefined) && (
          <SettingsInstallation />
        )} */}
      {currentTab === "client_dashboard" &&
        (user?.acc?.acc_e_setting_client_dashboard ||
          user?.acc?.acc_e_setting_client_dashboard === undefined) && (
          <SettingsClientDashboard />
        )}
      {currentTab === "announcements" &&
        (user?.acc?.acc_e_setting_announcements ||
          user?.acc?.acc_e_setting_announcements === undefined) && (
          <SettingsAnnouncements />
        )}
      {currentTab === "forms" &&
        (user?.acc?.acc_e_setting_forms ||
          user?.acc?.acc_e_setting_forms === undefined) && <Forms />}
      {currentTab === "emails" &&
        (user?.acc?.acc_v_settings_emails ||
          user?.acc?.acc_v_settings_emails === undefined) && (
          <SettingsEmails />
        )}
      {currentTab === "whatsapp" &&
        (user?.acc?.acc_e_settings_whatsapp ||
          user?.acc?.acc_e_settings_whatsapp === undefined) && (
          <SettingsWhatsApp />
        )}
    </>
  );

  return (
    <>
      <Seo title={`Dashboard: Settings`} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
          flex: "1 1 auto",
          position: "relative",
        }}
      >
        {company?.list_filtering && (
          <Typography variant="h4" sx={{ pl: 12 }}>
            Settings
          </Typography>
        )}
        <PayWallLayout>
          <Container maxWidth="xxl">
            <Stack spacing={3} sx={{ mb: 1 }}>
              {!company?.list_filtering && (
                <Typography variant="h4">Settings</Typography>
              )}
              <Box>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {renderTabs}
                </Tabs>
                <Divider />
              </Box>
            </Stack>
            {renderTabContent}
          </Container>
        </PayWallLayout>
      </Box>
    </>
  );
};

export default Page;
