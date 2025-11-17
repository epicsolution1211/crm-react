import { Stack, Typography, styled } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { useEffect, useState } from 'react';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export const OfferProgress = ({ startDate, endDate }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if start date is after the current date
    if (startDate > new Date()) {
      // Don't show progress bar if start date is in the future
      setProgress(0);
      return;
    }

    // Calculate total duration in milliseconds
    const totalDuration = endDate.getTime() - startDate.getTime();

    // Calculate elapsed time in milliseconds
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startDate.getTime();

    // Calculate percentage of time elapsed
    const percentage = (elapsedTime / totalDuration) * 100;

    // Update progress state
    setProgress(percentage > 100 ? 100 : percentage);
  }, [startDate, endDate]);

  return (
    <>
      <BorderLinearProgress variant="determinate" value={progress} />
      <Stack alignItems="center">
        <Typography variant="h6">{progress.toFixed(2)}%</Typography>
      </Stack>
    </>
  )


}