import { Collapse, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItem from "@mui/material/ListItem";
import { useCallback, useState } from "react";

import { Iconify } from "src/components/iconify";

export const SettingLabel = (props) => {
  const { active, menu, depth = 0, disabled = false, ...other } = props;
  const theme = useTheme()
  const [open, setOpen] = useState(false);
  const [selectedChild , setSelectedChild] = useState("")

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);
  const icon = {
    BrandNameIdentity: <Iconify icon="material-symbols:identity-aware-proxy-rounded" />,
    Appearance: <Iconify icon="fluent:dark-theme-24-regular" />,
    Categories: <Iconify icon="mage:dashboard-2" />,
    Menus: <Iconify icon="line-md:menu-fold-right" />,
  };

  const offset = depth === 0 ? 0 : (depth - 1) * 16;

  if (menu?.children) {
    return (
      <li>
        <ButtonBase
          disabled={disabled}
          onClick={handleToggle}
          sx={{
            alignItems: "center",
            borderRadius: 1,
            display: "flex",
            justifyContent: "flex-start",
            pl: `${16 + offset}px`,
            pr: "16px",
            py: "6px",
            textAlign: "left",
            width: "100%",
            ...(active && {
              ...(depth === 0 && {
                backgroundColor: "var(--nav-item-active-bg)",
              }),
            }),
            "&:hover": {
              backgroundColor: "var(--nav-item-hover-bg)",
            },
          }}
        >
          {icon[menu?.value] && (
            <Box
              component="span"
              sx={{
                alignItems: "center",
                color: "var(--nav-item-icon-color)",
                display: "inline-flex",
                justifyContent: "center",
                mr: 2,
                ...(active && {
                  color: "var(--nav-item-icon-active-color)",
                }),
              }}
            >
              {icon[menu?.value]}
            </Box>
          )}
          <Box
            component="span"
            sx={{
              color: "var(--nav-item-color)",
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: depth > 0 ? 13 : 14,
              fontWeight: depth > 0 ? 500 : 600,
              lineHeight: "24px",
              whiteSpace: "nowrap",
              ...(active && {
                color: "var(--nav-item-active-color)",
              }),
              ...(disabled && {
                color: "var(--nav-item-disabled-color)",
              }),
            }}
          >
            {menu?.label}
          </Box>
          <Iconify
            icon={open ? "lucide:chevron-up" : "lucide:chevron-down"}
            width={24}
            sx={{ color: "text.disabled" }}
          />
        </ButtonBase>
        <Collapse in={open} sx={{ mt: 0.5 , pl:2 }} >
        <Box sx={{
          borderLeft:`1px solid ${theme.palette.neutral[700]}`,
          pl:2
        }}>

          {menu?.children.map((item) => (
            <ListItem
              disableGutters
              disablePadding
              sx={{
                position:"relative",

                "& + &": {
                  mt: 1,
                  
                },
              }}
              {...other}
              onClick={()=>setSelectedChild(item?.value) }
            >
              <ButtonBase
                sx={{
                  borderRadius: 1,
                  color: "text.secondary",
                  flexGrow: 1,
                  fontSize: (theme) => theme.typography.button.fontSize,
                  fontWeight: (theme) => theme.typography.button.fontWeight,
                  justifyContent: "flex-start",
                  lineHeight: (theme) => theme.typography.button.lineHeight,
                  py: 1,
                  px: 2,
                  textAlign: "left",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  ...(item?.value === selectedChild && {
                    backgroundColor: "action.selected",
                    color: "text.primary",
                  }),
                }}
              >
                {icon[item?.value]}
                <Box sx={{ flexGrow: 1, ml: 1 }}>{item?.label ?? ""}</Box>
              </ButtonBase>

              { item?.value === selectedChild && <Box sx={{
                position:"absolute",
                left:-17,
                height:"33px",
                width:"2px",
                borderRadius:"1px",
                bgcolor:theme.palette.neutral[500]
              }}/>}
            </ListItem>
          ))}
        </Box>
        </Collapse>
      </li>
    );
  }

  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{
        "& + &": {
          mt: 1,
        },
      }}
      {...other}
    >
      <ButtonBase
        sx={{
          borderRadius: 1,
          color: "text.secondary",
          flexGrow: 1,
          fontSize: (theme) => theme.typography.button.fontSize,
          fontWeight: (theme) => theme.typography.button.fontWeight,
          justifyContent: "flex-start",
          lineHeight: (theme) => theme.typography.button.lineHeight,
          py: 1,
          px: 2,
          textAlign: "left",
          "&:hover": {
            backgroundColor: "action.hover",
          },
          ...(active && {
            backgroundColor: "action.selected",
            color: "text.primary",
          }),
        }}
      >
        {icon[menu?.value]}
        <Box sx={{ flexGrow: 1, ml: 1 }}>{menu?.label ?? ""}</Box>
      </ButtonBase>
    </ListItem>
  );
};
