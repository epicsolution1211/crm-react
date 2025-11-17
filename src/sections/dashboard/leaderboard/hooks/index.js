import { useState, useCallback, useEffect } from "react";
import { alpha, useTheme } from "@mui/system";
import useChart from "src/hooks/use-chart";

export const useAreaChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: [alpha(theme.palette.error.main, 0.4)],
    dataLabels: { enabled: false },
    fill: {
      gradient: {
        opacityFrom: 1,
        opacityTo: 0,
        stops: [0, 100]
      },
      type: 'gradient'
    },
    grid: {
      show: false,
      padding: { bottom: 0, left: 0, right: 0, top: 0 }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: { enabled: false },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false }
    },
    yaxis: { show: false }
  };
};

export const useRadialChartOptions = () => {
  const theme = useTheme();
  const colors = [theme.palette.info.main, theme.palette.info.dark];

  return useChart({
    chart: {
      offsetY: -16,
      sparkline: { enabled: true },
    },
    grid: {
      padding: { top: 24, bottom: 24 },
    },
    legend: { show: false },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: "56%" },
        dataLabels: {
          name: { offsetY: 8 },
          value: {
            offsetY: -15,
            fontSize: 16,
          },
          total: {
            label: "",
            color: theme.palette.text.disabled,
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.body2.fontWeight,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
  });
};

export const useFullscreen = (settings) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFullScreenOpen = useCallback(() => {
    const elem = document?.documentElement;
    try {
      if (elem?.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem?.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem?.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      settings?.handleSideNavClose();
      setIsExpanded(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, [settings]);

  const handleFullScreenClose = useCallback(() => {
    try {
      if (document?.exitFullscreen) {
        document.exitFullscreen();
      } else if (document?.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document?.msExitFullscreen) {
        document.msExitFullscreen();
      }
      settings?.handleSideNavOpen();
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, [settings]);

  useEffect(() => {
    const element = document.querySelector(".css-1np3eo0");
    
    const checkFullScreen = () => {
      const isFullscreen = document.fullscreenElement;
      if (element) {
        element.style.paddingLeft = isFullscreen ? "0px" : "280px";
      }
      setIsExpanded(isFullscreen);
      if (!isFullscreen) {
        settings?.handleSideNavOpen();
      }
    };

    document.addEventListener("fullscreenchange", checkFullScreen);
    return () => document.removeEventListener("fullscreenchange", checkFullScreen);
  }, [settings]);

  return {
    isExpanded,
    handleFullScreenOpen,
    handleFullScreenClose,
  };
};