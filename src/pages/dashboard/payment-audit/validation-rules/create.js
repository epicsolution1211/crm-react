import { useEffect } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useParams } from "react-router";

import { Seo } from "src/components/seo";
import { RouterLink } from "src/components/router-link";
import { ValidationRuleCreate } from "src/sections/dashboard/payment-audit/validation-rules/details/validation-rule-create";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from 'src/components/iconify';

const Page = () => {
  const { taskId } = useParams();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_tasks === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Dashboard: Validation create`} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={`${paths.dashboard.paymentAudit.validationRules.index}/${taskId}?tab=rules`}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex'
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    Validation Rules
                  </Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: 'column',
                  md: 'row'
                }}
                justifyContent="space-between"
                spacing={4}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <Stack spacing={1}>
                    <Typography variant="h4">
                      Create Validation Rule
                    </Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <ValidationRuleCreate />
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default Page;
