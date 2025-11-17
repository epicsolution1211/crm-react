import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SettingInstallSupportEmail } from "src/components/settings/installation/settings-install-support-email";

export const SupportEmail = () => (
  <Card>
    <CardHeader title={<Typography variant="h5">Support Email</Typography>} />
    <CardContent>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={12} md={12}>
          <Stack spacing={3}>
            <SettingInstallSupportEmail />
          </Stack>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
