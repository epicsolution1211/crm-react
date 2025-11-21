import { Collapse, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItem from "@mui/material/ListItem";
import { useCallback, useState } from "react";

import { Iconify } from "src/components/iconify";

export const SettingLabel = (props) => {
  const { active, menu, depth = 0, disabled = false ,selectedChildOne , selectedChildTwo , ...other } = props;
  const theme = useTheme()
  const [open, setOpen] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [selectedChild , setSelectedChild] = useState(menu?.children?.[0]?.value)
  const [selectedChildTwoState , setSelectedChildTwoState] = useState(menu?.children?.[0]?.children?.[0]?.value)

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
          onClick={()=>{
            handleToggle()
            props?.onClick?.()
          }}
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
            "&:hover": {
            backgroundColor: "action.hover",
          },
          ...(active && {
            backgroundColor: "action.selected",
            color: "text.primary",
          }),
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
        <Collapse in={open} sx={{ mt: 0.5 , pl:1 }} >
        <Box sx={{
          borderLeft:`1px solid ${theme.palette.neutral[700]}`,
          pl:1
        }}>

          {menu?.children.map((item) => (
            <li key={item?.value}>
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
                onClick={()=>{
                  selectedChildOne(item?.value)
                  if(item?.children) {
                    setOpenCollapse(true)
                  } else {
                    setOpenCollapse(false)
                  }
                }}
              >
                {icon[item?.value]}
                <Box sx={{ flexGrow: 1, ml: 1 }}>{item?.label ?? ""}</Box>
              </ButtonBase>

              { item?.value === selectedChild && <Box sx={{
                position:"absolute",
                left:-9.5,
                height:"23px",
                width:"2px",
                borderRadius:"1px",
                bgcolor:theme.palette.neutral[500]
              }}/>}
            </ListItem>
            {
              item?.children &&
              <Collapse in={openCollapse} sx={{ mt: 0.5 , pl:1 }} >
                <Box sx={{
                  pl:1
                }}>

            {item?.children.map((item) => (
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
               onClick={()=>setSelectedChildTwoState(item?.value) }
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
                   ...(item?.value === selectedChildTwoState && {
                     backgroundColor: "action.selected",
                     color: "text.primary",
                   }),
                 }}
                 onClick={()=>selectedChildTwo(item?.value)}
               >
                 <Box sx={{ flexGrow: 1, ml: 1 }}>{item?.label ?? ""}</Box>
               </ButtonBase>
             </ListItem>
            ))}
                </Box>
            </Collapse>
            }
            </li>
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
