import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as PreviewIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Scrollbar } from 'src/components/scrollbar';
import { useState } from 'react';
import { TableNoData } from 'src/components/table-empty';
import { TableSkeleton } from 'src/components/table-skeleton';

export const AnnouncementsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange,
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    onEdit,
    onDelete,
    onPreview,
    loading = false,
  } = props;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handleDeleteClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(selectedAnnouncement.id);
    setDeleteDialogOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Expires At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableSkeleton rowCount={rowsPerPage > 15 ? 15 : 10} cellCount={4} />
              ) : (
                items.map((announcement) => {
                  return (
                    <TableRow hover key={announcement.id}>
                      <TableCell>{announcement.id}</TableCell>
                      <TableCell>{announcement.title}</TableCell>
                      <TableCell>
                        {announcement.expired_at 
                          ? format(new Date(announcement.expired_at), 'dd/MM/yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Preview announcement" placement="top">
                            <IconButton 
                              size="small"
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                  backgroundColor: 'primary.lighter',
                                  color: 'primary.main'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                              onClick={() => onPreview(announcement)}
                            >
                              <PreviewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit announcement" placement="top">
                            <IconButton 
                              size="small"
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                  backgroundColor: 'info.lighter',
                                  color: 'info.main'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                              onClick={() => onEdit(announcement)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete announcement" placement="top">
                            <IconButton 
                              size="small"
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                  backgroundColor: 'error.lighter',
                                  color: 'error.main'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                              onClick={() => handleDeleteClick(announcement)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      {items.length === 0 && !loading && <TableNoData />}
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Announcement</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this announcement?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

AnnouncementsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onPreview: PropTypes.func,
  loading: PropTypes.bool,
}; 