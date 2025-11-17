import { useEffect, useMemo, useState, useRef } from "react";
import * as yup from "yup";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { toast } from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { settingsApi } from "src/api/settings";
import { SelectMenu } from "src/components/customize/select-menu";
import { useAuth } from "src/hooks/use-auth";
import { brandsApi } from "src/api/lead-management/brand";
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { useSettings } from "src/hooks/use-settings";

const validationSchema = yup.object({
  team_id: yup.string().required("Team is a required field"),
});

export const TrafficManagement = ({ affiliate, updateAffiliate }) => {
  const { user } = useAuth();
  const settings = useSettings();
  const { control, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [teamList, setTeamList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [deskList, setDeskList] = useState([]);
  const [internalBrandsList, setInternalBrandsList] = useState([]);
  const [routeLeads, setRouteLeads] = useState(false);
  const [distributeClients, setDistributeClients] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs to track previous values and prevent infinite loops
  const prevValues = useRef({
    team_id: null,
    agent_id: null,
    desk_ids: null,
    internal_brand_id: null,
    login_internal_brand_id: null,
  });

  const desk_ids = useWatch({ control, name: "desk_ids" });
  const team_id = useWatch({ control, name: "team_id" });
  const agent_id = useWatch({ control, name: "agent_id" });
  const internal_brand_id = useWatch({ control, name: "internal_brand_id" });
  const login_internal_brand_id = useWatch({ control, name: "login_internal_brand_id" });

  const getBrands = async () => {
    try {
      const res = await brandsApi.getInternalBrands();
      const brandsInfo = res?.internal_brands?.map((brand) => ({
        label: brand?.company_name,
        value: brand?.id,
      }));
      setInternalBrandsList([
        {
          label: "Don't send",
          value: 0,
        },
        ...brandsInfo,
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const getDesk = async () => {
    try {
      const res = await settingsApi.getDesk();
      const deskList = res?.desks
        ?.map((desk) => ({
          label: desk?.name,
          value: desk?.id?.toString(),
          color: desk?.color ?? settings?.colorPreset,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setDeskList(deskList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAgents = async () => {
    try {
      const res = await settingsApi.getMembers([], "*", { active: true, desk_ids });
      const agentList = res?.accounts
        ?.filter(account => !account?.admin_hide)
        ?.map((account) => ({
          label: `${account?.first_name} ${account?.last_name}`,
          value: account?.id?.toString(),
          avatar: account?.avatar,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        )
        ?.sort((a, b) => {
          const nameA = a.label.toLowerCase();
          const nameB = b.label.toLowerCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
      setAgentList([
        {
          label: "None",
          value: 0,
        },
        ...agentList,
      ]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getSkillTeams = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");

      const teamInfo = res?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([
        {
          label: "None",
          value: 0,
        },
        ...teamInfo,
      ]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getAgents();
  }, [desk_ids]);

  useEffect(() => {
    getSkillTeams();
    getDesk();
    getBrands();
  }, []);

  useEffect(() => {
    if (affiliate) {
      setValue("team_id", affiliate?.aff_routing_team_id ?? 0);
      setValue("agent_id", affiliate?.aff_routing_agent_id?.toString() ?? 0);
      setValue("desk_ids", affiliate?.aff_routing_desks_ids ?? []);
      setValue("internal_brand_id", affiliate?.internal_brand_id);
      setValue("login_internal_brand_id", affiliate?.login_internal_brand_id);
      setRouteLeads(affiliate?.aff_internal_routing);
      setDistributeClients(affiliate?.auto_l_distribution);
      
      // Set initial values in refs
      prevValues.current = {
        team_id: affiliate?.aff_routing_team_id ?? 0,
        agent_id: affiliate?.aff_routing_agent_id?.toString() ?? 0,
        desk_ids: affiliate?.aff_routing_desks_ids ?? [],
        internal_brand_id: affiliate?.internal_brand_id,
        login_internal_brand_id: affiliate?.login_internal_brand_id,
      };
      
      setIsInitialized(true);
    }
  }, [affiliate]);

  // Watch for changes in form values and update backend only when values actually change
  useEffect(() => {
    if (isInitialized && team_id !== undefined && team_id !== prevValues.current.team_id) {
      prevValues.current.team_id = team_id;
      handleTeamChange(team_id);
    }
  }, [team_id, isInitialized]);

  useEffect(() => {
    if (isInitialized && agent_id !== undefined && agent_id !== prevValues.current.agent_id) {
      prevValues.current.agent_id = agent_id;
      handleAgentChange(agent_id);
    }
  }, [agent_id, isInitialized]);

  useEffect(() => {
    if (isInitialized && desk_ids !== undefined && JSON.stringify(desk_ids) !== JSON.stringify(prevValues.current.desk_ids)) {
      prevValues.current.desk_ids = [...desk_ids];
      handleDeskChange(desk_ids);
    }
  }, [desk_ids, isInitialized]);

  useEffect(() => {
    if (isInitialized && internal_brand_id !== undefined && internal_brand_id !== prevValues.current.internal_brand_id) {
      prevValues.current.internal_brand_id = internal_brand_id;
      handleInternalBrandChange(internal_brand_id);
    }
  }, [internal_brand_id, isInitialized]);

  useEffect(() => {
    if (isInitialized && login_internal_brand_id !== undefined && login_internal_brand_id !== prevValues.current.login_internal_brand_id) {
      prevValues.current.login_internal_brand_id = login_internal_brand_id;
      handleLoginInternalBrandChange(login_internal_brand_id);
    }
  }, [login_internal_brand_id, isInitialized]);

  const handleUpdateField = async (fieldName, value) => {
    try {
      const request = {};
      request[fieldName] = value;
      await updateAffiliate(affiliate?.id, request);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChangeRouteLeads = async () => {
    try {
      const newValue = !routeLeads;
      setRouteLeads(newValue);
      await handleUpdateField("aff_internal_routing", newValue);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChangeDistributeClients = async () => {
    try {
      const newValue = !distributeClients;
      setDistributeClients(newValue);
      await handleUpdateField("auto_l_distribution", newValue);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleTeamChange = async (value) => {
    try {
      await handleUpdateField("aff_routing_team_id", value);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleAgentChange = async (value) => {
    try {
      await handleUpdateField("aff_routing_agent_id", value);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDeskChange = async (value) => {
    try {
      await handleUpdateField("aff_routing_desk_ids", value);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleInternalBrandChange = async (value) => {
    try {
      await handleUpdateField("internal_brand_id", value);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleLoginInternalBrandChange = async (value) => {
    try {
      await handleUpdateField("login_internal_brand_id", value);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleRemoveChip = (value, type) => {
    if (type === "desk_ids") {
      const newStatus = [...desk_ids].filter((item) => item !== value);
      setValue("desk_ids", newStatus);
    }
  };

  const deskChip = useMemo(() => {
    const newChips = desk_ids?.map((selected) => {
      const chip = deskList?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Desk",
      };
    });
    return newChips;
  }, [desk_ids, deskList]);

  return (
    <Card sx={{ minHeight: { md: 300, lg: 520 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={4}
        sx={{ pt: 4, px: 4, pb: 2 }}
      >
        <Typography variant="h5">Traffic Management</Typography>
      </Stack>

      <Stack spacing={2} sx={{ px: 5, mt: 3, pb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography>Route all leads to internal brand:</Typography>
          <Switch
            checked={routeLeads}
            onChange={handleChangeRouteLeads}
            disabled={!user?.acc?.acc_e_lm_aff}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <SelectMenu
            control={control}
            label="Routing team"
            name="team_id"
            list={teamList}
          />
        </Stack>

        <Stack spacing={2}>
          <MultiSelectMenu
            control={control}
            label="Routing desk (optional)"
            name="desk_ids"
            list={deskList}
          />
          {deskChip?.length > 0 && (
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ px: 1, pb: 2 }}
            >
              <ChipSet
                chips={deskChip}
                handleRemoveChip={(val) => handleRemoveChip(val, "desk_ids")}
              />
            </Stack>
          )}
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography>Distribute created clients to agents in selected desks:</Typography>
          <Switch
            checked={distributeClients}
            onChange={handleChangeDistributeClients}
          />
        </Stack>

        {!distributeClients && (
          <Stack direction="row" justifyContent="space-between">
            <SelectMenu
              control={control}
              isSearch
              label="Routing agent (optional)"
              name="agent_id"
              list={agentList}
            />
          </Stack>
        )}

        <Stack direction="row" justifyContent="space-between">
          <SelectMenu
            control={control}
            name="internal_brand_id"
            label="Send credential email"
            list={internalBrandsList}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <SelectMenu
            control={control}
            name="login_internal_brand_id"
            label="Login Domain"
            list={internalBrandsList}
          />
        </Stack>
      </Stack>
    </Card>
  );
};
