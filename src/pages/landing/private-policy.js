import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Private Policy" />
      <Container sx={{ pb: { md: 11, xs: 4 } }}>
        <Stack spacing={3} sx={{ pt: { md: 5, sx: 3 } }}>
          <Typography variant="h5">
            Legals
          </Typography>
          <Typography variant="h3" pt={4} pb={6}>
            Privacy & Policy
          </Typography>
        </Stack>
        <Stack direction='column'>
          <Typography>
            1. Introduction
          </Typography>
          <Typography>
            Welcome to LORIAM HOLDING LTD. We are committed to protecting the privacy and security of our clients' information. This Privacy Policy explains the types of information we collect, how it is used, and the measures we take to safeguard it.
          </Typography>
          <Typography>
            2. Information Collection
          </Typography>
          <ul style={{ paddingLeft: "28px", marginTop: "2px", marginBottom: "2px" }}>
            <li>2.1 Personal Information: We may collect personal information such as names, email addresses, contact details, and payment information when voluntarily provided by our clients. This information is necessary for providing our services and support.</li>
            <li>2.2 Usage Data: Information on how our services are accessed and used (such as clickstream data, browser types, and time spent on the website) may also be collected. This data helps us improve service quality.</li>
          </ul>
          <Typography>
            3. Use of Information
          </Typography>
          <ul style={{ paddingLeft: "28px", marginTop: "2px", marginBottom: "2px" }}>
            <li>3.1 Service Provision: To provide and maintain our services, including customer support and personalized features.</li>
            <li>3.2 Communication: To communicate with clients regarding service updates, offers, and more.</li>
            <li>3.3 Security: To enhance the security and integrity of our services.</li>
          </ul>
          <Typography>
            4. Information Sharing and Disclosure
          </Typography>
          <ul style={{ paddingLeft: "28px", marginTop: "2px", marginBottom: "2px" }}>
            <li>4.1 Consent: We do not share personal information with third parties without client consent, except as described in this policy.</li>
            <li>4.2 Legal Requirements: We may disclose personal information if required by law or in response to valid requests by public authorities.</li>
          </ul>
          <Typography>
            5. Data Security
          </Typography>
          <ul style={{ paddingLeft: "28px", marginTop: "2px", marginBottom: "2px" }}>
            <li>5.1 Security Measures: We implement robust security measures to protect against unauthorized access, alteration, disclosure, or destruction of personal information.</li>
            <li>5.2 Data Transfer: Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ.</li>
          </ul>
          <Typography>
            6. Your Data Protection Rights
          </Typography>
          <ul style={{ paddingLeft: "28px", marginTop: "2px", marginBottom: "2px" }}>
            <li>6.1 Access and Control: You have the right to access, update, or delete the information we have on you.</li>
            <li>6.2 Opt-out Rights: You may opt out of receiving marketing or promotional communications from us.</li>
          </ul>
        </Stack>
      </Container>
    </>
  );
};

export default Page;
