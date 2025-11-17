import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";

import { blue, green, indigo } from 'src/theme/colors';
import { Chart } from "src/components/chart";
import { getAssetPath } from "src/utils/asset-path";

const useChartOptions = (data) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [
      theme.palette.error.main,
      '#FF6969',
      green.main,
      '#00DFA2',
      theme.palette.warning.main,
      '#F4D160',
      blue.main,
      theme.palette.info.main,
      indigo.main,
    ],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    labels: data?.map((item) => item?.name) ?? [],
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
    },
  };
};

export const BalancePieChat = ({ walletChartInfo, isLoading }) => {
  const chartOptions = useChartOptions(walletChartInfo);

  return (
    <Stack>
      {isLoading ? (
        <Stack>
          <Skeleton sx={{ height: 200 }} />
        </Stack>
      ) : walletChartInfo?.length ? (
        <Chart
          height={200}
          options={chartOptions}
          series={walletChartInfo?.map((item) => item?.value) ?? []}
          type="donut"
        />
      ) : null}
      {!isLoading && !walletChartInfo?.length && (
        <Box
          sx={{
            py: 2,
            maxWidth: 1,
            alignItems: "center",
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={getAssetPath("/assets/errors/error-404.png")}
            sx={{
              height: "auto",
              maxWidth: 120,
            }}
          />
          <Typography color="text.secondary" sx={{ mt: 2 }} variant="subtitle1">
            No Data.
          </Typography>
        </Box>
      )}
    </Stack>
  );
};
