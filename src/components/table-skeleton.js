import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export const TableSkeleton = ({ rowCount, cellCount, isBalance = false, padding, height }) => {
  return (
    ([...new Array(rowCount ?? 0).keys()]?.map((item) =>
      <TableRow key={item}>
        {[...new Array(cellCount ?? 0).keys()]?.map((item) => (
          <TableCell
            sx={{ border: (isBalance) ? 0 : 'auto', height: height ?? 'auto' }}
            key={item}>
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              sx={{ py: padding ?? 'auto' }}>
              <Skeleton
                variant="text"
                width="100%" />
            </Stack>
          </TableCell>
        ))
        }
      </TableRow>
    )))
};
