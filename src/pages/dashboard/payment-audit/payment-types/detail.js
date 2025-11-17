import { useCallback, useState, useEffect } from "react";
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
import { useParams } from "react-router-dom";

import PaymentNote from "src/sections/dashboard/payment-audit/payment-types/details/payment-note";
import { PaymentBasic } from "src/sections/dashboard/payment-audit/payment-types/details/payment-basic";
import { PaymentManagement } from "src/sections/dashboard/payment-audit/payment-types/details/payment-delete";
import { PaymentSetting } from "src/sections/dashboard/payment-audit/payment-types/details/payment-setting";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { paymentTypeApi } from "src/api/payment_audit/payment_type";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from 'src/components/iconify';

const tabs = [
  { label: "Details", value: "details" },
  { label: "Note", value: "note" },
];

const PaymentTypeDetails = () => {
  const { user } = useAuth();
  usePageView();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_payment_type === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  const [currentTab, setCurrentTab] = useState("details");
  const { paymentTypeId } = useParams();
  const [paymentType, setPaymentType] = useState({});

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const updatePaymentType = async (id, data, isNote) => {
    try {
      const res = await paymentTypeApi.updatePaymentType(id, data);
      setPaymentType(res?.payment_type);
      if (!isNote) {
        toast("Payment type successfully updated!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getPaymentType = async () => {
    try {
      const res = await paymentTypeApi.getPaymentType(paymentTypeId);
      setPaymentType(res?.payment_type);
    } catch (error) {
      toast(error?.response?.data?.message ?? error?.message);
    }
  };

  useEffect(() => {
    getPaymentType();
  }, [paymentTypeId]);

  return (
    <>
      <Seo title={`Dashboard: Payment Types Details`} />
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
                  href={paths.dashboard.paymentAudit.paymentType.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Payment Types</Typography>
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
                    <Typography variant="h4">{paymentType?.name}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">
                        Payment_Type_Id:
                      </Typography>
                      <Chip label={paymentTypeId} size="small" />
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
                      <PaymentBasic
                        paymentType={paymentType}
                        updatePaymentType={updatePaymentType}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} lg={7}>
                    <Stack spacing={4}>
                      <PaymentSetting
                        paymentType={paymentType}
                        updatePaymentType={updatePaymentType}
                      />
                      {user?.acc?.acc_e_audit_payment_type ? (
                        <PaymentManagement paymentType={paymentType} />
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}
            {currentTab === "note" && (
              <PaymentNote
                paymentType={paymentType}
                updatePaymentType={updatePaymentType}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default PaymentTypeDetails;
