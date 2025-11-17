import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/system/Container";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/system/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import { TimePicker } from "@mui/x-date-pickers";

import CustomSwitch from "src/components/customize/custom-switch";
import MuiDatePicker from "src/components/customize/date-picker";
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { Scrollbar } from "src/components/scrollbar";
import { SelectMenu } from "src/components/customize/select-menu";
import { SelectMenuWithCustomValue } from 'src/components/customize/select-menu-with-custom-value';
import { TransactionStatusCreate } from "./transaction-status-create";
import { currencyFlagMap } from "src/utils/constant";
import { customersApi } from "src/api/customers";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { useMounted } from "src/hooks/use-mounted";
import { useSettings } from "src/hooks/use-settings";
import { useTimezone } from "src/hooks/use-timezone";
import { useTraderAccounts } from "./customer-trader-accounts";

const statusesList = [
  { label: "Approved", value: 1 },
  { label: "Pending", value: 2 },
  { label: "Rejected", value: 3 },
  { label: "Canceled", value: 4 },
];

const depositList = [
  { label: "Deposit", value: true },
  { label: "Withdraw", value: false },
  { label: "Bonus", value: "bonus" },
  { label: "Credit In", value: "credit_in" },
  { label: "Credit Out", value: "credit_out" },
];

const validationSchema = yup.object({
  amount: yup.string().required("Amount is a required field"),
  status: yup.string().required("Status is a required field"),
  deposit: yup.string().required("Deposit is a required field"),
  trading_account_id: yup.string().required("Trader account is a required field"),
});

