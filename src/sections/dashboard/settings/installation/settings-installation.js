import Stack from '@mui/material/Stack';
import { ArticleLink } from './installation-methods/article-link';
// import { CrmInstallation } from './installation-methods/crm-installation';
// import { MiniChatInstallation } from './installation-methods/mini-chat-installation';
import { SupportEmail } from './installation-methods/support-email';

export const SettingsInstallation = (props) => {
  return (
    <Stack
      spacing={4}
      {...props}>
      <ArticleLink />
      {/* <CrmInstallation /> */}
      {/* <MiniChatInstallation /> */}
      <SupportEmail />
    </Stack>
  );
};
