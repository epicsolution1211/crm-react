import { useCallback, useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Iconify } from 'src/components/iconify';
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { countries } from "src/utils/constant";
import { paths } from "src/paths";
import { usePageView } from "src/hooks/use-page-view";
import { customerMockedList } from "src/utils/constant/mock-data";
import { LandingCustomerBasicDetails } from "src/sections/landing/customers/customer-basic-details";
import { LandingCustomerDataManagement } from "src/sections/landing/customers/customer-data-management";
import { LandingCustomerCustomerAssignee } from "src/sections/landing/customers/customer-assignee";
import { LandingCompanyLabelPanel } from "src/sections/landing/customers/customer-company-label";
import { LandingCustomerCustomFields } from "src/sections/landing/customers/customer-custom-fields";
import { LandingCustomerLeadSource } from "src/sections/landing/customers/customer-lead-source";
import { LandingCustomerNote } from "src/sections/landing/customers/customer-note";
import { LandingCustomerCommentsTab } from "src/sections/landing/customers/customer-comments-tab";
import { LandingCustomerPosition } from "src/sections/landing/customers/customer-position";
import LandingCustomerTransactionTable from "src/sections/landing/customers/customer-transaction-table";
// import { LandingCustomerWallets } from "src/sections/landing/customers/customer-wallets";
import { LandingCustomerTraderSettings } from "src/sections/landing/customers/customer-trader-settings";
import { LandingCustomerTransfer } from "src/sections/landing/customers/customer-transfer";
import { LandingCustomerPosts } from "src/sections/landing/customers/customer-posts";
import { LandingCustomerKyc } from "src/sections/landing/customers/customer-kyc";
import { LandingCustomerIcoContracts } from "src/sections/landing/customers/customer-ico-contracts";
import { LandingCustomerSavingAccounts } from "src/sections/landing/customers/customer-saving-accounts";
import { LandingLogs } from "src/sections/landing/customers/customer-logs";

const tabs = [
  { label: "Details", value: "details" },
  { label: "Lead source", value: "lead_source" },
  { label: "Note", value: "note" },
  { label: "Comments", value: "comments" },
  { label: "Positions", value: "positions" },
  { label: "Transaction", value: "transaction" },
  { label: "Trader Setting", value: "trader" },
  // { label: "Wallet", value: "wallet" },
  { label: "Transfer", value: "transfer" },
  { label: "Posts", value: "posts" },
  { label: "KYC", value: "kyc" },
  { label: "Logs", value: "logs" },
  // { label: "ICO", value: "ico" },
  // { label: "Saving accounts", value: "saving_accounts" },
];

const Page = () => {
  usePageView();
  const [currentTab, setCurrentTab] = useState("details");

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const { customerId } = useParams();

  const currentCustomer = useMemo(() => {
    if (customerId) {
      const result = customerMockedList.find((item) => item.id == customerId);
      return result;
    }
  }, [customerId]);

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title="Customer Details" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.home.customers}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Customers</Typography>
                </Link>
              </div>

              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Avatar
                    src={`customerInfo?.client?.avatar`}
                    sx={{
                      height: 64,
                      width: 64,
                    }}
                  />
                  <Stack spacing={1}>
                    <Stack direction="row" gap={1} alignItems="center">
                      <Typography variant="h4">
                        {currentCustomer?.full_name ?? ""}
                      </Typography>
                      <Iconify icon={`circle-flags:${currentCustomer?.country?.toLowerCase()}`} width={24} />
                      <Typography variant="h6">
                        {
                          countries.find(
                            (c) => c.code === currentCustomer?.country
                          )?.label
                        }
                      </Typography>
                    </Stack>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">User Id:</Typography>
                      <Chip label={customerId ?? ""} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
                {mdUp &&
                  <Stack alignItems="center" direction="row" spacing={2}>
                    <Tooltip title="Reminder">
                      <IconButton>
                        <Iconify icon="ic:outline-edit-calendar" width={40}/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Login to Trader">
                      <IconButton>
                        <Iconify icon="f7:chart-bar-square" width={45}/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Login to Dashboard">
                      <IconButton>
                        <Iconify icon="tabler:device-analytics" width={45}/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Call customer">
                      <IconButton>
                        <Iconify icon="solar:phone-calling-linear" width={40}/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open chat">
                      <IconButton>
                        <Iconify icon="fluent:people-chat-16-regular" width={40}/>
                      </IconButton>
                    </Tooltip>
                  </Stack>}
              </Stack>
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  sx={{ mt: 1 }}
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => {
                    return (
                      <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                      />
                    );
                  })}
                </Tabs>
                <Divider />
              </div>
            </Stack>
            {currentTab === "details" && (
              <Box>
                <Grid container spacing={4}>
                  <Grid
                    xs={12}
                    lg={4}
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <LandingCustomerBasicDetails />
                    <LandingCustomerDataManagement />
                  </Grid>
                  <Grid
                    xs={12}
                    lg={4}
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <LandingCustomerCustomerAssignee customer={currentCustomer} />
                    <LandingCompanyLabelPanel customer={currentCustomer} />
                  </Grid>
                  <Grid xs={12} lg={4}>
                    <LandingCustomerCustomFields />
                  </Grid>
                </Grid>
              </Box>
            )}
            {currentTab === "lead_source" && (
              <LandingCustomerLeadSource customer={currentCustomer} />
            )}
            {currentTab === "note" && <LandingCustomerNote />}
            {currentTab === "comments" && (
              <LandingCustomerCommentsTab customer={currentCustomer} />
            )}
            {currentTab === "positions" && (
              <LandingCustomerPosition />
            )}
            {currentTab === "transaction" && (
              <LandingCustomerTransactionTable />
            )}
            {/* {currentTab === "wallet" && (
              <LandingCustomerWallets />
            )} */}
            {currentTab === "trader" && (
              <LandingCustomerTraderSettings />
            )}
            {currentTab === "transfer" && (
              <LandingCustomerTransfer customer={currentCustomer} />
            )}
            {currentTab === "posts" && (
              <LandingCustomerPosts customer={currentCustomer} />
            )}
            {currentTab === "kyc" && (
              <LandingCustomerKyc customer={currentCustomer} />
            )}
            {currentTab === "logs" && (
              <LandingLogs customerId={customerId} />
            )}
            {currentTab === "ico" && (
              <LandingCustomerIcoContracts />
            )}
            {currentTab === "saving_accounts" && (
              <LandingCustomerSavingAccounts />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
