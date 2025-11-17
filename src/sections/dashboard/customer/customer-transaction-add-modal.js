import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import CustomSwitch from "src/components/customize/custom-switch";
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { SelectMenu } from "src/components/customize/select-menu";
import { TransactionStatusCreate } from "./transaction-status-create";
import { currencyFlagMap } from "src/utils/constant";
import { customersApi } from "src/api/customers";
import { useAuth } from "src/hooks/use-auth";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { useSettings } from "src/hooks/use-settings";
import { useTraderAccounts } from "./customer-trader-accounts";

const statusesList = [
  { label: "Approved", value: 1 },
  { label: "Pending", value: 2 },
  { label: "Rejected", value: 3 },
  { label: "Canceled", value: 4 },
];

const depositList = [
  { label: "Deposit", value: "true" },
  { label: "Withdraw", value: "false" },
  { label: "Bonus", value: "bonus" },
  { label: "Credit In", value: "credit_in" },
  { label: "Credit Out", value: "credit_out" },
];

const validationSchema = yup.object({
  transaction_type: yup.string(),
  amount: yup.string().required("Amount is a required field"),
  status: yup.string().required("Status is a required field"),
  deposit: yup.string().required("Deposit is a required field"),
  trading_account_id: yup
    .string()
    .required("Trader account is a required field"),
});

