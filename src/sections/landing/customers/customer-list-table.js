import { useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
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
import { RouterLink } from "src/components/router-link";
import { format } from "date-fns";

import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { customerMockedList } from "src/utils/constant/mock-data";
import { paths } from "src/paths";

const statuses = {
  1: "Open",
  2: "Pending",
  3: "Closed",
};

export const TempCustomerListTable = ({
  onDeselectAll,
  onDeselectOne,
  onDeselectPage,
  onSelectAll,
  onSelectOne,
  onSelectPage,
  selectAll,
  selected = [],
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const tableIds = useMemo(
    () => customerMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((client) => client?.id),
    [customerMockedList, currentPage, perPage]
  );

  const DEFAULT_COLUMN = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      render: (row) =>
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.home.customers}/${row?.id}`}
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
          underline="hover"
          gap={1}
        >
          <Typography sx={{ whiteSpace: "nowrap" }}>
            {row?.id}
          </Typography>
        </Link>
    },
    {
      id: "name",
      label: "Full Name",
      enabled: true,
      render: (row) =>
        <Stack direction="row" alignItems="center" gap={1}>
          <Iconify 
            icon={`circle-flags:${row?.country?.toLowerCase()}`}
            width={25}
          />
          <Link
            color="text.primary"
            component={RouterLink}
            href={`${paths.home.customers}/${row?.id}`}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
            gap={1}
          >
            <Typography sx={{ whiteSpace: "nowrap" }}>
              {row?.full_name}
            </Typography>
          </Link>
        </Stack>
    },
    {
      id: "email",
      label: "Email",
      enabled: true,
      render: (row) =>
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography sx={{ whiteSpace: "nowrap" }}>
            {row?.emails
              ?.slice(0, 2)
              ?.map((item) => item)
              ?.join(", ")}
          </Typography>
        </Stack>
    },
    {
      id: "phone",
      label: "Phone",
      enabled: true,
      render: (row) =>
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.phone_numbers?.map((item) => (
            <Typography>{item}</Typography>
          ))}
        </Stack>
    },
    {
      id: "call_chat",
      label: "Quick Action",
      enabled: true,
      subEnabled: {
        info: true,
        reminder: true,
        label: true,
        phone: true,
        note: true,
        field: true,
        chat: true,
        comment: true,
        sms: true,
      },
      render: (row) => {
        const emails = row.emails.slice(0, 2);
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip
              title={
                <Stack spacing={2} sx={{ p: 1 }}>
                  <Stack
                    justifyContent="space-between"
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                      Emails:
                    </Typography>
                    <Stack spacing={1}>
                      {!row?.emails?.length && "N/A"}
                      {emails?.map((email) => (
                        <Typography sx={{ fontSize: 12 }} key={email}>
                          {email}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                  <Stack
                    justifyContent="space-between"
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                      Phone numbers:
                    </Typography>
                    <Stack spacing={1}>
                      {!row?.phone_numbers?.length && "N/A"}
                      {row?.phone_numbers?.map((numbers) => (
                        <Typography sx={{ fontSize: 12 }} key={numbers}>
                          {numbers}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              }
            >
              <IconButton>
                <Iconify icon="jam:info" width={28}/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Reminder">
              <IconButton>
                <Iconify icon="lucide:calendar" width={28}/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Assign label">
              <IconButton>
                <Iconify icon="mynaui:label" width={30}/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Update custom fields">
              <IconButton>
                <Iconify icon="carbon:gui-management" width={28}/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Call customer">
              <IconButton>
                <Iconify icon="tabler:phone-call" width={28}/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Open chat">
              <IconButton>
                <Iconify icon="fluent:people-chat-16-regular" width={28}/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy to clipboard">
              <IconButton>
                <Iconify icon="mage:note-with-text" width={28}/>
              </IconButton>
            </Tooltip>
            <Tooltip title="There is no comment yet">
              <IconButton>
                <Iconify icon="uil:comment-edit" width={28}/>
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      id: "desk_id",
      label: "Desk",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {row?.desk_color ? (
            <Box
              sx={{
                backgroundColor: row?.desk_color,
                maxWidth: 1,
                height: 1,
                padding: 1,
                borderRadius: 20,
              }}
            ></Box>
          ) : null}
          <Typography>{row?.desk_name}</Typography>
        </Stack>
      ),
    },
    {
      id: "affiliate_id",
      label: "Affiliate",
      enabled: true,
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.affiliate_names?.map((item) => (
            <Chip
              key={item}
              label={item}
              size="small"
              color="primary"
              sx={{ backgroundColor: row?.affiliate_color }} />
          ))}
        </Stack>
      ),
    },
    {
      id: "internal_brand_id",
      label: "Internal Brand",
      enabled: true,
      render: (row) =>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>{row?.internal_brand_name}</Typography>
        </Stack>
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.client_labels?.map((item, index) => (
            <Chip
              key={index}
              label={item.name}
              size="small"
              color="primary"
              sx={{
                backgroundColor: item?.color,
                mr: 1,
              }}
            />
          ))}
        </Stack>
      ),
    },
    {
      id: "status",
      label: "Chats state",
      enabled: true,
      render: (row) => (
        <SeverityPill
          color={
            row?.status === 1
              ? "success"
              : row?.status === 2
                ? "warning"
                : "error"
          }
        >
          {statuses[row?.status]}
        </SeverityPill>
      ),
    },
    {
      id: "balance",
      label: "Balance",
      enabled: true,
    },
    {
      id: "agent",
      label: "Agent",
      enabled: true,
      render: (row) => {
        return (
          <Stack sx={{ p: 0 }} direction="row" gap={2}>
            {row?.agents?.map((item) => (
              <Stack key={item.val} direction="row" alignItems="center" gap={1}>
                <Avatar src={item?.avatar} sx={{ width: 30, height: 30 }} />
                <Typography sx={{ whiteSpace: "nowrap" }}>
                  {item.name}
                </Typography>
              </Stack>
            ))}
          </Stack>
        );
      },
    },
    {
      id: "team",
      label: "Team",
      enabled: true,
      render: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }}>
          {row?.client_teams?.map((item) => item?.name)?.join(", ")}
        </Typography>
      ),
    },
    {
      id: "online",
      label: "Online",
      render: (row) => (
        <Stack direction="row">
          {row?.online ? (
            <CheckCircleOutlineIcon fontSize="small" color="success" />
          ) : null}
        </Stack>
      ),
    },
    {
      id: "last_online",
      label: "Last Online",
      enabled: true,
      render: (row) => {
        return (
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {row?.last_online
              ? format(new Date(row?.last_online), "yyyy-MM-dd HH:mm")
              : ""}
          </Typography>
        );
      },
    },
    {
      id: "created_at",
      label: "Created At",
      enabled: true,
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {format(new Date(row?.created_at), "yyyy-MM-dd HH:mm")}
        </Typography>
      ),
    },
    {
      id: "last_assigned_agent_at",
      label: "Last Agent",
      enabled: true,
      render: (row) => {
        if (row?.last_assigned_agent_at) {
          return format(
            new Date(row?.last_assigned_agent_at),
            "yyyy-MM-dd HH:mm"
          );
        }
      },
    },
    {
      id: "last_assigned_team_at",
      label: "Last Team",
      enabled: true,
      render: (row) => {
        if (row?.last_assigned_team_at) {
          return format(
            new Date(row?.last_assigned_team_at),
            "yyyy-MM-dd HH:mm"
          );
        }
      },
    },
    {
      id: "last_assigned_desk_at",
      label: "Last Desk",
      enabled: true,
      render: (row) => {
        if (row?.last_assigned_desk_at) {
          return format(
            new Date(row?.last_assigned_desk_at),
            "yyyy-MM-dd HH:mm"
          );
        }
      },
    },
    {
      id: "first_lead_campaign",
      enabled: true,
      label: "Last Lead Campaign",
      render: (row) => {
        if (row?.first_lead_campaign) {
          return format(
            new Date(row?.first_lead_campaign),
            "yyyy-MM-dd HH:mm"
          );
        }
      },
    },
    {
      id: "first_lead_description",
      enabled: true,
      label: "Last Lead Description",
      render: (row) => {
        if (row?.first_lead_description) {
          return format(
            new Date(row?.first_lead_description),
            "yyyy-MM-dd HH:mm"
          );
        }
      },
    },
  ];

  const enableBulkActions = selected.length > 0;
  const selectedPage = tableIds?.every((item) => selected?.includes(item));
  const selectedSome =
    tableIds?.some((item) => selected?.includes(item)) &&
    !tableIds?.every((item) => selected?.includes(item));

  return (
    <>
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
          {enableBulkActions &&
            <Tooltip title="Export selected">
              <IconButton>
                <Iconify icon="line-md:downloading-loop" width={24}/>
              </IconButton>
            </Tooltip>}
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
                    onDeselectPage(tableIds);
                  } else {
                    onSelectPage(tableIds);
                  }
                } else {
                  onDeselectPage(tableIds);
                }
              }}
            />
            <Stack direction="row" alignItems="center" spacing={1} pl={2}>
              <Tooltip title="Assign label">
                <IconButton>
                  <Iconify 
                    icon="mynaui:label" 
                    width={26}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Assign team(s)">
                <IconButton>
                  <Iconify 
                    icon="tabler:users-plus" 
                    width={24}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Assign agent(s)">
                <IconButton>
                  <Iconify 
                    icon="lucide:user-plus" 
                    width={24}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Update custom fields">
                <IconButton>
                  <Iconify 
                    icon="carbon:gui-management"        
                    width={24}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
            {selectAll ? (
              <Typography>
                Selected all <strong>{customerMockedList?.length}</strong> customers
              </Typography>
            ) : (
              <Typography>
                Selected <strong>{selected?.length}</strong> of{" "}
                <strong>{customerMockedList?.length}</strong> customers
              </Typography>
            )}
            {!selectAll && (
              <Button onClick={() => onSelectAll()}>
                <Typography sx={{ whiteSpace: "nowrap" }}>Selected All</Typography>
              </Button>
            )}
            <Button onClick={() => onDeselectAll()}>
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
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectPage(tableIds);
                      } else {
                        onDeselectPage(tableIds);
                      }
                    }}
                  />
                </TableCell>
                {DEFAULT_COLUMN?.map((item) => (
                  <TableCell key={`${item.id}-header`}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(customerMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((customer) => {
                const isSelected = selected.includes(customer?.id);
                return (
                  <TableRow hover selected={isSelected} key={`${customer.id}-client`}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{ p: 0 }}
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne(customer.id);
                          } else {
                            onDeselectOne(customer.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    {DEFAULT_COLUMN
                      ?.map((column, index) => (
                        <TableCell
                          key={`${customer?.id + index}-row`}
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {column?.render
                            ? column?.render(customer)
                            : customer[column?.id]}
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
          count={customerMockedList?.length ?? 0}
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
