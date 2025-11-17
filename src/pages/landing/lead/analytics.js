import { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Iconify } from 'src/components/iconify';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { LandingAnalyticsStats } from "src/sections/landing/lead-management/analytics/analytics-stats";
import { LandingAnalyticsCountry } from "src/sections/landing/lead-management/analytics/analytics-by-country";
import { LandingAnalyticsCountryTable } from "src/sections/landing/lead-management/analytics/analytics-by-country-table";
import { LandingAnalyticsCountSources } from "src/sections/landing/lead-management/analytics/analytics-affiliate-count";
import { LandingAnalyticsBrandSources } from "src/sections/landing/lead-management/analytics/analytics-brand-sources";

const Page = () => {
  const settings = useSettings();
  usePageView();

  const [filterDate, setFilterDate] = useState({ from: new Date(), to: new Date()?.setHours(23, 59, 59, 999) });

  return (
    <>
      <Seo title="Lead Management : Analytics" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">
                    Analytics
                  </Typography>
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
            <Grid
              xs={12}
              md={4}
            >
              <LandingAnalyticsStats
                action={(
                  <Button
                    color="inherit"
                    endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
                    size="small"
                  >
                    See sources
                  </Button>
                )}
                chartSeries={[
                  {
                    data: [0, 170, 242, 98, 63, 56, 85, 171, 209, 163, 204, 21, 264, 0]
                  }
                ]}
                title="Total Leads"
                value="36.6K"
              />
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <LandingAnalyticsStats
                action={(
                  <Button
                    color="inherit"
                    endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
                    size="small"
                  >
                    See sources
                  </Button>
                )}
                chartSeries={[
                  {
                    data: [0, 245, 290, 187, 172, 106, 15, 210, 202, 19, 18, 3, 212, 0]
                  }
                ]}
                title="Live leads"
                value="19K"
              />
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <LandingAnalyticsStats
                action={(
                  <Button
                    color="inherit"
                    endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
                    size="small"
                  >
                    See sources
                  </Button>
                )}
                chartSeries={[
                  {
                    data: [0, 277, 191, 93, 92, 85, 166, 240, 63, 4, 296, 144, 166, 0]
                  }
                ]}
                title="FTD leads"
                value="41.2K"
              />
            </Grid>
            <Grid
              xs={12}
              lg={8}
            >
              <LandingAnalyticsCountry
                sales={[
                  {
                    id: 'us',
                    amount: 60,
                    country: 'United States'
                  },
                  {
                    id: 'es',
                    amount: 20,
                    country: 'Spain'
                  },
                  {
                    id: 'uk',
                    amount: 10,
                    country: 'United Kingdom'
                  },
                  {
                    id: 'de',
                    amount: 5,
                    country: 'Germany'
                  },
                  {
                    id: 'ca',
                    amount: 5,
                    country: 'Canada'
                  }
                ]}
              />
            </Grid>
            <Grid
              xs={12}
              lg={4}
            >
              <LandingAnalyticsCountryTable
                action={(
                  <Button
                    color="inherit"
                    endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
                    size="small"
                  >
                    See More
                  </Button>
                )}
              />
            </Grid>

            <Grid
              xs={12}
              lg={8}
            >
              <LandingAnalyticsCountSources
                chartSeries={[
                  {
                    name: 'Total Leads',
                    data: [45, 40, 37, 41, 42]
                  },
                ]}
              />
            </Grid>
            <Grid
              xs={12}
              lg={4}
            >
              <LandingAnalyticsBrandSources
                chartSeries={[35, 25, 20, 15, 20]}
                labels={['Internal Brand', 'Solstice Wave', 'Fusion Vista', 'Elevate Pulse', 'Horizon Hub']}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
