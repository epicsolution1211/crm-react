import numeral from "numeral";
import { format } from "date-fns";

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

const statuses = {
  1: "Approved",
  2: "Pending",
  3: "Rejected",
  4: "Canceled",
};

const mockedOverviewTransaction = [
  {
    id: '',
    created_at: "2024-12-19T12:28:54.915Z",
    status: 1,
    amount: 5000,
    full_name: "Robert White",
  },
  {
    id: '',
    created_at: "2024-12-19T12:28:54.915Z",
    status: 1,
    amount: 4500,
    full_name: "David Brown",
  },
];

export const OverviewTransactions = () => (
  <Card>
    <CardHeader title="Latest Transactions" />
    <Divider />
    <Scrollbar>
      <Table sx={{ minWidth: 600 }}>
        <TableBody>
          {mockedOverviewTransaction?.map((transaction) => {
            const createdAtMonth = format(
              new Date(transaction?.created_at),
              "LLL"
            ).toUpperCase();
            const createdAtDay = format(
              new Date(transaction?.created_at),
              "d"
            );
            const type = statuses[transaction?.status];
            const amount = numeral(transaction?.amount).format("$0,0.00");
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
                    hanldeClick(transaction.client_id);
                  }
                } }
              >
                <TableCell width={100}>
                  <Box
                    sx={{
                      p: 1,
                      backgroundColor: (theme) => theme.palette.mode === "dark"
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
                    color={transaction?.status === 1
                      ? "success"
                      : transaction?.status === 2
                        ? "warning"
                        : transaction?.status === 3
                          ? "error"
                          : "info"}
                  >
                    {type}
                  </SeverityPill>
                </TableCell>
                <TableCell width={180}>
                  <Typography
                    variant="subtitle2"
                    color={amountColor}
                  >
                    {amount}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Scrollbar>
  </Card>
);
