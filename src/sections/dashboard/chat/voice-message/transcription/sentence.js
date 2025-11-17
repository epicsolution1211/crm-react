import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";

export const Sentence = ({ paragraph = {}, isSentenceActive = () => {} }) => {
  const renderSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "neutral":
        return <Iconify icon="mdi:smiley-neutral" width={35} color="grey" />;
      case "negative":
        return <Iconify icon="mdi:smiley-sad" width={35} color="red" />;
      case "positive":
        return <Iconify icon="mdi:smiley" width={35} color="green" />;
      }
  }

  return (
    <Step sx={{ width: 1 }} active>
      <StepLabel>
        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
          Speaker {paragraph?.speaker + 1}
        </Typography>
      </StepLabel>

      <Stack spacing={1} sx={{ width: 1 }}>
        {paragraph?.sentences?.map((s) => (
          <Stack key={s?.end} direction="row" alignItems="center" spacing={2} sx={{ width: 1 }}>
            {renderSentimentIcon(s?.sentiment)}
            <Typography
              sx={{
                width: 1,
                color: isSentenceActive(s) ? "#f5ca53" : "",
                fontWeight: isSentenceActive(s) ? "600" : "400",
              }}
            >{s?.text}</Typography>
          </Stack>
        ))}
      </Stack>
    </Step>
  );
};
