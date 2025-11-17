import Dialog from "@mui/material/Dialog";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";
import { LeadBulkStep } from "./bulk-step";

export const BulkActionModal = ({
  open,
  onClose,
  selectedLeads,
  selectAll,
  getStatusInfo,
  onDeSelectAll,
  agentList = [],
  teamList = [],
  affiliateList = [],
  brandsList = [],
  labelList = [],
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Scrollbar sx={{ maxHeight: 750 }}>
        <Container maxWidth="sm" sx={{ p: 3 }}>
          <Stack direction="column" spacing={3} pb={3}>
            <Stack py={2} direction="row" justifyContent="center">
              <Typography variant="h5">Create Leads</Typography>
            </Stack>
            <Stack>
              <LeadBulkStep
                onDeSelectAll={onDeSelectAll}
                getStatusInfo={getStatusInfo}
                selectedLeads={selectedLeads}
                selectAll={selectAll}
                onClose={onClose}
                agentList={agentList}
                teamList={teamList}
                affiliateList={affiliateList}
                brandsList={brandsList}
                labelList={labelList}
              />
            </Stack>
          </Stack>
        </Container>
      </Scrollbar>
    </Dialog>
  );
};
