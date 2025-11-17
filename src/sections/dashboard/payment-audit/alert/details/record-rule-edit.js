import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { toast } from "react-hot-toast";

import { recordApi } from "src/api/payment_audit/record";
import { merchantApi } from "src/api/payment_audit/merchant_api";
import { SelectMenu } from "src/components/customize/select-menu";
import { bankProviderApi } from "src/api/payment_audit/bank_provider";
import { paymentTypeApi } from "src/api/payment_audit/payment_type";

export const RecordEdit = ({ recordId }) => {
  const { setValue, control, handleSubmit, register, reset } = useForm();

  const [merchantsList, setMerchantsList] = useState([]);
  const currencyList = [
    {
      value: "$ USD",
      label: "$ USD",
    },
    {
      value: "€ EU",
      label: "€ EU",
    },
    {
      value: "£ Pound",
      label: "£ Pound",
    },
    {
      value: "CA$ Canadian Dollar",
      label: "CA$ Canadian Dollar",
    },
    {
      value: "a$ Australian Dollar",
      label: "a$ Australian Dollar",
    },
  ];
  const [providersList, setProvidersList] = useState([]);
  const [bankProvidersList, setBankProvidersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await recordApi.updateRecord(recordId, data);
      setIsLoading(false);
      toast.success("Record successfully updated!");
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  const getRecord = async () => {
    try {
      const res = await recordApi.getRecord(recordId);
      reset(res?.record);
      setValue("d_client_name", res?.record?.d_client_name);
      setValue("d_provider", res?.record?.d_provider);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getMerchants = async () => {
    try {
      const res = await merchantApi.getMerchants();
      if (res?.merchants?.length) {
        setMerchantsList(
          res?.merchants?.map((m) => ({
            value: m?.name,
            label: m?.name,
          }))
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getPaymentType = async () => {
    try {
      const res = await paymentTypeApi.getPaymentTypes();
      setProvidersList(
        res?.payment_types?.map((item) => ({
          value: item?.name,
          label: item?.name,
        }))
      );
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getBankProviders = async () => {
    try {
      const res = await bankProviderApi.getBanks();
      if (res?.banks?.length) {
        setBankProvidersList(
          res?.banks?.map((m) => ({
            value: m?.name,
            label: m?.name,
          }))
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getRecord();
    getMerchants();
    getBankProviders();
    getPaymentType();
  }, [recordId]);

  return (
    <Card>
      <CardHeader title="Record Detail" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Internal ID</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Internal Id"
                    name="d_id"
                    {...register("d_id")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Reference ID</Typography>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    label="Reference Id"
                    name="d_reference_id"
                    {...register("d_reference_id")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Account</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Account"
                    name="d_account"
                    {...register("d_account")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <SelectMenu
                  control={control}
                  label="Client Name"
                  name="d_client_name"
                  list={merchantsList}
                />
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Client Type</Typography>
                  <TextField
                    fullWidth
                    label="Client Type"
                    InputLabelProps={{ shrink: true }}
                    name="d_client_type"
                    {...register("d_client_type")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Account Provider Number</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Account Provider Number"
                    name="d_account_provider_number"
                    {...register("d_account_provider_number")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Status</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Status"
                    name="d_status"
                    {...register("d_status")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Type</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Type"
                    name="d_type"
                    {...register("d_type")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Amount</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Amount"
                    name="d_amount"
                    {...register("d_amount")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <SelectMenu
                  control={control}
                  label="Currency"
                  name="d_currency"
                  list={currencyList}
                />
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Remitter Name</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Remitter Name"
                    name="d_remitter_name"
                    {...register("d_remitter_name")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Remitter Account</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Remitter Account"
                    name="d_remitter_account"
                    {...register("d_remitter_account")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Beneficiary Type</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Beneficiary Type"
                    name="d_beneficiary_type"
                    {...register("d_beneficiary_type")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Beneficiary Name</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Beneficiary Name"
                    name="d_beneficiary_name"
                    {...register("d_beneficiary_name")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Bank Account Number</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Bank Account Number"
                    name="d_bank_account_number"
                    {...register("d_bank_account_number")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <SelectMenu
                  control={control}
                  label="Bic"
                  name="d_bic"
                  list={bankProvidersList}
                />
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Description</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Description"
                    name="d_description"
                    {...register("d_description")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Charge Type</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Charge Type"
                    name="d_charge_type"
                    {...register("d_charge_type")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <SelectMenu
                  control={control}
                  label="Provider"
                  name="d_provider"
                  list={providersList}
                />
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Provider ID</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Provider Id"
                    name="d_provider_id"
                    {...register("d_provider_id")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Partner ID</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Partner Id"
                    name="d_partner_id"
                    {...register("d_partner_id")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Created At</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Created At"
                    name="d_created"
                    {...register("d_created")}
                  />
                </Stack>
              </Grid>
              <Grid xs={6}>
                <Stack spacing={2}>
                  <Typography>Updated At</Typography>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Updated At"
                    name="d_updated"
                    {...register("d_updated")}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
            <Button disabled={isLoading} variant="contained" type="submit">
              Update
            </Button>
          </CardActions>
        </CardContent>
      </form>
    </Card>
  );
};
