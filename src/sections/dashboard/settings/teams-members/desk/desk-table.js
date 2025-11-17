import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { Iconify } from 'src/components/iconify';
import { DeleteModal } from "src/components/customize/delete-modal";
import { EditDeskModal } from "./edit-desk-modal";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { Scrollbar } from "src/components/scrollbar";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { useSettings } from "src/hooks/use-settings";
import { TableSkeleton } from 'src/components/table-skeleton';
import { DeskAddMemberDrawer } from "./desk-add-member-drawer";


export const DeskTable = ({ desks = [], members = [], isLoading, onGetDesks = () => { }, onGetDeskMember = () => { } }) => {
  const [deskToEdit, setDeskToEdit] = useState(null);
  const [deskToDelete, setDeskToDelete] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const settings = useSettings();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [selectedDesk, setSelectedDesk] = useState(undefined);


  const [isOpenMemberDrawer, setIsOpenMemberDrawer] = useState(false);

  const handleSelectDesk = (desk) => {
    setSelectedDesk(desk);

    setIsOpenMemberDrawer(true);
  };

  const handleCloseDrawer = () => {
    setSelectedDesk(undefined);
    setIsOpenMemberDrawer(false);
  }

  const deleteDesk = async () => {
    try {
      await settingsApi.deleteDesk(deskToDelete?.id);
      setTimeout(() => {
        onGetDesks();
      }, 1500);
      toast.success("Desk successfully deleted!");
      setOpenDelete(false);
      setDeskToDelete(null);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Scrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Color</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Number of agents</TableCell>
                <TableCell>
                  <Typography sx={{ textAlign: "right", pr: 2, fontSize: 12, fontWeight: 600 }}>Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rowCount={5} cellCount={5} padding={"1px"} />
              ) : (
                desks
                  ?.slice(
                    currentPage * perPage,
                    currentPage * perPage + perPage
                  )
                  ?.map((item) => (
                    <TableRow hover key={item?.id}>
                      <TableCell>
                        <Typography>{item?.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <Typography sx={{ whiteSpace: "nowrap" }}>{item?.name}</Typography>
                          {item?.is_default && (
                            <Typography sx={{ 
                              color: "white", 
                              bgcolor: "success.main", 
                              borderRadius: 10, 
                              py: 0, 
                              px: 0.5, 
                              fontSize: 12,

                            }}>
                              Default
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item?.color ?? "default"}
                          color="primary"
                          sx={{
                            backgroundColor:
                              item?.color ?? settings?.colorPreset,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => handleSelectDesk(item)}
                        sx={{
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Stack 
                          className='hover-parent' 
                          direction="row" 
                          alignItems="center" 
                          gap={0.5} 
                          sx={{ 
                            "&:hover": { color: "primary.main" },
                            transition: 'visibility 0.3s ease-in-out'
                          }}>
                          <Iconify icon="ci:users" width={24} />
                          <Typography>{item?.members?.length || 0}</Typography>
                          <Iconify 
                            icon="meteor-icons:plus" 
                            width={16} 
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction='row' justifyContent='flex-end'>
                          <IconButton
                            onClick={() => {
                              setDeskToEdit(item);
                              setOpenEdit(true);
                            }}
                            sx={{ "&:hover": { color: "primary.main" } }}
                          >
                            <Iconify icon="mage:edit" />
                          </IconButton>
                          {user?.acc?.acc_e_delete_desk === undefined ||
                          user?.acc?.acc_e_delete_desk ? (
                            <IconButton
                              onClick={() => {
                                setDeskToDelete(item);
                                setOpenDelete(true);
                              }}
                              sx={{ "&:hover": { color: "error.main" } }}
                            >
                              <Iconify icon="heroicons:trash" />
                            </IconButton>
                          ) : null}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>

        <Divider />
        <Stack
          sx={{
            flexDirection: { md: "row", xs: "column" },
            gap: 0,
            justifyContent: "flex-end",
            alignItems: { md: "center", xs: "start" },
          }}
        >
          <PageNumberSelect
            currentPage={currentPage}
            totalPage={desks?.length ? Math.ceil(desks?.length / perPage) : 0}
            onUpdate={setCurrentPage}
          />
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={desks?.length ?? 0}
            page={currentPage ?? 0}
            rowsPerPage={perPage ?? 10}
            onPageChange={(event, index) => setCurrentPage(index)}
            onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Stack>

        <EditDeskModal
          desk={deskToEdit}
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onGetDesks={onGetDesks}
        />

        <DeleteModal
          isOpen={openDelete}
          setIsOpen={() => setOpenDelete(false)}
          onDelete={deleteDesk}
          title={"Delete Desk"}
          description={"Are you sure you want to delete this desk?"}
        />
      </Box>

      <DeskAddMemberDrawer
        open={isOpenMemberDrawer}
        onClose={handleCloseDrawer}
        desk={selectedDesk}
        members={members}
        deskMembers={desks.find(d => d.id === selectedDesk?.id)?.members || []}
        onGetDeskMember={() => {
          onGetDesks();
          onGetDeskMember();
        }}
      />
    </>
  );
};

