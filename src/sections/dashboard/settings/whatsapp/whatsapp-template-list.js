import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { useSettings } from "src/hooks/use-settings";

export const WhatsAppTemplateList = ({
  whatsappTemplateList,
  setAddBtn,
  selectedWhatsappTemplateId,
  setSelectedWhatsappTemplateId,
  setIsOpenEditModal,
  // setIsOpenDeleteModal,
}) => {
  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);

  const getCategoryColor = (category) => {
    switch (category) {
      case "UTILITY":
        return "info";
      case "MARKETING":
        return "success";
      case "AUTHENTICATION":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <>
      <Scrollbar sx={{ height: { md: "calc(100vh - 470px)", xs: "auto" }, pr: 1.5 }}>
        <Stack direction="column" gap={1}>
          {whatsappTemplateList?.map((item) => {

            return (
            <Paper
              key={item?.id}
              sx={{
                ...cssVars,
                cursor: "pointer !important",
                backgroundColor:
                  settings.paletteMode == "dark" ? "var(--nav-bg)" : "background.default",
                py: 1.5,
                px: 2,
                boxShadow: 8,
                border: 1,
                borderColor:
                  selectedWhatsappTemplateId == item.id
                    ? "primary.main"
                    : settings.paletteMode == "dark"
                    ? "background.default"
                    : "text.disabled",
                minHeight: 68,
                "&:hover": {
                  cursor: "Point",
                  "& .hide": {
                    opacity: 1,
                    transition: "opacity 0.2s ease, height 0.2s ease",
                  },
                },
              }}
            >
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                onClick={() => {
                  setSelectedWhatsappTemplateId(item?.id);
                }}
              >
                  <Stack spacing={1} flex={1}>
                  <Typography variant="body2" fontWeight={600}>
                    {item?.name}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={item?.category}
                      size="small"
                      color={getCategoryColor(item?.category)}
                      variant="outlined"
                    />
                    <Chip
                      label={item?.language}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={item?.active ? "Active" : "Inactive"}
                      size="small"
                      color={item?.active ? "success" : "default"}
                      variant={item?.active ? "filled" : "outlined"}
                    />
                  </Stack>
                </Stack>
                <Stack direction="row">
                  <Tooltip placement="bottom" title="Edit">
                    <Box
                      className="hide"
                      sx={{
                        opacity: 0,
                        transition: "opacity 0.2s ease, height 0.2s ease",
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpenEditModal(true);
                          setAddBtn(false);
                          setSelectedWhatsappTemplateId(item?.id);
                        }}
                        sx={{ color: "primary.main" }}
                      >
                        <Iconify icon="mage:edit" />
                      </IconButton>
                    </Box>
                  </Tooltip>
                  {/* <Tooltip placement="bottom" title="Delete">
                    <Box
                      className="hide"
                      sx={{
                        opacity: 0,
                        transition: "opacity 0.2s ease, height 0.2s ease",
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpenDeleteModal(true);
                          setSelectedWhatsappTemplateId(item?.id);
                        }}
                        sx={{ color: "error.main" }}
                      >
                        <Iconify icon="heroicons:trash" />
                      </IconButton>
                    </Box>
                  </Tooltip> */}
                </Stack>
              </Stack>
            </Paper>
            );
          })}
        </Stack>
      </Scrollbar>
    </>
  );
};
