import { useCallback, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

export const TASK_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'description', label: 'Description' },
  { value: 'participants', label: 'Participants' },
  { value: 'attachments', label: 'Attachments' },
  { value: 'comments', label: 'Comments' }
];

export const TaskTabs = ({ todo, currentTab, setCurrentTab }) => {
  const handleTabsChange = useCallback((_, value) => {
    setCurrentTab(value);
  }, [setCurrentTab]);

  useEffect(() => {
    if (todo?.id) {
      setCurrentTab('overview');
    }
  }, [todo?.id, setCurrentTab]);

  return (
    <Tabs
      onChange={handleTabsChange}
      value={currentTab}
      sx={{ px: 2.5, gap: 0, minWidth: { xs: 'auto', md: 600 } }}
      variant="scrollable"
      scrollButtons="auto"
    >
      {TASK_TABS.map(({ value, label }) => (
        <Tab
          key={value}
          value={value}
          label={label}
          sx={{
            fontSize: 13,
            ml: 0.5,
          }}
        />
      ))}
    </Tabs>
  );
};
