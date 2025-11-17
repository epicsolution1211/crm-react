import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { format } from "date-fns";
import { v4 as uuid4 } from "uuid";

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { usePageView } from "src/hooks/use-page-view";
import { transactionMockedList } from "src/utils/constant/mock-data";

const statuses = {
  1: "Approved",
  2: "Pending",
  3: "Rejected",
  4: "Canceled",
};

export const statusList = [
  { label: "Approved", value: "1" },
  { label: "Pending", value: "2" },
  { label: "Rejected", value: "3" },
  { label: "Canceled", value: "4" },
];

const currencyInfo = {
  1: "USD",
  2: "EUR",
  3: "GBP",
};

export const currencyList = [
  { label: "USD", value: "1" },
  { label: "EUR", value: "2" },
  { label: "GBP", value: "3" },
];

const LandingCustomerTransactionTable = () => {
  usePageView();

  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const DefaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">{row?.id}</Typography>
        </Stack>
      ),
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      render: (row) => (
        <SeverityPill
          color={
            row?.status === 1
              ? "success"
              : row?.status === 2
                ? "warning"
                : row?.status === 3
                  ? "error"
                  : "info"
          }
        >
          {statuses[row?.status]}
        </SeverityPill>
      ),
    },
    {
      id: "transaction_type",
      label: "Transaction Method",
      enabled: true,
    },
    {
      id: "transaction_owners",
      label: "Owners",
      enabled: true,
    },
    {
      id: "currency",
      label: "Currency",
      enabled: true,
      render: (row) => (row?.currency ? currencyInfo[row?.currency] : "USD"),
    },
    {
      id: "provider",
      label: "Provider",
      enabled: true,
    },
    {
      id: "payment_url",
      label: "Payment Url",
      enabled: true,
      render: () => (uuid4()),
    },
    {
      id: "amount",
      label: "Amount",
      enabled: true,
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      render: (row) => {
        return (
          <Stack direction="row">
            {row?.labels?.map((item) => (
              <Chip
                key={item.name}
                label={item.name}
                size="small"
                color="primary"
                sx={{ backgroundColor: item?.color ?? "", mr: 1 }}
              />
            ))}
          </Stack>
        );
      },
    },
    {
      id: "acton_type",
      label: "Action Type",
      enabled: true,
      render: (row) =>
        row?.acton_type == 1 ? "Bonus" : row?.acton_type == 2 ? "Deposit" : "Withdraw",
    },
    {
      id: "credit",
      label: "Credit",
      enabled: true,
      render: (row) =>
        row?.credit ? (
          <SeverityPill color="success">Credit</SeverityPill>
        ) : (
          <SeverityPill color="error">Credit</SeverityPill>
        ),
    },
    {
      id: "approved_at",
      label: "Approved At",
      enabled: true,
      render: (row) => {
        if (row?.approved_at) {
          return format(new Date(row?.approved_at), "yyyy-MM-dd HH:mm");
        }
      },
    },
    {
      id: "created_at",
      label: "Created Date",
      enabled: true,
      render: (row) => format(new Date(row?.created_at), "yyyy-MM-dd"),
    },
    {
      id: "edit",
      label: "Edit",
      enabled: true,
      render: () =>
        <Stack direction='row' gap={2}>
          <IconButton
            size="small"
          >
            <Iconify icon="mage:edit" />
          </IconButton>
          <IconButton
            size="small"
          >
            <Iconify icon="heroicons:trash" />
          </IconButton>
        </Stack>
    },
  ];

  return (
    <Card>
      <CardHeader
        sx={{ py: 3 }}
        title="Transaction"
        action={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              sx={{ width: 170 }}
              startIcon={
                <Iconify
                  className="icon"
                  icon="ion:reload-sharp"
                  width={18}
                />
              }
              type="submit"
              variant="contained"
            >
              <Typography variant="subtitle2" py={"1px"}>
                Refresh wallets
              </Typography>
            </Button>
            <Button
              startIcon={<Iconify icon="lucide:plus" width={24} />}
              variant="contained"
            >
              Add
            </Button>
          </Stack>
        }
      />
      <Box sx={{ position: "relative" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ whiteSpace: "nowrap" }}>
                {DefaultColumn?.map(
                  (item) => (
                    <TableCell key={item.key}>
                      {item.headerRender ? (
                        item.headerRender()
                      ) : (
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.label}
                        </Typography>
                      )}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(
                transactionMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((transaction) => {
                  return (
                    <TableRow key={transaction?.id} hover>
                      {DefaultColumn?.map((column, index) => (
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          key={transaction.id + index}
                        >
                          {column?.render
                            ? column?.render(transaction)
                            : transaction[column?.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>
      <TablePagination
        component="div"
        labelRowsPerPage="Per page"
        count={transactionMockedList?.length ?? 0}
        page={currentPage ?? 0}
        rowsPerPage={perPage ?? 10}
        onPageChange={(event, index) => setCurrentPage(index)}
        onRowsPerPageChange={(event) =>
          setPerPage(event?.target?.value)
        }
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default LandingCustomerTransactionTable;
