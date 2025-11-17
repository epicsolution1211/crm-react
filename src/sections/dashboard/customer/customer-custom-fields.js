/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
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

import { CustomFieldsEditModal } from "./custom-fields-edit-modal";
import { customerFieldsApi } from "src/api/customer-fields";
import { reorder } from "src/utils/function";
import { useAuth } from "src/hooks/use-auth";

export const CustomerCustomFields = ({ id }) => {
  const localCustomFiledSetting = localStorage.getItem("customFieldSetting");
  const localUnsyncedCustomFieldSetting = localStorage.getItem(
    "unsyncedCustomFieldSetting"
  );
  const customFieldSetting = JSON.parse(localCustomFiledSetting);
  const unsyncedCustomFieldSetting = JSON.parse(
    localUnsyncedCustomFieldSetting
  );

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

  const isSame =
    JSON.stringify(rule) === JSON.stringify(defaultRule) ? true : false;

  const isUnsyncedSame =
    JSON.stringify(unsyncedRule) === JSON.stringify(defaultUnsyncedRule)
      ? true
      : false;

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
      localStorage.setItem(
        "unsyncedCustomFieldSetting",
        JSON.stringify(updateSetting)
      );
    } else {
      const customSetting = {
        customerTable: rule,
      };
      localStorage.setItem(
        "unsyncedCustomFieldSetting",
        JSON.stringify(customSetting)
      );
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
        setFields([
          ...defaultFields?.map((item, index) => ({ ...item, order: index })),
        ]);
      }
    }
  }, [defaultFields]);

  useEffect(() => {
    if (defaultUnsyncedFields?.length) {
      if (unsyncedRule?.length) {
        const updateFields = defaultUnsyncedFields
          ?.map((item) => ({
            ...item,
            order: unsyncedRule?.find((ruleItem) => item?.id === ruleItem?.id)
              ?.order,
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
        setUnsyncedFields([
          ...defaultUnsyncedFields?.map((item, index) => ({
            ...item,
            order: index,
          })),
        ]);
      }
    }
  }, [defaultUnsyncedFields]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const changedFields = fields?.filter((field) => field?.changed);
      if (changedFields?.length > 0) {
        changedFields?.map(async (field) => {
          if (field?.field_value) {
            const request = new FormData();
            request.append("client_field_name", field?.value);
            request.append("value", field?.field_value + "");
            request.append("client_ids[]", id);
            await customerFieldsApi.updateCustomerFieldValue(request);
          }
        });
        // eslint-disable-next-line no-unused-vars
        setFields(fields?.map(({ changed, ...rest }) => rest));
        toast.success("Customer field values successfully updated!");
      }
    }, 700);

    return () => clearTimeout(debounceTimeout);
  }, [fields]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const changedFields = unsyncedFields?.filter((field) => field?.changed);
      if (changedFields?.length > 0) {
        changedFields?.map(async (field) => {
          if (field?.field_value) {
            const request = new FormData();
            request.append("client_field_name", field?.value);
            request.append("value", field?.field_value + "");
            request.append("client_ids[]", id);
            await customerFieldsApi.updateCustomerFieldValue(request);
          }
        });
        // eslint-disable-next-line no-unused-vars
        setUnsyncedFields(unsyncedFields?.map(({ changed, ...rest }) => rest));
        toast.success("Customer field values successfully updated!");
      }
    }, 700);

    return () => clearTimeout(debounceTimeout);
  }, [unsyncedFields]);

  const handleSetDefault = () => {
    const updateFields = fields
      ?.map((item) => ({
        ...item,
        order: defaultRule?.find((ruleItem) => item?.id === ruleItem?.id)
          ?.order,
      }))
      ?.sort((a, b) => a.order - b.order);
    setFields([...updateFields]);
  };

  const handleSetUnsyncedDefault = () => {
    const updateFields = unsyncedFields
      ?.map((item) => ({
        ...item,
        order: defaultUnsyncedRule?.find(
          (ruleItem) => item?.id === ruleItem?.id
        )?.order,
      }))
      ?.sort((a, b) => a.order - b.order);
    setUnsyncedFields([...updateFields]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTableData = reorder(
      fields,
      result.source.index,
      result.destination.index
    );
    setFields(newTableData);
  };

  const onUnsyncedDragEnd = (result) => {
    if (!result.destination) return;
    const newTableData = reorder(
      unsyncedFields,
      result.source.index,
      result.destination.index
    );
    setUnsyncedFields(newTableData);
  };

  const { user } = useAuth();

  const getCustomFieldValues = async () => {
    try {
      setIsLoading(true);
      const { client_field_value } =
        await customerFieldsApi.getCustomerFieldValue({ client_id: id });

      setDefaultFields((prev) =>
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

      setDefaultUnsyncedFields((prev) =>
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
      setIsLoading(false);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getCustomFields = async () => {
    try {
      const { client_fields } = await customerFieldsApi.getCustomerFields();
      setDefaultFields(client_fields?.filter((cf) => cf?.sync_lead));
      setDefaultUnsyncedFields(client_fields?.filter((cf) => !cf?.sync_lead));

      setDefaultRule(client_fields?.filter((cf) => cf?.sync_lead)?.map((item, index) => ({
        id: item?.id,
        order: index,
      })));
      setDefaultUnsyncedRule(client_fields?.filter((cf) => !cf?.sync_lead)?.map((item, index) => ({
        id: item?.id,
        order: index,
      })));

      if (id) {
        getCustomFieldValues();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getCustomFields();
  }, [id]);

  const handleFieldValueChange = async (e, fieldId, type = "default", name) => {
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
      const request = new FormData();
      request.append("client_field_name", name);
      request.append("value", e?.target?.checked + "");
      request.append("client_ids[]", id);
      await customerFieldsApi.updateCustomerFieldValue(request);
      toast.success("Customer field value successfully updated!");
    } else if (type === "multi_choice") {
      setFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value?.sort((a, b) => a?.localeCompare(b))?.filter((v) => v)?.join(),
            };
          } else {
            return item;
          }
        })
      );
      const request = new FormData();
      request.append("client_field_name", name);
      request.append(
        "value",
        e?.target?.value?.filter((v) => v)?.sort((a, b) => a?.localeCompare(b))
      );
      request.append("client_ids[]", id);
      await customerFieldsApi.updateCustomerFieldValue(request);
      toast.success("Customer field value successfully updated!");
    }
  };

  const handleUnsyncedFieldValueChange = async (
    e,
    fieldId,
    type = "default",
    name
  ) => {
    e.preventDefault();

    if (type === "default") {
      setUnsyncedFields((prev) =>
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
      setUnsyncedFields((prev) =>
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
      const request = new FormData();
      request.append("client_field_name", name);
      request.append("value", e?.target?.checked + "");
      request.append("client_ids[]", id);
      await customerFieldsApi.updateCustomerFieldValue(request);
      toast.success("Customer field value successfully updated!");
    } else if (type === "multi_choice") {
      setUnsyncedFields((prev) =>
        prev?.map((item) => {
          if (item?.id === fieldId) {
            return {
              ...item,
              field_value: e?.target?.value?.filter((v) => v)?.sort((a, b) => a?.localeCompare(b))?.join(),
            };
          } else {
            return item;
          }
        })
      );
      const request = new FormData();
      request.append("client_field_name", name);
      request.append(
        "value",
        e?.target?.value?.filter((v) => v)?.sort((a, b) => a?.localeCompare(b))
      );
      request.append("client_ids[]", id);
      await customerFieldsApi.updateCustomerFieldValue(request);
      toast.success("Customer field value successfully updated!");
    }
  };

  const handleMultiChipDelete = async (fieldId, value, name, fieldValue) => {
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
      const request = new FormData();
      request.append("client_field_name", name);
      request.append(
        "value",
        fieldValue
          ?.split(",")
          ?.filter((v) => v !== value)
          ?.join()
      );
      request.append("client_ids[]", id);
      await customerFieldsApi.updateCustomerFieldValue(request);
      toast.success("Customer field value successfully updated!");
    } catch (error) {
      console.error("error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUnsyncedMultiChipDelete = async (
    fieldId,
    value,
    name,
    fieldValue
  ) => {
    try {
      setUnsyncedFields((prev) =>
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
      const request = new FormData();
      request.append("client_field_name", name);
      request.append(
        "value",
        fieldValue
          ?.split(",")
          ?.filter((v) => v !== value)
          ?.join()
      );
      request.append("client_ids[]", id);
      await customerFieldsApi.updateCustomerFieldValue(request);
      toast.success("Customer field value successfully updated!");
    } catch (error) {
      console.error("error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card>
      <CardHeader
        sx={{pt: 2.5, pb: 1.5}}
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" sx={{ pr: 1 }}>
              Custom Fields
            </Typography>
            {user?.acc?.acc_e_client_data ? (
              <Tooltip title="Edit custom fields">
                <IconButton onClick={() => setFieldsEditOpen(true)}>
                  <TuneIcon/>
                </IconButton>
              </Tooltip>
            ) : null}
          </Stack>
        }
      />
      {isLoading ? (

        <CardContent
          sx={{
          pt: 0.5,
          pb: 3,
          px: { xs: 3},
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}>
          <Stack spacing={3}>
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
                  sx={{ minHeight: 60 }}
                  spacing={2}
                >
                  <Stack direction="row" gap={1} height={53} padding={1}>
                    <Skeleton width={20} />
                    <Skeleton width={180} />
                  </Stack>
                  <Stack  >
                    <Skeleton width={200} height={60} />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      ) : (
        <CardContent
          sx={{
          pt: 0.5,
          pb: 3,
          px: { xs: 3},
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}>
          <Stack spacing={3}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography 
                  sx={{ 
                    ml: 1
                  }}
                >Synced</Typography>

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
                        const editAccess =
                          user?.acc && user?.acc[accessEditkey];
                        if (!viewAccess && viewAccess !== undefined)
                          return null;
                        return (
                          <Draggable
                            key={`signature-row-${index}`}
                            draggableId={`signature-row-${index}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Stack
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {setting?.length &&
                                  field?.field_type === "multi_choice_radio" && (
                                    <Stack
                                      key={field?.id}
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      sx={{}}
                                    >
                                      <Stack direction="row" gap={1}>
                                        <DragIndicatorIcon sx={{height: 14}} />
                                        <Typography                           
                                          sx={{ 
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            lineHeight: 1,
                                            letterSpacing: 0.5,
                                            fontSize: { xs: 14 }
                                          }}>
                                          {field?.friendly_name}:
                                        </Typography>
                                      </Stack>
                                      <Select
                                        placeholder={field?.friendly_name}
                                        value={field.field_value ?? ""}
                                        sx={{ width: { xs: "65%", md: "80%", lg: "50%"} }}
                                        onChange={(e) =>
                                          handleFieldValueChange(
                                            e,
                                            field?.id,
                                            "default",
                                            field?.value
                                          )
                                        }
                                        disabled={
                                          !editAccess &&
                                          editAccess !== undefined
                                        }
                                      >
                                        {setting?.sort((a, b) => a?.option?.localeCompare(b?.option))?.map((s) => {
                                          const accessOptionKey = `acc_custom_v_${field?.value
                                            }_${s?.option?.replace(/\s+/g, "_")}`;
                                          const viewOptionAccess =
                                            user?.acc &&
                                            user?.acc[accessOptionKey];

                                          if (
                                            !viewOptionAccess &&
                                            viewOptionAccess !== undefined
                                          )
                                            return null;

                                          return (
                                            <MenuItem
                                              key={s?.id}
                                              value={s?.option?.trim()}
                                            >
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
                                                <Typography sx={{fontSize: 14}}>
                                                  {s?.option}
                                                </Typography>
                                              </Stack>
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </Stack>
                                  )}
                                {setting?.length &&
                                  field?.field_type ===
                                  "multi_choice" && (
                                    <Stack spacing={1}>
                                      <Stack
                                        key={field?.id}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{}}
                                      >
                                        <Stack direction="row" gap={1}>
                                          <DragIndicatorIcon sx={{height: 14}}/>
                                          <Typography 
                                            sx={{ 
                                              color: 'text.secondary',
                                              fontWeight: 500,
                                              lineHeight: 1,
                                              letterSpacing: 0.5,
                                              fontSize: { xs: 14 }
                                            }}  
                                          >
                                            {field?.friendly_name}:
                                          </Typography>
                                        </Stack>
                                        <Select
                                          placeholder={field?.friendly_name}
                                          value={
                                            field?.field_value?.split(",") ?? []
                                          }
                                          sx={{ width: { xs: "65%", md: "80%", lg: "50%"} }}
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
                                            const newArray = setting?.filter(
                                              (item) =>
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
                                            !editAccess &&
                                            editAccess !== undefined
                                          }
                                        >
                                          {setting?.sort((a, b) => a?.option?.localeCompare(b?.option))?.map((s) => {
                                            const accessOptionKey = `acc_custom_v_${field?.value
                                              }_${s?.option?.replace(
                                                /\s+/g,
                                                "_"
                                              )}`;
                                            const viewOptionAccess =
                                              user?.acc &&
                                              user?.acc[accessOptionKey];

                                            if (
                                              !viewOptionAccess &&
                                              viewOptionAccess !== undefined
                                            )
                                              return null;

                                            return (
                                              <MenuItem
                                                key={s?.id}
                                                value={s?.option}
                                              >
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
                                                  <Typography sx={{fontSize: 14}}>
                                                    {s?.option}
                                                  </Typography>
                                                </Stack>
                                              </MenuItem>
                                            );
                                          })}
                                        </Select>
                                      </Stack>
                                      {field?.field_value ? (
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                          {field?.field_value
                                            ?.split(",")
                                            ?.map((val) => (
                                                <Chip
                                                  key={val}
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
                                            ))}
                                        </Stack>
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
                                      sx={{}}
                                    >
                                      <Stack direction="row" gap={1}>
                                        <DragIndicatorIcon sx={{height: 14}}/>
                                        <Typography
                                          sx={{ 
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            lineHeight: 1,
                                            letterSpacing: 0.5,
                                            fontSize: { xs: 14 }
                                          }} 
                                        >
                                          {field?.friendly_name}:
                                        </Typography>
                                      </Stack>
                                      <Stack
                                        direction="row"
                                        justifyContent="center"
                                        sx={{ width: { xs: "65%", md: "80%", lg: "50%"} }}
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
                                              field?.id,
                                              "switch",
                                              field?.value
                                            )
                                          }
                                          disabled={
                                            !editAccess &&
                                            editAccess !== undefined
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
                                      sx={{}}
                                    >
                                      <Stack direction="row" gap={1}>
                                        <DragIndicatorIcon sx={{height: 14}}/>
                                        <Typography 
                                          sx={{ 
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            lineHeight: 1,
                                            letterSpacing: 0.5,
                                            fontSize: { xs: 14 }
                                          }}
                                        >
                                          {field?.friendly_name}:
                                        </Typography>
                                      </Stack>
                                      <OutlinedInput
                                        sx={{ width: { xs: "65%", md: "80%", lg: "50%"} }}
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
                                        disabled={
                                          !editAccess &&
                                          editAccess !== undefined
                                        }
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
                <Typography
                  sx={{
                    ml: 1
                  }}
                >Unsynced</Typography>

                <Tooltip title="Set as Default Order">
                  <IconButton onClick={() => handleSetUnsyncedDefault()}>
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
                        const editAccess =
                          user?.acc && user?.acc[accessEditkey];
                        if (!viewAccess && viewAccess !== undefined)
                          return null;
                        return (
                          <Draggable
                            key={`signature-unsynced-row-${index}`}
                            draggableId={`signature-unsynced-row-${index}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Stack
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {setting?.length &&
                                  field?.field_type === "multi_choice_radio" && (
                                    <Stack
                                      key={field?.id}
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      sx={{}}
                                    >
                                      <Stack direction="row" gap={1}>
                                        <DragIndicatorIcon sx={{height: 14}}/>
                                        <Typography
                                          sx={{ 
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            lineHeight: 1,
                                            letterSpacing: 0.5,
                                            fontSize: { xs: 14 }
                                          }}
                                        >
                                          {field?.friendly_name}:
                                        </Typography>
                                      </Stack>
                                      <Select
                                        placeholder={field?.friendly_name}
                                        value={field.field_value ?? ""}
                                        sx={{ width: { xs: "65%", md: "80%", lg: "50%"} }}
                                        onChange={(e) =>
                                          handleUnsyncedFieldValueChange(
                                            e,
                                            field?.id,
                                            "default",
                                            field?.value
                                          )
                                        }
                                        disabled={
                                          !editAccess &&
                                          editAccess !== undefined
                                        }
                                      >
                                        {setting?.map((s) => {
                                          const accessOptionKey = `acc_custom_v_${field?.value
                                            }_${s?.option?.replace(/\s+/g, "_")}`;
                                          const viewOptionAccess =
                                            user?.acc &&
                                            user?.acc[accessOptionKey];

                                          if (
                                            !viewOptionAccess &&
                                            viewOptionAccess !== undefined
                                          )
                                            return null;

                                          return (
                                            <MenuItem
                                              key={s?.id}
                                              value={s?.option?.trim()}
                                            >
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
                                                <Typography sx={{fontSize: 14}}>
                                                  {s?.option}
                                                </Typography>
                                              </Stack>
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </Stack>
                                  )}
                                {setting?.length &&
                                  field?.field_type ===
                                  "multi_choice" && (
                                    <Stack spacing={1}>
                                      <Stack
                                        key={field?.id}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{}}
                                      >
                                        <Stack direction="row" gap={1}>
                                          <DragIndicatorIcon sx={{height: 14}} />
                                          <Typography
                                            sx={{ 
                                              color: 'text.secondary',
                                              fontWeight: 500,
                                              lineHeight: 1,
                                              letterSpacing: 0.5,
                                              fontSize: { xs: 14 }
                                            }}
                                          >
                                            {field?.friendly_name}:
                                          </Typography>
                                        </Stack>
                                        <Select
                                          placeholder={field?.friendly_name}
                                          value={
                                            field?.field_value?.split(",") ?? []
                                          }
                                          sx={{ width: { xs: "65%", md: "80%", lg: "50%"} }}
                                          multiple
                                          onChange={(e) =>
                                            handleUnsyncedFieldValueChange(
                                              e,
                                              field?.id,
                                              "multi_choice",
                                              field?.value
                                            )
                                          }
                                          renderValue={(selected) => {
                                            const newArray = setting?.filter(
                                              (item) =>
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
                                            !editAccess &&
                                            editAccess !== undefined
                                          }
                                        >
                                          {setting?.map((s) => {
                                            const accessOptionKey = `acc_custom_v_${field?.value
                                              }_${s?.option?.replace(
                                                /\s+/g,
                                                "_"
                                              )}`;
                                            const viewOptionAccess =
                                              user?.acc &&
                                              user?.acc[accessOptionKey];

                                            if (
                                              !viewOptionAccess &&
                                              viewOptionAccess !== undefined
                                            )
                                              return null;

                                            return (
                                              <MenuItem
                                                key={s?.id}
                                                value={s?.option}
                                              >
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
                                                  <Typography sx={{fontSize: 14}}>
                                                    {s?.option}
                                                  </Typography>
                                                </Stack>
                                              </MenuItem>
                                            );
                                          })}
                                        </Select>
                                      </Stack>
                                      {field?.field_value ? (
                                        <Stack spacing={1.5} direction="row" alignItems="center">
                                          {field?.field_value
                                            ?.split(",")
                                            ?.map((val) => (
                                                <Chip
                                                  key={val}
                                                  label={val}
                                                  onDelete={() =>
                                                    handleUnsyncedMultiChipDelete(
                                                      field?.id,
                                                      val,
                                                      field?.value,
                                                      field?.field_value
                                                    )
                                                  }
                                                />
                                            ))}
                                        </Stack>
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
                                      sx={{}}
                                    >
                                      <Stack direction="row" gap={1}>
                                        <DragIndicatorIcon sx={{height: 14}}/>
                                        <Typography
                                          sx={{ 
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            lineHeight: 1,
                                            letterSpacing: 0.5,
                                            fontSize: { xs: 14 }
                                          }}
                                        >
                                          {field?.friendly_name}:
                                        </Typography>
                                      </Stack>
                                      <Stack
                                        direction="row"
                                        justifyContent="center"
                                        sx={{ width: { xs: "65%", md: "80%", lg: "50%"} }}
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
                                            handleUnsyncedFieldValueChange(
                                              e,
                                              field?.id,
                                              "switch",
                                              field?.value
                                            )
                                          }
                                          disabled={
                                            !editAccess &&
                                            editAccess !== undefined
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
                                      sx={{}}
                                    >
                                      <Stack direction="row" gap={1}>
                                        <DragIndicatorIcon sx={{height: 14}}/>
                                        <Typography
                                          sx={{ 
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            lineHeight: 1,
                                            letterSpacing: 0.5,
                                            fontSize: { xs: 14 }
                                          }}
                                        >
                                          {field?.friendly_name}:
                                        </Typography>
                                      </Stack>
                                      <OutlinedInput
                                        sx={{ width: { xs: "65%", md: "80%", lg: "50%"} }}
                                        placeholder={field?.friendly_name}
                                        value={field?.field_value}
                                        onChange={(e) =>
                                          handleUnsyncedFieldValueChange(
                                            e,
                                            field?.id,
                                            "default",
                                            field?.value
                                          )
                                        }
                                        disabled={
                                          !editAccess &&
                                          editAccess !== undefined
                                        }
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

      <CustomFieldsEditModal
        open={fieldsEditOpen}
        onClose={() => setFieldsEditOpen(false)}
        onGetFields={() => {
          getCustomFields();
        }}
      />
    </Card>
  );
};