export const useDesks = () => {
  const [desks, setDesks] = useState([]);
  const { user } = useAuth();

  const getDesks = async () => {
    try {
      const res = await settingsApi.getDesk();
      setDesks(
        res?.desks
          ?.filter((desk) => {
            if (
              (user?.acc?.acc_e_client_desk === undefined ||
                user?.acc?.acc_e_client_desk) &&
              (user?.acc?.acc_v_client_desk === undefined ||
                user?.acc?.acc_v_client_desk)
            ) {
              return true;
            } else if (
              (user?.acc?.acc_e_client_self_desk === undefined ||
                user?.acc?.acc_e_client_self_desk) &&
              (user?.acc?.acc_v_client_self_desk === undefined ||
                user?.acc?.acc_v_client_self_desk)
            ) {
              return user?.desk_ids?.includes(desk?.id);
            } else {
              return false;
            }
          })
          .map((desk) => ({
            label: desk?.name,
            value: desk?.id,
          }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDesks();
  }, []);

  return desks;
};

const useMembers = () => {
  const isMounted = useMounted();
  const [members, setMembers] = useState([]);

  const handleMembersGet = useCallback(async (deskId = null) => {
    const members = await settingsApi.getMembers([], "*", {
      active: true,
      desk_ids: [deskId],
    });

    if (isMounted()) {
      setMembers(deskId ?
        members?.accounts
          ?.filter(account => !account?.admin_hide)
          ?.map((acc) => ({
            label: acc?.first_name
              ? `${acc?.first_name} ${acc?.last_name}`
              : acc?.email,
            value: acc?.id,
          })) : []
      );
    }
  }, []);

  useEffect(() => {
    handleMembersGet();
  }, []);

  return {
    members,
    handleMembersGet,
  };
};

export const EditTransactionModal = (props) => {
  const { toLocalTime, toUTCTime, combineDate } = useTimezone();
  const {
    open,
    onClose,
    handleUpdateTransaction,
    transaction = {},
    onGetTransactions = () => { },
    customerId = null,
    currentEnabledBrandCurrencies = [],
  } = props;

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const { user, company } = useAuth();
  const { accounts } = customerId ? useTraderAccounts(customerId) : { accounts: [] };

  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [createdAtTime, setCreatedAtTime] = useState();
  const [approvedAtTime, setApprovedAtTime] = useState();
  const [eventDate, setEventDate] = useState();
  const [activeTab, setActiveTab] = useState(0);

  const desks = useDesks();
  const { members, handleMembersGet } = useMembers();

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

  const defaultValues = useMemo(
    () => {
      setCreatedAtTime(toLocalTime(transaction?.created_at));
      setApprovedAtTime(toLocalTime(transaction?.approved_at));
      if (transaction?.event_date) {
        setEventDate(toLocalTime(transaction?.event_date));
      }

      return ({
        status: transaction?.status ? transaction?.status : "1",
        t_transaction_status_ids: transaction?.t_transaction_status_ids,
        trading_account_id: transaction?.trading_account_id,
        created_at: toUTCTime(transaction?.created_at),
        approved_at: toUTCTime(transaction?.approved_at),
        event_date: transaction?.event_date ? toUTCTime(transaction?.event_date) : null,
        hidden: transaction?.hidden,
        transaction_type: transaction?.transaction_type,
        amount: transaction?.amount,
        currency: transaction?.currency,
        description: transaction?.description ?? "",
        external_transaction_id: transaction?.external_transaction_id,
        external_brand: transaction?.external_brand,
        external_user_id: transaction?.external_user_id,
        payment_method: transaction?.payment_method,
        payment_method_code: transaction?.payment_method_code,
        processing_status: transaction?.processing_status,
        failure_reason: transaction?.failure_reason,
        real_balance_before: transaction?.real_balance_before,
        real_balance_after: transaction?.real_balance_after,
        bonus_balance_before: transaction?.bonus_balance_before,
        bonus_balance_after: transaction?.bonus_balance_after,
        bonus_code: transaction?.bonus_code,
        bonus_type: transaction?.bonus_type,
        bonus_release_amount: transaction?.bonus_release_amount,
        bonus_cancel_reason: transaction?.bonus_cancel_reason,
        total_pending_withdrawals_count: transaction?.total_pending_withdrawals_count,
        total_pending_withdrawals_amount: transaction?.total_pending_withdrawals_amount,
        user_net_deposits: transaction?.user_net_deposits,
        is_first_deposit: transaction?.is_first_deposit,
        source_system: transaction?.source_system,
      });
    },
    [transaction]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const selectedStatuses = useWatch({
    control,
    name: "t_transaction_status_ids",
  });

  useEffect(() => {
    if (transaction) {
      setTimeout(() => {
        if (transaction?.bonus) {
          setValue("deposit", "bonus");
        } else if (transaction?.deposit && transaction?.credit) {
          setValue("deposit", "credit_in");
        } else if (!transaction?.deposit && transaction?.credit) {
          setValue("deposit", "credit_out"); 
        } else if (transaction?.deposit && !transaction?.credit) {
          setValue("deposit", "true"); // For Deposit
        } else {
          setValue("deposit", "false"); // For Withdraw
        }
      }, 300);
    }
  }, [transaction]);

  const onSubmit = async (data) => {
    try {
      const combinedCreatedDate= combineDate(data?.created_at, new Date(createdAtTime)  );
      const createdAt = toUTCTime(combinedCreatedDate);

      const combinedApprovedDate= combineDate(data?.approved_at, new Date(approvedAtTime));
      const approvedAt = toUTCTime(combinedApprovedDate);

      const combinedEventDate= combineDate(data?.event_date, new Date(eventDate));
      const eventDateAt = toUTCTime(combinedEventDate);

      const request = {
        ...data,
      };

      if (createdAt) {
        request["created_at"] = createdAt;
      }
      if (approvedAt) {
        request["approved_at"] = approvedAt;
      }
      if (eventDateAt) {
        request["event_date"] = eventDateAt;
      }

      if (data?.deposit === "bonus") {
        request["bonus"] = true;
        request["deposit"] = false;
      }
      if (data?.deposit === "credit_out") {
        request["credit"] = true;
        request["deposit"] = false;
      }
      if (data?.deposit === "credit_in") {
        request["credit"] = true;
        request["deposit"] = true;
      }
      if (data?.deposit === "true") {
        request["credit"] = false;
        request["deposit"] = true;
      }
      if (data?.deposit === "false") {
        request["deposit"] = false;
      }
      
      await handleUpdateTransaction(transaction?.id, request);
      setTimeout(() => {
        onGetTransactions();
      }, 1500);
    } catch (error) {
      console.error("error: ", error);
    }
  };

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

  const getStatuses = async () => {
    try {
      setIsStatusLoading(true);
      const res = await customersApi.getTransactionStatuses();
      if (res?.status)
        setStatusList(
          res?.status?.map((s) => ({
            label: s?.status,
            value: s?.id,
          }))
        );
      setIsStatusLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    reset();
  }, [open, reset]);

  const deskId = useWatch({ control, name: "desk_id" });

  useEffect(() => {
    handleMembersGet(deskId);
  }, [deskId]);

  useEffect(() => {
    getStatuses();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderBasicInformation = () => (
    <Grid container spacing={2}>
      <Grid xs={12} sm={6} md={4} lg={3}>
        <Stack spacing={1}>
          <Typography variant="h7" px={1}>
            Transaction Method
          </Typography>
          {isTransactionTypeDropdown ? (
            <SelectMenuWithCustomValue
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
              type="text"
            />
          )}
        </Stack>
      </Grid>
      <Grid xs={12} sm={6} md={4} lg={3}>
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
      <Grid xs={12} sm={6} md={4} lg={3}>
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
      <Grid xs={12} sm={6} md={4} lg={3}>
        <SelectMenu
          control={control}
          label="Status"
          name="status"
          list={statusesList}
        />
      </Grid>
      <Grid xs={12} sm={6} md={4} lg={3}>
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
              return user?.acc?.acc_e_transaction_bonus === undefined || user?.acc?.acc_e_transaction_bonus;
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
      {user?.acc?.acc_v_transaction_label ? (
        <Grid xs={12} sm={6} md={4} lg={3}>
          <MultiSelectMenu
            control={control}
            label="Labels"
            name="t_transaction_status_ids"
            isLabel={
              user?.acc?.acc_e_transaction_label_management
            }
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
      {user?.acc?.acc_e_transaction_owner_agent === undefined || user?.acc?.acc_e_transaction_owner_agent ? (
        <>
          <Grid xs={12} sm={6} md={4} lg={3}>
            <SelectMenu
              control={control}
              label="Owner Desk"
              name="desk_id"
              list={desks}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            <SelectMenu
              control={control}
              label="Owner Agent"
              name="owner_id"
              list={members}
              disabled={!deskId}
              isSearch
            />
          </Grid>
        </>
      ) : null}
      {user?.acc?.acc_e_transaction_created_at === undefined ||
        user?.acc?.acc_e_transaction_created_at ? (
        <>
          <Grid
            xs={12} sm={6} md={4} lg={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography paddingLeft={1}>Created Date</Typography>
            <MuiDatePicker
              control={control}
              setValue={setValue}
              name="created_at"
              label="Created Date"
              defaultNull
            />
          </Grid>
          <Grid
            xs={12} sm={6} md={4} lg={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography paddingLeft={1}>Created Time</Typography>
            <TimePicker
              sx={{ width: 1 }}
              format="h:mm a"
              views={["hours", "minutes"]}
              label="Created Time"
              value={createdAtTime ? new Date(createdAtTime) : null}
              onChange={(val) => {
                setCreatedAtTime(new Date(val));
              }}
            />
          </Grid>
        </>
      ) : null}

      {(user?.acc?.acc_e_transaction_approved_at === undefined ||
        user?.acc?.acc_e_transaction_approved_at) &&
        transaction?.approved_at ? (
        <>
          <Grid
            xs={12} sm={6} md={4} lg={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography paddingLeft={1}>Approved Date</Typography>
            <MuiDatePicker
              control={control}
              setValue={setValue}
              name="approved_at"
              label="Approved Date"
              defaultNull
            />
          </Grid>
          <Grid
            xs={12} sm={6} md={4} lg={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography paddingLeft={1}>Approved Time</Typography>
            <TimePicker
              sx={{ width: 1 }}
              format="h:mm a"
              views={["hours", "minutes"]}
              label="Approved Time"
              value={approvedAtTime ? new Date(approvedAtTime) : null}
              onChange={(val) => {
                setApprovedAtTime(new Date(val));
              }}
            />
          </Grid>
        </>
      ) : null}

      {customerId ? (
        <Grid xs={12} sm={6} md={4} lg={3}>
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
      ) : null}

      <Grid xs={12} sm={6} md={4} lg={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={3}
          sx={{ mt: { md: 5, xs: 0 } }}
        >
          <Typography>Hidden: </Typography>
          <CustomSwitch control={control} name="hidden" />
        </Stack>
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
            rows={2}
          />
        </Stack>
      </Grid>
    </Grid>
  );

  const renderExternalInformation = () => (
    <Grid container spacing={2}>
      {user?.acc?.acc_e_external_transaction_id !== false && (
        <Grid xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="External Transaction ID"
            {...register("external_transaction_id")}
            defaultValue={transaction?.external_transaction_id}
            disabled={!user?.acc?.acc_e_external_transaction_id}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_external_brand !== false && (
        <Grid xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="External Brand"
            {...register("external_brand")}
            defaultValue={transaction?.external_brand}
            disabled={!user?.acc?.acc_e_external_brand}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_external_user_id !== false && (
        <Grid xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="External User ID"
            {...register("external_user_id")}
            defaultValue={transaction?.external_user_id}
            disabled={!user?.acc?.acc_e_external_user_id}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_payment_method !== false && (
        <Grid xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Payment Method"
            {...register("payment_method")}
            defaultValue={transaction?.payment_method}
            disabled={!user?.acc?.acc_e_payment_method}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_payment_method_code !== false && (
        <Grid xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Payment Method Code"
            {...register("payment_method_code")}
            defaultValue={transaction?.payment_method_code}
            disabled={!user?.acc?.acc_e_payment_method_code}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_processing_status !== false && (
        <Grid xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Processing Status"
            {...register("processing_status")}
            defaultValue={transaction?.processing_status}
            disabled={!user?.acc?.acc_e_processing_status}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_failure_reason !== false && (
        <Grid xs={12}>
          <TextField
            fullWidth
            label="Failure Reason"
            {...register("failure_reason")}
            defaultValue={transaction?.failure_reason}
            disabled={!user?.acc?.acc_e_failure_reason}
            multiline
            rows={2}
          />
        </Grid>
      )}
    </Grid>
  );

  const renderBalanceInformation = () => (
    <Grid container spacing={2}>
      {user?.acc?.acc_e_real_balance_before !== false && (
        <Grid xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Real Balance Before"
            {...register("real_balance_before")}
            defaultValue={transaction?.real_balance_before}
            disabled={!user?.acc?.acc_e_real_balance_before}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_real_balance_after !== false && (
        <Grid xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Real Balance After"
            {...register("real_balance_after")}
            defaultValue={transaction?.real_balance_after}
            disabled={!user?.acc?.acc_e_real_balance_after}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_bonus_balance_before !== false && (
        <Grid xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Bonus Balance Before"
            {...register("bonus_balance_before")}
            defaultValue={transaction?.bonus_balance_before}
            disabled={!user?.acc?.acc_e_bonus_balance_before}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_bonus_balance_after !== false && (
        <Grid xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Bonus Balance After"
            {...register("bonus_balance_after")}
            defaultValue={transaction?.bonus_balance_after}
            disabled={!user?.acc?.acc_e_bonus_balance_after}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>
      )}
    </Grid>
  );

  const renderBonusInformation = () => (
    <Grid container spacing={2}>
      {user?.acc?.acc_e_bonus_code !== false && (
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            label="Bonus Code"
            {...register("bonus_code")}
            defaultValue={transaction?.bonus_code}
            disabled={!user?.acc?.acc_e_bonus_code}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_bonus_type !== false && (
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            label="Bonus Type"
            {...register("bonus_type")}
            defaultValue={transaction?.bonus_type}
            disabled={!user?.acc?.acc_e_bonus_type}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_bonus_release_amount !== false && (
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            label="Bonus Release Amount"
            {...register("bonus_release_amount")}
            defaultValue={transaction?.bonus_release_amount}
            disabled={!user?.acc?.acc_e_bonus_release_amount}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_bonus_cancel_reason !== false && (
        <Grid xs={12}>
          <TextField
            fullWidth
            label="Bonus Cancel Reason"
            {...register("bonus_cancel_reason")}
            defaultValue={transaction?.bonus_cancel_reason}
            disabled={!user?.acc?.acc_e_bonus_cancel_reason}
            multiline
            rows={2}
          />
        </Grid>
      )}
    </Grid>
  );

  const renderAdditionalInformation = () => (
    <Grid container spacing={2}>
      {user?.acc?.acc_e_total_pending_withdrawals_count !== false && (
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            label="Total Pending Withdrawals Count"
            {...register("total_pending_withdrawals_count")}
            defaultValue={transaction?.total_pending_withdrawals_count}
            disabled={!user?.acc?.acc_e_total_pending_withdrawals_count}
            type="number"
          />
        </Grid>
      )}
      {user?.acc?.acc_e_total_pending_withdrawals_amount !== false && (
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            label="Total Pending Withdrawals Amount"
            {...register("total_pending_withdrawals_amount")}
            defaultValue={transaction?.total_pending_withdrawals_amount}
            disabled={!user?.acc?.acc_e_total_pending_withdrawals_amount}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_user_net_deposits !== false && (
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            label="User Net Deposits"
            {...register("user_net_deposits")}
            defaultValue={transaction?.user_net_deposits}
            disabled={!user?.acc?.acc_e_user_net_deposits}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>
      )}
      {user?.acc?.acc_e_is_first_deposit !== false && (
        <Grid xs={12} md={4}>
          <SelectMenu
            control={control}
            label="Is First Deposit"
            name="is_first_deposit"
            list={[
              { label: "Yes", value: true },
              { label: "No", value: false }
            ]}
            defaultValue={transaction?.is_first_deposit}
            disabled={!user?.acc?.acc_e_is_first_deposit}
          />
        </Grid>
      )}
    </Grid>
  );

  const renderSystemInformation = () => (
    <Grid container spacing={2}>
      {user?.acc?.acc_e_event_date !== false && (
        <>
          <Grid xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography pl={1}>Event Date</Typography>
            <MuiDatePicker
              control={control}
              setValue={setValue}
              name="event_date"
              label="Event Date"
              defaultNull
            />
          </Grid>
          <Grid xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography pl={1}>Event Time</Typography>
            <TimePicker
              sx={{ width: 1 }}
              format="h:mm a"
              views={["hours", "minutes"]}
              label="Event Time"
              value={eventDate ? new Date(eventDate) : null}
              onChange={(val) => {
                setEventDate(new Date(val));
              }}
            />
          </Grid>
        </>
      )}
      {user?.acc?.acc_e_source_system !== false && (
        <Grid xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography pl={1}>Source System</Typography>
          <TextField
            fullWidth
            label="Source System"
            {...register("source_system")}
            defaultValue={transaction?.source_system}
            disabled={!user?.acc?.acc_e_source_system}
          />
        </Grid>
      )}
    </Grid>
  );

  const getVisibleTabs = () => {
    const tabs = [
      { label: "Basic Information", render: renderBasicInformation, alwaysVisible: true }
    ];

    if (user?.acc?.acc_e_external_transaction_id !== false ||
        user?.acc?.acc_e_external_brand !== false ||
        user?.acc?.acc_e_external_user_id !== false ||
        user?.acc?.acc_e_payment_method !== false ||
        user?.acc?.acc_e_payment_method_code !== false ||
        user?.acc?.acc_e_processing_status !== false ||
        user?.acc?.acc_e_failure_reason !== false) {
      tabs.push({ label: "External Information", render: renderExternalInformation });
    }

    if (user?.acc?.acc_e_real_balance_before !== false ||
        user?.acc?.acc_e_real_balance_after !== false ||
        user?.acc?.acc_e_bonus_balance_before !== false ||
        user?.acc?.acc_e_bonus_balance_after !== false) {
      tabs.push({ label: "Balance Information", render: renderBalanceInformation });
    }

    if (user?.acc?.acc_e_bonus_code !== false ||
        user?.acc?.acc_e_bonus_type !== false ||
        user?.acc?.acc_e_bonus_release_amount !== false ||
        user?.acc?.acc_e_bonus_cancel_reason !== false) {
      tabs.push({ label: "Bonus Information", render: renderBonusInformation });
    }

    if (user?.acc?.acc_e_total_pending_withdrawals_count !== false ||
        user?.acc?.acc_e_total_pending_withdrawals_amount !== false ||
        user?.acc?.acc_e_user_net_deposits !== false ||
        user?.acc?.acc_e_is_first_deposit !== false) {
      tabs.push({ label: "Additional Information", render: renderAdditionalInformation });
    }

    if (user?.acc?.acc_e_event_date !== false ||
        user?.acc?.acc_e_source_system !== false) {
      tabs.push({ label: "System Information", render: renderSystemInformation });
    }

    return tabs;
  };

  const visibleTabs = getVisibleTabs();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={!mdUp} sx={{ borderRadius: { md: '16px', xs: 0 } }}>
      <Container maxWidth="lg" sx={{ p: 3 }}>
        {isStatusLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress
              size={70}
              sx={{ alignSelf: "center", justifySelf: "center" }}
            />
          </Box>
        ) : (
          <Stack direction="column">
            <Stack py={1} direction="row" justifyContent="center">
              <Typography variant="h5">Update Transaction</Typography>
            </Stack>
            <Stack>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    {visibleTabs.map((tab, index) => (
                      <Tab key={index} label={tab.label} />
                    ))}
                  </Tabs>
                </Box>
                
                <Scrollbar 
                  sx={{ 
                    maxHeight: { md: 'calc(100vh - 300px)', xs: 'calc(100vh - 220px)' }, 
                    height: { md: 'auto', xs: 'calc(100vh - 220px)' }, 
                    minHeight: 300, 
                    overflowX: 'hidden',
                    overflowY: { xl: 'hidden', xs: 'auto' }
                  }}>
                  {visibleTabs[activeTab]?.render()}
                </Scrollbar>
                
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "center",
                    pt: 3,
                    px: 3,
                  }}
                  gap={3}
                >
                  <Button variant="contained" type="submit">
                    {isSubmitting ? "Update..." : "Update"}
                  </Button>
                  <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
                    Cancel
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Stack>
        )}
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
