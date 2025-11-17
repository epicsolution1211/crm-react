// React imports
import { useCallback, useEffect, useState, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";

// MUI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

// Third party imports
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

// Custom components
import { ChipSet } from "src/components/customize/chipset";
import { Scrollbar } from "src/components/scrollbar";
import { SelectMenu } from "src/components/customize/select-menu";
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ConfirmationDialog } from "src/components/confirmation-dialog";

// API imports
import { customersApi } from "src/api/customers";
import { customerFieldsApi } from "src/api/customer-fields";
import { settingsApi } from "src/api/settings";

// Hooks
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";

const useMembers = () => {
  const isMounted = useMounted();
  const [members, setMembers] = useState([]);

  const handleMembersGet = useCallback(async (deskId = null) => {
    const members = await settingsApi.getMembers([], "*", {
      active: true,
      desk_ids: [deskId],
    });

    if (isMounted()) {
      setMembers(deskId ?
        members?.accounts
          ?.filter(account => !account?.admin_hide)
          ?.map((acc) => ({
            label: acc?.first_name
              ? `${acc?.first_name} ${acc?.last_name}`
              : acc?.email,
            value: acc?.id,
          })) : []
      );
    }
  }, []);

  useEffect(() => {
    handleMembersGet();
  }, []);

  return {
    members,
    handleMembersGet,
  };
};

