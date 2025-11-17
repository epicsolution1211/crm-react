import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItem from "@mui/material/ListItem";

export const IntegrationLabel = (props) => {
  const { active, menu, ...other } = props;

  return (
    <ListItem
      disableGutters
      disablePadding
      dense
      sx={{
        "& + &": {
          mt: 0.5,
        },
      }}
      {...other}
    >
      <ButtonBase
        sx={{
          borderRadius: 1,
          color: "text.secondary",
          flexGrow: 1,
          fontSize: (theme) => theme.typography.body2.fontSize,
          fontWeight: (theme) => theme.typography.button.fontWeight,
          justifyContent: "flex-start",
          lineHeight: (theme) => theme.typography.body2.lineHeight,
          py: 0.75,
          px: 1.5,
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
        {menu?.icon}
        <Box sx={{ flexGrow: 1, ml: 1 }}>{menu?.label ?? ""}</Box>
      </ButtonBase>
    </ListItem>
  );
};

IntegrationLabel.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  menu: PropTypes.object,
};
