import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "src/components/scrollbar";
import { customerFieldsApi } from "src/api/customer-fields";
import { useAuth } from "src/hooks/use-auth";
import { userApi } from "src/api/user";

export const BulkUpdateFields = (props) => {
  const { open, onClose, selectAll, selected, deselected = [], onGetData = () => {}, customerId = null, customFilters, pinedFields, setPinedFields, columnSettings, onGetFields = () => { }, query, perPage } = props;
  const { user, refreshUser } = useAuth();

  const filters = useSelector((state) => state.customers.customerFilters);

  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState({
    id: undefined,
    status: false,
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    fieldId: null,
    isBoolean: true,
    accessKey: null,
  });

  const getCustomFields = async () => {
    try {
      const { client_fields } = await customerFieldsApi.getCustomerFields();
      setFields(client_fields);

      if (customerId) {
        getCustomFieldValues();
      }
    } catch (error) {
      console.error("error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getCustomFieldValues = async () => {
    try {
      const { client_field_value } =
        await customerFieldsApi.getCustomerFieldValue({
          client_id: customerId,
        });

      setFields((prev) =>
        prev?.map((item) => {
          const matchingValue = client_field_value?.find(
            (val) => val?.client_field_id === item?.id
          );

          if (matchingValue) {
            return {
              ...item,
              field_value_id: matchingValue?.id,
              field_value: matchingValue?.value,
            };
          } else {
            return item;
          }
        })
      );
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getCustomFields();
  }, [customerId, open]);

  const handleFieldValueChange = async (e, fieldId, type = "default") => {
    e.preventDefault();

    if (type === "default") {
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value,
              changed: true,
            };
          } else {
            return item;
          }
        })
      );
    } else if (type === "switch") {
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
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
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value?.filter((v) => v)?.join(),
            };
          } else {
            return item;
          }
        })
      );
    }
  };

  const handleSaveField = async (id, isBoolean = true, accessKey = null) => {
    setConfirmDialog({
      open: true,
      fieldId: id,
      isBoolean,
      accessKey,
    });
  };

  const handleConfirmSave = async () => {
    const { fieldId, isBoolean } = confirmDialog;
    setConfirmDialog({ open: false, fieldId: null, isBoolean: true, accessKey: null });
    
    setIsLoading({
      id: fieldId,
      status: true,
    });
    try {
      const field = fields?.find((f) => f?.id === fieldId);
      const request = new FormData();
      request.append("client_field_name", field?.value);
      if (isBoolean) {
        request.append(
          "value",
          field?.field_value === undefined ? "false" : field?.field_value + ""
        );
      } else {
        request.append("value", field?.field_value ?? "");
      }

      if (perPage && perPage > 0) {
        request.append("per_page", perPage);
      }

      if (selectAll) {
        request.append("select_all", true);
        if (deselected.length > 0) {
          deselected?.forEach((u) => request.append("non_client_ids[]", u));
        }
      } else if (customerId) {
        request.append("client_ids[]", customerId);
      } else {
        selected?.forEach((u) => request.append("client_ids[]", u));
      }

      const params = {
        ...filters,
        q: query?.length > 0 ? query : null,
      };

      if (filters?.online?.length === 1 && filters?.online[0] === "true") {
        params.online = "true";
      }
      if (filters?.online?.length === 1 && filters?.online[0] === "false") {
        params.online = "false";
      }

      if (perPage && perPage > 0) {
        params["per_page"] = perPage;
      }

      if (selectAll) {
        params["select_all"] = true;
        if (deselected.length > 0) {
          params["non_client_ids"] = deselected;
        }
      } else {
        params["client_ids"] = selected;
      }

      const customFiltersData = customFilters
        ?.filter((filter) => filter?.filter && (filter?.filter?.query?.length || filter?.filter?.non_query?.length))
        ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

      await customerFieldsApi.updateCustomerFieldValue(request, params);
      toast.success("Customer field value successfully updated!");
      setTimeout(() => {
        onGetData();
        onGetFields();
      }, 2000);
    } catch (error) {
      console.error("error:", error);
      toast.error(error?.response?.data?.message);
    }
    setIsLoading({
      id: undefined,
      status: false,
    });
  };

  const handleCancelSave = () => {
    setConfirmDialog({ open: false, fieldId: null, isBoolean: true, accessKey: null });
  };

  const handleItemPin = (id, pinned) => {
    if (pinned) {
      const newFields = pinedFields?.filter(item => item !== id);
      setPinedFields(newFields);
      handleUpdatePined(newFields);
    } else {
      const newFields = [...pinedFields, id];
      setPinedFields(newFields);
      handleUpdatePined(newFields);
    }
  };

  const handleUpdatePined = async (pinned) => {
    const accountId = localStorage.getItem("account_id");
    if (columnSettings) {
      const updateSetting = {
        ...columnSettings,
        pinnedFields: pinned,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
    } else {
      const updatedTableSettings = {
        pinnedFields: pinned,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updatedTableSettings),
      });
    }
    setTimeout(() => refreshUser(), 2000);

  }

  const handleMultiChipDelete = async (fieldId, value) => {
    try {
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
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
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <Container maxWidth="sm" sx={{ p: 3 }}>
          <Stack direction="column" spacing={3}>
            <IconButton onClick={onClose} 
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                '&:hover': { color: 'primary.main' },
              }}>
              <Iconify icon="gravity-ui:xmark" />
            </IconButton>
            <Stack pb={2} direction="row" justifyContent="center">
              <Typography variant="h5">Update custom fields</Typography>
            </Stack>

            <Scrollbar sx={{ maxHeight: 600 }}>
              <Stack spacing={2} sx={{ p: 4 }}>
                {fields?.map((field) => {
                  const setting = JSON.parse(field?.setting);
                  const accessKey = `acc_custom_v_${field?.value}`;
                  const accessEditkey = `acc_custom_e_${field?.value}`;
                  const viewAccess = user?.acc && user?.acc[accessKey];
                  const editAccess = user?.acc && user?.acc[accessEditkey];
                  if (!viewAccess && viewAccess !== undefined) return null;
                  const isPinedValue = pinedFields?.find((item) => item === field?.id);

                  return (
                    <Stack key={field}>
                      {setting?.length &&
                        field?.field_type === "multi_choice_radio" && (
                          <Stack
                            key={field?.id}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ maxWidth: "500px" }}
                          >
                            <Stack direction="row" gap={1}>
                              <Typography>{field?.friendly_name}:</Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Select
                                placeholder={field?.friendly_name}
                                value={field.field_value ?? ""}
                                sx={{ width: "215px" }}
                                onChange={(e) =>
                                  handleFieldValueChange(
                                    e,
                                    field?.id,
                                    "default",
                                    field?.value
                                  )
                                }
                                disabled={!editAccess && editAccess !== undefined}
                              >
                                {setting?.map((s) => {
                                  const accessOptionKey = `acc_custom_v_${field?.value
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
                              <Tooltip title="Update field">
                                <IconButton
                                  sx={{ justifySelf: "flex-end" }}
                                  onClick={() => handleSaveField(field?.id, false, accessKey)}
                                >
                                  {isLoading?.id === field?.id && isLoading?.status ?
                                    <Iconify
                                      icon='svg-spinners:8-dots-rotate'
                                      width={24}
                                      sx={{ color: 'primary.main' }}
                                    />
                                    : 
                                    <Iconify icon="gg:check-o" color="primary.main" width={24}/>
                                  }
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={isPinedValue ? "Unpin this field" : "Pin this field"}>
                                <IconButton
                                  sx={{ justifySelf: "flex-end", px: 0 }}
                                  onClick={() => handleItemPin(field?.id, isPinedValue ? true : false)}
                                >
                                  <Iconify icon={isPinedValue? "clarity:pin-solid" : "clarity:pin-line"} color={ isPinedValue? "primary.main" : "text.disabled" }/>
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>
                        )}
                      {setting?.length &&
                        field?.field_type === "multi_choice" && (
                          <Stack spacing={1}>
                            <Stack
                              key={field?.id}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ maxWidth: "500px" }}
                            >
                              <Stack direction="row" gap={1}>
                                <Typography>{field?.friendly_name}:</Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Select
                                  placeholder={field?.friendly_name}
                                  value={field?.field_value?.split(",") ?? []}
                                  sx={{ width: "215px" }}
                                  multiple
                                  onChange={(e) =>
                                    handleFieldValueChange(
                                      e,
                                      field?.id,
                                      "multi_choice",
                                      field?.value
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
                                  {setting?.map((s) => {
                                    const accessOptionKey = `acc_custom_v_${field?.value
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
                                            ) ? true : false}
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
                                <Tooltip title="Update field">
                                  <IconButton
                                    sx={{ justifySelf: "flex-end" }}
                                    onClick={() =>
                                      handleSaveField(field?.id, false, accessKey)
                                    }
                                  >
                                    {isLoading?.id === field?.id && isLoading?.status ?
                                      <CircularProgress
                                        size={20}
                                        color="success"
                                        sx={{ alignSelf: "center", justifySelf: "center" }}
                                      />
                                      : 
                                      <Iconify icon="gg:check-o" color="primary.main"/>
                                    }
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={isPinedValue ? "Unpin this field" : "Pin this field"}>
                                  <IconButton
                                    sx={{ justifySelf: "flex-end", px: 0 }}
                                    onClick={() => handleItemPin(field?.id, isPinedValue ? true : false)}
                                  >
                                    <Iconify icon={isPinedValue? "clarity:pin-solid" : "clarity:pin-line"} color={ isPinedValue? "primary.main" : "text.disabled" }/>
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Stack>
                            {field?.field_value ? (
                              <Grid spacing={1} container>
                                {field?.field_value?.split(",")?.map((val) => (
                                  <Grid item xs={4} key={val}>
                                    <Chip
                                      label={val}
                                      onDelete={() =>
                                        handleMultiChipDelete(
                                          field?.id,
                                          val,
                                          field?.value,
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
                      {!setting?.length && field?.field_type === "boolean" && (
                        <Stack
                          key={field?.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ maxWidth: "500px" }}
                        >
                          <Stack direction="row" gap={1}>
                            <Typography>{field?.friendly_name}:</Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            justifyContent="center"
                            spacing={2}
                          >
                            <Stack direction="row" minWidth={140}>
                              <Switch
                                checked={
                                  field?.field_value !== undefined &&
                                    ["true", "false"].includes(field?.field_value)
                                    ? JSON.parse(field?.field_value)
                                    : false
                                }
                                onChange={(e) =>
                                  handleFieldValueChange(
                                    e,
                                    field?.id,
                                    "switch",
                                    field?.value
                                  )
                                }
                                disabled={!editAccess && editAccess !== undefined}
                              />
                            </Stack>
                            <Tooltip title="Update field">
                              <IconButton
                                sx={{ justifySelf: "flex-end" }}
                                onClick={() => handleSaveField(field?.id, true, accessKey)}
                              >
                                {isLoading?.id === field?.id && isLoading?.status ?
                                  <CircularProgress
                                    size={20}
                                    color="success"
                                    sx={{ alignSelf: "center", justifySelf: "center" }}
                                  />
                                  : 
                                  <Iconify icon="gg:check-o" color="primary.main"/>
                                }
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={isPinedValue ? "Unpin this field" : "Pin this field"}>
                              <IconButton
                                sx={{ justifySelf: "flex-end", px: 0 }}
                                onClick={() => handleItemPin(field?.id, isPinedValue ? true : false)}
                              >
                                <Iconify icon={isPinedValue? "clarity:pin-solid" : "clarity:pin-line"} color={ isPinedValue? "primary.main" : "text.disabled" }/>
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      )}
                      {!setting?.length && field?.field_type !== "boolean" && (
                        <Stack
                          key={field?.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ maxWidth: "500px" }}
                        >
                          <Stack direction="row" gap={1}>
                            <Typography>{field?.friendly_name}:</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <OutlinedInput
                              sx={{ maxWidth: "215px" }}
                              placeholder={field?.friendly_name}
                              value={field?.field_value}
                              onChange={(e) =>
                                handleFieldValueChange(
                                  e,
                                  field?.id,
                                  "default",
                                  field?.value
                                )
                              }
                              disabled={!editAccess && editAccess !== undefined}
                            />
                            <Tooltip title="Update field">
                              <IconButton
                                sx={{ justifySelf: "flex-end" }}
                                onClick={() => handleSaveField(field?.id, false, accessKey)}
                              >
                                {isLoading?.id === field?.id && isLoading?.status ?
                                  <CircularProgress
                                    size={20}
                                    color="success"
                                    sx={{ alignSelf: "center", justifySelf: "center" }}
                                  />
                                  : 
                                  <Iconify icon="gg:check-o" color="primary.main"/>
                                }
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={isPinedValue ? "Unpin this field" : "Pin this field"}>
                              <IconButton
                                sx={{ justifySelf: "flex-end", px: 0 }}
                                onClick={() => handleItemPin(field?.id, isPinedValue ? true : false)}
                              >
                                <Iconify icon={isPinedValue? "clarity:pin-solid" : "clarity:pin-line"} color={ isPinedValue? "primary.main" : "text.disabled" }/>
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  );
                })}
              </Stack>
            </Scrollbar>
          </Stack>
        </Container>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelSave}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Update
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to update this field value? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSave} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSave} color="primary" variant="contained" autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
