import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import { LoadingButton } from '@mui/lab';
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuid4 } from "uuid";

import { Iconify } from 'src/components/iconify';
import { customerFieldsApi } from "src/api/customer-fields";
import CustomModal from "src/components/customize/custom-modal";
import { DeleteModal } from "src/components/customize/delete-modal";
import { Scrollbar } from "src/components/scrollbar";

const validationSchema = yup.object({
  name: yup.string().required("Name is a required field"),
});

export const CustomFieldsEditModal = ({ open, onClose, onGetFields }) => {
  const [fields, setFields] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [createFieldModalOpen, setCreateFieldModalOpen] = useState(false);
  const [fieldType, setFieldType] = useState();
  const [fieldOptions, setFieldOptions] = useState([
    {
      id: uuid4(),
      option: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const deFieldValue = {
    text: 1,
    number: 2,
    multi_choice: 3,
    multi_choice_radio: 3,
    boolean: 4,
  };

  const getCustomFields = async () => {
    try {
      const { client_fields } = await customerFieldsApi.getCustomerFields();
      setFields(client_fields);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const containsOnlyLettersAndSpaces = (inputString) => {
    var pattern = /^[a-zA-Z0-9\s]+$/;
    return pattern.test(inputString);
  };

  const onCustomerFieldSubmit = async (data) => {
    try {
      setIsLoading(true);
      const fieldTypeValue = {
        1: "text",
        2: "number",
        3: "multi_choice",
        4: "boolean",
      };

      if (!containsOnlyLettersAndSpaces(data?.name)) {
        toast.error("Field name should not contain symbols!");
        return;
      }

      const request = {
        value: data.name.replace(/\s+/g, "_"),
        friendly_name: data.name,
        field_type: fieldType === 3 ? data?.multi_choice_radio ? "multi_choice" : "multi_choice_radio" : fieldTypeValue[fieldType],
        sync_lead: data.sync_lead,
      };

      if (fieldType === 3) {
        const filteredOptions = fieldOptions.filter(option => option.option.trim() !== "");
        request["setting"] = JSON.stringify(filteredOptions);
      }

      if (selectedField) {
        await customerFieldsApi.updateCustomerField(selectedField, request);
      } else {
        await customerFieldsApi.createCustomerField(request);
      }
      setTimeout(() => {
        onGetFields();
        getCustomFields();
      }, 1500);
      toast.success(
        selectedField
          ? "Custom field successfully updated!"
          : "Customer field successfully created!"
      );
      reset();
      setFieldType(1);
      setFieldOptions([]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
    setCreateFieldModalOpen(false);
    setSelectedField(null);
  };

  const handleAddOption = () => {
    const newOption = { option: "", id: uuid4() };
    setFieldOptions((prev) => [...prev, newOption]);
    
    // Scroll to the bottom of the options list after a short delay to ensure DOM update
    setTimeout(() => {
      const scrollableElement = document.querySelector('[data-testid="options-scrollbar"] .simplebar-content-wrapper');
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }
    }, 100);
  };

  const handleChangeField = (e, id, type = "option") => {
    e.preventDefault();

    if (type === "option") {
      const value = e?.target?.value.replace(/[^a-zA-Z0-9\s]/g, '');
      setFieldOptions(
        fieldOptions.map((option) => {
          if (id === option?.id) {
            return {
              ...option,
              option: value,
            };
          } else {
            return option;
          }
        })
      );
    } else {
      setFieldOptions(
        fieldOptions.map((option) => {
          if (id === option?.id) {
            return {
              ...option,
              color: e?.target?.value,
            };
          } else {
            return option;
          }
        })
      );
    }
  };

  useEffect(() => {
    getCustomFields();
  }, []);

  const handleChangeFieldType = (e) => setFieldType(e?.target?.value);

  const handleDeleteField = async () => {
    setDeleteLoading(true);
    try {
      await customerFieldsApi.deleteCustomerField(selectedField);
      setTimeout(() => {
        onGetFields();
        getCustomFields();
      }, 1500);
      setDeleteModalOpen(false);
      toast.success("Custom field successfully deleted!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setDeleteLoading(false);
      setSelectedField(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm">
        <Typography
          id="modal-modal-title"
          align="center"
          sx={{ fontSize: 22, fontWeight: "bold", my: 4, pt: 1 }}
        >
          Edit custom fields
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "100px" }}>No</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", width: "500px" }}>
                Field Name
              </TableCell>
              <TableCell sx={{ width: "200px" }}>Action</TableCell>
            </TableRow>
          </TableHead>
        </Table>
        <Scrollbar sx={{ maxHeight: 500 }}>
          <Table fullWidth>
            <TableBody>
              {fields?.map((field, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ width: "100px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", width: "500px" }}>
                    {field?.friendly_name}
                  </TableCell>
                  <TableCell sx={{ width: "200px" }}>
                    <Stack direction="row" gap={1}>
                      <IconButton
                        onClick={() => {
                          setFieldType(deFieldValue[field.field_type]);
                          if (field.setting) {
                            const setting = JSON.parse(field.setting);
                            setFieldOptions(setting);
                          }
                          setSelectedField(field?.id);
                          setValue("name", field?.friendly_name);
                          setValue("sync_lead", field?.sync_lead);
                          if (field?.field_type === "multi_choice_radio") {
                            setValue("multi_choice_radio", false);
                          }
                          if (field?.field_type === "multi_choice") {
                            setValue("multi_choice_radio", true);
                          }
                          setCreateFieldModalOpen(true);
                        }}
                        sx={{ '&:hover': { color: 'primary.main' }}}
                      >
                        <Iconify icon="mage:edit"/>
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedField(field?.id);
                          setDeleteModalOpen(true);
                        }}
                        sx={{ '&:hover': { color: 'primary.main' }}}
                      >
                        <Iconify icon="heroicons:trash" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>

        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ py: 4 }}
          spacing={2}
        >
          <Button
            variant="contained"
            onClick={() => {
              setCreateFieldModalOpen(true);
              reset();
              setSelectedField(null);
              setFieldType(1);
              setFieldOptions([
                {
                  id: uuid4(),
                  option: "",
                },
              ]);
            }}
          >
            + Add
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </Container>

      <DeleteModal
        isLoading={deleteLoading}
        isOpen={deleteModalOpen}
        setIsOpen={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteField}
        title={"Delete Custom Field"}
        description={"Are you sure you want to delete this custom field?"}
      />

      <CustomModal
        onClose={() => {
          setCreateFieldModalOpen(false);
          reset();
        }}
        open={createFieldModalOpen}
      >
        <form onSubmit={handleSubmit(onCustomerFieldSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              {selectedField
                ? "Update Custom Field"
                : "Create Custom Field"}
            </Typography>
            <Stack>
              <Stack>
                <Stack sx={{ pb: 2 }} spacing={1} justifyContent="center">
                  <Typography>Name</Typography>
                  <TextField
                    fullWidth
                    autoFocus
                    InputLabelProps={{ shrink: true }}
                    error={!!errors?.name?.message}
                    helperText={errors?.name?.message}
                    label="Name"
                    name="name"
                    type="text"
                    {...register("name")}
                  />
                </Stack>
                <Controller
                  name="sync_lead"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      sx={{ userSelect: "none" }}
                      control={
                        <Checkbox
                          checked={value}
                          onChange={(event) => onChange(event?.target?.checked)}
                        />
                      }
                      label="Sync with upcoming lead"
                    />
                  )}
                />
                {!selectedField && fieldType === 3 ? (
                  <Controller
                    name="multi_choice_radio"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        sx={{ userSelect: "none" }}
                        control={
                          <Checkbox
                            checked={value}
                            onChange={(event) =>
                              onChange(event?.target?.checked)
                            }
                          />
                        }
                        label="Multi-choice dropdown"
                      />
                    )}
                  />
                ) : null}
              </Stack>
            </Stack>
            {!selectedField && (
              <Stack sx={{ pb: 2 }} spacing={1} justifyContent="center">
                <Typography>Type</Typography>
                <Select
                  value={fieldType}
                  onChange={handleChangeFieldType}
                  sx={{ width: "100%" }}
                >
                  <MenuItem value={1}>Text</MenuItem>
                  <MenuItem value={2}>Number</MenuItem>
                  <MenuItem value={3}>Dropdown</MenuItem>
                  <MenuItem value={4}>Switch</MenuItem>
                </Select>
              </Stack>
            )}
            {fieldType === 3 && (
              <Stack spacing={2} gap={1}>
                <Typography variant={"h6"}>{!selectedField ? "Create" : "Edit"} options:</Typography>
                <Scrollbar sx={{ maxHeight: "175px" }} data-testid="options-scrollbar">
                  <Stack spacing={1}>
                    {fieldOptions?.map((option, index) => (
                      <Stack direction="row" spacing={1} key={option?.id}>
                        <OutlinedInput
                          value={option.option}
                          placeholder={`Option ${index + 1}`}
                          onChange={(e) => handleChangeField(e, option?.id)}
                          sx={{ width: "100%" }}
                        />
                        <Stack direction="row" alignItems="center" gap={1}>
                          <label htmlFor={option.id}>
                            <Chip
                              label={option?.color ?? "Default"}
                              color="primary"
                              sx={{ backgroundColor: option?.color ?? "" }}
                            />
                          </label>
                          <input
                            style={{
                              visibility: "hidden",
                              width: "0px",
                              height: "0px",
                            }}
                            id={option.id}
                            type="color"
                            onChange={(e) =>
                              handleChangeField(e, option?.id, "color")
                            }
                          />
                        </Stack>
                        {index !== 0 && (
                          <IconButton
                            onClick={() =>
                              setFieldOptions(
                                fieldOptions?.filter(
                                  (opt) => opt?.id !== option?.id
                                )
                              )
                            }
                            sx={{ '&:hover': { color: 'primary.main' }}}
                          >
                            <Iconify icon="gravity-ui:xmark" />
                          </IconButton>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </Scrollbar>
                <Button variant={"contained"} onClick={handleAddOption}>
                  + Add
                </Button>
              </Stack>
            )}
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <LoadingButton variant="contained" type="submit" loading={isLoading}>
                {selectedField ? "Update" : "Create"}
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={() => {
                  setCreateFieldModalOpen(false);
                }}
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
