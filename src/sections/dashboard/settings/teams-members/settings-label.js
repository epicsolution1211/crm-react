import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItem from "@mui/material/ListItem";
import { Person, Group, BusinessCenter, AssignmentInd, Assignment } from "@mui/icons-material";

export const SettingsLabel = (props) => {
  const { active, menu, ...other } = props;

  const icon = {
    members: <Person fontSize="small" />,
    teams: <Group fontSize="small" />,
    desk: <BusinessCenter fontSize="small" />,
    roles: <AssignmentInd fontSize="small" />,
    "report-groups": <Assignment fontSize="small" />,
  };

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
        {menu?.icon || icon[menu?.value]}
        <Box sx={{ flexGrow: 1, ml: 1 }}>{menu?.label ?? ""}</Box>
      </ButtonBase>
    </ListItem>
  );
};

SettingsLabel.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  menu: PropTypes.object,
}; 