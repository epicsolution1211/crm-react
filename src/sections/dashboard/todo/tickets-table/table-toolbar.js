import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton"
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip"

import { Iconify } from "src/components/iconify";
import { ticketsActions } from "src/slices/tickets";
import { useDebounce } from "src/hooks/use-debounce";
import { TodoFilterDrawer } from "src/sections/dashboard/todo/todo-filter-drawer";

export const TableToolbar = ({
  isLoading = false,
  isValidating = false,
  onUpdateTodos = () => {},
  hasFilters = false,
}) => {
  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.tickets.filters);
  const isOpenFilterDrawer = useSelector((state) => state.tickets.isOpenFilterDrawer);
  const isOpenSettingDrawer = useSelector((state) => state.tickets.isOpenSettingDrawer);

  const [searchValue, setSearchValue] = useState(filters.q ?? '');
  const debouncedSearch = useDebounce(searchValue, 300);

  const isDefaultTableSettings = useMemo(() => {
    if (tableSetting) {
      return tableSetting?.ticketsDefaultSetting ?? true;
    }
    return true;
  }, [tableSetting]);

  const updateFilters = (key, value) => {
    dispatch(ticketsActions.setFilterParams({ ...filters, [key]: value }));
  };

  const onToggleFilterDrawer = () => {
    dispatch(ticketsActions.toggleFilterDrawer(!isOpenFilterDrawer));
  };

  const onToggleSettingDrawer = () => {
    dispatch(ticketsActions.toggleSettingDrawer(!isOpenSettingDrawer));
  };

  useEffect(() => {
    updateFilters('q', debouncedSearch);
  }, [debouncedSearch]);

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ py: 1.5, px: 2 }}>
        <Iconify icon="lucide:search" width={24} />
        <Box sx={{ flexGrow: 1 }}>
          <Input
            disableUnderline
            fullWidth
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
            }}
            placeholder="Enter a keyword"
          />
        </Box>
        <Stack direction='row' alignItems='center' gap={0.5}>
          <Tooltip title="Reload">
            <IconButton
              onClick={() => {
                if(!isLoading) onUpdateTodos();
              }}
              disabled={isLoading || isValidating}
              sx={{
                "&:hover": {
                  color: isValidating ? "text.primary" : "primary.main",
                  transform: "rotate(180deg)",
                },
                color: isValidating ? "text.primary" : "primary.main",
                transition: "transform 0.3s",
              }}
            >
              {(!isLoading && isValidating) ? (
                <Iconify icon="svg-spinners:8-dots-rotate" width={24} />
              ) : (
                <Iconify icon="lsicon:refresh-filled" width={24} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Filter">
            <IconButton
              onClick={onToggleFilterDrawer}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                color: "primary.main",
                transition: "transform 0.3s",
              }}
            >
              <Badge
                color="error"
                variant="dot"
                invisible={!hasFilters}
              >
                <Iconify icon="oui:filter" width={24} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Table Settings">
            <IconButton
              onClick={onToggleSettingDrawer}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                color: "primary.main",
                transition: "transform 0.3s",
              }}
            >
              <Badge
                color="error"
                variant="dot"
                invisible={isDefaultTableSettings}
              >
                <Iconify icon="lsicon:setting-outline" width={24} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {isOpenFilterDrawer && (
        <TodoFilterDrawer
          open={isOpenFilterDrawer}
          onClose={onToggleFilterDrawer}
          isTicket
        />
      )}
    </>
  );
};