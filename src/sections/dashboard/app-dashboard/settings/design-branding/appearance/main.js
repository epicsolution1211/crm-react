import { Box } from "@mui/material";

import { useMemo } from "react";
import { ThemeSelector } from "./theme-selector/theme-selector";

export function AppearanceMain({ currentMenu }) {
  const currentComponent = useMemo(() => {
    if (currentMenu === "ThemeSelector") return <ThemeSelector />;
  }, [currentMenu]);

  return (
    <Box>
      {currentComponent}
    </Box>
  );
}
