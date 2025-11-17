import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
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
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import MerchantNote from "src/sections/dashboard/payment-audit/merchant/details/merchant-note";
import { Iconify } from 'src/components/iconify';
import { MerchantBasic } from "src/sections/dashboard/payment-audit/merchant/details/merchant-basic";
import { MerchantFeeRate } from "src/sections/dashboard/payment-audit/merchant/details/merchant-fee-rate";
import { MerchantManagement } from "src/sections/dashboard/payment-audit/merchant/details/merchant-delete";
import { MerchantSetting } from "src/sections/dashboard/payment-audit/merchant/details/merchant-setting";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { merchantApi } from "src/api/payment_audit/merchant_api";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";

const tabs = [
  { label: "Details", value: "details" },
  { label: "Fee & Rates", value: "fee&rates" },
  { label: "Note", value: "note" },
];

const MerchantDetails = () => {
  const { user } = useAuth();
  usePageView();
  const [currentTab, setCurrentTab] = useState("details");
  const { merchantId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_merchant === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  const [merchant, setMerchant] = useState({});

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const updateMerchant = async (id, data, isNote) => {
    try {
      const res = await merchantApi.updateMerchant(id, data);
      setMerchant(res?.merchant);
      if (!isNote) {
        toast("Merchant successfully updated!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getMerchantInfo = async () => {
    try {
      const res = await merchantApi.getMerchant(merchantId);
      setMerchant(res?.merchants);
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
    getMerchantInfo(merchantId);
  }, [merchantId]);

  return (
    <>
      <Seo title={`Dashboard: Merchant Details`} />
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
                  href={paths.dashboard.paymentAudit.merchant.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Merchant</Typography>
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
                    <Typography variant="h4">{merchant?.name}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">merchant_id:</Typography>
                      <Chip label={merchantId} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              {currentTab === "fee&rates" && (
                <Stack direction="row" justifyContent="end">
                  {user?.acc?.acc_e_audit_merchant ? (
                    <Button
                      startIcon={<Iconify icon="lucide:plus" width={24} />}
                      variant="contained"
                      onClick={() =>
                        router.push(
                          `${paths.dashboard.paymentAudit.merchant.create}?merchantId=${merchantId}`
                        )
                      }
                    >
                      Add
                    </Button>
                  ) : null}
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
                        <Tab
                          key={tab.value}
                          label={tab.label}
                          value={tab.value}
                        />
                      );
                    }
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
              <div>
                <Grid container spacing={4}>
                  <Grid xs={12} lg={5}>
                    <Stack spacing={4}>
                      <MerchantBasic
                        merchant={merchant}
                        updateMerchant={updateMerchant}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} lg={7}>
                    <Stack spacing={4}>
                      <MerchantSetting
                        merchant={merchant}
                        updateMerchant={updateMerchant}
                      />
                      {user?.acc?.acc_e_audit_merchant ? (
                        <MerchantManagement merchant={merchant} />
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}
            {currentTab === "note" && (
              <MerchantNote
                merchant={merchant}
                updateMerchant={updateMerchant}
              />
            )}
            {currentTab === "fee&rates" && (
              <MerchantFeeRate merchant={merchant} />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default MerchantDetails;
