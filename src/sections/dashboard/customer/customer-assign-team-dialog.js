import { useCallback, useEffect, useState, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ChipSet } from "src/components/customize/chipset";
import { settingsApi } from "src/api/settings";
import { useMounted } from "src/hooks/use-mounted";
import { toast } from "react-hot-toast";
import { customersApi } from "src/api/customers";
import { useAuth } from "src/hooks/use-auth";
import MultiSelectMenu from "src/components/customize/multi-select-menu";

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

export const CustomerAssignTeamDialog = (props) => {
  const {
    open,
    onClose,
    filters = {},
    selectAll,
    selected,
    customFilters,
    onTicketsGet = () => {},
  } = props;
  const { teams } = useTeams();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, register, reset, setValue } = useForm();
  const { user } = useAuth();

  const team_ids = useWatch({ control, name: "team_ids" });

  const handleAssignTeams = async (data) => {
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
        };
        if (selectAll) {
          params["select_all"] = true;
        } else {
          params["client_ids"] = selected;
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
    onClose();
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

  const handleRemoveChip = (value, type) => {
    if (type === "team_ids") {
      if (team_ids instanceof Array) {
        const newStatus = [...team_ids].filter((item) => item !== value);
        setValue("team_ids", newStatus);
      } else {
        setValue("team_ids", []);
      }
    }
  };

  useEffect(() => {
    reset();
    setValue("distribute", true);
    setValue("reassign", true);
    setValue("team_ids", []);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">Assign team(s)</Typography>
          </Stack>
          <Stack>
            <form noValidate onSubmit={handleSubmit(handleAssignTeams)}>
              <Stack spacing={3}>
                <Stack spacing={2}>
                  <Typography variant="h7" px={1}>
                    Subject
                  </Typography>
                  <TextField
                    autoFocus
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
                      sx={{ px: 3 }}
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
                  }}
                >
                  <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
                    Cancel
                  </Button>
                  <LoadingButton
                    loading={isLoading}
                    sx={{
                      width: 90,
                    }}
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                  >
                    Assign
                  </LoadingButton>
                </Box>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
