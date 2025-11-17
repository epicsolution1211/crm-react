import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";

import { Iconify } from 'src/components/iconify';
import { settingsApi } from "src/api/settings";
import CustomModal from "src/components/customize/custom-modal";
import { SelectMenu } from "src/components/customize/select-menu";

const validationSchema = yup.object({
  sms: yup.string().required("SMS is a required field"),
});

const useGetCompanyNumbers = () => {
  const [numbers, setNumbers] = useState([]);
  const [coperatoDefault, setCoperatoDefault] = useState(false);

  const handleGetNumbers = async () => {
    try {
      const request = {
        call_system: 2,
      };
      const { provider } = await settingsApi.getCallProvider(request);
      if (provider?.setting?.sms_from) {
        setNumbers(provider?.setting?.sms_from);
      } else {
        setNumbers([]);
      }
      if (provider?.default) setCoperatoDefault(true);
    } catch (error) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    handleGetNumbers();
  }, []);

  return {
    numbers,
    coperatoDefault,
    handleGetNumbers,
  }
}

export const CustomerCreateSms = ({
  open,
  onClose,
  onSmsCreate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const { numbers, coperatoDefault } = useGetCompanyNumbers();

  useEffect(() => {
    if (numbers?.length > 0 && coperatoDefault) {
      setValue("source_sms_number", numbers?.[0]);
    }
  }, [numbers, coperatoDefault]);

  const onSubmit = async (data) => {
    await onSmsCreate(data?.sms, data?.source_sms_number);
    reset();
  };

  return (
    <CustomModal
      width={500}
      onClose={() => {
        onClose();
      }}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography
            id="modal-modal-title"
            align="center"
            sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
          >
            Send SMS
          </Typography>
          <IconButton
            onClick={() => {
              onClose();
            }}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              '&:hover': { color: 'primary.main'}
            }}
          >
            <Iconify icon="gravity-ui:xmark" width={24}/>
          </IconButton>
          {coperatoDefault && (
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <SelectMenu
                control={control}
                label="Send from"
                list={numbers?.map(number => ({ label: number, value: number }))}
                name="source_sms_number"
              />
            </Stack>
          )}
          <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
            <TextField
              fullWidth
              autoFocus
              multiline
              error={!!errors?.sms?.message}
              helperText={errors?.sms?.message}
              label="SMS"
              name="sms"
              type="text"
              {...register("sms")}
            />
          </Stack>
          <Stack sx={{ gap: 2, pt: 1 }} direction="row" justifyContent="center">
            <LoadingButton 
              loading={isSubmitting} 
              disabled={isSubmitting}
              variant="contained" 
              type="submit" 
              sx={{ width: 80 }}
            >
              Send
            </LoadingButton>
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </CustomModal>
  );
};
