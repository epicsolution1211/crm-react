import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';
import Skeleton from '@mui/material/Skeleton';
import { getAssetPath } from "src/utils/asset-path";

const useChartOptions = (data) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.error.main
    ],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    labels: data?.map((item) => (item?.brand_name)) ?? [],
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

export const BrandPieChat = ({ data, isLoading }) => {
  const chartOptions = useChartOptions(data);

  return (
    <Card>
      <CardHeader
        title="Brand Count"
      />
      <CardContent>
        {isLoading ?
          <Stack>
            <Skeleton sx={{ height: 200 }} />
          </Stack> :
          data?.length ?
            <Chart
              height={200}
              options={chartOptions}
              series={data?.map((item) => (item?.total_leads)) ?? []}
              type="donut"
            /> : null
        }
        {isLoading ?
          <Grid
            container
            spacing={1}
          >
            {[...new Array(4).keys()]?.map((item) => (
              <Grid
                key={item}
                xs={12}
                sm={6}
              >
                <Skeleton sx={{ height: 30 }} />
              </Grid>
            ))}
          </Grid>
          :
          <Grid
            container
            spacing={1}
          >
            {(data?.map((item, index) => (
              <Grid
                key={index}
                xs={12}
                sm={6}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Box
                    sx={{
                      backgroundColor: chartOptions.colors[index],
                      borderRadius: '50%',
                      height: 8,
                      width: 8
                    }}
                  />
                  <Typography
                    noWrap
                    variant="subtitle2">
                    {item?.brand_name}
                  </Typography>
                </Stack>
              </Grid>
            )))}
          </Grid>
        }
        {(!isLoading && !data?.length) &&
          <Box
            sx={{
              py: 2,
              maxWidth: 1,
              alignItems: 'center',
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={getAssetPath("/assets/errors/error-404.png")}
              sx={{
                height: 'auto',
                maxWidth: 120,
              }}
            />
            <Typography
              color="text.secondary"
              sx={{ mt: 2 }}
              variant="subtitle1"
            >
              No Data.
            </Typography>
          </Box>}
      </CardContent>
    </Card>
  );
};
