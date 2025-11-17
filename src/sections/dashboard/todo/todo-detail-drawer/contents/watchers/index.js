import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { useAuth } from 'src/hooks/use-auth';

import { WatcherItem } from './watcher-item';

export const TaskContentWatchers = ({ todo }) => {
  const { user } = useAuth();
  
  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Iconify icon="solar:eye-linear" width={22} />
          <Typography variant="subtitle1" color="text.primary">Task Watchers</Typography>
          <Chip 
            size="small" 
            label={Array.isArray(todo.watchers) ? todo.watchers.length : 0}
            variant="outlined"
            sx={{ color: 'text.primary' }}
          />
        </Stack>
        {/* {todo.creator?.id === user.id && (
          <Button
            startIcon={<Iconify icon="solar:add-circle-linear" />}
            onClick={() => setAddWatcherDialogOpen(true)}
            variant="contained"
            size="small"
          >
            Add Watcher
          </Button>
        )} */}
      </Stack>
      
      {Array.isArray(todo.watchers) && todo.watchers.length > 0 ? (
        <Grid container spacing={1.5}>
          {todo.watchers.filter(watcher => watcher && watcher.id).map((watcher) => (
            <Grid item xs={12} key={watcher.id}>
              <WatcherItem
                watcher={watcher}
                onRemove={() => {}}
                canRemove={todo.creator?.id === user.id}
                showActivityStatus={true}
              />
            </Grid>
          ))}
        </Grid>
      ): null }
    </Stack>
  );
};
