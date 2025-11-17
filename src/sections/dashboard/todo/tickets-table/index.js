import { useMemo } from "react";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";

import { TableContent } from "./table-content";
import { TableFilterChips } from "./table-filter-chips";
import { TableToolbar } from "./table-toolbar";

export const TicketsTable = ({
  todoList = [],
  totalCount = 0,
  isLoading = false,
  isValidating = false,
  onUpdateTodos = () => {},
}) => {
  const filters = useSelector((state) => state.tickets.filters);

  const hasFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'q') return false;
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null;
    });
  }, [filters]);

  return (
    <Card sx={{ position: "relative" }}>
      <TableToolbar 
        isLoading={isLoading}
        isValidating={isValidating}
        onUpdateTodos={onUpdateTodos}
        hasFilters={hasFilters}
      />
      {hasFilters && (
        <TableFilterChips />
      )}
      <TableContent
        todoList={todoList}
        totalCount={totalCount}
        isLoading={isLoading}
        onUpdateTodos={onUpdateTodos}
      />
    </Card>
  );
};