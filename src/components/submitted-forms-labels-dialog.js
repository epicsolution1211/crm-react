import { useState, useEffect } from "react";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CustomModal from "src/components/customize/custom-modal";
import { Scrollbar } from "./scrollbar";
import { SubmittedFormsLabelItem } from "./submitted-forms-label-item";
import { submittedFormsApi } from "src/api/submitted-forms";
import { useDebounce } from "../hooks/use-debounce";
import { Iconify } from "src/components/iconify";

const labelValidation = yup.object({
  name: yup.string().required("Label name is a required field"),
});

export const SubmittedFormsLabelsDialog = (props) => {
  const {
    open,
    onClose,
    brands,
    internalBrandId,
    onGetLabels = () => { },
    title = "",
  } = props;

  const {
    register: labelRegister,
    handleSubmit: labelHandleSubmit,
    formState: { errors: labelErrors },
    reset: labelReset,
    setValue,
    watch,
  } = useForm({ resolver: yupResolver(labelValidation) });

  const [openLabelAddModal, setOpenLabelAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const [labelData, setLabelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [query, setQuery] = useState();
  const q = useDebounce(query, 300);

  const getLabels = async () => {
    try {
      const params = {
        page: currentPage + 1,
        per_page: perPage,
      };
      if (q) {
        params.search = q;
      }
      params.active_only = String(isActive);
      const res = await submittedFormsApi.getSubmittedFormsLabels(params);
      setLabelData(res?.labels);
      setTotalCount(res?.pagination?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getLabels();
  }, [currentPage, perPage, q, isActive]);

  useEffect(() => {
    if (selectedLabel) {
      setValue('name', selectedLabel?.name);
      setValue('description', selectedLabel?.description);
      setValue('color', selectedLabel?.color);
      setValue('active', selectedLabel?.active);
    }
  }, [selectedLabel]);

  const onLabelSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (selectedLabel) {
        await submittedFormsApi.updateSubmittedFormsLabel({ ...data, id: selectedLabel?.id });
      } else {
        await submittedFormsApi.createSubmittedFormsLabel({ ...data, internal_brand_id: internalBrandId });
      }
      setIsLoading(false);
      setOpenLabelAddModal(false);
      toast.success(`${selectedLabel ? 'Label updated successfully' : 'Label created successfully'}`);
      setTimeout(() => onGetLabels(), 1500);
      getLabels();
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
      toast.error(`${error?.response?.data?.message ?? `Failed to ${selectedLabel ? 'update' : 'create'} label`}`);
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
                setSelectedLabel(null);
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
              <Iconify icon="lucide:search" />
              <Box sx={{ flexGrow: 1 }}>
                <Input
                  value={query}
                  onChange={(event) => setQuery(event?.target?.value)}
                  disableUnderline
                  fullWidth
                  placeholder="Enter a keyword"
                />
              </Box>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography>Active : </Typography>
                <Switch
                  checked={isActive}
                  onChange={(event) => setIsActive(event?.target?.checked)}
                />
              </Stack>
            </Stack>
          </Card>
          <Scrollbar>
            <Table fullWidth>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Color
                  </TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {labelData?.map((label) => (
                  <SubmittedFormsLabelItem
                    key={label.id}
                    label={label}
                    brands={brands}
                    setSelectedLabel={setSelectedLabel}
                    deleteLabels={() => {
                      onGetLabels();
                      getLabels();
                    }}
                    updateLabels={(label) => {
                      setSelectedLabel(label);
                      setOpenLabelAddModal(true);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
          <Divider />
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
            rowsPerPageOptions={[5, 10, 20]}
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
              {selectedLabel ? "Edit Label" : "Create New Label"}
            </Typography>
            <Stack sx={{ py: 2 }} direction="column" justifyContent="start" gap={2}>
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
              <TextField
                fullWidth
                label="Label description"
                name="description" 
                type="text"
                {...labelRegister("description")}
                multiline
                rows={4}
              />
              <Stack sx={{ gap: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography>Label color : </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                  >
                    <label
                      htmlFor="color">
                      <Chip
                        label={watch('color') ?? 'Default'}
                        color='primary'
                        sx={{ backgroundColor: watch('color') ?? "", cursor: 'pointer' }} />
                    </label>
                    <input
                      style={{ visibility: 'hidden', width: '0px', height: '0px' }}
                      id="color"
                      type="color"
                      {...labelRegister('color')}
                    />
                  </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <Typography>Active : </Typography>
                  <Switch
                    {...labelRegister('active')}
                    defaultChecked={true}
                  />
                </Stack>
              </Stack>
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <LoadingButton loading={isLoading} disabled={isLoading} variant="contained" type="submit">
                {selectedLabel ? "Update" : "Create"}
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
