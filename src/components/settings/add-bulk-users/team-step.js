import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { Iconify } from "src/components/iconify";
import { settingsApi } from "src/api/settings";

export const TeamStep = ({ onNext, onBack }) => {
  const { handleSubmit, reset, control, setValue } = useForm();

  const [teamList, setTeamList] = useState([]);
  const [deskList, setDeskList] = useState([]);
  const [roleTemplates, setRoleTemplates] = useState([]);
  const [selectedRoleTemplate, setSelectedRoleTemplate] = useState(null);
  const [roleError, setRoleError] = useState(false);

  const getSkillTeams = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");

      const teamInfo = res?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    } catch (error) {
      console.error("error: ", error);
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

  const getRoleTemplates = async () => {
    try {
      const { temp_rolls: templates } = await settingsApi.getRoles();
      setRoleTemplates(templates);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const team_ids = useWatch({ control, name: "team_ids" });
  const desk_ids = useWatch({ control, name: "desk_ids" });

  const onSubmit = (data) => {
    if (!selectedRoleTemplate) {
      setRoleError(true);
      toast.error('Please select a role');
      return;
    }
    setRoleError(false);
    onNext({ data, role: selectedRoleTemplate });
  };

  const teamChip = useMemo(() => {
    const newChips = team_ids?.map((selected) => {
      const chip = teamList?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Team",
      };
    });
    return newChips;
  }, [team_ids, teamList]);

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

  const handleRemoveChip = (value, type) => {
    if (type === "team_ids") {
      const newStatus = [...team_ids].filter((item) => item !== value);
      setValue("team_ids", newStatus);
    }
    if (type === "desk_ids") {
      const newStatus = [...desk_ids].filter((item) => item !== value);
      setValue("desk_ids", newStatus);
    }
  };

  const handleChangeTemplate = async (e) => {
    setSelectedRoleTemplate(e?.target?.value);
    setRoleError(false);
  };

  useEffect(() => {
    reset();
    getSkillTeams();
    getDesk();
    getRoleTemplates();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Stack spacing={3}>
          <Stack direction="column" gap={1} sx={{ width: 1 }}>
            <MultiSelectMenu
              control={control}
              label="Select Teams"
              name="team_ids"
              list={teamList}
            />
            {teamChip?.length > 0 && (
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={1}
                sx={{ px: 1, pb: 2 }}
              >
                <ChipSet
                  chips={teamChip}
                  handleRemoveChip={(val) => handleRemoveChip(val, "team_ids")}
                />
              </Stack>
            )}
          </Stack>

          <Stack direction="column" gap={1} sx={{ width: 1 }}>
            <MultiSelectMenu
              control={control}
              label="Select Desks"
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

          <Stack spacing={3} pb={2}>
            <Typography variant="h6">Select a role:</Typography>
            <Select
              value={selectedRoleTemplate}
              sx={{ mt: 1 }}
              onChange={handleChangeTemplate}
              error={roleError}
            >
              {roleTemplates?.map((temp) => (
                <MenuItem value={temp?.id} key={temp?.id}>
                  {temp?.name}
                </MenuItem>
              ))}
            </Select>
            {roleError && (
              <Typography color="error" variant="caption">
                Please select a role
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            variant="contained"
            type="submit"
          >
            Invite users
          </Button>
          <Button variant="contained" onClick={onBack}>
            Back
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
