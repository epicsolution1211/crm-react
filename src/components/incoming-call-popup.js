import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import { Iconify } from "src/components/iconify";
import { useTwilio } from "src/hooks/use-twilio";

export const IncomingCallPopup = () => {
  const { answerCall, declineCall } = useTwilio();

  return (
    <Card
      elevation={16}
      sx={{
        position: "fixed",
        top: 67,
        left: "40%",
        width: 600,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={2} direction="row" alignItems="center">
            <Iconify icon="line-md:phone-call-loop" sx={{ color: "success.main" }} />
            <Typography variant="h6">Incoming call...</Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button onClick={answerCall} variant="contained" sx={{ backgroundColor: "success.main", width: 100 }}>
              Answer
            </Button>
            <Button onClick={declineCall} variant="contained" sx={{ backgroundColor: "error.main", width: 100 }}>
              Decline
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
