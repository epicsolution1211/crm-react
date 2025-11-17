import { useState, useMemo } from "react";
import { format } from "date-fns";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { recordMockedList } from "src/utils/constant/mock-data";
import { useSelection } from "src/hooks/use-selection";
import toast from "react-hot-toast";

export const LandingRecordTable = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const recordSelection = useSelection(recordMockedList?.map((item) => item.id) ?? [], (message) => {
    toast.error(message);
  });

  const tableIds = useMemo(
    () => recordMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((lead) => lead?.id),
    [recordMockedList, currentPage, perPage]
  );

  const enableBulkActions = recordSelection.selected?.length > 0;
  const selectedPage = useMemo(
    () => tableIds?.every((item) => recordSelection.selected?.includes(item)),
    [tableIds, recordSelection.selected]
  );
  const selectedSome = useMemo(
    () =>
      tableIds?.some((item) => recordSelection.selected?.includes(item)) &&
      !tableIds?.every((item) => recordSelection.selected?.includes(item)),
    [tableIds, tableIds, recordSelection.selected]
  );

  const defaultColumn = [
    {
      id: "id",
      label: "Id",
      enabled: true,
    },
    {
      id: "source",
      label: "Source",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          {row?.source?.ai && <SeverityPill color="success">ai</SeverityPill>}
          {row?.source?.code && (
            <SeverityPill color="success">code</SeverityPill>
          )}
        </Stack>
      ),
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      render: (row) => (
        <SeverityPill color={row?.status === true ? "success" : "error"}>
          {row?.status === true ? "Valid" : "Invalid"}
        </SeverityPill>
      ),
    },
    {
      id: "d_id",
      label: "Internal Id",
      enabled: true,
    },
    {
      id: "d_reference_id",
      label: "Reference Id",
      enabled: true,
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      render: (row) =>
        row?.labels?.map((item, index) => (
          <Chip
            key={index}
            label={item.name}
            size="small"
            color="primary"
            sx={{
              backgroundColor:
                item?.color,
              mr: 1,
            }}
          />
        )),
    },
    {
      id: "d_account",
      label: "Agents",
      enabled: true,
    },
    {
      id: "d_client_name",
      label: "Client Name",
      enabled: true,
    },
    {
      id: "d_client_type",
      label: "Client Type",
      enabled: true,
    },
    {
      id: "d_account_provider_number",
      label: "Account Provider Number",
      enabled: true,
    },
    {
      id: "d_type",
      label: "Type",
      enabled: true,
    },
    {
      id: "d_amount",
      label: "Amount",
      enabled: true,
      render: (row) => (
        <Typography color={row?.d_amount < 0 ? "error" : ""}>
          {row?.d_amount}
        </Typography>
      ),
    },
    {
      id: "d_currency",
      label: "Currency",
      enabled: true,
    },
    {
      id: "d_remitter_name",
      label: "Remitter Name",
      enabled: true,
    },
    {
      id: "d_remitter_account",
      label: "Remitter Account",
      enabled: true,
    },
    {
      id: "d_beneficiary_name",
      label: "Beneficiary Name",
      enabled: true,
    },
    {
      id: "d_beneficiary_type",
      label: "Beneficiary Type",
      enabled: true,
    },
    {
      id: "d_bic",
      label: "Bic",
      enabled: true,
    },
    {
      id: "d_description",
      label: "Description",
      enabled: true,
    },

    {
      id: "d_charge_type",
      label: "Charge Type",
      enabled: true,
    },
    {
      id: "d_provider",
      label: "provider",
      enabled: true,
    },
    {
      id: "d_provider_id",
      label: "Provider Id",
      enabled: true,
    },
    {
      id: "d_partner_id",
      label: "Partner Id",
      enabled: true,
    },
    {
      id: "payment_type",
      label: "Payment Type",
      enabled: true,
    },
    {
      id: "fee_actual",
      label: "Fees (actual)",
      enabled: true,
      render: (row) => (
        <Typography
          variant="h7"
          sx={{
            color: row?.fee_actual !== row?.fee_expected ? "red" : "",
          }}
        >
          {row?.fee_actual}
        </Typography>
      ),
    },
    {
      id: "fee_expected",
      label: "Fees (expected)",
      enabled: true,
      render: (row) => (
        <Typography
          variant="h7"
          sx={{
            color: row?.fee_actual !== row?.fee_expected ? "red" : "",
          }}
        >
          {row?.fee_expected}
        </Typography>
      ),
    },
    {
      id: "cost_actual",
      label: "Cost (actual)",
      enabled: true,
      render: (row) => (
        <Typography
          variant="h7"
          sx={{
            color: row?.cost_actual !== row?.cost_expected ? "red" : "",
          }}
        >
          {row?.cost_actual}
        </Typography>
      ),
    },
    {
      id: "cost_expected",
      label: "Cost (expected)",
      enabled: true,
      render: (row) => (
        <Typography
          variant="h7"
          sx={{
            color: row?.cost_actual !== row?.cost_expected ? "red" : "",
          }}
        >
          {row?.cost_expected}
        </Typography>
      ),
    },
    {
      id: "upload_time",
      label: "Upload Time",
      enabled: true,
      render: (row) => (
        <Typography variant="h7">
          {format(new Date(row?.upload_time), "dd.mm.yyyy hh:mm:ss")}
        </Typography>
      ),
    },
    {
      id: "d_created",
      label: "Created At",
      enabled: true,
      render: (row) => (
        <Typography variant="h7">
          {format(new Date(row?.d_created), "dd.mm.yyyy hh:mm:ss")}
        </Typography>
      ),
    },
    {
      id: "d_updated",
      label: "Updated At",
      enabled: true,
      render: (row) => (
        <Typography variant="h7">
          {format(new Date(row?.d_updated), "dd.mm.yyyy hh:mm:ss")}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
          <Iconify icon="lucide:search" color="text.secondary" width={24} />
          <Box sx={{ flexGrow: 1 }}>
            <Input
              disableUnderline
              fullWidth
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
                      recordSelection.handleDeSelectPage(tableIds);
                    } else {
                      recordSelection.handleSelectPage(tableIds);
                    }
                  } else {
                    recordSelection.handleDeSelectPage(tableIds);
                  }
                }}
              />
              <Stack direction="row" alignItems="center" spacing={1}>
                <Tooltip title="Assign label">
                  <Iconify icon="mynaui:label" width={24} height={24} />
                </Tooltip>
                {recordSelection.selectAll ? (
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    Selected all <strong>{recordMockedList.length}</strong> items
                  </Typography>
                ) : (
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    Selected <strong>{recordSelection.selected?.length}</strong>{" "}
                    of <strong>{recordMockedList.length}</strong>
                  </Typography>
                )}
              </Stack>
              {!recordSelection.selectAll && (
                <Button onClick={() => recordSelection.handleSelectAll()}>
                  <Typography sx={{ whiteSpace: "nowrap" }}>Selected All</Typography>
                </Button>
              )}
              <Button onClick={() => recordSelection.handleDeselectAll()}>
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
                          recordSelection.handleSelectPage(tableIds);
                        } else {
                          recordSelection.handleSelectPage(tableIds);
                        }
                      }}
                    />
                  </TableCell>
                  {defaultColumn
                    ?.map((item) => (
                      <TableCell key={item.id} sx={{ width: item.width }}>
                        {item.headerRender ? (
                          item.headerRender()
                        ) : (
                          <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                            {item.label}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(recordMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((record) => {
                  const isSelected = recordSelection.selected.includes(record?.id);
                  return (
                    <TableRow key={record?.id} sx={{ whiteSpace: "nowrap" }} hover selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ p: 0 }}
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              recordSelection.handleSelectOne?.(record?.id);
                            } else {
                              recordSelection.handleDeselectOne?.(record?.id);
                            }
                          }}
                          value={isSelected}
                        />
                      </TableCell>
                      {defaultColumn
                        ?.map((column, index) => (
                          <TableCell key={record.id + index}>
                            {column?.render
                              ? column?.render(record)
                              : record[column?.id] ?? ""}
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
          count={recordMockedList?.length ?? 0}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
          page={currentPage}
          rowsPerPage={perPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
        />
      </Card>
    </>
  );
};
