import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Seo } from "../../../components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { useAuth } from "src/hooks/use-auth";
import { useSearchParams } from "src/hooks/use-search-params";
import useMediaQuery from "@mui/material/useMediaQuery";

import { CallSystem } from "src/sections/dashboard/integration/call-system";
import { PaymentSystem } from "src/sections/dashboard/integration/payment-system";
import { GameStudios } from "src/sections/dashboard/integration/game-studios";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { IntegrationSidebar } from "src/sections/dashboard/integration/integration-sidebar";
import { Scrollbar } from "src/components/scrollbar";
import { Iconify } from "src/components/iconify";

export const TABS = [
  { label: "Call system", value: "call_system" },
  { label: "Payment system", value: "payment_system" },
  { label: "Game providers", value: "game_studios" },
];

const useSidebar = () => {
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
  };
};

const Page = () => {
  const [currentTab, setCurrentTab] = useState("call_system");
  const { user, company } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rootRef = useRef(null);
  const sidebar = useSidebar();

  usePageView();

  useEffect(() => {
    if (user?.acc?.acc_v_integration === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user]);

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab) setCurrentTab(tab);
  }, [searchParams]);

  const handleTabsChange = useCallback((value) => {
    setCurrentTab(value);
  }, []);

  const renderTabContent = (
    <>
      {currentTab === "call_system" &&
        (user?.acc?.acc_e_setting_call ||
          user?.acc?.acc_e_setting_call === undefined) && <CallSystem />}
      {currentTab === "payment_system" &&
        (user?.acc?.acc_e_integration_payment ||
          user?.acc?.acc_e_integration_payment === undefined) && <PaymentSystem />}
      {currentTab === "game_studios" &&
        (user?.acc?.acc_e_integration_gaming ||
          user?.acc?.acc_e_integration_gaming === undefined) && <GameStudios />}
    </>
  );

  return (
    <>
      <Seo title={`Dashboard: Integration`} />
      <Divider />
      <Box
        component="main"
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <PayWallLayout>
          <Container maxWidth="xxl">
            <Stack spacing={2} sx={{ mb: 1, pt: 3 }}>
              {!company?.list_filtering && (
                <Typography variant="h4">Integrations</Typography>
              )}
            </Stack>
            <Box
              ref={rootRef}
              sx={{
                minHeight: 600,
                display: "flex",
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
                position: 'relative'
              }}
            >
              <IntegrationSidebar
                container={rootRef.current}
                currentTab={currentTab}
                setCurrentTab={handleTabsChange}
                onClose={sidebar.handleClose}
                open={sidebar.open}
                isMobile={!useMediaQuery((theme) => theme.breakpoints.up("md"))}
              />
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <IconButton onClick={sidebar.handleToggle}>
                    <Iconify icon="lucide:menu" width={24} height={24} />
                  </IconButton>
                </Box>
                <Scrollbar sx={{ height: 1 }}>
                  <Box sx={{ p: 2 }}>
                    {renderTabContent}
                  </Box>
                </Scrollbar>
              </Box>
            </Box>
          </Container>
        </PayWallLayout>
      </Box>
    </>
  );
};

export default Page;
