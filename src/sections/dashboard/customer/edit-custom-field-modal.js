import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";
import { customerFieldsApi } from "src/api/customer-fields";
import { useAuth } from "src/hooks/use-auth";

const MenuProps = {
  autoFocus: false,
  disableAutoFocusItem: true,
  TransitionProps: {
    onExiting: (node) => {
      node.style.pointerEvents = 'none';
    },
  },
};

export const EditCustomFieldModal = (props) => {
  const { open, onClose, onGetData, customerId = null, customFieldId = null, customFilters, onGetFields = () => { } } = props;
  const { user } = useAuth();

  const filters = useSelector((state) => state.customers.customerFilters);

  const [fields, setFields] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  
  const getCustomFields = async () => {
    try {
      const { client_fields } = await customerFieldsApi.getCustomerFields();
      setFields(client_fields.filter(field => field.id === customFieldId));
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
  }, [customerId]);

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

  const handleSaveField = async (id, isBoolean = true) => {
    setIsLoading(true);
    try {
      const field = fields?.find((f) => f?.id === id);
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

      request.append("client_ids[]", customerId);

      const params = {
        ...filters
      };

      if (filters?.online?.length === 1 && filters?.online[0] === "true") {
        params.online = "true";
      }
      if (filters?.online?.length === 1 && filters?.online[0] === "false") {
        params.online = "false";
      }

      params["client_ids"] = [customerId];

      const customFiltersData = customFilters
        ?.filter((filter) => filter?.filter && (filter?.filter?.query?.length || filter?.filter?.non_query?.length))
        ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

      await customerFieldsApi.updateCustomerFieldValue(request, params);
      setTimeout(() => {
        toast.success("Customer field value successfully updated!");
        onGetData();
        onGetFields();
      }, 2000);
    } catch (error) {
      console.error("error:", error);
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);

    setTimeout(() => {
      onClose();
    }, 500)
  };

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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Container sx={{ px: 3, pb: 3, pt: 5}}>
        <Stack direction="column" spacing={3}>

          <Stack pb={2} direction="row" justifyContent="center">
            <Typography variant="h5">Edit Custom Field</Typography>
          </Stack>

          <Scrollbar sx={{ maxHeight: 600, minHeight: fields.length && fields[0].field_type === "boolean" ? 100 : 170 }}>
            <Stack 
              spacing={2} 
              sx={{ px: 3 }}
              direction="column"
              gap={3}
            >
              {
                fields.length ? fields.map((field) => {
                  const setting = JSON.parse(field?.setting);
                  const accessKey = `acc_custom_v_${field?.value}`;
                  const accessEditkey = `acc_custom_e_${field?.value}`;
                  const viewAccess = user?.acc && user?.acc[accessKey];
                  const editAccess = user?.acc && user?.acc[accessEditkey];
                  if (!viewAccess && viewAccess !== undefined) return null;
                  return (
                    <Stack key={field}>
                      {setting?.length &&
                        field?.field_type === "multi_choice_radio" && (
                          <Stack
                            key={field?.id}
                            direction="column"
                            gap={2}
                            sx={{ 
                              maxWidth: "500px",
                            }}
                          >
                            <Stack fullWidth paddingLeft={2} sx={{width: '100%', textAlign: 'left'}}>
                              <Typography>{field?.friendly_name}</Typography>
                            </Stack>
                            <Select
                              MenuProps={MenuProps}
                              placeholder={field?.friendly_name}
                              value={field.field_value ?? ""}
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
                          </Stack>
                        )}
                      {setting?.length &&
                        field?.field_type === "multi_choice" && (
                          <Stack spacing={1}>
                            <Stack
                              key={field?.id}
                              direction="column"
                              gap={2}
                              sx={{ 
                                maxWidth: "500px",
                              }}
                            >
                              <Stack fullWidth paddingLeft={2} sx={{width: '100%', textAlign: 'left'}}>
                                <Typography>{field?.friendly_name}</Typography>
                              </Stack>
                              <Select
                                MenuProps={MenuProps}
                                placeholder={field?.friendly_name}
                                value={field?.field_value?.split(",") ?? []}
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
                          alignItems="center"
                          justifyContent="center"
                          gap={2}
                          sx={{ 
                            maxWidth: "500px",
                          }}
                        >
                          <Stack direction="row" gap={1} paddingLeft={2}>
                            <Typography>{field?.friendly_name}</Typography>
                          </Stack>
                          <Stack>
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
                        </Stack>
                      )}
                      {!setting?.length && field?.field_type !== "boolean" && (
                        <Stack
                          key={field?.id}
                          direction="column"
                          gap={2}
                          sx={{ 
                            maxWidth: "500px",
                          }}
                        >
                          <Stack fullWidth paddingLeft={2} sx={{width: '100%', textAlign: 'left'}}>
                            <Typography>{field?.friendly_name}</Typography>
                          </Stack>
                          <OutlinedInput
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
                        </Stack>
                      )}
                    </Stack>
                  );
                }) : <Stack minHeight={fields.length && fields[0].field_type === "boolean" ? 50 : 80}></Stack>
              }
              <Stack 
                direction="row"
                justifyContent="center"
                gap={2}
                sx={{pb: 1}}
              >
                <LoadingButton 
                  loading={isLoading} 
                  variant="contained" 
                  type="submit" 
                  onClick={() => handleSaveField(fields[0]?.id, false, true)}
                  sx={{ width: 90 }}
                >
                  Update
                </LoadingButton>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{ width: 90 }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Scrollbar>
        </Stack>
      </Container>
    </Dialog>
  );
};
