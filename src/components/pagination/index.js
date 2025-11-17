import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';

import { PageNumberSelect } from "src/components/pagination/page-selector";

export const Pagination = ({ 
  totalCount = 0, 
  currentPage = 0, 
  perPage = 10, 
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  onPageChange = () => {},
  onPerPageChange = () => {},
}) => {
  const totalPages = useMemo(() => 
    Math.ceil(totalCount / perPage)
  , [totalCount, perPage]);

  return (
    <Stack 
      sx={{  
        flexDirection: { md: 'row', xs: 'column' }, 
        alignItems: { md: 'center', xs: 'start' },
        justifyContent: 'flex-end', 
        gap: 0,
        bgcolor: 'background.paper',
      }}
    >
      <PageNumberSelect 
        currentPage={currentPage} 
        totalPage={totalPages}
        onUpdate={onPageChange}
      />
      <TablePagination
        component="div"
        labelRowsPerPage="Per page"
        count={totalCount}
        page={currentPage}
        rowsPerPage={perPage}
        onPageChange={(event, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onPerPageChange(Number(event.target.value))}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Stack>
  );
};

