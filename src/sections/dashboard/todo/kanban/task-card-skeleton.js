import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';

export const TaskCardSkeleton = () => {
  return (
    <Paper
      sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark'
          ? 'neutral.800'
          : 'neutral.50',
        p: 2.5,
        pb: 2,
        border: '1px dotted',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" gap={0.5} alignItems="center">
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="circular" width={18} height={18} />
        </Stack>
        <Skeleton variant="text" width="100%" height={60} />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="text" width={80} height={24} />
        </Stack>
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton variant="rounded" width={70} height={20} />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" gap={1}>
            <Skeleton variant="text" width={40} height={20} />
            <Skeleton variant="text" width={60} height={20} />
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

