import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { Fragment } from "react";

const ContractItem = ({ contract }) => {
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
          sx={{ p: 4, background: "background.paper" }}
          spacing={4}
        >
          <Avatar src={contract?.file} sx={{ width: 100, height: 100 }} />
          <Stack spacing={1}>
            <Typography variant="h5" color="primary">
              {contract?.contract_type}
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
              <Typography variant="h6">Contract price:</Typography>
              <Typography variant="h7">{contract?.contract_price}</Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Contract status:</Typography>
              <Typography variant="h7">{contract?.contract_status}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export const CustomerContractsList = () => {
  const contractMockedList = [
    {
      id: 1,
      contract_type: "Software Maintenance",
      contract_price: 1000,
      contract_status: "Active",
    },
    {
      id: 2,
      contract_type: "Consulting Services",
      contract_price: 1500,
      contract_status: "Pending",
    },
    {
      id: 3,
      contract_type: "Hardware Supply",
      contract_price: 1200,
      contract_status: "Closed",
    },
    {
      id: 4,
      contract_type: "Marketing Campaign",
      contract_price: 1800,
      contract_status: "Expired",
    }
  ];

  return (
    <Fragment>
      <Stack sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {contractMockedList?.map((contract) => (
            <ContractItem
              contract={contract}
              key={contract?.id}
            />
          ))}
        </Grid>
      </Stack>
    </Fragment>
  );
};
