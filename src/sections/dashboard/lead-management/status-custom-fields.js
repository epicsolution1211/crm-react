import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Switch from "@mui/material/Switch";

import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "src/hooks/use-auth";
// import { CustomFieldsEditModal } from "./custom-fields-edit-modal";
import { statusApi } from "src/api/lead-management/status";

export const StatusCustomFields = ({ leadId }) => {
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const getCustomFields = async () => {
    try {
      const { lead_fields } = await statusApi.getLeadCustomFields();
      setFields(lead_fields);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getCustomFieldValues = async () => {
    try {
      setIsLoading(true);
      const { lead_field_value } = await statusApi.getLeadCustomFieldValue({
        lead_id: leadId,
      });

      setFields((prev) =>
        prev?.map((item) => {
          const matchingValue = lead_field_value?.find(
            (val) => val?.lead_field_id === item?.id
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
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getCustomFields();
    if (leadId) {
      getCustomFieldValues();
    }
  }, [leadId]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const changedFields = fields?.filter((field) => field?.changed);
      if (changedFields?.length > 0) {
        changedFields?.map(async (field) => {
          if (field?.field_value) {
            await statusApi.updateLeadCustomFieldValue({
              lead_id: leadId,
              lead_field_name: field?.value,
              value: field?.field_value + "",
            });
          }
        });
        // eslint-disable-next-line no-unused-vars
        setFields(fields?.map(({ changed, ...rest }) => rest));
        toast.success("Lead field values successfully updated!");
      }
    }, 700);

    return () => clearTimeout(debounceTimeout);
  }, [fields]);

  const handleFieldValueChange = async (e, id, type = "default", name) => {
    e.preventDefault();

    if (type === "default") {
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === id) {
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
          if (item?.id === id) {
            return {
              ...item,
              field_value: JSON.stringify(e?.target?.checked),
            };
          } else {
            return item;
          }
        })
      );
      await statusApi.updateLeadCustomFieldValue({
        lead_id: leadId,
        lead_field_name: name,
        value: e?.target?.checked + "",
      });
      toast.success("Lead field value successfully updated!");
    }
  };

  const syncedFields = useMemo(() => {
    if (fields?.length) {
      return fields?.filter(f => f?.sync_lead);
    }
  }, [fields]);

  const unsyncedFields = useMemo(() => {
    if (fields?.length) {
      return fields?.filter(f => !f?.sync_lead);
    }
  }, [fields]);

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Custom Fields</Typography>
          </Stack>
        }
      />

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 200,
            width: "100%",
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 1,
                bgcolor: 'background.neutral',
                height: '100%'
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 'bold',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 1
                  }}
                >
                  Synced Fields
                </Typography>
                <Stack spacing={2.5}>
                  {syncedFields?.map((field) => {
                    const setting = JSON.parse(field?.setting);
                    const accessKey = `acc_custom_v_${field?.value}`;
                    const accessEditkey = `acc_custom_e_${field?.value}`;
                    const viewAccess = user?.acc && user?.acc[accessKey];
                    const editAccess = user?.acc && user?.acc[accessEditkey];

                    if (!viewAccess && viewAccess !== undefined) return null;

                    if (setting?.length) {
                      return (
                        <Stack
                          key={field?.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '120px',
                              flexShrink: 0
                            }}
                          >
                            {field?.friendly_name}:
                          </Typography>
                          <Select
                            placeholder={field?.friendly_name}
                            value={field?.field_value}
                            fullWidth
                            size="small"
                            onChange={(e) =>
                              handleFieldValueChange(
                                e,
                                field?.id,
                                "default",
                                field?.value
                              )
                            }
                            disabled={
                              !user?.acc?.acc_e_client_data ||
                              (!editAccess && editAccess !== undefined)
                            }
                          >
                            {setting?.map((s) => {
                              const accessOptionKey = `acc_custom_v_${
                                field?.value
                              }_${s?.option?.replace(/\s+/g, "_")}`;
                              const viewOptionAccess =
                                user?.acc && user?.acc[accessOptionKey];

                              if (!viewOptionAccess && viewOptionAccess !== undefined)
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
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                      }}
                                    />
                                    <Typography>{s?.option}</Typography>
                                  </Stack>
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </Stack>
                      );
                    } else if (field?.field_type === "boolean") {
                      return (
                        <Stack
                          key={field?.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '120px',
                              flexShrink: 0
                            }}
                          >
                            {field?.friendly_name}:
                          </Typography>
                          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
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
                              disabled={
                                !user?.acc?.acc_e_client_data ||
                                (!editAccess && editAccess !== undefined)
                              }
                            />
                          </Box>
                        </Stack>
                      );
                    } else {
                      return (
                        <Stack
                          key={field?.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '120px',
                              flexShrink: 0
                            }}
                          >
                            {field?.friendly_name}:
                          </Typography>
                          <OutlinedInput
                            placeholder={field?.friendly_name}
                            value={field?.field_value}
                            fullWidth
                            size="small"
                            onChange={(e) =>
                              handleFieldValueChange(
                                e,
                                field?.id,
                                "default",
                                field?.value
                              )
                            }
                            disabled={
                              !user?.acc?.acc_e_client_data ||
                              (!editAccess && editAccess !== undefined)
                            }
                          />
                        </Stack>
                      );
                    }
                  })}
                  {!syncedFields?.length && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No synced fields available
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 1,
                bgcolor: 'background.neutral',
                height: '100%'
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 'bold',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 1
                  }}
                >
                  Unsynced Fields
                </Typography>
                <Stack spacing={2.5}>
                  {unsyncedFields?.map((field) => {
                    const setting = JSON.parse(field?.setting);
                    const accessKey = `acc_custom_v_${field?.value}`;
                    const accessEditkey = `acc_custom_e_${field?.value}`;
                    const viewAccess = user?.acc && user?.acc[accessKey];
                    const editAccess = user?.acc && user?.acc[accessEditkey];

                    if (!viewAccess && viewAccess !== undefined) return null;

                    if (setting?.length) {
                      return (
                        <Stack
                          key={field?.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '120px',
                              flexShrink: 0
                            }}
                          >
                            {field?.friendly_name}:
                          </Typography>
                          <Select
                            placeholder={field?.friendly_name}
                            value={field?.field_value}
                            fullWidth
                            size="small"
                            onChange={(e) =>
                              handleFieldValueChange(
                                e,
                                field?.id,
                                "default",
                                field?.value
                              )
                            }
                            disabled={
                              !user?.acc?.acc_e_client_data ||
                              (!editAccess && editAccess !== undefined)
                            }
                          >
                            {setting?.map((s) => {
                              const accessOptionKey = `acc_custom_v_${
                                field?.value
                              }_${s?.option?.replace(/\s+/g, "_")}`;
                              const viewOptionAccess =
                                user?.acc && user?.acc[accessOptionKey];

                              if (!viewOptionAccess && viewOptionAccess !== undefined)
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
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                      }}
                                    />
                                    <Typography>{s?.option}</Typography>
                                  </Stack>
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </Stack>
                      );
                    } else if (field?.field_type === "boolean") {
                      return (
                        <Stack
                          key={field?.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '120px',
                              flexShrink: 0
                            }}
                          >
                            {field?.friendly_name}:
                          </Typography>
                          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
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
                              disabled={
                                !user?.acc?.acc_e_client_data ||
                                (!editAccess && editAccess !== undefined)
                              }
                            />
                          </Box>
                        </Stack>
                      );
                    } else {
                      return (
                        <Stack
                          key={field?.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '120px',
                              flexShrink: 0
                            }}
                          >
                            {field?.friendly_name}:
                          </Typography>
                          <OutlinedInput
                            placeholder={field?.friendly_name}
                            value={field?.field_value}
                            fullWidth
                            size="small"
                            onChange={(e) =>
                              handleFieldValueChange(
                                e,
                                field?.id,
                                "default",
                                field?.value
                              )
                            }
                            disabled={
                              !user?.acc?.acc_e_client_data ||
                              (!editAccess && editAccess !== undefined)
                            }
                          />
                        </Stack>
                      );
                    }
                  })}
                  {!unsyncedFields?.length && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No unsynced fields available
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      )}

      {/* <CustomFieldsEditModal
        open={fieldsEditOpen}
        onClose={() => setFieldsEditOpen(false)}
        onGetFields={getCustomFields}
      /> */}
    </Card>
  );
};
