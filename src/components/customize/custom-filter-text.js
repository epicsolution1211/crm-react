import {  useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";

import { usePopover } from "src/hooks/use-popover";
import { Iconify } from 'src/components/iconify';

export const CustomFilterText = ({
  label,
  placeholder,
  field = {},
  onSetField = () => { },
}) => {
  const popover = usePopover();
  const [text, setText] = useState("");

  const handleUpdateFilter = () => {
    onSetField(prev => {
      return prev?.map(item => {
        if (item?.custom_id === field?.id) {
          return {
            ...item,
            filter: {
              field_id: field?.id,
              field_type: field?.field_type,
              query: text
            },
          }
        } else {
          return item;
        }
      });
    });
    popover.handleClose();
    setText("");
  }

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
        <Stack sx={{ p: 2 }} direction="row" alignItems="center" spacing={2}>
          <OutlinedInput placeholder={placeholder} value={text} onChange={(e) => {
            e.preventDefault();
            setText(e?.target?.value);
          }} />

          <IconButton onClick={handleUpdateFilter}>
            <Iconify icon="material-symbols:check" width={26} color="primary.main"/>
          </IconButton>
        </Stack>
      </Menu>
    </>
  );
};
