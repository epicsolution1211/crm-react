import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { DeleteModal } from "src/components/customize/delete-modal";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { Scrollbar } from "src/components/scrollbar";
import { TableSkeleton } from 'src/components/table-skeleton';
import { MetabaseGroupPermissionsDialog } from './metabase-group-permissions-dialog';
import { metabaseApi } from 'src/api/metabase';

export const MetabaseGroupsTable = ({ 
  items = [], 
  isLoading, 
  onEdit, 
  onDelete, 
  isDeleteLoading 
}) => {
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isGroupLoading, setIsGroupLoading] = useState(false);

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (groupToDelete) {
      await onDelete(groupToDelete.id);
      setOpenDelete(false);
      setGroupToDelete(null);
    }
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setGroupToDelete(null);
  };

  const handleOpenPermissionsDialog = async (groupId) => {
    setPermissionsDialogOpen(true);
    setIsGroupLoading(true);
    setSelectedGroup(null);
    try {
      const group = await metabaseApi.getMetabaseGroup(groupId);
      setSelectedGroup(group);
    } finally {
      setIsGroupLoading(false);
    }
  };

  const handleClosePermissionsDialog = () => {
    setPermissionsDialogOpen(false);
    setSelectedGroup(null);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Magic Group Type</TableCell>
              <TableCell>Member Count</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton
                rowCount={5}
                cellCount={7}
                padding={"1px"}
              />
            ) : (
              items
                ?.slice(currentPage * perPage, (currentPage * perPage) + perPage)
                ?.map((item) => (
                  <TableRow hover key={item?.id}>
                    <TableCell>{item?.id}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{ cursor: 'pointer', textDecoration: item?.magic_group_type ? 'none' : 'underline' }}
                          tabIndex={0}
                          aria-label={`Open permissions for group ${item?.name}`}
                          onClick={() => item?.magic_group_type ? null : handleOpenPermissionsDialog(item?.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') item?.magic_group_type ? null : handleOpenPermissionsDialog(item?.id);
                          }}
                        >
                          {item?.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item?.magic_group_type || "No magic group type"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item?.member_count || "No member count"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {!item?.magic_group_type && (
                        <>
                          <IconButton
                            onClick={() => onEdit(item)}
                            sx={{ '&:hover': { color: 'primary.main' }}}
                          >
                            <Iconify icon="mage:edit" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(item)}
                            sx={{ '&:hover': { color: 'error.main' }}}
                          >
                            <Iconify icon="heroicons:trash" />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider />
      <Stack sx={{ 
        flexDirection: { md: 'row', xs: 'column' }, 
        gap: 0, 
        justifyContent: 'flex-end', 
        alignItems: { md: 'center', xs: 'start' } 
      }}>
        <PageNumberSelect 
          currentPage={currentPage} 
          totalPage={items?.length ? Math.ceil(items?.length/perPage) : 0}
          onUpdate={setCurrentPage}
        />
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={items?.length ?? 0}
          page={currentPage ?? 0}
          rowsPerPage={perPage ?? 10}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) =>
            setPerPage(event?.target?.value)
          }
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Stack>

      <DeleteModal
        isOpen={openDelete}
        setIsOpen={handleCloseDelete}
        onDelete={handleDeleteConfirm}
        title="Delete Report Group"
        description="Are you sure you want to delete this report group? This action cannot be undone."
        isLoading={isDeleteLoading}
      />
      <MetabaseGroupPermissionsDialog
        open={permissionsDialogOpen}
        onClose={handleClosePermissionsDialog}
        group={selectedGroup}
        isLoading={isGroupLoading}
        onUpdateCreateQueries={async (table_name, access_type) => {
          if (!selectedGroup) return;
          
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount <= maxRetries) {
            try {
              await metabaseApi.updateMetabaseGroup(selectedGroup.report.id, { table_name, access_type });
              const updatedGroup = await metabaseApi.getMetabaseGroup(selectedGroup.report.id);
              setSelectedGroup(updatedGroup);
              toast.success('Metabase group permissions updated successfully');
              break;
            } catch (error) {
              retryCount++;
              
              if (error?.response?.status === 400 && retryCount <= maxRetries) {
                console.warn(`Metabase update failed with 400 error, retrying... (attempt ${retryCount}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              }
              
              if (error?.response?.status === 400 && retryCount > maxRetries) {
                toast.error(error?.response?.data?.message || 'Failed to update Metabase group after multiple attempts');
              }
              throw error;
            }
          }
        }}
      />
    </Box>
  );
};

MetabaseGroupsTable.propTypes = {
  items: PropTypes.array,
  isLoading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleteLoading: PropTypes.bool,
}; 