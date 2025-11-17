import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { getAssetPath } from "src/utils/asset-path";

export const OverviewDoneTasks = ({ amount }) => (
  <Card>
    <Stack
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row'
      }}
      spacing={3}
      sx={{
        px: 4,
        py: 3
      }}
    >
      <div>
        <img
          src={getAssetPath("/assets/iconly/iconly-glass-tick.svg")}
          width={48} />
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          Done Tasks
        </Typography>
        <Typography
          color="text.primary"
          variant="h4"
        >
          {amount}
        </Typography>
      </Box>
    </Stack>
    <Divider />
    <CardActions>
      <Button
        color="inherit"
        endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
        size="small"
      >
        See all tasks
      </Button>
    </CardActions>
  </Card>
);
