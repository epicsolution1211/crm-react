import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import { v4 as uuid4 } from "uuid";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";

export const LandingCustomerTraderSettings = () => {
  const [currency, setCurrency] = useState(1);
  const [accountTypes, setAccountTypes] = useState(1);

  const currencies = [
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
  ];

  const accountsType = [
    {
      id: 1,
      name: "General",
    },
    {
      id: 2,
      name: "Admin",
    },
    {
      id: 2,
      name: "Dev",
    },
  ]

  return (
    <Stack spacing={4} >
      <Card>
        <CardHeader title="Trader Settings" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack
                spacing={3}
                sx={{ width: 1 }}
                alignItems="center"
                direction="row"
                justifyContent="space-between"
              >
                <Stack spacing={3} sx={{ maxWidth: 200 }}>
                  <Stack direction="row" alignItems="center" spacing={10}>
                    <Typography sx={{ fontWeight: 600 }}>Active:</Typography>
                    <Switch
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      Lock Trading:
                    </Typography>
                    <Switch
                    />
                  </Stack>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Button
                    variant="contained"
                  >
                    Login to trader
                  </Button>
                  <Button
                    variant="contained"
                  >
                    Copy Login Link
                  </Button>
                </Stack>
              </Stack>
              <Stack spacing={5} sx={{ mt: 5 }}>
                <Stack
                  spacing={4}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack spacing={2} sx={{ width: "50%" }}>
                    <Typography variant="subtitle1">Account type</Typography>
                    <Select
                      value={accountTypes}
                      fullWidth
                      onChange={(event) => setAccountTypes(event?.target?.value)}
                    >
                      {accountsType?.map((accountType) => (
                        <MenuItem
                          key={accountType?.id}
                          value={accountType?.id}
                        >
                          {accountType?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  <Stack spacing={2} sx={{ width: "50%" }}>
                    <Typography variant="subtitle1">Password</Typography>
                    <Stack spacing={3} direction="row" alignItems="center">
                      <OutlinedInput
                        name="password"
                        value={uuid4()}
                        placeholder="Type password here..."
                        fullWidth
                      />
                      <Button
                        variant="contained"
                      >
                        Save
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack spacing={3} sx={{ width: "49%" }}>
                  <Typography variant="subtitle1">Currency</Typography>
                  <Select
                    value={currency}
                    fullWidth
                    onChange={(event) => setCurrency(event?.target?.value)}
                  >
                    {currencies.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        {c.title}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
