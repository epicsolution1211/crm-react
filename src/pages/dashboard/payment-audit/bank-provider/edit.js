import { useEffect } from "react";
import { useParams } from "react-router";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { BankEdit } from "src/sections/dashboard/payment-audit/bank-provider/details/bank-edit";
import { BankFeeManagement } from "src/sections/dashboard/payment-audit/bank-provider/details/bank-fee-delete";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from 'src/components/iconify';

const Page = () => {
  const params = useParams();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_bank === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Dashboard: Bank Provider Fee & Rate edit`} />
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
                  href={`${paths.dashboard.paymentAudit.bankProvider.index}/${params.providerId
                    }?fee=${true}`}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    Bank Provider Fee and Rates
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
                    <Typography variant="h4">Edit Bank Provider Fee</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">
                        bank_provider_fee_id:
                      </Typography>
                      <Chip label={params?.rateId} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <BankEdit feeId={params?.rateId} />
            <BankFeeManagement feeId={params?.rateId} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
