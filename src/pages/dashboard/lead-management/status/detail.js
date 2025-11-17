import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";

import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { StatusEdit } from "src/sections/dashboard/lead-management/status-edit";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { statusApi } from "src/api/lead-management/status";
import { Iconify } from 'src/components/iconify';

const tabs = [
  { label: "Details", value: "details" },
];

const Page = () => {
  usePageView();
  const [currentTab, setCurrentTab] = useState("details");
  const { leadId } = useParams();
  const [leadInfo, setLeadInfo] = useState({});

  const { user } = useAuth();
  const router = useRouter();

  const getLead = async () => {
    try {
      const { lead } = await statusApi.getLead(leadId);
      if (lead) setLeadInfo(lead);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getLead();
  }, []);

  useEffect(() => {
    if (user?.acc?.acc_v_lm_list === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title={`Dashboard: Lead Details`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.lead.status.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Lead</Typography>
                </Link>
              </div>
              <Stack
                alignItems="end"
                direction={{
                  xs: "column",
                  md: "row",
                }}
                sx={{ mt: 2 }}
                justifyContent="space-between"
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Stack spacing={1}>
                    <Typography variant="h4">Lead</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">lead_id:</Typography>
                      <Chip label={leadId} size="small" />
                    </Stack>
                    {leadInfo?.lead_file_id && (
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Typography variant="subtitle2">lead_file_id:</Typography>
                        <Chip label={leadInfo?.lead_file_id} size="small" />
                      </Stack>
                    )}
                    {leadInfo?.account_id && (
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Typography variant="subtitle2">affiliate_id:</Typography>
                        <Chip label={leadInfo?.account_id} size="small" />
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Stack>
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  sx={{ mt: 3 }}
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
                <Divider />
              </div>
            </Stack>
            {currentTab === "details" && (
              <StatusEdit leadId={leadId} lead={leadInfo} />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
