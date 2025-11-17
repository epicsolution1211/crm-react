import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/system/Unstable_Grid/Grid";
import CardContent from "@mui/material/CardContent";
import DialogTitle from "@mui/material/DialogTitle";
import ToggleButton from "@mui/material/ToggleButton";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Iconify } from "src/components/iconify";
import { Chart } from "src/components/chart";
import { useGetTodoAnalytics } from "src/hooks/swr/use-todo";

const timePresets = [
  { value: 1, label: "1 Day" },
  { value: 7, label: "7 Days" },
  { value: 30, label: "30 Days" },
  { value: 180, label: "6 Months" },
  { value: 365, label: "1 Year" },
];

const statsConfig = [
  { title: "Total Todos", value: "total_todos", color: "info" },
  { title: "In Progress", value: "in_progress_todos", color: "warning" },
  { title: "Done", value: "completed_todos", color: "success" },
  { title: "Overdue Todos", value: "overdue_todos", color: "error" },
  { title: "Pending Todos", value: "pending_todos", color: "secondary" },
  { title: "Completion Rate", value: "completion_rate", color: "info", isPercentage: true },
];

const useChartOptions = (type = "line") => {
  const theme = useTheme();

  const baseOptions = {
    chart: {
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      theme: theme.palette.mode,
    },
  };

  if (type === "bar") {
    return {
      ...baseOptions,
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "60%",
        },
      },
      colors: [
        theme.palette.primary.main,
        theme.palette.warning.main,
        theme.palette.success.main,
      ],
    };
  }

  if (type === "area") {
    return {
      ...baseOptions,
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.3,
          opacityTo: 0.1,
        },
      },
      colors: [theme.palette.primary.main],
    };
  }

  return {
    ...baseOptions,
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: [theme.palette.primary.main],
  };
};

