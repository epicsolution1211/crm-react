import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import toast from "react-hot-toast";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import BankNote from "src/sections/dashboard/payment-audit/bank-provider/details/bank-note";
import { BankBasic } from "src/sections/dashboard/payment-audit/bank-provider/details/bank-basic";
import { BankFeeRate } from "src/sections/dashboard/payment-audit/bank-provider/details/bank-fee-rate";
import { BankManagement } from "src/sections/dashboard/payment-audit/bank-provider/details/bank-delete";
import { BankSetting } from "src/sections/dashboard/payment-audit/bank-provider/details/bank-setting";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { bankProviderApi } from "src/api/payment_audit/bank_provider";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { Iconify } from 'src/components/iconify';

const tabs = [
  { label: "Details", value: "details" },
  { label: "Fee & Rates", value: "fee&rates" },
  { label: "Note", value: "note" },
];

const BankProviderDetails = () => {
  const { user } = useAuth();
  const router = useRouter();
  usePageView();
  const [currentTab, setCurrentTab] = useState("details");
  const { providerId } = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_bank === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const [bankProvider, setBankProvider] = useState({});

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const updateBankProvider = async (id, data, isNote) => {
    try {
      const res = await bankProviderApi.updateBank(id, data);
      setBankProvider(res.bank);
      if (!isNote) {
        toast("Bank Provider successfully updated!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getBankProvider = async () => {
    try {
      const res = await bankProviderApi.getBank(providerId);
      setBankProvider(res.bank);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (searchParams.get("fee")) {
      setCurrentTab("fee&rates");
    }
  }, [searchParams]);

  useEffect(() => {
    getBankProvider();
  }, [providerId]);

  return (
    <>
      <Seo title={`Dashboard: Bank Providers Details`} />
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
                  href={paths.dashboard.paymentAudit.bankProvider.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Bank Providers</Typography>
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
                  <Avatar
                    src={""}
                    sx={{
                      height: 64,
                      width: 64,
                    }}
                  />
                  <Stack spacing={1}>
                    <Typography variant="h4">{bankProvider.name}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">bank_id:</Typography>
                      <Chip label={providerId} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              {currentTab === "fee&rates" && (
                <Stack direction="row" justifyContent="end">
                  <Button
                    startIcon={<Iconify icon="lucide:plus" width={24} />}
                    variant="contained"
                    onClick={() =>
                      router.push(
                        `${paths.dashboard.paymentAudit.bankProvider.create}?providerId=${providerId}`
                      )
                    }
                  >
                    Add
                  </Button>
                </Stack>
              )}
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
                  {tabs.map((tab) => {
                    if (tab.value === "note") {
                      return (
                        <Tab key={tab.value} label={tab.label} value={tab.value} />
                      )
                    }
                    return (
                      <Tab key={tab.value} label={tab.label} value={tab.value} />
                    )
                  })}
                </Tabs>
                <Divider />
              </div>
            </Stack>
            {currentTab === "details" && (
              <div>
                <Grid container spacing={4}>
                  <Grid xs={12} lg={5}>
                    <Stack spacing={4}>
                      <BankBasic
                        bankProvider={bankProvider}
                        updateBankProvider={updateBankProvider}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} lg={7}>
                    <Stack spacing={4}>
                      <BankSetting
                        bankProvider={bankProvider}
                        updateBankProvider={updateBankProvider}
                      />
                      {user?.acc?.acc_e_audit_bank ? (
                        <BankManagement bankProvider={bankProvider} />
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}
            {currentTab === "note" && (
              <BankNote
                bankProvider={bankProvider}
                updateBankProvider={updateBankProvider}
              />
            )}
            {currentTab === "fee&rates" && (
              <BankFeeRate bankProvider={bankProvider} />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default BankProviderDetails;
