import React, { useEffect } from "react";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "src/components/scrollbar";
import { customerFieldsApi } from "src/api/customer-fields";
import { statusApi } from "src/api/lead-management/status";
import { useState } from "react";

const validationSchema = yup.object({
  name: yup.string().required("Name is a required field"),
});

export const CustomerFieldUpdate = ({
  open,
  onClose = () => {},
  variant,
  fields,
  field = {},
  fieldId,
  fieldSetting,
  onSetList = () => {},
  onGetFields = () => {},
  getCustomFieldsDerived,
  onInitCustomFields = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const fieldTypeValue = {
    1: "text",
    2: "number",
    3: "multi_choice",
    4: "boolean",
  };

  const deFieldValue = {
    text: 1,
    number: 2,
    multi_choice: 3,
    multi_choice_radio: 3,
    boolean: 4,
  };

  const [fieldType, setFieldType] = useState("");
  const [fieldOptions, setFieldOptions] = useState([]);

  useEffect(() => {
    const currentFiled = fields?.find((item) => item?.id === fieldId);
    if (currentFiled) {
      setFieldType(deFieldValue[currentFiled.field_type]);
      if (fieldSetting) {
        const setting = JSON.parse(fieldSetting);
        setFieldOptions(setting);
      }
      setValue("name", currentFiled.friendly_name);
      setValue("sync_lead", currentFiled.sync_lead);
      if (currentFiled?.field_type === "multi_choice_radio") {
        setValue("multi_choice_radio", false);
      }
      if (currentFiled?.field_type === "multi_choice") {
        setValue("multi_choice_radio", true);
      }
    }
  }, [fields, variant]);

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

  const onCustomerFieldSubmit = async (data) => {
    try {
      setIsLoading(true);
      const request = {
        value: data.name.replace(/\s+/g, "_"),
        friendly_name: data.name,
        field_type: fieldType === 3 ? data?.multi_choice_radio ? "multi_choice": "multi_choice_radio" : fieldTypeValue[fieldType],
      };
      request.sync_lead = data.sync_lead;

      if (fieldType === 3) {
        const filteredOptions = fieldOptions.filter(option => option.option.trim() !== "");
        request["setting"] = JSON.stringify(filteredOptions);
      }

      if (variant === "customer") {
        const { client_field } = await customerFieldsApi.updateCustomerField(
          field?.custom_id,
          request
        );

        const newFilter = {
          ...client_field,
          label: client_field?.friendly_name,
          id: client_field?.value,
          enabled: true,
          custom_id: client_field?.id,
          custom: true,
          filter: null,
        }
        getCustomFieldsDerived("edit", 
          {
            ...newFilter,
          }
        )
        onSetList((prev) =>
          {
          const result = prev?.map((item) => {
            if (item?.custom_id === field?.custom_id) {
              return {
                ...item,
                enabled: true,
                custom: true,
                custom_id: field?.custom_id,
                id: client_field?.value,
                label: client_field?.friendly_name,
                setting: client_field?.setting,
                filter: null,
              };
            } else {
              return item;
            }
          });
          return result;
        }
        );
        

        toast.success("Customer field successfully updated!");
        setTimeout(() => {
          onGetFields();
        }, 1000);
        setTimeout(() => {
          onInitCustomFields(client_field?.field_type);
        }, 1500);
        onClose();
        reset();
      }

      if (variant === "lead") {
        const { lead_field } = await statusApi.updateLeadCustomField(
          field?.custom_id,
          request
        );
        onSetList((prev) =>
          prev?.map((item) => {
            if (item?.custom_id === field?.custom_id) {
              return {
                ...item,
                enabled: true,
                custom: true,
                custom_id: field?.custom_id,
                id: lead_field?.value,
                label: lead_field?.friendly_name,
                setting: lead_field?.setting,
              };
            } else {
              return item;
            }
          })
        );
        setIsLoading(false);
        toast.success("Customer field successfully updated!");
        onClose();
        reset();
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 1,
          overflow: "hidden",
          boxShadow: 24,
          minWidth: "400px",
          p: 4,
          pt: 5,
        }}
      >
        <form onSubmit={handleSubmit(onCustomerFieldSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              Update Custom Field
            </Typography>
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
            </Stack>
            {fieldType === 3 && (
              <Stack spacing={2} pb={1}>
                <Typography variant={"h6"}>Edit options:</Typography>
                <Scrollbar sx={{ maxHeight: "175px" }} data-testid="options-scrollbar">
                  <Stack spacing={1}>
                    {fieldOptions?.map((option, index) => (
                      <Stack direction="row" spacing={2} key={option?.id}>
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
              <Button variant="contained" type="submit" disabled={isLoading}>
                Update
              </Button>
              <Button variant="outlined" onClick={() => onClose()}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};
