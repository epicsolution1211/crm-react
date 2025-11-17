import { useEffect, useState, useMemo } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { Iconify } from 'src/components/iconify';
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { SelectMenu } from "src/components/customize/select-menu";
import { customersApi } from "src/api/customers";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { useRouter } from "src/hooks/use-router";
import { useAuth } from "src/hooks/use-auth";

export const useDesks = () => {
  const [desks, setDesks] = useState([]);
  const [deskInfo, setDeskInfo] = useState([]);
  const { user } = useAuth();

  const getDesks = async () => {
    try {
      const res = await settingsApi.getDesk();
      setDeskInfo(
        res?.desks?.map((desk) => ({
          label: desk?.name,
          value: desk?.id,
        }))
      );
      setDesks(
        res?.desks?.map((desk) => ({
          label: desk?.name,
          value: desk?.id,
          isHidden: user?.acc?.acc_e_client_desk
            ? false
            : user?.acc?.acc_e_client_self_desk &&
              user?.desk_ids?.includes(desk?.id)
              ? false
              : true,
        }))
      );
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getDesks();
  }, []);
  return { desks, deskInfo };
};

export const CustomerDesk = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, setValue } = useForm();
  const { user } = useAuth();
  const { customerInfo, teams, onGetClient = () => {} } = props;

  const agent_ids = useWatch({ control, name: "agent_ids" });
  const team_ids = useWatch({ control, name: "team_ids" });
  const desk_id = useWatch({ control, name: "desk_id" });
  const desk_id_origin = useWatch({ control, name: "desk_id_origin" });

  const [agentList, setAgentList] = useState([]);
  const [updatedAgentList, setUpdatedAgentList] = useState([]);

  const agentChip = useMemo(() => {
    if (agent_ids) {
      let newChips = null;
      if (agent_ids instanceof Array) {
        const assignedAgents = agentList?.filter((item) => agent_ids?.includes(parseInt(item.value)));
        newChips = assignedAgents?.map((assigned) => {
          return {
            displayValue: assigned?.label,
            value: assigned?.value,
            label: "Agent",
            extraInfo: assigned?.teams?.length && (
              <Stack direction="row" alignItems="center">
                <Typography fontSize={12}>Teams:</Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                  {assigned?.teams?.map((team) => (
                    <Typography fontSize={12} key={team}>
                      {team}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            ),
          };
        });
      } else {
        const assignedAgents = agentList?.filter((item) => agent_ids == item.value);
        newChips = assignedAgents?.map((assigned) => {
          return {
            displayValue: assigned?.label,
            value: assigned?.value,
            label: "Agent",
            extraInfo: assigned?.teams?.length && (
              <Stack direction="row" alignItems="center">
                <Typography fontSize={12}>Teams:</Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                  {assigned?.teams?.map((team) => (
                    <Typography fontSize={12} key={team}>
                      {team}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            ),
          };
        });
      }

      if (!agent_ids) {
        setValue("agent_ids", []);
      }
      return newChips;
    }
  }, [agent_ids, agentList]);

  const teamChip = useMemo(() => {
    const newChips = team_ids?.map((selected) => {
      const chip = teams?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Team",
      };
    });
    if (!agent_ids) {
      setValue("agent_ids", []);
    }
    return newChips;
  }, [team_ids, teams]);

  const handleRemoveChip = (value, type) => {
    if (type === "agent_ids") {
      if (agent_ids instanceof Array) {
        const newStatus = [...agent_ids].filter((item) => item != value);
        setValue("agent_ids", newStatus);
      } else {
        setValue("agent_ids", []);
      }
    }
    if (type === "team_ids") {
      const newStatus = [...team_ids].filter((item) => item !== value);
      setValue("team_ids", newStatus);
    }
  };

  const { desks } = useDesks();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const agentReq = {
        client_ids: [customerInfo?.client?.id],
        assign_agent_ids: agent_ids instanceof Array ? agent_ids : [Number(agent_ids)],
        reassign: data.reassign ? true : false,
        assign_all: true,
      };
      const teamReq = {
        client_ids: [customerInfo?.client?.id],
        assign_team_ids: team_ids,
        reassign: data.reassign ? true : false,
      };
      if (data.desk_id) {
        agentReq["assign_desk_ids"] = [data.desk_id];
      }

      const non_agent_ids = customerInfo?.client_agents
        ?.map((item) => item.id)
        ?.filter((item) => {
          if (agent_ids instanceof Array) {
            return !agent_ids?.includes(item);
          } else {
            return agent_ids != item;
          }
        });
      if (non_agent_ids.length > 0) {
        agentReq.non_agent_ids = non_agent_ids;
      }

      const non_team_ids = customerInfo?.client_teams
        ?.map((item) => item.id)
        ?.filter((item) => !team_ids?.includes(item));
      if (non_team_ids.length > 0) {
        teamReq.non_team_ids = non_team_ids;
      }

      await customersApi.assignCustomerAgents(agentReq);
      await customersApi.assignCustomerTeams(teamReq);
      setIsLoading(false);
      toast.success("Customer assignee successfully updated!");
      setTimeout(() => {
        onGetClient();
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (desk_id) {
      const newList = [...agentList]?.filter((item) => {
        return item.desks?.includes(desk_id)
      }
      );
      if (
        user?.acc?.acc_e_assign_multiple_agents === undefined ||
        user?.acc?.acc_e_assign_multiple_agents
      ) {
        setUpdatedAgentList(newList);
      } else {
        setUpdatedAgentList([
          ...newList,
        ]);
      }
      if (desk_id_origin !== desk_id) {
        setValue("agent_ids", []);
      }
    } else {
      if (
        user?.acc?.acc_e_assign_multiple_agents === undefined ||
        user?.acc?.acc_e_assign_multiple_agents
      ) {
        setUpdatedAgentList(agentList);
      } else {
        setUpdatedAgentList([
          ...agentList,
        ]);
      }
    }
  }, [desk_id, agentList, user]);

  useEffect(() => {
    if (customerInfo) {
      // const desk = desks?.find(
      //   (desk) => desk?.value === customerInfo?.client?.desk_id
      // );
      if (customerInfo?.client?.desk_id) {
        setValue("desk_id", customerInfo?.client?.desk_id);
        setValue("desk_id_origin", customerInfo?.client?.desk_id);
      } else {
        setValue("desk_id", null);
        setValue("desk_id_origin", null);
      }
      setValue(
        "agent_ids",
        customerInfo?.client_agents?.map((item) => item.id)
      );
      setValue(
        "team_ids",
        customerInfo?.client_teams?.map((item) => item.id)
      );
      // if (!desk) {
      //   setValue("desk_id", customerInfo?.client?.desk_name);
      // }
    }
  }, [customerInfo, user, desks]);

  useEffect(() => {
    setValue("reassign", true);
  }, []);

  const getAgents = async () => {
    try {
      const res = await settingsApi.getMembers([], "*", { per_page: 10000, active: true });

      const agentList = res?.accounts
        ?.filter((account) => !account?.admin_hide)
        ?.map((agent) => ({
          label: agent?.first_name
            ? `${agent?.first_name} ${agent?.last_name}`
            : agent?.email,
          value: agent?.id?.toString(),
          avatar: agent?.avatar,
          teams: agent?.team_names ?? [],
          desks: agent?.desk_ids,
        }))
        // ?.filter(
        //   (item, index, self) =>
        //     index === self.findIndex((t) => t?.label === item?.label)
        // );
      setAgentList(agentList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (customerInfo) {
      getAgents();
    }
  }, [customerInfo]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card {...props}>
          <CardHeader title="Assignee" />
          <CardContent
            sx={{
              pt: 2,
              pb: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Stack
              direction="row"
              sx={{ width: 1 }}
              gap={2}
              alignItems="center"
            >
              <Box direction="row" sx={{ width: 1 }}>
                <SelectMenu
                  control={control}
                  label="Select a Desk"
                  name="desk_id"
                  list={desks}
                  access={user?.acc}
                  selfDesks={user?.desk_ids}
                  isDesk
                />
              </Box>
              {user?.acc?.acc_e_client_desk && (
                <IconButton
                  onClick={() => router.push(paths.dashboard.settings)}
                  sx={{ '&:hover': { color: 'primary.main' }, color:'text.secondary', mt: 4}}
                >
                  <Tooltip title="Edit Desk">
                    <Iconify icon="carbon:settings-edit" />
                  </Tooltip>
                </IconButton>
              )}
            </Stack>

            {user?.acc?.acc_v_client_team === undefined ||
              user?.acc?.acc_v_client_team ? (
              <Stack direction="column" gap={1} sx={{ width: 1 }}>
                <MultiSelectMenu
                  control={control}
                  label="Select Teams"
                  name="team_ids"
                  list={teams}
                  disabled={!user?.acc?.acc_e_client_team}
                />
                {teamChip?.length > 0 && (
                  <Stack
                    alignItems="center"
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ px: 1, pt: 1 }}
                  >
                    <ChipSet
                      chips={teamChip}
                      handleRemoveChip={(val) =>
                        user?.acc?.acc_e_client_team &&
                        handleRemoveChip(val, "team_ids")
                      }
                    />
                  </Stack>
                )}
              </Stack>
            ) : null}
            {(user?.acc?.acc_e_client_reassign_clients === undefined ||
              user?.acc?.acc_e_client_reassign_clients) &&
              desk_id !== props?.customerInfo?.client?.desk_id ? (
              <Controller
                name="reassign"
                control={control}
                render={({ field: { onChange, value = true } }) => (
                  <FormControlLabel
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
            {user?.acc?.acc_v_client_agent === undefined ||
              user?.acc?.acc_v_client_agent ? (
              <Stack direction="column" gap={1} sx={{ width: 1 }}>
                {user?.acc?.acc_e_assign_multiple_agents === undefined ||
                  user?.acc?.acc_e_assign_multiple_agents ? (
                  <MultiSelectMenu
                    isSearch
                    control={control}
                    label="Select Agents"
                    name="agent_ids"
                    list={updatedAgentList}
                    disabled={!user?.acc?.acc_e_client_agent}
                  />
                ) : (
                  <SelectMenu
                    isSearch
                    control={control}
                    label="Select Agents"
                    name="agent_ids"
                    list={updatedAgentList}
                    disabled={!user?.acc?.acc_e_client_agent}
                  />
                )}

                {agentChip?.length > 0 && (
                  <Stack
                    alignItems="center"
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ px: 1, pt: 1 }}
                  >
                    <ChipSet
                      chips={agentChip}
                      handleRemoveChip={(val) =>
                        user?.acc?.acc_e_client_agent &&
                        handleRemoveChip(val, "agent_ids")
                      }
                    />
                  </Stack>
                )}
              </Stack>
            ) : null}
          </CardContent>
          {user?.acc?.acc_v_client_agent ||
            user?.acc?.acc_v_client_team ||
            user?.acc?.acc_v_client_desk ? (
            <CardActions
              sx={{ display: "flex", justifyContent: "end", pb: 3, px: 3 }}
            >
              <Button disabled={isLoading} type="submit" variant="contained">
                Update
              </Button>
            </CardActions>
          ) : null}
        </Card>
      </form>
    </>
  );
};
