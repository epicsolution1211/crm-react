import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Unstable_Grid2';
import CardContent from "@mui/material/CardContent";
import { styled } from '@mui/material/styles';

import { Iconify } from "src/components/iconify";
import Markdown from 'react-markdown';
import { affiliateApi } from "src/api/lead-management/affiliate";
import Divider from "@mui/material/Divider";

const MarkdownWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.body2.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  lineHeight: 1.6,
  '& > p': {
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

export const AffiliateAISummary = ({ affiliateId }) => {
  const [summary, setSummary] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAISummary = async () => {
    if (!affiliateId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await affiliateApi.getAffiliateAISummary(affiliateId);
      setSummary(response?.summary || response?.ai_summary);
      setPerformanceMetrics(response?.performance_metrics);
    } catch (err) {
      console.error("Error fetching AI insight:", err);
      setError(err?.response?.data?.message || "Failed to load AI insight");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAISummary();
  };

  useEffect(() => {
    fetchAISummary();
  }, [affiliateId]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={120} height={24} />
            </Stack>
            <Stack direction="column" alignItems="start" spacing={1.5}>
              <Skeleton variant="text" width="100%" height={60} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert 
            severity="error" 
            action={
              <Tooltip title="Retry">
                <IconButton
                  color="primary"
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
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify 
                  icon="healthicons:artificial-intelligence" 
                  width={24} 
                  color="primary.main" 
                />
                <Typography variant="h6">AI Insight</Typography>
              </Stack>
              <Tooltip title="Generate AI Summary">
                <IconButton color="primary" onClick={handleRefresh} size="small">
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
    <Card>
      <CardContent>
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify 
                icon="healthicons:artificial-intelligence" 
                width={24} 
                color="primary.main" 
              />
              <Typography variant="h6">AI insight</Typography>
            </Stack>
            <Tooltip title="Refresh AI Insight">
              <IconButton color="primary" onClick={handleRefresh} size="small">
                <Iconify icon="material-symbols:refresh" />
              </IconButton>
            </Tooltip>
          </Stack>
        
          <MarkdownWrapper>
            <Markdown children={summary} />
          </MarkdownWrapper>
          <Stack>
            
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Divider />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.primary">Lead Performance</Typography>
                  <Stack direction="row" spacing={2}>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.total_leads}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Leads</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.total_valid_leads}</Typography>
                      <Typography variant="caption" color="text.secondary">Valid Leads</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.total_ftd}</Typography>
                      <Typography variant="caption" color="text.secondary">First Time Deposits</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.primary">Conversion Metrics</Typography>
                  <Stack direction="row" spacing={2}>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.conversion_rate}%</Typography>
                      <Typography variant="caption" color="text.secondary">Conversion Rate</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.ftd_rate}%</Typography>
                      <Typography variant="caption" color="text.secondary">FTD Rate</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.performance_score}</Typography>
                      <Typography variant="caption" color="text.secondary">Performance Score</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.primary">Financial Metrics</Typography>
                  <Stack direction="row" spacing={2}>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.total_deposits.toLocaleString()}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Deposits</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.avg_deposit.toLocaleString()}</Typography>
                      <Typography variant="caption" color="text.secondary">Avg. Deposit</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.total_volume.toLocaleString()}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Volume</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.primary">Transaction Details</Typography>
                  <Stack direction="row" spacing={2}>
                    <Stack>
                      <Typography variant="h6">{performanceMetrics?.deposit_transactions}</Typography>
                      <Typography variant="caption" color="text.secondary">Deposit Transactions</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}; 