import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";

import { usePopover } from "src/hooks/use-popover";
import { Iconify } from "src/components/iconify";

export const FilterBoolean = ({
  label,
  setValue,
  value = false,
}) => {
  const popover = usePopover();

  return (
    <>
      <Button
        color="inherit"
        endIcon={<Iconify icon="icon-park-outline:down" width={20} />}
        sx={{ p: 0 }}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
      >
        <Typography
          fontSize={14}
          fontWeight="600"
          sx={{ whiteSpace: "nowrap" }}
        >
          {label}
        </Typography>
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { px: 2 } }}
      >
        <Stack sx={{ px: 2, py: 1 }} direction="row" alignItems="center" spacing={7}>
          <Switch checked={value} onChange={() => setValue(!value)} />
        </Stack>
      </Menu>
    </>
  );
};
