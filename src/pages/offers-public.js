import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { AnalyticsByCounty } from "src/sections/dashboard/lead-management/analytics/analytics-by-country";
import { AnalyticsMapByCountry } from "src/sections/dashboard/lead-management/analytics/analytics-map-by-country";
import { AnalyticsStats } from "src/sections/dashboard/lead-management/analytics/analytics-stats";
import { OffersTablePublic } from "src/sections/dashboard/lead-management/offers/offers-table-public";
import { Seo } from "src/components/seo";
import { analyticsApi } from "src/api/analytics";
import { format, startOfDay, startOfMonth } from "date-fns";
import { paths } from "src/paths";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";

const Page = () => {
  const router = useRouter();

  usePageView();
  const isMounted = useMounted();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState();
  const [filterDate, setFilterDate] = useState({
    from: startOfMonth(new Date()),
    to: new Date()?.setHours(23, 59, 59, 999),
  });

  useEffect(() => {
    if (isMounted()) {
      setIsLoading(false);
    }
  }, [isMounted]);

  useEffect(() => {
    getAnalytics();
  }, [filterDate]);

  const changeDateFormat = (date) => {
    const newFormat = format(new Date(date), "dd.MM.yyyy HH:mm");
    return newFormat;
  };

  const getAnalytics = async () => {
    setIsLoading(true);
    let params = {
      start_time: changeDateFormat(startOfDay(filterDate?.from)),
      end_time: changeDateFormat(filterDate?.to),
      company_id: 1,
    };
    try {
      const res = await analyticsApi.getAnalyticsInfo(params);
      setAnalytics(res?.analytics);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Seo title="Offers" />
      <Box component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xl">
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack direction="row"
                justifyContent="space-between"
                spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Analytics</Typography>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={3}>
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
            <Grid xs={12}
              md={4}>
              <AnalyticsStats
                isLoading={isLoading}
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
            <Grid xs={12}
              md={4}>
              <AnalyticsStats
                isLoading={isLoading}
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
            <Grid xs={12}
              md={4}>
              <AnalyticsStats
                isLoading={isLoading}
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
            <Grid
              xs={12}
              lg={8}>
              <AnalyticsMapByCountry
                data={analytics?.country_percentage}
                isLoading={isLoading}
              />
            </Grid>
            <Grid
              xs={12}
              lg={4}>
              <AnalyticsByCounty
                isLoading={isLoading}
                data={analytics?.country_count}
                onClick={() => router.push(paths.dashboard.lead.status.index)}
                isPublic
              />
            </Grid>
          </Grid>
        </Container>
        <Container maxWidth="xl">
          <Stack
            spacing={1}
            sx={{ mt: 8 }}>
            <Typography variant="h4">Live</Typography>
          </Stack>
          <OffersTablePublic />
        </Container>
      </Box>
    </>
  );
};

export default Page;
