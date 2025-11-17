import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SettingsMiniChatWelcome } from "src/components/settings/mini-chat/settings-mini-chat-welcome";
import { SettingsMiniChatTerms } from 'src/components/settings/mini-chat/settings-mini-chat-terms';
import { SettingsMiniChatAcceptMessage } from 'src/components/settings/mini-chat/settings-mini-chat-accept-message';
import { useMiniChatWelcomeMessage } from "src/hooks/mini-chat/use-mini-chat-welcome-message";
import { useMiniChatTerms } from "src/hooks/mini-chat/use-mini-chat-terms";
import { useMiniChatAccept } from "src/hooks/mini-chat/use-mini-chat-accept";
import { SettingsMiniChatAvailable } from "src/components/settings/mini-chat/settings-mini-chat-available";
import { useMiniChatAvailable } from "src/hooks/mini-chat/use-mini-chat-available";
import { SettingsMiniChatRating } from "src/components/settings/mini-chat/settings-mini-chat-rating";
import { useMiniChatRating } from "src/hooks/mini-chat/use-mini-chat-rating";
import { useMiniChatTicketPriority } from "src/hooks/mini-chat/use-mini-chat-ticket-priority";
import { SettingsMiniChatTicketPriority } from "src/components/settings/mini-chat/settings-mini-chat-ticket-priority";
import { useMiniChatOfflineNotice } from "src/hooks/mini-chat/use-mini-chat-offline-notice";
import { SettingsMiniChatOfflineNotice } from "src/components/settings/mini-chat/settings-mini-chat-offline-notice";
import { useMiniChatNotice } from "src/hooks/mini-chat/use-mini-chat-notice";
import { SettingsMiniChatNotice } from "src/components/settings/mini-chat/settings-mini-chat-notice";
import { SettingsMiniChatEmailNotification } from "src/components/settings/mini-chat/settings-mini-chat-email-notification";
import { useMiniChatEmailNotification } from "src/hooks/mini-chat/use-mini-chat-email-notification";
import { useMiniChatSocial } from "src/hooks/mini-chat/use-mini-chat-social";
import { SettingsMiniChatSocial } from "src/components/settings/mini-chat/settings-mini-chat-social";
import { SettingsMiniChatStyle } from "src/components/settings/mini-chat/settings-mini-chat-style";
import { useMiniChatStyle } from "src/hooks/mini-chat/use-mini-chat-style";
import { SettingsMiniChatAI } from 'src/components/settings/mini-chat/settings-mini-chat-ai';

export const SettingsMiniChat = (props) => {
  const { message, setMessage, handleUpdateMessage, enabled, handleEnabledChange } = useMiniChatWelcomeMessage();
  const { terms, setTerms, handleUpdateTerms, enabled: termsEnabled, handleEnabledChange: handleTermsEnabledChange } = useMiniChatTerms();
  const { team, teams, setTeam, handleUpdateTeam, enabled: acceptInputEnabled, handleEnabledChange: handleAcceptInputEnabledChange } = useMiniChatAccept();
  const { replyTime, handleUpdateReplyTime, enabled: replyTimeEnabled, handleEnabledChange: handleReplyTimeEnabledChange } = useMiniChatAvailable();
  const { enabled: ratingEnabled, handleEnabledChange: handleRatingEnabledChange } = useMiniChatRating();
  const { enabled: ticketPriorityEnabled, handleEnabledChange: handleTicketPriorityEnabledChange } = useMiniChatTicketPriority();
  const { offlineNotice, setOfflineNotice, handleUpdateOfflineNotice, enabled: offlineNoticeEnabled, handleEnabledChange: handleOfflineNoticeEnabledChange } = useMiniChatOfflineNotice();
  const { notice, setNotice, handleUpdateNotice, enabled: noticeEnabled, handleEnabledChange: handleNoticeEnabledChange } = useMiniChatNotice();
  const { members, handleUpdateEmailNotification } = useMiniChatEmailNotification();
  const { socials, setSocials, handleUpdateSocial } = useMiniChatSocial();
  const miniChatStyle = useMiniChatStyle();

  return (
    <Stack
      spacing={4}
      {...props}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Welcome message
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{ mt: 3 }}
            >
              <Stack spacing={3}>
                <SettingsMiniChatWelcome
                  message={message}
                  setMessage={setMessage}
                  handleUpdateMessage={handleUpdateMessage}
                  enabled={enabled}
                  handleEnabledChange={handleEnabledChange}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                AI
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{ mt: 3 }}
            >
              <Stack spacing={3}>
                <SettingsMiniChatAI />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Terms & Conditions
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{ mt: 3 }}
            >
              <Stack spacing={3}>
                <SettingsMiniChatTerms
                  terms={terms}
                  setTerms={setTerms}
                  enabled={termsEnabled}
                  handleUpdateTerms={handleUpdateTerms}
                  handleEnabledChange={handleTermsEnabledChange}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Accept new message
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{ mt: 3 }}
            >
              <Stack spacing={3}>
                <SettingsMiniChatAcceptMessage
                  enabled={acceptInputEnabled}
                  team={team}
                  teams={teams}
                  setTeam={setTeam}
                  handleUpdateTeam={handleUpdateTeam}
                  handleEnabledChange={handleAcceptInputEnabledChange}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Mini Chat style
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
            >
              <Stack spacing={3}>
                <SettingsMiniChatStyle {...miniChatStyle} />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Share your reply time
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
            >
              <Stack spacing={3}>
                <SettingsMiniChatAvailable
                  replyTime={replyTime}
                  handleUpdateReplyTime={handleUpdateReplyTime}
                  enabled={replyTimeEnabled}
                  handleEnabledChange={handleReplyTimeEnabledChange}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card >
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Ask to rate the conversation
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
            >
              <Stack spacing={3}>
                <SettingsMiniChatRating
                  enabled={ratingEnabled}
                  handleEnabledChange={handleRatingEnabledChange}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Email notification
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
            >
              <Stack spacing={3}>
                <SettingsMiniChatEmailNotification
                  members={members}
                  handleUpdateEmailNotification={handleUpdateEmailNotification}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card >
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Ticket priority
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
            >
              <Stack spacing={3}>
                <SettingsMiniChatTicketPriority
                  enabled={ticketPriorityEnabled}
                  handleEnabledChange={handleTicketPriorityEnabledChange}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Social networks urls
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
            >
              <Stack spacing={3}>
                <SettingsMiniChatSocial
                  socials={socials}
                  setSocials={setSocials}
                  handleUpdateSocial={handleUpdateSocial}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card >
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Offline notice
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
            >
              <Stack spacing={3}>
                <SettingsMiniChatOfflineNotice
                  offlineNotice={offlineNotice}
                  setOfflineNotice={setOfflineNotice}
                  handleUpdateOfflineNotice={handleUpdateOfflineNotice}
                  enabled={offlineNoticeEnabled}
                  handleEnabledChange={handleOfflineNoticeEnabledChange}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card >
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={12}
            >
              <Typography variant="h5">
                Special notice
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
            >
              <Stack spacing={3}>
                <SettingsMiniChatNotice
                  notice={notice}
                  setNotice={setNotice}
                  handleUpdateNotice={handleUpdateNotice}
                  enabled={noticeEnabled}
                  handleEnabledChange={handleNoticeEnabledChange}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

    </Stack>
  );
};
