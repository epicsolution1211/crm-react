import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Cookie Policy" />
      <Container sx={{ pb: { md: 11, xs: 4 } }}>
        <Stack spacing={3} sx={{ pt: { md: 5, sx: 3 } }}>
          <Typography variant="h5">
            Legals
          </Typography>
          <Typography variant="h3" pt={4} pb={6}>
            Cookies Policy
          </Typography>
        </Stack>
        <Stack direction='column'>
          <Typography>
            1. Introduction
          </Typography>
          <Typography>
            Welcome to [Your Website Name] ("we," "our," or "us"). This Cookie Policy explains how we use cookies and similar tracking technologies when you visit our website [yourwebsite.com] (the "Website"). By using the Website, you consent to the use of cookies as described in this policy.
          </Typography>
          <Typography>
            2. What Are Cookies?
          </Typography>
          <Typography>
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work or improve their performance, as well as to provide information to website owners.
          </Typography>
          <Typography>
            3. Types of Cookies We Use
          </Typography>
          <Typography>
            We use the following types of cookies on our Website:
          </Typography>
          <ul style={{ paddingLeft: "28px", marginTop: "2px", marginBottom: "2px" }}>
            <li>3.1 Necessary Cookies</li>
            <Typography>
              These cookies are essential for the operation of our Website and enable you to navigate and use its features. Without these cookies, certain services and functionalities on the Website may not be available.
            </Typography>
            <li>3.2. Analytical/Performance Cookies</li>
            <Typography>
              These cookies allow us to recognize and count the number of visitors to our Website and see how visitors move around the Website. This information helps us improve the performance and functionality of our Website
            </Typography>
            <li>3.3. Functionality Cookies</li>
            <Typography>
              Functionality cookies enable us to provide enhanced features and personalization on the Website, such as remembering your preferences and settings.
            </Typography>
            <li>3.4. Targeting/Advertising Cookies</li>
            <Typography>
              These cookies may be set through our Website by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other websites.
            </Typography>
          </ul>
          <Typography>
            4. How We Use Cookies
          </Typography>
          <Typography>
            We use cookies for the following purposes:
          </Typography>
          <ul style={{ paddingLeft: "28px", marginTop: "2px", marginBottom: "2px" }}>
            <li>To operate and maintain the Website.</li>
            <li>To analyze and improve the Website's performance and functionality.</li>
            <li>To personalize your experience on the Website.</li>
            <li>To provide relevant advertising.</li>
          </ul>
          <Typography>
            5. Managing Cookies
          </Typography>
          <Typography>
            You can control and manage cookies in various ways. Most web browsers allow you to accept or reject cookies and delete them. You can also disable or enable cookies on a per-site basis. Please refer to your browser's help documentation for more information on how to manage cookies.
          </Typography>
          <Typography>
            6. Changes to this Cookie Policy
          </Typography>
          <Typography>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any changes to this Cookie Policy will be posted on this page with a revised "Last Updated" date.
          </Typography>
          <Typography>
            7. Contact Us
          </Typography>
          <Typography>
            If you have any questions or concerns about this Cookie Policy or our use of cookies, please contact us at sales@octolit.com.
          </Typography>
        </Stack>
      </Container>
    </>
  );
};

export default Page;
