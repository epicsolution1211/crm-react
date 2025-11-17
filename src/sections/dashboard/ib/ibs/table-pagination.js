import { useState, useEffect, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";

import { thunks } from "src/thunks/customers";
import { useDebounce } from "src/hooks/use-debounce";
import { PageNumberSelect } from "src/components/pagination/page-selector";

export const _CustomerTablePagination = ({ count = 0 }) => {
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.customers.iBsFilters);
  const updateFilters = (data) => dispatch(thunks.setIBsFilters(data));

  const [page, setPage] = useState();
  const debouncedPage = useDebounce(page, 600);

  useEffect(() => {
    updateFilters({ currentPage: debouncedPage ?? 0 });
  }, [debouncedPage]);

  useEffect(() => {
    const customersPerPage = localStorage.getItem("customersPerPage");

    if (customersPerPage) {
      updateFilters({ perPage: customersPerPage });
    }
  }, []);

  useEffect(() => {
    setPage(filters?.currentPage ?? 0);
  }, [filters])

  const totalPage = useMemo(()=> {
    if(count) {
      const perPage = filters?.perPage ? parseInt(filters?.perPage) : 10 ;
      const totalPage =  count? Math.ceil(count/perPage) : 0;
      return totalPage;
    }
    return 0;
  }, [count, filters?.perPage]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
        <PageNumberSelect 
          currentPage={page} 
          totalPage={totalPage}
          onUpdate={setPage}
        />
        <TablePagination
          component="div"
          count={count ?? 0}
          page={page ?? 0}
          onPageChange={(event, index) => setPage(index)}
          rowsPerPage={filters?.perPage ? parseInt(filters?.perPage) : 10}
          onRowsPerPageChange={(event) => {
            updateFilters({ perPage: event?.target?.value });
            localStorage.setItem("customersPerPage", event?.target?.value);
          }}
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
        />
      </Stack>
      <Box sx={{ position: 'absolute', top: -22, right: 0, backgroundColor: (theme) => theme.palette.background.paper, minWidth: 8, minHeight: 21 }} />
    </Box>
  );
};

export const CustomerTablePagination = memo(_CustomerTablePagination);