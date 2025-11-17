import { useEffect, useMemo } from "react";
import * as yup from "yup";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSwitch from "src/components/customize/custom-switch";
import { settingsApi } from "src/api/settings";

const validationSchema = yup.object({
  auto_logout_time: yup
    .number()
    .min(1, "Auto logout time must be more than 1.")
    .transform((value) => (isNaN(value) ? undefined : value)),
});

export const SettingsPlatformLogout = ({ company, handleCompanyGet }) => {
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const isActive = useWatch({ control, name: "auto_logout" });
  const value = useWatch({ control, name: "auto_logout_time" });

  const isButtonDisable = useMemo(() => {
    return isActive ? (value > 0 ? false : true) : false;
  }, [isActive, value, company]);

  const onSubmit = async (data) => {
    if (!isActive) {
      delete data.auto_logout_time;
    }
    try {
      await settingsApi.updateCompany({ id: company?.id, data });
      toast.success("Auto logout info successfully updated!");
      handleCompanyGet();
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (company?.auto_logout_time) {
      setValue("auto_logout_time", company?.auto_logout_time);
    } else {
      setValue("auto_logout_time", "");
    }

    if (company?.auto_logout) {
      setValue("auto_logout", company?.auto_logout);
    } else {
      setValue("auto_logout", false);
    }
  }, [company]);

  useEffect(() => {
    if (!isActive) {
      setError("auto_logout_time", { message: "" });
    }
  }, [isActive]);

  return (
    <Card>
      <CardHeader title="Auto logout" />
      <CardContent sx={{ pt: 0 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" gap={2} alignItems="end" pt={3} pb={2}>
            <Stack direction="column" gap={1}>
              <CustomSwitch
                control={control}
                name="auto_logout"
                label="Active"
              />
              <TextField
                {...register("auto_logout_time")}
                type="number"
                label="Logout user after"
                variant="filled"
                error={!!errors?.auto_logout_time?.message}
                helperText={errors?.auto_logout_time?.message}
                InputLabelProps={{ shrink: true }}
                disabled={!isActive}
              />
            </Stack>
            <Stack pb={1}>
              <Button
                disabled={isButtonDisable}
                type="submit"
                variant="contained"
              >
                Update
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
