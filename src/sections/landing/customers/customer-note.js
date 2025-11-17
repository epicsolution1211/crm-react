import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import { QuillEditor } from "src/components/quill-editor";

export const LandingCustomerNote = () => (
  <Stack spacing={4}>
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h5">Customer Note</Typography>
          </Stack>
        </Stack>
        <QuillEditor
          placeholder="Write something"
          sx={{ height: 350, my: 3 }} />
      </CardContent>
    </Card>
  </Stack>
);
