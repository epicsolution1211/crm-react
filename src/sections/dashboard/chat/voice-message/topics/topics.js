import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";

export const Topics = ({ message = {} }) => {
  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <Typography fontSize={22} fontWeight={500}>
          Topics
        </Typography>

        <Stack spacing={1}>
          {message?.transcript_topic?.segments?.map((segment, index) => (
            <Accordion
              key={segment?.end_word}
              aria-controls={`panel${index}-content}`}
              id={`panel${index}-header`}
            >
              <AccordionSummary expandIcon={<Iconify icon="tabler:chevron-down" width={30} color="#fff" />} sx={{
                backgroundColor: "primary.main",
                borderRadius: "10px",
                color: "#fff"
              }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
                  <Typography fontSize={16} fontWeight={500}>{segment?.topics?.[0]?.topic}</Typography>
                  <Typography fontSize={16} fontWeight={500}>{Number(segment?.topics?.[0]?.confidence_score * 100).toFixed(2)}%</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography fontSize={18} fontWeight={500}>
                    Segment {index + 1} (Confidence:{" "}
                    {segment?.topics?.[0]?.confidence_score}):
                  </Typography>
                  <Typography fontSize={16} color="grey">{segment?.text}</Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};
