import { useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import isEqual from "lodash.isequal";

import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography";

import { AvatarWithName } from "src/sections/dashboard/todo/todo-detail-drawer/contents/common";
import { Iconify } from "src/components/iconify";
import { RouterLink } from "src/components/router-link";
import { SeverityPill } from "src/components/severity-pill";
import { paths } from "src/paths";
import { priorityOptions, statusOptions } from "src/sections/dashboard/todo/constants";
import { ticketsActions } from "src/slices/tickets";
import { todoApi } from "src/api/todo";
import { useTimezone } from "src/hooks/use-timezone";

const getTableSettings = () => {
  try {
    const localTableSetting = localStorage.getItem("tableSetting");
    return localTableSetting ? JSON.parse(localTableSetting) : {};
  } catch (error) {
    console.error("Error parsing table settings:", error);
    return {};
  }
};

const updateTableSettings = (updates) => {
  const currentSettings = getTableSettings();
  const newSettings = { ...currentSettings, ...updates };
  localStorage.setItem("tableSetting", JSON.stringify(newSettings));
  return newSettings;
};

export const useTableColumn = ({ onUpdateTodos = () => {} }) => {
  const { user, format, toLocalTime } = useTimezone();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState({});
  const [rule, setRule] = useState(() => {
    const settings = getTableSettings();
    return settings?.ticketsTable || [];
  });

  const baseColumns = [
    {
      id: 'id',
      label: 'ID',
      enabled: true,
      render: (row) => (
        <Typography variant="body2" noWrap>
          {row.id}
        </Typography>
      )
    },
    {
      id: 'title', 
      label: 'Title',
      enabled: true,
      render: (row) => (
        <Stack direction='row' alignItems='center' gap={1}>
          {row.pinned && <Iconify icon="solar:pin-bold" width={18} color={'info.main'}/>}
          {row.starred && <Iconify icon="iconamoon:star-fill" width={16} color={'warning.main'}/>}
          <Typography 
            variant="body2" 
            sx={{
              whiteSpace: 'nowrap',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {row.title}
          </Typography>
        </Stack>
      )
    },
    {
      id: 'status',
      label: 'Status',
      enabled: true,
      render: (row) => {
        const label = statusOptions.find(option => option.value === row.status)?.label;
        const color = statusOptions.find(option => option.value === row.status)?.color;
        return (
          <SeverityPill color={color}>{label}</SeverityPill>
        );
      }
    },
    {
      id: 'priority',
      label: 'Priority', 
      enabled: true,
      render: (row) => {
        const label = priorityOptions.find(option => option.value === row.priority)?.label;
        const color = priorityOptions.find(option => option.value === row.priority)?.color;
        return (
          <Chip color={color} label={label} size="small" sx={{ borderRadius: 1 }} />
        );
      }
    },
    {
      id: 'due_date',
      label: 'Due Date',
      enabled: true,
      render: (row) => (
        <Typography variant="subtitle2" color={row?.is_overdue ? "error.main" : "text.primary"}>
          {row.due_date ? format(row.due_date, "MMM d, yyyy") : ''}
        </Typography>
      )
    },
    {
      id: 'labels',
      label: 'Labels', 
      enabled: true,
      render: (row) => {
        return (
          <Stack direction='row' gap={1}>
            {row?.labels && row?.labels.map((label) => (
              <Chip key={label.id} label={label.name} size="small" sx={{ bgcolor: label.color }} />
            ))}
          </Stack>
        );
      }
    },
    {
      id: 'client',
      label: 'Client',
      enabled: true,
      render: (row) => (
        row?.client && (
          <Link
            color="text.primary"
            component={RouterLink}
            href={`${paths.dashboard.customers.index}/${row?.client?.id}`}
            variant="subtitle2"
            underline="none"
          >
            <AvatarWithName account={row?.client} hideName />
          </Link>
      ))
    },
    {
      id: 'transaction',
      label: 'Transaction',
      enabled: true,
      render: (row) => {
        return (
          row?.transaction_id && (
            <Link
              color="text.primary"
              component={RouterLink}
              href={`${paths.dashboard.risk.transactions}/${row?.transaction_id}`}
              sx={{ 
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0.5,
                transition: 'color 0.1s',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {row?.transaction_id}
              <Iconify 
                icon="iconamoon:link-external" 
                width={18} 
              />
            </Link>
          )
        );
      }
    },
    {
      id: 'creator',
      label: 'Creator',
      enabled: true,
      render: (row) => (
        row?.creator && (
          <Link
            color="text.primary"
            component={RouterLink}
            href={`${paths.dashboard.members.access.replace(":memberId", row?.creator?.id)}`}
            variant="subtitle2"
            underline="none"
          >
            <AvatarWithName account={row?.creator} hideName />
          </Link>
        )
      )
    },
    {
      id: 'participants',
      label: 'Participants',
      enabled: true,
      render: (row) => (
        <Stack direction='row' gap={0.5}>
          {row?.participants && row?.participants.map((participant) => (
            <Link
              key={participant.id}
              color="text.primary"
              component={RouterLink}
              href={`${paths.dashboard.members.access.replace(":memberId", participant?.id)}`}
              variant="subtitle2"
              underline="none"
            >
            <AvatarWithName account={participant} hideName />
            </Link>
          ))}
        </Stack>
      )
    },
    {
      id: 'watchers',
      label: 'Watchers',
      enabled: true,
      render: (row) => (
        <Stack direction='row' gap={0.5}>
          {row?.watchers && row?.watchers.map((watcher) => (
            <Link
              key={watcher.id}
              color="text.primary"
              component={RouterLink}
              href={`${paths.dashboard.members.access.replace(":memberId", watcher?.id)}`}
              variant="subtitle2"
              underline="none"
            >
              <AvatarWithName account={watcher} hideName />
            </Link>
          ))}
        </Stack>
      )
    },
    {
      id: 'teams',
      label: 'Teams',
      enabled: true,
      render: (row) => (
        <Stack direction='row' gap={0.5}>
          {row?.teams && row?.teams.map((team) => (
            <Chip key={team.id} label={team.name} size="small" />
          ))}
        </Stack>
      )
    },
    {
      id: 'desks',
      label: 'Desks',
      enabled: true,
      render: (row) => (
        <Stack direction='row' gap={0.5}>
          {row?.desks && row?.desks.map((desk) => (
            <Chip key={desk.id} label={desk.name} size="small" />
          ))}
        </Stack>
      )
    },
    {
      id: 'created_at',
      label: 'Created At',
      enabled: true,
      render: (row) => (
        <Typography variant="body2" noWrap>
          {toLocalTime(row.created_at)}
        </Typography>
      )
    },
    {
      id: 'updated_at',
      label: 'Updated At',
      enabled: true,
      render: (row) => (
        <Typography variant="body2" noWrap>
          {toLocalTime(row.updated_at)}
        </Typography>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      enabled: true,
      render: (row) => (
        <Stack 
          direction='row' 
          gap={1}
          alignItems='center'
          onClick={(event) => event.stopPropagation()}
        >
          <IconButton
            onClick={() => handleUpdateTodo(row.id, { pinned: !row.pinned }, 'pinned')}
            size="small"
            disabled={isUpdatingStatus[row.id]?.pinned}
            sx={{ 
              p: 0.3,
              color: 'info.main',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          > 
            {isUpdatingStatus[row.id]?.pinned ? (
              <CircularProgress size={22} />
            ) : (
              <Tooltip title={row.pinned ? "Unpin" : "Pin"}>
                <Iconify icon={row.pinned ? "solar:pin-bold" : "solar:pin-linear"} width={22} />
              </Tooltip>
            )}
          </IconButton>
          <IconButton
            onClick={() => handleUpdateTodo(row.id, { starred: !row.starred }, 'starred')}
            size="small"
            disabled={isUpdatingStatus[row.id]?.starred}
            sx={{ 
              p: 0.3,
              color: 'warning.main',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          > 
            {isUpdatingStatus[row.id]?.starred ? (
              <CircularProgress size={22} />
            ) : (
              <Tooltip title={row.starred ? "Unstar" : "Star"}>
                <Iconify icon={row.starred ? "iconamoon:star-fill" : "iconamoon:star-light"} width={22} />
              </Tooltip>
            )}
          </IconButton>
          <IconButton
            onClick={() => handleUpdateTodo(row.id, { archived: !row.archived }, 'archived')}
            size="small"
            disabled={isUpdatingStatus[row.id]?.archived}
            sx={{ 
              p: 0.3,
              color: 'secondary.main',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          > 
            {isUpdatingStatus[row.id]?.archived ? (
              <CircularProgress size={22} />
            ) : (
              <Tooltip title={row.archived ? "Unarchive" : "Archive"}>
                <Iconify icon={row.archived ? "solar:archive-bold" : "solar:archive-linear"} width={22} />
              </Tooltip>
            )}
          </IconButton>
          <Tooltip title="Delete">
          <IconButton
            onClick={() => onSelectDeleteTicketId(row.id)}
            disabled={row.creator?.id !== user?.id}
            size="small"
            sx={{ 
              p: 0.3,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <Iconify icon="heroicons:trash" width={22} />
          </IconButton>
        </Tooltip>
        </Stack>
      )
    },
  ];

  const columns = useMemo(() => baseColumns, [user, isUpdatingStatus]);

  const dispatch = useDispatch();

  const onSelectDeleteTicketId = useCallback((id) => {
    dispatch(ticketsActions.onSelectDeleteTicketId(id));
  }, [dispatch]);

  const handleUpdateTodo = useCallback(async (todoId, data, key) => {
    try {
      setIsUpdatingStatus(prev => ({
        ...prev,
        [todoId]: {
          ...prev[todoId],
          [key]: true,
        },
      }));
      await todoApi.updateToDo(todoId, data);
      setTimeout(() => onUpdateTodos(), 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsUpdatingStatus(prev => ({
          ...prev,
          [todoId]: {
            ...prev[todoId],
            [key]: false,
          }
        }));
      }, 1000);
    }
  }, [onUpdateTodos]);

  const updateRule = useCallback((newRule) => {
    setRule(newRule);
    const defaultRule = baseColumns.map((col, index) => ({
      id: col.id,
      label: col.label,
      enabled: col.enabled,
      order: index
    }));
    
    const isSame = isEqual(newRule, defaultRule);

    updateTableSettings({
      ticketsTable: newRule,
      ticketsDefaultSetting: isSame,
    });
  }, [baseColumns]);

  const tableColumns = useMemo(() => {
    const ruleExists = rule && rule.length > 0;
    const lengthsDifferent = ruleExists && rule.length !== columns.length;
    
    if (lengthsDifferent) {
      updateTableSettings({ ticketsDefaultSetting: false });
    } else {
      if (ruleExists) {
        const isSame = isEqual(rule?.map(item => ({
          id: item.id,
          label: item.label,
          enabled: item.enabled,
          order: item.order,
        })), baseColumns?.map((item, index) => ({
          id: item.id,
          label: item.label,
          enabled: item.enabled,
          order: index,
        })));
        if (isSame) {
          updateTableSettings({ ticketsDefaultSetting: true });
        } else {
          updateTableSettings({ ticketsDefaultSetting: false });
        }
      }
    }
    
    if (rule && rule.length > 0) {
      return columns.map((col, index) => {
        const ruleItem = rule.find((item) => item.id === col.id);
        return {
          ...col,
          enabled: ruleItem?.enabled !== undefined 
            ? ruleItem.enabled 
            : (columns.find(bc => bc.id === col.id)?.enabled ?? false),
          order: ruleItem?.order ?? index + baseColumns.length
        };
      }).sort((a, b) => a.order - b.order);
    } else {
      return baseColumns.map((col, index) => ({
        ...col,
        order: index
      }));
    }
  }, [rule, columns]);

  return {
    tableColumns,
    defaultColumns: baseColumns.map((col, index) => ({
      id: col.id,
      label: col.label,
      enabled: col.enabled,
      order: index
    })),
    updateRule,
  };
};