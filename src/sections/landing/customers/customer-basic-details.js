import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { useParams } from "react-router";

import { Iconify } from 'src/components/iconify';
import { PropertyList } from "src/components/property-list";
import { customerMockedList } from "src/utils/constant/mock-data";

export const LandingCustomerBasicDetails = () => {
  const { customerId } = useParams();

  const currentCustomer = useMemo(() => {
    if (customerId) {
      const result = customerMockedList.find((item) => item.id == customerId);
      return result;
    }
  }, [customerId]);

  const [emailHidden, setEmailHidden] = useState(false);
  const [phoneHidden, setPhoneHidden] = useState(false);

  return (
    <Card>
      <CardHeader title="Basic Details" />
      <PropertyList sx={{ pt: 2.3 }}>
        <Typography variant="h7" sx={{ p: 2 }}>
          Full Name
        </Typography>
        <Stack
          spacing={2}
          direction="row"
          sx={{ p: 2 }}
          alignItems="center"
        >
          <TextField
            label="Full Name"
            fullWidth
            value={currentCustomer?.full_name ?? ""}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>
      </PropertyList>
      <PropertyList>
        <Stack direction="row" alignItems="center">
          <Typography variant="h7" sx={{ p: 2 }}>
            Emails
          </Typography>
          <IconButton onClick={() => setEmailHidden(!emailHidden)}>
            <Iconify icon={!emailHidden ? 'fluent:eye-32-filled' : 'fluent:eye-off-16-filled'}/>
          </IconButton>
        </Stack>
        <Stack spacing={2} direction="column" sx={{ p: 2 }}>
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            value={currentCustomer?.emails[0] ?? ""}
            fullWidth
            label="Email"
            type={emailHidden ? "password" : "text"}
          />
          <Button variant="outlined">
            + Add new
          </Button>
        </Stack>
      </PropertyList>
      <PropertyList>
        <Stack direction="row" alignItems="center">
          <Typography variant="h7" sx={{ p: 2 }}>
            Phone numbers
          </Typography>
          <IconButton onClick={() => setPhoneHidden(!phoneHidden)}>
            <Iconify icon={!phoneHidden ? 'fluent:eye-32-filled' : 'fluent:eye-off-16-filled'}/>
          </IconButton>
        </Stack>
        <Stack spacing={2} direction="column" sx={{ p: 2 }}>
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            value={currentCustomer?.phone_numbers[0] ?? ""}
            fullWidth
            label="Phone"
            type={phoneHidden ? "password" : "text"}
          />
          <Button variant="outlined">
            + Add new
          </Button>
        </Stack>
      </PropertyList>
      <CardActions sx={{ display: "flex", justifyContent: "end", pb: 3, px: 2 }}>
        <Button type="submit" variant="contained">
          Update
        </Button>
      </CardActions>
    </Card>
  );
};
