import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { SettingsAddSkillTeamModal } from "src/components/settings/settings-add-skill-team-modal";
import { SettingsEditSkillTeamModal } from "src/components/settings/settings-edit-skill-team-modal";
import { SettingsSkillAddMemberDrawer } from "src/components/settings/settings-skill-add-member-drawer";
import { SettingsSkillTeamTable } from "../settings-skill-team-table";
import { settingsApi } from "src/api/settings";
import { thunks } from "src/thunks/settings";
import { useDebounce } from "src/hooks/use-debounce";
import { ConfirmDialog } from "src/components/confirm-dialog-2";

export const Teams = ({ skillTeams = [], isLoading }) => {
  const dispatch = useDispatch();

  const [openAddSkillTeamDialog, setOpenAddSkillTeamDialog] = useState(false);
  const [openEditSkillTeamDialog, setOpenEditSkillTeamDialog] = useState(false);
  const [openSkillDrawer, setOpenSkillDrawer] = useState(false);
  const [openRemoveSkillTeamDialog, setOpenRemoveSkillTeamDialog] = useState(false);
  
  const [selectedSkillTeam, setSelectedSkillTeam] = useState(null);
  const [skillTeam, setSkillTeam] = useState({});
  const [searchSkillTeams, setSearchSkillTeams] = useState("");
  const [searchedTeams, setSearchedTeams] = useState([]);

  const searchQuery = useDebounce(searchSkillTeams, 500);

  const [isDeleteLoading, setIsDeleteLoading]  = useState(false);

  useEffect(() => {
    dispatch(thunks.getSkillTeams());
  }, [dispatch]);

  useEffect(() => {
    const getSkillTeam = async () => {
      const team = await settingsApi.getSkillTeam({ id: selectedSkillTeam });
      setSkillTeam(team);
    };
    if (selectedSkillTeam) getSkillTeam();
  }, [selectedSkillTeam]);

  useEffect(() => {
    if (searchQuery) {
      setSearchedTeams(skillTeams?.filter((teamInfo) => teamInfo?.team?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())));
    } else {
      setSearchedTeams(skillTeams);
    }
  }, [searchQuery, skillTeams]);

  const handleOpenAddSkillTeam = useCallback(() => {
    setOpenAddSkillTeamDialog(true);
  }, [setOpenAddSkillTeamDialog]);

  const handleCloseAddSkillTeam = useCallback(() => {
    setOpenAddSkillTeamDialog(false);
  }, [setOpenAddSkillTeamDialog]);

  const handleOpenRemoveSkillTeam = useCallback(
    (teamId) => {
      setSelectedSkillTeam(teamId);
      setOpenRemoveSkillTeamDialog(true);
    },
    [setOpenRemoveSkillTeamDialog]
  );

  const handleCloseRemoveSkillTeam = useCallback(() => {
    setSelectedSkillTeam(null);
    setOpenRemoveSkillTeamDialog(false);
  }, [setOpenRemoveSkillTeamDialog]);

  const handleSkillTeamSearch = useCallback(
    (e) => {
      setSearchSkillTeams(e.target.value);
    },
    [setSearchSkillTeams]
  );

  const handleOpenSkillDrawer = useCallback(
    (teamId) => {
      setSelectedSkillTeam(teamId);
      setSkillTeam({});
      setOpenSkillDrawer(true);
    },
    [setOpenSkillDrawer]
  );

  const handleCloseSkillDrawer = useCallback(() => {
    setSelectedSkillTeam(null);
    setOpenSkillDrawer(false);
  }, [setOpenSkillDrawer]);

  const handleOpenEditSkillTeam = useCallback(
    (teamId) => {
      setSelectedSkillTeam(teamId);
      setOpenEditSkillTeamDialog(true);
    },
    [setOpenEditSkillTeamDialog]
  );

  const handleCloseEditSkillTeam = useCallback(() => {
    setSelectedSkillTeam(null);
    setOpenEditSkillTeamDialog(false);
  }, [setOpenEditSkillTeamDialog]);

  const handleRemoveSkillTeam = useCallback(async () => {
    setIsDeleteLoading(true);
    await settingsApi.removeSkillTeam({ id: selectedSkillTeam });
    dispatch(thunks.getSkillTeams());
    toast.success("Skill team successfully removed!");
    setIsDeleteLoading(false);
    setOpenRemoveSkillTeamDialog(false);
  }, [dispatch, selectedSkillTeam]);

  const handleAddSkillTeam = useCallback(
    async (name) => {
      await settingsApi.createSkillTeam({ name });
      dispatch(thunks.getSkillTeams());
      toast("Skill team successfully created!");
      setOpenAddSkillTeamDialog(true);
    },
    [dispatch]
  );

  const handleUpdateSkillTeam = useCallback(
    async (name) => {
      await settingsApi.updateSkillTeam({ id: selectedSkillTeam, name });
      dispatch(thunks.getSkillTeams());
      toast("Skill team successfully updated!");
      setOpenEditSkillTeamDialog(false);
    },
    [dispatch, selectedSkillTeam]
  );

  return (
    <>
      <Stack flexDirection='column' sx={{ px: { xs: 0, md: 2 }, py: 2, gap: { xs: 2, md: 4 } }}>
        <Typography variant="h5">Skill Teams</Typography>
        <Stack spacing={3}>
          <Stack
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: { xs: 'center', md: 'space-between' },
              gap: 2,
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Iconify icon="material-symbols:info-outline" size={13} sx={{ flexShrink: 0, display: { xs: 'none', md: 'block' } }}/>
              <Typography
                sx={{ fontSize: { xs: 12, md: 14 } }}
              >
                Team members have shared access to all clients assigned to their team. Any member of a team can view, manage, and interact with all the clients that belong to that specific team.
              </Typography>
            </Stack>
            <Stack
              alignItems="center"
              justifyContent="flex-end"
              direction="row"
              spacing={2}
            >
              <Button
                startIcon={
                  <Iconify icon="lucide:plus" width={22} />
                }
                sx={{ whiteSpace : 'nowrap' }}
                variant="contained"
                onClick={handleOpenAddSkillTeam}
              >
                Add Skill Team
              </Button>
            </Stack>
          </Stack>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="lucide:search" color="text.secondary" width={24} />
                </InputAdornment>
              ),
            }}
            label="Search"
            onChange={handleSkillTeamSearch}
            placeholder="Search members..."
            value={searchSkillTeams}
          />
          <SettingsSkillTeamTable
            items={searchedTeams}
            isLoading={isLoading}
            openDrawer={handleOpenSkillDrawer}
            openRemoveSkillTeams={handleOpenRemoveSkillTeam}
            openEditSkillTeam={handleOpenEditSkillTeam}
          />
        </Stack>
      </Stack>

      <SettingsSkillAddMemberDrawer
        open={openSkillDrawer}
        onClose={handleCloseSkillDrawer}
        skillTeam={skillTeam}
      />
      <SettingsAddSkillTeamModal
        open={openAddSkillTeamDialog}
        onClose={handleCloseAddSkillTeam}
        handleAddSkillTeam={handleAddSkillTeam}
      />
      <SettingsEditSkillTeamModal
        open={openEditSkillTeamDialog}
        onClose={handleCloseEditSkillTeam}
        handleUpdateSkillTeam={handleUpdateSkillTeam}
        skillTeam={skillTeam}
      />
      {openRemoveSkillTeamDialog && (
        <ConfirmDialog
          open={openRemoveSkillTeamDialog}
          onClose={handleCloseRemoveSkillTeam} 
          title="Remove Skill Team"
          titleIcon={<Iconify icon="mingcute:alert-line" width={20} />}
          description="Are you sure you want to remove this skill team?"
          confirmAction={handleRemoveSkillTeam}
          isLoading={isDeleteLoading}
          confirmLabel="Remove"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
};
