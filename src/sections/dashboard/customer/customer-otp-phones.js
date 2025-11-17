import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { customersApi } from "src/api/customers";
import { settingsApi } from "src/api/settings";
import { SelectMenu } from "src/components/customize/select-menu";
import { useAuth } from "src/hooks/use-auth";
import { maskPhoneNumber } from "src/utils/mask-phone";

export const useGetCompanyNumbers = () => {
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
      if (provider?.default && provider?.enabled) setCoperatoDefault(true);
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

export const CustomerOtpPhones = ({ open, onClose, numbers, customerId }) => {
  const { control, handleSubmit, setValue } = useForm();
  const { user } = useAuth();
  const { numbers: coperatoNumbers, coperatoDefault } = useGetCompanyNumbers();

  const [numbersList, setNumbersList] = useState([]);

  useEffect(() => {
    if (numbers) {
      setNumbersList(
        numbers?.map((n) => ({
          value: n?.id,
          label:
            user?.acc?.acc_v_client_phone === undefined ||
            user?.acc?.acc_v_client_phone
              ? n?.value
              : maskPhoneNumber(n?.value),
        }))
      );
    }
  }, [numbers, user]);

  useEffect(() => {
    if (coperatoNumbers?.length > 0 && coperatoDefault) {
      setValue("source_sms_number", coperatoNumbers?.[0]);
    }
  }, [coperatoNumbers, coperatoDefault]);

  useEffect(() => {
    if (numbersList?.length === 1) {
      setValue("phone_number_id", numbersList?.[0]?.value);
    }
  }, [numbersList]);

  const onSubmit = async (data) => {
    try {
      const request = {
        client_id: customerId,
        phone_number_id: data?.phone_number_id,
      };
      if (data?.source_sms_number) request["source_sms_number"] = data?.source_sms_number;
      await customersApi.sendOtp(request);
      toast.success("OTP successfully sent!");
      setValue("phone_number_id", null);
      setValue("source_sms_number", null);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm">
        <Stack px={5} py={5}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Typography variant="h5" sx={{ alignSelf: "center" }}>
                Phone numbers
              </Typography>

              {coperatoDefault && (
                <SelectMenu
                  control={control}
                  label="Send from"
                  list={coperatoNumbers?.map(number => ({ label: number, value: number }))}
                  name="source_sms_number"
                />
              )}

              <SelectMenu
                name="phone_number_id"
                control={control}
                label="Select phone number"
                list={numbersList}
              />

              <Button
                variant="contained"
                type="submit"
                sx={{ alignSelf: "center" }}
              >
                Send OTP
              </Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Dialog>
  );
};
