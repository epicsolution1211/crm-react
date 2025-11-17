import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { SelectMenu } from "src/components/customize/select-menu";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { Iconify } from 'src/components/iconify';

export const CustomerTeamStep = ({ data, onBack, onNext, isPending, teamList, deskList }) => {
  const { control, handleSubmit, reset } = useForm();
  const { user } = useAuth();

  const [agentList, setAgentList] = useState([]);

  const team_id = useWatch({ control, name: "team_id" });
  const agent_id = useWatch({ control, name: "agent_id" });
  const desk_id = useWatch({ control, name: "desk_id" });

  const handleNext = () => {
    onNext({ team_id, agent_id, desk_id });
  };

  const handleBack = () => {
    const formData = { team_id, agent_id, desk_id };
    onBack(formData);
  };

  const getAgents = async () => {
    try {
      const res = await settingsApi.getMembers([], "*", {
        desk_ids: [desk_id],
        active: true,
      });
      const agentList = res?.accounts
        ?.filter(account => !account?.admin_hide)
        ?.map((account) => ({
          label: account?.first_name
            ? `${account?.first_name} ${account?.last_name}`
            : account?.email,
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

  useEffect(() => {
    getAgents();
  }, [desk_id]);

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit(handleNext)}>
      <Stack spacing={3}>
        <Stack spacing={3}>
          <SelectMenu
            control={control}
            label="Desk"
            name="desk_id"
            list={deskList ?? []}
          />

          {user?.acc?.acc_e_client_team === undefined ||
            user?.acc?.acc_e_client_team ? (
            <SelectMenu
              control={control}
              label="Team"
              name="team_id"
              list={teamList}
            />
          ) : null}
          {(user?.acc?.acc_e_client_agent === undefined ||
            user?.acc?.acc_e_client_agent) ? (
            <SelectMenu
              control={control}
              label="Agent"
              name="agent_id"
              list={agentList}
            />
          ) : null}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
        <Button color="inherit" onClick={() => handleBack()}>
          Back
        </Button>
        <LoadingButton
          loading={isPending}
          disabled={isPending}
          endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
          type="submit"
          variant="contained"
        >
          Next
        </LoadingButton>
        </Stack>
      </Stack>
    </form>
  );
};
