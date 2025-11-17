import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { usePopover } from "src/hooks/use-popover";
import { Iconify } from "src/components/iconify";

export const CustomFilterBoolean = ({
  label,
  field = {},
  onSetField = () => { },
}) => {
  const [switchValue, setSwitchValue] = useState(false);
  const popover = usePopover();

  useEffect(() => {
    setSwitchValue(field?.filter?.query == "true" ? true : false);
  }, [field])

  const handleUpdateFilter = () => {
    onSetField((prev) => {
      return prev?.map((item) => {
        if (item?.custom_id === field?.id) {
          return {
            ...item,
            filter: {
              field_id: field?.id,
              field_type: field?.field_type,
              query: !switchValue === false ? 'false' : 'true',
            },
          };
        } else {
          return item;
        }
      });
    });
    setSwitchValue(!switchValue);
    popover.handleClose();
  };

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
        <Stack sx={{ p: 2 }} direction="row" alignItems="center" spacing={7}>
          <Typography variant="subtitle1">{label}:</Typography>
          <Switch checked={switchValue} onChange={handleUpdateFilter} />
        </Stack>
      </Menu>
    </>
  );
};
