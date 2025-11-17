import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CustomModal from "src/components/customize/custom-modal";
import { LabelItem } from "./label-item";
import { Scrollbar } from "./scrollbar";
import { customersApi } from "../api/customers";
import { useDebounce } from "../hooks/use-debounce";
import { useGetCustomerLabels } from "src/api-swr/customer";
import { useGetCustomerTeams } from "src/api-swr/customer";
import { Iconify } from "src/components/iconify";

const labelValidation = yup.object({ name: yup.string().required("Label name is a required field")});

export const LabelsDialog = ({ open, onClose, title = "Customer labels", getLabelList = () => { } }) => {

  const {
    register: labelRegister,
    handleSubmit: labelHandleSubmit,
    formState: { errors: labelErrors },
    reset: labelReset,
  } = useForm({ resolver: yupResolver(labelValidation) });

  const { teamList } = useGetCustomerTeams();

  const [openLabelAddModal, setOpenLabelAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState();
  const q = useDebounce(query, 300);

  const { labelInfo, totalCount, mutate } = useGetCustomerLabels({ page: currentPage + 1, per_page: perPage, q });
  const { mutate: mutateAll } = useGetCustomerLabels();

  const onLabelSubmit = async (data) => {
    try {
      setIsLoading(true);
      await customersApi.createCustomerLabel(data);
      setTimeout(() => {
        getLabelList();
      }, 1000);
      setTimeout(async () => {
        await mutate();
        await mutateAll();
      }, 1500);
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setIsLoading(false);
      setOpenLabelAddModal(false);
    }
  };

  return (
    <>
      <Dialog open={open ?? false} onClose={onClose} fullWidth>
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
                setOpenLabelAddModal(true);
                labelReset();
              }}
              startIcon={<Iconify icon="si:add-fill" width={22} />}
              variant="contained"
            >
              Add Label
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
              <Iconify icon="lucide:search" width={24} />
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
                  <TableCell>Label name</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Label color</TableCell>
                  <TableCell>Team access</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {labelInfo?.map(({ label }) => (
                  <LabelItem
                    key={label.id}
                    label={label}
                    teams={teamList?.filter((item) => item?.value !== "_empty")}
                    mutate={mutate}
                    mutateAll={mutateAll}
                    getLabelList={getLabelList}
                  />
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
      <CustomModal
        onClose={() => setOpenLabelAddModal(false)}
        open={openLabelAddModal}
      >
        <form onSubmit={labelHandleSubmit(onLabelSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              {"Create new Label"}
            </Typography>
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                error={!!labelErrors?.name?.message}
                helperText={labelErrors?.name?.message}
                label="Label name"
                name="name"
                type="text"
                {...labelRegister("name")}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <LoadingButton loading={isLoading} variant="contained" type="submit">Create</LoadingButton>
              <Button
                variant="outlined"
                onClick={() => setOpenLabelAddModal(false)}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
    </>
  );
};
