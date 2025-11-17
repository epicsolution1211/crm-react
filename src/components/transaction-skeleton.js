import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export const TransactionSkeleton = ({ rowCount, cellCount, isBalance = false, padding }) => {
  return (
    ([...new Array(rowCount ?? 0).keys()]?.map((item, index) =>
      <TableRow key={item}>
        {[...new Array(cellCount ?? 0).keys()]?.map((item) => (
          <TableCell
            sx={{ border: (isBalance|| (index+1===rowCount)) ? 0 : 'auto' }}
            key={item}>
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              sx={{ py: padding ?? 'auto' }}>
              <Skeleton
                sx={{ height: 50, width: "100%" }}
                variant='rounded' 
              />
            </Stack>
          </TableCell>
        ))
        }
      </TableRow>
    )))
};
