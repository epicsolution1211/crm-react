import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";

import { AgentReport } from "src/sections/landing/reports/agent-report";
import { AffilateReport } from "src/sections/landing/reports/affilate-report";
import { DeskReport } from "src/sections/landing/reports/desk-report";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";

const tabs = [
  { label: "Agent Performance", value: "agent" },
  { label: "Affiliate Performance", value: "affiliate" },
  { label: "Desk Performance", value: "desk" },
];

const Page = () => {
  const { user, company } = useAuth();
  const router = useRouter();

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (user?.acc?.acc_v_reports === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  const [currentTab, setCurrentTab] = useState("");

  const [selectedAgent, setSelectedAgent]= useState();
  const [selectedAffiliate, setSelectedAffiliate]= useState();
  const [selectedDesk, setSelectedDesk]= useState();

  const handleTabsChange = (event, value) => setCurrentTab(value);

  useEffect(() => {
    if(state?.agent) {
      setSelectedAgent(state?.agent);
    }
    if(state?.affiliate) {
      setSelectedAffiliate(state?.affiliate);
    }
    if(state?.tab) {
      setCurrentTab(state?.tab);
    } else {
      setCurrentTab('agent');
    }
  }, [state])

  return (
    <>
      <Seo title={`Dashboard: Account`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2, flex: "1 1 auto", position: "relative" }}>
        <Container maxWidth="xxl">
          <Stack spacing={3} sx={{ mb: 1 }}>
            {!company?.list_filtering && (
              <Typography variant="h4">Reports</Typography>
            )}
            <Box>
              <Tabs indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />))}
              </Tabs>
              <Divider />
            </Box>
          </Stack>
          {currentTab === "agent" &&
            <AgentReport
              selectedAgent={selectedAgent}
              setSelectedAgent={setSelectedAgent}
            />
          }
          {currentTab === "affiliate" &&
            <AffilateReport
              selectedAgent={selectedAgent}
              setSelectedAgent={setSelectedAgent}
              selectedAffiliate={selectedAffiliate}
              setSelectedAffiliate={setSelectedAffiliate}
            />
          }
          {currentTab === "desk" &&
            <DeskReport 
              selectedDesk={selectedDesk}
              setSelectedDesk={setSelectedDesk}
            />
          }
        </Container>
      </Box>
    </>
  );
};

export default Page;
