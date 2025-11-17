import { useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import { LoadingButton } from "@mui/lab";

import { SelectMenu } from "src/components/customize/select-menu";
import { useTraderAccounts } from "./customer-trader-accounts";
import { customersApi } from "src/api/customers";
import { currencyFlagMap } from "src/utils/constant";

const validationSchema = yup.object({
  source_trading_account_id : yup.string().required("Source Trader account is a required field"),
  destination_trading_account_id : yup.string().required("Destination Trader account is a required field"),
  amount: yup.string().required("Amount is a required field"),
});

export const CreateTransferFundModal = ({ open, onClose, customerId, currentEnabledBrandCurrencies }) => {
  const { accounts } = useTraderAccounts(customerId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    try {
      const request = {
        client_id: parseInt(customerId),
        source_trading_account_id : parseInt(data.source_trading_account_id),
        destination_trading_account_id : parseInt(data.destination_trading_account_id),
        amount : parseFloat(data.amount),
        currency: parseInt(data.currency),
        transaction_type: data?.transaction_type,
        provider: data?.provider,
      }

      await customersApi.createTransferFund(request);
      toast.success('Transfer completed successfully!');
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.errors ?? error?.response?.data?.message);
    }
  };

  useEffect(() => {
    reset();
    setValue('currency', '1');
    setValue('transaction_type', '');
    setValue('provider', '');
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">Transfer Fund</Typography>
          </Stack>
          <Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <SelectMenu
                      control={control}
                      label="Source Trading Account"
                      name="source_trading_account_id"
                      list={accounts?.map((acc) => ({
                        title: acc?.name ? acc?.name : "account " + acc?.id,
                        value: acc?.id,
                      }))}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <SelectMenu
                      control={control}
                      label="Destination Trading Account"
                      name="destination_trading_account_id"
                      list={accounts?.map((acc) => ({
                        title: acc?.name ? acc?.name : "account " + acc?.id,
                        value: acc?.id,
                      }))}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Amount
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Amount"
                        {...register("amount")}
                        error={!!errors?.amount?.message}
                        helperText={errors?.amount?.message}
                        hiddenLabel
                        type="number"
                        inputProps={{
                          step: "any",
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={6}>
                    <SelectMenu
                      isIcon
                      control={control}
                      label="Currency"
                      name="currency"
                      list={currentEnabledBrandCurrencies?.map((currency) => ({
                        label: currency?.name,
                        value: currency?.key,
                        icon: currencyFlagMap[currency?.key],
                      }))}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Transaction Type
                      </Typography>
                      <TextField
                        fullWidth
                        hiddenLabel
                        {...register("transaction_type")}
                        placeholder="Transaction Type"
                        type="text"
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={6}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Provider
                      </Typography>
                      <TextField
                        fullWidth
                        hiddenLabel
                        {...register("provider")}
                        placeholder="Provider"
                        type="text"
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 2,
                    px: 3,
                  }}
                  gap={3}
                >
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={isSubmitting}
                  >
                    Create
                  </LoadingButton>
                  <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
                    Cancel
                  </Button>
                </Box>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
