import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { RoleCreate } from "src/sections/dashboard/settings/role/create";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { usePageView } from "src/hooks/use-page-view";

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Dashboard: Role Templates | Role Template Create" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="lg">
          <Link
            color="text.primary"
            component={RouterLink}
            href={paths.dashboard.settings}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
            <Typography variant="subtitle1">To settings</Typography>
          </Link>
          <Stack spacing={5}>
            <Typography variant="h3">Role Template Create</Typography>

            <RoleCreate />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
