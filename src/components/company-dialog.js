import { useState, useEffect } from "react";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import CustomModal from "src/components/customize/custom-modal";
import { Scrollbar } from "./scrollbar";
import { customersApi } from "src/api/customers";
import { useDebounce } from "src/hooks/use-debounce";
import { Iconify } from "src/components/iconify";
import { ConfirmDialog } from "src/components/confirm-dialog-2";

const validationSchema = yup.object({
  name: yup.string().required("Company name is a required field"),
});

export const CompanyDialog = (props) => {
  const { open, onClose, title = "Edit Company", handleChange, onGetCompanies = () => { } } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [companyList, setCompanyList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [query, setQuery] = useState();
  const q = useDebounce(query, 300);

  const [selectedCompany, setSelectedCompany] = useState();

  const getCompany = async () => {
    try {
      const params = {
        per_page: perPage,
        page: currentPage + 1,
        q: q?.length ? q : null,
      };
      const res = await customersApi.getClientCompanies(params);
      setCompanyList(res?.companies);
      setTotalCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (selectedCompany) {
        await customersApi.updateClientCompanies(selectedCompany?.id, data);
      } else {
        await customersApi.createClientCompanies(data);
      }
      handleChange();
      setIsLoading(false);
      toast.success(
        selectedCompany
          ? "Company successfully updated!"
          : "Company successfully created!"
      );
      setTimeout(() => {
        onGetCompanies();
        getCompany();
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
    setOpenEditModal(false);
  };

  const deleteCompany = async () => {
    try {
      setIsDeleting(true);
      await customersApi.deleteClientCompanies(selectedCompany?.id);
      getCompany();
      handleChange();
      toast.success("Company successfully deleted!");
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setIsDeleting(false);
    }
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    getCompany();
  }, [currentPage, perPage, q]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <Container maxWidth="sm">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            py={3}
            mt={1}
          >
            <Typography variant="h5">{title}</Typography>
            <Button
              onClick={() => {
                setSelectedCompany(undefined);
                setOpenEditModal(true);
                reset();
              }}
              startIcon={<Iconify icon="si:add-fill" width={22} />}
              variant="contained"
            >
              Add Company
            </Button>
          </Stack>
          <Divider />
          <Card>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ p: 2 }}
            >
              <Iconify icon="lucide:search" width={22} />
              <Box sx={{ flexGrow: 1 }}>
                <Input
                  value={query}
                  onChange={(event) => setQuery(event?.target?.value)}
                  disableUnderline
                  fullWidth
                  placeholder="Enter a keyword"
                />
              </Box>
            </Stack>
          </Card>
          <Scrollbar>
            <Table fullWidth>
              <TableHead>
                <TableRow>
                  <TableCell align="center">No</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companyList?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{item?.name}</TableCell>
                    <TableCell>
                      <Stack direction="row" gap={1} justifyContent="center">
                        <IconButton
                          onClick={() => {
                            setOpenEditModal(true);
                            setSelectedCompany(item);
                            setValue("name", item?.name);
                          }}
                          size="small"
                        >
                          <Tooltip title="Edit">
                            <Iconify icon="mage:edit" sx={{ color: 'primary.main' }} />
                          </Tooltip>
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setSelectedCompany(item);
                          }}
                          size="small"
                        >
                          <Tooltip title="Delete">
                            <Iconify icon="heroicons:trash" sx={{ color: 'error.main' }} />
                          </Tooltip>
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={totalCount ?? 0}
            onPageChange={(event, index) => {
              setCurrentPage(index);
            }}
            onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
            page={currentPage ?? 0}
            rowsPerPage={perPage ?? 5}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          />
        </Container>
      </Dialog>

      <CustomModal onClose={() => setOpenEditModal(false)} open={openEditModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              {"Create new Company"}
            </Typography>
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                error={!!errors?.name?.message}
                helperText={errors?.name?.message}
                label="Company Name"
                name="name"
                type="text"
                {...register("name")}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button disabled={isLoading} variant="contained" type="submit">
                {selectedCompany ? "Update" : "Create"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenEditModal(false)}
              >
                {" "}
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>

      {openDeleteModal && (
        <ConfirmDialog
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)} 
          title="Delete Company"
          description="Are you sure you want to delete this Company?"
          confirmAction={deleteCompany}
          isLoading={isDeleting}
        />
      )}
    </>
  );
};
