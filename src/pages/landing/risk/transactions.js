import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { format } from "date-fns";

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "src/components/scrollbar";
import { Seo } from "src/components/seo";
import { SeverityPill } from "src/components/severity-pill";
import { usePageView } from "src/hooks/use-page-view";
import { useSelection } from "src/hooks/use-selection";
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

const Page = () => {
  usePageView();

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const tableIds = useMemo(
    () => transactionMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((position) => position?.id),
    [transactionMockedList, currentPage, perPage]
  );
  const transactionSelection = useSelection(transactionMockedList?.map((item) => item?.id) ?? [], (message) => {
    toast.error(message);
  });
  const enableBulkActions = transactionSelection.selected?.length > 0;

  const selectedPage = useMemo(
    () =>
      tableIds?.every((item) => transactionSelection.selected?.includes(item)),
    [tableIds, transactionSelection.selected]
  );
  const selectedSome = useMemo(
    () =>
      tableIds?.some((item) => transactionSelection.selected?.includes(item)) &&
      !tableIds?.every((item) => transactionSelection.selected?.includes(item)),
    [tableIds, tableIds, transactionSelection.selected]
  );

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
      id: "client",
      label: "Client",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify icon={`circle-flags:${row?.client_country?.toLowerCase()}`} width={24} />
          <Typography>{row?.full_name}</Typography>
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
      id: "amount",
      label: "Margin",
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
        <Tooltip title='Edit'>
          <IconButton sx={{ p: 0 }}>
            <Iconify icon="mage:edit" width={24}/>
          </IconButton>
        </Tooltip>
    },
  ];

  return (
    <>
      <Seo title="Risk Management : Transactions" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Transactions</Typography>
              </Stack>
            </Stack>
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
                  {enableBulkActions &&
                    <Tooltip title="Export selected">
                      <IconButton>
                        <Iconify icon="line-md:downloading-loop" width={24}/>
                      </IconButton>
                    </Tooltip>}
                </Stack>
              </Stack>
              <Box sx={{ position: "relative" }}>
                {enableBulkActions ? (
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: "center",
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "neutral.800"
                          : "neutral.50",
                      display: enableBulkActions ? "flex" : "none",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      px: 2,
                      py: 0.5,
                      zIndex: 50,
                    }}
                  >
                    <Checkbox
                      sx={{ p: 0 }}
                      checked={selectedPage}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          if (selectedSome) {
                            transactionSelection.handleDeSelectPage(tableIds);
                          } else {
                            transactionSelection.handleSelectPage(tableIds);
                          }
                        } else {
                          transactionSelection.handleDeSelectPage(tableIds);
                        }
                      }}
                    />
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      pl={2}
                    >
                      {transactionSelection.selectAll ? (
                        <Typography sx={{ whiteSpace: "nowrap" }}>
                          Selected all <strong>{transactionMockedList?.length}</strong> items
                        </Typography>
                      ) : (
                        <Typography sx={{ whiteSpace: "nowrap" }}>
                          Selected{" "}
                          <strong>
                            {transactionSelection.selected?.length}
                          </strong>{" "}
                          of <strong>{transactionMockedList?.length}</strong>
                        </Typography>
                      )}
                    </Stack>
                    {!transactionSelection.selectAll && (
                      <Button onClick={() => transactionSelection.handleSelectAll()}>
                        <Typography sx={{ whiteSpace: "nowrap" }}>Selected All</Typography>
                      </Button>
                    )}
                    <Button onClick={() => transactionSelection.handleDeselectAll()}>
                      <Typography sx={{ whiteSpace: "nowrap" }}>Clear Selection</Typography>
                    </Button>
                  </Stack>
                ) : null}
                <Scrollbar>
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                      <TableRow sx={{ whiteSpace: "nowrap" }}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            sx={{ p: 0 }}
                            checked={false}
                            indeterminate={selectedSome}
                            onChange={(event) => {
                              if (event.target.checked) {
                                transactionSelection.handleSelectPage(
                                  tableIds
                                );
                              } else {
                                transactionSelection.handleSelectPage(
                                  tableIds
                                );
                              }
                            }}
                          />
                        </TableCell>
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
                          const isSelected =
                            transactionSelection.selected.includes(
                              transaction?.id
                            );
                          return (
                            <TableRow key={transaction?.id} hover selected={isSelected}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  sx={{ p: 0 }}
                                  checked={isSelected}
                                  onChange={(event) => {
                                    if (event.target.checked) {
                                      transactionSelection.handleSelectOne?.(
                                        transaction?.id
                                      );
                                    } else {
                                      transactionSelection.handleDeselectOne?.(
                                        transaction?.id
                                      );
                                    }
                                  }}
                                  value={isSelected}
                                />
                              </TableCell>
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
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
