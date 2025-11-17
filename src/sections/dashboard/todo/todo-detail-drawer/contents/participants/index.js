import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { useAuth } from 'src/hooks/use-auth';

import { ParticipantItem } from './participant-item';

export const TaskContentParticipants = ({ todo }) => {
  const { user } = useAuth();

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={1}>
          <Iconify icon="mynaui:users" width={22} />
          <Typography variant="subtitle1" color="text.primary">Task Participants</Typography>
          <Chip 
            size="small" 
            label={Array.isArray(todo.participants) ? todo.participants.length : 0}
            variant="outlined"
            sx={{ color: 'text.primary' }}
          />
        </Stack>
        {/* {todo.creator?.id === user.id && (
          <Button
            startIcon={<Iconify icon="solar:add-circle-linear" />}
            onClick={() => setAddParticipantDialogOpen(true)}
            variant="contained"
            size="small"
          >
            Add Participant
          </Button>
        )} */}
      </Stack>
      
      {Array.isArray(todo.participants) && todo.participants.length > 0 ? (
        <Grid container spacing={1.5}>
          {todo.participants.filter(participant => participant && participant.id).map((participant) => (
            <Grid item xs={12} key={participant.id}>
              <ParticipantItem
                participant={participant}
                isCreator={participant.is_creator}
                onRemove={() => {}}
                canRemove={todo.creator?.id === user.id}
                showActivityStatus={true}
              />
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Stack>
  );
};
