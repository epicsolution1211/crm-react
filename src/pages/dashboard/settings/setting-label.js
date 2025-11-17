import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ListItem from "@mui/material/ListItem";

export const SettingLabel = (props) => {
  const { active, menu, ...other } = props;

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
        {menu?.icon}
        <Box sx={{ flexGrow: 1, ml: 1 }}>{menu?.label ?? ""}</Box>
      </ButtonBase>
    </ListItem>
  );
};
