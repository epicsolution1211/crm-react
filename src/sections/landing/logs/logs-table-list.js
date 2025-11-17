import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";

export const LogsTableList = ({ logs }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  return (
    <Stack>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>
                Account Name
              </TableCell>
              <TableCell>
                Updated At
              </TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                    Field
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>Before</TableCell>
              <TableCell>After</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(
              logs?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((log) => (
                <TableRow key={log?.id}>
                  <TableCell>{log?.id}</TableCell>
                  <TableCell>{log?.account_name}</TableCell>
                  <TableCell>{log?.updated_at}</TableCell>
                  <TableCell>
                    <Stack>{log?.field_name}</Stack>
                  </TableCell>
                  <TableCell>
                    <Stack>{log?.old_value}</Stack>
                  </TableCell>
                  <TableCell>
                    <Stack>{log?.new_value}</Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        labelRowsPerPage="Per page"
        count={logs?.length}
        onPageChange={(event, index) => {
          setCurrentPage(index);
        }}
        onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
        page={currentPage ?? 0}
        rowsPerPage={perPage ?? 10}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Stack>
  );
};

LogsTableList.propTypes = {
  logs: PropTypes.array,
};
