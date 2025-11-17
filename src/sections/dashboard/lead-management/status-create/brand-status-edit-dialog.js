import { useState, useEffect } from "react";
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
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { brandsApi } from "src/api/lead-management/brand";
import CustomModal from "src/components/customize/custom-modal";
import { Scrollbar } from "src/components/scrollbar";
import { useDebounce } from "src/hooks/use-debounce";
import { BrandStatusItem } from "./brand-status-item";
import { Iconify } from 'src/components/iconify';

const labelValidation = yup.object({
  name: yup.string().required("Brand status name is a required field"),
});

export const BrandStatusEditDialog = (props) => {
  const {
    open,
    onClose,
    getStatusList,
    onGetStatuses = () => {},
    title = "Brand statuses",
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

  const [query, setQuery] = useState();
  const q = useDebounce(query, 300);

  const getStatuses = async () => {
    try {
      const params = {};
      if (q) {
        params.q = q;
      }
      const res = await brandsApi.getBrandStatuses(params);
      setStatusData(res?.status);
      // setTotalCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getStatuses();
  }, [q]);

  const onStatusSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await brandsApi.createBrandStatus(data);
      const newData = [...statusData];
      newData.push(result?.status);
      setStatusData(newData);
      getStatusList();
      setIsLoading(false);
      setTimeout(() => onGetStatuses(), 1500);
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
              Add Brand Status
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
                  <TableCell>Brand status name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statusData?.map((status) => (
                  <BrandStatusItem
                    key={status?.id}
                    status={status}
                    deleteStatuses={(id) => {
                      const newData = statusData?.filter(
                        (status) => status?.id !== id
                      );
                      setStatusData(newData);
                      getStatusList();
                      setTimeout(() => onGetStatuses(), 1500);
                    }}
                    updateStatuses={(data) => {
                      const newData = [...statusData];
                      newData.forEach((item) => {
                        if (item?.label?.id === data?.id) {
                          item.label = data;
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
              {"Create new Brand status"}
            </Typography>
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                error={!!labelErrors?.name?.message}
                helperText={labelErrors?.name?.message}
                label="Status name"
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
