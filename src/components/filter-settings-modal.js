import { useState, useEffect } from "react";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import Divider from "@mui/material/Divider";
import { useForm } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomModal from "src/components/customize/custom-modal";
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "./scrollbar";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { userApi } from "src/api/user";
import { getAssetPath } from "src/utils/asset-path";

const validationSchema = yup.object({
  name: yup.string().required("Filter name is required filed"),
});

const filterValidationSchema = yup.object({
  filter: yup.string().required("Filter character is required filed"),
});

export const FilterModal = ({
  open,
  onClose,
  filters,
  currentValue,
  variant,
  isFilter,
  searchSetting = {},
  accountId,
  setSelectedValue,
  customFields,
  filterList,
  getUserInfo
}) => {

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const {
    handleSubmit: handleFilterSubmit,
    register: filterRegister,
    setValue: filterSetValue,
    formState: { errors: filterErrors, isSubmitting: isFilterSubmitting },
  } = useForm({ resolver: yupResolver(filterValidationSchema) });

  const [addModal, setAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(undefined);

  const [savedFilters, setSavedFilters] = useState([]);
  const [importFilter, setImportFilter] = useState(false);

  useEffect(() => {
    if (variant && searchSetting) {
      setSavedFilters(searchSetting[variant] ?? []);
    }
  }, [searchSetting, variant]);

  const handleUpdateFilter = async (newFilter, isUpdate) => {
    try {
      let result = [];
      if (isUpdate) {
        result = savedFilters?.map((item) => {
          if (item?.filter_id === newFilter?.filter_id) {
            return newFilter;
          }
          return item;
        })
      } else {
        result = [...savedFilters, newFilter];
      }

      await userApi.updateUser(accountId, {
        search_setting: {
          ...searchSetting,
          [variant]: result,
        },
      });
      setSavedFilters(result);

      toast.success("Filter successfully saved!");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const onSubmit = async (data) => {
    const updatedFilters = { ...filters };

    const newFilter = {
      id: uuid4(),
      name: data.name,
      filter: updatedFilters,
      customFields,
    };
    if (selectedFilter) {
      const res = await userApi.createFilter({ setting: JSON.stringify(selectedFilter) });
      if (res) {
        await handleUpdateFilter({
          id: selectedFilter?.id,
          name: data.name,
          filter: isFilter ? updatedFilters : selectedFilter?.filter,
          customFields: isFilter ? customFields : selectedFilter?.customFields,
          filter_id: selectedFilter?.filter_id,
        }, true);
      }
    } else {
      const res = await userApi.createFilter({ setting: JSON.stringify(newFilter) });
      if (res) {
        await handleUpdateFilter({ ...newFilter, filter_id: res?.filter?.filter_id });
      }
    }
    setAddModal(false);
  };

  const onFilterSubmit = async (data) => {
    const character = data.filter.split("-");
    if (character.length > 1) {
      const importVariant = character[0];
      if (importVariant !== variant) {
        toast.error("Invalid filter characters!");
        return;
      }
      const filter_id = character[1];
      const res = await userApi.getFilter({ filter_id });
      if (res) {
        const savedFilter = JSON.parse(res?.filter?.setting);
        if (filterList?.find(item => item.filter_id == filter_id)) {
          toast("This filter already exists!");
        }
        else await handleUpdateFilter({ ...savedFilter, filter_id });
        getUserInfo();
        setImportFilter(false);
      } else {
        toast.error("Invalid filter characters!");
      }
    } else {
      toast.error("Invalid filter characters!");
    }
  };

  const handleDeleteFilter = async (filter_id) => {
    const updatedFilter = [...savedFilters]?.filter((item) => item?.filter_id !== filter_id);
    await userApi.updateUser(accountId, {
      search_setting: {
        ...searchSetting,
        [variant]: updatedFilter,
      },
    });
    setSavedFilters(updatedFilter);
    toast.success("Filter successfully deleted!");
    getUserInfo();
  };

  const handleShareFilter = (filter) => {
    let sharingFilter = "";

    sharingFilter = `${variant}-${filter?.filter_id}`;

    copyToClipboard(sharingFilter, "Sharing filter copied to clipboard!");
  };

  const handleSelectFilter = (id, name) => {
    setSelectedValue({ id, name });
    onClose();
  };

  useEffect(() => {
    setValue("currentFilter", "none");
  }, [open, currentValue]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack mt={2} py={3} direction="row" justifyContent="center">
        <Typography variant="h5">Search Filter Templates</Typography>
      </Stack>
      <Stack sx={{ py: 2, px: 4 }} spacing={1} justifyContent="center">
        <Scrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 50 }}>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell sx={{ width: 120 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 500, pl: 1 }}>
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savedFilters?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Stack>
                      <Typography
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSelectFilter(item?.id, item?.name)}
                      >
                        {item?.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" gap={1}>
                      <Tooltip title="Update">
                        <IconButton
                          onClick={() => {
                            setValue("name", item?.name);
                            setAddModal(true);
                            setSelectedFilter(item);
                          }}
                          sx={{ '&:hover': { color: 'primary.main' } }}
                        >
                          <Iconify icon="mage:edit" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton
                          onClick={() => {
                            handleShareFilter(item);
                          }}
                          sx={{ '&:hover': { color: 'primary.main' } }}
                        >
                          <Iconify icon="teenyicons:share-outline" width={24} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => {
                            handleDeleteFilter(item?.filter_id);
                          }}
                          sx={{ '&:hover': { color: 'error.main' } }}
                        >
                          <Iconify icon="clarity:trash-line" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {savedFilters?.length ? null : (
            <>
              <Box
                sx={{
                  py: 5,
                  maxWidth: 1,
                  alignItems: "center",
                  display: "flex",
                  flexGrow: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={getAssetPath('/assets/errors/error-404.png')}
                  sx={{
                    height: "auto",
                    maxWidth: 100,
                  }}
                />
                <Typography
                  color="text.secondary"
                  sx={{ mt: 2 }}
                  variant="subtitle1"
                >
                  No Saved Filter
                </Typography>
              </Box>
              <Divider />
            </>
          )}
        </Scrollbar>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        px={5}
        py={3}
        gap={2}
      >
        <Stack direction="row" gap={2}>
          <Button
            variant="contained"
            onClick={() => {
              if (isFilter) {
                setValue("name", "");
                setSelectedFilter(undefined);
                setAddModal(true);
              } else {
                toast.error("There is not filter in table yet.");
              }
            }}
          >
            Save new
          </Button>
          <Button
            variant="outlined"
            type="submit"
            onClick={() => {
              filterSetValue("filter", "");
              setImportFilter(true);
            }}
          >
            Import Filter
          </Button>
        </Stack>
        <Stack direction="row" gap={2}>
          <Button variant="outlined" onClick={() => onClose()}>
            Cancel
          </Button>
        </Stack>
      </Stack>
      <CustomModal
        onClose={() => {
          setAddModal(false);
        }}
        open={addModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              {selectedFilter ? "Update Saved Filter" : "Create New Filter"}
            </Typography>
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                error={!!errors?.name?.message}
                helperText={errors?.name?.message}
                label="Filter Name"
                name="name"
                type="text"
                {...register("name")}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ width: 90 }}>
                {selectedFilter ? "Update" : "Save"}
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={() => {
                  setAddModal(false);
                }}
                sx={{ width: 90 }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
      <CustomModal
        onClose={() => {
          setImportFilter(false);
        }}
        open={importFilter}
      >
        <form onSubmit={handleFilterSubmit(onFilterSubmit)}>
          <Stack direction="column" gap={1}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              Import shared filter
            </Typography>
            <Stack direction="row" gap={1} alignItems="center" sx={{ px: 2 }}>
              <Iconify icon="lucide:info" width={18} sx={{ flexShrink: 0 }}/>
              <Typography variant="body2" color="text.secondary">
                Please enter the shared filter code that was provided to you.
              </Typography>
            </Stack>
            <TextField
              fullWidth
              autoFocus
              error={!!filterErrors?.filter?.message}
              helperText={filterErrors?.filter?.message}
              label="Shared filter characters" 
              name="name"
              type="text"
              sx={{ my: 2 }}
              {...filterRegister("filter")}
            />
            <Stack direction="row" spacing={2} justifyContent="center">
              <LoadingButton loading={isFilterSubmitting} variant="contained" type="submit" sx={{ width: 90 }}>
                Save
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={() => {
                  setImportFilter(false);
                  filterSetValue("filter", "");
                }}
                sx={{ width: 90 }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
    </Dialog>
  );
};
