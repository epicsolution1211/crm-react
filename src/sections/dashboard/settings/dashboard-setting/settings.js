import {  useEffect, useState } from "react";
import toast from "react-hot-toast";

import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { Edit, InfoOutlined } from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

import { brandsApi } from "src/api/lead-management/brand";
import { SelectMenu } from "src/components/customize/select-menu";
import CustomSwitchWithLabelInfo from "src/components/customize/custom-switch-with-label";
import { useForm } from "react-hook-form";
import { TableModal } from "src/components/table-settings-modal";
import { useAuth } from "src/hooks/use-auth";

const sidebarList = [
  {
    key: 'show_dashboard',
    label:  'Dashboard',
    info:  'Show Dashboard',
  },
  {
    key: 'show_ico',
    label:  'ICO',
    info:  'Show ICO',
  },
  {
    key: 'show_saving_account',
    label:  'Saving Accounts',
    info:  'Show Saving Accounts',
  },
  {
    key: 'show_upload_document',
    label:  'Upload Document',
    info:  'Show Upload Document',
  },
  {
    key: 'show_deposit_fund',
    label:  'Deposit Fund',
    info:  'Show Deposit Fund',
  },
  {
    key: 'show_widthrawal',
    label:  'Withdrawal',
    info:  'Show Withdrawal',
  },
  {
    key: 'show_monetary_transaction',
    label:  'Monetary Transaction',
    info:  'Show Monetary Transaction',
  },
  {
    key: 'show_trading_history',
    label:  'Trading History',
    info:  'Show Trading History',
  },
  {
    key: 'show_trading_terminal',
    label:  'Trading Terminal',
    info:  'Show Trading Terminal',
  },
  {
    key: 'show_contact_us',
    label:  'Contact Us',
    info:  'Show Contact Us',
  },
  {
    key: 'show_ib',
    label:  'IB',
    info:  'Show IB',
  },
  {
    key: 'show_transfer_funds',
    label:  'Transfer Funds',
    info:  'Show Transfer Funds',
  }
];

const DEFAULT_TRANSACTION_COLUMNS = [
  {
    id: "status",
    label: "Status",
    enabled: true,
  },
  {
    id: "transaction_type",
    label: "Transaction Type",
    enabled: true,
  },
  {
    id: "payment_method",
    label: "Payment Method",
    enabled: false,
  },
  {
    id: "currency",
    label: "Currency",
    enabled: true,
  },
  {
    id: "provider",
    label: "Provider",
    enabled: true,
  },
  {
    id: "amount",
    label: "Margin",
    enabled: true,
  },
  {
    id: "trading_account_id",
    label: "Trader Account",
    enabled: true,
  },
  {
    id: "created_time",
    label: "Time",
    enabled: true,
  },
  {
    id: "action",
    label: "Action",
    enabled: true,
  },
];

const DEFAULT_TRADING_HISTORY_COLUMNS = [
  {
    id: "direction",
    label: "Direction",
    enabled: true,
  },
  {
    id: "created_time",
    label: "Time",
    enabled: true,
  },
  {
    id: "id",
    label: "ID",
    enabled: true,
  },
  {
    id: "symbol",
    label: "Symbol",
    enabled: true,
  },
  {
    id: "status",
    label: "Status",
    enabled: true,
  },
  {
    id: "amount",
    label: "Margin",
    enabled: true,
  },
  {
    id: "swap",
    label: "Swap",
    enabled: true,
  },
  {
    id: "unit",
    label: "Unit",
    enabled: true,
  },
  {
    id: "set_rate",
    label: "Set",
    enabled: true,
  },
  {
    id: "entry_price",
    label: "Entry Price",
    enabled: true,
  },
  {
    id: "market_price",
    label: "Market Price",
    enabled: true,
  },
  {
    id: "leverage",
    label: "Leverage",
    enabled: true,
  },
  {
    id: "t/p",
    label: "T/P",
    enabled: true,
  },
  {
    id: "s/l",
    label: "S/L",
    enabled: true,
  },
  {
    id: "profit/loss",
    label: "Profit/Loss",
    enabled: true,
  },
];

