import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
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

import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { agentsMockList } from "src/utils/constant/mock-data";

export const LandingAgents = () => {
  const defaultColumn = [
    {
      id: "name",
      label: "Name",
      enabled: true,
      render: (row) => (
        <Stack alignItems="center" direction="row" spacing={1}>
          <Avatar
            src={row?.avatar}
            sx={{
              height: 42,
              width: 42,
            }}
          />
          <Stack sx={{ whiteSpace: "nowrap" }}>
            {row?.name}
          </Stack>
        </Stack>
      ),
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      render: (row) =>
        row?.online ? (
          <SeverityPill color="success">Online</SeverityPill>
        ) : (
          <SeverityPill color="error">Offline</SeverityPill>
        ),
    },
    {
      id: "ticket_id",
      label: "Activity",
      enabled: true,
      render: () => (
        <Stack alignItems="center" direction="row">
          <Tooltip title="Call customer">
            <IconButton>
              <Iconify icon="ci:phone" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open chat">
            <IconButton sx={{ p: 0, px: 1 }}>
              <Iconify icon="mynaui:chat-messages" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      id: "online_time",
      label: "Online Time",
      enabled: true,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.online ? row?.onlineTime?.toISOString().substr(11, 8) : "00:00:00"}
        </Typography>
      ),
    },
    {
      id: "team",
      label: "Team",
      enabled: true,
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.teams?.map((item, index) => (
            <Chip key={index} label={item?.name ?? ''}
              sx={{ backgroundColor: item?.color }}
              size="small" color="primary" />
          ))}
        </Stack>
      ),
    },
    {
      id: "role",
      label: "Role",
      enabled: true,
      render: (row) => (
        <Stack gap={1} direction="row">
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>{row?.role}</Typography>
        </Stack>
      ),
    },
    {
      id: "desk_id",
      label: "Desk",
      enabled: true,
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.desks?.map((item, index) => (
            <Chip key={index} label={item?.name}
              sx={{ backgroundColor: item?.color }}
              size="small" color="primary" />
          ))}
        </Stack>
      ),
    },
    {
      id: "assigned_tickets",
      label: "Assigned tickets",
      enabled: true,
    },
    {
      id: "close_tickets",
      label: "Closed tickets",
      enabled: true,
    },
    {
      id: "pending_tickets",
      label: "Pending tickets",
      enabled: true,
    },
    {
      id: "contact_visitor",
      label: "Visitor contacts",
      enabled: true,
    },
    {
      id: "calls",
      label: "Client calls",
      enabled: true,
    },
    {
      id: "internal_calls",
      label: "Internal calls",
      enabled: true,
    },
    {
      id: "call_duration",
      label: "Client call duration",
      enabled: true,
    },
    {
      id: "internal_call_duration",
      label: "Internal call duration",
      enabled: true,
    },
    {
      id: "ticket_message",
      label: "Ticket messages",
      enabled: true,
    },
    {
      id: "visitor_message",
      label: "Visitor Messages",
      enabled: true,
    },
    {
      id: "internal_message",
      label: "Internal Messages",
      enabled: true,
    },
    {
      id: "email_sent",
      label: "Sent Email",
      enabled: true,
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [mockData, setMockData] = useState(agentsMockList);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMockData(prev => prev?.map((item) => {
        if (item?.online) {
          return { ...item, onlineTime: new Date(item?.onlineTime?.getTime() + 1 * 1000) }
        }
        return item;
      }))
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

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
        </Stack>
      </Stack>
      <Divider />
      <Box sx={{ position: "relative" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                {defaultColumn
                  ?.map((item) => (
                    <TableCell sx={{ whiteSpace: "nowrap" }} key={item.id}>
                      {item.headerRender ? item.headerRender() : item?.label}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((agent, index) => (
                <TableRow hover key={index}>
                  {defaultColumn
                    ?.map((column, index) => (
                      <TableCell key={index}>
                        {column?.render
                          ? column?.render(agent)
                          : agent[column?.id]}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={agentsMockList?.length ?? 0}
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
