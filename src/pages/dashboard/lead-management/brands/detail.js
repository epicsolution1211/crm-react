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
import { useParams } from "react-router-dom";

import Affiliate from "src/sections/dashboard/lead-management/brands-details/affiliate";
import BrandIntegration from "src/sections/dashboard/lead-management/brands-details/integration";
import BrandNote from "src/sections/dashboard/lead-management/brands-details/note";
import Countries from "src/sections/dashboard/lead-management/brands-details/countries";
import TimeCapacity from "src/sections/dashboard/lead-management/brands-details/time-capacity";
import { BrandActive } from "src/sections/dashboard/lead-management/brands-details/basic/brand-active";
import { BrandBasic } from "src/sections/dashboard/lead-management/brands-details/basic/brand-basic";
import { BrandManagement } from "src/sections/dashboard/lead-management/brands-details/basic/brand-delete";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { brandsApi } from "src/api/lead-management/brand";
import { paths } from "src/paths";
import { Iconify } from 'src/components/iconify';
import { statusApi } from "src/api/lead-management/status";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";

const tabs = [
  { label: "Details", value: "details" },
  { label: "Time & Capacity", value: "time&capacity" },
  { label: "Affiliate", value: "affiliate" },
  { label: "Note", value: "note" },
  { label: "Countries", value: "countries" },
  { label: "Integration", value: "integration" },
];

const BrandsDetailPage = () => {
  const { user } = useAuth();
  const { brandId } = useParams();
  const [currentTab, setCurrentTab] = useState("details");
  const [brand, setBrand] = useState();
  const [leadCustomFields, setLeadCustomFields] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_lm_brand === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const getBrandInfo = async () => {
    try {
      const res = await brandsApi.getBrand(brandId);
      setBrand(res?.brand);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const updateBrand = async (id, data, isNote) => {
    try {
      const res = await brandsApi.updateBrand(id, data);
      setBrand(res?.brand);
      if (!isNote) {
        toast("Brand Successfully updated!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleGetCustomField = async () => {
    try {
      const res = await statusApi.getLeadCustomFields();
      if (res?.lead_fields) {
        setLeadCustomFields(res?.lead_fields);
      }
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    getBrandInfo();
    handleGetCustomField();
  }, []);

  return (
    <>
      <Seo title={`Dashboard: Brands Details`} />
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
                  href={paths.dashboard.lead.brands.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Brands</Typography>
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
                    <Typography variant="h4">{brand?.name}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">brand_id:</Typography>
                      <Chip label={brand?.id} size="small" />
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
                  {brand?.default
                    ? tabs
                      .filter((t) => t?.value !== "integration")
                      .map((tab) => {
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
                      })
                    : tabs.map((tab) => {
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
                    <BrandBasic brand={brand} updateBrand={updateBrand} />
                  </Grid>
                  <Grid xs={12} lg={7}>
                    <Stack spacing={3}>
                      <BrandActive brand={brand} updateBrand={updateBrand} />
                      {user?.acc?.acc_e_lm_brand ? (
                        <BrandManagement brand={brand} />
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}
            {currentTab === "time&capacity" && (
              <TimeCapacity brandId={brandId} />
            )}
            {currentTab === "affiliate" && <Affiliate brandId={brandId} />}
            {currentTab === "note" && (
              <BrandNote brand={brand} updateBrand={updateBrand} />
            )}
            {currentTab === "integration" && <BrandIntegration brand={brand} leadCustomFields={leadCustomFields} />}
            {currentTab === "countries" && <Countries brand={brand} />}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default BrandsDetailPage;
