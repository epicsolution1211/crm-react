import { Box } from "@mui/material";
import { useMemo } from "react";
import { BottomMenuNavigationMain } from "./bottom-menu-navigation/main";
import { LeftSideMenuMain } from "./left-side-menu/main";
import { AddBannerMain } from "./add-banner/main";

export function MobileMenuMain({ selectedChildTwo }) {
  const currentComponent = useMemo(() => {
    if (selectedChildTwo === "BottomMenuNavigation") return <BottomMenuNavigationMain />;
    if (selectedChildTwo === "LeftSideMenu") return <LeftSideMenuMain />;
    if (selectedChildTwo === "AddBanner") return <AddBannerMain />;
  }, [selectedChildTwo]);
  return (
    <Box>
      {currentComponent}
    </Box>
  );
}