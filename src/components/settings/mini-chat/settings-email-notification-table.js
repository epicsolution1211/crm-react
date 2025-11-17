import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { Scrollbar } from 'src/components/scrollbar';
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { getAPIUrl } from 'src/config';

export const SettingsEmailNotificationTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    handleChangeNotificationStatus,
  } = props;

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Email
              </TableCell>
              <TableCell align="right">
                Notification
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((account) => (
              <TableRow
                hover
                key={account.id}
              >
                <TableCell>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
                    <Avatar
                      src={account?.avatar ? account?.avatar?.includes('http') ? account?.avatar : `${getAPIUrl()}/${account?.avatar}` : ""}
                      sx={{
                        height: 42,
                        width: 42
                      }}
                    >
                    </Avatar>
                    <Typography sx={{ fontSize: 14 }}>{account?.first_name} {account?.last_name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {account.email}
                </TableCell>
                <TableCell align="right">
                  <Switch checked={account.ticket_email} onChange={(e) => handleChangeNotificationStatus(account.id, e)} />
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        labelRowsPerPage="Per page"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
      />
    </Box>
  );
};

SettingsEmailNotificationTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  handleChangeNotificationStatus: PropTypes.func,
};
