import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import IconButton from "@mui/material/IconButton";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import TuneIcon from "@mui/icons-material/Tune";
import Typography from "@mui/material/Typography";

import { CustomFieldsEditModal } from "src/sections/dashboard/customer/custom-fields-edit-modal";
import { customerFieldsApi } from "src/api/customer-fields";
import { reorder } from "src/utils/function";
import { useAuth } from "src/hooks/use-auth";

export const AffiliateCustomFields = ({ affiliate, updateAffiliate }) => {
  const localCustomFiledSetting = localStorage.getItem("customFieldSetting");
  const localUnsyncedCustomFieldSetting = localStorage.getItem("unsyncedCustomFieldSetting");
  const customFieldSetting = JSON.parse(localCustomFiledSetting);
  const unsyncedCustomFieldSetting = JSON.parse(localUnsyncedCustomFieldSetting);

  const [isLoading, setIsLoading] = useState(true);
  const [fieldsEditOpen, setFieldsEditOpen] = useState(false);
  const [defaultFields, setDefaultFields] = useState([]);
  const [defaultUnsyncedFields, setDefaultUnsyncedFields] = useState([]);
  const [fields, setFields] = useState([]);
  const [unsyncedFields, setUnsyncedFields] = useState([]);
  const [rule, setRule] = useState();
  const [unsyncedRule, setUnsyncedRule] = useState();
  const [defaultRule, setDefaultRule] = useState([]);
  const [defaultUnsyncedRule, setDefaultUnsyncedRule] = useState([]);

  const { user } = useAuth();

  const isSame = JSON.stringify(rule) === JSON.stringify(defaultRule);
  const isUnsyncedSame = JSON.stringify(unsyncedRule) === JSON.stringify(defaultUnsyncedRule);

  const handleUpdateRule = () => {
    const rule = fields?.map((item, index) => ({
      id: item?.id,
      order: index,
    }));
    setRule(rule);
    if (customFieldSetting) {
      const updateSetting = {
        customerTable: rule,
      };
      localStorage.setItem("customFieldSetting", JSON.stringify(updateSetting));
    } else {
      const customSetting = {
        customerTable: rule,
      };
      localStorage.setItem("customFieldSetting", JSON.stringify(customSetting));
    }
  };

  const handleUpdateUnsyncedRule = () => {
    const rule = unsyncedFields?.map((item, index) => ({
      id: item?.id,
      order: index,
    }));
    setUnsyncedRule(rule);
    if (customFieldSetting) {
      const updateSetting = {
        customerTable: rule,
      };
      localStorage.setItem("unsyncedCustomFieldSetting", JSON.stringify(updateSetting));
    } else {
      const customSetting = {
        customerTable: rule,
      };
      localStorage.setItem("unsyncedCustomFieldSetting", JSON.stringify(customSetting));
    }
  };

  useEffect(() => {
    handleUpdateRule();
  }, [fields]);

  useEffect(() => {
    handleUpdateUnsyncedRule();
  }, [unsyncedFields]);

  useEffect(() => {
    setRule(customFieldSetting?.customerTable ?? []);
  }, []);

  useEffect(() => {
    setUnsyncedRule(unsyncedCustomFieldSetting?.customerTable ?? []);
  }, []);

  const handleSetDefault = () => {
    const updateFields = fields?.map((item) => ({
      ...item,
      order: defaultRule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
    }))?.sort((a, b) => a.order - b.order);
    setFields([...updateFields]);
  };

  const handleSetUnsyncedDefault = () => {
    const updateFields = unsyncedFields?.map((item) => ({
      ...item,
      order: defaultUnsyncedRule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
    }))?.sort((a, b) => a.order - b.order);
    setUnsyncedFields([...updateFields]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTableData = reorder(fields, result.source.index, result.destination.index);
    setFields(newTableData);
  };

  const onUnsyncedDragEnd = (result) => {
    if (!result.destination) return;
    const newTableData = reorder(unsyncedFields, result.source.index, result.destination.index);
    setUnsyncedFields(newTableData);
  };

  const getCustomFields = async () => {
    try {
      setIsLoading(true);
      const { client_fields } = await customerFieldsApi.getCustomerFields();
      
      // Parse aff_fields JSON string
      const affiliateFields = affiliate?.aff_fields ? JSON.parse(affiliate.aff_fields) : {};
      
      const syncedFields = client_fields?.filter((cf) => cf?.sync_lead)
        .map(field => {
          const fieldValue = affiliateFields[field.id];
          return {
            ...field,
            field_value: fieldValue !== undefined ? fieldValue : "",
          };
        });
      
      const unsyncedFieldsList = client_fields?.filter((cf) => !cf?.sync_lead)
        .map(field => {
          const fieldValue = affiliateFields[field.id];
          return {
            ...field,
            field_value: fieldValue !== undefined ? fieldValue : "",
          };
        });

      setDefaultFields(syncedFields);
      setDefaultUnsyncedFields(unsyncedFieldsList);

      setDefaultRule(syncedFields?.map((item, index) => ({
        id: item?.id,
        order: index,
      })));
      
      setDefaultUnsyncedRule(unsyncedFieldsList?.map((item, index) => ({
        id: item?.id,
        order: index,
      })));

      setIsLoading(false);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getCustomFields();
  }, [affiliate]);

  useEffect(() => {
    if (defaultFields?.length) {
      if (rule?.length) {
        const updateFields = defaultFields
          ?.map((item) => ({
            ...item,
            order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
          }))
          ?.sort((a, b) => a.order - b.order)
          ?.map(item => {
            if (item.field_type === "multi_choice" && !item.field_value) {
              return {
                ...item,
                field_value: ""
              }
            }
            return item;
          });
        setFields([...updateFields]);
      } else {
        setFields([...defaultFields?.map((item, index) => ({ ...item, order: index }))]);
      }
    }
  }, [defaultFields]);

  useEffect(() => {
    if (defaultUnsyncedFields?.length) {
      if (unsyncedRule?.length) {
        const updateFields = defaultUnsyncedFields
          ?.map((item) => ({
            ...item,
            order: unsyncedRule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
          }))
          ?.sort((a, b) => a.order - b.order)
          ?.map(item => {
            if (item.field_type === "multi_choice" && !item.field_value) {
              return {
                ...item,
                field_value: ""
              }
            }
            return item;
          });
        setUnsyncedFields([...updateFields]);
      } else {
        setUnsyncedFields([...defaultUnsyncedFields?.map((item, index) => ({ ...item, order: index }))]);
      }
    }
  }, [defaultUnsyncedFields]);

  const handleFieldValueChange = (e, fieldId, type = "default") => {
    if (type === "default") {
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value,
            };
          }
          return item;
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
          }
          return item;
        })
      );
    } else if (type === "multi_choice") {
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value?.sort((a, b) => a?.localeCompare(b))?.filter((v) => v)?.join(),
            };
          }
          return item;
        })
      );
    }
  };

  const handleUnsyncedFieldValueChange = (e, fieldId, type = "default") => {
    if (type === "default") {
      setUnsyncedFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value,
            };
          }
          return item;
        })
      );
    } else if (type === "switch") {
      setUnsyncedFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
            return {
              ...item,
              field_value: JSON.stringify(e?.target?.checked),
            };
          }
          return item;
        })
      );
    } else if (type === "multi_choice") {
      setUnsyncedFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value?.sort((a, b) => a?.localeCompare(b))?.filter((v) => v)?.join(),
            };
          }
          return item;
        })
      );
    }
  };

  const handleSaveChanges = () => {
    const fieldValues = {};
    [...fields, ...unsyncedFields].forEach(field => {
      if (field.field_value !== undefined && field.field_value !== "") {
        fieldValues[field.id] = field.field_value;
      }
    });
    
    updateAffiliate(affiliate.id, { aff_fields: JSON.stringify(fieldValues) });
  };

  const handleMultiChipDelete = (fieldId, value) => {
    setFields((prev) =>
      prev?.map((item) => {
        if (item?.id === fieldId) {
          return {
            ...item,
            field_value: item?.field_value?.split(",")?.filter((v) => v !== value)?.join(),
          };
        }
        return item;
      })
    );
  };

  const handleUnsyncedMultiChipDelete = (fieldId, value) => {
    setUnsyncedFields((prev) =>
      prev?.map((item) => {
        if (item?.id === fieldId) {
          return {
            ...item,
            field_value: item?.field_value?.split(",")?.filter((v) => v !== value)?.join(),
          };
        }
        return item;
      })
    );
  };

  return (
    <Card>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" sx={{ pr: 1 }}>
              Default Custom Fields
            </Typography>
            {user?.acc?.acc_e_client_data ? (
              <Tooltip title="Edit custom fields">
                <IconButton onClick={() => setFieldsEditOpen(true)}>
                  <TuneIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </Stack>
        }
      />
      {isLoading ? (
        <CardContent>
          <Stack spacing={12}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Skeleton width={50} height={40} />
                <Skeleton width={20} height={40} />
              </Stack>
              {[...new Array(4).keys()].map(item => (
                <Stack
                  key={item}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ maxWidth: "500px", minHeight: 60 }}
                  spacing={2}
                >
                  <Stack direction="row" gap={1} height={53} padding={1}>
                    <Skeleton width={20} />
                    <Skeleton width={180} />
                  </Stack>
                  <Stack>
                    <Skeleton width={200} height={60} />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      ) : (
        <CardContent>
          <Stack spacing={12}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Synced</Typography>
                <Tooltip title="Set as Default Order">
                  <IconButton onClick={handleSetDefault}>
                    {isSame ? (
                      <LowPriorityIcon />
                    ) : (
                      <Badge variant="dot" color="error">
                        <LowPriorityIcon />
                      </Badge>
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {({ innerRef }) => (
                    <Stack spacing={2} ref={innerRef}>
                      {fields?.map((field, index) => {
                        const setting = JSON.parse(field?.setting);
                        const accessKey = `acc_custom_v_${field?.value}`;
                        const accessEditkey = `acc_custom_e_${field?.value}`;
                        const viewAccess = user?.acc && user?.acc[accessKey];
                        const editAccess = user?.acc && user?.acc[accessEditkey];
                        if (!viewAccess && viewAccess !== undefined) return null;
                        return (
                          <Draggable
                            key={`signature-row-${index}`}
                            draggableId={`signature-row-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <Stack
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {setting?.length && field?.field_type === "multi_choice_radio" && (
                                  <Stack
                                    key={field?.id}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ maxWidth: "500px" }}
                                  >
                                    <Stack direction="row" gap={1}>
                                      <DragIndicatorIcon />
                                      <Typography>{field?.friendly_name}:</Typography>
                                    </Stack>
                                    <Select
                                      placeholder={field?.friendly_name}
                                      value={field.field_value ?? ""}
                                      sx={{ width: "215px" }}
                                      onChange={(e) => handleFieldValueChange(e, field?.id)}
                                      disabled={!editAccess && editAccess !== undefined}
                                    >
                                      {setting?.sort((a, b) => a?.option?.localeCompare(b?.option))?.map((s) => {
                                        const accessOptionKey = `acc_custom_v_${field?.value}_${s?.option?.replace(/\s+/g, "_")}`;
                                        const viewOptionAccess = user?.acc && user?.acc[accessOptionKey];

                                        if (!viewOptionAccess && viewOptionAccess !== undefined) return null;

                                        return (
                                          <MenuItem key={s?.id} value={s?.option?.trim()}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                              <Box
                                                sx={{
                                                  backgroundColor: s?.color ?? 'primary.main',
                                                  maxWidth: 1,
                                                  height: 1,
                                                  padding: 1,
                                                  borderRadius: 20,
                                                }}
                                              />
                                              <Typography>{s?.option}</Typography>
                                            </Stack>
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </Stack>
                                )}
                                {setting?.length && field?.field_type === "multi_choice" && (
                                  <Stack spacing={1}>
                                    <Stack
                                      key={field?.id}
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      sx={{ maxWidth: "500px" }}
                                    >
                                      <Stack direction="row" gap={1}>
                                        <DragIndicatorIcon />
                                        <Typography>{field?.friendly_name}:</Typography>
                                      </Stack>
                                      <Select
                                        placeholder={field?.friendly_name}
                                        value={field?.field_value?.split(",") ?? []}
                                        sx={{ width: "215px" }}
                                        multiple
                                        onChange={(e) => handleFieldValueChange(e, field?.id, "multi_choice")}
                                        renderValue={(selected) => {
                                          const newArray = setting?.filter((item) =>
                                            selected?.join()?.split(",")?.includes(item?.option)
                                          );
                                          const showLabel = newArray?.map((item) => item?.option)?.join(", ");
                                          return showLabel;
                                        }}
                                        disabled={!editAccess && editAccess !== undefined}
                                      >
                                        {setting?.sort((a, b) => a?.option?.localeCompare(b?.option))?.map((s) => {
                                          const accessOptionKey = `acc_custom_v_${field?.value}_${s?.option?.replace(/\s+/g, "_")}`;
                                          const viewOptionAccess = user?.acc && user?.acc[accessOptionKey];

                                          if (!viewOptionAccess && viewOptionAccess !== undefined) return null;

                                          return (
                                            <MenuItem key={s?.id} value={s?.option}>
                                              <Stack direction="row" alignItems="center" spacing={1}>
                                                <Checkbox
                                                  checked={field?.field_value?.includes(s?.option)}
                                                  sx={{ p: "3px", mr: 1 }}
                                                />
                                                <Box
                                                  sx={{
                                                    backgroundColor: s?.color ?? 'primary.main',
                                                    maxWidth: 1,
                                                    height: 1,
                                                    padding: 1,
                                                    borderRadius: 20,
                                                  }}
                                                />
                                                <Typography>{s?.option}</Typography>
                                              </Stack>
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </Stack>
                                    {field?.field_value ? (
                                      <Stack direction="row" alignItems="center" spacing={1.5}>
                                        {field?.field_value?.split(",")?.map((val) => (
                                          <Chip
                                            key={val}
                                            label={val}
                                            onDelete={() => handleMultiChipDelete(field?.id, val)}
                                          />
                                        ))}
                                      </Stack>
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
                                      <DragIndicatorIcon />
                                      <Typography>{field?.friendly_name}:</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="center" width={240}>
                                      <Switch
                                        checked={
                                          field?.field_value !== undefined &&
                                          ["true", "false"].includes(field?.field_value)
                                            ? JSON.parse(field?.field_value)
                                            : false
                                        }
                                        onChange={(e) => handleFieldValueChange(e, field?.id, "switch")}
                                        disabled={!editAccess && editAccess !== undefined}
                                      />
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
                                      <DragIndicatorIcon />
                                      <Typography>{field?.friendly_name}:</Typography>
                                    </Stack>
                                    <OutlinedInput
                                      sx={{ maxWidth: "215px" }}
                                      placeholder={field?.friendly_name}
                                      value={field?.field_value}
                                      onChange={(e) => handleFieldValueChange(e, field?.id)}
                                      disabled={!editAccess && editAccess !== undefined}
                                    />
                                  </Stack>
                                )}
                              </Stack>
                            )}
                          </Draggable>
                        );
                      })}
                    </Stack>
                  )}
                </Droppable>
              </DragDropContext>
            </Stack>

            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Unsynced</Typography>
                <Tooltip title="Set as Default Order">
                  <IconButton onClick={handleSetUnsyncedDefault}>
                    {isUnsyncedSame ? (
                      <LowPriorityIcon />
                    ) : (
                      <Badge variant="dot" color="error">
                        <LowPriorityIcon />
                      </Badge>
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
              <DragDropContext onDragEnd={onUnsyncedDragEnd}>
                <Droppable droppableId="droppable-unsynced">
                  {({ innerRef }) => (
                    <Stack spacing={2} ref={innerRef}>
                      {unsyncedFields?.map((field, index) => {
                        const setting = JSON.parse(field?.setting);
                        const accessKey = `acc_custom_v_${field?.value}`;
                        const accessEditkey = `acc_custom_e_${field?.value}`;
                        const viewAccess = user?.acc && user?.acc[accessKey];
                        const editAccess = user?.acc && user?.acc[accessEditkey];
                        if (!viewAccess && viewAccess !== undefined) return null;
                        return (
                          <Draggable
                            key={`signature-unsynced-row-${index}`}
                            draggableId={`signature-unsynced-row-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <Stack
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {setting?.length && field?.field_type === "multi_choice_radio" && (
                                  <Stack
                                    key={field?.id}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ maxWidth: "500px" }}
                                  >
                                    <Stack direction="row" gap={1}>
                                      <DragIndicatorIcon />
                                      <Typography>{field?.friendly_name}:</Typography>
                                    </Stack>
                                    <Select
                                      placeholder={field?.friendly_name}
                                      value={field.field_value ?? ""}
                                      sx={{ width: "215px" }}
                                      onChange={(e) => handleUnsyncedFieldValueChange(e, field?.id)}
                                      disabled={!editAccess && editAccess !== undefined}
                                    >
                                      {setting?.sort((a, b) => a?.option?.localeCompare(b?.option))?.map((s) => {
                                        const accessOptionKey = `acc_custom_v_${field?.value}_${s?.option?.replace(/\s+/g, "_")}`;
                                        const viewOptionAccess = user?.acc && user?.acc[accessOptionKey];

                                        if (!viewOptionAccess && viewOptionAccess !== undefined) return null;

                                        return (
                                          <MenuItem key={s?.id} value={s?.option?.trim()}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                              <Box
                                                sx={{
                                                  backgroundColor: s?.color ?? 'primary.main',
                                                  maxWidth: 1,
                                                  height: 1,
                                                  padding: 1,
                                                  borderRadius: 20,
                                                }}
                                              />
                                              <Typography>{s?.option}</Typography>
                                            </Stack>
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </Stack>
                                )}
                                {setting?.length && field?.field_type === "multi_choice" && (
                                  <Stack spacing={1}>
                                    <Stack
                                      key={field?.id}
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      sx={{ maxWidth: "500px" }}
                                    >
                                      <Stack direction="row" gap={1}>
                                        <DragIndicatorIcon />
                                        <Typography>{field?.friendly_name}:</Typography>
                                      </Stack>
                                      <Select
                                        placeholder={field?.friendly_name}
                                        value={field?.field_value?.split(",") ?? []}
                                        sx={{ width: "215px" }}
                                        multiple
                                        onChange={(e) => handleUnsyncedFieldValueChange(e, field?.id, "multi_choice")}
                                        renderValue={(selected) => {
                                          const newArray = setting?.filter((item) =>
                                            selected?.join()?.split(",")?.includes(item?.option)
                                          );
                                          const showLabel = newArray?.map((item) => item?.option)?.join(", ");
                                          return showLabel;
                                        }}
                                        disabled={!editAccess && editAccess !== undefined}
                                      >
                                        {setting?.sort((a, b) => a?.option?.localeCompare(b?.option))?.map((s) => {
                                          const accessOptionKey = `acc_custom_v_${field?.value}_${s?.option?.replace(/\s+/g, "_")}`;
                                          const viewOptionAccess = user?.acc && user?.acc[accessOptionKey];

                                          if (!viewOptionAccess && viewOptionAccess !== undefined) return null;

                                          return (
                                            <MenuItem key={s?.id} value={s?.option}>
                                              <Stack direction="row" alignItems="center" spacing={1}>
                                                <Checkbox
                                                  checked={field?.field_value?.includes(s?.option)}
                                                  sx={{ p: "3px", mr: 1 }}
                                                />
                                                <Box
                                                  sx={{
                                                    backgroundColor: s?.color ?? 'primary.main',
                                                    maxWidth: 1,
                                                    height: 1,
                                                    padding: 1,
                                                    borderRadius: 20,
                                                  }}
                                                />
                                                <Typography>{s?.option}</Typography>
                                              </Stack>
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </Stack>
                                    {field?.field_value ? (
                                      <Stack direction="row" alignItems="center" spacing={1.5}>
                                        {field?.field_value?.split(",")?.map((val) => (
                                          <Chip
                                            key={val}
                                            label={val}
                                            onDelete={() => handleUnsyncedMultiChipDelete(field?.id, val)}
                                          />
                                        ))}
                                      </Stack>
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
                                      <DragIndicatorIcon />
                                      <Typography>{field?.friendly_name}:</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="center" width={240}>
                                      <Switch
                                        checked={
                                          field?.field_value !== undefined &&
                                          ["true", "false"].includes(field?.field_value)
                                            ? JSON.parse(field?.field_value)
                                            : false
                                        }
                                        onChange={(e) => handleUnsyncedFieldValueChange(e, field?.id, "switch")}
                                        disabled={!editAccess && editAccess !== undefined}
                                      />
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
                                      <DragIndicatorIcon />
                                      <Typography>{field?.friendly_name}:</Typography>
                                    </Stack>
                                    <OutlinedInput
                                      sx={{ maxWidth: "215px" }}
                                      placeholder={field?.friendly_name}
                                      value={field?.field_value}
                                      onChange={(e) => handleUnsyncedFieldValueChange(e, field?.id)}
                                      disabled={!editAccess && editAccess !== undefined}
                                    />
                                  </Stack>
                                )}
                              </Stack>
                            )}
                          </Draggable>
                        );
                      })}
                    </Stack>
                  )}
                </Droppable>
              </DragDropContext>
            </Stack>
          </Stack>
        </CardContent>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </Box>

      <CustomFieldsEditModal
        open={fieldsEditOpen}
        onClose={() => setFieldsEditOpen(false)}
        onGetFields={getCustomFields}
      />
    </Card>
  );
}; 