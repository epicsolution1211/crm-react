import { useCallback, useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
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
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { usePageView } from "src/hooks/use-page-view";
import { useParams } from "react-router-dom";

import InjectionNote from "src/sections/dashboard/lead-management/injection-details/description";
import { InjectionBasic } from "src/sections/dashboard/lead-management/injection-details/injection-basic";
import { StatusTable } from "src/sections/dashboard/lead-management/status-table";
import { injectionApi } from "src/api/lead-management/list-injection";
import { InjectionManagement } from "src/sections/dashboard/lead-management/injection-details/injection-management";
import { useRouter } from "src/hooks/use-router";
import { useAuth } from "src/hooks/use-auth";
import { Iconify } from 'src/components/iconify';

const tabs = [
  { label: "Details", value: "details" },
  { label: "List", value: "list" },
  { label: "Note", value: "note" },
];

const InjectionDetailPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("details");
  const [injection, setInjection] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { injectionId } = useParams();
  usePageView();

  useEffect(() => {
    if (user?.acc?.acc_v_lm_list === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const getInjection = async () => {
    try {
      const res = await injectionApi.getInjection(injectionId);
      setInjection(res?.injection);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const updateInjection = async (id, data, isName) => {
    try {
      const res = await injectionApi.updateInjection(id, data);
      setInjection(res?.injection);
      if (isName) {
        toast("Injection successfully updated!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const deleteInjection = async () => {
    try {
      setIsLoading(true);
      await injectionApi.deleteInjection(injectionId);
      setTimeout(() => {
        router.push(paths.dashboard.lead.injection.index);
      }, 1000);
      toast.success("Injection successfully deleted!");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getInjection();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Seo title={`Dashboard: List Injection`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.lead.injection.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">List Injection</Typography>
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
                  <Avatar
                    src={""}
                    sx={{
                      height: 64,
                      width: 64,
                    }}
                  />
                  <Stack spacing={1}>
                    <Typography variant="h4">{injection?.name}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">injection_id:</Typography>
                      <Chip label={injectionId} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
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
                        <Tab
                          key={tab.value}
                          label={tab.label}
                          value={tab.value}
                        />
                      );
                    }
                    return (
                      <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                      />
                    );
                  })}
                </Tabs>
                <Divider />
              </div>
              {currentTab === "details" && (
                <Box>
                  <Grid container spacing={4}>
                    <Grid xs={12} lg={12}>
                      <InjectionBasic
                        injection={injection}
                        updateInjection={updateInjection}
                      />
                      {user?.acc?.acc_e_lm_list ? (
                        <InjectionManagement
                          onDeleteInjection={deleteInjection}
                          isLoading={isLoading}
                        />
                      ) : null}
                    </Grid>
                  </Grid>
                </Box>
              )}
              {currentTab === "list" && (
                <StatusTable leadFileId={injectionId} />
              )}
              {currentTab === "note" && (
                <InjectionNote
                  injection={injection}
                  updateInjection={updateInjection}
                />
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default InjectionDetailPage;
