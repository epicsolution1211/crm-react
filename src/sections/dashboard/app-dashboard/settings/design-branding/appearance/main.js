import { Box } from "@mui/material";

import { useMemo } from "react";
import { ThemeSelector } from "./theme-selector/theme-selector";
import { ColorSchemeMain } from "./color-scheme/main";
import {LoginSignupImageMain} from "./login-signup-image/main"

export function AppearanceMain({ currentMenu }) {
  const currentComponent = useMemo(() => {
    if (currentMenu === "ThemeSelector") return <ThemeSelector />;
    if (currentMenu === "ColorScheme") return <ColorSchemeMain />;
    if (currentMenu === "LoginSignupBCImage") return <LoginSignupImageMain />;
  }, [currentMenu]);

  return (
    <Box>
      {currentComponent}
    </Box>
  );
}
