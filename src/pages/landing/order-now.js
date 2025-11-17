import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from "@mui/system/Unstable_Grid/Grid";

import { Iconify } from 'src/components/iconify';
import { LandingOrderForm } from 'src/sections/landing/order-form';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Order Now" />
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ py: { md: 9, xs: 3 } }}>
          <Grid md={7} xs={12}>   <Box>
            <Stack spacing={3}>
              <Typography variant="h3">
                Order Now
              </Typography>
            </Stack>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{
                mt: 3,
                mb: 4,
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText'
                }}
                variant="rounded"
              >
                <Iconify icon="fluent:mail-16-regular" width={24} />
              </Avatar>
              <Typography variant="overline">
                Submit an order
              </Typography>
            </Stack>
            <Typography
              sx={{ mb: 3, maxWidth: 500 }}
              variant="h2"
            >
              Secure & Confidential Service Activation
            </Typography>
            <Stack direction='column' sx={{ mb: 3, pr: 4 }}>
              <Typography>
                At LORIAM HOLDING LTD, we prioritize your security and confidentiality, especially for sensitive services like our Server Proxy feature. Here's how you can activate your chosen service with complete peace of mind:
              </Typography>
              <ol style={{ paddingLeft: '24px', marginTop: "2px", marginBottom: "2px" }}>
                <li>Select Your Service: Browse our range of solutions and choose the one that fits your needs. From our robust Server Proxy to the customizable CRM, we have the right tool for every aspect of your business.</li>
                <li>Crypto Payment for Anonymity: If you're paying with cryptocurrency, please provide the hash of your crypto transaction. This method ensures complete anonymity and security, aligning with our commitment to your privacy.</li>
                <li>Preferred Contact Details for Delivery: After payment, let us know your preferred contact details for service delivery. We handle this information with the utmost confidentiality to maintain your anonymity.</li>
                <li>Why This Approach?: We've adopted this process to ensure that your identity remains private. By not holding your personal details, we safeguard you against any potential data breaches. This is particularly crucial for clients using our Server Proxy service, where anonymity is key.</li>
              </ol>
              <Typography>
                Order your service now and experience the blend of top-tier security and uncompromised privacy. With LORIAM HOLDING LTD, rest assured that your business operations are in safe hands.
              </Typography>
            </Stack>
          </Box></Grid>
          <Grid md={5} xs={12}> <Box>
            <Typography
              sx={{ pb: 3 }}
              variant="h6"
            >
              Fill the form below
            </Typography>
            <LandingOrderForm />
          </Box></Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Page;
