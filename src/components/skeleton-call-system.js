import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Grid from "@mui/system/Unstable_Grid/Grid";

const CallSystemSkeleton = () => (
  <Grid
    xs={6}
    md={3}>
    <Card>
      <CardContent>
        <Stack
          direction='column'
          px={3}
          width={1}>
          <Skeleton
            variant="text"
            width='100%'
            height="75px" />
          <Box sx={{ px: 3 }}>
            <Skeleton
              variant="text" />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </Grid>
);

export default CallSystemSkeleton;
