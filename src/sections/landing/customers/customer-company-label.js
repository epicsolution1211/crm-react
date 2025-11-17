import { useEffect, useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import TuneIcon from "@mui/icons-material/Tune";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from 'src/components/iconify';
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { SelectMenu } from "src/components/customize/select-menu";

export const LandingCompanyLabelPanel = ({ customer }) => {
  const { register, control, setValue } = useForm();

  const companies = useMemo(() => {
    if (customer) {
      return [{ label: customer?.company, value: 1 }]
    }
  }, [customer])

  const labels = useMemo(() => {
    if (customer) {
      return [{ label: customer?.client_labels[0]?.name, value: 1 }]
    }
  }, [customer])

  const internalBrandsList = useMemo(() => {
    if (customer) {
      return [{ label: customer?.internal_brand_name, value: 1 }]
    }
  }, [customer])

  const labelChip = useMemo(() => {
    return [{
      displayValue: customer?.client_labels[0]?.name,
      value: 1,
      label: "Label",
    }];
  }, [customer]);

  const [pinHidden, setPinHidden] = useState(true);

  const currentLabels = useWatch({ control, name: "label_ids" });

  useEffect(() => {
    if (customer) {
      setValue("company_id", 1);
      setValue("label_ids", [1]);
      setValue("internal_brand_id", 1);
      setValue("pin_code", "202546");
    }
  }, [customer]);

  return (
    <>
      <Card>
        <CardHeader title="Company and Labels" />
        <CardContent sx={{ pt: 2, pb: 1 }}>
          <Stack
            direction="row"
            sx={{ width: 1 }}
            gap={2}
            alignItems="center"
          >
            <Box direction="row" sx={{ width: 1 }}>
              <SelectMenu
                control={control}
                label="Select a Company"
                name="company_id"
                list={companies}
              />
            </Box>
            <IconButton
              sx={{ mt: 3 }}
              color="inherit"
            >
              <Tooltip title="Edit Company">
                <TuneIcon />
              </Tooltip>
            </IconButton>
          </Stack>

          <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
            <Typography variant="h7">Pin Code</Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                {...register("pin_code")}
                label="Pin code"
                type={pinHidden ? "password" : "text"}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setPinHidden(!setPinHidden)}>
                      <Iconify icon={!setPinHidden ? 'fluent:eye-32-filled' : 'fluent:eye-off-16-filled'}/>
                    </IconButton>
                  )
                }}
              />
              <Button
                variant="contained"
                sx={{ width: "135px" }}
              >
                Send OTP
              </Button>
            </Stack>
          </Stack>
          <>
            <Stack spacing={2} direction="column" sx={{ mt: 4 }}>
              <MultiSelectMenu
                control={control}
                label="Select Labels"
                name="label_ids"
                list={labels}
              />
            </Stack>
            {!!currentLabels?.length &&
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={1}
                sx={{ px: 1, mt: 1 }}
              >
                <ChipSet
                  chips={labelChip}
                  handleRemoveChip={
                    () => { }
                  }
                />
              </Stack>}
          </>
          <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <SelectMenu
                label="Internal Brand"
                control={control}
                name="internal_brand_id"
                list={internalBrandsList}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};