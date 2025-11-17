import { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePopover } from "src/hooks/use-popover";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";

import { useAuth } from "src/hooks/use-auth";
import { Iconify } from "src/components/iconify";

export const CustomFilterMulti = ({
  label,
  setting = {},
  field = {},
  onSetField = () => {},
}) => {
  const [multiValue, setMultiValue] = useState("");
  const { user } = useAuth();
  const popover = usePopover();

  useEffect(() => {
    if (field?.filter) {
      setMultiValue(field?.filter?.query);
    } else {
      setMultiValue("");
    }
  }, [field]);

  const handleUpdateFilter = (e) => {
    setMultiValue(e?.target?.value);
    onSetField((prev) => {
      return prev?.map((item) => {
        if (item?.custom_id === field?.id) {
          return {
            ...item,
            filter: {
              field_id: field?.id,
              field_type: field?.field_type,
              query: e?.target?.value,
            },
          };
        } else {
          return item;
        }
      });
    });
    popover.handleClose();
  };

  const options = useMemo(() => {
    if (setting) {
      const parsedSettings = JSON.parse(setting);
      return parsedSettings?.map((s) => {
        const accessOptionKey = `acc_custom_v_${
          field?.value
        }_${s?.option?.replace(/\s+/g, "_")}`;
        const viewOptionAccess = user?.acc && user?.acc[accessOptionKey];

        if (!viewOptionAccess && viewOptionAccess !== undefined) return null;

        return s;
      });
    } else {
      return [];
    }
  }, [setting]);

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
        <Stack sx={{ p: 2 }} direction="row" alignItems="center">
          <Select
            sx={{ width: "250px" }}
            value={multiValue}
            onChange={handleUpdateFilter}
            renderValue={() => {
              return multiValue;
            }}
          >
            {[
              ...options,
            ]?.map((s) => (
              <MenuItem key={s?.id} value={s?.option}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      backgroundColor: s?.color ?? 'primary.main',
                      maxWidth: 1,
                      height: 1,
                      padding: 1,
                      borderRadius: 20,
                    }}
                  ></Box>
                  <Typography>{s?.label ?? s?.option}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Menu>
    </>
  );
};
