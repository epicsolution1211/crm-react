import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { FilterChip } from './filter-chip';
import { Iconify } from "src/components/iconify";
import { ItemSelect } from './item-select';
import { MemberSelect } from './member-select';
import { Scrollbar } from 'src/components/scrollbar';
import { ticketsActions } from 'src/slices/tickets';
import { useGetDesks, useGetMembers, useGetTeams } from "src/hooks/swr/use-settings";
import { useGetTodoLabels } from 'src/hooks/swr/use-todo';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', icon: 'solar:double-alt-arrow-down-bold-duotone', color: 'success', iconWidth: 20 },
  { value: 'medium', label: 'Medium', icon: 'solar:double-alt-arrow-right-bold-duotone', color: 'warning', iconWidth: 20 },
  { value: 'high', label: 'High', icon: 'solar:double-alt-arrow-up-bold-duotone', color: 'error', iconWidth: 20 },
];

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do', icon: 'fa6-regular:circle-dot', color: 'primary', iconWidth: 14 },
  { value: 'in_progress', label: 'In Progress', icon: 'fa6-regular:circle-dot', color: 'secondary', iconWidth: 14 },
  { value: 'done', label: 'Done', icon: 'fa6-regular:circle-dot', color: 'success', iconWidth: 14 },
];

const OTHER_FILTERS = [
  { value: 'pinned', label: 'Pinned', icon: 'solar:pin-bold', color: 'info', iconWidth: 18, getter: (props) => props.pinned, setter: (props) => props.setPinned },
  { value: 'starred', label: 'Starred', icon: 'iconamoon:star-fill', color: 'warning', iconWidth: 16, getter: (props) => props.starred, setter: (props) => props.setStarred },
  { value: 'archived', label: 'Archived', icon: 'solar:archive-bold', color: 'secondary', iconWidth: 18, getter: (props) => props.archived, setter: (props) => props.setArchived },
  { value: 'overdue', label: 'Overdue', icon: 'solar:alarm-bold', color: 'error', iconWidth: 18, getter: (props) => props.overdue, setter: (props) => props.setOverdue },
];

const FilterSection = ({ title, children }) => {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {children}
      </Stack>
    </Stack>
  );
}; 

export const TodoFilterDrawer = ({ open, onClose, isTicket = false }) => {
  const { members } = useGetMembers({ active: true }, { dedupingInterval: 60000 });
  const { labels } = useGetTodoLabels({}, { dedupingInterval: 60000 });
  const { teams } = isTicket ? useGetTeams({}, { dedupingInterval: 60000 }) : { teams: [] };
  const { desks } = isTicket ? useGetDesks({}, { dedupingInterval: 60000 }) : { desks: [] };
  
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.tickets.filters);
  
  const hasFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null;
    });
  }, [filters]);

  const updateFilters = (key, value) => {
    dispatch(ticketsActions.setFilterParams({ ...filters, [key]: value }));
  };

  const resetFilters = () => {
    dispatch(ticketsActions.resetFilters());
  };

  const handleToggleParticipant = useCallback((member) => {
    const isSelected = filters?.participants?.some((m) => m.id === member.id);
    const newParticipants = isSelected 
      ? filters?.participants?.filter((m) => m.id !== member.id)
      : [...(filters?.participants || []), member];
    updateFilters('participants', newParticipants);
  }, [filters.participants, updateFilters]);

  const handleToggleWatcher = useCallback((member) => {
    const isSelected = filters?.watchers?.some((m) => m.id === member.id);
    const newWatchers = isSelected
      ? filters?.watchers?.filter((m) => m.id !== member.id)
      : [...(filters?.watchers || []), member];
    updateFilters('watchers', newWatchers);
  }, [filters.watchers, updateFilters]);

  const handleToggleLabel = useCallback((label) => {
    const isSelected = filters?.labels?.some((l) => l.id === label.id);
    const newLabels = isSelected
      ? filters?.labels?.filter((l) => l.id !== label.id)
      : [...(filters?.labels || []), label];
    updateFilters('labels', newLabels);
  }, [filters.labels, updateFilters]);

  const handleToggleTeam = useCallback((team) => {
    const isSelected = filters?.teams?.some((t) => t.id === team.id);
    const newTeams = isSelected
      ? filters?.teams?.filter((t) => t.id !== team.id)
      : [...(filters?.teams || []), team];
    updateFilters('teams', newTeams);
  }, [filters.teams, updateFilters]);

  const handleToggleDesk = useCallback((desk) => {

    const isSelected = filters?.desks?.some((d) => d.id === desk.id);
    const newDesks = isSelected
      ? filters?.desks?.filter((d) => d.id !== desk.id)
      : [...(filters?.desks || []), desk];
    updateFilters('desks', newDesks);
  }, [filters.desks, updateFilters]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', md: 380 } },
      }}
    >
      <IconButton 
        onClick={onClose} 
        sx={{ 
          display: { xs: 'flex', md: 'flex' },
          position: 'absolute',
          right: { xs: 8, md: 14 },
          top: { xs: 8, md: 14 },
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}
      >
        <Iconify icon="mingcute:close-line" width={20} height={20} />
      </IconButton>
      <Stack sx={{ pt: 2, flexDirection: 'column' }}>
        <Stack px={2} mt={1.5} mb={1.5} direction="row" alignItems="center" gap={1}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Filters</Typography>
          <Tooltip title="Reset all">
            <IconButton 
              onClick={resetFilters} 
              size="small"
              disabled={!hasFilters}
              color="primary"
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Badge
                color="error"
                variant="dot"
                invisible={!hasFilters}
              >
                <Iconify icon="radix-icons:reset" width={20} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Stack>

        <Scrollbar sx={{ flexGrow: 1, px: 2, pb: 2, height: 'calc(100vh - 80px)' }}>
          <Stack spacing={2} pt={0.5}>
            <FilterSection title="Priority">
              {PRIORITY_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  isSelected={filters.priority === option.value}
                  color={option.color}
                  iconWidth={option.iconWidth}
                  onClick={() => updateFilters('priority', filters.priority === option.value ? null : option.value)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Status">
              {STATUS_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  isSelected={filters.status === option.value}
                  color={option.color}
                  iconWidth={option.iconWidth}
                  onClick={() => updateFilters('status', filters.status === option.value ? null : option.value)}
                />
              ))}
            </FilterSection>
            
            <FilterSection title="Other Filters">
              {OTHER_FILTERS.map((option) => (
                <FilterChip
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  isSelected={filters[option.value]}
                  color={option.color}
                  iconWidth={option.iconWidth}
                  onClick={() => updateFilters(option.value, filters[option.value] ? null : true )}
                />
              ))}
            </FilterSection>

            <ItemSelect
              label="Labels"
              selectedItems={filters.labels}
              onItemToggle={handleToggleLabel}
              items={labels}
            />

            <MemberSelect
              label="Participants"
              selectedMembers={filters.participants}
              onMemberToggle={handleToggleParticipant}
              members={members}
            />

            <MemberSelect
              label="Watchers"
              selectedMembers={filters.watchers}
              onMemberToggle={handleToggleWatcher}
              members={members}
            />

            {isTicket && (
              <ItemSelect
                label="Teams"
                selectedItems={filters.teams}
                onItemToggle={handleToggleTeam}
                items={teams}
              />
            )}

            {isTicket && (
              <ItemSelect
                label="Desks"
                selectedItems={filters.desks}
                onItemToggle={handleToggleDesk}
                items={desks}
              />
            )}
          </Stack>
        </Scrollbar>
      </Stack>
    </Drawer>
  );
}; 