import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { customersApi } from "src/api/customers";
import CountryInput from "src/components/customize/country-input";

export const CustomerChangeCountry = ({ customerId, open, onClose, onGetClient, defaultCountry }) => {
  const { control, setValue, handleSubmit } = useForm();

  useEffect(() => {
    if (defaultCountry) setValue("residence_country", defaultCountry);
  }, [defaultCountry]);

  const onSubmit = async (data) => {
    try {
      await customersApi.updateCustomer({
        id: customerId,
        residence_country: data?.residence_country,
      });
      toast.success("Country of residence successfully updated!");
      onClose();
      setTimeout(() => {
        onGetClient();
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Container maxWidth="sm">
        <Stack px={5} py={5}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Typography variant="h5" sx={{ alignSelf: "center" }}>
                Country of residence
              </Typography>

              <CountryInput
                control={control}
                label="Residence country*"
                name="residence_country"
                defaultCountry={defaultCountry}
              />

              <Button
                variant="contained"
                type="submit"
                sx={{ alignSelf: "center" }}
              >
                Update
              </Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Dialog>
  );
};
