import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";

import { SelectMenu } from "src/components/customize/select-menu";
import { settingsApi } from "src/api/settings";
import { useDesks } from "../../customer/customer-desk";
import { Iconify } from 'src/components/iconify';

export const TeamAgentStep = ({ onBack, onNext, teamAgentInfo }) => {
  const { handleSubmit, control, reset } = useForm();

  const { deskInfo } = useDesks();

  const [teams, setTeams] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [agentList, setAgentList] = useState([]);

  const getTeamsInfo = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      setTeams(res);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAgents = async () => {
    try {
      const res = await settingsApi.getMembers();
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
        );
      setAgentList(agentList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const onSubmit = (data) => {
    onNext(data);
  };

  useEffect(() => {
    getAgents();
    getTeamsInfo();
  }, []);

  useEffect(() => {
    if (teams) {
      const teamInfo = teams?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    }
  }, [teams]);

  useEffect(() => {
    if (teamAgentInfo) {
      reset(teamAgentInfo);
    }
  }, [teamAgentInfo]);

  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack pt={2} flexDirection="column" spacing={2}>
          <SelectMenu
            control={control}
            label="Desk"
            name="desk_id"
            list={deskInfo}
          />
          <SelectMenu
            control={control}
            label="Team"
            name="team_id"
            list={teamList}
          />
          <SelectMenu
            control={control}
            label="Agent"
            name="agent_id"
            list={agentList}
          />
        </Stack>
        <Stack alignItems="center" direction="row" sx={{ mt: 2 }} spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            type="submit"
            variant="contained"
          >
            Continue
          </Button>
          <Button color="inherit" onClick={onBack}>
            Back
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
