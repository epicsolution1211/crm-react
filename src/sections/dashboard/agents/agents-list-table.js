import { useMemo, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import isEqual from "lodash.isequal";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
import PhoneForwardedOutlinedIcon from "@mui/icons-material/PhoneForwardedOutlined";
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
import { ChipSet } from "src/components/customize/chipset";
import { FilterModal } from "src/components/filter-settings-modal";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { MultiSelect } from "src/components/multi-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { authApi } from "src/api/auth";
import { getAPIUrl } from "src/config";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";

const statusOptions = [
  {
    label: "Online",
    value: "true",
  },
  {
    label: "Offline",
    value: "false",
  },
];

export const AgentsListTable = ({
  count = 0,
  onPageChange = () => { },
  onRowsPerPageChange,
  page = 0,
  getAgentData,
  rowsPerPage = 0,
  agentsList,
  setStatus,
  status,
  isLoading,
  setIsLoading,
  isPending,
  text,
  setText,
  teamList,
  roleList,
  deskList,
  desks,
  roles,
  teams,
  setDesks,
  setRoles,
  setTeams,
  nonDesks,
  setNonDesks,
  filters,
  onSetCurrentPage = () => { },
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);

  const accountId = localStorage.getItem("account_id");

  const [filterModal, setFilterModal] = useState(false);

  const [selectedFilterValue, setSelectedFilterValue] = useState("none");
  const [searchSetting, setSearchSetting] = useState([]);

  const currentChip = useMemo(() => {
    const newChips = status?.map((item) => ({
      displayValue: item === "true" ? "Online" : "Offline",
      value: item,
      label: "Status",
    }));
    return newChips;
  }, [status]);

  const teamChip = useMemo(() => {
    const newChips = teams?.map((selected) => {
      const chip = teamList?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Team",
      };
    });
    return newChips;
  }, [teams, teamList]);

  const deskChip = useMemo(() => {
    const newChips = desks?.map((selected) => {
      const chip = deskList?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Desk",
      };
    });
    return newChips;
  }, [desks, deskList]);

  const nonDeskChip = useMemo(() => {
    const newChips = nonDesks?.map((selected) => {
      const chip = deskList?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Exclude Desk",
      };
    });
    return newChips;
  }, [nonDesks, deskList]);

  const roleChip = useMemo(() => {
    const newChips = roles?.map((selected) => {
      const chip = roleList?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Role",
      };
    });
    return newChips;
  }, [roles, roleList]);

  const handleRemoveChip = (value, type) => {
    if (type === "status") {
      const newStatus = [...status].filter((item) => item !== value);
      setStatus(newStatus);
    }
    if (type === "desk_ids") {
      const newStatus = [...desks].filter((item) => item !== value);
      setDesks(newStatus);
    }
    if (type === "non_desk_ids") {
      const newStatus = [...nonDesks].filter((item) => item !== value);
      setNonDesks(newStatus);
    }
    if (type === "team_ids") {
      const newStatus = [...teams].filter((item) => item !== value);
      setTeams(newStatus);
    }
    if (type === "role_ids") {
      const newStatus = [...roles].filter((item) => item !== value);
      setRoles(newStatus);
    }
  };

  const getTableData = () => {
    if (agentsList?.length) {
      let newArray = [...agentsList];
      agentsList?.forEach((item, index) => {
        const currentDate = item?.agent?.duty_time;
        newArray[index].agent.duty_time = item?.agent?.account?.on_duty
          ? currentDate + 1
          : currentDate;
        setTableData(newArray);
      });
    } else {
      setTableData([]);
    }
  };

  useEffect(() => {
    setRule(tableSetting?.agentTable ?? []);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getTableData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [agentsList]);

  useEffect(() => {
    if (!isPending) {
      if (agentsList) {
        getTableData();
        setIsLoading(false);
      }
    }
  }, [isPending]);

  const updateRule = (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        agentTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        agentTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(tableSettings));
    }
  };

  const handleCustomerChatOpen = (id) => {
    router.push(paths.dashboard.chat + `?customer=${id}&returnTo=agents`);
  };

  const defaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      render: (row) => (
        <Typography variant="subtitle2">
          {row?.agent?.account?.id}
        </Typography>
      ),
    },
    {
      id: "name",
      label: "Name",
      enabled: true,
      render: (row) => (
        <Stack alignItems="center" direction="row" spacing={1}>
          <Avatar
            src={row?.agent?.account?.avatar ? row?.agent?.account?.avatar?.includes('http') ? row?.agent?.account?.avatar : `${getAPIUrl()}/${row?.agent?.account?.avatar}` : ""}
            sx={{ height: 32, width: 32 }}
          />
          <Stack sx={{ whiteSpace: "nowrap", flexDirection: "row", alignItems: "center", gap: 0.5 }}>
            {user?.acc?.acc_e_setting_team !== undefined &&
              user?.acc?.acc_e_setting_team && user?.acc?.acc_v_settings ? (
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.members.access.replace(
                  ":memberId",
                  row?.agent?.account?.id
                ) + "?backLink=agents"}
                variant="subtitle2"
              >
                {row?.agent?.account?.first_name
                  ? `${row?.agent?.account?.first_name} ${row?.agent?.account?.last_name}`
                  : row?.agent?.account?.email}
              </Link>
            ) : (
              <>
                {row?.agent?.account?.first_name
                  ? `${row?.agent?.account?.first_name} ${row?.agent?.account?.last_name}`
                  : row?.agent?.account?.email}
              </>
            )}
            <Tooltip title="View Heatmap">
              <IconButton
                size="small"
                onClick={() => {
                  navigate(paths.dashboard.agentsReport.replace(":agentId", row?.agent?.account?.id), { state: { agent: row?.agent?.account } });
                }}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "primary.main",
                  }
                }}
              >
                <Iconify icon="icon-park-outline:sales-report" width={22}/>
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      ),
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      headerRender: () => (
        <MultiSelect
          noPadding
          label="STATUS"
          options={statusOptions}
          onChange={setStatus}
          value={status}
        />
      ),
      render: (row) =>
        row?.agent?.account?.on_duty ? (
          <SeverityPill color="success">Online</SeverityPill>
        ) : (
          <SeverityPill color="error">Offline</SeverityPill>
        ),
    },
    {
      id: "ticket_id",
      label: "Activity",
      enabled: true,
      render: (row) => {
        const ticket = row?.ticket;
        const conversationAccount = row?.conversation_account;

        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            {conversationAccount ? (
              <Tooltip title="Call customer">
                <IconButton color="primary">
                  <PhoneForwardedOutlinedIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            {ticket ? (
              <Tooltip title="Open chat">
                <IconButton
                  sx={{ p: 0, px: 1 }}
                  onClick={() => handleCustomerChatOpen(ticket?.client_id)}
                >
                  <Iconify 
                    icon="fluent:people-chat-16-regular" 
                    width={24} 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                      },
                      transition: 'color 0.3s',
                    }}/>
                </IconButton>
              </Tooltip>
            ) : null}
          </Stack>
        );
      },
    },
    {
      id: "online_time",
      label: "Online Time",
      enabled: true,
      render: (row) => (
        <Typography variant="subtitle2">
          {new Date(row?.agent?.duty_time * 1000)?.toISOString().substr(11, 8)}
        </Typography>
      ),
    },
    {
      id: "team",
      label: "Team",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="TEAM"
          withSearch
          placeholder="Team..."
          options={teamList ?? []}
          onChange={(val) => {
            setTeams(val);
          }}
          value={teams}
        />
      ),
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.team_names?.map((item) => (
            <Chip key={item} label={item} size="small"  />
          ))}
        </Stack>
      ),
    },
    {
      id: "desk_id",
      label: "Desk",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="DESK"
          withSearch
          placeholder="Desk..."
          options={deskList ?? []}
          onChange={(val) => {
            setDesks(val);
            onSetCurrentPage(0);
          }}
          value={desks}
          isExclude
          onChangeNon={(val) => {
            setNonDesks(val);
            onSetCurrentPage(0);
          }}
          valueNon={nonDesks}
        />
      ),
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.agent?.account?.desk_names?.map((item) => (
            <Chip key={item} label={item} size="small" />
          ))}
        </Stack>
      ),
    },
    {
      id: "role",
      label: "Role",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="ROLE"
          withSearch
          placeholder="Role..."
          options={roleList ?? []}
          onChange={(val) => {
            setRoles(val);
          }}
          value={roles}
        />
      ),
      render: (row) => (
        <Stack gap={1} direction="row">
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>{row?.role_name}</Typography>
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
    {
      id: "action",
      label: "Action",
      enabled: true,
      render: (row) => (
        <Stack 
          direction="row" 
          alignItems="center" 
          gap={0.5}
          sx={{
            ":hover": { 
              color: "primary.main", 
              cursor: "pointer",
              },
          }}
          onClick={() => {
            navigate(paths.dashboard.reports.agentPerformance, { state: { agent: row?.agent?.account } });
          }}
          >
          <Iconify icon="mingcute:bug-line" width={20}/>
          <Typography
            variant="subtitle2"
            sx={{
              whiteSpace : "nowrap",
            }}
          >
            Report
          </Typography>
        </Stack>
      ),
    },
  ];

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = defaultColumn
        ?.map((item) => ({
          ...item,
          enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled,
          order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
        }))
        ?.sort((a, b) => a.order - b.order);
      return updateColumn;
    } else {
      return defaultColumn?.map((item, index) => ({ ...item, order: index }));
    }
  }, [rule, status, roles, desks, teams, roleList, deskList, teamList, nonDesks]);

  const getUserInfo = async () => {
    try {
      const { account } = await authApi.me({ accountId });
      setSearchSetting(account?.search_setting);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (!filterModal) {
      getUserInfo();
    }
  }, [filterModal]);

  const isDefaultSetting =
    JSON.stringify(
      defaultColumn?.map((item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        order: index,
      }))
    ) === JSON.stringify(rule?.map((item, index) => ({
      id: item?.id,
      enabled: item?.enabled,
      order: index,
    }))) || rule?.length === 0;

  const currentFilter = useMemo(() => {
    if (searchSetting?.agent?.length && selectedFilterValue !== 'none') {
      const result = searchSetting?.agent?.find(
        (item) => item?.id === selectedFilterValue?.id
      )?.filter;
      const name = selectedFilterValue.name;
      return { filter: result, name };
    }
  }, [searchSetting, selectedFilterValue]);

  const currentSavedFilterName = useMemo(() => {
    if (currentFilter) {
      const currentFilters = currentFilter?.filter;
      if (isEqual(currentFilters, filters)) {
        return currentFilter?.name;
      } else {
        return undefined;
      }
    }
  }, [currentFilter, filters]);

  useEffect(() => {
    if (currentFilter) {
      if (currentFilter?.filter?.status?.length) {
        setStatus(currentFilter?.filter?.status)
      } else {
        setStatus([]);
      }
      if (currentFilter?.filter?.desks?.length) {
        setDesks(currentFilter?.filter?.desks)
      } else {
        setDesks([]);
      }
      if (currentFilter?.filter?.nonDesks?.length) {
        setNonDesks(currentFilter?.filter?.nonDesks)
      } else {
        setNonDesks([]);
      }
      if (currentFilter?.filter?.teams?.length) {
        setTeams(currentFilter?.filter?.teams)
      } else {
        setTeams([]);
      }
      if (currentFilter?.filter?.roles?.length) {
        setRoles(currentFilter?.filter?.roles)
      } else {
        setRoles([]);
      }
    }
  }, [currentFilter]);

  const isFilter =
    currentChip.length > 0 ||
    teamChip?.length > 0 ||
    deskChip?.length > 0 ||
    nonDeskChip?.length > 0 ||
    roleChip?.length > 0;

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
        <Iconify icon="lucide:search" color="text.secondary" width={24} />
        <Box sx={{ flexGrow: 1 }}>
          <Input
            disableUnderline
            fullWidth
            value={text}
            onChange={(event) => {
              setText(event?.target?.value);
            }}
            placeholder="Enter a keyword"
          />
        </Box>
        {isLoading && (
          <Iconify
            icon='svg-spinners:8-dots-rotate'
            width={24}
            sx={{ color: 'white' }}
          />
        )}
        <Tooltip title="Reload Table">
          <IconButton
            onClick={() => getAgentData()}
            sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
          >
            <Iconify icon="ion:reload-sharp" width={24}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Search Setting">
          <IconButton 
              onClick={() => setFilterModal(true)}
              sx={{ '&:hover': { color: 'primary.main' }}}
            >
            {!isFilter ? (
                <SvgIcon>
                  <FilterIcon />
                </SvgIcon>
            ) : (
              <Badge variant="dot" color="error">
                <SvgIcon>
                  <FilterIcon />
                </SvgIcon>
              </Badge>
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Table Setting">
          <IconButton onClick={() => setTableModal(true)} sx={{ '&:hover': { color: 'primary.main' }}}>
            {isDefaultSetting ? (
              <SvgIcon>
                <SettingIcon />
              </SvgIcon>
            ) : (
              <Badge variant="dot" color="error">
                <SvgIcon>
                  <SettingIcon />
                </SvgIcon>
              </Badge>
            )}
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider />
      {isFilter ? (
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 2, px: 3 }}
        >
          {currentSavedFilterName ? (
            <Typography>{currentSavedFilterName ?? ""}:</Typography>
          ) : null}

          <ChipSet
            chips={currentChip}
            handleRemoveChip={(value) => handleRemoveChip(value, "status")}
          />
          <ChipSet
            chips={teamChip}
            handleRemoveChip={(value) => handleRemoveChip(value, "team_ids")}
          />
          <ChipSet
            chips={deskChip}
            handleRemoveChip={(value) => handleRemoveChip(value, "desk_ids")}
          />
          <ChipSet
            chips={roleChip}
            handleRemoveChip={(value) => handleRemoveChip(value, "role_ids")}
          />
          <ChipSet
            chips={nonDeskChip}
            handleRemoveChip={(value) => handleRemoveChip(value, "non_desk_ids")}
          />
        </Stack>
      ) : null}
      <Box sx={{ position: "relative" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                {tableColumn
                  ?.filter((item) => item.enabled)
                  ?.map((item) => (
                    <TableCell sx={{ whiteSpace: "nowrap" }} key={item.id}>
                      {item.headerRender ? item.headerRender() : (
                        <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
                          {item?.label}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && tableData?.length == 0 ? (
                <TableSkeleton rowCount={rowsPerPage > 15 ? 15 : 10} cellCount={tableColumn?.filter((item) => item.enabled)?.length} />
              ) : (
                tableData?.map((agent, index) => (
                  <TableRow hover key={index}>
                    {tableColumn
                      ?.filter((item) => item.enabled)
                      ?.map((column, index) => (
                        <TableCell key={agent?.agent?.account?.id + index}>
                          {column?.render
                            ? column?.render(agent)
                            : agent?.agent[column?.id]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        {tableData?.length === 0 && !isLoading && <TableNoData />}
        {isLoading && <Divider />}
        <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={page} 
            totalPage={count? Math.ceil(count/rowsPerPage) : 0}
            onUpdate={onPageChange}
          />
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={count}
            onPageChange={(event, index) => onPageChange(index)}
            onRowsPerPageChange={onRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          />
        </Stack>
      </Box>

      <FilterModal
        variant="agent"
        open={filterModal}
        isFilter={isFilter}
        onClose={() => setFilterModal(false)}
        filters={filters}
        searchSetting={searchSetting}
        currentValue={selectedFilterValue}
        setSelectedValue={setSelectedFilterValue}
        accountId={accountId}
      />

      <TableModal
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={defaultColumn}
        updateRule={updateRule}
      />
    </>
  );
};
