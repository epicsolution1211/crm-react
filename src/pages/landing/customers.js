import Box from "@mui/material/Box";
import { toast } from "react-hot-toast";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/seo";
import { TempCustomerListTable } from "src/sections/landing/customers/customer-list-table";
import { customerMockedList } from "src/utils/constant/mock-data";
import { usePageView } from "src/hooks/use-page-view";
import { useSelection } from "src/hooks/use-selection";
import { Iconify } from "src/components/iconify";

const Page = () => {
  usePageView();

  const clientIds = customerMockedList?.map((item) => item?.id);
  const customersSelection = useSelection(clientIds ?? [], (message) => {
    toast.error(message);
  });

  return (
    <>
      <Seo title="Customers" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Customers</Typography>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={2}>
                <Button
                  startIcon={<Iconify icon="lucide:plus" width={24} />}
                  variant="contained"
                >
                  Add
                </Button>
              </Stack>
            </Stack>
            <Card>
              <TempCustomerListTable
                onDeselectAll={customersSelection.handleDeselectAll}
                onDeselectOne={customersSelection.handleDeselectOne}
                onDeselectPage={customersSelection.handleDeSelectPage}
                onSelectAll={customersSelection.handleSelectAll}
                onSelectOne={customersSelection.handleSelectOne}
                onSelectPage={customersSelection.handleSelectPage}
                selectAll={customersSelection.selectAll}
                selected={customersSelection.selected}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
