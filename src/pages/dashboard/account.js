import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { AccountGeneralSettings } from 'src/sections/dashboard/account/account-general-settings';
import { AccountNotificationsSettings } from 'src/sections/dashboard/account/account-notifications-settings';
import { AccountSecuritySettings } from 'src/sections/dashboard/account/account-security-settings';
import { Seo } from 'src/components/seo';
import { useAuth } from 'src/hooks/use-auth';
import { usePageView } from 'src/hooks/use-page-view';

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Settings', value: 'notifications' },
  { label: 'Security', value: 'security' }
];

const Page = () => {
  usePageView();
  const { user, company, refreshUser } = useAuth()
  const [currentTab, setCurrentTab] = useState('general');

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title={`Dashboard: Account ${company?.name}`} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">
              Account
            </Typography>
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
              </Tabs>
              <Divider />
            </div>
          </Stack>
          {currentTab === 'general' &&
            <AccountGeneralSettings
              user={user}
              getUser={refreshUser} />}
          {currentTab === 'notifications' && <AccountNotificationsSettings />}
          {currentTab === 'security' && <AccountSecuritySettings />}
        </Container>
      </Box>
    </>
  );
};

export default Page;
