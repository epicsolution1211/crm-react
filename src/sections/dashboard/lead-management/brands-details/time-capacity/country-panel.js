import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CustomModal from "src/components/customize/custom-modal";
import { DeleteModal } from "src/components/customize/delete-modal";
import { brandsApi } from "src/api/lead-management/brand";
import { useAuth } from "src/hooks/use-auth";
import { Iconify } from "src/components/iconify";

const validationSchema = yup.object({
  name: yup.string().required("Time and Capacity name is a required field"),
});

const CountryPanel = ({
  timeCapacity,
  selectedCountry,
  setSelectedCountry,
  brandId,
  createTimeCapacity,
  updateTimeCapacity,
  getTimeCapacity,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState();

  const onSubmit = (data) => {
    setIsLoading(true);
    if (selectedItem) {
      updateTimeCapacity(selectedItem, data);
    } else {
      createTimeCapacity({ ...data, brand_id: brandId });
    }
    setModalOpen(false);
    setIsLoading(false);
    reset();
  };

  const deleteTimeCapacity = async (id) => {
    try {
      await brandsApi.deleteTimeCapacities(id);
      getTimeCapacity();
      toast("Time & Capacity successfully deleted!");
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <>
      <Grid xs={12} lg={3} sx={{ mt: 2 }}>
        <Stack spacing={1}>
          <List>
            <Stack spacing={1}>
              {timeCapacity?.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ gap: 2 }}>
                  <Grid container xs={12} lg={12}>
                    <Grid gap={2} lg={8} xs={11}>
                      <ListItemButton
                        sx={{
                          borderRadius: 1,
                          color: "text.secondary",
                          flexGrow: 1,
                          fontSize: (theme) => theme.typography.button.fontSize,
                          fontWeight: (theme) =>
                            theme.typography.button.fontWeight,
                          justifyContent: "flex-start",
                          lineHeight: (theme) =>
                            theme.typography.button.lineHeight,
                          py: 1,
                          px: 2,
                          textAlign: "left",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                          ...(selectedCountry?.id === item?.id && {
                            backgroundColor: "action.selected",
                            color: "text.primary",
                          }),
                        }}
                        onClick={() => setSelectedCountry(item)}
                      >
                        <Box sx={{ flexGrow: 1 }}>{item?.name}</Box>
                      </ListItemButton>
                    </Grid>
                    <Grid lg={2} xs={1}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 1,
                          paddingLeft: 5,
                        }}
                      >
                        {!item?.default && (
                          <>
                            <IconButton
                              onClick={() => {
                                setValue("name", item?.name);
                                setSelectedItem(item?.id);
                                setModalOpen(true);
                                setSelectedCountry(item);
                              }}
                            >
                              <EditNoteIcon fontSize="medium" color="primary" />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setSelectedCountry(item);
                                setSelectedItem(item?.id);
                                setDeleteModalOpen(true);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <DeleteOutlineIcon
                                fontSize="small"
                                color="error"
                              />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </Stack>
          </List>
          {user?.acc?.acc_e_lm_brand ? (
            <Box sx={{ mt: 1, px: 1 }}>
              <Button
                size="medium"
                startIcon={<Iconify icon="lucide:plus" width={24} />}
                variant="contained"
                onClick={() => {
                  setModalOpen(true);
                  setSelectedItem("");
                }}
              >
                Add
              </Button>
            </Box>
          ) : null}
        </Stack>
      </Grid>
      <CustomModal
        onClose={() => {
          setModalOpen(false);
          reset();
        }}
        open={modalOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              {selectedItem
                ? "Update Time and Capacity?"
                : "Create new Time and Capacity?"}
            </Typography>
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                error={!!errors?.name?.message}
                helperText={errors?.name?.message}
                label="Time and Capacity Name"
                name="name"
                type="text"
                {...register("name")}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button disabled={isLoading} variant="contained" type="submit">
                {selectedItem ? "Update" : "Create"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setModalOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={() => deleteTimeCapacity(selectedItem)}
        title="Delete Time & Capacity"
        description="Are you sure you want to delete this Time?"
      />
    </>
  );
};

export default CountryPanel;
