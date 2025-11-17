import { useEffect, useMemo, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { TableSkeleton } from "src/components/table-skeleton";
import { customersApi } from "src/api/customers";
import { useParams } from "react-router-dom";
import { useTraderAccounts } from "./customer-trader-accounts";

const currencies = {
  1: "$",
  2: "€",
  3: "£",
  4: "CA$",
  5: "A$",
  6: "د.إ",
  7: "₹",
};

// eslint-disable-next-line no-unused-vars
export const useBalance = (accountId) => {
  const [balance, setBalance] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const { customerId } = useParams();

  const getBalance = async () => {
    try {
      setIsLoading(true);
      const params = { client_id: customerId };
      const res = await customersApi.getBalance(params);
      setBalance(res?.balance);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  const getBalanceInfo = async () => {
    setInitialLoading(true);
    try {
      await getBalance();
    } catch (error) {
      console.error("error: ", error);
    }
    setInitialLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      const intervalId = setInterval(() => {
        getBalance();
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  useEffect(() => {
    getBalanceInfo();
  }, []);

  return { balance, initialLoading };
};

const CustomerBalance = (props) => {
  const { customerId } = props;

  // eslint-disable-next-line no-unused-vars
  const { accounts, getAccounts } = useTraderAccounts(customerId);
  const { initialLoading, balance } = useBalance();

  // eslint-disable-next-line no-unused-vars
  const currency = useMemo(() => {
    if (customerId && accounts?.length > 0) {
      return accounts?.find(a => a?.id == customerId)?.currency ?? 1;
    }
  }, [customerId, accounts]);

  return (
    <>
      <Card sx={{ minHeight: 110 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ whiteSpace: "nowrap" }}>
                <TableCell>Account</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Open P/L</TableCell>
                <TableCell>Equity</TableCell>
                <TableCell>Margin Level</TableCell>
                <TableCell>Free Margin</TableCell>
                <TableCell>Used Margin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ border: 0 }}>
              {initialLoading ? (
                <TableSkeleton rowCount={1} isBalance cellCount={7} />
              ) : (
                <>
                  {accounts?.map((account) => (
                    <TableRow key={account?.id}>
                      <TableCell sx={{ border: 0 }}>
                        {account?.name ?? ""}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {`${
                          account?.currency
                            ? currencies[account?.currency]
                            : "$"
                        } ${Number(
                          balance?.[account?.id]?.balance ?? 0
                        ).toFixed(2)}`}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {`${
                          account?.currency
                            ? currencies[account?.currency]
                            : "$"
                        } ${Number(balance?.[account?.id]?.pl ?? 0).toFixed(
                          2
                        )}`}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {`${
                          account?.currency
                            ? currencies[account?.currency]
                            : "$"
                        } ${Number(balance?.[account?.id]?.equity ?? 0).toFixed(
                          2
                        )}`}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {`${Number(
                          balance?.[account?.id]?.margine_level ?? 0
                        ).toFixed(2)}%`}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {`${Number(
                          balance?.[account?.id]?.free_margin ?? 0
                        ).toFixed(2)}`}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {`${Number(
                          balance?.[account?.id]?.used_margin ?? 0
                        ).toFixed(2)}`}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{ border: 0 }}>Total</TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {`${"$"} ${Number(
                        balance?.["total"]?.balance ?? 0
                      ).toFixed(2)}`}
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {`${"$"} ${Number(balance?.["total"]?.pl ?? 0).toFixed(
                        2
                      )}`}
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {`${"$"} ${Number(
                        balance?.["total"]?.equity ?? 0
                      ).toFixed(2)}`}
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {`${Number(
                        balance?.["total"]?.margine_level ?? 0
                      ).toFixed(2)}%`}
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {`${Number(balance?.["total"]?.free_margin ?? 0).toFixed(
                        2
                      )}`}
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {`${Number(balance?.["total"]?.used_margin ?? 0).toFixed(
                        2
                      )}`}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </Stack>
      </Card>
    </>
  );
};

export default CustomerBalance;