export const useDesks = () => {
  const [desks, setDesks] = useState([]);
  const { user } = useAuth();

  const getDesks = async () => {
    try {
      const res = await settingsApi.getDesk();
      setDesks(
        res?.desks
          ?.filter((desk) => {
            if (
              (user?.acc?.acc_e_client_desk === undefined ||
                user?.acc?.acc_e_client_desk) &&
              (user?.acc?.acc_v_client_desk === undefined ||
                user?.acc?.acc_v_client_desk)
            ) {
              return true;
            } else if (
              (user?.acc?.acc_e_client_self_desk === undefined ||
                user?.acc?.acc_e_client_self_desk) &&
              (user?.acc?.acc_v_client_self_desk === undefined ||
                user?.acc?.acc_v_client_self_desk)
            ) {
              return user?.desk_ids?.includes(desk?.id);
            } else {
              return false;
            }
          })
          .map((desk) => ({
            label: desk?.name,
            value: desk?.id,
          }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDesks();
  }, []);

  return desks;
};

const useTeams = () => {
  const isMounted = useMounted();
  const [teams, setTeams] = useState([]);

  const handleTeamsGet = useCallback(async () => {
    const teams = await settingsApi.getSkillTeams();

    if (isMounted()) {
      setTeams(
        teams?.map(({ team }) => ({
          label: team?.name,
          value: team?.id,
        }))
      );
    }
  }, []);

  useEffect(() => {
    handleTeamsGet();
  }, []);

  return {
    teams,
  };
};

export const CustomerAssignAgentTeamDialog = (props) => {
  const {
    open,
    onGetData,
    onClose,
    filters = {},
    selectAll,
    perPage,
    selected,
    deselected = [],
    customFilters,
    onTicketsGet = () => {},
    onDeselectAll = () => {},
    onBulkFieldsOpen = () => {},
    pinedFields,
    query,
  } = props;
  const { teams } = useTeams();
  const desks = useDesks();
  const [isLoading, setIsLoading] = useState(false);
  const [assignTo, setAssignTo] = useState('agents');
  const [fields, setFields] = useState([]);
  const [assignToEveryone, setAssignToEveryone] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const { members, handleMembersGet } = useMembers();

  const validationSchema = Yup.object({
    desk_id: assignTo === 'agents' && Yup.string().required("Desk id is required!"),
  });

  const { control, handleSubmit, register, reset, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { user, company } = useAuth();

  const team_ids = useWatch({ control, name: "team_ids" });
  const deskIds = useWatch({ control, name: "desk_ids" });
  const deskId = useWatch({ control, name: "desk_id" });
  const agentIds = useWatch({ control, name: "agent_ids" });

  useEffect(() => {
    handleMembersGet(deskId);
  }, [deskId]);

  useEffect(() => {
    if (deskId) setValue("agent_ids", []);
  }, [deskId]);

  const memberChip = useMemo(() => {
    const newChips = agentIds?.map((selected) => {
      const chip = members?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Agent",
      };
    });
    if (!agentIds) {
      setValue("agent_ids", []);
    }
    return newChips;
  }, [agentIds, members]);

  useEffect(() => {
    const getFields = async () => {
      try {
        if (pinedFields && pinedFields?.length > 0 && selected?.length > 0) {
          const { client_field_value } =
            await customerFieldsApi.getCustomerFieldValue({
              client_id: selected?.[0],
            });

          const valuableFields = customFilters
            ?.filter((field) => pinedFields.includes(field?.custom_id))
            ?.map((field) => {
              const matchingValue = client_field_value?.find(
                (val) => val?.client_field_id === field?.custom_id
              );

              if (matchingValue) {
                return {
                  ...field,
                  field_value_id: matchingValue?.id,
                  field_value: "",
                };
              } else {
                return field;
              }
            });

          setFields(prev => valuableFields?.map(field => {
            const prevField = prev?.find(f => f.custom_id === field.custom_id);
            if (prevField?.field_value) {
              return {
                ...field,
                field_value: prevField.field_value
              };
            }
            return field;
          }));
        } else {
          setFields([]);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    };

    getFields();
  }, [customFilters, pinedFields, selected]);

  const hasFieldsWithValues = () => {
    return fields?.some(field => {
      if (field?.field_type === "boolean") {
        return field?.field_value !== undefined && field?.field_value !== "";
      }
      return field?.field_value && field?.field_value !== "";
    });
  };

  const getClientCount = () => {
    return perPage ? `first ${perPage} selected clients` : selectAll ? "all selected clients" : `${selected?.length} client${selected?.length === 1 ? '' : 's'}`;
  };

  const getFieldNames = () => {
    const fieldsWithValues = fields?.filter(field => {
      if (field?.field_type === "boolean") {
        return field?.field_value !== undefined && field?.field_value !== "";
      }
      return field?.field_value && field?.field_value !== "";
    });
    return fieldsWithValues?.map(field => field?.label)?.join(", ");
  };

  const handleAssignTeams = async (data) => {
    if (company?.assign_confirmation) {
      setPendingFormData(data);
      setShowConfirmation(true);
    } else {
      executeAssignTeams(data);
    }
  };

  const executeAssignTeams = async (data) => {
    try {
      setIsLoading(true);
      if (team_ids.length) {
        const request = {
          subject: data.subject,
          reassign: data.reassign ? true : false,
          distribute: data.distribute ? true : false,
          assign_team_ids: team_ids,
        };

        const params = {
          ...filters,
          q: query?.length > 0 ? query : null,
        };
        if (selectAll) {
          params["select_all"] = true;
          if (perPage && perPage > 0) {
            params["per_page"] = perPage;
          }
          request["select_all"] = true;
          if (deselected.length > 0) {
            params["non_client_ids"] = deselected;
            request["non_client_ids"] = deselected;
          }
        } else {
          params["client_ids"] = selected;
          request["client_ids"] = selected;
        }

        if (filters?.online?.length === 1 && filters?.online[0] === "true") {
          params.online = "true";
        }
        if (filters?.online?.length === 1 && filters?.online[0] === "false") {
          params.online = "false";
        }

        delete params?.non_ids;
        delete params?.ids;
        delete params?.perPage;
        delete params?.currentPage;

        const customFiltersData = customFilters
          ?.filter(
            (filter) =>
              filter?.filter &&
              (
                (filter?.filter?.field_type === "text" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "multi_choice_radio" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "multi_choice" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "boolean" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "number" && (filter?.filter?.query?.gt || filter?.filter?.query?.lt))
              )
          )
          ?.map((filter) => filter?.filter);
        params["custom_field"] = customFiltersData;

        await customersApi.assignCustomerTeams(request, params);
        toast.success("Team(s) successfully assigned!");
        handleClearFields();
        onDeselectAll();
        setTimeout(() => onGetData(), 1000);
        setTimeout(() => onTicketsGet(), 1500);
      } else {
        toast.error("Team is not selected!");
        setIsLoading(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("error", error);
      toast.error(error?.response?.data?.message);
    }
    handleClose();
    setIsLoading(false);
  };

  const handleAssignMultiDesks = async (data) => {
    if (company?.assign_confirmation) {
      setPendingFormData(data);
      setShowConfirmation(true);
    } else {
      executeAssignMultiDesks(data);
    }
  };

  const executeAssignMultiDesks = async (data) => {
    setIsLoading(true);
    try {
      const request = {
        subject: data.subject,
        reassign: data.reassign ? true : false,
        distribute: data.distribute ? true : false,
        shuffle_selected: data.shuffle_selected ? true : false,
        assign_desk_ids: data?.desk_ids?.length > 0 ? data?.desk_ids?.map((item)=> parseInt(item)) : [],
      };
      
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

      if (selectAll) {
        params["select_all"] = true;
        if (perPage && perPage > 0) {
          params["per_page"] = perPage;
        }
        if (deselected.length > 0) {
          params["non_client_ids"] = deselected;
        }
      } else {
        params["client_ids"] = selected;
      }

      delete params?.non_ids;
      delete params?.ids;
      delete params?.perPage;
      delete params?.currentPage;
      delete params?.first_assigned_agent_name;
      delete params?.second_assigned_agent_name;
      delete params?.third_assigned_agent_name;
      delete params?.first_caller_name;
      delete params?.second_caller_name;
      delete params?.third_caller_name;
      delete params?.frd_owner_name;

      if (
        filters?.first_assigned_agent_name &&
        filters?.first_assigned_agent_name?.length > 0
      ) {
        params.first_assigned_agent_id = filters?.first_assigned_agent_name;
      }
      if (
        filters?.second_assigned_agent_name &&
        filters?.second_assigned_agent_name?.length > 0
      ) {
        params.second_assigned_agent_id = filters?.second_assigned_agent_name;
      }
      if (
        filters?.third_assigned_agent_name &&
        filters?.third_assigned_agent_name?.length > 0
      ) {
        params.third_assigned_agent_id = filters?.third_assigned_agent_name;
      }
      if (
        filters?.first_caller_name &&
        filters?.first_caller_name?.length > 0
      ) {
        params.first_call_by = filters?.first_caller_name;
      }
      if (
        filters?.second_caller_name &&
        filters?.second_caller_name?.length > 0
      ) {
        params.second_call_by = filters?.second_caller_name;
      }
      if (
        filters?.third_caller_name &&
        filters?.third_caller_name?.length > 0
      ) {
        params.third_call_by = filters?.third_caller_name;
      }
      if (filters?.frd_owner_name && filters?.frd_owner_name?.length > 0) {
        params.frd_owner_id = filters?.frd_owner_name;
      }

      const customFiltersData = customFilters
        ?.filter(
          (filter) =>
            filter?.filter &&
            (filter?.filter?.query?.length ||
              filter?.filter?.non_query?.length)
        )
        ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

      const fields = updateFields();
      request.client_field_updates = fields;

      await customersApi.assignCustomerAgents(request, params);
      toast.success("Desks successfully assigned!");
      handleClearFields();
      onDeselectAll();
      setTimeout(() => onGetData(), 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
    handleClose();
    setIsLoading(false);
  };

  const teamChip = useMemo(() => {
    const newChips = team_ids?.map((selected) => {
      const chip = teams?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Team",
      };
    });
    if (!team_ids) {
      setValue("team_ids", []);
    }
    return newChips;
  }, [team_ids, teams]);

  const deskChip = useMemo(() => {
    const newChips = deskIds?.map((selected) => {
      const chip = desks?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Desk",
      };
    });
    if (!deskIds) {
      setValue("desk_ids", []);
    }
    return newChips;
  }, [deskIds, desks]);

  const handleRemoveChip = (value, type) => {
    if (type === "team_ids") {
      if (team_ids instanceof Array) {
        const newStatus = [...team_ids].filter((item) => item !== value);
        setValue("team_ids", newStatus);
      } else {
        setValue("team_ids", []);
      }
    } else if (type === "desk_ids") {
      if (deskIds instanceof Array) {
        const newStatus = [...deskIds].filter((item) => item !== value);
        setValue("desk_ids", newStatus);
      } else {
        setValue("desk_ids", []);
      }
    } else if (type === "agent_ids") {
      if (agentIds instanceof Array) {
        const newStatus = [...agentIds].filter((item) => item !== value);
        setValue("agent_ids", newStatus);
      } else {
        setValue("agent_ids", []);
      }
    }
  };

  const handleFieldValueChange = async (e, fieldId, type = "default") => {
    e.preventDefault();

    if (type === "default") {
      setFields((prev) =>
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
      setFields((prev) =>
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
      setFields((prev) =>
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
      setFields((prev) =>
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

  const handleClearFields = () => {
    setFields((prev) =>
      prev?.map((item) => ({
        ...item,
        field_value: "",
      }))
    );
  };

  const handleClose = () => {
    onClose();
    handleClearFields();
  };

  useEffect(() => {
    reset();
    setValue("distribute", true);
    setValue("reassign", true);
    setValue("team_ids", []);
    setValue("shuffle_selected", true);
    setValue("desk_ids", []);
    
    let defaultAssignTo = "agents";
    if (user?.acc?.acc_e_client_assign_desks_agents !== false) {
      defaultAssignTo = "agents";
    } else if (user?.acc?.acc_e_client_assign_multi_desks !== false) {
      defaultAssignTo = "desks";
    } else if (user?.acc?.acc_e_client_team !== false) {
      defaultAssignTo = "team";
    }

    setAssignTo(defaultAssignTo);
  }, [open, user?.acc]);

  const assignToList = useMemo(() => {
    const list = [];
    if (user?.acc?.acc_e_client_assign_desks_agents === undefined || user?.acc?.acc_e_client_assign_desks_agents) {
      list.push({
        label: "Desks & agents", 
        value: "agents"
      });
    }
    if (user?.acc?.acc_e_client_assign_multi_desks === undefined || user?.acc?.acc_e_client_assign_multi_desks) {
      list.push({
        label: "Multi desks", 
        value: "desks"
      });
    }
    
    if (user?.acc?.acc_e_client_team === undefined || user?.acc?.acc_e_client_team) {
      list.push({
        label: "Team",
        value: "team"
      });
    }

    return list;
  }, [user?.acc?.acc_e_client_team, user?.acc?.acc_e_client_assign_desks_agents, user?.acc?.acc_e_client_assign_multi_desks]);

  const updateFields = () => {
    try {
      return fields?.map((field) => {
        if (!field?.field_value) return;
        if (field?.field_type === "boolean") {
          field.value = field?.field_value === undefined ? "false" : field?.field_value + "";
          return {
            field_name: field?.id,
            field_value: field?.value,
          }
        } else {
          field.value = field?.field_value ?? "";
          return {
            field_name: field?.id,
            field_value: field?.value,
          }
        }
      });
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleAssignAgents = async (data) => {
    if (company?.assign_confirmation) {
      setPendingFormData(data);
      setShowConfirmation(true);
    } else {
      executeAssignAgents(data);
    }
  };

  const executeAssignAgents = async (data) => {
    setIsLoading(true);
    try {
      if (assignToEveryone) {
        const request = {
          subject: data.subject,
          reassign: data.reassign ? true : false,
          distribute: data.distribute ? true : false,
          shuffle_selected: data.shuffle_selected ? true : false,
          assign_desk_id: data?.desk_id,
          agent_select_all: true,
        };

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

        if (selectAll) {
          params["select_all"] = true;
          if (perPage && perPage > 0) {
            params["per_page"] = perPage;
          }
          if (deselected.length > 0) {
            params["non_client_ids"] = deselected;
          }
        } else {
          params["client_ids"] = selected;
        }

        delete params?.non_ids;
        delete params?.ids;
        delete params?.perPage;
        delete params?.currentPage;
        delete params?.first_assigned_agent_name;
        delete params?.second_assigned_agent_name;
        delete params?.third_assigned_agent_name;
        delete params?.first_caller_name;
        delete params?.second_caller_name;
        delete params?.third_caller_name;
        delete params?.frd_owner_name;

        if (
          filters?.first_assigned_agent_name &&
          filters?.first_assigned_agent_name?.length > 0
        ) {
          params.first_assigned_agent_id = filters?.first_assigned_agent_name;
        }
        if (
          filters?.second_assigned_agent_name &&
          filters?.second_assigned_agent_name?.length > 0
        ) {
          params.second_assigned_agent_id = filters?.second_assigned_agent_name;
        }
        if (
          filters?.third_assigned_agent_name &&
          filters?.third_assigned_agent_name?.length > 0
        ) {
          params.third_assigned_agent_id = filters?.third_assigned_agent_name;
        }
        if (
          filters?.first_caller_name &&
          filters?.first_caller_name?.length > 0
        ) {
          params.first_call_by = filters?.first_caller_name;
        }
        if (
          filters?.second_caller_name &&
          filters?.second_caller_name?.length > 0
        ) {
          params.second_call_by = filters?.second_caller_name;
        }
        if (
          filters?.third_caller_name &&
          filters?.third_caller_name?.length > 0
        ) {
          params.third_call_by = filters?.third_caller_name;
        }
        if (filters?.frd_owner_name && filters?.frd_owner_name?.length > 0) {
          params.frd_owner_id = filters?.frd_owner_name;
        }

        const customFiltersData = customFilters
          ?.filter(
            (filter) =>
              filter?.filter &&
              (filter?.filter?.query?.length ||
                filter?.filter?.non_query?.length)
          )
          ?.map((filter) => filter?.filter);
        params["custom_field"] = customFiltersData;

        const fields = updateFields();

        request.client_field_updates = fields;

        await customersApi.assignCustomerAgents(request, params);
        toast.success("Agent(s) successfully assigned!");
        handleClearFields();
        onDeselectAll();
        setTimeout(() => onGetData(), 1000);
      } else {
        const request = {
          reassign: data.reassign ? true : false,
          distribute: data.distribute ? true : false,
          shuffle_selected: data.shuffle_selected ? true : false,
          assign_desk_id: data?.desk_id,
        };

        if (agentIds?.length > 0) {
          request.assign_agent_ids = agentIds;
        }

        const params = {
          ...filters,
          q: query?.length > 0 ? query : null,
        };

        delete params?.first_assigned_agent_name;
        delete params?.second_assigned_agent_name;
        delete params?.third_assigned_agent_name;
        delete params?.first_caller_name;
        delete params?.second_caller_name;
        delete params?.third_caller_name;
        delete params?.frd_owner_name;

        if (
          filters?.first_assigned_agent_name &&
          filters?.first_assigned_agent_name?.length > 0
        ) {
          params.first_assigned_agent_id = filters?.first_assigned_agent_name;
        }
        if (
          filters?.second_assigned_agent_name &&
          filters?.second_assigned_agent_name?.length > 0
        ) {
          params.second_assigned_agent_id = filters?.second_assigned_agent_name;
        }
        if (
          filters?.third_assigned_agent_name &&
          filters?.third_assigned_agent_name?.length > 0
        ) {
          params.third_assigned_agent_id = filters?.third_assigned_agent_name;
        }
        if (
          filters?.first_caller_name &&
          filters?.first_caller_name?.length > 0
        ) {
          params.first_call_by = filters?.first_caller_name;
        }
        if (
          filters?.second_caller_name &&
          filters?.second_caller_name?.length > 0
        ) {
          params.second_call_by = filters?.second_caller_name;
        }
        if (
          filters?.third_caller_name &&
          filters?.third_caller_name?.length > 0
        ) {
          params.third_call_by = filters?.third_caller_name;
        }
        if (filters?.frd_owner_name && filters?.frd_owner_name?.length > 0) {
          params.frd_owner_id = filters?.frd_owner_name;
        }

        if (filters?.online?.length === 1 && filters?.online[0] === "true") {
          params.online = "true";
        }
        if (filters?.online?.length === 1 && filters?.online[0] === "false") {
          params.online = "false";
        }
        if (params?.online?.length > 1) {
          delete params?.online;
        }
        
        if (selectAll) {
          params["select_all"] = true;
          if (perPage && perPage > 0) {
            params["per_page"] = perPage;
          }
          if (deselected.length > 0) {
            params["non_client_ids"] = deselected;
          }
        } else {
          params["client_ids"] = selected;
        }
        const customFiltersData = customFilters
          ?.filter(
            (filter) =>
              filter?.filter &&
              (filter?.filter?.query?.length ||
                filter?.filter?.non_query?.length)
          )
          ?.map((filter) => filter?.filter);
        params["custom_field"] = customFiltersData;
        const fields = updateFields();

        request.client_field_updates = fields;

        await customersApi.assignCustomerAgents(request, params);
        toast.success("Agent(s) successfully assigned!");
        handleClearFields();
        onDeselectAll();
        setTimeout(() => onGetData(), 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
    handleClose();
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">Assign Teams & Agents</Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h7" px={1}>
              Assign to
            </Typography>
            <FormControl fullWidth>
              <Select
                labelId="assign-to-label"
                id="assign-to"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              >
                {assignToList?.map((item) => (
                  <MenuItem value={item.value}>{item.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {assignTo === 'team' && (
            <Stack>
              <form noValidate onSubmit={handleSubmit(handleAssignTeams)}>
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="h7" px={1}>
                      Subject
                    </Typography>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      {...register("subject")}
                      type="text"
                    />
                  </Stack>
                  <Stack px={1}>
                    {user?.acc?.acc_e_client_distribute_clients === undefined ||
                    user?.acc?.acc_e_client_distribute_clients ? (
                      <Controller
                        name="distribute"
                        control={control}
                        render={({ field: { onChange, value = false } }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value ?? false}
                                onChange={(event) =>
                                  onChange(event?.target?.checked)
                                }
                              />
                            }
                            label="Distribute selected clients equally"
                          />
                        )}
                      />
                    ) : null}

                    {user?.acc?.acc_e_client_reassign_clients === undefined ||
                    user?.acc?.acc_e_client_reassign_clients ? (
                      <Controller
                        name="reassign"
                        control={control}
                        render={({ field: { onChange, value = false } }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value ?? false}
                                onChange={(event) =>
                                  onChange(event?.target?.checked)
                                }
                              />
                            }
                            label="Reassign selected clients"
                          />
                        )}
                      />
                    ) : null}
                  </Stack>
                  <Stack spacing={2}>
                    <Stack>
                      <MultiSelectMenu
                        control={control}
                        label="Select Teams"
                        name="team_ids"
                        list={teams}
                        isSearch
                      />
                    </Stack>
                    {teamChip?.length > 0 && (
                      <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ px: 1 }}
                      >
                        <ChipSet
                          chips={teamChip}
                          handleRemoveChip={(val) =>
                            handleRemoveChip(val, "team_ids")
                          }
                        />
                      </Stack>
                    )}
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      pb: 3,
                      px: 3,
                    }}
                  >
                    <Button color="inherit" sx={{ mr: 2 }} onClick={handleClose} disabled={isLoading}>
                      Cancel
                    </Button>
                    <LoadingButton
                      loading={isLoading}
                      variant="contained"
                      type="submit"
                    >
                      <Typography variant="subtitle2" py={"1px"}>
                        Assign
                      </Typography>
                    </LoadingButton>
                  </Box>
                </Stack>
              </form>
            </Stack>
          )}
          {assignTo === 'agents' && (
            <Stack>
              <form onSubmit={handleSubmit(handleAssignAgents)}>
                <Scrollbar sx={{ maxHeight: 500, pr: 0, pb: 1 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        color="primary"
                        sx={{ cursor: "pointer", fontWeight: 600, px: 1.5 }}
                        onClick={onBulkFieldsOpen}
                      >
                        Update custom fields
                      </Typography>
                    </Stack>
                    {fields?.length > 0 && (
                      <Stack spacing={1.5} px={1}>
                        {fields?.map((field, index) => {
                          return (
                            <Stack key={index}>
                              {field?.field_type === "multi_choice_radio" && (
                                <Stack
                                  key={field?.custom_id}
                                  direction="row"
                                  alignItems="center"
                                  spacing={3}
                                  sx={{ maxWidth: "500px" }}
                                >
                                  <Stack direction="row" gap={1}>
                                    <Typography sx={{ minWidth: 160 }}>
                                      {field?.label}:
                                    </Typography>
                                  </Stack>
                                  <Select
                                    placeholder={field?.label}
                                    value={field.field_value ?? ""}
                                    sx={{ width: "215px" }}
                                    onChange={(e) => handleFieldValueChange(
                                      e,
                                      field?.custom_id,
                                      "default",
                                      field?.label
                                    )}
                                    disabled={!user?.acc || !user?.acc[`acc_custom_e_${field?.id}`]}
                                  >
                                    {JSON.parse(field?.setting)
                                      ?.sort((a, b) => a?.option?.localeCompare(b?.option))
                                      ?.map((s) => (
                                        <MenuItem key={s?.id} value={s?.option}>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Box
                                              sx={{
                                                backgroundColor: s?.color ?? 'primary.main',
                                                maxWidth: 1,
                                                height: 1,
                                                padding: 1,
                                                borderRadius: 20,
                                              }} />
                                            <Typography>{s?.option}</Typography>
                                          </Stack>
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </Stack>
                              )}
                              {field?.field_type === "multi_choice" && (
                                <Stack spacing={1}>
                                  <Stack
                                    key={field?.custom_id}
                                    direction="row"
                                    alignItems="center"
                                    spacing={3}
                                    sx={{ maxWidth: "500px" }}
                                  >
                                    <Stack direction="row" gap={1}>
                                      <Typography sx={{ minWidth: 160 }}>
                                        {field?.label}:
                                      </Typography>
                                    </Stack>
                                    <Select
                                      placeholder={field?.label}
                                      value={field?.field_value?.split(",") ?? []}
                                      sx={{ width: "215px" }}
                                      multiple
                                      onChange={(e) => handleFieldValueChange(
                                        e,
                                        field?.custom_id,
                                        "multi_choice",
                                        field?.label
                                      )}
                                      renderValue={(selected) => {
                                        const newArray = JSON.parse(field?.setting)
                                          ?.filter((item) => selected?.join()?.split(",")?.includes(item?.option)
                                          );
                                        return newArray?.map((item) => item?.option)?.join(", ");
                                      } }
                                      disabled={!user?.acc || !user?.acc[`acc_custom_e_${field?.id}`]}
                                    >
                                      {JSON.parse(field?.setting)
                                        ?.sort((a, b) => a?.option?.localeCompare(b?.option))
                                        ?.map((s) => (
                                          <MenuItem key={s?.id} value={s?.option}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                              <Checkbox
                                                checked={field?.field_value?.includes(s?.option)}
                                                sx={{ p: "3px", mr: 1 }} />
                                              <Box
                                                sx={{
                                                  backgroundColor: s?.color ?? 'primary.main',
                                                  maxWidth: 1,
                                                  height: 1,
                                                  padding: 1,
                                                  borderRadius: 20,
                                                }} />
                                              <Typography>{s?.option}</Typography>
                                            </Stack>
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  </Stack>
                                  {field?.field_value && (
                                    <Grid spacing={1} container>
                                      {field?.field_value?.split(",")?.map((val) => (
                                        <Grid item xs={4} key={val}>
                                          <Chip
                                            label={val}
                                            onDelete={() => handleMultiChipDelete(
                                              field?.custom_id,
                                              val,
                                              field?.id,
                                              field?.field_value
                                            )} />
                                        </Grid>
                                      ))}
                                    </Grid>
                                  )}
                                </Stack>
                              )}
                              {field?.field_type === "boolean" && (
                                <Stack
                                  key={field?.id}
                                  direction="row"
                                  alignItems="center"
                                  spacing={3}
                                  sx={{ maxWidth: "500px" }}
                                >
                                  <Stack direction="row" gap={1}>
                                    <Typography sx={{ minWidth: 160 }}>
                                      {field?.label}:
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="center" width={240}>
                                    <Switch
                                      checked={field?.field_value !== undefined &&
                                        ["true", "false"].includes(field?.field_value)
                                        ? JSON.parse(field?.field_value)
                                        : false}
                                      onChange={(e) => handleFieldValueChange(
                                        e,
                                        field?.custom_id,
                                        "switch",
                                        field?.label
                                      )}
                                      disabled={!user?.acc || !user?.acc[`acc_custom_e_${field?.id}`]} />
                                  </Stack>
                                </Stack>
                              )}
                              {!JSON.parse(field?.setting)?.length &&
                                field?.field_type !== "boolean" && (
                                  <Stack
                                    key={field?.id}
                                    direction="row"
                                    alignItems="center"
                                    sx={{ maxWidth: "500px" }}
                                    spacing={3}
                                  >
                                    <Stack direction="row" gap={1}>
                                      <Typography sx={{ minWidth: 160 }}>
                                        {field?.label}:
                                      </Typography>
                                    </Stack>
                                    <OutlinedInput
                                      sx={{ maxWidth: "215px" }}
                                      placeholder={field?.label}
                                      value={field?.field_value}
                                      onChange={(e) => handleFieldValueChange(
                                        e,
                                        field?.custom_id,
                                        "default",
                                        field?.label
                                      )}
                                      disabled={!user?.acc || !user?.acc[`acc_custom_e_${field?.id}`]} />
                                  </Stack>
                                )}
                            </Stack>
                          );
                        })}
                      </Stack>
                    )}
                    <Stack>
                      {user?.acc?.acc_e_client_distribute_clients === undefined ||
                        user?.acc?.acc_e_client_distribute_clients ? (
                        <Controller
                          name="distribute"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <FormControlLabel
                              sx={{ width: 'fit-content' }}
                              control={
                                <Checkbox
                                  checked={value}
                                  onChange={(event) => onChange(event?.target?.checked)}
                                />
                              }
                              label="Distribute selected clients equally"
                            />
                          )}
                        />
                      ) : null}

                      {user?.acc?.acc_e_client_reassign_clients === undefined ||
                        user?.acc?.acc_e_client_reassign_clients ? (
                        <Controller
                          name="reassign"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <FormControlLabel
                              sx={{ width: 'fit-content' }}
                              control={
                                <Checkbox
                                  checked={value}
                                  onChange={(event) => onChange(event?.target?.checked)}
                                />
                              }
                              label="Reassign selected clients"
                            />
                          )}
                        />
                      ) : null}

                      {user?.acc?.acc_e_client_shuffle_selected === undefined ||
                        user?.acc?.acc_e_client_shuffle_selected ? (
                        <Controller
                          name="shuffle_selected"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <FormControlLabel
                              sx={{ width: 'fit-content' }}
                              control={
                                <Checkbox
                                  checked={value}
                                  onChange={(event) => onChange(event?.target?.checked)}
                                />
                              }
                              label="Shuffle selected clients in distribution"
                            />
                          )}
                        />
                      ) : null}
                    </Stack>

                    <Stack direction="row" sx={{ width: 1 }} gap={2} alignItems="center">
                      <SelectMenu
                        control={control}
                        label="Select a Desk"
                        name="desk_id"
                        list={desks}
                      />
                    </Stack>

                    <Stack spacing={1}>
                      {user?.acc?.acc_v_agent_assign_everyone === undefined ||
                        user?.acc?.acc_v_agent_assign_everyone ? (
                        <Stack>
                          <FormControlLabel
                            sx={{ width: 'fit-content' }}
                            control={
                              <Checkbox
                                checked={assignToEveryone}
                                onChange={(event) => setAssignToEveryone(event?.target?.checked)}
                              />
                            }
                            label="Assign to everyone"
                          />
                        </Stack>
                      ) : null}

                      {!assignToEveryone && (
                        <Stack spacing={2}>
                          <Stack>
                            <MultiSelectMenu
                              control={control}
                              label="Select Agents"
                              name="agent_ids"
                              list={members}
                              disabled={!deskId}
                              isSearch
                            />
                          </Stack>
                          {memberChip?.length > 0 && (
                            <Stack
                              alignItems="center"
                              direction="row"
                              flexWrap="wrap"
                              gap={1}
                              sx={{ px: 3 }}
                            >
                              <ChipSet
                                chips={memberChip}
                                handleRemoveChip={(val) => handleRemoveChip(val, "agent_ids")}
                              />
                            </Stack>
                          )}
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </Scrollbar>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    pb: 2,
                    pt: 2,
                    px: 3,
                  }}
                >
                  <Button color="inherit" sx={{ mr: 2 }} onClick={handleClose} disabled={isLoading}>
                    Cancel
                  </Button>
                  <LoadingButton
                    loading={isLoading}
                    disabled={isLoading || !deskId || (!agentIds?.length && !assignToEveryone)}
                    variant="contained"
                    type="submit"
                  >
                    <Typography variant="subtitle2" py={"1px"}>
                      Assign
                    </Typography>
                  </LoadingButton>
                </Box>
              </form>
            </Stack>
          )}
          {assignTo === 'desks' && (
            <Stack>
              <form onSubmit={handleSubmit(handleAssignMultiDesks)}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography
                      color="primary"
                      sx={{ cursor: "pointer", px: 1, fontWeight: 600 }}
                      onClick={onBulkFieldsOpen}
                    >
                      Update custom fields
                    </Typography>
                  </Stack>
                  {fields?.length > 0 ? (
                    <Stack spacing={1} px={2}>
                      {fields?.map((field, index) => {
                        const setting = JSON.parse(field?.setting);
                        const accessKey = `acc_custom_v_${field?.id}`;
                        const accessEditkey = `acc_custom_e_${field?.id}`;
                        const viewAccess = user?.acc && user?.acc[accessKey];
                        const editAccess =
                          user?.acc && user?.acc[accessEditkey];

                        if (!viewAccess && viewAccess !== undefined)
                          return null;

                        return (
                          <Stack key={index}>
                            {setting?.length &&
                              field?.field_type === "multi_choice_radio" && (
                                <Stack
                                  key={field?.custom_id}
                                  direction="row"
                                  alignItems="center"
                                  spacing={3}
                                  sx={{ maxWidth: "500px" }}
                                >
                                  <Stack direction="row" gap={1}>
                                    <Typography sx={{ minWidth: 160 }}>
                                      {field?.label}:
                                    </Typography>
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
                                        const accessOptionKey = `acc_custom_v_${field?.id
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
                                            value={s?.option}
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
                                              <Typography>
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
                              field?.field_type === "multi_choice" && (
                                <Stack spacing={1}>
                                  <Stack
                                    key={field?.csutom_id}
                                    direction="row"
                                    alignItems="center"
                                    spacing={3}
                                    sx={{ maxWidth: "500px" }}
                                  >
                                    <Stack direction="row" gap={1}>
                                      <Typography sx={{ minWidth: 160 }}>
                                        {field?.label}:
                                      </Typography>
                                    </Stack>
                                    <Select
                                      placeholder={field?.label}
                                      value={
                                        field?.field_value?.split(",") ?? []
                                      }
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
                                        !editAccess && editAccess !== undefined
                                      }
                                    >
                                      {setting
                                        ?.sort((a, b) =>
                                          a?.option?.localeCompare(b?.option)
                                        )
                                        ?.map((s) => {
                                          const accessOptionKey = `acc_custom_v_${field?.id
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
                                                <Typography>
                                                  {s?.option}
                                                </Typography>
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
                            {field?.field_type === "boolean" && (
                              <Stack
                                key={field?.id}
                                direction="row"
                                alignItems="center"
                                spacing={3}
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <Typography sx={{ minWidth: 160 }}>
                                    {field?.label}:
                                  </Typography>
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
                                  alignItems="center"
                                  sx={{ maxWidth: "500px" }}
                                  spacing={3}
                                >
                                  <Stack direction="row" gap={1}>
                                    <Typography sx={{ minWidth: 160 }}>
                                      {field?.label}:
                                    </Typography>
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
                  ) : null}
                  <Stack px={1}>
                    {user?.acc?.acc_e_client_distribute_clients === undefined ||
                      user?.acc?.acc_e_client_distribute_clients ? (
                      <Controller
                        name="distribute"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <FormControlLabel
                            sx={{ width: 'fit-content' }}
                            control={
                              <Checkbox
                                checked={value}
                                onChange={(event) =>
                                  onChange(event?.target?.checked)
                                }
                              />
                            }
                            label="Distribute selected clients equally"
                          />
                        )}
                      />
                    ) : null}

                    {user?.acc?.acc_e_client_reassign_clients === undefined ||
                      user?.acc?.acc_e_client_reassign_clients ? (
                      <Controller
                        name="reassign"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <FormControlLabel
                            sx={{ width: 'fit-content' }}
                            control={
                              <Checkbox
                                checked={value}
                                onChange={(event) =>
                                  onChange(event?.target?.checked)
                                }
                              />
                            }
                            label="Reassign selected clients"
                          />
                        )}
                      />
                    ) : null}

                    {user?.acc?.acc_e_client_shuffle_selected === undefined ||
                      user?.acc?.acc_e_client_shuffle_selected ? (
                      <Controller
                        name="shuffle_selected"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <FormControlLabel
                            sx={{ width: 'fit-content' }}
                            control={
                              <Checkbox
                                checked={value}
                                onChange={(event) =>
                                  onChange(event?.target?.checked)
                                }
                              />
                            }
                            label="Shuffle selected clients in distribution"
                          />
                        )}
                      />
                    ) : null}
                  </Stack>

                  <Stack
                    direction="row"
                    sx={{ width: 1 }}
                    gap={2}
                    alignItems="center"
                  >
                    <Box direction="row" sx={{ width: 1 }}>
                      <MultiSelectMenu
                        control={control}
                        label="Select Desks"
                        name="desk_ids"
                        list={desks}
                        isSearch
                      />
                    </Box>
                  </Stack>

                  {deskChip?.length > 0 && (
                    <Stack
                      alignItems="center"
                      direction="row"
                      flexWrap="wrap"
                      gap={1}
                      sx={{ px: 1 }}
                    >
                      <ChipSet
                        chips={deskChip}
                        handleRemoveChip={(val) =>
                          handleRemoveChip(val, "desk_ids")
                        }
                      />
                    </Stack>
                  )}
                </Stack>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    pb: 2,
                    pt: 2,
                    px: 3,
                  }}
                >
                  <Button color="inherit" sx={{ mr: 2 }} onClick={handleClose} disabled={isLoading}>
                    Cancel
                  </Button>
                  <LoadingButton
                    loading={isLoading}
                    disabled={isLoading || !deskIds?.length}
                    variant="contained"
                    type="submit"
                  >
                    <Typography variant="subtitle2" py={"1px"}>
                      Assign
                    </Typography>
                  </LoadingButton>
                </Box>
              </form>
            </Stack>
          )}
        </Stack>
      </Container>
      <ConfirmationDialog
          open={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={() => {
            if (pendingFormData) {
              if (assignTo === 'agents') {
                executeAssignAgents(pendingFormData);
              } else if (assignTo === 'desks') {
                executeAssignMultiDesks(pendingFormData);
              } else if (assignTo === 'team') {
                executeAssignTeams(pendingFormData);
              }
            }
            setShowConfirmation(false);
            setPendingFormData(null);
          }}
          title="Confirm Assignment"
          subtitle={hasFieldsWithValues() 
            ? `Are you sure you want to assign ${getClientCount()} and change ${getFieldNames()}? This action cannot be reverted.`
            : `Are you sure you want to assign ${getClientCount()}? This action cannot be reverted.`
          }
          confirmTitle="Confirm"
        />
    </Dialog>
  );
};