const StatCard = ({ title, value, color = "primary" }) => (
  <Card sx={{ border: '1px dashed', borderColor: 'divider' }}>
    <CardContent sx={{ pt: { xs: 1, md: 2 }, '&:last-child': { pb: { xs: 1, md: 2 } }, px: { xs: 2, md: 2 } }}>
      <Stack 
        sx={{
          flexDirection: { xs: "row", md: "column" },
          justifyContent: { xs: "space-between", md: "center" },
          alignItems: { xs: "center", md: "start" },
          gap: 0.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" color={`${color}.main`}>
          {value}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const StageAveragesChart = ({ data }) => {
  const theme = useTheme();
  const chartOptions = useChartOptions("bar");
  const chartData = [
    {
      name: "Average Hours", 
      data: [
        data?.todo?.average_hours || 0,
        data?.in_progress?.average_hours || 0,
        data?.done?.average_hours || 0,
      ],
    },
  ];

  const categories = ["To Do", "In Progress", "Done"];

  const options = {
    ...chartOptions,
    xaxis: {
      categories,
      labels: {
        style: {
          colors: chartOptions.theme.mode === "dark" ? "#fff" : "#000",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value.toFixed(1)}h`,
      },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.warning.main, 
      theme.palette.success.main
    ],
    plotOptions: {
      bar: {
        distributed: true
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <Card sx={{ border: '1px dashed', borderColor: 'divider' }}>
      <CardContent sx={{ py: 3, px: { xs: 1, md: 4 }, '&:last-child': { pb: { xs: 1, md: 0 } }}}>
        <Typography variant="h6" sx={{ pl: { xs: 2, md: 0 }}} gutterBottom>
          Average Time in Each Stage
        </Typography>
        <Chart
          height={206}
          options={options}
          series={chartData}
          type="bar"
        />
      </CardContent>
    </Card>
  );
};

const ProductivityTrendsChart = ({ data }) => {
  const theme = useTheme();
  const chartOptions = useChartOptions("area");
  
  const chartData = [
    {
      name: "Created",
      data: data?.map((item) => item.created) || [],
    },
    {
      name: "Done",
      data: data?.map((item) => item.completed) || [],
    },
  ];

  const categories = data?.map((item) => item.week) || [];

  const options = {
    ...chartOptions,
    xaxis: {
      categories,
      labels: {
        style: {
          colors: chartOptions.theme.mode === "dark" ? "#fff" : "#000",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => Math.round(value),
      },
    },
    colors: [chartOptions.colors[0], theme.palette.success.main],
  };

  return (
    <Card sx={{ border: '1px dashed', borderColor: 'divider' }}>
      <CardContent sx={{ py: 3, px: { xs: 1, md: 4 }, '&:last-child': { pb: { xs: 1, md: 0 } }}}>
        <Typography variant="h6" sx={{ pl: { xs: 2, md: 0 }}} gutterBottom>
          Productivity Trends
        </Typography>
        <Chart
          height={206}
          options={options}
          series={chartData}
          type="area"
        />
      </CardContent>
    </Card>
  );
};

const ParticipantPerformanceChart = ({ data }) => {
  const chartOptions = useChartOptions("bar");
  const theme = useTheme();
  
  const participants = data?.map((item) => item.account.name) || [];
  const totalTodos = data?.map((item) => item.stats.total_todos) || [];

  const chartData = [
    {
      name: "Total Todos",
      data: totalTodos,
    },
  ];

  const options = {
    ...chartOptions,
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "60%",
        distributed: true
      },
    },
    xaxis: {
      categories: participants,
      labels: {
        style: {
          colors: chartOptions.theme.mode === "dark" ? "#fff" : "#000",
        },
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    legend: {
      markers: {
        radius: 100
      }
    },
    colors: [
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.secondary.main,
    ],
  };

  return (
    <Card sx={{ border: '1px dashed', borderColor: 'divider' }}>
      <CardContent sx={{ py: 3, px: { xs: 1, md: 4 }, '&:last-child': { pb: { xs: 1, md: 0 } }}}>
        <Typography variant="h6" sx={{ pl: { xs: 2, md: 0 }}} gutterBottom>
          Individual Participant Performance
        </Typography>
        <Stack sx={{ ml: { xs: -1, md: 0 }, mb: { xs: -1, md: 0 }, mt: { xs: -1, md: 0 } }}>
          <Chart
            height={206}
            options={options}
            series={chartData}
            type="bar"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

const CompletionRatesChart = ({ data }) => {
  const theme = useTheme();
  const chartOptions = useChartOptions("line");
  
  const chartData = [
    {
      name: "Completion Rate",
      data: data?.map((item) => item.completion_rate) || [],
    },
  ];

  const categories = data?.map((item) => item.week) || [];

  const options = {
    ...chartOptions,
    xaxis: {
      categories,
      labels: {
        style: {
          colors: chartOptions.theme.mode === "dark" ? "#fff" : "#000",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value.toFixed(1)}%`,
      },
    },
    colors: [theme.palette.success.main],
  };

  return (
    <Card sx={{ border: '1px dashed', borderColor: 'divider' }}>
      <CardContent sx={{ py: 3, px: { xs: 1, md: 4 }, '&:last-child': { pb: { xs: 1, md: 0 } }}}>
        <Typography variant="h6" sx={{ pl: { xs: 2, md: 0 }}} gutterBottom>
          Completion Rates Over Time
        </Typography>
        <Chart
          height={206}
          options={options}
          series={chartData}
          type="line"
        />
      </CardContent>
    </Card>
  );
};

export const TodoAnalyticsDialog = ({ open, onClose }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [daysBack, setDaysBack] = useState(30);
  
  const { analytics, isLoading, isValidating, mutate } = useGetTodoAnalytics({ days_back: daysBack });

  const handleDaysBackChange = (event, newValue) => {
    if (newValue !== null) {
      setDaysBack(newValue);
    }
  };

  useEffect(() => {
    if (open) {
      mutate();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          height: { xs: "100vh", md: "90vh" },
        },
      }}
      fullScreen={mdUp}
    >
      <DialogTitle sx={{ position: 'relative' }}>
        <Stack 
          sx={{
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: { xs: "start", md: "center" },
            gap: 2,
          }} 
        >
          <IconButton 
            onClick={onClose} 
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'text.primary'
            }}>
            <Iconify icon="mingcute:close-line" width={20} height={20} />
          </IconButton>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1, pb: { xs: 1, md: 0 } }}>
            <Typography variant="h5">Analytics</Typography>
            {isValidating && !isLoading && (
              <Iconify icon="svg-spinners:8-dots-rotate" width={22}/>
            )}
          </Stack>
          <ToggleButtonGroup
            value={daysBack}
            exclusive
            onChange={handleDaysBackChange}
            size="small"
          >
            {timePresets.map((preset) => {
              return (
                <ToggleButton 
                  key={preset.value} 
                  value={preset.value} 
                  sx={{ 
                    px: { xs: 1, md: 2 },
                    whiteSpace: "nowrap",
                  }}
                >
                  {preset.label}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pb: { xs: 4, md: 0 } }}>
        {isLoading ? (
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress size={56} sx={{ color: 'primary.main' }}/>
            <Typography variant="h6">Loading...</Typography>
          </Box>
        ) : analytics ? (
          <Stack sx={{ pt: 1, gap: 3 }}>
            <Grid container spacing={2}>
              {statsConfig.map((stat) => (
                <Grid key={stat.title} xs={12} sm={6} md={4} lg={2}>
                  <StatCard
                    title={stat.title}
                    value={stat.isPercentage 
                      ? `${(analytics.summary?.[stat.value] || 0).toFixed(2)}%`
                      : analytics.summary?.[stat.value] || 0}
                    color={stat.color}
                  />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <StageAveragesChart data={analytics.stage_averages} />
              </Grid>
              <Grid xs={12} md={6}>
                <ProductivityTrendsChart data={analytics.productivity_trends} />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <ParticipantPerformanceChart data={analytics.participant_performance} />
              </Grid>
              <Grid xs={12} md={6}>
                <CompletionRatesChart data={analytics.productivity_trends} />
              </Grid>
            </Grid>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ display: { xs: 'none', md: 'flex' }, px: 3, pb: 1 }}>
        <Button onClick={onClose} >Close</Button>
      </DialogActions>
    </Dialog>
  );
}; 