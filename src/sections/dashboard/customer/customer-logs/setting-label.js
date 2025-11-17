import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItem from "@mui/material/ListItem";

import { Iconify } from 'src/components/iconify';

export const SettingLabel = (props) => {
  const { active, menu, ...other } = props;

  const icon = {
    Client: <Iconify icon="mingcute:user-1-line" />,
    Email: <Iconify icon="mdi:email-outline" />,
    PhoneNumber: <Iconify icon="heroicons-outline:phone" />,
    ClientComment: <Iconify icon="iconamoon:comment-dots" />,
    Position: <Iconify icon="tabler:device-analytics"/>,
    TTransaction: <Iconify icon="heroicons:credit-card" />,
    Calls: <Iconify icon="mi:call" />,
    Bet: <Iconify icon="mdi:alphabet-b-box-outline" />,
  };

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
