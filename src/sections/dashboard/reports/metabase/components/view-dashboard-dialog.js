import React, { useState } from 'react';
import toast from 'react-hot-toast';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import { reportsApi } from 'src/api/reports';
import { Iconify } from 'src/components/iconify';
import { CreateTemplateDialog } from './create-template-dialog';
import { useGetMetabaseDashboardById } from 'src/hooks/swr/use-metabase';
import { useTimezone } from "src/hooks/use-timezone";

export const ViewDashboardDialog = ({ open, onClose, dashboard }) => {
  const { toLocalTime } = useTimezone();

  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const [isOpenCreateTemplateDialog, setIsOpenCreateTemplateDialog] = useState(false);

  const { dashboard: dashboardData, isLoading, mutate } = useGetMetabaseDashboardById(dashboard?.id);

  const handleOpenInNewTab = () => {
    if (dashboardData?.embed_url) {
      window.open(dashboardData.embed_url, '_blank');
    }
  };

  const handleOpenInEditMode = () => {
    if (dashboardData?.edit_url) {
      window.open(dashboardData.edit_url, '_blank');
    }
  };

  const handleCopyPassword = async () => {
    if (dashboardData?.dashboard_password) {
      try {
        await navigator.clipboard.writeText(dashboardData.dashboard_password);
        toast.success('Password copied to clipboard');
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    }
  };

  const handleResetPassword = async () => {
    if (!dashboard?.id) return;
    
    setIsResettingPassword(true);
    try {
      await reportsApi.resetMetabaseDashboardPassword(dashboard.id);
      setTimeout(() => {
        mutate();
      }, 1000);
      toast.success('Password reset successfully');
    } catch (err) {
      console.error('Error resetting password:', err);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!dashboard) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Typography variant="h5">
                  {dashboardData?.title}
                </Typography>
                {isLoading && (
                  <CircularProgress size={22} />
                )}
              </Stack>
              {dashboardData?.is_template && (
                <Chip label="Template" color="secondary" size="small" />
              )}
            </Box>

            <Box display="flex" gap={1.5}>
              <Tooltip title="Create template">
                <IconButton
                  onClick={() => setIsOpenCreateTemplateDialog(true)}
                  sx={{
                    color: 'inherit',
                    transition: 'color 0.3s ease-in-out',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                    }
                  }}
                  size="small"
                >
                  <Iconify icon="lets-icons:widget-add" width={22} />
                </IconButton>
              </Tooltip>
              {dashboardData?.embed_url && (
                <Tooltip title="Open in new tab">
                  <IconButton
                    onClick={handleOpenInNewTab}
                    sx={{
                      transition: 'color 0.1s ease-in-out',
                      color: 'inherit',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                      }
                    }}
                    size="small"
                  >
                    <Iconify icon="cuida:open-in-new-tab-outline" width={22} />
                  </IconButton>
                </Tooltip>
              )}
              {dashboardData?.edit_url && (
                <Tooltip title="Open in edit mode">
                  <IconButton
                    onClick={handleOpenInEditMode}
                    sx={{
                      color: 'inherit',
                      transition: 'color 0.1s ease-in-out',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                      },
                    }}
                    size="small"
                  >
                    <Iconify icon="mage:edit" width={22} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Refresh">
                <IconButton
                  onClick={()=> {
                    if(isLoading) return;
                    mutate();
                  }}
                  sx={{
                    color: 'inherit',
                    transition: 'color 0.1s ease-in-out',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                      transform: 'rotate(180deg)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                  size="small"
                >
                  <Iconify icon="garden:reload-stroke-12" width={22} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton 
                  onClick={handleClose}
                  size="small"
                  sx={{
                    color: 'inherit',
                    transition: 'color 0.1s ease-in-out',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <Iconify icon="line-md:close" width={22} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>

        <Stack sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column' }}>
          {isLoading ? (
            <Box p={2}>
              <Stack spacing={2}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="rectangular" width="100%" height={450} />
              </Stack>
            </Box>
          ) : dashboardData ? (
            <>
              {/* Dashboard Info Section */}
              <Box p={2} pt={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Stack direction="column" gap={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {dashboardData.description || 'No description available'}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={3} flexWrap="wrap">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Metabase Dashboard ID
                      </Typography>
                      <Chip label={dashboardData.metabase_dashboard_id} size="small" />
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Metabase ID
                      </Typography>
                      <Chip label={dashboardData.id} size="small" />
                    </Box>
                    
                    {dashboardData.metabase_data?.view_count !== undefined && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Views
                        </Typography>
                        <Chip label={dashboardData.metabase_data.view_count} size="small" />
                      </Box>
                    )}

                    {dashboardData.metabase_data?.collection?.name && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Collection
                        </Typography>
                        <Chip label={dashboardData.metabase_data.collection.name} size="small" />
                      </Box>
                    )}

                    {dashboardData.dashboard_password && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Dashboard Password
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={showPassword ? dashboardData.dashboard_password : '•••••••••••••'} 
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ cursor: 'pointer' }}
                          />
                          <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              size="small"
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { 
                                  opacity: 1,
                                  backgroundColor: 'primary.main',
                                  color: 'white'
                                }
                              }}                          >
                              <Iconify icon='solar:eye-bold' width={22} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Copy password">
                            <IconButton
                              onClick={handleCopyPassword}
                              size="small"
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { 
                                  opacity: 1,
                                  backgroundColor: 'primary.main',
                                  color: 'white'
                                }
                              }} 
                            >
                              <Iconify icon="iconamoon:copy" width={22} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reset password">
                            <IconButton
                              onClick={handleResetPassword}
                              disabled={isResettingPassword}
                              size="small"
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { 
                                  opacity: 1,
                                  backgroundColor: 'primary.main',
                                  color: 'white'
                                }
                              }} 
                            >
                              <Iconify icon="mdi:lock-reset" width={22} sx={{ flexShrink: 0 }}/>
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    )}
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Created
                      </Typography>
                      <Typography variant="body2">
                        {toLocalTime(dashboardData.created_at, "MMM d, yyyy h:mm a")}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Updated
                      </Typography>
                      <Typography variant="body2">
                        {toLocalTime(dashboardData.updated_at, "MMM d, yyyy h:mm a")}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Embedded Dashboard */}
              {dashboardData.embed_url ? (
                <Box sx={{ flex: 1, p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Dashboard Preview
                  </Typography>
                  <Stack
                    sx={{
                      height: 'calc(100vh - 400px)',
                      width: '100%',
                      overflow: 'auto',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <iframe
                      src={dashboardData.embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title={`${dashboardData.title} Dashboard`}
                      allowFullScreen
                    />
                  </Stack>
                </Box>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ flex: 1, p: 4 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No embed URL available for this dashboard
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{ flex: 1, p: 4 }}
            >
              <Typography variant="body1" color="text.secondary">
                No dashboard data available
              </Typography>
            </Box>
          )}
        </Stack>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {isOpenCreateTemplateDialog && (
        <CreateTemplateDialog
          open={isOpenCreateTemplateDialog}
          onClose={() => setIsOpenCreateTemplateDialog(false)}
          dashboard={dashboard}
        />
      )}
    </>
  );
}; 