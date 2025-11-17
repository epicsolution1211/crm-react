import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import Stack from "@mui/material/Stack";
import TuneIcon from "@mui/icons-material/Tune";

import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { SelectMenu } from "src/components/customize/select-menu";

export const LandingCustomerCustomerAssignee = ({ customer }) => {
  const { control, setValue } = useForm();

  const agentChip = useMemo(() => {
    return [{
      displayValue: customer?.agents[0]?.name,
      value: customer?.agents[0]?.name,
      label: "Agent",
    }];
  }, [customer]);

  const teamChip = useMemo(() => {
    return [{
      displayValue: customer?.client_teams[0]?.name,
      value: customer?.client_teams[0]?.name,
      label: "Team",
    }];
  }, [customer]);

  const desks = useMemo(() => {
    if (customer) {
      return [{ label: customer?.desk_name, value: customer?.desk_name }]
    }
  }, [customer])

  const teams = useMemo(() => {
    if (customer) {
      return [{ label: customer?.client_teams[0]?.name, value: 1 }]
    }
  }, [customer])

  const agents = useMemo(() => {
    if (customer) {
      return [{ label: customer?.agents[0]?.name, value: 1 }]
    }
  }, [customer])

  const currentAgent = useWatch({ control, name: "agent_ids" });
  const currentTeam = useWatch({ control, name: "team_ids" });

  useEffect(() => {
    if (customer) {
      setValue('desk_id', customer?.desk_name);
      setValue('agent_ids', [1]);
      setValue('team_ids', [1]);
    }
  }, [customer])

  return (
    <>
      <Card>
        <CardHeader title="Assignee" />
        <CardContent
          sx={{
            pt: 2,
            pb: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
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
              />
            </Box>
            <IconButton
              sx={{ mt: 3 }}
              color="inherit"
            >
              <Tooltip acc_v_client_team title="Edit Desk">
                <TuneIcon />
              </Tooltip>
            </IconButton>
          </Stack>

          <Stack direction="column" gap={1} sx={{ width: 1 }}>
            <MultiSelectMenu
              control={control}
              label="Select Teams"
              name="team_ids"
              list={teams}
            />
            {!!currentTeam?.length && (
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={1}
                sx={{ px: 1, pb: 2 }}
              >
                <ChipSet
                  handleRemoveChip={() => { }}
                  chips={teamChip}
                />
              </Stack>
            )}
          </Stack>
          <FormControlLabel
            control={<Checkbox />}
            label="Reassign selected clients"
          />
          <Stack direction="column" sx={{ width: 1 }}>
            <MultiSelectMenu
              control={control}
              label="Select Agents"
              name="agent_ids"
              list={agents}
            />
            {!!currentAgent?.length && (
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={1}
                sx={{ px: 1, pt: 1 }}
              >
                <ChipSet
                  handleRemoveChip={() => { }}
                  chips={agentChip}
                />
              </Stack>
            )}
          </Stack>
        </CardContent>
        <CardActions
          sx={{ display: "flex", justifyContent: "end", pb: 3, px: 3 }}
        >
          <Button type="submit" variant="contained">
            Update
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
