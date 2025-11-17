import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SettingInstallMiniChat } from "src/components/settings/installation/settings-install-minichat";

export const MiniChatInstallation = () => (
  <Card>
    <CardHeader title={<Typography variant="h5">Install Mini Chat by code</Typography>} />
    <CardContent>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={12} md={12} sx={{ mt: 3 }}>
          <Stack spacing={3}>
            <SettingInstallMiniChat />
          </Stack>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
