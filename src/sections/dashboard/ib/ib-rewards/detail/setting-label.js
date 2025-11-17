import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItem from "@mui/material/ListItem";

import { Iconify } from 'src/components/iconify';

export const SettingLabel = (props) => {
  const { active, menu, ...other } = props;

  const icon = {
    setting: <Iconify icon="solar:settings-linear" />,
    account_type: <Iconify icon="material-symbols:account-circle-outline" />,
    assets: <Iconify icon="f7:money-dollar-circle" />,
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

SettingLabel.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
};
