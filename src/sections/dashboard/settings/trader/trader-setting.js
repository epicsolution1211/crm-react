import { useEffect, useMemo, useState, useRef } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import EditIcon from '@mui/icons-material/Edit';
import CustomSwitch from "src/components/customize/custom-switch";
import { SelectMenu } from "src/components/customize/select-menu";
import { affiliateApi } from "src/api/lead-management/affiliate";
import { brandsApi } from "src/api/lead-management/brand";
import { useCompany } from "../platform/settings-platform";
import { useInternalBrands } from "../dashboard-setting";
import Button from "@mui/material/Button";

import { TableModal } from "src/components/table-settings-modal";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const languagesList = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Italian", value: "it" },
  { label: "Russian", value: "ru" },
  { label: "Arabic", value: "ar" },
  { label: "Dutch", value: "nl" },
  { label: "Turkish", value: "tr" },
];

const currenciesList = [
  {
    value: 1,
    label: "openmoji:flag-united-states",
    title: "Dollar",
  },
  {
    value: 2,
    label: "flag:eu-4x3",
    title: "Euro",
  },
  {
    value: 3,
    label: "fxemoji:greatbritainflag",
    title: "Pound",
  },
  {
    value: 4,
    label: "openmoji:flag-canada",
    title: "Canadian dollar",
  },
  {
    value: 5,
    label: "openmoji:flag-australia",
    title: "Australian dollar",
  },
];

const defaultAccountTypes = [
  {
    value: true,
    label: "Demo",
  },
  {
    value: false,
    label: "Live",
  },
];

const validationSchema = yup.object({
  margin_out: yup
    .number()
    .test(
      "Is positive?",
      "Margin out must be greater than 0!",
      (value) => value >= 0 || value === null
    ),
});

const SettingsCategory = ({ title, children }) => (
  <Stack spacing={2}>
    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
      {title}
    </Typography>
    <Stack spacing={2}>
      {children}
    </Stack>
  </Stack>
);

const SwitchItem = ({ control, name, label, disabled }) => (
  <Stack 
    direction="row" 
    alignItems="center" 
    sx={{ 
      py: 1,
      px: 2,
      bgcolor: 'background.paper',
      borderRadius: 1,
      '&:hover': {
        bgcolor: 'action.hover'
      }
    }}
  >
    <CustomSwitch control={control} name={name} disabled={disabled} />
    <Typography>{label}</Typography>
  </Stack>
);

