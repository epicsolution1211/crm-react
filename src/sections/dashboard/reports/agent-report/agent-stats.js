import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: [theme.palette.info.main],
    dataLabels: {
      enabled: false
    },
    fill: {
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100]
      },
      type: 'gradient'
    },
    grid: {
      show: false,
      padding: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      enabled: false
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false
      }
    },
    yaxis: {
      show: false
    }
  };
};

export const AgentStats = (props) => {
  const { chartSeries } = props;
  const chartOptions = useChartOptions();

  return (
    <Chart
      height={120}
      options={chartOptions}
      series={chartSeries}
      type="area"
    />
  );
};
