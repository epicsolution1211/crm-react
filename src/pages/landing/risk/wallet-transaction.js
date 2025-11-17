import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Input from "@mui/material/Input";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { format } from "date-fns";

import { Iconify } from 'src/components/iconify';
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Scrollbar } from "src/components/scrollbar";
import { Seo } from "src/components/seo";
import { SeverityPill } from "src/components/severity-pill";
import { usePageView } from "src/hooks/use-page-view";
import { walletTransactionMockedData } from "src/utils/constant/mock-data";

const statuses = {
  1: "Pending",
  2: "Approved",
  3: "Rejected",
  4: "Canceled",
};

export const statusList = [
  { label: "Pending", value: "1" },
  { label: "Approved", value: "2" },
  { label: "Rejected", value: "3" },
  { label: "Canceled", value: "4" },
];

export const chainList = [
  { label: "Tron", value: "Tron" },
  { label: "Ethereum", value: "Ethereum" },
  { label: "Bitcoin", value: "Bitcoin" },
];

export const contractList = [
  { label: "trx", value: "trx" },
  { label: "trc20", value: "trc20" },
  { label: "eth", value: "eth" },
  { label: "erc20", value: "erc20" },
  { label: "btc", value: "btc" },
];


const Page = () => {
  usePageView();

  const [perPage, setPerPage] = useState(10);
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
      id: "client_id",
      label: "Client",
      enabled: true,
    },
    {
      id: "client_name",
      label: "Client Name",
      enabled: true,
    },
    {
      id: "company_id",
      label: "Company Id",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">{row?.company_id}</Typography>
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
              ? "warning"
              : row?.status === 2
                ? "success"
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
      id: "wallet_chain",
      label: "Wallet Chain",
      enabled: true,
    },
    {
      id: "contract",
      label: "Contract",
      enabled: true,
    },
    {
      id: "amount",
      label: "Margin",
      enabled: true,
    },
    {
      id: "source_id",
      label: "Source ID",
      enabled: true,
    },
    {
      id: "source_address",
      label: "Source Address",
      enabled: true,
    },
    {
      id: "destination_id",
      label: "Destination ID",
      enabled: true,
    },
    {
      id: "destination_address",
      label: "Destination Address",
      enabled: true,
    },
    {
      id: "transaction_hash",
      label: "Transaction Hash",
      enabled: true,
    },
    {
      id: "transaction_info",
      label: "Transaction Info",
      enabled: true,
      render: () => (
        <Stack direction="row" alignItems='center' gap={1}>
          <InfoOutlinedIcon fontSize="medium" />
          <Typography
            variant="subtitle2"
            sx={{ cursor: "pointer", ':hover': { textDecoration: 'underline' } }}
          >
            See Detail
          </Typography>
        </Stack>
      ),
    },
    {
      id: "gas_fee",
      label: "Gas fee",
      enabled: true,
      render: (row) => {
        return (
          <Stack direction="row">
            {row?.gas_fee ? (
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            ) : <DoNotDisturbAltOutlinedIcon fontSize="small" color="info" />}
          </Stack>
        );
      },
    },
    {
      id: "t_retry",
      label: "Retry",
      enabled: true,
      render: (row) => {
        return (
          <Stack direction="row">
            {row?.t_retry ? (
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            ) : <DoNotDisturbAltOutlinedIcon fontSize="small" color="info" />}
          </Stack>
        );
      },
    },
    {
      id: "submited",
      label: "Submitted",
      enabled: true,
      render: (row) => {
        return (
          <Stack direction="row">
            {row?.submited ? (
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            ) : <DoNotDisturbAltOutlinedIcon fontSize="small" color="info" />}
          </Stack>
        );
      },
    },
    {
      id: "created_at",
      label: "Created Date",
      enabled: true,
      render: (row) => format(new Date(row?.created_at), "yyyy-MM-dd"),
    },
  ];

  return (
    <>
      <Seo title="Wallet Transactions" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Wallet Transactions</Typography>
              </Stack>
            </Stack>
            <PayWallLayout>
              <Card>
                <Stack alignItems="center" direction="row" sx={{ p: 2 }} spacing={2}>
                  <Iconify icon="lucide:search" color="text.secondary" width={24} />
                  <Box sx={{ flexGrow: 1, pl: 2 }}>
                    <Input
                      disableUnderline
                      fullWidth
                      placeholder="Enter a keyword"
                    />
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title="Reload Table">
                      <IconButton>
                        <Iconify icon="ion:reload-sharp" width={24}/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Search Setting">
                      <IconButton>
                        <Iconify icon="tabler:filter-cog" width={24}/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Table Setting">
                      <IconButton>
                        <Iconify icon="ion:settings-outline" width={24}/>
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
                <Box sx={{ position: "relative" }}>
                  <Scrollbar>
                    <Table sx={{ minWidth: 700 }}>
                      <TableHead>
                        <TableRow sx={{ whiteSpace: "nowrap" }}>
                          {DefaultColumn?.map(
                            (item, index) => (
                              <TableCell key={index}>
                                {item?.headerRender ? (
                                  item?.headerRender()
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
                        {walletTransactionMockedData?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((transaction) => {
                          return (
                            <TableRow key={transaction?.id}>
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
                        })}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </Box>
                <TablePagination
                  component="div"
                  labelRowsPerPage="Per page"
                  count={walletTransactionMockedData?.length ?? 0}
                  page={currentPage ?? 0}
                  rowsPerPage={perPage ?? 10}
                  onPageChange={(event, index) => setCurrentPage(index)}
                  onRowsPerPageChange={(event) =>
                    setPerPage(event?.target?.value)
                  }
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </Card>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
