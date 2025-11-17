import { useDispatch, useSelector } from "react-redux";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import { Iconify } from "src/components/iconify";
import { statusOptions, priorityOptions } from "src/sections/dashboard/todo/constants";
import { ticketsActions } from "src/slices/tickets";

const FILTER_CONFIG = {
  status: {
    getLabel: (value) => `Status: ${statusOptions.find(opt => opt.value === value)?.label}`,
  },
  priority: {
    getLabel: (value) => `Priority: ${priorityOptions.find(opt => opt.value === value)?.label}`,
  },
  participants: {
    isArray: true,
    getLabel: (item) => `Participant: ${item.first_name}${item?.last_name ? ` ${item.last_name}` : ''}`,
    getId: (item) => item.id,
  },
  watchers: {
    isArray: true,
    getLabel: (item) => `Watcher: ${item.first_name}${item?.last_name ? ` ${item.last_name}` : ''}`,
    getId: (item) => item.id,
  },
  labels: {
    isArray: true,
    getLabel: (item) => `Label: ${item.name}`,
    getId: (item) => item.id,
  },
  teams: {
    isArray: true,
    getLabel: (item) => `Team: ${item.name}`,
    getId: (item) => item.id,
  },
  desks: {
    isArray: true,
    getLabel: (item) => `Desk: ${item.name}`,
    getId: (item) => item.id,
  },
  pinned: {
    getLabel: () => "Pinned",
  },
  starred: {
    getLabel: () => "Starred",
  },
  archived: {
    getLabel: () => "Archived",
  },
  overdue: {
    getLabel: () => "Overdue",
  },
};

export const TableFilterChips = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.tickets.filters);

  const updateFilters = (key, value) => {
    dispatch(ticketsActions.setFilterParams({ ...filters, [key]: value }));
  };

  const renderFilterChip = (filterKey, config) => {
    const filterValue = filters[filterKey];
    
    if (!filterValue) return null;

    if (config.isArray) {
      return filterValue.map((item) => (
        <Chip
          key={config.getId(item)}
          size="small"
          variant="outlined"
          label={config.getLabel(item)}
          onDelete={() => {
            const newItems = filterValue.filter(i => config.getId(i) !== config.getId(item));
            updateFilters(filterKey, newItems);
          }}
        />
      ));
    }

    return (
      <Chip
        key={filterKey}
        size="small"
        variant="outlined"
        label={config.getLabel(filterValue)}
        onDelete={() => updateFilters(filterKey, null)}
      />
    );
  };

  return (
    <Stack 
      sx={{ 
        px: 2, 
        py: 1, 
        borderTop: (theme) => `1px dashed ${theme.palette.divider}`, 
        alignItems: 'center',
        flexDirection: 'row',
        gap: 1,
      }}
    >
      <Stack 
        sx={{ 
          flexWrap: 'wrap',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 1,
        }}
      >
        {Object.entries(FILTER_CONFIG).map(([key, config]) => renderFilterChip(key, config))}
        <Chip
          icon={<Iconify icon="tabler:filter-2-x"/>}
          size="small"
          label="Clear all"
          color="error"
          onClick={() => dispatch(ticketsActions.resetFilters())}
          sx={{ 
            '& .MuiChip-icon': { color: 'white', width: 18, height: 18 },
          }}
        />
      </Stack>
    </Stack>
  );
};