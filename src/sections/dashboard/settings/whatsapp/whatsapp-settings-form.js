import { useEffect, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import { Iconify } from "src/components/iconify";
import { brandsApi } from "src/api/lead-management/brand";

const validationSchema = yup.object({
  whatsapp_access_token: yup.string(),
  whatsapp_phone_number_id: yup.string(),
  whatsapp_business_account_id: yup.string(),
});

export const WhatsAppSettingsForm = ({ brandId, currentBrand, onGetBrand }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await brandsApi.updateInternalBrand(brandId, data);
      toast.success("WhatsApp settings updated successfully!");
      onGetBrand();
    } catch (error) {
      console.error("Error updating WhatsApp settings:", error);
      toast.error("Failed to update WhatsApp settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentBrand) {
      setValue("whatsapp_access_token", currentBrand?.whatsapp_access_token || "");
      setValue("whatsapp_phone_number_id", currentBrand?.whatsapp_phone_number_id || "");
      setValue("whatsapp_business_account_id", currentBrand?.whatsapp_business_account_id || "");
    }
  }, [currentBrand, setValue]);

  return (
    <Card>
      <CardHeader 
        title="WhatsApp Business API Settings" 
        subheader="Configure your WhatsApp Business API integration"
      />
      <CardContent sx={{ pt: 0 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Access Token
              </Typography>
              <TextField
                {...register("whatsapp_access_token")}
                fullWidth
                placeholder="Enter WhatsApp access token"
                error={!!errors?.whatsapp_access_token}
                helperText={errors?.whatsapp_access_token?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="mdi:key" width={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Phone Number ID
              </Typography>
              <TextField
                {...register("whatsapp_phone_number_id")}
                fullWidth
                placeholder="Enter phone number ID"
                error={!!errors?.whatsapp_phone_number_id}
                helperText={errors?.whatsapp_phone_number_id?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="mdi:phone" width={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Business Account ID
              </Typography>
              <TextField
                {...register("whatsapp_business_account_id")}
                fullWidth
                placeholder="Enter business account ID"
                error={!!errors?.whatsapp_business_account_id}
                helperText={errors?.whatsapp_business_account_id?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="mdi:business" width={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Webhook Verify Token
              </Typography>
              <TextField
                fullWidth
                value={currentBrand?.whatsapp_webhook_verify_token || "Not set"}
                disabled
                placeholder="Webhook verify token (read-only)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="mdi:webhook" width={20} />
                    </InputAdornment>
                  ),
                }}
                helperText="This token is generated automatically and cannot be edited"
              />
            </Box>

            <Stack direction="row" justifyContent="flex-end" sx={{ pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ minWidth: 120 }}
              >
                {isLoading ? "Updating..." : "Update Settings"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
