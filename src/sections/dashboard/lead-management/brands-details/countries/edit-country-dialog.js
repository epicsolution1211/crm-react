import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { useCallback, useEffect, useState } from "react";

export const EditCountryDialog = (props) => {
  const {
    open,
    onClose,
    brandCountry = {},
    timeCapacity = [],
    onBrandCountryUpdate,
  } = props;

  const [selectedTimeCap, setSelectedTimeCap] = useState(null);

  useEffect(() => {
    if (brandCountry?.time_cap_id) setSelectedTimeCap(brandCountry.time_cap_id);
  }, [brandCountry]);

  const handleBrandCountryUpdate = useCallback(() => {
    onBrandCountryUpdate(brandCountry?.id, { time_cap_id: selectedTimeCap });
    handleClose();
  }, [onBrandCountryUpdate, selectedTimeCap, brandCountry]);

  const handleClose = useCallback(() => {
    onClose();
    setSelectedTimeCap(null);
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Container sx={{ py: 5 }}>
        <Stack sx={{ px: 5 }} spacing={5}>
          <Typography variant="h5">Update brand country</Typography>

          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Time & Capacity</Typography>
              <Select
                value={selectedTimeCap}
                onChange={(event) => setSelectedTimeCap(event?.target?.value)}
                fullWidth
              >
                {timeCapacity?.map((timeCap) => (
                  <MenuItem key={timeCap?.id} value={timeCap?.id}>
                    {timeCap?.name}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} alignSelf="flex-end">
            <Button color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleBrandCountryUpdate}
              disabled={!selectedTimeCap}
            >
              Update
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
