import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';

const termsList = [
  {
    title: '1. Introduction',
    description: 'Welcome to OCTOLIT, provided by LORIAM HOLDING LTD ("we", "us", "our"). By using our website and services, you agree to comply with and be bound by the following terms and conditions.'
  },
  {
    title: '2. Privacy Policy',
    description: 'Please review our Privacy Policy, which also governs your use of our services, to understand our practices.'
  },
  {
    title: '3. License to Use OCTOLIT',
    description: 'Subject to these terms, LORIAM HOLDING LTD grants you a non-exclusive, non-transferable, limited license to use OCTOLIT for your personal and/or commercial use.'
  },
  {
    title: '4. Prohibited Activities',
    description: 'You may not use OCTOLIT for any illegal or unauthorized purpose. You agree not to modify, adapt, translate, or reverse engineer any portion of OCTOLIT.'
  },
  {
    title: '5. Intellectual Property',
    description: 'All content provided on OCTOLIT is our property or the property of our content suppliers and protected by international copyright laws.'
  },
  {
    title: '6. Liability Limitation',
    description: 'To the maximum extent permitted by law, LORIAM HOLDING LTD will not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, arising out of your use of OCTOLIT.'
  },
  {
    title: '7. Termination',
    description: 'We reserve the right to terminate your use of OCTOLIT at any time, with or without cause or notice.'
  },
  {
    title: '8. Governing Law',
    description: 'These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which LORIAM HOLDING LTD is located.'
  },
  {
    title: '9. Changes to These Terms',
    description: 'We reserve the right to modify these terms and conditions at any time. It is your responsibility to regularly review these terms and conditions to stay informed about any changes.'
  },
]

const Page = () => {
  usePageView();

  useEffect(() => {
    const element = document.getElementById('top');
    element.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <>
      <Seo title="Terms and Conditions" />
      <Box
        id='top'
        component="main"
        sx={{ flexGrow: 1 }}
      >
        <Box
          sx={{
            pb: '120px',
            pt: '184px'
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                mb: 4
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  lineHeight: '52px'
                }}
                variant="h3">
                Terms and Conditions <br />for
                <Typography
                  component="span"
                  color="primary.main"
                  variant="inherit"
                  px={1}
                >
                  OCTOLIT
                </Typography>
                by
                <Typography
                  component="span"
                  color="primary.main"
                  variant="inherit"
                  px={1}
                >
                  LORIAM HOLDING LTD
                </Typography>
              </Typography>
              <Stack
                pt={5}
                spacing={5}>
                {termsList?.map((item) => (
                  <Stack
                    spacing={3}
                    key={item.title}>
                    <Typography
                      variant='h5'>
                      {item.title}
                    </Typography>
                    <Typography >
                      {item.description}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Page;
