import { useCallback, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import ValidationNote from "src/sections/dashboard/payment-audit/validation-rules/details/validation-note";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { ValidationBasic } from "src/sections/dashboard/payment-audit/validation-rules/details/validation-basic";
import { ValidationManagement } from "src/sections/dashboard/payment-audit/validation-rules/details/validation-delete";
import { ValidationRule } from "src/sections/dashboard/payment-audit/validation-rules/details/validation-rule";
import { ValidationSettings } from "src/sections/dashboard/payment-audit/validation-rules/details/validation-setting";
import { paths } from "src/paths";
import { useDebounce } from "src/hooks/use-debounce";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { validationRuleApi } from "src/api/payment_audit/validation_rule";
import { useAuth } from "src/hooks/use-auth";
import { Iconify } from 'src/components/iconify';

const tabs = [
  { label: "Details", value: "details" },
  { label: "Rules", value: "rules" },
  { label: "Note", value: "note" },
];

const BankProviderDetails = () => {
  const { user, company } = useAuth();
  usePageView();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("details");
  const { taskId } = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (user?.acc?.acc_v_audit_tasks === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  useEffect(() => {
    setCurrentTab(tab ?? "details");
  }, [tab]);

  const [validationTask, setValidationTask] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [validationRules, setValidationRules] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [text, setText] = useState("");
  const query = useDebounce(text);

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const updateValidationTask = async (id, data, isNote) => {
    try {
      const res = await validationRuleApi.updateValidationTasks(id, data);
      setValidationTask(res?.task);
      if (!isNote) {
        toast("Validation task successfully updated!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getValidationTask = async () => {
    try {
      const res = await validationRuleApi.getValidationTask(taskId);
      setValidationTask(res?.task);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getValidationRules = async () => {
    try {
      setIsLoading(true);
      let request = {
        page: currentPage + 1,
        per_page: perPage,
        q: query?.length > 0 ? query : null,
        task_id: taskId,
      };
      const res = await validationRuleApi.getValidationRules(request);
      setValidationRules(res?.rules);
      setTotalCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getValidationTask();
  }, [taskId]);

  useEffect(() => {
    getValidationRules();
  }, [perPage, currentPage, query]);

  return (
    <>
      <Seo title={`Dashboard: Validation Tasks Details ${company?.name}`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.paymentAudit.validationRules.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Validation Tasks</Typography>
                </Link>
              </div>
              <Stack
                alignItems="end"
                direction={{
                  xs: "column",
                  md: "row",
                }}
                sx={{ mt: 2 }}
                justifyContent="space-between"
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Stack spacing={1}>
                    <Typography variant="h4">{validationTask?.name}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">
                        Validation_task_id:
                      </Typography>
                      <Chip label={taskId} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              {currentTab === "rules" && (
                <Stack direction="row" justifyContent="end">
                  {user?.acc?.acc_e_audit_tasks ? (
                    <Button
                      startIcon={<Iconify icon="lucide:plus" width={24} />}
                      onClick={() =>
                        router.push(
                          `${paths.dashboard.paymentAudit.validationRules.index}/${taskId}/create`
                        )
                      }
                      variant="contained"
                    >
                      Add
                    </Button>
                  ) : null}
                </Stack>
              )}
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  sx={{ mt: 3 }}
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => {
                    if (tab.value === "note") {
                      return (
                        <Tab key={tab.value} label={tab.label} value={tab.value} />
                      )
                    }
                    return (
                      <Tab key={tab.value} label={tab.label} value={tab.value} />
                    )
                  })}
                </Tabs>
                <Divider />
              </div>
            </Stack>
            {currentTab === "details" && (
              <div>
                <Grid container spacing={4}>
                  <Grid xs={12} lg={5}>
                    <Stack spacing={4}>
                      <ValidationBasic
                        validationTask={validationTask}
                        updateValidationTask={updateValidationTask}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} lg={7}>
                    <Stack spacing={4}>
                      <ValidationSettings
                        validationTask={validationTask}
                        updateValidationTask={updateValidationTask}
                      />
                      {user?.acc?.acc_e_audit_tasks ? (
                        <ValidationManagement validationTask={validationTask} />
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}
            {currentTab === "note" && (
              <ValidationNote
                validationTask={validationTask}
                updateValidationTask={updateValidationTask}
              />
            )}
            {currentTab === "rules" && (
              <ValidationRule
                taskId={taskId}
                perPage={perPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setPerPage={setPerPage}
                text={text}
                setText={setText}
                totalCount={totalCount}
                validationRules={validationRules}
                isLoading={isLoading}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default BankProviderDetails;
