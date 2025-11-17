import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";

import { useSettings } from "src/hooks/use-settings";

export const PowerBi = ({ reports }) => {
  const settings = useSettings();
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && reports) {
      const iframeElement = iframeRef.current.querySelector('iframe');

      if (iframeElement) {
        iframeElement.height = `${window.innerHeight - 290}px`; 
      }
    }
  }, [reports]);

  return (
    <Box pt={1}>
      {reports ? (
        <div
          dangerouslySetInnerHTML={{
            __html:
              settings?.paletteMode === "dark"
                ? reports?.dark
                : reports?.light,
          }}
          ref={iframeRef}
        />
      ) : null}
    </Box>
  );
};
