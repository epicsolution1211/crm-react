import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";

import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { LandingAgents } from "src/sections/landing/agents/landind-agents";

const Page = () => {
  usePageView();

  const [filterDate, setFilterDate] = useState({ from: new Date(), to: new Date()?.setHours(23, 59, 59, 999) });

  return (
    <>
      <Seo title="Agents" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Agents</Typography>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <DatePicker
                  format="dd/MM/yyyy"
                  label="From"
                  onChange={(val) => {
                    setFilterDate((prev) => ({
                      ...prev,
                      from: val,
                    }));
                  }}
                  maxDate={filterDate?.to}
                  value={filterDate?.from}
                  slotProps={{ textField: { size: "small" } }}
                />
                <DatePicker
                  format="dd/MM/yyyy"
                  label="To"
                  onChange={(val) => {
                    setFilterDate((prev) => ({ ...prev, to: val?.setHours(23, 59, 59, 999) }));
                  }}
                  minDate={filterDate?.from}
                  value={filterDate?.to}
                  slotProps={{ textField: { size: "small" } }}
                />
              </Stack>
            </Stack>
            <Card>
              <LandingAgents />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
