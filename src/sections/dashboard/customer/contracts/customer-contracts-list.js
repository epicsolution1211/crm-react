import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Fragment, useState } from "react";
import { ContractShowModal } from "./contract-show-modal";
import { EditContractModal } from "./edit-contract-moda";
import { getAPIUrl } from "src/config";
import { SeverityPill } from "src/components/severity-pill";
import { getAssetPath } from "src/utils/asset-path";

const ContractItem = ({ contract, onContractOpen, onSetContract }) => {
  return (
    <Grid
      item
      xs={3}
      sx={{
        cursor: "pointer",
      }}
      onClick={() => {
        onSetContract(contract);
        onContractOpen();
      }}
    >
      <Card
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{ p: 4, background: "#ebebeb" }}
          spacing={4}
        >
          <Avatar src={contract?.ico_offer?.file ? contract?.ico_offer?.file?.includes('http') ? contract?.ico_offer?.file : `${getAPIUrl()}/${contract?.ico_offer?.file}` : ""} sx={{ width: 100, height: 100 }} />

          <Stack spacing={1}>
            <Typography variant="h5" color="primary">
              {contract?.contract_type}
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
              <Typography variant="h6">Contract price:</Typography>
              <Typography variant="h7">{contract?.contract_price}</Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Contract status:</Typography>
              <SeverityPill>
                {contract?.contract_status}
              </SeverityPill>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export const CustomerContractsList = ({
  contracts,
  onGetContracts,
  offers = [],
}) => {
  const [contractOpen, setContractOpen] = useState(false);
  const [editContractOpen, setEditContractOpen] = useState(false);
  const [contractToShow, setContractToShow] = useState(null);
  const [contractToEdit, setContractToEdit] = useState(null);

  if (!contracts?.length) {
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
          {contracts?.map((contract) => (
            <ContractItem
              contract={contract}
              key={contract?.id}
              onContractOpen={() => setContractOpen(true)}
              onSetContract={setContractToShow}
            />
          ))}
        </Grid>
      </Stack>

      {contractToShow ? (
        <ContractShowModal
          open={contractOpen}
          onClose={() => setContractOpen(false)}
          contract={contractToShow}
          onGetContracts={onGetContracts}
          onContractEdit={(contract) => {
            setContractToEdit(contract);
            setEditContractOpen(true);
          }}
        />
      ) : null}

      {contractToEdit ? (
        <EditContractModal
          open={editContractOpen}
          onClose={() => setEditContractOpen(false)}
          contract={contractToEdit}
          onGetContracts={onGetContracts}
          offers={offers}
        />
      ) : null}
    </Fragment>
  );
};
