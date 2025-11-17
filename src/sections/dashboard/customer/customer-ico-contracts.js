import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { Fragment, useEffect, useState } from "react";
import { clientDashboardApi } from "src/api/client-dashboard";
import { Scrollbar } from "src/components/scrollbar";
import { CustomerContractsList } from "./contracts/customer-contracts-list";
import { CreateIcoContract } from "./contracts/create-contract";

export const CustomerIcoContracts = ({ customerId }) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getContracts = async () => {
    try {
      setIsLoading(true);
      const res = await clientDashboardApi.getClientContracts({
        client_id: customerId,
      });
      setContracts(res?.ico_contracts);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  const getOffers = async () => {
    try {
      setIsLoading(true);
      const res = await clientDashboardApi.getIcoOffers();
      setOffers(res?.ico_offers?.map(o => ({
        label: o?.token_name,
        value: o?.id,
      })));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  }

  useEffect(() => {
    getOffers();
  }, []);

  useEffect(() => {
    if (customerId) getContracts();
  }, [customerId]);

  return (
    <Fragment>
      <Scrollbar sx={{ height: 1 }}>
        <Stack sx={{ width: 1, mt: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="contained" onClick={() => setCreateOpen(true)}>
              + Add
            </Button>
          </Stack>
        </Stack>

        {isLoading ? (
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
        ) : (
          <CustomerContractsList contracts={contracts} onGetContracts={getContracts} offers={offers} />
        )}

        <CreateIcoContract
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          customerId={customerId}
          onGetContracts={getContracts}
          offers={offers}
        />
      </Scrollbar>
    </Fragment>
  );
};
