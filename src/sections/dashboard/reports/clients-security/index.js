import React, { useEffect, useMemo, useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { Dashboard, Business, Security, Assignment } from '@mui/icons-material';
import { reportsApi } from 'src/api/reports';

// Import sub-components
import OverviewTab from './components/overview-tab';
import ClientsTab from './components/clients-tab';
import SecurityTab from './components/security-tab';
import RecommendationsTab from './components/recommendations-tab';
import ReportHeader from './components/report-header';
import ReportMetadata from './components/report-metadata';

const ClientsSecurityDashboard = ({ endPoint }) => {
  const [securityData, setSecurityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  const report = securityData?.report || {};

  const getSecurity = async () => {
    try {
      setLoading(true);
      const url = endPoint === "overview" ?
        { type: "all_clients" } :
        endPoint === "full_intelligence" ?
          { type: "all_clients", readable_dates: true, include_explanations: true } :
          { type: "all_clients", readable_dates: false, include_explanations: true };
      const res = await reportsApi.getSecurity(url);
      setSecurityData(res);
    } catch (error) {
      setSecurityData({});
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSecurity();
  }, [endPoint]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const tabs = [
    { label: "Overview", icon: <Dashboard />, component: OverviewTab },
    { label: "Clients", icon: <Business />, component: ClientsTab },
    { label: "Security", icon: <Security />, component: SecurityTab },
    { label: "Recommendations", icon: <Assignment />, component: RecommendationsTab }
  ];

  const ActiveComponent = useMemo(() => tabs[tabValue].component, [tabValue, tabs]);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', py: { xs: 1, md: 3 } }}>
      <ReportHeader report={report} loading={loading} onRefresh={getSecurity} />
      
      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          {tabs.map((tab, index) => (
            <Tab 
              key={index}
              label={tab.label} 
              sx={{ width:"25%", px: 3 }} 
              icon={tab.icon} 
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <ActiveComponent report={report} loading={loading} />
      
      <ReportMetadata report={report} loading={loading} />
    </Box>
  );
};

export default ClientsSecurityDashboard;