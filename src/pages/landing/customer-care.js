import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from "@mui/system/Unstable_Grid/Grid";

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { CustomerCareForm } from 'src/sections/landing/customer_care_form';
import { Iconify } from 'src/components/iconify';

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Customer Care" />
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ py: { md: 9, xs: 3 } }}>
          <Grid md={7} xs={12}>   <Box>
            <Stack spacing={3}>
              <Typography variant="h3">
                Support
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
                Submit a support ticket
              </Typography>
            </Stack>
            <Typography
              sx={{ mb: 3, maxWidth: 500 }}
              variant="h2"
            >
              Customer Care
            </Typography>
            <Stack direction='column' sx={{ mb: 3, pr: 4 }}>
              <Stack direction='column' gap={2}>
                <Typography variant='h6'>
                  How Can We Assist You Today?
                </Typography>
                <Typography>
                  we're dedicated to providing you with exceptional customer support. Your satisfaction is our top priority, and we're here to assist you in any way we can. Whether you have questions, need assistance, or simply want to share your feedback, we're just a message away!
                </Typography>
                <Typography>
                  At Octolit, we're dedicated to providing you with exceptional customer support. Your satisfaction is our top priority, and we're here to assist you in any way we can. Whether you have questions, need assistance, or simply want to share your feedback, we're just a message away!
                </Typography>
                <Typography variant='h6'>
                  How Can We Assist You Today?
                </Typography>
                <Stack direction='column'>
                  <Typography>
                    Our support team is ready to listen and help you with:
                  </Typography>
                  <ul style={{ paddingLeft: '24px', marginTop: "2px", marginBottom: "2px" }}>
                    <li>Product Inquiries: Have questions about our products, services, or features? We're happy to provide all the information you need.</li>
                    <li>Technical Support: Facing any issues or challenges with our platform? Let us know, and we'll work diligently to resolve them for you.</li>
                    <li>Account Assistance: Need help with your account, billing, or account settings? We're here to guide you through the process.</li>
                    <li>Feedback & Suggestions: Your opinions matter! Share your thoughts, ideas, and suggestions to help us improve and serve you better.</li>
                  </ul>
                </Stack>
              </Stack>
            </Stack>
          </Box></Grid>
          <Grid md={5} xs={12}> <Box>
            <Typography
              sx={{ pb: 3 }}
              variant="h6"
            >
              Fill the form below
            </Typography>
            <CustomerCareForm />
          </Box></Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Page;
