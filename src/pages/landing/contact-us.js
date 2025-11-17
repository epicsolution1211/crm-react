import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from "@mui/system/Unstable_Grid/Grid";

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { ContactUsForm } from 'src/sections/landing/contact-form';
import { Iconify } from 'src/components/iconify';

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Contact Us" />
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ py: { md: 9, xs: 3 } }}>
          <Grid md={7} xs={12}>   <Box>
            <Stack spacing={3}>
              <Typography variant="h3">
                Contact
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
                Contact Sales
              </Typography>
            </Stack>
            <Typography
              sx={{ mb: 3 }}
              variant="h2"
            >
              Talk to our account expert
            </Typography>
            <Stack direction='column' sx={{ mb: 3, pr: 4 }}>
              <Typography>
                Ready to take the next step? Connect with our account experts today. With their deep knowledge and industry insights, they are poised to guide you through our customized solutions. Whether you have questions, need strategic advice, or are looking for tailored recommendations to fit your unique business needs, our team is here to help. Engage in a conversation with us, and let's explore how we can elevate your business together.
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
            <ContactUsForm />
          </Box></Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Page;
