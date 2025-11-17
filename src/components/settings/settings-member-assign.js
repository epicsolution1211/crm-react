import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import LoadingButton from '@mui/lab/LoadingButton';
import { useSettings } from "src/hooks/use-settings";

const {
  Card,
  CardHeader,
  CardContent,
  Stack,
  CardActions,
  FormControlLabel,
  Checkbox,
} = require("@mui/material");
const { default: MultiSelectMenu } = require("../customize/multi-select-menu");
const { ChipSet } = require("../customize/chipset");

export const SettingsMemberAssign = ({ member, onGetMember }) => {
  const [teamList, setTeamList] = useState([]);
  const [deskList, setDeskList] = useState([]);
  const settings = useSettings();
  const { user, refreshUser } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm();

  const team_ids = useWatch({ control, name: "team_ids" });
  const desk_ids = useWatch({ control, name: "desk_ids" });

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

  useEffect(() => {
    // reset();
    getSkillTeams();
    getDesk();
  }, []);

  useEffect(() => {
    if (member?.desk_ids) {
      setValue("desk_ids", member?.desk_ids);
    }
    if (member?.team_ids) {
      setValue("team_ids", member?.team_ids);
    }
    if (member?.admin_hide) {
      setValue("admin_hide", true);
    } else {
      setValue("admin_hide", false);
    }
  }, [member]);

  const onSubmit = async (data) => {
    try {
      const request = {
        account_id: member?.id,
      };
      if (data?.desk_ids?.length > 0) {
        request.desk_ids = data?.desk_ids;
      } else {
        request.desk_ids = [0];
      }
      if (data?.team_ids?.length > 0) {
        request.team_ids = data?.team_ids;
      } else {
        request.team_ids = [0];
      }
      request.admin_hide = data?.admin_hide;
      await settingsApi.updateMember(member?.id, request);
      await onGetMember();
      toast.success("Successfully updated!");
      setTimeout(() => {
        refreshUser();
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card
      sx={{
        '&.MuiCard-root': {
          boxShadow: 'none',
        },
      }}>
      <CardHeader title="Assign Desk and Team" />
      <CardContent>
        <Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="column" gap={1} sx={{ width: { md: 0.4, xs: 1 } }}>
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
                    handleRemoveChip={(val) =>
                      handleRemoveChip(val, "team_ids")
                    }
                  />
                </Stack>
              )}
            </Stack>

            <Stack direction="column" gap={1} sx={{ width: { md: 0.4, xs: 1 } }}>
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
                    handleRemoveChip={(val) =>
                      handleRemoveChip(val, "desk_ids")
                    }
                  />
                </Stack>
              )}
            </Stack>

            <Stack>
              <Controller
                name="admin_hide"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={user?.acc?.acc_e_setting_team === false}
                        checked={value ?? false}
                        onChange={(event) => onChange(event?.target?.checked)}
                      />
                    }
                    label="Hide account from lists"
                  />
                )}
              />
            </Stack>

            <CardActions
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                pb: 1,
                px: 1,
              }}
            >
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
              >
                Update
              </LoadingButton>
            </CardActions>
          </form>
        </Stack>
      </CardContent>
    </Card>
  );
};
