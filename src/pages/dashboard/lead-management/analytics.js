import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, startOfDay, startOfMonth } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";

import { AffiliateBarChat } from "src/sections/dashboard/lead-management/analytics/bar-chart";
import { AnalyticsByCounty } from "src/sections/dashboard/lead-management/analytics/analytics-by-country";
import { AnalyticsMapByCountry } from "src/sections/dashboard/lead-management/analytics/analytics-map-by-country";
import { AnalyticsStats } from "src/sections/dashboard/lead-management/analytics/analytics-stats";
import { BrandPieChat } from "src/sections/dashboard/lead-management/analytics/pie-chart";
import { Seo } from "src/components/seo";
import { analyticsApi } from "src/api/analytics";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSettings } from "src/hooks/use-settings";
import { Iconify } from "src/components/iconify";

const Page = () => {
  const settings = useSettings();
  const router = useRouter();
  const { user } = useAuth();
  usePageView();

  useEffect(() => {
    if (user?.acc?.acc_v_lead_management === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const [isLoading, setIsLoading] = useState(true);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  const [analytics, setAnalytics] = useState();
  const [filterDate, setFilterDate] = useState({
    from: startOfMonth(new Date()),
    to: new Date()?.setHours(23, 59, 59, 999),
  });

  const changeDateFormat = (date) => {
    const newFormat = format(new Date(date), "dd.MM.yyyy HH:mm");
    return newFormat;
  };

  const getAnalytics = async (hasLoading = true) => {
    if (hasLoading) {
      setIsGlobalLoading(true);
    }
    setIsLoading(true);
    let params = {
      start_time: changeDateFormat(startOfDay(filterDate?.from)),
      end_time: changeDateFormat(filterDate?.to),
    };
    try {
      const res = await analyticsApi.getAnalyticsInfo(params);
      setAnalytics(res?.analytics);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
    setIsGlobalLoading(false);
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  useEffect(() => {
    getAnalytics(false);
  }, [filterDate]);

  if (isGlobalLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress
          size={70}
          sx={{ alignSelf: "center", justifySelf: "center" }}
        />
      </Box>
    );
  }

  return (
    <>
      <Seo title={`Dashboard : Analytics`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth={settings.stretch ? false : "xl"}>
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Analytics</Typography>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={3}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    label="From"
                    onChange={(val) => {
                      setFilterDate((prev) => ({
                        ...prev,
                        from: val,
                      }));
                    }}
                    maxDate={filterDate?.to}
                    value={filterDate?.from}
                    slotProps={{ textField: { size: "small" } }}
                  />
                  <DatePicker
                    format="dd/MM/yyyy"
                    label="To"
                    onChange={(val) => {
                      setFilterDate((prev) => ({ ...prev, to: val?.setHours(23, 59, 59, 999) }));
                    }}
                    minDate={filterDate?.from}
                    value={filterDate?.to}
                    slotProps={{ textField: { size: "small" } }}
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid xs={12} md={4}>
              <AnalyticsStats
                isLoading={isLoading}
                action={
                  <>
                    {user?.acc?.acc_v_lm_leads === undefined ||
                      user?.acc?.acc_v_lm_leads ? (
                      <Button
                        color="inherit"
                        endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
                        size="small"
                        onClick={() =>
                          router.push(paths.dashboard.lead.status.index)
                        }
                      >
                        See sources
                      </Button>
                    ) : null}
                  </>
                }
                chartSeries={[
                  {
                    data:
                      analytics?.total_leads?.data?.map((item) =>
                        item?.toString()
                      ) ?? [],
                  },
                ]}
                value={analytics?.total_leads?.total?.toString()}
                title="Total Leads"
              />
            </Grid>
            <Grid xs={12} md={4}>
              <AnalyticsStats
                isLoading={isLoading}
                action={
                  <>
                    {user?.acc?.acc_v_lm_leads === undefined ||
                      user?.acc?.acc_v_lm_leads ? (
                      <Button
                        color="inherit"
                        endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
                        onClick={() =>
                          router.push(paths.dashboard.lead.status.index)
                        }
                        size="small"
                      >
                        See sources
                      </Button>
                    ) : null}
                  </>
                }
                chartSeries={[
                  {
                    data:
                      analytics?.live_traffic?.data?.map((item) =>
                        item?.toString()
                      ) ?? [],
                  },
                ]}
                title="Live leads"
                value={analytics?.live_traffic?.total?.toString()}
              />
            </Grid>
            <Grid xs={12} md={4}>
              <AnalyticsStats
                isLoading={isLoading}
                action={
                  <>
                    {user?.acc?.acc_v_lm_leads === undefined ||
                      user?.acc?.acc_v_lm_leads ? (
                      <Button
                        color="inherit"
                        endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
                        onClick={() =>
                          router.push(paths.dashboard.lead.status.index)
                        }
                        size="small"
                      >
                        See sources
                      </Button>
                    ) : null}
                  </>
                }
                chartSeries={[
                  {
                    data:
                      analytics?.ftd_leads?.data?.map((item) =>
                        item?.toString()
                      ) ?? [],
                  },
                ]}
                title="FTD leads"
                value={analytics?.ftd_leads?.total?.toString()}
              />
            </Grid>
            <Grid xs={12} lg={8}>
              <AnalyticsMapByCountry
                data={analytics?.country_percentage}
                isLoading={isLoading}
              />
            </Grid>
            <Grid xs={12} lg={4}>
              <AnalyticsByCounty
                isLoading={isLoading}
                data={analytics?.country_count}
                onClick={() => router.push(paths.dashboard.lead.status.index)}
              />
            </Grid>
            <Grid xs={12} lg={8}>
              <AffiliateBarChat
                isLoading={isLoading}
                data={analytics?.affiliate_count}
              />
            </Grid>
            <Grid xs={12} lg={4}>
              <BrandPieChat
                isLoading={isLoading}
                data={analytics?.brand_count}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
