import { useCallback, useState } from "react";
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

import RecordNode from "src/sections/dashboard/payment-audit/alert/details/record-note";
import { AlertIssue } from "src/sections/dashboard/payment-audit/alert/details/record-issue";
import { RecordEdit } from "src/sections/dashboard/payment-audit/alert/details/record-rule-edit";
import { RecordManagement } from "src/sections/dashboard/payment-audit/alert/details/record-delete";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { usePageView } from "src/hooks/use-page-view";
import { RecordHistoryTable } from "src/sections/dashboard/payment-audit/alert/details/record-history";
import { RecordPaymentType } from "src/sections/dashboard/payment-audit/alert/details/record-payment-type";
import { RecordCostProfit } from "src/sections/dashboard/payment-audit/alert/details/record-cost-profit";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from 'src/components/iconify';

const tabs = [
  { label: "Issues", value: "issues" },
  { label: "Record", value: "record" },
  { label: "History", value: "history" },
  { label: "Note", value: "note" },
];

const AlertDetails = () => {
  usePageView();
  const [currentTab, setCurrentTab] = useState("issues");
  const { recordId } = useParams();

  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_payment_audit === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title={`Dashboard: Record Details`} />
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
                  href={paths.dashboard.paymentAudit.record.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Record</Typography>
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
                    <Typography variant="h4">Record63</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">record_id:</Typography>
                      <Chip label={recordId} size="small" />
                    </Stack>
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
            {currentTab === "issues" && <AlertIssue recordId={recordId} />}
            {currentTab === "history" && (
              <RecordHistoryTable recordId={recordId} />
            )}
            {currentTab === "note" && <RecordNode recordId={recordId} />}
            {currentTab === "record" && (
              <>
                <RecordPaymentType recordId={recordId} />
                <RecordCostProfit recordId={recordId} />
                <RecordEdit recordId={recordId} />
                <RecordManagement recordId={recordId} />
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default AlertDetails;
