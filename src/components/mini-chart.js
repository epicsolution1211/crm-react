// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from "react";
import { useSettings } from "src/hooks/use-settings";

function MiniChart({ chartOnly, height, symbol }) {
  const contariner = useRef();
  const settings = useSettings();

  const colorTheme = settings?.paletteMode;

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML =
      colorTheme === "dark"
        ? `
        {
          "symbol": "${symbol}",
          "width": "100%",
          "height": ${height},
          "locale": "en",
          "dateRange": "12M",
          "colorTheme": "dark",
          "trendLineColor": "rgb(34,118,92)",
          "underLineColor": "rgba(34,118,92, 0.3)",
          "underLineBottomColor": "rgba(34,118,92, 0)",
          "isTransparent": false,
          "autosize": true,
          "largeChartUrl": "",
          "chartOnly": ${!!chartOnly}
        }`
        : `{
          "symbol": "${symbol}",
          "width": "100%",
          "height": ${height},
          "locale": "en",
          "dateRange": "12M",
          "colorTheme": "light",
          "trendLineColor": "rgb(34,118,92)",
          "underLineColor": "rgba(34,118,92, 0.3)",
          "underLineBottomColor": "rgba(34,118,92, 0)",
          "isTransparent": false,
          "autosize": true,
          "largeChartUrl": "",
          "chartOnly": ${!!chartOnly}
        }
        `;
    contariner.current.replaceChildren();
    contariner.current.appendChild(script);
  }, [chartOnly, symbol, colorTheme]);

  return <div className="tradingview-widget-container" ref={contariner}></div>;
}

export default memo(MiniChart);
