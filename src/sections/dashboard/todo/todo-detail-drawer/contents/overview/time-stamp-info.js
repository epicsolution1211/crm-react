import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { useTimezone } from "src/hooks/use-timezone";

export const TimeStampInfo = ({ todo }) => {
  const { toLocalTime } = useTimezone();
  
  const formatDate = (date) => {
    if (!date) return '-';
    return toLocalTime(date);
  };

  return (
    <Stack sx={{ width: '100%', mt: 1, px: { xs: 0, sm: 1 } }}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={{ p: 1, fontSize: { xs: 11, sm: 12 }, color: 'text.secondary' }}>Created</TableCell>
            <TableCell sx={{ p: 1, fontSize: { xs: 11, sm: 12 }, color: 'text.secondary' }}>Updated</TableCell>
            <TableCell sx={{ p: 1, fontSize: { xs: 11, sm: 12 }, color: 'text.secondary' }}>Last touched</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontSize: 12, p: 1 }}>{formatDate(todo?.created_at)}</TableCell>
            <TableCell sx={{ fontSize: 12, p: 1 }}>{formatDate(todo?.updated_at)}</TableCell>
            <TableCell sx={{ fontSize: 12, p: 1 }}>{formatDate(todo?.last_touched_at)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ p: 1, fontSize: { xs: 11, sm: 12 }, color: 'text.secondary' }}>Todo started</TableCell>
            <TableCell sx={{ p: 1, fontSize: { xs: 11, sm: 12 }, color: 'text.secondary' }}>In Progress started</TableCell>
            <TableCell sx={{ p: 1, fontSize: { xs: 11, sm: 12 }, color: 'text.secondary' }}>Done started</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontSize: { xs: 11, sm: 12 }, p: 1, border: 'none' }}>{formatDate(todo?.todo_started_at)}</TableCell>
            <TableCell sx={{ fontSize: { xs: 11, sm: 12 }, p: 1, border: 'none' }}>{formatDate(todo?.in_progress_started_at)}</TableCell>
            <TableCell sx={{ fontSize: { xs: 11, sm: 12 }, p: 1, border: 'none' }}>{formatDate(todo?.done_started_at)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
};