export const Settings = ({
  brandId,
  brandsInfo = [],
  setValue,
  control,
  register,
  isSubmitting,
  handleSubmit,
  getBrands,
}) => {
  const { user } = useAuth();
  const [allowDeleteUser, setAllowDeleteUser] = useState(false);
  const [showAccountType, setShowAccountType] = useState(false);
  const [tradeCountGraph, setTradeCountGraph] = useState(false);
  const [tradeVolumeGraph, setTradeVolumeGraph] = useState(false);
  const [accumulatedProfitGraph, setAccumulatedProfitGraph] = useState(false);
  const [marginAllocationGraph, setMarginAllocationGraph] = useState(false);
  const [positionAllocationGraph, setPositionAllocaionGraph] = useState(false);

  const [isAutoIBApproval, setIsAutoIBApproval] = useState(false);
  const [isShowDepositOption, setIsShowDepositOption] = useState(false);
  const [isRequireOTPForWithdraw, setIsRequireOTPForWithdraw] = useState(false);
  const [isShowNetDeposit, setIsShowNetDeposit] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [depositQuickOptions, setDepositQuickOptions] = useState([250, 500, 1000]);
  const [newQuickOption, setNewQuickOption] = useState('');
  const [showAddOption, setShowAddOption] = useState(false);
  const [wdNoId, setWdNoId] = useState(false);
  const [wdNoBilling, setWdNoBilling] = useState(false);
  const [kycManualBilling, setKycManualBilling] = useState(false);
  const [kycManualId, setKycManualId] = useState(false);
  const [allowWithdrawAnyAccount, setAllowWithdrawAnyAccount] = useState(false);

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tradingHistoryModalOpen, setTradingHistoryModalOpen] = useState(false);
  const [tradingHistoryRule, setTradingHistoryRule] = useState([]);

  const { watch: sidebarWatch, control: sidebarControl, setValue: sidebarSetValue } = useForm();
  const sidebarFields = sidebarWatch();

  const [transactionRule, setTransactionRule] = useState([]);
  const [enableTradingHistoryExport, setEnableTradingHistoryExport] = useState(false);
  const [enableMonetaryTransactionsExport, setEnableMonetaryTransactionsExport] = useState(false);

  const getTransactionTableSetting = async () => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      if (brand?.column_settings) {
        const columnSettings = JSON.parse(brand?.column_settings);
        setTransactionRule(columnSettings?.transactionsTable ?? []);
        setTradingHistoryRule(columnSettings?.tradingHistoryTable ?? []);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTransactionTableSetting();
  }, [brandsInfo, brandId]);

  const handleUpdateTransactionRule = async (rule) => {
    try {
      setTransactionRule(rule);
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const currentSettings = brand?.column_settings 
        ? JSON.parse(brand?.column_settings) 
        : {};
      
      const request = {
        column_settings: JSON.stringify({ 
          ...currentSettings,
          transactionsTable: rule 
        }),
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Transaction table settings successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateAutoIBApproval = async (value) => {
    try {
      const request = {
        auto_ib_approval : value
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setIsAutoIBApproval(value);
      toast.success("Auto IB Approval is successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateRequireOTPForWithdraw = async (value) => {
    try {
      const request = {
        wd_otp : value
      };
      await brandsApi.updateInternalBrand(brandId, request);
      setIsRequireOTPForWithdraw(value);
      toast.success("Require OTP for Withdraw Requests is successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateShowNetDeposit = async (value) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
      ? JSON.parse(brand?.theme_setting)
      : {};

      const request = {
        theme_setting: JSON.stringify({ 
          ...themeSetting,
          show_net_deposit: value
        }),
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setIsShowNetDeposit(value);
      toast.success("Show Net Deposit is successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateShowDepositOption = async (value) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
      ? JSON.parse(brand?.theme_setting)
      : {};

      const request = {
        theme_setting: JSON.stringify({ 
          ...themeSetting,
          show_deposit_option_on_mobile: value
        }),
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setIsShowDepositOption(value);
      toast.success("Show Deposit Option is successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateTradingHistoryExport = async (value) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
      ? JSON.parse(brand?.theme_setting)
      : {};

      const request = {
        theme_setting: JSON.stringify({ 
          ...themeSetting,
          enable_monetary_transactions_export: enableMonetaryTransactionsExport,
          enable_trading_history_export: value
        }),
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setEnableTradingHistoryExport(value);
      toast.success("Trading History Export is successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateMonetaryTransactionsExport = async (value) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
      ? JSON.parse(brand?.theme_setting)
      : {};

      const request = {
        theme_setting: JSON.stringify({ 
          ...themeSetting,
          enable_trading_history_export: enableTradingHistoryExport,
          enable_monetary_transactions_export: value
        }),
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setEnableMonetaryTransactionsExport(value);
      toast.success("Monetary Transactions Export is successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateTradingHistoryRule = async (rule) => {
    try {
      setTradingHistoryRule(rule);
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const currentSettings = brand?.column_settings 
        ? JSON.parse(brand?.column_settings) 
        : {};
      
      const request = {
        column_settings: JSON.stringify({ 
          ...currentSettings,
          tradingHistoryTable: rule 
        }),
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Trading history table settings successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleWithdrawRuleUpdate = async (name, value, setState) => {
    try {
      const request = {
        [name]: value
      };
      
      await brandsApi.updateInternalBrand(brandId, request);
      setState(value);
      toast.success("Withdraw rule successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const brand = brandsInfo?.find((b) => b?.id === brandId);

    if (brand) {
      const themeSetting = brand?.theme_setting
      ? JSON.parse(brand?.theme_setting)
      : {};

      setValue("brand_color_theme", themeSetting?.color_theme);
      setValue("brand_color_preset", themeSetting?.color_preset);
      setValue("welcome_message", brand?.welcome_message);
      setValue("welcome_guide", brand?.welcome_guide);
      setValue("welcome_guide_name", brand?.welcome_guide_name);
      setValue("risk_warning", brand?.risk_warning);
      setShowAccountType(brand?.account_type);
      setValue("welcome_title", themeSetting?.welcome_title);
      setValue("posts_title", themeSetting?.posts_title);

      setIsAutoIBApproval(brand?.auto_ib_approval);
      setIsShowDepositOption(themeSetting?.show_deposit_option_on_mobile ?? true);
      setIsRequireOTPForWithdraw(brand?.wd_otp ?? false);
      setIsShowNetDeposit(themeSetting?.show_net_deposit ?? false);
      setWdNoId(brand?.wd_no_id);
      setWdNoBilling(brand?.wd_no_billing);
      setKycManualBilling(brand?.kyc_manual_billing);
      setKycManualId(brand?.kyc_manual_id);
      setAllowWithdrawAnyAccount(
        themeSetting?.allow_withdraw_any_account !== undefined
          ? JSON.parse(themeSetting?.allow_withdraw_any_account)
          : true
      );
      setEnableTradingHistoryExport(themeSetting?.enable_trading_history_export ?? false);
      setEnableMonetaryTransactionsExport(themeSetting?.enable_monetary_transactions_export ?? false);

      setAllowDeleteUser(
        themeSetting?.allow_delete_user !== undefined
          ? JSON.parse(themeSetting?.allow_delete_user)
          : true
      );

      sidebarSetValue('show_dashboard', themeSetting?.show_dashboard !== undefined
        ? themeSetting?.show_dashboard
        : true);
      sidebarSetValue('show_ico', themeSetting?.show_ico !== undefined
        ? themeSetting?.show_ico
        : true);
      sidebarSetValue('show_saving_account', themeSetting?.show_saving_account !== undefined
        ? themeSetting?.show_saving_account
        : true);
      sidebarSetValue('show_upload_document', themeSetting?.show_upload_document !== undefined
        ? themeSetting?.show_upload_document
        : true);
      sidebarSetValue('show_deposit_fund', themeSetting?.show_deposit_fund !== undefined
        ? themeSetting?.show_deposit_fund
        : true);
      sidebarSetValue('show_widthrawal', themeSetting?.show_widthrawal !== undefined
        ? themeSetting?.show_widthrawal
        : true);
      sidebarSetValue('show_monetary_transaction', themeSetting?.show_monetary_transaction !== undefined
        ? themeSetting?.show_monetary_transaction
        : true);
      sidebarSetValue('show_trading_history', themeSetting?.show_trading_history !== undefined
        ? themeSetting?.show_trading_history
        : true);
      sidebarSetValue('show_trading_terminal', themeSetting?.show_trading_terminal !== undefined
        ? themeSetting?.show_trading_terminal
        : true);
      sidebarSetValue('show_contact_us', themeSetting?.show_contact_us !== undefined
        ? themeSetting?.show_contact_us
        : true);
      sidebarSetValue('show_ib', themeSetting?.show_ib !== undefined
        ? themeSetting?.show_ib
        : false);

      setTradeCountGraph(
        themeSetting?.trade_count_graph !== undefined
          ? JSON.parse(themeSetting?.trade_count_graph)
          : true
      );
      setTradeVolumeGraph(
        themeSetting?.trade_volume_graph !== undefined
          ? JSON.parse(themeSetting?.trade_volume_graph)
          : true
      );
      setAccumulatedProfitGraph(
        themeSetting?.accumulated_profit_graph !== undefined
          ? JSON.parse(themeSetting?.accumulated_profit_graph)
          : true
      );
      setMarginAllocationGraph(
        themeSetting?.margin_allocation_graph !== undefined
          ? JSON.parse(themeSetting?.margin_allocation_graph)
          : true
      );
      setPositionAllocaionGraph(
        themeSetting?.position_allocation_graph !== undefined
          ? JSON.parse(themeSetting?.position_allocation_graph)
          : true
      );
      
      setShowWelcomeMessage(
        themeSetting?.show_welcome_message !== undefined
          ? JSON.parse(themeSetting?.show_welcome_message)
          : true
      );
      setDepositQuickOptions(
        themeSetting?.deposit_quick_options 
          ? (typeof themeSetting.deposit_quick_options === 'string' 
            ? JSON.parse(themeSetting.deposit_quick_options)
            : themeSetting.deposit_quick_options)
          : [250, 500, 1000]
      );
    }
  }, [brandId, brandsInfo]);

  const onSubmit = async (data) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      const request = {
        theme_setting: JSON.stringify({
          ...themeSetting,
          color_theme: data?.brand_color_theme,
          color_preset: data?.brand_color_preset,
          trade_count_graph: tradeCountGraph,
          trade_volume_graph: tradeVolumeGraph,
          accumulated_profit_graph: accumulatedProfitGraph,
          margin_allocation_graph: marginAllocationGraph,
          position_allocation_graph: positionAllocationGraph,
          allow_delete_user: allowDeleteUser,
          welcome_title: data?.welcome_title,
          posts_title: data?.posts_title,
          deposit_quick_options: depositQuickOptions,
          ...sidebarFields,
        }),
        welcome_message: data?.welcome_message,
        welcome_guide: data?.welcome_guide,
        welcome_guide_name: data?.welcome_guide_name,
        risk_warning: data?.risk_warning,
        account_type: showAccountType,
      };
      await brandsApi.updateInternalBrand(brandId, request);
      setTimeout(() => {
        getBrands();
      }, 1000);
      toast.success("Brand settings successfully updated!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleSidebarUpdate = async (data) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      const request = {
        theme_setting: JSON.stringify({
          ...themeSetting,
          ...data,
        }),
      };
      await brandsApi.updateInternalBrand(brandId, request);
      toast.success("Sidebar settings successfully updated!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleGraphChange = async (name, value, setState) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      const request = {
        theme_setting: JSON.stringify({
          ...themeSetting,
          trade_count_graph: tradeCountGraph,
          trade_volume_graph: tradeVolumeGraph,
          accumulated_profit_graph: accumulatedProfitGraph,
          margin_allocation_graph: marginAllocationGraph,
          position_allocation_graph: positionAllocationGraph,
          allow_delete_user: allowDeleteUser,
          deposit_quick_options: depositQuickOptions,
          [name]: value,
        }),
      };
      setState(value);
      await brandsApi.updateInternalBrand(brandId, request);
      toast.success("Brand settings successfully updated!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleInputChange = async (name, value, setState) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      const request = {
        theme_setting: JSON.stringify({
          ...themeSetting,
          [name]: value,
        }),
      };
      setState(value);
      await brandsApi.updateInternalBrand(brandId, request);
      toast.success("Brand settings successfully updated!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleQuickOptionUpdate = async (newOptions) => {
    try {
      const brand = brandsInfo?.find((b) => b?.id === brandId);
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};
      const request = {
        theme_setting: JSON.stringify({
          ...themeSetting,
          deposit_quick_options: JSON.stringify(newOptions),
        }),
      };
      await brandsApi.updateInternalBrand(brandId, request);
      setDepositQuickOptions(newOptions);
      toast.success("Quick options successfully updated!");
      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction="row" columnSpacing={2} rowSpacing={1}>
        <Grid xs={12} md={6}>
          <SelectMenu
            label="Color theme"
            control={control}
            name="brand_color_theme"
            list={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <SelectMenu
            label="Color preset"
            control={control}
            name="brand_color_preset"
            list={[
              { value: "default", label: "Default" },
              { value: "cyan", label: "Cyan" },
              { value: "purple", label: "Purple" },
              { value: "blue", label: "Blue" },
              { value: "orange", label: "Orange" },
              { value: "red", label: "Red" },
            ]}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Stack direction="column" gap={1}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Welcome title
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "This title is showing on the main screen of dashboard, inside the first card before your company name"
                    }
                  </Typography>
                }
              >
                <InfoOutlined
                  sx={{
                    cursor: "pointer",
                    color: "#2993f0",
                  }}
                />
              </Tooltip>
            </Stack>
            <OutlinedInput
              type="text"
              name="welcome_title"
              placeholder="Type title..."
              {...register("welcome_title")}
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={6} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <Stack direction="column" gap={1} width={1}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Welcome message
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "This message is showing on the main screen of dashboard, inside the first card after your account name"
                    }
                  </Typography>
                }
              >
                <InfoOutlined
                  sx={{
                    cursor: "pointer",
                    color: "#2993f0",
                  }}
                />
              </Tooltip>
            </Stack>
            <Stack direction="row" gap={2}>
              <OutlinedInput
                type="text"
                sx={{ width: "100%" }}
                name="welcome_message"
                placeholder="Type welcome message..."
                {...register("welcome_message")}
              />
              <Stack direction="row" alignItems="center">
                <Typography variant="subtitle1">
                  Show
                </Typography>
                <Switch
                  checked={showWelcomeMessage}
                  value={showWelcomeMessage}
                  onChange={(e) =>
                    handleInputChange("show_welcome_message", e?.target?.checked, setShowWelcomeMessage)
                  }
                />
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={12} md={6}>
          {" "}
          <Stack direction="column" gap={1}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Post guide name
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "This name is an account name of the example post on the main dashboard screen in posts card"
                    }
                  </Typography>
                }
              >
                <InfoOutlined
                  sx={{
                    cursor: "pointer",
                    color: "#2993f0",
                  }}
                />
              </Tooltip>
            </Stack>
            <OutlinedInput
              type="text"
              name="welcome_guide_name"
              placeholder="Type welcome guide name..."
              {...register("welcome_guide_name")}
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack direction="column" gap={1}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Post guide
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "This text is an example post on the main dashboard screen in posts card"
                    }
                  </Typography>
                }
              >
                <InfoOutlined
                  sx={{
                    cursor: "pointer",
                    color: "#2993f0",
                  }}
                />
              </Tooltip>
            </Stack>
            <OutlinedInput
              type="text"
              name="welcome_guide"
              placeholder="Type welcome guide..."
              {...register("welcome_guide")}
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Risk warning
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "This text is showing on the sign-in page at the bottom of the page"
                    }
                  </Typography>
                }
              >
                <InfoOutlined
                  sx={{
                    cursor: "pointer",
                    color: "#2993f0",
                  }}
                />
              </Tooltip>
            </Stack>
            <OutlinedInput
              type="text"
              name="risk_warning"
              placeholder="Type risk warning message..."
              {...register("risk_warning")}
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Posts title
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "This title is a posts card title on the main dashboard screen"
                    }
                  </Typography>
                }
              >
                <InfoOutlined
                  sx={{
                    cursor: "pointer",
                    color: "#2993f0",
                  }}
                />
              </Tooltip>
            </Stack>
            <OutlinedInput
              type="text"
              name="posts_title"
              placeholder="Type posts title..."
              {...register("posts_title")}
            />
          </Stack>
        </Grid>
        <Stack
          direction="row"
          justifyContent="flex-end"
          pt={3}
          sx={{ width: 1 }}
          pr={2}
        >
          <LoadingButton 
            variant="contained" 
            sx={{ width: 100 }} 
            type="submit"
            loading={isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
        <Grid xs={12} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5">Auto IB Approval</Typography>
          <Switch value={isAutoIBApproval} checked={isAutoIBApproval} onChange={(event)=> handleUpdateAutoIBApproval(event?.target?.checked)}/>
        </Grid>
        <Grid xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5">Show Deposit Options (Mobile)</Typography>
          <Switch value={isShowDepositOption} checked={isShowDepositOption} onChange={(event)=> handleUpdateShowDepositOption(event?.target?.checked)}/>
        </Grid>
        <Grid xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5">Require OTP for Withdraw Requests</Typography>
          <Switch value={isRequireOTPForWithdraw} checked={isRequireOTPForWithdraw} onChange={(event)=> handleUpdateRequireOTPForWithdraw(event?.target?.checked)}/>
        </Grid>
        <Grid xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5">Show Net Deposit</Typography>
          <Switch value={isShowNetDeposit} checked={isShowNetDeposit} onChange={(event)=> handleUpdateShowNetDeposit(event?.target?.checked)}/>
        </Grid>
        <Grid xs={12} sx={{ mt: 3 }}>
          <Typography variant="h5">Deposit Quick Options</Typography>
        </Grid>
        <Grid xs={12} sx={{ mt: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {depositQuickOptions.map((option, index) => (
              <Chip
                key={index}
                label={option}
                onDelete={() => {
                  const newOptions = depositQuickOptions.filter((_, i) => i !== index);
                  handleQuickOptionUpdate(newOptions);
                }}
              />
            ))}
            
            {depositQuickOptions.length < 4 && !showAddOption && (
              <IconButton 
                onClick={() => setShowAddOption(true)}
                sx={{ ml: 1 }}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            )}

            {showAddOption && (
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  hiddenLabel
                  size="small"
                  type="number"
                  value={newQuickOption}
                  onChange={(e) => setNewQuickOption(e.target.value)}
                  placeholder="Enter amount"
                  sx={{ width: 140 }}
                />
                <LoadingButton
                  size="small"
                  variant="contained"
                  onClick={() => {
                    if (newQuickOption && depositQuickOptions.length < 4) {
                      const newOptions = [...depositQuickOptions, Number(newQuickOption)];
                      handleQuickOptionUpdate(newOptions);
                      setNewQuickOption('');
                      setShowAddOption(false);
                    }
                  }}
                >
                  Add
                </LoadingButton>
                <IconButton 
                  size="small"
                  color="error"
                  onClick={() => {
                    setNewQuickOption('');
                    setShowAddOption(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            )}
          </Stack>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            You can add up to 4 quick deposit options. These will appear as quick selection chips on the deposit dialog.
          </Typography>
        </Grid>
        <Grid xs={12} sx={{ mt: 3 }}>
          <Typography variant="h5">Withdraw Rules</Typography>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Allow withdraw request with no ID verification
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {"Enables/disables ID requirement for withdrawals"}
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={wdNoId}
              value={wdNoId}
              onChange={(e) =>
                handleWithdrawRuleUpdate("wd_no_id", e?.target?.checked, setWdNoId)
              }
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Allow withdraw request with no Billing address verification
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {"Enables/disables billing requirement for withdrawals"}
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={wdNoBilling}
              value={wdNoBilling}
              onChange={(e) =>
                handleWithdrawRuleUpdate("wd_no_billing", e?.target?.checked, setWdNoBilling)
              }
            />
          </Stack>
        </Grid>
        {user?.acc?.acc_e_kyc_manual_id === undefined || user?.acc?.acc_e_kyc_manual_id === true ? (
          <Grid xs={12} md={6}>
            <Stack direction="column" gap={1} pt={2}>
              <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Allow agents to manually approve ID verification
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {"Enables/disables manual ID verification approval by agents"}
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={kycManualId}
              value={kycManualId}
              onChange={(e) =>
                handleWithdrawRuleUpdate("kyc_manual_id", e?.target?.checked, setKycManualId)
              }
            />
          </Stack>
        </Grid>
        ) : null}
        {user?.acc?.acc_e_kyc_manual_billing === undefined || user?.acc?.acc_e_kyc_manual_billing === true ? (
          <Grid xs={12} md={6}>
            <Stack direction="column" gap={1} pt={2}>
              <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Allow agents to manually approve Billing address verification
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {"Enables/disables manual billing address verification approval by agents"}
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={kycManualBilling}
              value={kycManualBilling}
              onChange={(e) =>
                handleWithdrawRuleUpdate("kyc_manual_billing", e?.target?.checked, setKycManualBilling)
              }
            />
          </Stack>
        </Grid>
        ) : null}
        <Grid xs={12} md={6}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Allow withdraw request with any trading account
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {"Enables/disables ability to withdraw from any trading account"}
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={allowWithdrawAnyAccount}
              value={allowWithdrawAnyAccount}
              onChange={(e) =>
                handleGraphChange(
                  "allow_withdraw_any_account",
                  e?.target?.checked,
                  setAllowWithdrawAnyAccount
                )
              }
            />
          </Stack>
        </Grid>
        <Grid xs={12} sx={{ mt: 5 }}>
          <Typography variant="h5">Graphs</Typography>
        </Grid>
        <Grid xs={12} md={2.4}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Trade Count
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "Enables/disables Trade Count card on the main dashboard screen"
                    }
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={tradeCountGraph}
              value={tradeCountGraph}
              onChange={(e) =>
                handleGraphChange(
                  "trade_count_graph",
                  e?.target?.checked,
                  setTradeCountGraph
                )
              }
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={2.4}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Trade Volume
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "Enables/disables Trade Volume card on the main dashboard screen"
                    }
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={tradeVolumeGraph}
              value={tradeVolumeGraph}
              onChange={(e) =>
                handleGraphChange(
                  "trade_volume_graph",
                  e?.target?.checked,
                  setTradeVolumeGraph
                )
              }
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={2.4}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Accumulated Profit
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "Enables/disables Accumulated Profit card on the main dashboard screen"
                    }
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={accumulatedProfitGraph}
              value={accumulatedProfitGraph}
              onChange={(e) =>
                handleGraphChange(
                  "accumulated_profit_graph",
                  e?.target?.checked,
                  setAccumulatedProfitGraph
                )
              }
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={2.4}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Margin Allocation
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "Enables/disables Margin Allocation card on the main dashboard screen"
                    }
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={marginAllocationGraph}
              value={marginAllocationGraph}
              onChange={(e) =>
                handleGraphChange(
                  "margin_allocation_graph",
                  e?.target?.checked,
                  setMarginAllocationGraph
                )
              }
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={2.4}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Position Allocation
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "Enables/disables Position Allocation card on the main dashboard screen"
                    }
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={positionAllocationGraph}
              value={positionAllocationGraph}
              onChange={(e) =>
                handleGraphChange(
                  "position_allocation_graph",
                  e?.target?.checked,
                  setPositionAllocaionGraph
                )
              }
            />
          </Stack>
        </Grid>
        <Grid xs={12} sx={{ mt: 5 }}>
          <Typography variant="h5">Data management</Typography>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack direction="column" gap={1} pt={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle1" px={1}>
                Allow Delete User
              </Typography>
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    {
                      "Allows user to delete his account on the general account settings page"
                    }
                  </Typography>
                }
              >
                <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
              </Tooltip>
            </Stack>
            <Switch
              checked={allowDeleteUser}
              value={allowDeleteUser}
              onChange={(e) =>
                handleGraphChange(
                  "allow_delete_user",
                  e?.target?.checked,
                  setAllowDeleteUser
                )
              }
            />
          </Stack>
        </Grid>

        <Grid xs={12} sx={{ mt: 5 }}>
          <Typography variant="h5">Sidebar menu</Typography>
        </Grid>
        {sidebarList?.map((item)=> (
          <Grid key={item.key} xs={12} md={2.4} pt={2}>
            <CustomSwitchWithLabelInfo
              label={item.label}
              name={item?.key}
              sidebarWatch  control={sidebarControl}
              justifyContent='space-between'
              info={item?.info}
              fieldValues={sidebarFields}
              onSwitchChange={(data) => handleSidebarUpdate(data)}
            />
          </Grid>
        ))}

        <Grid xs={12} sx={{ mt: 5 }}>
          <Typography variant="h5">Transaction Table Settings</Typography>
        </Grid>
        <Grid xs={12}>
          <Stack spacing={3} pt={2}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Default Transactions Table Order</Typography>
              <Button 
                variant="outlined" 
                onClick={() => setTableModalOpen(true)}
                startIcon={<Edit />}
                sx={{ width: 'fit-content' }}
              >
                Configure Transaction Columns
              </Button>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Default Trading History Table Order</Typography>
              <Button 
                variant="outlined" 
                onClick={() => setTradingHistoryModalOpen(true)}
                startIcon={<Edit />}
                sx={{ width: 'fit-content' }}
              >
                Configure Trading History Columns
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} sx={{ mt: 5 }}>
          <Typography variant="h5">Export</Typography>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack direction="row" alignItems="center" spacing={2} pt={2}>
            <Typography variant="subtitle1" sx={{ minWidth: 'fit-content' }}>
              Enable Export for Trading History Table
            </Typography>
            <Switch
              checked={enableTradingHistoryExport}
              value={enableTradingHistoryExport}
              onChange={(e) => handleUpdateTradingHistoryExport(e?.target?.checked)}
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack direction="row" alignItems="center" spacing={2} pt={2}>
            <Typography variant="subtitle1" sx={{ minWidth: 'fit-content' }}>
              Enable Export for Monetary Transactions Table
            </Typography>
            <Switch
              checked={enableMonetaryTransactionsExport}
              value={enableMonetaryTransactionsExport}
              onChange={(e) => handleUpdateMonetaryTransactionsExport(e?.target?.checked)}
            />
          </Stack>
        </Grid>
      </Grid>

      <TableModal
        open={tradingHistoryModalOpen}
        onClose={() => setTradingHistoryModalOpen(false)}
        tableColumn={DEFAULT_TRADING_HISTORY_COLUMNS.map(item => ({
          ...item,
          enabled: tradingHistoryRule?.find(rule => rule.id === item.id)?.enabled ?? item.enabled,
          order: tradingHistoryRule?.find(rule => rule.id === item.id)?.order ?? DEFAULT_TRADING_HISTORY_COLUMNS.findIndex(col => col.id === item.id)
        }))}
        defaultColumn={DEFAULT_TRADING_HISTORY_COLUMNS}
        updateRule={handleUpdateTradingHistoryRule}
        sorting={{}}
        isTrader={false}
      />

      <TableModal
        open={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        tableColumn={DEFAULT_TRANSACTION_COLUMNS.map(item => ({
          ...item,
          enabled: transactionRule?.find(rule => rule.id === item.id)?.enabled ?? item.enabled,
          order: transactionRule?.find(rule => rule.id === item.id)?.order ?? DEFAULT_TRANSACTION_COLUMNS.findIndex(col => col.id === item.id)
        }))}
        defaultColumn={DEFAULT_TRANSACTION_COLUMNS}
        updateRule={handleUpdateTransactionRule}
        sorting={{}}
        isTrader={false}
      />
    </form>
  );
};
