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
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomModal from "src/components/customize/custom-modal";
import { Scrollbar } from "./scrollbar";
import { useDebounce } from "../hooks/use-debounce";
import { auditLabelsApi } from "../api/payment_audit/labels";
import { AuditLabelItem } from "./audit-label-item";
import { Iconify } from "src/components/iconify";

const labelValidation = yup.object({
  name: yup.string().required("Label name is a required field"),
});

export const AuditLabelsDialog = (props) => {
  const {
    open,
    onClose,
    teams,
    getLabelList,
    onGetLabels = () => { },
    title = "Audit labels",
  } = props;

  const {
    register: labelRegister,
    handleSubmit: labelHandleSubmit,
    formState: { errors: labelErrors },
    reset: labelReset,
  } = useForm({ resolver: yupResolver(labelValidation) });

  const [openLabelAddModal, setOpenLabelAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [labelData, setLabelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [query, setQuery] = useState();
  const q = useDebounce(query, 300);

  const getLabels = async () => {
    try {
      const params = {
        page: currentPage + 1,
        per_page: perPage,
      };
      if (q) {
        params.q = q;
      }
      const res = await auditLabelsApi.getAuditLabels(params);
      setLabelData(res?.labels);
      setTotalCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getLabels();
  }, [currentPage, perPage, q]);

  const onLabelSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await auditLabelsApi.createAuditLabel(data);
      const newData = [...labelData];
      newData.push(result);
      setLabelData(newData);
      getLabelList();
      setIsLoading(false);
      setTimeout(() => onGetLabels(), 1500);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
    setOpenLabelAddModal(false);
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
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Label color
                  </TableCell>
                  <TableCell>Team access</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {labelData?.map(({ label }) => (
                  <AuditLabelItem
                    key={label.id}
                    label={label}
                    teams={teams}
                    deleteLabels={(id) => {
                      const newData = labelData?.filter(
                        ({ label }) => label?.id !== id
                      );
                      setLabelData(newData);
                      getLabelList();
                      setTimeout(() => onGetLabels(), 1500);
                    }}
                    updateLabels={(data) => {
                      const newData = [...labelData];
                      newData.forEach((item) => {
                        if (item?.label?.id === data?.id) {
                          item.label = data;
                        }
                      });
                      setLabelData(newData);
                      getLabelList(newData);
                      setTimeout(() => onGetLabels(), 1500);
                    }}
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
              <LoadingButton  loading={isLoading} disabled={isLoading} variant="contained" type="submit">
                Create
              </LoadingButton>
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
