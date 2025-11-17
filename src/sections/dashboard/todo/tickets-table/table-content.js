import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Pagination } from "src/components/pagination";
import { TableContainerStyle } from "src/utils/constants";
import { TableNoData } from "src/components/table-empty";
import { TableSettingsDrawer } from "src/components/table/table-setting-drawer";
import { TableSkeleton } from "src/components/table-skeleton";
import { ticketsActions } from "src/slices/tickets";
import { useDebounce } from "src/hooks/use-debounce";
import { useTableColumn } from "./table-column";

export const TableContent = ({
  todoList = [],
  totalCount = 0,
  isLoading = false,
  onUpdateTodos = () => {},
}) => {
  const dispatch = useDispatch();
  const pagination = useSelector((state) => state.tickets.pagination);
  const isOpenSettingDrawer = useSelector((state) => state.tickets.isOpenSettingDrawer);

  const [pageValue, setPageValue] = useState(pagination.page ? pagination.page - 1 : 0);
  const debouncedPage = useDebounce(pageValue, 300);

  const updatePagination = (key, value) => {
    dispatch(ticketsActions.setPaginationParams({ ...pagination, [key]: value }));
  };

  const onToggleSettingDrawer = () => {
    dispatch(ticketsActions.toggleSettingDrawer(!isOpenSettingDrawer));
  };

  useEffect(() => {
    updatePagination('page', debouncedPage + 1);
  }, [debouncedPage]);

  const { tableColumns, defaultColumns, updateRule } = useTableColumn({ onUpdateTodos });
  
  return (
    <>
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: {
            xs: 'calc(100vh - 280px)',
            sm: 'calc(100vh - 318px)'
          },
          ...TableContainerStyle,
        }}
      >
        <Table sx={{ minWidth: 700 }} stickyHeader>
          <TableHead>
            <TableRow>
              {tableColumns
                .filter((column) => column.enabled)
                .map((column, index) => (
                  <TableCell 
                    key={column.id} 
                    sx={{ 
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      top: 0,
                      backgroundColor: 'background.paper',
                      ...(index === 0 && {
                        position: 'sticky',
                        left: 0,
                        backgroundColor: 'background.paper', 
                        zIndex: 500,
                        boxShadow: (theme) => `inset -1px 0 ${theme.palette.divider}`
                      })
                    }}
                  > 
                    {column.headerRender ? column.headerRender() : column.label}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton
                cellCount={tableColumns.filter((col) => col.enabled).length}
                rowCount={pagination.per_page > 15 ? 15 : pagination.per_page}
              />
            ) : (
              todoList?.map((todo, index) => (
                <TableRow 
                  key={index}
                  hover
                  onClick={() => dispatch(ticketsActions.onSelectTicketId(todo.id))}
                  sx={{ cursor: 'pointer' }}
                >
                  {tableColumns
                    .filter((column) => column.enabled)
                    .map((column, colIndex) => (
                      <TableCell
                        key={`${todo.id}-${column.id}`}
                        sx={{ 
                          whiteSpace: column.id === 'answer' ? 'normal' : 'nowrap',
                          ...(colIndex === 0 && {
                            position: 'sticky',
                            left: 0,
                            backgroundColor: 'background.paper',
                            zIndex: 1,
                            boxShadow: (theme) => `inset -1px 0 ${theme.palette.divider}`
                          })
                        }}
                      >
                        {column.render ? column.render(todo) : todo[column.id]}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {todoList.length === 0 && !isLoading && (
        <TableNoData label="No tickets found" />
      )}

      <Pagination
        totalCount={totalCount}
        perPage={pagination.per_page}
        currentPage={pageValue}
        onPageChange={(value) => setPageValue(value)}
        onPerPageChange={(value) => updatePagination('per_page', value)}
      />

      {isOpenSettingDrawer && (
        <TableSettingsDrawer
          open={isOpenSettingDrawer}
          onClose={onToggleSettingDrawer}
          tableColumns={tableColumns}
          defaultColumns={defaultColumns}
          updateRule={updateRule}
        />
      )}
    </>
  );
};