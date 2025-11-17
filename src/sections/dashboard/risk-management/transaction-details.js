import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/system/Unstable_Grid/Grid";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { paths } from "src/paths";
import { getAPIUrl } from "src/config";
import { Iconify } from "src/components/iconify";
import { useRouter } from "src/hooks/use-router";
import { isValidJSON } from "src/utils/function";
import { customersApi } from "src/api/customers";
import { SeverityPill } from "src/components/severity-pill";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { useInternalBrands } from "src/sections/dashboard/settings/dashboard-setting";
import { useAuth } from 'src/hooks/use-auth';
import { useTimezone } from "src/hooks/use-timezone"; 

const statuses = {
  1: "Approved",
  2: "Pending",
  3: "Rejected",
  4: "Canceled",
};

const statusColors = {
  1: "success",
  2: "warning", 
  3: "error",
  4: "info",
};

export const TransactionDetails = ({ transactionId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();
  
  const [transaction, setTransaction] = useState(null);
  const [client, setClient] = useState(null);
  const [tradingAccounts, setTradingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { internalBrandsInfo: brandsInfo } = useInternalBrands();
  const { i18n } = useTranslation();
  const currentLang = i18n?.resolvedLanguage;
  const [loadingStatus, setLoadingStatus] = useState({
    name: undefined,
    loading: false,
  });

  const providerValue = useMemo(() => {
    let provider = { en: transaction?.provider || "N/A" };

    if (isValidJSON(transaction?.provider)) {
      try {
        const parsedForm = JSON.parse(transaction?.provider);
        provider = { ...parsedForm };
      } catch (error) {
        console.error("Error parsing provider:", error);
      }
    }

    return provider;
  }, [transaction?.provider]);

  const currentEnabledBrandCurrencies = useMemo(() => {
    const currentBrand = brandsInfo?.find((brand)=> brand.id == client?.internal_brand_id);

    if (!currentBrand?.available_currencies) {
      return [];
    }

    const availableCurrencies = Object.values(currentBrand?.available_currencies);
    const enabledCurrencies = currentBrand?.enabled_currencies
      ? JSON.parse(currentBrand?.enabled_currencies)
      : null;
  
    if (enabledCurrencies) {
      return availableCurrencies?.filter(currency => enabledCurrencies.includes(currency.key));
    }
  
    return availableCurrencies?.filter(currency => currency.default);
  }, [brandsInfo, client]);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await customersApi.getTransactionDetails(
          transactionId
        );
        setTransaction(response?.transaction);
        
        // Fetch client information after getting transaction
        if (response?.transaction?.client_id) {
          const clientResponse = await customersApi.getCustomerInfo(response?.transaction?.client_id);
          setClient(clientResponse?.client?.client);
          
          // Fetch trading accounts for the client
          const tradingAccountsResponse = await customersApi.getTraderAccounts({
            client_id: response?.transaction?.client_id
          });
          setTradingAccounts(tradingAccountsResponse?.trading_accounts || []);
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  const handleBack = () => {
    router.push(paths.dashboard.risk.transactions);
  };

  const formatText = (text) => {
    return text?.replace(/_/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleDownloadFile = async (name, url, contentType) => {
    setLoadingStatus({ name, loading: true });
    if (url) {
      try {
        const response = await fetch(`${getAPIUrl()}/${url}`, {
          headers: {
            Accept: contentType,
          },
        });

        if (!response.ok) {
          throw new Error("File download failed");
        }

        const blob = await response.blob();
        const extension = contentType?.split("/")[1] || "";
        const filename = `${name || "download"}.${extension}`;
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download error:", error);
      }
        setLoadingStatus({ name: undefined, loading: false });
    }
  };

  const getTradingAccountName = (accountId) => {
    const account = tradingAccounts.find(acc => acc.id === accountId);
    return account ? account.name : accountId;
  };

  const renderRequestInfo = (requestInfo) => {
    if (Array.isArray(requestInfo)) {
      return requestInfo?.map((item, index) => {
        let hasCopyButton = false;
        const currentFormSetting = brandsInfo?.find(
          (brand) => brand.id == transaction?.client?.internal_brand_id
        )?.bank_details;
        if (currentFormSetting?.length > 0) {
          const parsedDetail = JSON.parse(currentFormSetting);
          const isCopyShown =
            parsedDetail?.find((setting) => setting.id == item.id)
              ?.isShowCopy ?? false;
          hasCopyButton = isCopyShown;
        }
        if (item.inputType === 4) {
          let formNameInfo = {};
          let formValueInfo = {};

          if (isValidJSON(item?.name)) {
            const parsedForm = JSON.parse(item?.name);
            formNameInfo = { ...parsedForm };
          } else {
            formNameInfo.en = item?.name;
          }

          if (isValidJSON(item?.value)) {
            const parsedValue = JSON.parse(item?.value);
            formValueInfo = { ...parsedValue };
          } else {
            formValueInfo.en = item?.value;
          }
          return (
            <Stack key={index} gap={0.5}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography fontWeight={600}>
                  {formNameInfo?.[currentLang]?.length > 0
                    ? formNameInfo?.[currentLang]
                    : formNameInfo?.en ?? ""}
                  :
                </Typography>
              </Stack>
              <Stack
                sx={{
                  width: 1,
                  background: "white",
                  borderRadius: 0.5,
                }}
              >
                <Box
                  component="img"
                  alt="Signature"
                  src={
                    formValueInfo?.[currentLang]?.length > 0
                      ? formValueInfo?.[currentLang]
                      : formValueInfo?.en ?? ""
                  }
                  sx={{
                    border: 1,
                    borderColor: "divider",
                  }}
                />
              </Stack>
            </Stack>
          );
        } else {
          let formNameInfo = {};
          let formValueInfo = {};

          if (isValidJSON(item?.name)) {
            const parsedForm = JSON.parse(item?.name);
            formNameInfo = { ...parsedForm };
          } else {
            formNameInfo.en = item?.name;
          }

          if (isValidJSON(item?.value)) {
            const parsedValue = JSON.parse(item?.value);
            formValueInfo = { ...parsedValue };
          } else {
            if (Array.isArray(item?.value)) {
              const parsedArray = item?.value?.map((item) => JSON.parse(item));
              parsedArray.forEach((item) => {
                Object.entries(item).forEach(([key, value]) => {
                  if (!formValueInfo[key]) {
                    formValueInfo[key] = value;
                  } else {
                    formValueInfo[key] += `, ${value}`;
                  }
                });
              });
            } else {
              formValueInfo.en = item?.value;
            }
          }
          return (
            <Stack key={index} direction="row" alignItems="center" gap={1}>
              <Typography fontWeight={600} whiteSpace="nowrap">
                {formNameInfo?.[currentLang]?.length > 0
                  ? formNameInfo?.[currentLang]
                  : formNameInfo?.en ?? ""}
                :
              </Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography direction="row" alignItems="center">
                  {formValueInfo?.[currentLang]?.length > 0
                    ? formValueInfo?.[currentLang]
                    : formValueInfo?.en ?? ""}
                </Typography>
                {hasCopyButton && (
                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        copyToClipboard(
                          formValueInfo?.[currentLang]?.length > 0
                            ? formValueInfo?.[currentLang]
                            : formValueInfo?.en ?? ""
                        )
                      }
                    >
                      <Iconify icon="mdi:content-copy" color="primary.main" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          );
        }
      });
    } else if (typeof requestInfo === "object" && requestInfo !== null) {
      return Object.entries(requestInfo)?.map(([key, value]) => (
        <Stack key={key} direction="row" alignItems="center" gap={2}>
          <Typography fontWeight={600} whiteSpace="nowrap">
            {formatText(key)}:
          </Typography>
          <Typography
            direction="row"
            alignItems="center"
            sx={{ wordBreak: "break-all" }}
          >
            {formatText(value)}
          </Typography>
          <Tooltip title="Copy to clipboard">
            <IconButton edge="end" onClick={() => copyToClipboard(value)}>
              <Iconify icon="mdi:content-copy" color="primary.main" />
            </IconButton>
          </Tooltip>
        </Stack>
      ));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!transaction) {
    return (
      <Card>
        <CardContent>
          <Typography>Transaction not found</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={handleBack} sx={{ color: "primary.main" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5">Transaction Details</Typography>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="h5">General Information</Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography variant="body1">{transaction?.id}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <SeverityPill color={statusColors[transaction?.status]}>
                      {statuses[transaction?.status]}
                    </SeverityPill>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography
                      variant="body1"
                      color={
                        transaction?.amount > 0 ? "success.main" : "error.main"
                      }
                    >
                      {transaction?.amount} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                    </Typography>
                    {transaction?.converted_amount && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Converted: {transaction.converted_amount}
                      </Typography>
                    )}
                  </Box>

                  {transaction?.description && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {transaction.description}
                      </Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {toLocalTime(transaction?.created_at, "PPpp")}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Client
                    </Typography>
                    <Typography
                      variant="body1"
                      component="a"
                      href={paths.dashboard.customers.details.replace(':customerId', client?.id)}
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {client?.first_name ? `${client?.first_name} ${client?.last_name}` : client?.full_name}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction Type
                    </Typography>
                    <Typography variant="body1">
                      {transaction?.transaction_type}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Provider
                    </Typography>
                    <Typography variant="body1">
                      {providerValue?.[currentLang]?.length > 0 ? providerValue?.[currentLang] : providerValue?.en ?? "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Trading Account
                    </Typography>
                    <Typography variant="body1">
                      {getTradingAccountName(transaction?.trading_account_id) || "N/A"}
                    </Typography>
                  </Box>

                  {transaction?.labels?.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Labels
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {transaction?.labels?.map((label) => (
                          <Chip
                            key={label.id}
                            label={label.status}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {transaction?.error_code && (
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center"> 
                        <Typography variant="subtitle2" color="text.secondary">
                          Error Code
                        </Typography> 
                        <Tooltip title="Copy">
                          <IconButton
                            onClick={() => {
                              navigator.clipboard.writeText(transaction.error_code);
                              toast.success('Copied to clipboard');
                            }}
                            size="small"
                            color="primary"
                          >
                            <Iconify icon="solar:copy-linear" width={20} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography 
                          variant="subtitle2" 
                          color={'error.main'}
                          sx={{
                            wordBreak: 'break-all',
                            maxWidth: 420,
                          }}
                        >
                          {transaction?.error_code}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          {((transaction?.external_transaction_id && user?.acc?.acc_v_external_transaction_id !== false) ||
            (transaction?.external_brand && user?.acc?.acc_v_external_brand !== false) ||
            (transaction?.external_user_id && user?.acc?.acc_v_external_user_id !== false) ||
            (transaction?.payment_method && user?.acc?.acc_v_payment_method !== false) ||
            (transaction?.payment_method_code && user?.acc?.acc_v_payment_method_code !== false) ||
            (transaction?.processing_status && user?.acc?.acc_v_processing_status !== false) ||
            (transaction?.failure_reason && user?.acc?.acc_v_failure_reason !== false)) && (
            <>
              <Divider />
              <Stack spacing={2}>
                <Typography variant="h5">External Information</Typography>
                <Grid container spacing={3}>
                  {transaction?.external_transaction_id && user?.acc?.acc_v_external_transaction_id !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          External Transaction ID
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body1">
                            {transaction.external_transaction_id}
                          </Typography>
                          <Tooltip title="Copy">
                            <IconButton
                              onClick={() => {
                                navigator.clipboard.writeText(transaction.external_transaction_id);
                                toast.success('Copied to clipboard');
                              }}
                              size="small"
                              color="primary"
                            >
                              <Iconify icon="solar:copy-linear" width={20} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.external_brand && user?.acc?.acc_v_external_brand !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          External Brand
                        </Typography>
                        <Typography variant="body1">
                          {transaction.external_brand}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.external_user_id && user?.acc?.acc_v_external_user_id !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          External User ID
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body1">
                            {transaction.external_user_id}
                          </Typography>
                          <Tooltip title="Copy">
                            <IconButton
                              onClick={() => {
                                navigator.clipboard.writeText(transaction.external_user_id);
                                toast.success('Copied to clipboard');
                              }}
                              size="small"
                              color="primary"
                            >
                              <Iconify icon="solar:copy-linear" width={20} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.payment_method && user?.acc?.acc_v_payment_method !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Payment Method
                        </Typography>
                        <Typography variant="body1">
                          {transaction.payment_method}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.payment_method_code && user?.acc?.acc_v_payment_method_code !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Payment Method Code
                        </Typography>
                        <Typography variant="body1">
                          {transaction.payment_method_code}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.processing_status && user?.acc?.acc_v_processing_status !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Processing Status
                        </Typography>
                        <Typography variant="body1">
                          {transaction.processing_status}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.failure_reason && user?.acc?.acc_v_failure_reason !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Failure Reason
                        </Typography>
                        <Typography variant="body1">
                          {transaction.failure_reason}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </>
          )}

          {((transaction?.real_balance_before !== undefined && transaction?.real_balance_before !== null && user?.acc?.acc_v_real_balance_before !== false) ||
            (transaction?.real_balance_after !== undefined && transaction?.real_balance_after !== null && user?.acc?.acc_v_real_balance_after !== false) ||
            (transaction?.bonus_balance_before !== undefined && transaction?.bonus_balance_before !== null && user?.acc?.acc_v_bonus_balance_before !== false) ||
            (transaction?.bonus_balance_after !== undefined && transaction?.bonus_balance_after !== null && user?.acc?.acc_v_bonus_balance_after !== false)) && (
            <>
              <Divider />
              <Stack spacing={2}>
                <Typography variant="h5">Balance Information</Typography>
                <Grid container spacing={3}>
                  {transaction?.real_balance_before !== undefined && transaction?.real_balance_before !== null && user?.acc?.acc_v_real_balance_before !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Real Balance Before
                        </Typography>
                        <Typography variant="body1">
                          {transaction.real_balance_before} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.real_balance_after !== undefined && transaction?.real_balance_after !== null && user?.acc?.acc_v_real_balance_after !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Real Balance After
                        </Typography>
                        <Typography variant="body1">
                          {transaction.real_balance_after} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.bonus_balance_before !== undefined && transaction?.bonus_balance_before !== null && user?.acc?.acc_v_bonus_balance_before !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Bonus Balance Before
                        </Typography>
                        <Typography variant="body1">
                          {transaction.bonus_balance_before} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.bonus_balance_after !== undefined && transaction?.bonus_balance_after !== null && user?.acc?.acc_v_bonus_balance_after !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Bonus Balance After
                        </Typography>
                        <Typography variant="body1">
                          {transaction.bonus_balance_after} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </>
          )}

          {((transaction?.bonus_code && user?.acc?.acc_v_bonus_code !== false) ||
            (transaction?.bonus_type && user?.acc?.acc_v_bonus_type !== false) ||
            (transaction?.bonus_release_amount !== undefined && transaction?.bonus_release_amount !== null && user?.acc?.acc_v_bonus_release_amount !== false) ||
            (transaction?.bonus_cancel_reason && user?.acc?.acc_v_bonus_cancel_reason !== false)) && (
            <>
              <Divider />
              <Stack spacing={2}>
                <Typography variant="h5">Bonus Information</Typography>
                <Grid container spacing={3}>
                  {transaction?.bonus_code && user?.acc?.acc_v_bonus_code !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Bonus Code
                        </Typography>
                        <Typography variant="body1">
                          {transaction.bonus_code}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.bonus_type && user?.acc?.acc_v_bonus_type !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Bonus Type
                        </Typography>
                        <Typography variant="body1">
                          {transaction.bonus_type}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.bonus_release_amount !== undefined && transaction?.bonus_release_amount !== null && user?.acc?.acc_v_bonus_release_amount !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Bonus Release Amount
                        </Typography>
                        <Typography variant="body1">
                          {transaction.bonus_release_amount} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.bonus_cancel_reason && user?.acc?.acc_v_bonus_cancel_reason !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Bonus Cancel Reason
                        </Typography>
                        <Typography variant="body1">
                          {transaction.bonus_cancel_reason}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </>
          )}

          {((transaction?.total_pending_withdrawals_count !== undefined && transaction?.total_pending_withdrawals_count !== null && user?.acc?.acc_v_total_pending_withdrawals_count !== false) ||
            (transaction?.total_pending_withdrawals_amount !== undefined && transaction?.total_pending_withdrawals_amount !== null && user?.acc?.acc_v_total_pending_withdrawals_amount !== false) ||
            (transaction?.user_net_deposits !== undefined && transaction?.user_net_deposits !== null && user?.acc?.acc_v_user_net_deposits !== false) ||
            (transaction?.is_first_deposit !== undefined && transaction?.is_first_deposit !== null && user?.acc?.acc_v_is_first_deposit !== false)) && (
            <>
              <Divider />
              <Stack spacing={2}>
                <Typography variant="h5">Additional Information</Typography>
                <Grid container spacing={3}>
                  {transaction?.total_pending_withdrawals_count !== undefined && transaction?.total_pending_withdrawals_count !== null && user?.acc?.acc_v_total_pending_withdrawals_count !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Pending Withdrawals Count
                        </Typography>
                        <Typography variant="body1">
                          {transaction.total_pending_withdrawals_count}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.total_pending_withdrawals_amount !== undefined && transaction?.total_pending_withdrawals_amount !== null && user?.acc?.acc_v_total_pending_withdrawals_amount !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Pending Withdrawals Amount
                        </Typography>
                        <Typography variant="body1">
                          {transaction.total_pending_withdrawals_amount} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.user_net_deposits !== undefined && transaction?.user_net_deposits !== null && user?.acc?.acc_v_user_net_deposits !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          User Net Deposits
                        </Typography>
                        <Typography variant="body1">
                          {transaction.user_net_deposits} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.is_first_deposit !== undefined && transaction?.is_first_deposit !== null && user?.acc?.acc_v_is_first_deposit !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Is First Deposit
                        </Typography>
                        <Typography variant="body1">
                          {transaction.is_first_deposit ? 'Yes' : 'No'}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </>
          )}

          {transaction?.webhook_data && user?.acc?.acc_v_webhook_data !== false && (
            <>
              <Divider />
              <Stack spacing={2}>
                <Typography variant="h5">Webhook Data</Typography>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Webhook Data
                  </Typography>
                  <Grid container spacing={3}>
                    {transaction?.webhook_data?.acc_real_balance !== undefined && user?.acc?.acc_v_real_balance_before !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Account Real Balance
                        </Typography>
                        <Typography variant="body1">
                          {transaction.webhook_data.acc_real_balance} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {transaction?.webhook_data?.acc_bonus_balance !== undefined && user?.acc?.acc_v_bonus_balance_before !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Account Bonus Balance
                        </Typography>
                        <Typography variant="body1">
                          {transaction.webhook_data.acc_bonus_balance} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {transaction?.webhook_data?.acc_last_bonus_code && user?.acc?.acc_v_bonus_code !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Last Bonus Code
                        </Typography>
                        <Typography variant="body1">
                          {transaction.webhook_data.acc_last_bonus_code}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {transaction?.webhook_data?.acc_last_bonus_type && user?.acc?.acc_v_bonus_type !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Last Bonus Type
                        </Typography>
                        <Typography variant="body1">
                          {transaction.webhook_data.acc_last_bonus_type}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {transaction?.webhook_data?.acc_last_transaction_id && user?.acc?.acc_v_transaction !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Last Transaction ID
                        </Typography>
                        <Typography variant="body1">
                          {transaction.webhook_data.acc_last_transaction_id}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {transaction?.webhook_data?.acc_last_bonus_complete_date && user?.acc?.acc_v_event_date !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Last Bonus Complete Date
                        </Typography>
                        <Typography variant="body1">
                          {toLocalTime(transaction.webhook_data.acc_last_bonus_complete_date, "PPpp")}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {transaction?.webhook_data?.acc_last_bonus_release_amount !== undefined && user?.acc?.acc_v_bonus_release_amount !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Last Bonus Release Amount
                        </Typography>
                        <Typography variant="body1">
                          {transaction.webhook_data.acc_last_bonus_release_amount} {currentEnabledBrandCurrencies?.find(c => c.key === transaction?.currency)?.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  </Grid>
                </Box>
              </Stack>
            </>
          )}

          {((transaction?.event_date && user?.acc?.acc_v_event_date !== false) ||
            (transaction?.source_system && user?.acc?.acc_v_source_system !== false)) && (
            <>
              <Divider />
              <Stack spacing={2}>
                <Typography variant="h5">System Information</Typography>
                <Grid container spacing={3}>
                  {transaction?.event_date && user?.acc?.acc_v_event_date !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Event Date
                        </Typography>
                        <Typography variant="body1">
                          {toLocalTime(transaction.event_date, "PPpp")}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {transaction?.source_system && user?.acc?.acc_v_source_system !== false && (
                    <Grid xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Source System
                        </Typography>
                        <Typography variant="body1">
                          {transaction.source_system}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </>
          )}

          {transaction?.request_data && (
            <>
              <Divider />
              <Stack spacing={2}>
                <Typography variant="h5">Request Data Info</Typography>
                <Stack direction="column" gap={1.5}>
                  {renderRequestInfo(JSON.parse(transaction.request_data))}
                  {transaction?.transaction_docs_with_names?.map(
                    (doc, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        alignItems="center"
                        gap={0.5}
                      >
                        <Iconify icon="ion:document-text-outline" width={24} />
                        <Typography fontWeight={600} whiteSpace="nowrap">
                          {doc?.name}:
                        </Typography>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() =>
                              handleDownloadFile(
                                doc?.name,
                                doc?.url,
                                doc?.content_type
                              )
                            }
                            color="primary"
                          >
                            {loadingStatus.name === doc.name &&
                            loadingStatus.loading ? (
                              <Iconify
                                icon="line-md:downloading-loop"
                                width={24}
                              />
                            ) : (
                              <Iconify icon="pajamas:download" width={24} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )
                  )}
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
