import * as Yup from "yup";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { brandsApi } from "src/api/lead-management/brand";
import { useEffect, useState } from "react";
import { AdditionalParams } from "./additional-params";
import CustomSwitch from "src/components/customize/custom-switch";

function convertString(string) {
  // Remove the leading "l_" from the string
  const withoutPrefix = string.substring(2);

  // Split the string into individual words using underscores as separators
  const words = withoutPrefix.split("_");

  // Capitalize the first letter of each word and join them with a space
  const convertedString = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return convertedString;
}

const validationSchema = Yup.object({
  webhook_url: Yup.string()
    .url("Webhook URL must be a valid URL")
    .required("Webhook URL is required"),
});

const initialParams = [
  {
    key: "l_brand_status",
    enabled: "l_brand_status_enabled",
  },
  {
    key: "l_country",
    enabled: "l_country_enabled",
  },
  {
    key: "l_deposit",
    enabled: "l_deposit_enabled",
  },
  {
    key: "l_deposit_error",
    enabled: "l_deposit_error_enabled",
  },
  {
    key: "l_deposit_validated",
    enabled: "l_deposit_validated_enabled",
  },
  {
    key: "l_email",
    enabled: "l_email_enabled",
  },
  {
    key: "l_email_validated",
    enabled: "l_email_validated_enabled",
  },
  {
    key: "l_first_name",
    enabled: "l_first_name_enabled",
  },
  {
    key: "l_last_name",
    enabled: "l_last_name_enabled",
  },
  {
    key: "l_ftd_amount",
    enabled: "l_ftd_amount_enabled",
  },
  {
    key: "l_ftd_amount_error",
    enabled: "l_ftd_amount_error_enabled",
  },
  {
    key: "l_ftd_amount_validated",
    enabled: "l_ftd_amount_validated_enabled",
  },
  {
    key: "l_ftd_date",
    enabled: "l_ftd_date_enabled",
  },
  {
    key: "l_ftd_date_error",
    enabled: "l_ftd_date_error_enabled",
  },
  {
    key: "l_ftd_date_validated",
    enabled: "l_ftd_date_validated_enabled",
  },
  {
    key: "l_id",
    enabled: "l_id_enabled",
  },
  {
    key: "l_ip_address",
    enabled: "l_ip_address_enabled",
  },
  {
    key: "l_label_set",
    enabled: "l_label_set_enabled",
  },
  {
    key: "l_language",
    enabled: "l_language_enabled",
  },
  {
    key: "l_language_error",
    enabled: "l_language_error_enabled",
  },
  {
    key: "l_language_validated",
    enabled: "l_language_validated_enabled",
  },
  {
    key: "l_note",
    enabled: "l_note_enabled",
  },
  {
    key: "l_phone",
    enabled: "l_phone_enabled",
  },
  {
    key: "l_phone_error",
    enabled: "l_phone_error_enabled",
  },
  {
    key: "l_phone_validated",
    enabled: "l_phone_validated_enabled",
  },
  {
    key: "l_registration_date",
    enabled: "l_registration_date_enabled",
  },
  {
    key: "l_registration_date",
    enabled: "l_registration_date_enabled",
  },
  {
    key: "l_registration_date_error",
    enabled: "l_registration_date_error_enabled",
  },
  {
    key: "l_registration_date_validated_error",
    enabled: "l_registration_date_validated_enabled",
  },
  {
    key: "l_source",
    enabled: "l_source_enabled",
  },
  {
    key: "l_status",
    enabled: "l_status_enabled",
  },
  {
    key: "l_verified",
    enabled: "l_verified_enabled",
  },
  {
    key: "l_verified_error",
    enabled: "l_verified_error_enabled",
  },
  {
    key: "l_brand_name",
    enabled: "l_brand_name_enabled",
  },
];

