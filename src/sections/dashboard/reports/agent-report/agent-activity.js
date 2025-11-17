import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export const AgentActivity = ({report, isLoading, setActivityTable}) => {

  const generateTableInfo = () => {
    const tableInfo = [
      ['Activity (online time)'],
      [`${report?.online_time ?? ""}(min)`]
    ];
    setActivityTable(tableInfo);
  }

  useEffect(() => {
    if(report) {
      generateTableInfo();
    }
  }, [report]);

return  (
  <Grid xs={12} sm={6}>
    <Card sx={{ p: 1, height: 1 }}>
      <CardHeader title="Activity" />
      <Stack
        alignItems={{
          md: 'center'
        }}
        component={CardContent}
        direction={{
          xs: 'column',
          sm: 'row'
        }}
        gap={4}
        sx={{ pt: 2 }}
      >
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: {
              xs: '100%',
              md: '50%',
              lg: '40%'
            }
          }}
        >
          <Stack direction='row' gap={2}>
            <Typography variant='subtitle1' color='text.secondary'>Online Time:</Typography>
            {isLoading ?
              <Skeleton width='50px' height='25px' />
              :
              <Typography variant='subtitle1' color='text.primary'>{report?.online_time ?? ""} (min)</Typography>}
          </Stack>
        </Box>
      </Stack>
    </Card>
  </Grid>
)}

