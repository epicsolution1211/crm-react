import { Fragment, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CircularProgress } from "src/components/circular-progress";
import { SeverityPill } from "src/components/severity-pill";
import { settingsApi } from "src/api/settings";
import { AccountShowModal } from "./account-show-modal";
import { EditAccountModal } from "./edit-account-modal";
import { getAPIUrl } from "src/config";
import { getAssetPath } from "src/utils/asset-path";

const SavingAccountItem = ({
  account,
  onAccountOpen,
  onSetAccount,
  tickers = [],
}) => {
  const ticker = useMemo(() => {
    const _ticker = tickers?.find((t) => t?.value === account?.ticker_id);

    return _ticker ?? null;
  }, [tickers, account]);

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      xl={3}
      sx={{
        cursor: "pointer",
      }}
      onClick={() => {
        onSetAccount(account);
        onAccountOpen();
      }}
    >
      <Card>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ p: 4, background: "#ebebeb" }}
          spacing={4}
        >
          <Avatar
            src={
              account?.file_url
                ? account?.file_url?.includes("http")
                  ? account?.file_url
                  : `${getAPIUrl()}/${account?.file_url}`
                : ""
            }
            sx={{ width: 100, height: 100 }}
          />

          <Stack spacing={1}>
            <Typography variant="h5" color="primary">
              {account?.name}
            </Typography>
          </Stack>
        </Stack>

        <CardContent>
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Ticker:</Typography>
              <Typography variant="h7">{ticker?.label}</Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Status:</Typography>
              {account?.active ? (
                <SeverityPill color="success">Active</SeverityPill>
              ) : (
                <SeverityPill color="error">Inactive</SeverityPill>
              )}
            </Stack>

            {account?.percentage && account?.amount ? (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">ROI:</Typography>
                <Typography variant="h7">$ {Number(account?.amount + (account?.amount * (account?.percentage / 100))).toFixed(2)}</Typography>
              </Stack>
            ) : null}

            {account?.percentage && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Percentage:</Typography>
                <Typography variant="h7">{account?.percentage}%</Typography>
              </Stack>
            )}

            {account?.start_date && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Start:</Typography>
                <Typography variant="h7">{format(new Date(account?.start_date), 'dd/MM/yyyy HH:mm')}</Typography>
              </Stack>
            )}

            {account?.start_date && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">End:</Typography>
                <Typography variant="h7">{format(new Date(account?.end_date), 'dd/MM/yyyy HH:mm')}</Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export const CustomerAccountsList = ({
  accounts: clientAccounts,
  onGetAccounts,
  customerId,
}) => {
  const [accountOpen, setAccountOpen] = useState(false);
  const [editAccountOpen, setEditAccountOpen] = useState(false);
  const [accountToShow, setAccountToShow] = useState(null);
  const [accountoEdit, setAccountToEdit] = useState(null);
  const [tickers, setTickers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTickers = async () => {
    try {
      const res = await settingsApi.getTickers();
      setTickers(
        res?.tickers?.map((ticker) => ({
          label: ticker?.base_currency_symbol + " - " + ticker?.currency_symbol,
          value: ticker?.id,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAccounts = async () => {
    setIsLoading(true);
    try {
      setAccounts(
        clientAccounts?.map((sa) => ({
          ...sa,
          label: sa?.name,
          value: sa?.id,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const handleUpdateAccount = (updatedAccount) => {
    const newList = accounts?.map((account)=> {
      if(account?.id == updatedAccount?.id) {
        return {...account, ...updatedAccount}
      } else {
        return account
      }
    })
    setAccountToShow(prev=> ({...prev, ...updatedAccount}))
    setAccounts(newList ?? []);
  }

  useEffect(() => {
    getAccounts();
  }, [clientAccounts]);

  useEffect(() => {
    getTickers();
  }, []);

  if (isLoading) {
    return (
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
    );
  } else if (!isLoading && accounts.length == 0) {
    return (
      <Box
        sx={{
          py: 5,
          maxWidth: 1,
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={getAssetPath("/assets/errors/error-404.png")}
          sx={{
            height: "auto",
            maxWidth: 120,
          }}
        />
        <Typography color="text.secondary" sx={{ mt: 2 }} variant="subtitle1">
          There are no contracts yet
        </Typography>
      </Box>
    );
  } else
    return (
      <Fragment>
        <Stack sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {accounts?.map((account) => (
              <SavingAccountItem
                account={account}
                key={account?.id}
                onAccountOpen={() => setAccountOpen(true)}
                onSetAccount={setAccountToShow}
                tickers={tickers}
              />
            ))}
          </Grid>
        </Stack>

        {accountToShow ? (
          <AccountShowModal
            open={accountOpen}
            onClose={() => setAccountOpen(false)}
            account={accountToShow}
            onGetAccounts={onGetAccounts}
            onAccountEdit={(account) => {
              setAccountToEdit(account);
              setEditAccountOpen(true);
            }}
          />
        ) : null}

        {accountoEdit ? (
          <EditAccountModal
            open={editAccountOpen}
            onClose={() => setEditAccountOpen(false)}
            account={accountoEdit}
            onGetAccounts={onGetAccounts}
            customerId={customerId}
            accounts={accounts}
            updateAccount={handleUpdateAccount}
          />
        ) : null}
      </Fragment>
    );
};
