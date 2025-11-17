import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "src/components/scrollbar";
import { articleMockedList } from "src/utils/constant/mock-data";

export const LandingBlogListView = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  return (
    <Box sx={{ position: "relative" }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>LABELS</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articleMockedList?.map((article) => {
              return (
                <TableRow key={article?.id}>
                  <TableCell>{article?.id}</TableCell>
                  <TableCell>{article?.title}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        label={article?.category}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton >
                        <Iconify icon="mage:edit" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton>
                        <Iconify icon="heroicons:trash" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        labelRowsPerPage="Per page"
        count={articleMockedList?.length ?? 0}
        page={currentPage ?? 0}
        rowsPerPage={perPage ?? 10}
        onPageChange={(event, index) => setCurrentPage(index)}
        onRowsPerPageChange={(event) =>
          setPerPage(event?.target?.value)
        }
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};
