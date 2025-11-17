import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";

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
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { Iconify } from 'src/components/iconify';
import { useDebounce } from "src/hooks/use-debounce";
import { Scrollbar } from "src/components/scrollbar";
import CustomModal from "src/components/customize/custom-modal";
import { CurrencyItem } from "./currency-item";
import { thunks } from "src/thunks/currency";

const validation = yup.object({
  name: yup.string().required("Currency name is a required field"),
});

export const CurrencyModal = ({ open, onClose, title = "Currency" }) => {
  const dispatch = useDispatch();
  const {
    register: labelRegister,
    handleSubmit: labelHandleSubmit,
    formState: { errors: labelErrors },
    reset: labelReset,
  } = useForm({ resolver: yupResolver(validation) });

  const currencies = useSelector((state) => state.currency.currencies);
  const totalCount = useSelector((state) => state.currency.totalCount);

  const [openLabelAddModal, setOpenLabelAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [query, setQuery] = useState();
  const q = useDebounce(query, 300);

  const getCurrencies = () => {
    const params = {
      page: currentPage + 1,
      per_page: perPage,
    };
    if (q) {
      params.q = q;
    }
    dispatch(thunks.getCurrencies(params));
  };

  useEffect(() => {
    getCurrencies();
  }, [currentPage, perPage, q]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      dispatch(thunks.createCurrency(data));
      setIsLoading(false);
      setTimeout(() => getCurrencies(), 1000);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
    setOpenLabelAddModal(false);
  };

  return (
    <>
      <Dialog open={open ?? false} onClose={onClose}>
        <Container sx={{ width: 500 }}>
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
              startIcon={<Iconify icon="lucide:plus" width={24} />}
              variant="contained"
            >
              Add Currency
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
          <Scrollbar>
            <Table fullWidth>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Currency Name</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currencies?.map((currency) => (
                  <CurrencyItem currency={currency} key={currency?.id} />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
          <TablePagination
            component="div"
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
        <form onSubmit={labelHandleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              {"Create new currency"}
            </Typography>
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                error={!!labelErrors?.name?.message}
                helperText={labelErrors?.name?.message}
                label="Currency name"
                name="name"
                type="text"
                {...labelRegister("name")}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button disabled={isLoading} variant="contained" type="submit">
                Create
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenLabelAddModal(false)}
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
