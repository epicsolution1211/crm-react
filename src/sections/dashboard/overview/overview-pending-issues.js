import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from 'react';

import { customersApi } from 'src/api/customers';
import { paths } from 'src/paths';
import { useRouter } from 'src/hooks/use-router';
import { Iconify } from 'src/components/iconify';
import { getAssetPath } from 'src/utils/asset-path';

export const OverviewPendingIssues = () => {
  const [amount, setAmount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const getOpenTickets = async () => {
      const res = await customersApi.getCustomers({ per_page: 1, status: 2 });
      setAmount(res?.total_count ?? 0);
    }

    getOpenTickets();
  }, []);

  return (
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
            src={getAssetPath("/assets/iconly/iconly-glass-info.svg")}
            width={48}
          />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Pending Issues
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
          onClick={() => router.push(paths.dashboard.customers.index)}
          size="small"
        >
          See all issues
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewPendingIssues.propTypes = {
  amount: PropTypes.number.isRequired
};
