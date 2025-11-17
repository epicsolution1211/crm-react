import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { PositionDelete } from "src/sections/dashboard/dealing/position-delete";
import { RiskEdit } from "src/sections/dashboard/dealing/risk-edit";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { riskApi } from "src/api/risk";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { Iconify } from 'src/components/iconify';

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const { user } = useAuth();
  const router = useRouter();


  const [dealing, setDealing] = useState(null);

  const handleDealingGet = async () => {
    const response = await riskApi.getSingleDealing(params?.riskId);
    if (response?.position) setDealing({ ...response?.position, market_price: response?.market_price, profit: response?.profit });
  };

  useEffect(() => {
    if (params?.riskId) handleDealingGet();
  }, [params]);

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
      <Seo title={`Dashboard: Position edit`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 4, pb: 4 }}
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
                    <Typography variant="h4">Edit position</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">Position ID:</Typography>
                      <Chip label={params?.riskId} size="small" />
                    </Stack>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">Market price:</Typography>
                      <Chip label={dealing?.market_price?.toFixed(3) ?? 0} size="small" />
                    </Stack>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">Profit:</Typography>
                      <Chip label={dealing?.profit && Number(dealing?.profit)?.toFixed(3)} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <RiskEdit dealing={dealing} onGetDealing={handleDealingGet} />
            <PositionDelete dealing={dealing} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
