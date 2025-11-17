import { useEffect, useMemo } from "react";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from "@mui/material/Link";
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { RiskCreate } from "src/sections/dashboard/dealing/risk-create";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";

const Page = () => {
  const searchParams = useSearchParams();

  const { user } = useAuth();
  const router = useRouter();

  const backLink = searchParams?.get("backlink");
  const customerId = searchParams?.get("customerId");
  const link = useMemo(() => {
    if (backLink && customerId) {
      return (
        paths.dashboard.customers.details.replace(":customerId", customerId) +
        "?tab=positions"
      );
    } else {
      return paths.dashboard.risk.positions;
    }
  }, [backLink, customerId]);

  useEffect(() => {
    if (customerId) {
      if (user?.acc?.acc_e_client_position === false) {
        router?.push(paths.notFound);
      }
    }
    else if (user?.acc?.acc_e_risk_position === false) {
      router?.push(paths.notFound);
    }
  }, [user, customerId])

  return (
    <>
      <Seo title={`Dashboard: Position Create`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={link}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    {backLink ? "Customer" : "Positions"}
                  </Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: "column",
                  md: "row",
                }}
                justifyContent="space-between"
                spacing={4}
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Stack spacing={1}>
                    <Typography variant="h4">Create position</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <RiskCreate link={link} customerId={customerId} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
