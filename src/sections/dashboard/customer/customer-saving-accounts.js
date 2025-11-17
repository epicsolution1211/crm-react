import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { Fragment, useEffect, useState } from "react";
import { Scrollbar } from "src/components/scrollbar";
import { clientDashboardApi } from "src/api/client-dashboard";
import { CustomerAccountsList } from "./contracts/customer-accounts-list";
import { CustomerCreateSavingAccount } from "./contracts/customer-create-saving-account";

export const CustomerSavingAccounts = ({ customerId }) => {
  const [createOpen, setCreateOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [clientAccounts, setClientAccounts] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const getClientAccounts = async () => {
    try {
      setIsLoading(true);
      const res = await clientDashboardApi.getClientSavingAccounts({
        client_id: customerId,
      });
      setClientAccounts(res?.client_saving_accounts);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  const getAccounts = async () => {
    try {
      setIsLoading(true);
      const res = await clientDashboardApi.getSavingAccounts();
      setAccounts(res?.saving_accounts?.filter(acc => acc?.active)?.map(sa => ({
        label: sa?.name,
        value: sa?.id,
        options: sa?.settings,
      })));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    getClientAccounts();
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
        <CustomerAccountsList accounts={clientAccounts} onGetAccounts={getClientAccounts} customerId={customerId} />

        <CustomerCreateSavingAccount
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          customerId={customerId}
          onGetAccounts={getClientAccounts}
          accounts={accounts}
        />
      </Scrollbar>
    </Fragment>
  );
};
