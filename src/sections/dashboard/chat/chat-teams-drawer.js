import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, useWatch } from 'react-hook-form';

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Iconify } from "src/components/iconify";
import { SelectMenu } from "src/components/customize/select-menu";
import { chatApi } from "src/api/chat";
import { settingsApi } from "src/api/settings";
import { toast } from "react-hot-toast";

export const ChatTeamDrawer = (props) => {
  const { onClose, open, ticketId, teamId, ...other } = props;
  const { control, setValue } = useForm();
  const [teamList, setTeamList] = useState([]);

  const getTeamsInfo = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      const teamInfo = res?.map(({ team }) => (
        { label: team?.name, value: team?.id }
      ));
      setTeamList([...teamInfo]);

    } catch (error) {
      console.error('error: ', error);
    }
  };

  const team_id = useWatch({ control, name: 'team_id' });

  const handleUpdateTeam = async () => {
    try {
      const request = {
        ticket_id: ticketId,
        team_id
      }
      await chatApi.assignTeam(request);
      toast('Team successfully updated!')
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    setValue('team_id', teamId);
  }, [ticketId, teamList])


  useEffect(() => {
    getTeamsInfo();
  }, [])

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
        sx: { zIndex: 1200 },
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: "100%",
          width: 440,
        },
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{
          px: 3,
          pt: 2,
        }}
      >
        <Typography variant="h5">Assign Teams</Typography>
        <Stack
          alignItems="center"
          direction="row"
          spacing={0.5}>
          <IconButton
            color="inherit"
            onClick={onClose}>
            <Iconify icon="iconamoon:close" width={24} />
          </IconButton>
        </Stack>
      </Stack>
      <Stack
        spacing={5}
        sx={{ p: 3, mt: 5 }}>
        <Stack
          spacing={2}>
          <Typography
            variant="h6">Teams</Typography>
          <Stack>
            <SelectMenu
              control={control}
              name="team_id"
              list={teamList}
            />
          </Stack>
          <Stack
            direction='row'
            justifyContent='end'>
            <Button
              onClick={() => handleUpdateTeam()}
              variant="contained"
            >Update</Button>
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
};

ChatTeamDrawer.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