export const TraderSetting = ({ brandId }) => {
  const {
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm({ 
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });
  const { handleCompanyGet } = useCompany();
  const { internalBrandsInfo: brandsInfo, getBrands } = useInternalBrands();

  const isFirstMount = useRef(true);

  // eslint-disable-next-line no-unused-vars
  const [affiliateList, setAffiliateList] = useState([]);
  const [tableModalOpen, setTableModalOpen] = useState(false);

  // Watch all form fields for changes
  const formValues = useWatch({ control });

  const saveChanges = async () => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};

      const brandRequest = {
        sign_up: formValues?.sign_up,
        sign_up_affiliate_id: formValues?.sign_up_affiliate_id,
        enable_leverage: formValues?.enable_leverage,
        enable_calculator: formValues?.enable_calculator,
        credit: formValues?.credit,
        default_lng: formValues?.default_lng,
        sign_up_password: formValues?.sign_up_password,
        wd_otp: formValues?.wd_otp,
        account_type: formValues?.account_type,
        app_redirect: formValues?.app_redirect,
        show_usd: formValues?.show_usd,
        currency_id: formValues?.currency_id,
        default_demo: formValues?.default_demo,
        default_trading_account_name: formValues?.default_trading_account_name,
        enabled_wallet: formValues?.enabled_wallet,
        theme_setting: JSON.stringify({
          ...themeSetting,
          enable_amount: formValues?.enable_amount,
          enable_unit: formValues?.enable_unit,
          show_rejected: formValues?.show_rejected,
          show_position_copy: formValues?.show_position_copy,
          enable_create_trader_account: formValues?.enable_create_trader_account,
          show_welcome_message: formValues?.show_welcome_message,
          enable_position_amount: formValues?.enable_position_amount,
          enable_position_units: formValues?.enable_position_units,
          enable_position_lot_size: formValues?.enable_position_lot_size,
          show_deposit_option_on_mobile: formValues?.show_deposit_option_on_mobile,
          show_net_deposit: formValues?.show_net_deposit,
        }),
      };

      if (formValues?.margin_out) {
        brandRequest["margin_out"] = formValues.margin_out;
      }
      
      await brandsApi.updateInternalBrand(brandId, brandRequest);
      toast.success("Settings updated!");
      handleCompanyGet();
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message || "Failed to update settings");
    }
  };

  // Handle automatic saving when form values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(formValues || {}).length > 0) {
        saveChanges();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formValues]);

  // eslint-disable-next-line no-unused-vars
  const signUp = useWatch({ control, name: "sign_up" });
  const enableAmount = useWatch({ control, name: "enable_amount" });
  const enableUnit = useWatch({ control, name: "enable_unit" });
  const enablePositionAmount = useWatch({ control, name: "enable_position_amount" });
  const enablePositionUnits = useWatch({ control, name: "enable_position_units" });
  const enablePositionLotSize = useWatch({ control, name: "enable_position_lot_size" });

  const DEFAULT_COLUMN = [
    {
      id: 'direction',
      label: 'Direction',
      enabled: true,
    },
    {
      id: 'id',
      label: 'ID',
      enabled: true,
    },
    {
      id: 'symbol',
      label: 'Symbol',
      enabled: true,
    },
    {
      id: 'status',
      label: 'Status',
      enabled: true,
    },
    {
      id: 'amount',
      label: 'Marj',
      enabled: true,
    },
    {
      id: 'swap',
      label: 'Swap',
      enabled: true,
    },
    {
      id: 'unit',
      label: 'Unit',
      enabled: true,
    },
    {
      id: 'set_rate',
      label: 'Set',
      enabled: true,
    },
    {
      id: 'entry_price',
      label: 'Entry Price',
      enabled: true,
    },
    {
      id: 'market_price',
      label: 'Market Price',
      enabled: true,
    },
    {
      id: 'change',
      label: 'Change',
      enabled: true,
    },
    {
      id: 'leverage',
      label: 'Leverage',
      enabled: true,
    },
    {
      id: 't/p',
      label: 'T/P',
      enabled: true,
    },
    {
      id: 's/l',
      label: 'S/L',
      enabled: true,
    },
    {
      id: 'profit/loss',
      label: 'Profit/Loss',
      enabled: true,
    },
    {
      id: 'created_time',
      label: 'Created Time',
      enabled: true,
    },
    {
      id: 'closed_time',
      label: 'Closed Time',
      enabled: true,
    },
    {
      id: 'profit/action',
      label: 'Action',
      enabled: true,
    },
  ];

  const [rule, setRule] = useState([]);

  useEffect(() => {
    const brand = brandsInfo?.find((b) => b?.id === brandId);
    if (brand?.column_settings) {
      setRule(JSON.parse(brand?.column_settings)?.positionsTable)
    } else {
      setRule([]);
    }
  }, [brandsInfo, brandId]);

  const getTableSetting = async () => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      if (brand?.column_settings) {
        setRule(JSON.parse(brand?.column_settings)?.positionsTable ?? []);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTableSetting();
  }, [brandsInfo, brandId]);

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = DEFAULT_COLUMN
        ?.map((item) => ({
          ...item,
          enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled,
          order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
        }))
      return updateColumn;
    } else {
      return DEFAULT_COLUMN?.map((item, index) => ({
        ...item,
        order: index,
      }));
    }
  }, [rule, DEFAULT_COLUMN]);

  const handleUpdateRule = async (rule) => {
    try {
      setRule(rule);
      const request = {
        column_settings: JSON.stringify({ positionsTable: rule }),
      };
      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Column settings successfully updated!");

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getAffiliate = async () => {
    try {
      const res = await affiliateApi.getAffiliates();
      const affiliateList = res?.affiliates
        ?.map((affiliate) => ({
          label: affiliate?.full_name ?? "n/a",
          value: affiliate?.id?.toString(),
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setAffiliateList(affiliateList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getAffiliate();
  }, []);

  const [maxTradingAccounts, setMaxTradingAccounts] = useState(0);
  const [maxTradingAccountsDemo, setMaxTradingAccountsDemo] = useState(0);
  const [agentRealAcc, setAgentRealAcc] = useState(false);
  const [agentDemoAcc, setAgentDemoAcc] = useState(false);
  const [agentRealAccExtra, setAgentRealAccExtra] = useState(false);
  const [agentDemoAccExtra, setAgentDemoAccExtra] = useState(false);
  const [accAgentTAccountName, setAccAgentTAccountName] = useState(false);
  const [accUserTAccountName, setAccUserTAccountName] = useState(false);
  const [enableTransactionsExport, setEnableTransactionsExport] = useState(false);
  const [enableTransactionsHistoryExport, setEnableTransactionsHistoryExport] = useState(false);

  const handleMaxTradingAccounts = async () => {
    try {
      await brandsApi.updateInternalBrand(brandId, { max_trading_account: maxTradingAccounts });
      toast.success("Maximum real trading accounts successfully updated!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  const handleMaxTradingAccountsDemo = async () => {
    try {
      await brandsApi.updateInternalBrand(brandId, { max_trading_account_demo: maxTradingAccountsDemo });
      toast.success("Maximum demo trading accounts successfully updated!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  const handleAgentRealAcc = async () => {
    try {
      const newValue = !agentRealAcc;
      await brandsApi.updateInternalBrand(brandId, { 
        agent_real_acc: newValue,
        ...(newValue === false && { agent_real_acc_extra: false })
      });
      setAgentRealAcc(newValue);
      if (newValue === false) {
        setAgentRealAccExtra(false);
      }
      toast.success("Agent real account permission updated successfully!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  const handleAgentDemoAcc = async () => {
    try {
      const newValue = !agentDemoAcc;
      await brandsApi.updateInternalBrand(brandId, { 
        agent_demo_acc: newValue,
        ...(newValue === false && { agent_demo_acc_extra: false })
      });
      setAgentDemoAcc(newValue);
      if (newValue === false) {
        setAgentDemoAccExtra(false);
      }
      toast.success("Agent demo account permission updated successfully!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  const handleAgentRealAccExtra = async () => {
    try {
      if (!agentRealAcc) {
        toast.error("Base real account permission must be enabled first!");
        return;
      }
      const newValue = !agentRealAccExtra;
      await brandsApi.updateInternalBrand(brandId, { agent_real_acc_extra: newValue });
      setAgentRealAccExtra(newValue);
      toast.success("Agent extra real account permission updated successfully!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  const handleAgentDemoAccExtra = async () => {
    try {
      if (!agentDemoAcc) {
        toast.error("Base demo account permission must be enabled first!");
        return;
      }
      const newValue = !agentDemoAccExtra;
      await brandsApi.updateInternalBrand(brandId, { agent_demo_acc_extra: newValue });
      setAgentDemoAccExtra(newValue);
      toast.success("Agent extra demo account permission updated successfully!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  const handleAccAgentTAccountName = async () => {
    try {
      await brandsApi.updateInternalBrand(brandId, { acc_agent_t_account_name: !accAgentTAccountName });
      setAccAgentTAccountName(!accAgentTAccountName);
      toast.success("Agent trading account name permission updated successfully!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  const handleAccUserTAccountName = async () => {
    try {
      await brandsApi.updateInternalBrand(brandId, { acc_user_t_account_name: !accUserTAccountName });
      setAccUserTAccountName(!accUserTAccountName);
      toast.success("User trading account name permission updated successfully!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  const handleUpdateTransactionsExport = async (value) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};

      const request = {
        theme_setting: JSON.stringify({ 
          ...themeSetting,
          enable_transactions_history_export: enableTransactionsHistoryExport,
          enable_transactions_export: value
        }),
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setEnableTransactionsExport(value);
      toast.success("Transactions Export is successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  const handleUpdateTransactionsHistoryExport = async (value) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};

      const request = {
        theme_setting: JSON.stringify({ 
          ...themeSetting,
          enable_transactions_export: enableTransactionsExport,
          enable_transactions_history_export: value
        }),
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setEnableTransactionsHistoryExport(value);
      toast.success("Transactions History Export is successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
  };

  useEffect(() => {
    const brand = brandsInfo?.find((b) => b?.id === brandId);
    if (brand) {
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      setValue("sign_up", brand?.sign_up);
      setValue("sign_up", brand?.sign_up);
      setValue("sign_up_affiliate_id", brand?.sign_up_affiliate_id);
      setValue("enable_leverage", brand?.enable_leverage ?? true);
      setValue("show_deposit_option_on_mobile", themeSetting?.show_deposit_option_on_mobile ?? true);
      setValue("show_net_deposit", themeSetting?.show_net_deposit ?? false);
      setValue("enable_calculator", brand?.enable_calculator);
      setValue("margin_out", brand?.margin_out);
      setValue("credit", brand?.credit);
      setValue("default_lng", brand?.default_lng);
      setValue("sign_up_password", brand?.sign_up_password);
      setValue("wd_otp", brand?.wd_otp ?? false);
      setValue("app_redirect", brand?.app_redirect);
      setValue("account_type", brand?.account_type);
      setValue("show_usd", brand?.show_usd);
      setValue("show_rejected", themeSetting?.show_rejected);
      setValue("show_position_copy", themeSetting?.show_position_copy);
      setValue("currency_id", brand?.currency_id);
      setValue("default_trading_account_name", brand?.default_trading_account_name);
      setValue("default_demo", brand?.default_demo);
      setValue("enabled_wallet", brand?.enabled_wallet);
      setValue(
        "enable_amount",
        themeSetting?.enable_amount === undefined
          ? true
          : themeSetting?.enable_amount
      );
      setValue(
        "show_welcome_message",
        themeSetting?.show_welcome_message === undefined
          ? true
          : themeSetting?.show_welcome_message
      );
      setValue(
        "enable_unit",
        themeSetting?.enable_unit === undefined
          ? true
          : themeSetting?.enable_unit
      );
      setValue(
        "enable_create_trader_account",
        themeSetting?.enable_create_trader_account === undefined
          ? true
          : themeSetting?.enable_create_trader_account
      );
      setValue(
        "enable_position_amount",
        themeSetting?.enable_position_amount === undefined
          ? true
          : themeSetting?.enable_position_amount
      );
      setValue(
        "enable_position_units",
        themeSetting?.enable_position_units === undefined
          ? true
          : themeSetting?.enable_position_units
      );
      setValue(
        "enable_position_lot_size",
        themeSetting?.enable_position_lot_size === undefined
          ? true
          : themeSetting?.enable_position_lot_size
      );
      setMaxTradingAccounts(brand?.max_trading_account ?? 0);
      setMaxTradingAccountsDemo(brand?.max_trading_account_demo ?? 0);
      setAgentRealAcc(brand?.agent_real_acc ?? false);
      setAgentDemoAcc(brand?.agent_demo_acc ?? false);
      setAgentRealAccExtra(brand?.agent_real_acc_extra ?? false);
      setAgentDemoAccExtra(brand?.agent_demo_acc_extra ?? false);
      setAccAgentTAccountName(brand?.acc_agent_t_account_name ?? false);
      setAccUserTAccountName(brand?.acc_user_t_account_name ?? false);
      setEnableTransactionsExport(themeSetting?.enable_transactions_export ?? false);
      setEnableTransactionsHistoryExport(themeSetting?.enable_transactions_history_export ?? false);
    }
  }, [brandId, brandsInfo]);

  return (
    <Stack gap={3} pb={2}>
      <form>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <SettingsCategory title="General Settings">
                <SwitchItem 
                  control={control} 
                  name="app_redirect" 
                  label="Open dashboard in a new tab" 
                />
                <SwitchItem 
                  control={control} 
                  name="enable_calculator" 
                  label="Show calculator in trader" 
                />
                <SwitchItem 
                  control={control} 
                  name="show_welcome_message" 
                  label="Show welcome message" 
                />
                <SwitchItem 
                  control={control} 
                  name="enable_create_trader_account" 
                  label="Enable create multiple trader account" 
                />
                <SwitchItem 
                  control={control} 
                  name="sign_up_password" 
                  label="Ask for Sign Up password" 
                />
                <SwitchItem 
                  control={control} 
                  name="wd_otp" 
                  label="Require OTP for Withdraw Requests" 
                />
              </SettingsCategory>

              <SettingsCategory title="Platform Display">
                <SwitchItem 
                  control={control} 
                  name="credit" 
                  label="Show Credit on Platform" 
                />
                <SwitchItem 
                  control={control} 
                  name="account_type" 
                  label="Show account type on Platform" 
                />
                <SwitchItem 
                  control={control} 
                  name="show_usd" 
                  label="Show USD on assets name" 
                />
                <SwitchItem 
                  control={control} 
                  name="enabled_wallet" 
                  label="Show Wallet on Platform" 
                />
                <SwitchItem 
                  control={control} 
                  name="show_rejected" 
                  label="Show Rejected on Platform" 
                />
                <SwitchItem 
                  control={control} 
                  name="show_position_copy" 
                  label="Show position copy on Platform" 
                />
                <SwitchItem 
                  control={control} 
                  name="enable_leverage" 
                  label="Show Leverage on Platform" 
                />
                <SwitchItem 
                  control={control} 
                  name="show_net_deposit" 
                  label="Show Net Deposit on Platform" 
                />
              </SettingsCategory>

              <SettingsCategory title="Trading Account Limits">
                <Stack spacing={3}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2">Maximum Real Trading Accounts</Typography>
                    <Stack direction="row" alignItems="center" spacing={4} justifyContent="space-between">
                      <TextField
                        type="number"
                        label="Maximum Real Trading Accounts"
                        sx={{ width: { md: 300, xs: 250 }, height: 50 }}
                        value={maxTradingAccounts}
                        onChange={(event) => {
                          setMaxTradingAccounts(event.target.value);
                        }}
                      />
                      <Button variant="contained" onClick={handleMaxTradingAccounts}>Update</Button>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={agentRealAcc}
                            onChange={handleAgentRealAcc}
                          />
                        }
                        label="Allow agents to create Real account"
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={agentRealAccExtra}
                            onChange={handleAgentRealAccExtra}
                          />
                        }
                        label="Allow agents to create extra Real account"
                      />
                    </Stack>
                  </Stack>

                  <Stack spacing={2}>
                    <Typography variant="subtitle2">Maximum Demo Trading Accounts</Typography>
                    <Stack direction="row" alignItems="center" spacing={4} justifyContent="space-between">
                      <TextField
                        type="number"
                        label="Maximum Demo Trading Accounts"
                        sx={{ width: { md: 300, xs: 250 }, height: 50 }}
                        value={maxTradingAccountsDemo}
                        onChange={(event) => {
                          setMaxTradingAccountsDemo(event.target.value);
                        }}
                      />
                      <Button variant="contained" onClick={handleMaxTradingAccountsDemo}>Update</Button>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={agentDemoAcc}
                            onChange={handleAgentDemoAcc}
                          />
                        }
                        label="Allow agents to create Demo account"
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={agentDemoAccExtra}
                            onChange={handleAgentDemoAccExtra}
                          />
                        }
                        label="Allow agents to create extra Demo account"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </SettingsCategory>

              <SettingsCategory title="Trading Account Name Permissions">
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={accAgentTAccountName}
                        onChange={handleAccAgentTAccountName}
                      />
                    }
                    label="Allow agents to change trading account name"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={accUserTAccountName}
                        onChange={handleAccUserTAccountName}
                      />
                    }
                    label="Allow users to change trading account name"
                  />
                </Stack>
              </SettingsCategory>
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <SettingsCategory title="Position Settings">
                <SwitchItem 
                  control={control} 
                  name="enable_amount" 
                  label="Enable amount"
                  disabled={!enableUnit}
                />
                <SwitchItem 
                  control={control} 
                  name="enable_unit" 
                  label="Enable units"
                  disabled={!enableAmount}
                />
              </SettingsCategory>

              <SettingsCategory title="Position Create Value">
                <SwitchItem 
                  control={control} 
                  name="enable_position_amount" 
                  label="Enable Amount Value" 
                  disabled={!enablePositionLotSize && !enablePositionUnits}
                />
                <SwitchItem 
                  control={control} 
                  name="enable_position_units" 
                  label="Enable Units Value"
                  disabled={!enablePositionAmount && !enablePositionLotSize}
                />
                <SwitchItem 
                  control={control} 
                  name="enable_position_lot_size" 
                  label="Enable Lot Size Value"
                  disabled={!enablePositionAmount && !enablePositionUnits}
                />
              </SettingsCategory>

              <SettingsCategory title="Default Settings">
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Default Positions Table Order</Typography>
                    <Button 
                      variant="outlined" 
                      onClick={() => setTableModalOpen(true)}
                      startIcon={<EditIcon />}
                      sx={{ width: 'fit-content' }}
                    >
                      Configure Table Columns
                    </Button>
                  </Stack>

                  <SwitchItem 
                    control={control} 
                    name="sign_up" 
                    label="Show Sign Up Page" 
                  />

                  {signUp ? (
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Sign Up Affiliate</Typography>
                      <SelectMenu
                        name="sign_up_affiliate_id"
                        control={control}
                        list={affiliateList}
                      />
                    </Stack>
                  ) : null}

                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Default Language</Typography>
                    <SelectMenu
                      name="default_lng"
                      control={control}
                      list={languagesList}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Default Currency</Typography>
                    <SelectMenu
                      name="currency_id"
                      control={control}
                      list={currenciesList}
                      isIcon
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Default Trading Account Name</Typography>
                    <TextField
                      hiddenLabel
                      error={!!errors?.default_trading_account_name?.message}
                      helperText={errors?.default_trading_account_name?.message}
                      InputLabelProps={{ shrink: true }}
                      name="default_trading_account_name"
                      type="text"
                      {...register("default_trading_account_name")}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Default Account Type</Typography>
                    <SelectMenu
                      name="default_demo"
                      control={control}
                      list={defaultAccountTypes}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Margin Out</Typography>
                    <TextField
                      hiddenLabel
                      error={!!errors?.margin_out?.message}
                      helperText={errors?.margin_out?.message}
                      InputLabelProps={{ shrink: true }}
                      name="margin_out"
                      type="number"
                      {...register("margin_out")}
                    />
                  </Stack>
                </Stack>
              </SettingsCategory>

              <SettingsCategory title="Export">
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={enableTransactionsExport}
                        onChange={(e) => handleUpdateTransactionsExport(e?.target?.checked)}
                      />
                    }
                    label="Enable Export for Transactions Table"
                    sx={{
                      alignItems: 'flex-start',
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem'
                      },
                      '& .MuiSwitch-root': {
                        marginRight: 1
                      }
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={enableTransactionsHistoryExport}
                        onChange={(e) => handleUpdateTransactionsHistoryExport(e?.target?.checked)}
                      />
                    }
                    label="Enable Export for Transactions History Table"
                    sx={{
                      alignItems: 'flex-start',
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem'
                      },
                      '& .MuiSwitch-root': {
                        marginRight: 1
                      }
                    }}
                  />
                </Stack>
              </SettingsCategory>
            </Stack>
          </Grid>
        </Grid>
      </form>

      <TableModal
        open={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        tableColumn={tableColumn}
        defaultColumn={DEFAULT_COLUMN}
        updateRule={handleUpdateRule}
        sorting={{}}
        isTrader
      />
    </Stack>
  );
};
