import { useMemo, useState } from "react";
// MUI imports
import Box from "@mui/material/Box";
import Container from "@mui/material/Container"; 
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";
import { MetabaseDashboards } from 'src/sections/dashboard/reports/metabase/metabase-dashboards';
import { useGetMetabaseDashboards } from "src/hooks/swr/use-metabase";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { dashboards, totalCount, isLoading, isValidating, mutate } = useGetMetabaseDashboards();

  // Filter dashboards based on search query
  const filteredDashboards = useMemo(() => {
    if (!searchQuery.trim()) {
      return dashboards;
    }
    
    const query = searchQuery.toLowerCase();
    return dashboards.filter(dashboard => 
      dashboard.title.toLowerCase().includes(query) ||
      dashboard.description.toLowerCase().includes(query) ||
      dashboard.metabase_dashboard_id.toString().includes(query)
    );
  }, [dashboards, searchQuery]);

  return (
    <>
      <Seo title={`Dashboard: MetaBase`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 4, pb: 2, flex: "1 1 auto", position: "relative" }}>
        <PayWallLayout>
          <Container maxWidth="xxl">
            <Stack>
              <Stack direction="row" justifyContent="start" alignItems="center" gap={2} mb={4}>
                <Typography variant="h4">Metabase Dashboards</Typography>
                <Chip
                  label={`${filteredDashboards.length} of ${totalCount} dashboard${totalCount !== 1 ? 's' : ''}`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </Stack>
            <MetabaseDashboards
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredDashboards={filteredDashboards}
              isLoading={isLoading}
              isValidating={isValidating}
              mutate={mutate}
            />
          </Container>
        </PayWallLayout>
      </Box>
    </>
  );
};

export default Page;
