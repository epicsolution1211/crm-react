import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';

const useChartOptions = (labels) => {
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
      theme.palette.secondary.main,
      theme.palette.success.main,
    ],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    labels,
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

export const LandingAnalyticsBrandSources = (props) => {
  const { chartSeries, labels } = props;
  const chartOptions = useChartOptions(labels);

  return (
    <Card>
      <CardHeader
        title="Brand Count"
      />
      <CardContent>
        <Chart
          height={200}
          options={chartOptions}
          series={chartSeries}
          type="donut"
        />
        <Grid
          container
          spacing={1}
        >
          {chartSeries.map((item, index) => (
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
                <Typography variant="subtitle2">
                  {labels[index]}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

LandingAnalyticsBrandSources.propTypes = {
  chartSeries: PropTypes.any.isRequired,
  labels: PropTypes.array.isRequired
};
