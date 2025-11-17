import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from 'src/components/iconify';
import { SelectMenu } from "src/components/customize/select-menu";
import { merchantApi } from "src/api/payment_audit/merchant_api";
import { bankProviderApi } from "src/api/payment_audit/bank_provider";
import { paymentTypeApi } from "src/api/payment_audit/payment_type";


const validationSchema = yup.object({});

export const RecordStep = ({ onNext, isPending }) => {
  const { control, handleSubmit, register } = useForm({
    resolver: yupResolver(validationSchema),
  });
  
  const [merchantsList, setMerchantsList] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [bankProvidersList, setBankProvidersList] = useState([]);
  
  const currenciesList = [
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
    
  const recordItems = [
    { name: "d_id", label: "Internal ID" },
    { name: "d_reference_id", label: "Reference ID" },
    { name: "d_account", label: "Account" },
    { name: "d_client_name", label: "Client Name", type: "select", list: merchantsList },
    { name: "d_client_type", label: "Client Type" },
    { name: "d_account_provider_number", label: "Account Provider Number" },
    { name: "d_status", label: "Status" },
    { name: "d_type", label: "Type" },
    { name: "d_amount", label: "Amount" },
    { name: "d_currency", label: "Currency", type: "select", list: currenciesList },
    { name: "d_remitter_name", label: "Remitter Name" },
    { name: "d_remitter_account", label: "Remitter Account" },
    { name: "d_beneficiary_type", label: "Beneficiary Type" },
    { name: "d_beneficiary_name", label: "Beneficiary Name" },
    { name: "d_bank_account_number", label: "Bank Account Number" },
    { name: "d_bic", label: "Bic", type: "select", list: bankProvidersList },
    { name: "d_description", label: "Description" },
    { name: "d_charge_type", label: "Charge Type" },
    { name: "d_provider", label: "Provider", type: "select", list: providersList },
    { name: "d_provider_id", label: "Provider ID" },
    { name: "d_partner_id", label: "Partner ID" },
    { name: "d_created", label: "Created At" },
    { name: "d_updated", label: "Updated At" },
];

  const onSubmit = (data) => {
    onNext(data);
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
    getMerchants();
    getBankProviders();
    getPaymentType();
  }, []);

  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            {recordItems.map((recordItem) => (
              <Grid key={recordItem.name} xs={6} sx={{alignContent: 'flex-end'}}>
                {recordItem.type === "select" ? (
                  <SelectMenu control={control} label={recordItem.label} name={recordItem.name} list={recordItem.list} />
                ) : (
                  <Stack spacing={2}>
                    <Typography>{recordItem.label}</Typography>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label={recordItem.label}
                      name={recordItem.name}
                      {...register(recordItem.name)}
                    />
                  </Stack>
                )}
              </Grid>
            ))}
          </Grid>
        </Stack>
        <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
          <LoadingButton
            type="submit"
            loading={isPending}
            variant="contained"
            endIcon={<Iconify icon="ri:arrow-right-line"/>}
          >
            Finish
          </LoadingButton>
        </Stack>
      </form>
    </Stack>
  );
};
