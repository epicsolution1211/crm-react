import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const CallSummary = ({ message = {} }) => {
  return (
    <Container maxWidth="xl">
      <Stack spacing={2}>
        <Typography fontSize={22} fontWeight={500}>
          Call Summary
        </Typography>
        <Typography variant="subtitle1">
          {message?.call_summery??""}
        </Typography>
      </Stack>
    </Container>
  );
};
