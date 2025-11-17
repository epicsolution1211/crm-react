import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Fragment } from "react";
import { Scrollbar } from "src/components/scrollbar";
import { CustomerAccountsList } from "./customer-accounts-list";

export const LandingCustomerSavingAccounts = ({ customerId }) => {

  return (
    <Fragment>
      <Scrollbar sx={{ height: 1 }}>
        <Stack sx={{ width: 1, mt: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="contained">
              + Add
            </Button>
          </Stack>
        </Stack>
        <CustomerAccountsList customerId={customerId} />
      </Scrollbar>
    </Fragment>
  );
};
