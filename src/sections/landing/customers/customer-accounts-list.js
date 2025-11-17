import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { Fragment } from "react";
import { SeverityPill } from "src/components/severity-pill";

const SavingAccountItem = ({
  account,
}) => {
  return (
    <Grid
      item
      xs={3}
      sx={{
        cursor: "pointer",
      }}
    >
      <Card
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{ p: 4 }}
          spacing={4}
        >
          <Avatar src={account?.file} sx={{ width: 100, height: 100 }} />

          <Stack spacing={1}>
            <Typography variant="h5" color="primary">
              {account?.name}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <CardContent>
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Ticker:</Typography>
              <Typography variant="h7">{account?.ticker}</Typography>
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

export const CustomerAccountsList = () => {

  const accountMockedList = [
    {
      id: 1,
      name: "Alex Johnson Financials",
      ticker: "AJF",
      active: true,
    },
    {
      id: 2,
      name: "Sophie Williams Investments",
      ticker: "SWI",
      active: false,
    },
    {
      id: 3,
      name: "Daniel Davis Holdings",
      ticker: "DDH",
      active: true,
    },
    {
      id: 4,
      name: "Olivia Brown Capital",
      ticker: "OBC",
      active: false,
    }
  ];

  return (
    <Fragment>
      <Stack sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {accountMockedList?.map((account) => (
            <SavingAccountItem
              account={account}
              key={account?.id}
            />
          ))}
        </Grid>
      </Stack>
    </Fragment>
  );
};
