import { useCallback, useEffect, useMemo, useState, useRef } from "react";
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

import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { paths } from "src/paths";
import { SeverityPill } from "src/components/severity-pill";
import AffiliateNote from "src/sections/dashboard/lead-management/affiliate-details/affiliate-note";
import AffiliateIntegration from "src/sections/dashboard/lead-management/affiliate-details/affiliate-integration";
import { AffiliateAccess } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-access";
import { AffiliateBasic } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-basic";
import { AffiliateInfo } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-Info";
import { AffiliateManagement } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-delete";
import { affiliateApi } from "src/api/lead-management/affiliate";
import { useParams } from "react-router-dom";

import { AffiliateIps } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-ips";
import { AffiliateTradingAccount } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-trading-account";
import { useAuth } from "src/hooks/use-auth";
import { statusApi } from "src/api/lead-management/status";
import { useRouter } from "src/hooks/use-router";
import { AffiliateCustomFields } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-custom-fields";
import { AffiliateAISummary } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-ai-summary";
import { AffiliateRouting } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-routing";
import { Iconify } from "src/components/iconify";
import { AffiliateDirectWebhooks } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-direct-webhooks";
import { AffiliateAggregatorsWebhooks } from "src/sections/dashboard/lead-management/affiliate-details/affiliate-aggregators-webhooks";

const baseTabs = [
  { label: "Details", value: "details" },
  { label: "Note", value: "note" },
  { label: "Integration", value: "integration" },
  { label: "Routing", value: "routing" },
  { label: "Custom Data", value: "custom-data" },
];

const AffiliateDetailPage = () => {
  usePageView();
  const [currentTab, setCurrentTab] = useState("details");
  const { affiliateId } = useParams();
  const { user, company } = useAuth();
  const containerRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_lm_aff === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const [affiliate, setAffiliate] = useState({});

  const [leadCustomFields, setLeadCustomFields] = useState([]);

  const companyType = company?.company_type;

  const tabs = useMemo(() => {
    const items = [...baseTabs];
    const normalizedCompanyType = Number.isFinite(Number(companyType))
      ? Number(companyType)
      : undefined;

    if (normalizedCompanyType === 1) {
      items.push({ label: "Direct Webhook", value: "direct-webhook" });
    }

    if (normalizedCompanyType === 2) {
      items.push(
        { label: "Direct Webhook", value: "direct-webhook" },
        { label: "Aggregators Webhook", value: "aggregators-webhook" }
      );
    }

    return items;
  }, [companyType]);

  const handleGetCustomField = async () => {
    try {
      const res = await statusApi.getLeadCustomFields();
      if (res?.lead_fields) {
        const fields = res?.lead_fields?.map((item) => ({ ...item, active: `aff_l_${item?.friendly_name?.replace(/\s+/g, "_")}` }));
        setLeadCustomFields(fields);
      }
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const getAffiliate = async () => {
    try {
      const res = await affiliateApi.getAffiliate(affiliateId);
      setAffiliate(res?.affiliate);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const updateAffiliate = async (id, data, silentUpdate = false) => {
    try {
      const res = await affiliateApi.updateAffiliate(id, data);
      setAffiliate(res?.affiliate);
      if (!silentUpdate) {
        toast.success("Affiliate successfully updated!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAffiliate();
    handleGetCustomField();
  }, []);

  useEffect(() => {
    if (!tabs.some((tab) => tab.value === currentTab)) {
      setCurrentTab(tabs[0]?.value || "details");
    }
  }, [tabs, currentTab]);

  return (
    <>
      <Seo title={`Dashboard: Affiliate Details`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 4, pb: 2 }}
      >
        <Container maxWidth="xxl" ref={containerRef}>
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.lead.affiliate.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Affiliate</Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: "column",
                  md: "row",
                }}
                justifyContent="space-between"
                spacing={4}
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
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h4">
                        {affiliate?.full_name}
                      </Typography>
                      {affiliate?.aff_admin ? (
                        <SeverityPill
                          color="success"
                          sx={{ ml: 2, fontSize: 10 }}
                        >
                          admin
                        </SeverityPill>
                      ) : null}
                    </Stack>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">Affilate Id:</Typography>
                      <Chip label={affiliateId} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
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
                  <Grid xs={12} lg={12}>
                    <AffiliateAISummary affiliateId={affiliateId}/>
                  </Grid>
                  <Grid xs={12} lg={5}>
                    <Stack spacing={4}>
                      <AffiliateBasic
                        affiliate={affiliate}
                        updateAffiliate={updateAffiliate}
                      />
                      <AffiliateAccess
                        affiliate={affiliate}
                        updateAffiliate={updateAffiliate}
                      />
                      <AffiliateTradingAccount 
                        affiliate={affiliate} 
                        updateAffiliate={updateAffiliate}
                      />
                      <AffiliateIps affiliate={affiliate} />
                    </Stack>
                  </Grid>
                  <Grid xs={12} lg={7}>
                    <Stack spacing={4}>
                      <AffiliateInfo
                        affiliate={affiliate}
                        updateAffiliate={updateAffiliate}
                      />
                      {user?.acc?.acc_e_lm_aff ? (
                        <AffiliateManagement affiliate={affiliate} />
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}
            {currentTab === "note" && (
              <AffiliateNote
                affiliate={affiliate}
                updateAffiliate={updateAffiliate}
              />
            )}
            {currentTab === "integration" && (
              <AffiliateIntegration leadCustomFields={leadCustomFields} affiliate={affiliate} />
            )}
            {currentTab === "routing" && (
              <AffiliateRouting 
                affiliate={affiliate} 
                updateAffiliate={updateAffiliate}
                container={containerRef.current}
              />
            )}
            {currentTab === "custom-data" && (
              <AffiliateCustomFields 
                affiliate={affiliate}
                updateAffiliate={updateAffiliate}
              />
            )}
            {currentTab === "direct-webhook" && (
              <AffiliateDirectWebhooks affiliateId={affiliateId} />
            )}
            {currentTab === "aggregators-webhook" && (
              <AffiliateAggregatorsWebhooks affiliateId={affiliateId} />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default AffiliateDetailPage;
