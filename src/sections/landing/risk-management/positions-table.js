import { useMemo, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { positionsMockedList } from "src/utils/constant/mock-data";
import { useSelection } from "src/hooks/use-selection";

const directions = {
  0: "OWNED",
  1: "BUY",
  2: "SELL",
};

const statuses = {
  0: "Pending",
  1: "Active",
  2: "Closed",
};

const market = {
  fx: "Forex",
  commodities: "Commodities",
  crypto: "Crypto",
  stocks: "Stocks",
  cfd: "CFD",
};

const currencies = {
  1: "$",
  2: "€",
  3: "£",
  4: "CA$",
  5: "A$",
  6: "د.إ",
  7: "₹",
};

export const LandingPositionsTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const dealingSelection = useSelection(positionsMockedList?.map((item) => item?.id) ?? [], (message) => {
    toast.error(message);
  });

  const defaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true,
    },
    {
      id: "client",
      label: "Client",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify 
            icon={`circle-flags:${row?.client_country?.toLowerCase()}`}
            width={20}
          />
          <Typography>{row?.client_name}</Typography>
        </Stack>
      ),
    },
    {
      id: "alert",
      label: "Alert",
      enabled: true,
      render: (row) => {
        return (
          <SeverityPill color={row?.client_status?.message === 'danger' ? "error" : row?.client_status?.message === 'warning' ? "warning" : "info"}>
            {row?.client_status?.code === 1 ? "Margin Call" : ""}
          </SeverityPill>
        );
      },
    },
    {
      id: "direction",
      label: "Direction",
      enabled: true,
      render: (row) => (
        <Typography
          variant="subtitle2"
          sx={{
            color:
              row?.position_type === 0
                ? "#06AED4"
                : row?.position_type === 1
                  ? "#10B981"
                  : "#F04438",
          }}
        >
          {directions[row?.position_type]}
        </Typography>
      ),
    },
    {
      id: "created_time",
      label: "Created Time",
      enabled: true,
      render: (row) => format(new Date(row?.created_at), "yyyy-MM-dd HH:mm"),
    },
    {
      id: "opened_time",
      label: "Opened Time",
      enabled: true,
      render: (row) => format(new Date(row?.created_at), "yyyy-MM-dd HH:mm"),
    },
    {
      id: "symbol",
      label: "Symbol",
      enabled: true,
      render: (row) =>
        `${row?.ticker?.base_currency_symbol}-${row?.ticker?.currency_symbol}`,
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      render: (row) => (
        <SeverityPill
          color={
            row?.status === 0
              ? "warning"
              : row?.status === 1
                ? "success"
                : "error"
          }
        >
          {statuses[row.status]}
        </SeverityPill>
      ),
    },
    {
      id: "market",
      label: "Market",
      enabled: true,
      render: (row) => market[row?.market],
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      render: (row) => (
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
      ),
    },
    {
      id: "amount",
      label: "Margin",
      enabled: true,
      render: (row) =>
        `${row.currency ? currencies[row.currency] : "$"}${row?.amount ? parseFloat(Number(row?.amount).toFixed(5)) : "0.00"
        }`,
    },
    {
      id: "swap",
      label: "Swap",
      enabled: true,
      render: (row) =>
        row?.swap ? Math.floor(row?.swap * 100000) / 100000 : "0.00",
    },
    {
      id: "unit",
      label: "Unit",
      enabled: true,
      render: (row) =>
        row?.unit ? Math.floor(row?.unit * 100000) / 100000 : "0.00",
    },
    {
      id: "set_rate",
      label: "Set",
      enabled: true,
    },
    {
      id: "entry_price",
      label: "Entry Price",
      enabled: true,
      render: (row) => (row?.opened_amount ? row?.opened_amount : "0.00"),
    },
    {
      id: "market_price",
      label: "Market Price",
      enabled: true,
      render: (row) =>
        parseFloat(Number(row.market_price).toFixed(5))
    },
    {
      id: "volume",
      label: "Volume",
      enabled: true,
      render: (row) =>
        Number(Number(row?.market_price) * Number(row?.unit)).toFixed(5)
    },
    {
      id: "leverage",
      label: "Leverage",
      enabled: true,
      render: (row) => `${row?.leverage ? row?.leverage : "0"}x`,
    },
    {
      id: "t/p",
      label: "T/P",
      enabled: true,
      render: (row) => (row?.tp ? row?.tp : "0.00"),
    },
    {
      id: "s/l",
      label: "S/L",
      enabled: true,
      render: (row) => (row?.sl ? row?.sl : "0.00"),
    },
    {
      id: "profit/loss",
      label: "Profit/loss",
      enabled: true,
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.profit < 0 ? "#F04438" : "#10B981"}
        >
          {row?.profit ? row?.profit.toFixed(5) : "0"}
        </Typography>
      ),
    },
    {
      id: "balance",
      label: "Balance",
      enabled: true,
      render: (row) => (row?.client_balance ? row?.client_balance : "0.00"),
    },
    {
      id: "equity",
      label: "Equity",
      enabled: true,
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_equity < 0 ? "#F04438" : ""}
        >
          {row?.client_equity ? row?.client_equity?.toFixed(5) : "0.00"}
        </Typography>
      ),
    },
    {
      id: "total_p/l",
      label: "Total P/L",
      enabled: true,
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_pl < 0 ? "#F04438" : "#10B981"}
        >
          {row?.client_pl ? row?.client_pl.toFixed(5) : "0"}
        </Typography>
      ),
    },
    {
      id: "margin_level",
      label: "Margin Level",
      enabled: true,
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_margine_level < 0 ? "#F04438" : ""}
        >
          {row?.client_margine_level
            ? `${row?.client_margine_level?.toFixed(2)}%`
            : "0.00%"}
        </Typography>
      ),
    },
    {
      id: "free_margin",
      label: "Free Margin",
      enabled: true,
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_free_margin < 0 ? "#F04438" : ""}
        >
          {row?.client_free_margin
            ? row?.client_free_margin?.toFixed(5)
            : "0.00"}
        </Typography>
      ),
    },
    {
      id: "used_margin",
      label: "Used Margin",
      enabled: true,
      render: (row) => (
        <Typography
          variant="subtitle2"
          color={row?.client_used_margin < 0 ? "#F04438" : ""}
        >
          {row?.client_used_margin ? row?.client_used_margin : "0.00"}
        </Typography>
      ),
    },
    {
      id: "action",
      label: "Actions",
      enabled: true,
      render: () => {
        return (
          <Tooltip title="Edit">
            <IconButton sx={{ p: 0 }}            >
              <Iconify icon="mage:edit" />
            </IconButton>
          </Tooltip>
        );
      }
    },
  ];

  const tableIds = useMemo(
    () => positionsMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((position) => position?.id),
    [positionsMockedList, currentPage, perPage]
  );
  const enableBulkActions = dealingSelection?.selected?.length > 0;
  const selectedPage = tableIds?.every((item) => dealingSelection?.selected?.includes(item));
  const selectedSome =
    tableIds?.some((item) => dealingSelection?.selected?.includes(item)) &&
    !tableIds?.every((item) => dealingSelection?.selected?.includes(item));

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
        <Iconify icon="lucide:search" color="text.secondary" width={24} />
        <Box sx={{ flexGrow: 1 }}>
          <Input
            disableUnderline
            fullWidth
            onChange={() => {
            }}
            placeholder="Enter a keyword"
          />
        </Box>
        <Stack direction='row' gap={0.5}>
          <Tooltip title="Reload Table">
            <IconButton>
              <Iconify icon="ion:reload-sharp" width={24}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Search Setting">
            <IconButton>
              <SvgIcon>
                <FilterIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Table Setting">
            <IconButton>
              <SvgIcon>
                <SettingIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Divider />
      <Box sx={{ position: "relative" }}>
        {enableBulkActions ? (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "neutral.800" : "neutral.50",
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
                    dealingSelection.handleDeSelectPage(tableIds);
                  } else {
                    dealingSelection.handleSelectPage(tableIds);
                  }
                } else {
                  dealingSelection.handleDeSelectPage(tableIds);
                }
              }}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Tooltip title="Assign label">
                <Iconify icon="mynaui:label" width={24} color="text.secondary" />
              </Tooltip>
            </Stack>
            {dealingSelection?.selectAll ? (
              <Typography>
                Selected all <strong>{positionsMockedList.length}</strong> positions
              </Typography>
            ) : (
              <Typography>
                Selected <strong>{dealingSelection?.selected?.length}</strong> of{" "}
                <strong>{positionsMockedList.length}</strong>
              </Typography>
            )}
            {!dealingSelection.selectAll && (
              <Button onClick={() => dealingSelection.handleSelectAll()}>
                <Typography sx={{ whiteSpace: "nowrap" }}>Selected All</Typography>
              </Button>
            )}
            <Button onClick={() => dealingSelection.handleDeselectAll()}>
              <Typography sx={{ whiteSpace: "nowrap" }}>Clear Selection</Typography>
            </Button>
          </Stack>
        ) : null}
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{ p: 0 }}
                    checked={false}
                    onChange={(event) => {
                      if (event.target.checked) {
                        dealingSelection.handleSelectPage(tableIds);
                      } else {
                        dealingSelection.handleDeSelectPage(tableIds);
                      }
                    }}
                  />
                </TableCell>
                {defaultColumn
                  ?.map((item) => (
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
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(
                positionsMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((deal, index) => {
                  const isSelected = dealingSelection?.selected.includes(deal?.id);
                  return (
                    <TableRow hover key={index} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ p: 0 }}
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              dealingSelection.handleSelectOne?.(deal?.id);
                            } else {
                              dealingSelection.handleDeselectOne?.(deal?.id);
                            }
                          }}
                          value={isSelected}
                        />
                      </TableCell>
                      {defaultColumn
                        ?.map((column, index) => (
                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            key={deal.id + index}
                          >
                            {column?.render
                              ? column?.render(deal)
                              : deal[column?.id]}
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={positionsMockedList?.length ?? 0}
          page={currentPage ?? 0}
          rowsPerPage={perPage ?? 10}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) =>
            setPerPage(event?.target?.value)
          }
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </>
  );
};
