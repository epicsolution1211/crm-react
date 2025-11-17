import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import * as yup from "yup";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from 'src/components/iconify';
import CustomModal from "src/components/customize/custom-modal";
import { SelectMenu } from "src/components/customize/select-menu";
import CustomSwitch from "src/components/customize/custom-switch";
import { customersApi } from "src/api/customers";
import { currencyFlagMap } from "src/utils/constant";

const validationSchema = yup.object({
  name: yup.string().required("Name is a required field"),
});

export const CustomerCreateTraderAccount = ({ 
  account = {}, 
  accountTypes = [], 
  open, 
  onClose, 
  customerId, 
  onGetAccounts = () => {}, 
  isEdit = false, 
  currentEnabledBrandCurrencies = [],
  accountPermissions = {
    canCreateReal: true,
    canCreateDemo: true,
    hasExtraReal: false,
    hasExtraDemo: false
  },
  user,
  internal_brand
}) => {
  const {
    setValue,
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setValue("name", account?.name);
      setValue("t_account_type_id", account?.t_account_type_id);
      setValue("active", account?.active);
      setValue("hide", account?.hide);
      return;
    }
    if (!accountPermissions?.canCreateReal && accountPermissions?.canCreateDemo) {
      setValue("demo", true);
      return;
    }
    if (accountPermissions?.canCreateReal && !accountPermissions?.canCreateDemo) {
      setValue("demo", false);
    }
  }, [open, isEdit, account?.id, accountPermissions?.canCreateReal, accountPermissions?.canCreateDemo, setValue]);

  useEffect(() => {
    if (!isEdit) {
      reset();
    }
  }, [isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      const request = {
        client_id: customerId,
        ...data,
      };
      if (isEdit) {
        await customersApi.updateTraderAccount(account?.id, request);
        toast.success("Trader account successfully updated!");
      } else {
        await customersApi.createTraderAccount(request);
        toast.success("Trader account successfully created!");
      }
      setTimeout(() => {
        onGetAccounts();
        reset();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const isDemoSwitchDisabled = !isEdit && (
    (!accountPermissions.canCreateReal && accountPermissions.canCreateDemo) || 
    (accountPermissions.canCreateReal && !accountPermissions.canCreateDemo)
  );

  return (
    <CustomModal onClose={onClose} open={open} width={500}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1.5} sx={{ width: 400 }}>
          <Typography
            id="modal-modal-title"
            align="center"
            sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
          >
            {isEdit ? "Update" : "Create"} Trader Account
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              '&:hover': { color: 'primary.main' },
            }}
          >
            <Iconify icon="gravity-ui:xmark" />
          </IconButton>
          {(!isEdit || (user?.acc?.acc_e_agent_t_account_name !== false && internal_brand?.acc_agent_t_account_name === true)) && (
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                multiline
                label="Name"
                name="name"
                type="text"
                error={!!errors?.name?.message}
                helperText={errors?.name?.message}
                {...register("name")}
              />
            </Stack>
          )}
          {
            !isEdit && (
              <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
                <SelectMenu
                  name="currency"
                  control={control}
                  label="Select a currency"
                  list={currentEnabledBrandCurrencies?.map((currency) => ({
                    label: currency?.name,
                    value: currency?.key,
                    icon: currencyFlagMap[currency?.key],
                  }))}
                  isIcon
                />
              </Stack>
            )
          }
          <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
            <SelectMenu
              name="t_account_type_id"
              control={control}
              label="Select an account type"
              list={accountTypes}
            />
          </Stack>
          {
            !isEdit && (
              <Stack sx={{ py: 2, gap: 2 }} direction="row" justifyContent="flex-start" alignItems="center">
                <Typography variant="h6">Demo:</Typography>
                <CustomSwitch 
                  control={control} 
                  name="demo" 
                  disabled={isDemoSwitchDisabled}
                />
              </Stack>
            )
          }
          {isEdit && (
            <Stack sx={{ py: 2, gap: 2 }} direction="row" justifyContent="flex-start" alignItems="center">
              <Typography variant="h6">Active:</Typography>
              <CustomSwitch control={control} name="active" />
            </Stack>
          )}
          {isEdit && (
            <Stack sx={{ py: 2, gap: 2 }} direction="row" justifyContent="flex-start" alignItems="center">
              <Typography variant="h6">Hide:</Typography>
              <CustomSwitch control={control} name="hide" />
            </Stack>
          )}
          <Stack sx={{ gap: 2, pt: 1 }} direction="row" justifyContent="center">
            <LoadingButton 
              loading={isSubmitting} 
              disabled={isSubmitting}
              variant="contained" 
              type="submit" 
              sx={{ width: 80 }}
            >
              {isEdit ? "Update" : "Create"}
            </LoadingButton>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </CustomModal>
  );
};
