import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

export const DataEntrySetting = ({ dataEntry }) => {

  return (
    <Card>
      <CardHeader title="Data Entry" />
      <CardContent>
        <Stack sx={{ pb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Total Records</TableCell>
                <TableCell>Invalid Records</TableCell>
                <TableCell>Updated Record</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableCell sx={{ border: 'none' }}>{dataEntry?.total_records}</TableCell>
              <TableCell sx={{ border: 'none' }}>{dataEntry?.invalid_records}</TableCell>
              <TableCell sx={{ border: 'none' }}>{dataEntry?.updated_count}</TableCell>
            </TableBody>
          </Table>
        </Stack>
      </CardContent>
    </Card>
  );
};
