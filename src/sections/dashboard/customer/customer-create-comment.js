import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import * as yup from "yup";

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import OutlinedInput from '@mui/material/OutlinedInput';

import { Iconify } from 'src/components/iconify';
import { useAuth } from "src/hooks/use-auth";
import { Scrollbar } from "src/components/scrollbar";
import CustomModal from "src/components/customize/custom-modal";
import { customerFieldsApi } from "src/api/customer-fields";

const validationSchema = yup.object({
  comment: yup.string().required("Comment is a required field"),
});

export const CustomerCreateComment = ({
  open,
  onClose,
  onCommentCreate,
  customerId,
  pinedCommentInfo,
  setPinedCommentInfo,
  fields,
  hasPin = false,
  onGetData = () => {},
  onFieldsOpen = () => {},
}) => {
  const { user } = useAuth();

  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    if (pinedCommentInfo) {
      setCustomFields(pinedCommentInfo?.fields);
    } else {
      setCustomFields(fields);
    }
  }, [fields, pinedCommentInfo, open]);

  const {
    setValue,
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    if (pinedCommentInfo) {
      setValue("comment", pinedCommentInfo?.commentValue ?? "");
    } else {
      reset();
    }
  }, [pinedCommentInfo, open]);

  const commentValue = useWatch({ control, name: "comment" });

  const onSubmit = async (data) => {
    await onCommentCreate(data);
    if (fields?.length > 0) {
      updateFields();
    }
    reset();
  };

  const updateFields = async () => {
    try {
      await Promise.all(
        customFields?.map(async (field) => {
          const request = new FormData();
          request.append("client_field_name", field?.id);
          request.append("value", field?.field_value);
          request.append("client_ids[]", customerId);
          return customerFieldsApi.updateCustomerFieldValue(request);
        })
      );
      toast.success("Customer field values successfully updated!");
      setTimeout(() => {
        onGetData();
      }, 1500);
    } catch (error) {
      toast.error("Failed to update customer field values.");
    }
  };
  
  const handleFieldValueChange = async (e, fieldId, type = "default") => {
    e.preventDefault();

    if (type === "default") {
      setCustomFields((prev) =>
        prev?.map((item) => {
          if (item?.custom_id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value,
            };
          } else {
            return item;
          }
        })
      );
    } else if (type === "switch") {
      setCustomFields((prev) =>
        prev?.map((item) => {
          if (item?.custom_id === fieldId) {
            return {
              ...item,
              field_value: JSON.stringify(e?.target?.checked),
            };
          } else {
            return item;
          }
        })
      );
    } else if (type === "multi_choice") {
      setCustomFields((prev) =>
        prev?.map((item) => {
          if (item?.custom_id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value
                ?.sort((a, b) => a?.localeCompare(b))
                ?.filter((v) => v)
                ?.join(),
            };
          } else {
            return item;
          }
        })
      );
    }
  };

  const handleMultiChipDelete = async (fieldId, value) => {
    try {
      setCustomFields((prev) =>
        prev?.map((item) => {
          if (item?.custom_id === fieldId) {
            return {
              ...item,
              field_value: item?.field_value
                ?.split(",")
                ?.filter((v) => v !== value)
                ?.join(),
            };
          } else {
            return item;
          }
        })
      );
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handlePinModal = () => {
    setPinedCommentInfo({ fields: customFields, commentValue });
  };

  return (
    <CustomModal
      width={500}
      onClose={() => {
        onClose();
        if (hasPin) {
          handlePinModal();
        }
      }}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography
            id="modal-modal-title"
            align="center"
            sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
          >
            Create Comment
          </Typography>
          {hasPin && (
            <Tooltip title="Pin comment modal">
              <IconButton
                onClick={() => {
                  handlePinModal();
                  onClose();
                }}
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 55,
                  '&:hover': { color: 'primary.main'}
                }}
              >
                <Iconify icon="clarity:pin-line" width={24}/>
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            onClick={() => {
              if (hasPin) {
                setPinedCommentInfo(undefined);
              }
              onClose();
            }}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              '&:hover': { color: 'primary.main'}
            }}
          >
            <Iconify icon="gravity-ui:xmark" width={24}/>
          </IconButton>
          <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
            <TextField
              fullWidth
              autoFocus
              multiline
              error={!!errors?.comment?.message}
              helperText={errors?.comment?.message}
              label="Comment"
              name="comment"
              type="text"
              {...register("comment")}
            />
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="h6">
              Custom fields
            </Typography>

            <IconButton
              onClick={() => onFieldsOpen(customerId)}
              sx={{ '&:hover': { color: 'primary.main' }, color:'text.secondary', mt: 4}}
            >
              <Tooltip title="Add pinned fields">
                <Iconify icon="system-uicons:list-add" width={28}/>
              </Tooltip>
            </IconButton>
          </Stack>
          {customFields?.length > 0 ? (
            <>
              <Scrollbar sx={{ pl: 1, pr: 2, py: 2, maxHeight: 450 }}>
                <Stack spacing={2}>
                  {customFields?.map((field, index) => {
                    const setting = JSON.parse(field?.setting);
                    const accessKey = `acc_custom_v_${field?.id}`;
                    const accessEditkey = `acc_custom_e_${field?.id}`;
                    const viewAccess = user?.acc && user?.acc[accessKey];
                    const editAccess = user?.acc && user?.acc[accessEditkey];
                    if (!viewAccess && viewAccess !== undefined) return null;

                    return (
                      <Stack key={index}>
                        {setting?.length &&
                          field?.field_type === "multi_choice_radio" && (
                            <Stack
                              key={field?.custom_id}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ maxWidth: "500px" }}
                            >
                              <Stack direction="row" gap={1}>
                                <Typography>{field?.label}:</Typography>
                              </Stack>
                              <Select
                                placeholder={field?.label}
                                value={field.field_value ?? ""}
                                sx={{ width: "215px" }}
                                onChange={(e) =>
                                  handleFieldValueChange(
                                    e,
                                    field?.custom_id,
                                    "default",
                                    field?.label
                                  )
                                }
                                disabled={
                                  !editAccess && editAccess !== undefined
                                }
                              >
                                {setting
                                  ?.sort((a, b) =>
                                    a?.option?.localeCompare(b?.option)
                                  )
                                  ?.map((s) => {
                                    const accessOptionKey = `acc_custom_v_${
                                      field?.id
                                    }_${s?.option?.replace(/\s+/g, "_")}`;
                                    const viewOptionAccess =
                                      user?.acc && user?.acc[accessOptionKey];

                                    if (
                                      !viewOptionAccess &&
                                      viewOptionAccess !== undefined
                                    )
                                      return null;

                                    return (
                                      <MenuItem key={s?.id} value={s?.option}>
                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                          spacing={1}
                                        >
                                          <Box
                                            sx={{
                                              backgroundColor: s?.color ?? 'primary.main',
                                              maxWidth: 1,
                                              height: 1,
                                              padding: 1,
                                              borderRadius: 20,
                                            }}
                                          ></Box>
                                          <Typography>{s?.option}</Typography>
                                        </Stack>
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            </Stack>
                          )}
                        {setting?.length &&
                          field?.field_type === "multi_choice" && (
                            <Stack spacing={1}>
                              <Stack
                                key={field?.csutom_id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <Typography>{field?.label}:</Typography>
                                </Stack>
                                <Select
                                  placeholder={field?.label}
                                  value={field?.field_value?.split(",") ?? []}
                                  sx={{ width: "215px" }}
                                  multiple
                                  onChange={(e) =>
                                    handleFieldValueChange(
                                      e,
                                      field?.custom_id,
                                      "multi_choice",
                                      field?.label
                                    )
                                  }
                                  renderValue={(selected) => {
                                    const newArray = setting?.filter((item) =>
                                      selected
                                        ?.join()
                                        ?.split(",")
                                        ?.includes(item?.option)
                                    );
                                    const showLabel = newArray
                                      ?.map((item) => item?.option)
                                      ?.join(", ");
                                    return showLabel;
                                  }}
                                  disabled={
                                    !editAccess && editAccess !== undefined
                                  }
                                >
                                  {setting
                                    ?.sort((a, b) =>
                                      a?.option?.localeCompare(b?.option)
                                    )
                                    ?.map((s) => {
                                      const accessOptionKey = `acc_custom_v_${
                                        field?.id
                                      }_${s?.option?.replace(/\s+/g, "_")}`;
                                      const viewOptionAccess =
                                        user?.acc && user?.acc[accessOptionKey];

                                      if (
                                        !viewOptionAccess &&
                                        viewOptionAccess !== undefined
                                      )
                                        return null;

                                      return (
                                        <MenuItem key={s?.id} value={s?.option}>
                                          <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                          >
                                            <Checkbox
                                              checked={field?.field_value?.includes(
                                                s?.option
                                              )}
                                              sx={{
                                                p: "3px",
                                                mr: 1,
                                              }}
                                            />
                                            <Box
                                              sx={{
                                                backgroundColor: s?.color ?? 'primary.main',
                                                maxWidth: 1,
                                                height: 1,
                                                padding: 1,
                                                borderRadius: 20,
                                              }}
                                            ></Box>
                                            <Typography>{s?.option}</Typography>
                                          </Stack>
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              </Stack>
                              {field?.field_value ? (
                                <Grid spacing={1} container>
                                  {field?.field_value
                                    ?.split(",")
                                    ?.map((val) => (
                                      <Grid item xs={4} key={val}>
                                        <Chip
                                          label={val}
                                          onDelete={() =>
                                            handleMultiChipDelete(
                                              field?.custom_id,
                                              val,
                                              field?.id,
                                              field?.field_value
                                            )
                                          }
                                        />
                                      </Grid>
                                    ))}
                                </Grid>
                              ) : null}
                            </Stack>
                          )}
                        {!setting?.length &&
                          field?.field_type === "boolean" && (
                            <Stack
                              key={field?.id}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ maxWidth: "500px" }}
                            >
                              <Stack direction="row" gap={1}>
                                <Typography>{field?.label}:</Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                justifyContent="center"
                                width={240}
                              >
                                <Switch
                                  checked={
                                    field?.field_value !== undefined &&
                                    ["true", "false"].includes(
                                      field?.field_value
                                    )
                                      ? JSON.parse(field?.field_value)
                                      : false
                                  }
                                  onChange={(e) =>
                                    handleFieldValueChange(
                                      e,
                                      field?.custom_id,
                                      "switch",
                                      field?.label
                                    )
                                  }
                                  disabled={
                                    !editAccess && editAccess !== undefined
                                  }
                                />
                              </Stack>
                            </Stack>
                          )}
                        {!setting?.length &&
                          field?.field_type !== "boolean" && (
                            <Stack
                              key={field?.id}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ maxWidth: "500px" }}
                            >
                              <Stack direction="row" gap={1}>
                                <Typography>{field?.label}:</Typography>
                              </Stack>
                              <OutlinedInput
                                sx={{ maxWidth: "215px" }}
                                placeholder={field?.label}
                                value={field?.field_value}
                                onChange={(e) =>
                                  handleFieldValueChange(
                                    e,
                                    field?.custom_id,
                                    "default",
                                    field?.label
                                  )
                                }
                                disabled={
                                  !editAccess && editAccess !== undefined
                                }
                              />
                            </Stack>
                          )}
                      </Stack>
                    );
                  })}
                </Stack>
              </Scrollbar>
            </>
          ) : null}
          <Stack sx={{ gap: 2, pt: 1 }} direction="row" justifyContent="center">
            <LoadingButton
              loading={isSubmitting}
              disabled={isSubmitting}
              variant="contained"
              type="submit"
              sx={{ width: 80 }}
            >
              Create
            </LoadingButton>
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </CustomModal>
  );
};
