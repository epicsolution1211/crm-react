import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "src/components/scrollbar";

export const LogsFieldsFilter = ({ open, onClose, filters, onFiltersChange = () => { } }) => {
  const [fields, setFields] = useState({});

  useEffect(() => {
    if (filters) setFields(filters);
  }, [filters]);

  const handleFieldChange = (e, param) => {
    e.preventDefault();
    const value = e?.target?.value;

    setFields(prev => ({
      ...prev,
      [param]: value,
    }));
  }

  const handleFiltersChange = () => {
    onFiltersChange(fields);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container
        maxWidth="md"
        sx={{
          px: 2,
          py: 4,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 15,
            right: 15,
            '&:hover': { color: 'primary.main' }
          }}
        >
          <Iconify icon="gravity-ui:xmark" />
        </IconButton>
        <Typography variant="h5" px={3}>
          Fields filter
        </Typography>

        <Scrollbar sx={{ maxHeight: 600 }}>
          <Stack spacing={2} px={3} pb={3} mt={5}>
            {Object.entries(fields).map(([key, value]) => (
              <Stack
                key={key}
                sx={{ maxWidth: 350 }}
                spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="subtitle1">{key}</Typography>

                <OutlinedInput value={value} placeholder={key} onChange={(e) => handleFieldChange(e, key)} />
              </Stack>
            ))}
          </Stack>

          <Stack alignItems="flex-end" onClick={handleFiltersChange}>
            <Button variant="contained">Apply</Button>
          </Stack>
        </Scrollbar>
      </Container>
    </Dialog>
  );
};
