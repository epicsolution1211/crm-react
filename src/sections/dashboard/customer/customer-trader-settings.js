/* eslint-disable no-unused-vars */
import { toast } from "react-hot-toast";
import { useCallback, useEffect, useMemo, useState } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";

import { Iconify } from "src/components/iconify";
import { useAuth } from "src/hooks/use-auth";
import { customersApi } from "src/api/customers";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { CustomerTraderAccounts } from "./customer-trader-accounts";
import { useInternalBrands } from "./customer-transaction";

export const CustomerTraderSettings = ({ getClient, customerId, customerInfo }) => {
  const { user, company } = useAuth();
  const { internalBrandsInfo: brandsInfo } = useInternalBrands();
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [currency, setCurrency] = useState("");
  const [accountTypes, setAccountTypes] = useState([]);
  const [active, setActive] = useState(false);
  const [lockTrading, setLockTrading] = useState(false);
  const [lockTransfer, setLockTransfer] = useState(false);
  const [lockWithdraw, setLockWithdraw] = useState(false);
  const [tradeLink, setTradeLink] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currencies, setCurencies] = useState([
    {
      value: 1,
      title: "$ USD",
    },
    {
      value: 2,
      title: "€ EU",
    },
    {
      value: 3,
      title: "£ Pound",
    },
    {
      value: 4,
      title: "CA$ Canadian Dollar",
    },
    {
      value: 5,
      title: "a$ Australian Dollar",
    },
  ]);

  const currentEnabledBrandCurrencies = useMemo(() => {
    const currentBrand = brandsInfo?.find((brand)=> brand.id == customerInfo?.client?.internal_brand_id);

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
  }, [brandsInfo, customerInfo])

  const handleCustomerAndAccountTypeGet = async () => {
    const response = await customersApi.getCustomerInfo(customerId);
    const accountTypesResponse = await customersApi.getAccountTypes();

    setAccountTypes(accountTypesResponse?.account_types);

    if (response?.client?.client) {
      setActive(response?.client?.client?.active_trader);
      setLockTrading(response?.client?.client?.freeze_trading);
      setLockTransfer(response?.client?.client?.lock_transfer);
      setLockWithdraw(response?.client?.client?.lock_withdraw);
    }

    if (response?.client?.client?.t_account_type_id) {
      setAccountType(response?.client?.client?.t_account_type_id);
    } else {
      setAccountType(accountTypesResponse?.default_account_type?.id);
    }

    if (response?.client?.link) {
      setTradeLink(response.client.link);
    }

    if (response?.client?.client?.dash_pass)
      setPassword(response?.client?.client?.dash_pass);

    if (response?.client?.client?.trader_currency)
      setCurrency(response?.client?.client?.trader_currency);
  };

  useEffect(() => {
    handleCustomerAndAccountTypeGet();
  }, []);

  const handleLoginTrader = () => {
    if(tradeLink) {
      const validTraderLink = tradeLink?.includes('http') ? tradeLink : `https://${tradeLink}`;
      window.open(validTraderLink);
      handleCustomerAndAccountTypeGet();
    }
  }

  const handleUpdatePassword = useCallback(async () => {
    try {
      const request = {
        id: customerId,
        password,
      };
      await customersApi.updateCustomer(request);
      toast.success("Trader password successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [password]);

  const handleUpdateAccountType = useCallback(async (event) => {
    try {
      const request = {
        id: customerId,
        client_rank: event?.target?.value,
      };
      setAccountType(event?.target?.value);
      await customersApi.updateCustomer(request);
      toast.success("Account type successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  const handleUpdateCurrency = useCallback(async (event) => {
    try {
      const request = {
        id: customerId,
        trader_currency: event?.target?.value,
      };
      setCurrency(event?.target?.value);
      await customersApi.updateCustomer(request);
      await getClient();
      toast.success("Currency successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  const handleUpdateActive = async () => {
    const newActiveState = !active;
    setActive(newActiveState);

    try {
      await customersApi.updateCustomer({
        id: customerId,
        active_trader: newActiveState,
      });

      setTimeout(() => {
        getClient();
      }, 1000);
      toast.success("Active trader successfully changed!");
    } catch (error) {
      console.error(error);
      setActive(!newActiveState);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateLockTrading = async () => {
    const newLockTradingState = !lockTrading;
    setLockTrading(newLockTradingState);

    try {
      await customersApi.updateCustomer({
        id: customerId,
        freeze_trading: newLockTradingState,
      });
      toast.success("Lock Trading successfully changed!");
    } catch (error) {
      console.error(error);
      setLockTrading(!newLockTradingState);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateLockTransfer = async () => {
    const newLockTransferState = !lockTransfer;
    setLockTransfer(newLockTransferState);

    try {
      await customersApi.updateCustomer({
        id: customerId,
        lock_transfer: newLockTransferState,
      });
      toast.success("Lock Transfer successfully changed!");
    } catch (error) {
      console.error(error);
      setLockTransfer(!newLockTransferState);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateLockWithdraw = async () => {
    const newLockWithdrawState = !lockWithdraw;
    setLockWithdraw(newLockWithdrawState);

    try {
      await customersApi.updateCustomer({
        id: customerId,
        lock_withdraw: newLockWithdrawState,
      });
      toast.success("Lock Withdraw successfully changed!");
    } catch (error) {
      console.error(error);
      setLockWithdraw(!newLockWithdrawState);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Stack spacing={4}>
        <Card>
          <CardHeader title={company?.company_type === 2 ? "Dashboard Settings" : "Trader Settings"} />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  sx={{ width: 1 }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                >
                  <Stack spacing={3}>
                    <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" sx={{ minWidth: 200 }}>
                      <Typography sx={{ fontWeight: 600 }}>Active:</Typography>
                      <Switch
                        checked={active}
                        onChange={handleUpdateActive}
                        disabled={!user?.acc?.acc_e_client_freez}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ minWidth: 200 }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        {company?.company_type === 2 ? "Lock Account" : "Lock Trading"}:
                      </Typography>
                      <Switch
                        checked={lockTrading}
                        onChange={handleUpdateLockTrading}
                        disabled={!user?.acc?.acc_e_client_trade_lock}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ minWidth: 200 }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        Lock Transfer:
                      </Typography>
                      <Switch
                        checked={lockTransfer}
                        onChange={handleUpdateLockTransfer}
                        disabled={!user?.acc?.acc_e_client_transfer_lock && user?.acc?.acc_e_client_transfer_lock !== undefined}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ minWidth: 200 }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        Lock Withdraw:
                      </Typography>
                      <Switch
                        checked={lockWithdraw}
                        onChange={handleUpdateLockWithdraw}
                        disabled={!user?.acc?.acc_e_client_withdraw_lock && user?.acc?.acc_e_client_withdraw_lock !== undefined}
                      />
                    </Stack>
                  </Stack>

                  {company?.company_type !== 2 && (
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start" spacing={2} sx={{ mt: { xs: 2, sm: 0 } }}>
                      {user?.acc?.acc_v_client_trader_link === undefined ||
                        user?.acc?.acc_v_client_trader_link ? (
                        <Button
                          variant="contained"
                          onClick={() => handleLoginTrader()}
                          fullWidth
                          sx={{ height: 50 }}
                        >
                          Login to trader
                        </Button>
                      ) : null}
                      {user?.acc?.acc_v_client_trader_link === undefined ||
                        user?.acc?.acc_v_client_trader_link ? (
                        <Button
                          variant="contained"
                          onClick={() => copyToClipboard(tradeLink)}
                          fullWidth
                          sx={{ height: 50, whiteSpace: 'nowrap' }}
                        >
                          Copy Login Link
                        </Button>
                      ) : null}
                    </Stack>
                  )}
                </Stack>
                <Stack spacing={5} sx={{ mt: 5 }}>
                  <Stack
                    spacing={4}
                    alignItems="flex-end"
                    justifyContent="space-between"
                    direction={{ xs: 'column', md: 'row' }}
                  >
                    {user?.acc?.acc_v_client_account_type ? (
                      <Stack spacing={2} sx={{ width: { xs: '100%', md: '48%' } }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle1">Default account type</Typography>
                          <Tooltip title="This refers to the type of trading account that will be assigned when a user creates one from their dashboard. It does not reflect the user's current account type. To update the default for all clients, please contact your CRM admin to adjust it in the settings.">
                            <IconButton>
                              <Iconify icon="material-symbols:info-outline" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        <Select
                          value={accountType}
                          onChange={handleUpdateAccountType}
                          disabled={!user?.acc?.acc_e_client_account_type}
                          fullWidth
                        >
                          {accountTypes?.map((accountType) => (
                            <MenuItem
                              key={accountType?.id}
                              value={accountType?.id}
                            >
                              {accountType?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    ) : null}
                    {user?.acc?.acc_v_client_password ? (
                      <Stack spacing={2} sx={{ width: { xs: '100%', md: '48%' }, mt: { xs: 3, md: 0 } }}>
                        <Typography variant="subtitle1">Password</Typography>
                        <Stack 
                          spacing={2} 
                          direction={{ xs: 'column', sm: 'row' }} 
                          alignItems={{ xs: 'stretch', sm: 'center' }}
                        >
                          <OutlinedInput
                            name="user_password"
                            autoComplete="new-password"
                            onChange={(event) =>
                              setPassword(event?.target?.value)
                            }
                            label="Password"
                            value={password}
                            placeholder="Type password here..."
                            fullWidth
                            sx={{ height: "58px" }}
                            type="text"
                            style={showPassword ? {} : { WebkitTextSecurity: 'disc' }}
                            endAdornment={
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                  <Iconify icon="mdi:eye" />
                                </IconButton>
                                <IconButton onClick={() => copyToClipboard(password)}>
                                  <Iconify icon="solar:copy-bold" />
                                </IconButton>
                              </Stack>
                            }
                          />
                          <Button
                            onClick={handleUpdatePassword}
                            disabled={
                              !password || !user?.acc?.acc_e_client_password
                            }
                            variant="contained"
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                          >
                            Save
                          </Button>
                        </Stack>
                      </Stack>
                    ) : null}
                  </Stack>
                  {/* {user?.acc?.acc_v_client_currency ? (
                    <Stack spacing={3} sx={{ width: "49%" }}>
                      <Typography variant="subtitle1">Currency</Typography>
                      <Select
                        disabled={!user?.acc?.acc_e_client_currency}
                        value={currency}
                        onChange={handleUpdateCurrency}
                        fullWidth
                      >
                        {currencies.map((c) => (
                          <MenuItem key={c.value} value={c.value}>
                            {c.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  ) : null} */}
                  <>
                    <Typography variant="h6" sx={{ mt: 2 }}>{company?.company_type === 2 ? "Platform Accounts" : "Trader Accounts"}</Typography>
                    <CustomerTraderAccounts customerId={customerId} currentEnabledBrandCurrencies={currentEnabledBrandCurrencies} customerInfo={customerInfo} brandsInfo={brandsInfo}/>
                  </>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};
