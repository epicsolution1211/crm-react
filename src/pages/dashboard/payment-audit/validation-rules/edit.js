import { useState, useEffect } from "react";
import { useParams } from "react-router";

import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { Iconify } from 'src/components/iconify';
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { ValidationRuleEdit } from "src/sections/dashboard/payment-audit/validation-rules/details/validation-rule-edit";
import { ValidationRuleManagement } from "src/sections/dashboard/payment-audit/validation-rules/details/validation-rule-delete";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { validationRuleApi } from "src/api/payment_audit/validation_rule";

const Page = () => {
  const { taskId, ruleId } = useParams();
  const [rule, setRule] = useState({});

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_tasks === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  const getValidationRule = async () => {
    try {
      const res = await validationRuleApi.getValidationRule(ruleId);
      setRule(res?.rule);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    getValidationRule();
  }, [ruleId])

  return (
    <>
      <Seo title={`Dashboard: Validation edit`} />
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
                      {rule?.name}
                    </Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Typography variant="subtitle2">
                        validation_rule_id:
                      </Typography>
                      <Chip
                        label={ruleId}
                        size="small"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <ValidationRuleEdit handleChangeRule={(value) => setRule(value)} />
            <ValidationRuleManagement
              taskId={taskId}
              ruleId={ruleId} />
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default Page;
