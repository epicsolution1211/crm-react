import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItem from "@mui/material/ListItem";
import { Iconify } from "src/components/iconify";

export const SettingLabel = (props) => {
  const { active, menu, ...other } = props;

  const icon = {
    email_templates: <Iconify icon="qlementine-icons:template-16" width={18} />,
    company_emails: <Iconify icon="ic:outline-email" width={18} />,
    global_smtp_settings: <Iconify icon="ic:outline-email" width={18} />,
    email_signature: <Iconify icon="ic:outline-email" width={18} />,
    automated_emails: <Iconify icon="ic:outline-email" width={18} />,
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
