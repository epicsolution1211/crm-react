import { useCallback, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CustomerEditForm } from 'src/sections/dashboard/customer/customer-edit-form';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { customersApi } from 'src/api/customers';
import { getInitials } from 'src/utils/get-initials';
import { paths } from 'src/paths';
import { useAuth } from 'src/hooks/use-auth';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { getAPIUrl } from 'src/config';
import { Iconify } from 'src/components/iconify';

const useCustomer = () => {
  const isMounted = useMounted();
  const [customer, setCustomer] = useState(null);

  const handleCustomerGet = useCallback(async () => {
    try {
      const response = await customersApi.getCustomer();

      if (isMounted()) {
        setCustomer(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    handleCustomerGet();
  }, []);

  return customer;
};

const Page = () => {
  const customer = useCustomer();

  usePageView();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_client === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  if (!customer) {
    return null;
  }

  return (
    <>
      <Seo title={`Dashboard: Customer Edit`} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.customers.index}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex'
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    Customers
                  </Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: 'column',
                  md: 'row'
                }}
                justifyContent="space-between"
                spacing={4}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <Avatar
                    src={customer.avatar ? customer.avatar?.includes('http') ? customer.avatar : `${getAPIUrl()}/${customer.avatar}` : ""}
                    sx={{
                      height: 64,
                      width: 64
                    }}
                  >
                    {getInitials(customer.name)}
                  </Avatar>
                  <Stack spacing={1}>
                    <Typography variant="h4">
                      {customer.email}
                    </Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Typography variant="subtitle2">
                        user_id:
                      </Typography>
                      <Chip
                        label={customer.id}
                        size="small"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <CustomerEditForm customer={customer} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
