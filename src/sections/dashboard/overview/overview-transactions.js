import { useEffect, useState } from "react";
import { TransactionSkeleton } from "src/components/transaction-skeleton";
import { format } from "date-fns";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { customersApi } from "src/api/customers";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { currencyOption } from "src/utils/constant";

const statuses = {
  1: "Approved",
  2: "Pending",
  3: "Rejected",
  4: "Canceled",
};

export const OverviewTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getTransactions = async () => {
    setIsLoading(true);
    try {
      const params = {
        per_page: 5,
      };
      const res = await customersApi.getTransaction(params);
      setTransactions(res?.transactions ?? []);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const hanldeClick = (id) => {
    router.push(`${paths.dashboard.customers.index}/${id}`)
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <Card>
      <CardHeader title="Latest Transactions" />
      {/* <Tabs value="all" sx={{ px: 3 }}>
        <Tab label="All" value="all" />
        <Tab label="Confirmed" value="confirmed" />
        <Tab label="Pending" value="pending" />
      </Tabs> */}
      <Divider />
      <Scrollbar>
        <Table sx={{ minWidth: 600 }}>
          <TableBody>
            {isLoading ? (
              <TransactionSkeleton
                rowCount={4}
                cellCount={4}
                padding={2}
              />)
              :
              transactions?.map((transaction) => {
                const createdAtMonth = format(
                  new Date(transaction?.created_at),
                  "LLL"
                ).toUpperCase();
                const createdAtDay = format(
                  new Date(transaction?.created_at),
                  "d"
                );
                const type = statuses[transaction?.status];
                const amountColor = transaction?.amount > 0 ? 'success.main' : 'error.main';

                return (
                  <TableRow
                    key={transaction.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      "&:last-child td, &:last-child th": { border: 0 }
                    }}
                    onClick={() => {
                      if (transaction?.client_id) {
                        hanldeClick(transaction.client_id)
                      }
                    }}
                  >
                    <TableCell width={100}>
                      <Box
                        sx={{
                          p: 1,
                          backgroundColor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "neutral.800"
                              : "neutral.100",
                          borderRadius: 2,
                          maxWidth: "fit-content",
                        }}
                      >
                        <Typography
                          align="center"
                          color="text.primary"
                          variant="caption"
                        >
                          {createdAtMonth}
                        </Typography>
                        <Typography
                          align="center"
                          color="text.primary"
                          variant="h6"
                        >
                          {createdAtDay}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Typography variant="subtitle2">
                          {transaction?.full_name ?? "n/a"}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {type}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <SeverityPill
                        color={
                          transaction?.status === 1
                            ? "success"
                            : transaction?.status === 2
                              ? "warning"
                              : transaction?.status === 3
                                ? "error"
                                : "info"
                        }
                      >
                        {type}
                      </SeverityPill>
                    </TableCell>
                    <TableCell width={180}>
                      <Typography
                        variant="subtitle2"
                        color={amountColor}
                      >
                        {currencyOption?.find(item => item?.value === transaction?.currency)?.symbol ?? '$'}{transaction?.amount}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};

OverviewTransactions.propTypes = {
  transactions: PropTypes.array.isRequired,
};
