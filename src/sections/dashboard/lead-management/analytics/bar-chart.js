import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';
import { getAssetPath } from "src/utils/asset-path";

const useChartOptions = ({ data }) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: true,
      toolbar: {
        show: false
      }
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.mode === 'dark'
        ? theme.palette.primary.darkest
        : theme.palette.primary.light
    ],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    grid: {
      borderColor: theme.palette.divider,
      padding: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      },
      strokeDashArray: 2
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '32px',
        horizontal: true,
      }
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      categories: data?.map((item) => (item?.account_name)) ?? [],
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false
      }
    }
  };
};

export const AffiliateBarChat = ({ data, isLoading }) => {
  const chartOptions = useChartOptions({ data });

  const chartSeries =
    [
      {
        name: 'Total Leads',
        data: data?.map((item) => (item?.total_leads)) ?? []
      },
      {
        name: 'Validated Leads',
        data: data?.map((item) => (item?.verified_leads)) ?? []
      }
    ];

  return (
    <Card>
      <CardHeader
        sx={{ pb: 0 }}
        title="Affiliate Count"
      />
      <CardContent sx={{ pt: 0 }}>
        {isLoading ?
          <Stack>
            {[...new Array(4).keys()]?.map((item) => (
              <Skeleton
                key={item}
                sx={{ height: 80 }} />
            ))}
          </Stack> :
          data?.length ?
            <Chart
              height={300}
              options={chartOptions}
              series={chartSeries}
              type="bar"
            /> : null
        }
        {(!isLoading && !data?.length) &&
          <Box
            sx={{
              py: 5,
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

