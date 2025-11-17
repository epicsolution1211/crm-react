import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled } from '@mui/material/styles';

import { Iconify } from "src/components/iconify";
import Markdown from 'react-markdown';
import { customersApi } from "src/api/customers";

const MarkdownWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.body2.fontFamily,
  fontSize: 14,
  marginTop: 0,
  lineHeight: 1.6,
  '& > p': {
    marginTop: 0,
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0
    }
  },
  '& > ul, & > ol': {
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2)
  },
  '& > li': {
    marginBottom: theme.spacing(0.5)
  },
  '& > h1, & > h2, & > h3, & > h4, & > h5, & > h6': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontWeight: 600
  },
  '& > strong, & > b': {
    fontWeight: 600
  },
  '& > em, & > i': {
    fontStyle: 'italic'
  },
  '& > code': {
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.spacing(0.5),
    fontFamily: 'monospace',
    fontSize: '0.875em'
  },
  '& > blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(2),
    marginLeft: 0,
    marginRight: 0,
    fontStyle: 'italic',
    color: theme.palette.text.secondary
  }
}));

export const RoleTemplateAISummary = ({ roleId }) => {
  const [summary, setSummary] = useState(null);
  const [analysis, setAnalysis ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAISummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customersApi.getRoleTemplateAISummary(roleId);
      setSummary(response?.insights?.insights);
      setAnalysis(response?.insights?.analysis_summary);
    } catch (err) {
      console.error("Error fetching AI summary:", err);
      setError(err?.response?.data?.message || "Failed to load AI summary");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAISummary();
  };

  useEffect(() => {
    if (roleId) {
      fetchAISummary();
    }
  }, [roleId]);

  if (loading) {
    return (
      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Skeleton variant="circular" width={24} height={20} />
              <Skeleton variant="text" width={120} height={20} />
            </Stack>
            <Skeleton variant="text" width="100%" height={50} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Alert 
            severity="error" 
            action={
              <Tooltip title="Retry">
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={handleRefresh}
                >
                  <Iconify icon="material-symbols:refresh" />
                </IconButton>
              </Tooltip>
            }
          >
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Stack gap={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify 
                  icon="healthicons:artificial-intelligence" 
                  width={24} 
                  color="primary.main" 
                />
                <Typography variant="h6">AI Insight</Typography>
              </Stack>
              <Tooltip title="Generate AI Insight">
                <IconButton onClick={handleRefresh} size="small" color="primary">
                  <Iconify icon="material-symbols:refresh" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              No AI insight available. Click the refresh button to generate an AI-powered insight of this client.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 1 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify 
                icon="healthicons:artificial-intelligence" 
                width={24} 
                color="primary.main" 
              />
              <Typography variant="h6">AI Insight</Typography>
            </Stack>
            <Tooltip title="Refresh AI Insight">
              <IconButton onClick={handleRefresh} size="small" color="primary">
                <Iconify icon="material-symbols:refresh" />
              </IconButton>
            </Tooltip>
          </Stack>
          
          <MarkdownWrapper  className="markdown-content">
            <Markdown children={summary} />
            <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="success.main">
                Total Permissions: {analysis?.total_permissions}
              </Typography>
              <Typography variant="caption" color="info.main">
                Security Concerns: {analysis?.security_concerns_count}
              </Typography>
              <Typography variant="caption" color="secondary.main">
                Categories with Access: {analysis?.categories_with_access}
              </Typography>
              <Typography variant="caption" color="error.main">
                Critical: {analysis?.critical_count}
              </Typography>
              <Typography variant="caption" color="warning.main">
                High Risk: {analysis?.high_risk_count}
              </Typography>
          </Stack>
          </MarkdownWrapper>
        </Stack>
      </CardContent>
    </Card>
  );
}; 