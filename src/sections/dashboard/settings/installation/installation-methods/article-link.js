import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SettingInstallArticle } from "src/components/settings/installation/settings-install-article";

export const ArticleLink = () => (
  <Card>
    <CardHeader title={<Typography variant="h5">Article Link</Typography>} />
    <CardContent>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={12} md={12} sx={{ mt: 3 }}>
          <Stack spacing={3}>
            <SettingInstallArticle />
          </Stack>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
