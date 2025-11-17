import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TablePagination,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { getAPIUrl } from "src/config";

export const ClientCardTable = ({ cards, onDelete, onUpdate }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Header</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Link</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((card) => (
                <TableRow key={card.id}>
                  <TableCell>
                    {card.image && (
                      <img
                        src={`${getAPIUrl()}/${card.image}`}
                        alt={card.title}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{card.title}</TableCell>
                  <TableCell>{card.header}</TableCell>
                  <TableCell>
                    {card.description?.length > 50
                      ? card.description.substring(0, 50) + "..."
                      : card.description}
                  </TableCell>
                  <TableCell>{card.link}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => onUpdate(card)}
                        sx={{color: "primary.main"}}
                      >
                        <Iconify icon="mage:edit" width={20}/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => onDelete(card.id)}
                        sx={{color: "error.main"}}
                      >
                        <Iconify icon="heroicons:trash" width={20}/>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={cards.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}; 