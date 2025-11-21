import { Box } from "@mui/material";
import { MobileMenuMain } from "./mobile-menu/main"
import { useMemo } from "react";
import { TabletMenuMain } from "./tablet-menu/main"
import { DesktopMenuMain } from "./desktop-menu/main"

export function MenuMain({ currentMenu, selectedChildTwo }) {
  const currentComponent = useMemo(() => {

    if (currentMenu === "MobileMenu" ) return <MobileMenuMain selectedChildTwo={selectedChildTwo} />;
    if (currentMenu === "TabletMenu" ) return <TabletMenuMain  />;
    if (currentMenu === "DesktopMenu" ) return <DesktopMenuMain  />;
  }, [currentMenu , selectedChildTwo]);
  console.log("currentMenu" , currentMenu);
  console.log("selectedChildTwo" , selectedChildTwo);
  return (
    <Box>
      {currentComponent}
    </Box>
  );
}