import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { Fragment, useEffect, useState } from "react";
import { CreateSavingAccount } from "./create-saving-account";
import { Scrollbar } from "src/components/scrollbar";
import { SavingAccountsList } from "./saving-accounts-list";
import { clientDashboardApi } from "src/api/client-dashboard";

export const SavingAccounts = ({ brandId }) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const getAccounts = async () => {
    try {
      setIsLoading(true);
      const res = await clientDashboardApi.getSavingAccounts();
      setAccounts(res?.saving_accounts);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <Fragment>
      <Scrollbar sx={{ height: 1, pb: 3 }}>
        <Stack sx={{ width: 1, mt: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="contained" onClick={() => setCreateOpen(true)} sx={{ mr: 3 }}>
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
          <SavingAccountsList accounts={accounts} onGetAccounts={getAccounts} />
        )}

        <CreateSavingAccount
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          brandId={brandId}
          onGetAccounts={getAccounts}
        />
      </Scrollbar>
    </Fragment>
  );
};
