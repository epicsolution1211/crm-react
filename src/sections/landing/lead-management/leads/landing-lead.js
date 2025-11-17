import { useState, useMemo } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { countries, languages } from "src/utils/constant";
import { leadMockedList } from "src/utils/constant/mock-data";
import { useSelection } from "src/hooks/use-selection";

export const LandingLead = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const leadSelection = useSelection(leadMockedList?.map((item) => item?.id) ?? [], (message) => {
    toast.error(message);
  });

  const tableIds = useMemo(
    () => leadMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((lead) => lead?.id),
    [leadMockedList, currentPage, perPage]
  );

  const enableBulkActions = leadSelection.selected?.length > 0;

  const selectedPage = useMemo(
    () => tableIds?.every((item) => leadSelection.selected?.includes(item)),
    [tableIds, leadSelection.selected]
  );

  const selectedSome = useMemo(
    () =>
      tableIds?.some((item) => leadSelection.selected?.includes(item)) &&
      !tableIds?.every((item) => leadSelection.selected?.includes(item)),
    [tableIds, tableIds, leadSelection.selected]
  );

  const DEFAULT_COLUMN = [
    {
      id: "id",
      label: "Id",
      enabled: true,
    },
    {
      id: "client_id",
      label: "Client id",
      enabled: true,
      render: (row) => (
        <Typography>{row?.client_id}</Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {row?.status_error && (
            <Tooltip placement="top-start" title={row?.status_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <SeverityPill
            color={
              row?.status === "on hold"
                ? "warning"
                : row?.status === "Sent"
                  ? "success"
                  : row?.status === "Error"
                    ? "error"
                    : "info"
            }
          >
            {row?.status ?? ""}
          </SeverityPill>
        </Stack>
      ),
    },
    {
      id: "duplicate",
      label: "Duplicate",
      enabled: true,
      render: (row) =>
        row?.duplicate ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.warning.main,
                maxWidth: 1,
                height: 1,
                padding: 1,
                borderRadius: 20,
              }}
            ></Box>
            <Typography>Duplicate</Typography>
          </Stack>
        ) : null,
    },
    {
      id: "verified",
      label: "Verified",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.verified || row?.verified === null ? (
            <CheckCircleOutlineIcon fontSize="small" color="success" />
          ) : (
            <Tooltip placement="top-start" title={row?.verified_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          {row?.verified || row?.verified === null
            ? "Verified"
            : "Not Verified"}
        </Stack>
      ),
    },
    {
      id: "first_name",
      label: "First Name",
      enabled: true,
    },
    {
      id: "last_name",
      label: "Last Name",
      enabled: true,
    },
    {
      id: "email",
      label: "Email",
      enabled: true,
      render: (row) => (
        <Typography variant="subtitle2">{row?.email}</Typography>
      ),
    },
    {
      id: "phone",
      label: "Phone",
      enabled: true,
      render: (row) => (
        <Typography>{row?.phone}</Typography>
      ),
    },
    {
      id: "country",
      label: "Country",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify 
            icon={`circle-flags:${row?.country?.toLowerCase()}`}
            width={25}
          />
          <Typography variant="subtitle2">{countries?.find((item) => item.code === row?.country)?.label}</Typography>
        </Stack>
      ),
    },
    {
      id: "language",
      label: "Language",
      enabled: true,
      render: (row) => (
        <Typography>
          {
            languages
              ?.find((lang) => lang?.code === row?.language)
              ?.name?.split(" - ")[0]
          }
        </Typography>
      ),
    },
    {
      id: "campaign",
      label: "Campaign",
      enabled: true,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.campaign}
        </Typography>
      ),
    },
    {
      id: "deposit",
      label: "Deposit",
      enabled: true,
      render: (row) => (
        <Typography>{row?.deposit}</Typography>
      ),
    },
    {
      id: "ftd_amount",
      label: "FTD Amount",
      enabled: true,
      render: (row) => (
        <Typography>{row?.ftd_amount}</Typography>
      ),
    },
    {
      id: "ftd_date",
      label: "FTD Date",
      enabled: true,
      render: (row) => (
        <Typography>
          {format(new Date(row?.ftd_date), "yyyy-MM-dd HH:mm")}
        </Typography>
      ),
    },
    {
      id: "registration_date",
      label: "Registration Date",
      enabled: true,
      render: (row) => (
        <Typography>
          {format(new Date(row.registration_date), "yyyy-MM-dd HH:mm")}
        </Typography>
      ),
    },
    {
      id: "source_brand",
      label: "Source Brand",
      enabled: true,
    },
    {
      id: "note",
      label: "Note",
      enabled: true,
    },
    {
      id: "brand_name",
      label: "Brand",
      enabled: true,
    },
    {
      id: "affiliate_name",
      label: "Affiliate",
      enabled: true,
    },
    {
      id: "team_name",
      label: "Team",
      enabled: true,
    },
    {
      id: "agent_name",
      label: "Agent",
      enabled: true,
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      render: (row) =>
        row?.labels?.map((item) => (
          <Chip
            key={item.name}
            label={item.name}
            size="small"
            color="primary"
            sx={{
              backgroundColor: item.color,
              mr: 1,
            }}
          />
        )),
    },
    {
      id: "source",
      label: "Source",
      enabled: true,
    },
    {
      id: "ip_address",
      label: "IP address",
      enabled: true,
      render: (row) => (
        <Typography>{row?.ip_address}</Typography>
      ),
    },
    {
      id: "created_at",
      label: "Created At",
      enabled: true,
      render: (row) => {
        if (row?.created_at) {
          return format(new Date(row?.created_at), "yyyy-MM-dd HH:mm");
        }
      },
    },
    {
      id: "updated_at",
      label: "Updated At",
      enabled: true,
      render: (row) => {
        if (row?.updated_at) {
          return format(new Date(row?.updated_at), "yyyy-MM-dd HH:mm");
        }
      },
    },
  ];

  return (
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
                    leadSelection.handleDeSelectPage(tableIds);
                  } else {
                    leadSelection.handleSelectPage(tableIds);
                  }
                } else {
                  leadSelection.handleDeSelectPage(tableIds);
                }
              }}
            />
            <Stack direction="row" alignItems="center" spacing={1} pl={2}>
              <Tooltip title="Assign label">
                <Iconify icon="mynaui:label" width={24} height={24} />
              </Tooltip>
            </Stack>
            {leadSelection?.selectAll ? (
              <Typography>
                Selected all <strong>{leadMockedList?.length}</strong> leads
              </Typography>
            ) : (
              <Typography>
                Selected <strong>{leadSelection?.selected?.length}</strong> of{" "}
                <strong>{leadMockedList?.length}</strong> leads
              </Typography>
            )}
            {!leadSelection?.selectAll && (
              <Button onClick={() => leadSelection.handleSelectAll()}>
                <Typography sx={{ whiteSpace: "nowrap" }}>Selected All</Typography>
              </Button>
            )}
            <Button onClick={() => leadSelection.handleDeselectAll()}>
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
                    onChange={(event) => {
                      if (event.target.checked) {
                        leadSelection.handleSelectPage(tableIds);
                      } else {
                        leadSelection.handleDeSelectPage(tableIds);
                      }
                    }}
                  />
                </TableCell>
                {DEFAULT_COLUMN
                  ?.map((item) => (
                    <TableCell key={item.id}>
                      <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                        {item.label}
                      </Typography>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(leadMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((lead) => {
                const isSelected = leadSelection.selected.includes(
                  lead?.id
                );
                return (
                  <TableRow selected={isSelected} hover key={lead?.id} sx={{ whiteSpace: "nowrap" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{ p: 0 }}
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            leadSelection.handleSelectOne?.(lead?.id);
                          } else {
                            leadSelection.handleDeselectOne?.(lead?.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    {DEFAULT_COLUMN
                      ?.map((header, index) => (
                        <TableCell key={lead.id + index}>
                          {header?.render
                            ? header?.render(lead)
                            : lead[header?.id ?? ""]}
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
          count={leadMockedList?.length ?? 0}
          page={currentPage ?? 0}
          rowsPerPage={perPage ?? 10}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) =>
            setPerPage(event?.target?.value)
          }
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </Card>
  );
};