export const BrandWebhook = ({ brand, leadCustomFields }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      webhook_url: brand?.webhook_url,
    },
  });

  const {
    handleSubmit: handleParamSubmit,
    register: paramRegister,
    control: paramControl,
    reset: paramReset,
    setValue: paramSetValue,
  } = useForm();

  useEffect(() => {
    if (brand) {
      paramReset(brand);
    }
    if (brand && leadCustomFields.length > 0) {
      leadCustomFields.forEach((item) => {
        if (!brand[`lc_${item?.friendly_name?.replace(/\s+/g, "_")}`]) {
          paramSetValue(
            `lc_${item?.friendly_name?.toLowerCase()?.replace(/\s+/g, "_")}`,
            `lc_${item?.friendly_name?.toLowerCase()?.replace(/\s+/g, "_")}`
          );
        }
        if (
          !brand[
            `lc_${item?.friendly_name
              ?.toLowerCase()
              ?.replace(/\s+/g, "_")}_enabled`
          ]
        ) {
          paramSetValue(
            `lc_${item?.friendly_name
              ?.toLowerCase()
              ?.replace(/\s+/g, "_")}_enabled`,
            false
          );
        }
      });
    }
  }, [brand, leadCustomFields]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await brandsApi.updateBrand(brand?.id, data);
      setIsLoading(false);
      toast.success("Brand webhook URL successfully updated!");
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const onParamSubmit = async (data) => {
    try {
      await brandsApi.updateBrand(brand?.id, data);
      toast.success("Brand params successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">Webhook</Typography>
          <Typography variant="h6" sx={{ color: "grey" }}>
            Traffics for this Brand will be sent with POST request to brand
            Webhook
          </Typography>
        </Stack>

        <Stack spacing={4} sx={{ mt: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center"></Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <TextField
                sx={{ width: 350 }}
                name="webhook_url"
                label="Webhook url"
                error={!!errors?.webhook_url?.message}
                helperText={errors?.webhook_url?.message}
                {...register("webhook_url")}
              />
              <Button disabled={isLoading} variant="contained" type="submit">
                Update
              </Button>
            </Stack>
          </form>
        </Stack>

        <form onSubmit={handleParamSubmit(onParamSubmit)}>
          <Stack width={1} direction="row">
            <Grid container spacing={10} mt={1} width={1}>
              <Grid xs={12} md={6}>
                <Stack spacing={3} sx={{ mt: 4 }}>
                  <Typography variant="h5" sx={{ mb: 1, pl: 2 }}>
                    Lead Params
                  </Typography>
                  {initialParams?.map((item) => (
                    <Stack
                      key={item?.key}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ maxWidth: 500 }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="start"
                        alignItems="center"
                        gap={1}
                      >
                        <CustomSwitch
                          control={paramControl}
                          name={item.enabled}
                        />
                        <Typography variant="subtitle2" minWidth={130}>
                          {convertString(item.key)}
                        </Typography>
                      </Stack>
                      <TextField
                        name={item?.key}
                        {...paramRegister(item.key)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label={convertString(item.key)}
                      />
                    </Stack>
                  ))}
                </Stack>
              </Grid>
              <Grid xs={12} md={6}>
                {leadCustomFields?.length > 0 ? (
                  <Stack spacing={3} sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ mb: 1, pl: 2 }}>
                      Lead Custom Field Params
                    </Typography>
                    {leadCustomFields?.map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        sx={{ maxWidth: 500 }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="start"
                          alignItems="center"
                          gap={1}
                        >
                          <CustomSwitch
                            control={paramControl}
                            name={`lc_${item?.friendly_name
                              ?.toLowerCase()
                              ?.replace(/\s+/g, "_")}_enabled`}
                          />
                          <Typography variant="subtitle2" minWidth={130}>
                            {item?.value}
                          </Typography>
                        </Stack>
                        <TextField
                          name={item?.key}
                          {...paramRegister(
                            `lc_${item?.friendly_name
                              ?.toLowerCase()
                              ?.replace(/\s+/g, "_")}`
                          )}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          label={item?.friendly_name}
                        />
                      </Stack>
                    ))}
                  </Stack>
                ) : null}
              </Grid>
            </Grid>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" pt={3}>
            <Button variant="contained" type="submit">
              Update
            </Button>
          </Stack>
        </form>
        <Stack direction="row">
          <Stack>
            <Stack spacing={3} sx={{ mt: 7 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Additional Params
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <AdditionalParams brandId={brand?.id} />
      </CardContent>
    </Card>
  );
};