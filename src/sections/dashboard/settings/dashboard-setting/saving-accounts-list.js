import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";


import { Fragment, useEffect, useMemo, useState } from "react";
import { SeverityPill } from "src/components/severity-pill";
import { settingsApi } from "src/api/settings";
import { SavingAccountModal } from "./saving-account-modal";
import { EditSavingAccount } from "./edit-saving-account";
import { getAPIUrl } from "src/config";
import { getAssetPath } from "src/utils/asset-path";

const SavingAccountItem = ({ account, onAccountOpen, onSetAccount, tickers = [] }) => {

  const ticker = useMemo(() => {
    const _ticker = tickers?.find(t => t?.value === account?.ticker_id);

    return _ticker ?? null;
  }, [tickers, account]);

  return (
    <Grid
      item
      xs={12}
      md={5}
      sx={{
        cursor: "pointer",
      }}
      onClick={() => {
        onSetAccount(account);
        onAccountOpen();
      }}
    >
      <Card>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 4, backgroundColor: "#ebebeb" }}>
          <Avatar
            src={account?.file ? account?.file?.includes('http') ? account?.file : `${getAPIUrl()}/${account?.file}` : ""}
            sx={{ width: 100, height: 100 }} />
          <Stack spacing={1} alignItems="flex-end">
            <Typography variant="h4" color="primary">{account?.name}</Typography>
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
              <Typography variant="h7">
                {ticker?.label}
              </Typography>
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
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export const SavingAccountsList = ({ accounts, onGetAccounts }) => {
  const [accountOpen, setAccountOpen] = useState(false);
  const [editAccountOpen, setEditAccountOpen] = useState(false);
  const [accountToShow, setAccountToShow] = useState(null);
  const [accountoEdit, setAccountToEdit] = useState(null);
  const [tickers, setTickers] = useState([]);

  const getTickers = async () => {
    try {
      const res = await settingsApi.getTickers();
      setTickers(
        res?.tickers?.map((ticker) => ({
          label: ticker?.name,
          value: ticker?.id,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTickers();
  }, []);

  if (!accounts?.length) {
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
  }

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
        <SavingAccountModal
          open={accountOpen}
          onClose={() => setAccountOpen(false)}
          account={accountToShow}
          onGetAccounts={onGetAccounts}
          onAccountEdit={(account) => {
            setAccountToEdit(account);
            setEditAccountOpen(true);
          }}
          tickers={tickers}
        />
      ) : null}

      {accountoEdit ? (
        <EditSavingAccount
          open={editAccountOpen}
          onClose={() => setEditAccountOpen(false)}
          account={accountoEdit}
          onGetAccounts={onGetAccounts}
          tickers={tickers}
        />
      ) : null}
    </Fragment>
  );
};
