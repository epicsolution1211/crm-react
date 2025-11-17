import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItem from "@mui/material/ListItem";

import { Iconify } from 'src/components/iconify';

export const SettingLabel = (props) => {
  const { active, menu, ...other } = props;

  const icon = {
    setting: <Iconify icon="solar:settings-linear" />,
    card: <Iconify icon="mdi:cards-outline" />,
    ico: <Iconify icon="material-symbols:radar" />,
    saving_account: <Iconify icon="material-symbols:account-circle-outline" />,
    forms: <Iconify icon="fluent:form-new-20-regular" />,
    deposit_option: <Iconify icon="fluent:money-calculator-24-regular" />,
    bank_deposit: <Iconify icon="proicons:bank" />,
    wd_form: <Iconify icon="mdi:form-outline" />,
    currencies: <Iconify icon="ph:currency-circle-dollar-duotone" />,
    account_type: <Iconify icon="mdi:account-outline" />,
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
