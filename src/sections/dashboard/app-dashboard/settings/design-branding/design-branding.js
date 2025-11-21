import { Box, Stack } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { SettingsSidebar } from "../settings-sidebar";
import { MailContainer } from "../../../mail/mail-container";
import { MainBrandNameIdentity } from "./brand-name-identity/main"
import { AppearanceMain } from "./appearance/main"
import { MenuMain } from "./menu/main"

const labels = [
  { name: "Brand Name & Identity", id: "BrandNameIdentity" },
  { name: "Appearance", id: "Appearance" },
  { name: "Categories", id: "Categories" },
  { name: "Menus", id: "Menus" },
];
export function DesignBranding({ handleClose, open }) {
  const rootRef = useRef(null);
  const [currentMenu, setCurrentMenu] = useState("BrandNameIdentity");
  const [selectedChildOne, setSelectedChildOne] = useState("ThemeSelector");
  const [selectedChildTwo, setSelectedChildTwo] = useState("BottomMenuNavigation");
  const currentComponent =  useMemo(()=>{
    if (currentMenu === "BrandNameIdentity") return <MainBrandNameIdentity />
    if (currentMenu === "Appearance") return <AppearanceMain currentMenu={selectedChildOne}/>
    if (currentMenu === "Menus") return <MenuMain currentMenu={selectedChildOne} selectedChildTwo={selectedChildTwo}/>
  },[currentMenu , selectedChildOne , selectedChildTwo])
  return (
    <Box
      component="main"
      sx={{
        flex: "1 1 auto",
        position: "relative",
        
      }}
    >
      <Box
        ref={rootRef}
        sx={{
          minHeight: 600,
          display: "flex",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        }}
      >
        <SettingsSidebar
          container={rootRef.current}
          currentLabelId={"currentLabelId"}
          labels={labels}
          currentMenu={currentMenu}
          selectedChildOne={(data) => setSelectedChildOne(data)}
          selectedChildTwo={(data) => setSelectedChildTwo(data)}
          setCurrentMenu={(val) => {
            setCurrentMenu(val);
            //   setAccountId(null);
            //   setCreatedAtEnd(null);
            //   setCreatedAtStart(null);
            //   setClientId(null);
            //   setId(null);
            //   setBefore(null);
            //   setAfter(null);
            //   setIsShowAll(true);
          }}
          onClose={handleClose}
          open={open}
        />
        <MailContainer open={open}>
          <Stack >
            {currentComponent}
          </Stack>
        </MailContainer>
      </Box>
    </Box>
  );
}
