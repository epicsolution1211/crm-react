import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useTimezone } from "src/hooks/use-timezone";

import { Topics } from "src/sections/dashboard/chat/voice-message/topics/topics";
import { Transcription } from "src/sections/dashboard/chat/voice-message/transcription/transcription";
import { SentimentChart } from "src/sections/dashboard/chat/voice-message/chart/sentiment-chart";
import { CallSummary } from "src/sections/dashboard/chat/voice-message/summary";
import { Compliance } from "src/sections/dashboard/chat/voice-message/compliance";

export const getSystemMessage = (info, message) => {
  const { type, systemEventAccount, account } = info;
  const { toLocalTime } = useTimezone();

  switch (type) {
    case 1:
      return `${account?.first_name} ${account?.last_name} has invited ${systemEventAccount?.first_name} ${systemEventAccount?.last_name} to the chat.`;
    case 2:
      return `${account?.first_name} ${account?.last_name} has removed ${systemEventAccount?.first_name} ${systemEventAccount?.last_name} from the chat.`;
    case 3:
      return `Chat name has changed`;
    case 6:
      return (
        <Stack spacing={4} py={2}>
          <SentimentChart message={message}/>
          <Divider />
          <Transcription message={message} />
          <Divider />
          <Topics message={message} />
          {message?.call_summery ?
            <>
              <Divider />
              <CallSummary message={message} />
            </>
          : null
          }
          {message?.flagged_transcript?
            <>
              <Divider />
              <Compliance message={message} />
            </>
          : null
          }
        </Stack>
      )
    case 9: {
      const isValidDate = !isNaN(new Date(message?.html_description).getTime());
      if (isValidDate) {
        const date = toLocalTime(message?.html_description);
        return `${message?.system_event_account?.first_name} ${message?.system_event_account?.last_name} initiated the conversation at ${date}`;
      }
      return message?.html_description;
    }
    case 4:
      return message?.html_description;
    default:
      return message?.description;
  }
};
