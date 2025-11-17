import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const Compliance = ({ message = {} }) => {
  return (
    <Container maxWidth="xl">
      <Stack spacing={2}>
        <Typography fontSize={22} fontWeight={500}>
          Compliance Flag
        </Typography>
        <Typography variant="subtitle1">
          {message?.flagged_transcript}
        </Typography>
      </Stack>
    </Container>
  );
};
