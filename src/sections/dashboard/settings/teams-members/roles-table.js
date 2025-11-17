import { useState } from "react";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
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
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { Scrollbar } from "src/components/scrollbar";
import { TableSkeleton } from 'src/components/table-skeleton';

export const RolesTable = (props) => {
  const router = useRouter();
  const { user } = useAuth();
  const { items = [], onGetRoles = () => {}, isLoading } = props;
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const deleteRole = async () => {
    try {
      await settingsApi.deleteRole(roleToDelete);
      setTimeout(() => {
        onGetRoles();
      }, 1500);
      toast.success("Role successfully deleted!");
      setOpenDelete(false);
      setRoleToDelete(null);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              isLoading?
                <TableSkeleton
                  rowCount={5}
                  cellCount={2}
                  padding={"1px"}
                /> :
              items?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((item) => {
              return (
                <TableRow hover key={item?.id}>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography>{item?.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        router.push(
                          paths.dashboard.roles.edit.replace(
                            ":roleId",
                            item?.id
                          )
                        );
                      }}
                      sx={{ '&:hover': { color: 'primary.main' }}}
                    >
                      <Iconify icon="mage:edit" />
                    </IconButton>
                    {user?.acc?.acc_e_delete_role === undefined ||
                    user?.acc?.acc_e_delete_role ? (
                      <IconButton
                        onClick={() => {
                          setRoleToDelete(item?.id);
                          setOpenDelete(true);
                        }}
                        sx={{ '&:hover': { color: 'error.main' }}}
                      >
                        <Iconify icon="heroicons:trash" />
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider />
      <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
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
        setIsOpen={() => setOpenDelete(false)}
        onDelete={deleteRole}
        title={"Delete Role Tempalte"}
        description={"Are you sure you want to delete this role template?"}
      />
    </Box>
  );
};

RolesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
