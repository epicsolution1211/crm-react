import { useEffect, useRef, useState } from "react";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

import { Sentence } from "./sentence";
import { Scrollbar } from "src/components/scrollbar";
import { getAPIUrl } from "src/config";
import { Iconify } from "src/components/iconify";

const TranscripionIcon = () => (
  <Iconify icon="gg:transcript" width={25} color="grey" />
);

export const Transcription = ({ message = {} }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const isSentenceActive = (sentence) => {
    return currentTime >= sentence.start && currentTime <= sentence.end;
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  return (
    <Stack spacing={2}>
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
          mt: "20px",
        }}
      >
        <audio
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "45px",
            borderRadius: "10px",
          }}
          ref={audioRef}
          controls
        >
          <source
            src={
              message?.html_description
                ? message?.html_description?.includes("http")
                  ? message?.html_description
                  : `${getAPIUrl()}/${message?.html_description}`
                : ""
            }
          />
        </audio>
      </Stack>

      <Scrollbar sx={{ maxHeight: 500, width: 550 }}>
        <Container maxWidth="xl" sx={{ width: 1 }}>
          <Stack sx={{ width: 1 }}>
            <Stepper
              // activeStep={activeStep}
              orientation="vertical"
              sx={{ width: 1 }}
            >
              <Step>
                <StepLabel
                  StepIconComponent={
                    TranscripionIcon
                  }
                >
                  <Typography sx={{ fontSize: 22, fontWeight: 600 }}>
                    Transcription
                  </Typography>
                </StepLabel>
              </Step>
              {message?.transcript_data?.paragraphs?.map((paragraph) => (
                <Sentence
                  key={paragraph?.start}
                  paragraph={paragraph}
                  isSentenceActive={isSentenceActive}
                />
              ))}
            </Stepper>
          </Stack>
        </Container>
      </Scrollbar>
    </Stack>
  );
};
