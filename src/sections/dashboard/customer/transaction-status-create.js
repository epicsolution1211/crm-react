/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import CustomModal from "src/components/customize/custom-modal";
import { Scrollbar } from "src/components/scrollbar";
import { useDebounce } from "src/hooks/use-debounce";
import { customersApi } from "src/api/customers";
import { TransactionStatusItem } from "./transaction-status-item";
import { Iconify } from 'src/components/iconify';

const labelValidation = yup.object({
  status: yup.string().required("Status is a required field"),
});

export const TransactionStatusCreate = (props) => {
  const {
    open,
    onClose,
    getStatusList,
    onGetStatuses = () => {},
    title = "Transaction statuses",
  } = props;

  const {
    register: labelRegister,
    handleSubmit: labelHandleSubmit,
    formState: { errors: labelErrors },
    reset: labelReset,
  } = useForm({ resolver: yupResolver(labelValidation) });

  const [openStatusAddModal, setOpenStatusAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [statusData, setStatusData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [query, setQuery] = useState();
  const q = useDebounce(query, 300);

  const getStatuses = async () => {
    try {
      const params = {};
      if (q) {
        params.q = q;
      }
      const res = await customersApi.getTransactionStatuses(params);
      setStatusData(res?.status);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getStatuses();
  }, [currentPage, perPage, q]);

  const onStatusSubmit = async (data) => {
    try {
      setIsLoading(true);
      await customersApi.createTransactionStatus(data);
      setIsLoading(false);
      setTimeout(() => {
        onGetStatuses();
        getStatusList();
        getStatuses();
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
    setOpenStatusAddModal(false);
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
                setOpenStatusAddModal(true);
                labelReset();
              }}
              startIcon={<Iconify icon="lucide:plus" width={24} />}
              variant="contained"
            >
              Add Transaction Status
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
              <Iconify icon="lucide:search" color="text.secondary" width={24} />
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
          <Scrollbar sx={{ mb: 2 }}>
            <Table fullWidth>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statusData?.map((status) => (
                  <TransactionStatusItem
                    key={status?.id}
                    status={status}
                    deleteStatuses={(id) => {
                      const newData = statusData?.filter(
                        (status) => status?.id !== id,
                      );
                      setStatusData(newData);
                      getStatusList();
                      setTimeout(() => onGetStatuses(), 1500);
                    }}
                    updateStatuses={(data) => {
                      const newData = [...statusData];
                      newData.forEach((item) => {
                        if (item?.id === data?.id) {
                          item = data;
                        }
                      });
                      setStatusData(newData);
                      getStatusList(newData);
                      setTimeout(() => onGetStatuses(), 1500);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </Container>
      </Dialog>
      <CustomModal
        onClose={() => setOpenStatusAddModal(false)}
        open={openStatusAddModal}
      >
        <form onSubmit={labelHandleSubmit(onStatusSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              Create new transaction status
            </Typography>
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                error={!!labelErrors?.status?.message}
                helperText={labelErrors?.status?.message}
                label="Status"
                name="status"
                type="text"
                {...labelRegister("status")}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button disabled={isLoading} variant="contained" type="submit">
                Create
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenStatusAddModal(false)}
              >
                {" "}
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
    </>
  );
};
