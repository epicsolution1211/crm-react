import Button from "@mui/material/Button";
import Grid from '@mui/material/Unstable_Grid2';
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { statusApi } from "src/api/lead-management/status";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { useAuth } from "src/hooks/use-auth";
import { Iconify } from 'src/components/iconify';

export const StatusCustomFieldStep = (props) => {
  const { onNext } = props;
  const { user } = useAuth();

  const [fields, setFields] = useState([]);

  const getFields = async () => {
    try {
      const res = await statusApi.getLeadCustomFields();
      setFields(res?.lead_fields);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFieldValueChange = (e, id, type = "default") => {
    e.preventDefault();

    if (type === "default") {
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === id) {
            return {
              ...item,
              field_value: e?.target?.value,
            };
          } else {
            return item;
          }
        })
      );
    } else if (type === "switch") {
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === id) {
            return {
              ...item,
              field_value: JSON.stringify(e?.target?.checked),
            };
          } else {
            return item;
          }
        })
      );
    }
  };

  useEffect(() => {
    getFields();
  }, []);

  const onSubmit = () => {
    const formData = {};

    for (let field of fields) {
      if (field?.field_value) {
        formData[field?.id] = field?.field_value;
      }
    }

    onNext(formData);
  }

  return (
    <Stack spacing={3}>
      <Grid container
        spacing={2}>
        <Stack spacing={2} width={1}>
          {fields?.map((field) => {
            const setting = JSON.parse(field?.setting);
            const accessKey = `acc_custom_v_${field?.value}`;
            const accessEditkey = `acc_custom_e_${field?.value}`;
            const viewAccess = user?.acc && user?.acc[accessKey];
            const editAccess = user?.acc && user?.acc[accessEditkey];

            if (!viewAccess && viewAccess !== undefined) return null;

            if (setting?.length) {
              return (
                <Stack
                  key={field?.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ maxWidth: "400px" }}
                >
                  <Typography>{field?.friendly_name}:</Typography>
                  <Select
                    placeholder={field?.friendly_name}
                    value={field?.field_value}
                    sx={{ width: "225px" }}
                    onChange={(e) => handleFieldValueChange(e, field?.id)}
                    disabled={
                      !user?.acc?.acc_e_client_data ||
                      (!editAccess && editAccess !== undefined)
                    }
                  >
                    {setting?.map((s) => {
                      const accessOptionKey = `acc_custom_v_${field?.value}_${s?.option?.replace(/\s+/g, "_")}`;
                      const viewOptionAccess =
                        user?.acc && user?.acc[accessOptionKey];

                      if (!viewOptionAccess && viewOptionAccess !== undefined)
                        return null;

                      return (
                        <MenuItem key={s?.id} value={s?.option}>
                          {s?.option}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Stack>
              );
            } else if (field?.field_type === "boolean") {
              return (
                <Stack
                  key={field?.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ maxWidth: "400px" }}
                >
                  <Typography>{field?.friendly_name}:</Typography>
                  <Switch
                    sx={{ mr: 10 }}
                    checked={
                      field?.field_value !== undefined &&
                        ["true", "false"].includes(field?.field_value)
                        ? JSON.parse(field?.field_value)
                        : false
                    }
                    onChange={(e) =>
                      handleFieldValueChange(e, field?.id, "switch")
                    }
                    disabled={
                      !user?.acc?.acc_e_client_data ||
                      (!editAccess && editAccess !== undefined)
                    }
                  />
                </Stack>
              );
            } else {
              return (
                <Stack
                  key={field?.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ maxWidth: "400px" }}
                >
                  <Typography>{field?.friendly_name}:</Typography>
                  <OutlinedInput
                    placeholder={field?.friendly_name}
                    value={field?.field_value}
                    onChange={(e) => handleFieldValueChange(e, field?.id)}
                    disabled={
                      !user?.acc?.acc_e_client_data ||
                      (!editAccess && editAccess !== undefined)
                    }
                  />
                </Stack>
              );
            }
          })}
        </Stack>
      </Grid>
      <Stack aligns="center"
        direction="row"
        spacing={2}>
        <Button
          onClick={onSubmit}
          endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
          variant="contained"
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};
