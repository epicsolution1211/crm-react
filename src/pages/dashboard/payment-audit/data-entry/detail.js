import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

import DataEntryNote from "src/sections/dashboard/payment-audit/data-entry/details/data-entry-note";
import { DataEntryBasic } from "src/sections/dashboard/payment-audit/data-entry/details/data-entry-basic";
import { DataEntryDelete } from "src/sections/dashboard/payment-audit/data-entry/details/data-entry-delete";
import { DataEntrySetting } from "src/sections/dashboard/payment-audit/data-entry/details/data-entry-setting";
import { RecordTable } from "src/sections/dashboard/payment-audit/alert/record-table";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { dataEntryApi } from "src/api/payment_audit/data-entry";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from 'src/components/iconify';

const tabs = [
  { label: "Details", value: "details" },
  { label: "Record", value: "record" },
  { label: "Note", value: "note" },
];

const DataEntryDetails = () => {
  usePageView();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_data === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const [currentTab, setCurrentTab] = useState("details");
  const { entryId } = useParams();

  const [dataEntry, setDataEntry] = useState();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const updateDataEntry = async (id, data, isNote) => {
    try {
      const res = await dataEntryApi.updateDataEntry(id, data);
      setDataEntry(res?.file);
      if (!isNote) {
        toast("Data Entry successfully updated!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getDataEntry = async () => {
    try {
      const res = await dataEntryApi.getDataEntry(entryId);
      setDataEntry(res?.file);
    } catch (error) {
      console.warn("error: ", error);
    }
  };

  useEffect(() => {
    getDataEntry();
  }, [entryId]);

  return (
    <>
      <Seo title={`Dashboard: Data Entry Details`} />
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
                  href={paths.dashboard.paymentAudit.dataEntry.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Data Entry</Typography>
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
                    <Typography variant="h4">{dataEntry?.name}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">
                        data_entry_id:
                      </Typography>
                      <Chip label={entryId} size="small" />
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
            </Stack>
            {currentTab === "details" && (
              <div>
                <Grid container spacing={4}>
                  <Grid xs={12} lg={5}>
                    <Stack spacing={4}>
                      <DataEntryBasic
                        dataEntry={dataEntry}
                        updateDataEntry={updateDataEntry}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} lg={7}>
                    <Stack spacing={4}>
                      <DataEntrySetting dataEntry={dataEntry} />
                      {user?.acc?.acc_e_audit_data ? (
                        <DataEntryDelete dataEntry={dataEntry} />
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}
            {currentTab === "note" && (
              <DataEntryNote
                dataEntry={dataEntry}
                updateDataEntry={updateDataEntry}
              />
            )}
            {currentTab === "record" && (
              <RecordTable audit_file_id={dataEntry?.id} />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default DataEntryDetails;
