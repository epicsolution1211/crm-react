import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";

import { usePopover } from "src/hooks/use-popover";
import { Iconify } from 'src/components/iconify';

export const CustomFilterNumber = ({
  label,
  placeholder,
  field = {},
  onSetField = () => { },
}) => {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const popover = usePopover();

  const handleUpdateFilter = () => {
    onSetField((prev) => {
      return prev?.map((item) => {
        if (item?.custom_id === field?.id) {
          return {
            ...item,
            filter: {
              ...item?.filter,
              field_id: field?.id,
              field_type: field?.field_type,
              query: {
                gt: min ? min : "",
                lt: max ? max : "",
              },
            },
          };
        } else {
          return item;
        }
      });
    });
    popover.handleClose();
    setMin("");
    setMax("");
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
        <Typography fontSize={14} fontWeight="600" sx={{ whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { px: 2 } }}
      >
        <Stack alignItems="center" direction='row' sx={{ p: 2, gap: 1 }}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            spacing={2}
          >
            <OutlinedInput
              type="number"
              placeholder={`Min ${placeholder}...`}
              value={min}
              onChange={(e) => {
                e.preventDefault();
                setMin(e?.target?.value);
              }}
            />
            <OutlinedInput
              type="number"
              placeholder={`Max ${placeholder}...`}
              value={max}
              onChange={(e) => {
                e.preventDefault();
                setMax(e?.target?.value);
              }}
            />
          </Stack>
          <IconButton onClick={handleUpdateFilter}>
            <Iconify icon="material-symbols:check" width={26} color="primary.main"/>
          </IconButton>
        </Stack>
      </Menu>
    </>
  );
};
