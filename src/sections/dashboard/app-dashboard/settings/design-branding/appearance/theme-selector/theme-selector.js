import { Box, Button, Divider, Typography } from "@mui/material";

import { HeaderSection } from "../../components/header";
import { Iconify } from "src/components/iconify";
import {  useRef, useState } from "react";
import { ThemeItem } from "./theme-item";

export function ThemeSelector() {
  const scrollContainerRef = useRef(null);
  const [selectedBaner , setSelectedBaner] = useState(null);
  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 250, 
        behavior: "smooth",
      });
    }
  };

  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -250, 
        behavior: "smooth",
      });
    }
  };
  return (
    <Box display={"grid"} width={"100%"}>
      <HeaderSection
        title={"Theme Selector"}
        subtitle={
          "If you’ve just made a payment, it may take a few hours for it to appear in the table below."
        }
      />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pt={2}
        px={3}
        my={2}
      >
        <Typography sx={{ fontWeight: 500, fontSize: "25px" }}>
          Available themes
        </Typography>
        <Box display={"flex"} alignItems={"center"} gap={3}>
          <Button
            variant="contained"
            color={"inherit"}
            size={"small"}
            sx={{ py: 1 , px:0 ,borderRadius:"5px" , minWidth:"30px" }}
            onClick={scrollToLeft}
          >
            <Iconify icon={"ep:arrow-left-bold"} width={12} />
          </Button>
          <Button
            variant="contained"
            color={"inherit"}
            size={"small"}
            sx={{ py: 1 , px:0 , borderRadius:"5px", minWidth:"30px" }}
            onClick={scrollToRight}
          >
            <Iconify icon={"ep:arrow-right-bold"} width={12} />
          </Button>
        </Box>
      </Box>
  

      <Box
        ref={scrollContainerRef}
        sx={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          gap: 2,
          flexWrap: "nowrap",
          scrollBehavior: "smooth",
          px:3,
          pb:2,
          "& > *": {
            flex: "0 0 auto",
          },
          "&::-webkit-scrollbar": { display: "none" },
          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        <ThemeItem
          themeId={"1"}
          url={"/assets/baners/baner-one.png"}
          title={"Purple Plus T"}
          subtitle={"Introductory course for design and framework basics"}
          selected={selectedBaner}
          onChange ={((event) => setSelectedBaner(event.target.value))}
        />
        <ThemeItem
          themeId={"2"}
          url={"/assets/baners/baner-two.png"}
          title={"Dark Blue Moon"}
          subtitle={"Introductory course for design and framework basics"}
          selected={selectedBaner}
          onChange ={((event) => setSelectedBaner(event.target.value))}
        />
        <ThemeItem
          themeId={"3"}
          url={"/assets/baners/baner-one.png"}
          title={"Dark Blue Moon"}
          subtitle={"Introductory course for design and framework basics"}
          selected={selectedBaner}
          onChange ={((event) => setSelectedBaner(event.target.value))}
        />
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          py: 3,
          px: 3,
        }}
      >
        <Button variant="text" color={"inherit"}>
          Cancel
        </Button>
        <Button variant="contained">Save Changes</Button>
      </Box>
    </Box>
  );
}
