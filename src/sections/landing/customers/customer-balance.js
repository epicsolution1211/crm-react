import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Card from "@mui/material/Card";

const LandingCustomerBalance = () => (
  <Card>
    <Table sx={{ minWidth: 700 }}>
      <TableHead>
        <TableRow sx={{ whiteSpace: 'nowrap' }}>
          <TableCell>
            Balance
          </TableCell>
          <TableCell>
            Open P/L
          </TableCell>
          <TableCell>
            Equity
          </TableCell>
          <TableCell>
            Margin Level
          </TableCell>
          <TableCell>
            Free Margin
          </TableCell>
          <TableCell>
            Used Margin
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody sx={{ border: 0 }}>
        <TableRow>
          <TableCell sx={{ border: 0 }}>
            $ 1310.00
          </TableCell>
          <TableCell sx={{ border: 0 }}>
            $ 72.05
          </TableCell>
          <TableCell sx={{ border: 0 }}>
            $ 1382.18
          </TableCell>
          <TableCell sx={{ border: 0 }}>
            13824.88%
          </TableCell>
          <TableCell sx={{ border: 0 }}>
            1372.42
          </TableCell>
          <TableCell sx={{ border: 0 }}>
            10.00
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Card>
);

export default LandingCustomerBalance;