export const CreateTransactionModal = (props) => {
  const { open, onClose, handleCreateTransaction, isLoading, customerId, currentEnabledBrandCurrencies =[] } = props;

  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);

  const { user, company } = useAuth();

  const { accounts } = useTraderAccounts(customerId);

  const [statusList, setStatusList] = useState([]);
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  // Parse company.trx_settings and create transaction type options
  const transactionTypeOptions = useMemo(() => {
    if (!company?.trx_settings) {
      return [];
    }

    try {
      const trxSettings = JSON.parse(company.trx_settings);
      const options = trxSettings?.options || [];
      
      // Filter options based on user access
      return options
        .filter((option) => {
          const accessParam = `acc_v_transaction_type_option_${option?.replace(/\s+/g, "_")}`;
          return user?.acc?.[accessParam] !== false; // Show if access is not explicitly false
        })
        .map((option) => ({
          label: option,
          value: option,
        }));
    } catch (error) {
      console.error("Error parsing trx_settings:", error);
      return [];
    }
  }, [company?.trx_settings, user?.acc]);

  // Check if transaction_type_text is enabled
  const isTransactionTypeDropdown = useMemo(() => {
    if (!company?.trx_settings) {
      return false;
    }

    try {
      const trxSettings = JSON.parse(company.trx_settings);
      return trxSettings?.transaction_type_text === true;
    } catch (error) {
      console.error("Error parsing trx_settings:", error);
      return false;
    }
  }, [company?.trx_settings]);

  const getStatuses = async () => {
    try {
      const res = await customersApi.getTransactionStatuses();
      if (res?.status)
        setStatusList(
          res?.status?.map((s) => ({
            label: s?.status,
            value: s?.id,
          }))
        );
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const onSubmit = (data) => {
    handleCreateTransaction(data);
  };

  const selectedStatuses = useWatch({
    control,
    name: "t_transaction_status_ids",
  });

  const currentChip = useMemo(() => {
    const newChips = selectedStatuses?.map((selected) => {
      const chip = statusList?.find((item) => selected === item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Status",
      };
    });
    if (!selectedStatuses) {
      setValue("t_transaction_status_ids", []);
    }
    return newChips;
  }, [selectedStatuses, statusList]);

  const handleRemoveChip = (value) => {
    const newStatus = [...selectedStatuses].filter((item) => item !== value);
    setValue("t_transaction_status_ids", newStatus);
  };

  useEffect(() => {
    getStatuses();
  }, []);

  useEffect(() => {
    reset();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={1}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">Create Transaction</Typography>
          </Stack>
          <Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Transaction Method
                      </Typography>
                      {isTransactionTypeDropdown ? (
                        <SelectMenu
                          control={control}
                          name="transaction_type"
                          list={transactionTypeOptions}
                        />
                      ) : (
                        <TextField
                          fullWidth
                          hiddenLabel
                          {...register("transaction_type")}
                          placeholder="Transaction Method..."
                          error={!!errors?.transaction_type?.message}
                          helperText={errors?.transaction_type?.message}
                          type="text"
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid xs={6}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Transaction Amount
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Transaction Amount..."
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
                      control={control}
                      label="Currency"
                      name="currency"
                      list={currentEnabledBrandCurrencies?.map((currency) => ({
                        label: currency?.name,
                        value: currency?.key,
                        icon: currencyFlagMap[currency?.key],
                      }))}
                      isIcon={true}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Payment Method
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Payment Method..."
                        {...register("payment_method")}
                        hiddenLabel
                        type="text"
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={6}>
                    <SelectMenu
                      control={control}
                      label="Action"
                      name="deposit"
                      list={depositList?.filter((option) => {
                        if (option.label === "Deposit") {
                          return user?.acc?.acc_e_transaction_deposit;
                        } else if (option.label === "Withdraw") {
                          return user?.acc?.acc_e_transaction_withdrawal;
                        } else if (option.label === "Bonus") {
                          return user?.acc?.acc_e_transaction_bonus;
                        } else if (option.label === "Credit In") {
                          return user?.acc?.acc_e_transaction_credit_in === undefined || user?.acc?.acc_e_transaction_credit_in;
                        } else if (option.label === "Credit Out") {
                          return user?.acc?.acc_e_transaction_credit_out === undefined || user?.acc?.acc_e_transaction_credit_out;
                        } else {
                          return true;
                        }
                      })}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <SelectMenu
                      control={control}
                      label="Status"
                      name="status"
                      list={statusesList}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <SelectMenu
                      isIcon
                      control={control}
                      label="Trading Account"
                      name="trading_account_id"
                      list={accounts?.map((acc) => ({
                        title: acc?.name ? acc?.name : "account " + acc?.id,
                        value: acc?.id,
                        icon: currencyFlagMap[acc?.currency],
                      }))}
                    />
                  </Grid>
                  {user?.acc?.acc_v_transaction_label ? (
                    <Grid xs={6}>
                      <MultiSelectMenu
                        control={control}
                        label="Labels"
                        name="t_transaction_status_ids"
                        isLabel={user?.acc?.acc_e_transaction_label_management}
                        editLabel="Edit transaction statuses"
                        list={statusList}
                        openModal={() => setOpenStatusModal(true)}
                        disabled={!user?.acc?.acc_e_transaction_label}
                      />
                    </Grid>
                  ) : null}
                  {currentChip?.length > 0 && (
                    <Grid xs={12} sx={{ position: 'relative'}}>
                      <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ 
                          ...cssVars,
                          backgroundColor: settings.paletteMode == "dark" ?"var(--nav-bg)": 'background.default',
                          p: 1.5, 
                          mt: 0.5,
                          border: 1,
                          borderRadius: 1,
                          borderColor: 'divider',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '2px',
                            left: '72%',
                            transform: 'translateX(-50%)',
                            borderWidth: '0 10px 10px 10px',
                            borderStyle: 'solid',
                            borderColor: 'transparent transparent #6366f1 transparent',
                          },
                        }}
                      >
                        <ChipSet
                          chips={currentChip}
                          handleRemoveChip={handleRemoveChip}
                        />
                      </Stack>
                    </Grid>
                  )}
                </Grid>
                <Grid xs={12}>
                  <Stack spacing={1}>
                    <Typography variant="h7" px={1}>
                      Description
                    </Typography>
                    <TextField
                      fullWidth
                      hiddenLabel
                      {...register("description")}
                      placeholder="Description..."
                      type="text"
                      multiline
                      rows={3}
                    />
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    pb={0.5}
                  >
                    <Typography>Hidden: </Typography>
                    <CustomSwitch control={control} name="hidden" />
                  </Stack>
                </Grid>
              </Stack>
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
                  loading={isLoading}
                >
                  Create
                </LoadingButton>
                <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Stack>
        </Stack>
      </Container>

      <TransactionStatusCreate
        title="Edit Transaction Status"
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        getStatusList={getStatuses}
        onGetStatuses={getStatuses}
      />
    </Dialog>
  );
};
