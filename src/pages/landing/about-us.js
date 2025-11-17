import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Iconify } from 'src/components/iconify';

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="About Us" />
      <Container>
        <Stack spacing={3} sx={{ py: { md: 9, xs: 3 } }}>
          <Typography variant="h3">
            About Us
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          sx={{
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
            Learn About our team
          </Typography>
        </Stack>
        <Typography
          sx={{ mb: 3, maxWidth: '800px' }}
          variant="h2"
        >
          Driven by Innovation: Our Story of Trust and Technology
        </Typography>
        <Typography
          sx={{ mb: 6, maxWidth: '700px' }}
          variant="body1"
        >
          At the heart of our company lies an exceptional team of developers, led by an owner who is not just a visionary but a developer himself. Our journey began with an ambitious idea: to create a CRM, trading platform, and security system that stand out in the market. We recognized a critical challenge in the industry — a lack of trust in the security of CRM systems. Determined to address this, we developed a solution that keeps client data on their side, fundamentally enhancing trust and security.
          Our innovative approach has redefined what businesses can expect from their CRM and trading systems. By prioritizing data security and user control, we're not just providing tools; we're delivering peace of mind. With our solutions, companies can confidently manage their data, knowing it's protected by a system built on trust, integrity, and the expertise of a team that understands the core of development.
        </Typography>
      </Container>
    </>
  );
};

export default Page;
