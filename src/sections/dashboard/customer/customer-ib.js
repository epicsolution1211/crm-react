import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';
import { RouterLink } from 'src/components/router-link';
import { alpha } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
import { SeverityPill } from "src/components/severity-pill";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { customersApi } from "src/api/customers";
import { CustomerIBSidebar } from './customer-ib-sidebar';
import { MailContainer } from "../mail/mail-container";
import { useTraderAccounts } from './customer-trader-accounts';
import { CustomerPosition } from './customer-position';
import { CustomerTransaction } from './customer-transaction';
import { useInternalBrands } from "src/pages/dashboard/risk-management/transactions";
import { CustomerIBLevel1Dialog } from './customer-ib-level1-dialog';
import { paths } from 'src/paths';
import { ibsApi } from "src/api/ibs";
import { CustomerIBCustomers } from "./customer-ib-customers";
import { useAuth } from "src/hooks/use-auth";

const useSidebar = () => {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = useState(mdUp);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleToggle,
    handleClose,
    open,
    smUp,
    mdUp
  };
};

const NoLevelsPlaceholder = () => (
  <Paper
    elevation={0}
    sx={{
      p: 5,
      textAlign: 'center',
      borderRadius: 2,
      bgcolor: 'background.neutral',
    }}
  >
    <Stack spacing={2} alignItems="center">
      <Box
        sx={{
          width: 200,
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          color: 'primary.main',
          mb: 2
        }}
      >
        <Iconify icon="fluent:organization-48-regular" width={100} />
      </Box>
      <Typography variant="h6" color="text.primary">
        No IB Network Yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
        This IB doesn't have any network levels at the moment. Network levels will appear here once they start building their referral network.
      </Typography>
    </Stack>
  </Paper>
);

const useIbRewards = (brandId) => {
  const [ibRewards, setIbRewards] = useState([]);

  useEffect(() => {
    const fetchIbRewards = async () => {
      try {
        const res = await ibsApi.getIbRewards({ internal_brand_id: brandId });
        setIbRewards(res?.rewards || []);
      } catch (error) {
        console.error('Error fetching IB rewards:', error);
        setIbRewards([]);
      }
    };
    
    if (brandId) {
      fetchIbRewards();
    }
  }, [brandId]);

  return ibRewards;
};

export const CustomerIB = ({ customerInfo, onGetClient }) => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const { company } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');
  const { accounts } = useTraderAccounts(customerInfo?.id, true);
  const { internalBrandsInfo: brandsInfo } = useInternalBrands();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const ibRewards = useIbRewards(customerInfo?.client?.internal_brand_id);
  const [selectedRewardId, setSelectedRewardId] = useState(customerInfo?.client?.ib_reward_id || ibRewards.find(r => r.default)?.id || '');

  useEffect(() => {
    setSelectedRewardId(customerInfo?.client?.ib_reward_id || ibRewards.find(r => r.default)?.id || '');
  }, [customerInfo?.client?.ib_reward_id, ibRewards]);

  const referralLevels = [1, 2, 3, 4, 5];

  const referralUrl = useMemo(()=> {
    if(customerInfo?.dashboard_domain && customerInfo?.is_ib_approved) {
      const url = new URL(`https://${customerInfo?.dashboard_domain}`);
      url.pathname = "/register";
      url.search = "";
      url.searchParams.set("ib_code", customerInfo?.ib_code);
      return url;
    } else {
      return undefined
    }
  }, [customerInfo])

  const currentEnabledBrandCurrencies = useMemo(() => {
    const currentBrand = brandsInfo?.find((brand)=> brand.id == customerInfo?.client?.internal_brand_id);

    if (!currentBrand?.available_currencies) {
      return [];
    }

    const availableCurrencies = Object.values(currentBrand?.available_currencies);
    const enabledCurrencies = currentBrand?.enabled_currencies
      ? JSON.parse(currentBrand?.enabled_currencies)
      : null;
  
    if (enabledCurrencies) {
      return availableCurrencies?.filter(currency => enabledCurrencies.includes(currency.key));
    }
  
    return availableCurrencies?.filter(currency => currency.default);
  }, [brandsInfo, customerInfo]);

  const handleChangeIBStatus = async (isApprove) => {
    setIsLoading(true);
    try {
      const request = {
        id: customerInfo?.id,
      };
      if(isApprove) {
        request.approve_ib_request = true;
      } else {
        request.reject_ib_request = true;
      }
      
      await customersApi.updateCustomer(request);
      setTimeout(async () =>  {
        await onGetClient()
      }, 500);

      toast.success("IB is approved successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
  };

  const handleChangeIBReward = async (rewardId) => {
    setSelectedRewardId(rewardId);
    setIsLoading(true);
    try {
      await customersApi.updateCustomer({
        id: customerInfo?.id,
        ib_reward_id: rewardId
      });
      
      setTimeout(async () => {
        await onGetClient();
      }, 500);

      toast.success("IB reward plan updated successfully!");
    } catch (error) {
      setSelectedRewardId(customerInfo?.client?.ib_reward_id || ibRewards.find(r => r.default)?.id || '');
      toast.error(error?.response?.data?.message || "Failed to update IB reward plan");
    }
    setIsLoading(false);
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case 'overview': return 'Overview';
      case 'settings': return 'Settings';
      case 'positions': return company?.company_type === 2 ? 'Wagers' : 'Positions';
      case 'rewards': return 'Reward Transactions';
      case 'customers': return 'Customers';
      default: return 'Overview';
    }
  };

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const commonPaperStyle = (theme) => ({
    p: 3,
    borderRadius: 2,
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    border: '1px dashed',
    borderColor: 'divider', 
    boxShadow: 3
  });

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={commonPaperStyle}
                >
                  <Stack spacing={3}>
                    <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
                      Basic Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.neutral'
                      }}>
                        <Typography variant="subtitle2" color="text.secondary">IB Name</Typography>
                        <Typography variant="subtitle1" color="text.primary" fontWeight="medium">
                          {customerInfo?.ib_name || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.neutral'
                      }}>
                        <Typography variant="subtitle2" color="text.secondary">Balance</Typography>
                        <Typography variant="subtitle1" color="text.primary" fontWeight="medium">
                          {accounts?.m_balance || 0} {currentEnabledBrandCurrencies?.find(c => c.key === accounts?.currency)?.symbol}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.neutral'
                      }}>
                        <Typography variant="subtitle2" color="text.secondary">Active IB Status</Typography>
                        <SeverityPill 
                          color={customerInfo?.is_active_ib ? "success" : "error"}
                          sx={{ 
                            px: 2,
                            py: 0.5,
                            fontWeight: 600
                          }}
                        >
                          {customerInfo?.is_active_ib ? "Active" : "Inactive"}
                        </SeverityPill>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={commonPaperStyle}
                >
                  <Stack spacing={3}>
                    <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
                      IB Network
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={commonPaperStyle}>
                        <Typography variant="subtitle2" color="text.secondary">
                          IB Reward Name:
                        </Typography>
                        <SeverityPill 
                          color="info"
                          sx={{ 
                            px: 2,
                            py: 0.5,
                            fontWeight: 600
                          }}
                        >
                          {customerInfo?.ib_reward_name || 'N/A'}
                        </SeverityPill>
                      </Box>
                      {referralLevels.some(level => customerInfo?.[`ib_l${level}_name`]) ? (
                        <Grid container spacing={2}>
                          {referralLevels
                            .filter((level) => customerInfo?.[`ib_l${level}_name`])
                            .map((level) => (
                              <Grid xs={12} key={`ib-l${level}`}>
                                <Paper
                                  elevation={0}
                                  sx={commonPaperStyle}
                                >
                                  <Stack spacing={2}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                      <SeverityPill 
                                        color="primary"
                                        sx={{ 
                                          px: 2,
                                          py: 0.5,
                                          fontWeight: 600
                                        }}
                                      >
                                        Level {level}
                                      </SeverityPill>
                                      <Box sx={{ flexGrow: 1 }} />
                                      <Tooltip title="Network Size">
                                        <Typography 
                                          variant="subtitle2" 
                                          color="text.secondary"
                                          sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                          }}
                                        >
                                          <Iconify icon="mdi:account-group" />
                                          {customerInfo?.[`ib_l${level}_network_size`] || 0}
                                        </Typography>
                                      </Tooltip>
                                    </Stack>
                                    <Box>
                                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        IB Name
                                      </Typography>
                                      <Link
                                        component={RouterLink}
                                        href={`${paths.dashboard.customers.index}/${customerInfo?.[`ib_l${level}_id`]}`}
                                        color="primary"
                                        sx={{ 
                                          textDecoration: 'none',
                                          fontWeight: 500,
                                          '&:hover': { 
                                            textDecoration: 'underline' 
                                          } 
                                        }}
                                      >
                                        {customerInfo?.[`ib_l${level}_name`]}
                                      </Link>
                                    </Box>
                                  </Stack>
                                </Paper>
                              </Grid>
                            ))}
                        </Grid>
                      ) : (
                        <NoLevelsPlaceholder />
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>

            <Grid xs={12} md={6}>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={commonPaperStyle}
                >
                  <Stack spacing={3}>
                    <Typography variant="h6" color="text.primary">
                      Network Statistics
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                          xs: 'repeat(2, 1fr)',
                          sm: 'repeat(3, 1fr)'
                        }
                      }}
                    >
                      {referralLevels.map((level) => (
                        <Paper
                          key={level}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'background.neutral',
                            textAlign: 'center',
                            border: '1px dashed',
                            borderColor: 'divider',
                          }}
                        >
                          <Typography 
                            variant="subtitle2" 
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Level {level}
                          </Typography>
                          <Typography 
                            variant="h5"
                            color="text.primary"
                            sx={{ fontWeight: 600 }}
                          >
                            {customerInfo?.[`l${level}_referrals_count`] || 0}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" color="text.secondary">Total Network Size</Typography>
                        <Typography 
                          variant="h4"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {customerInfo?.total_network_size || 0}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Stack>
                </Paper>

                {referralUrl && (
                  <Paper
                    elevation={0}
                    sx={commonPaperStyle}
                  >
                    <Stack spacing={3}>
                      <Typography variant="h6" color="text.primary">
                        Referral Link
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          bgcolor: 'background.neutral',
                          borderRadius: 2
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: '80%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'text.secondary'
                          }}
                        >
                          {referralUrl.toString()}
                        </Typography>
                        <Tooltip title="Copy URL">
                          <IconButton
                            onClick={() => {
                              copyToClipboard(referralUrl.toString());
                            }}
                            size="small"
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': { 
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08)
                              } 
                            }}
                          >
                            <Iconify icon="material-symbols:content-copy-outline" />
                          </IconButton>
                        </Tooltip>
                      </Paper>
                    </Stack>
                  </Paper>
                )}

                {customerInfo?.ib_code && (
                  <Paper
                    elevation={0}
                    sx={commonPaperStyle}
                  >
                    <Stack spacing={3}>
                      <Typography variant="h6" color="text.primary">
                        IB Code
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                          borderRadius: 2
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: '80%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'text.secondary'
                          }}
                        >
                          {customerInfo.ib_code}
                        </Typography>
                        <Tooltip title="Copy IB Code">
                          <IconButton
                            onClick={() => {
                              copyToClipboard(customerInfo.ib_code);
                            }}
                            size="small"
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': { 
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08)
                              } 
                            }}
                          >
                            <Iconify icon="material-symbols:content-copy-outline" />
                          </IconButton>
                        </Tooltip>
                      </Paper>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Grid>
          </Grid>
        );
      case 'settings':
        return (
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={commonPaperStyle}
                >
                  <Stack spacing={3}>
                    <Typography variant="h6" color="text.primary">
                      IB Status Settings
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.neutral'
                      }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Request Status
                        </Typography>
                        <SeverityPill 
                          color={customerInfo?.is_ib_requested ? "success" : "info"}
                          sx={{ 
                            px: 2,
                            py: 0.5,
                            fontWeight: 600
                          }}
                        >
                          {customerInfo?.is_ib_requested ? "Requested" : "Not Requested"}
                        </SeverityPill>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.neutral'
                      }}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Approve Status
                          </Typography>
                        </Box>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <SeverityPill 
                            color={customerInfo?.is_ib_approved ? "success" : "error"}
                            sx={{ 
                              px: 2,
                              py: 0.5,
                              fontWeight: 600
                            }}
                          >
                            {customerInfo?.is_ib_approved ? 'Approved' : 'Not Approved'}
                          </SeverityPill>
                          <Switch
                            checked={customerInfo?.is_ib_approved}
                            onChange={() => handleChangeIBStatus(!customerInfo?.is_ib_approved)}
                            disabled={isLoading || !customerInfo?.is_ib_requested}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: 'success.main',
                                '&:hover': {
                                  backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08)
                                }
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: 'success.main'
                              }
                            }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={commonPaperStyle}
                >
                  <Stack spacing={3}>
                    <Typography variant="h6" color="text.primary">
                      Level 1 IB Settings
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        bgcolor: 'background.neutral',
                        borderRadius: 2,
                        border: '1px dashed',
                        borderColor: 'divider',
                        boxShadow: 3
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <SeverityPill 
                            color="primary"
                            sx={{ 
                              px: 2,
                              py: 0.5,
                              fontWeight: 600
                            }}
                          >
                            Level 1
                          </SeverityPill>
                          <Box sx={{ flexGrow: 1 }} />
                          <Typography 
                            variant="subtitle2" 
                            color="text.secondary"
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            <Iconify icon="mdi:account-group" />
                            {customerInfo?.ib_l1_network_size || 0}
                          </Typography>
                        </Stack>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            IB Name
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {customerInfo?.ib_l1_name ? (
                              <Link
                                component={RouterLink}
                                to={`${paths.dashboard.customers.index}/${customerInfo?.ib_l1_id}`}
                                color="primary"
                                sx={{ 
                                  textDecoration: 'none',
                                  fontWeight: 500,
                                  '&:hover': { 
                                    textDecoration: 'underline' 
                                  } 
                                }}
                              >
                                {customerInfo?.ib_l1_name}
                              </Link>
                            ) : (
                              <Typography variant="body2" color="text.disabled">
                                n/a
                              </Typography>
                            )}
                            <Tooltip title="Edit Level 1 IB">
                              <IconButton
                                size="small"
                                onClick={handleOpenEditDialog}
                                sx={{ 
                                  color: 'primary.main',
                                  '&:hover': { 
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08)
                                  }
                                }}
                              >
                                <Iconify icon="solar:pen-bold" width={20} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={commonPaperStyle}
                >
                  <Stack spacing={3}>
                    <Typography variant="h6" color="text.primary">
                      Assign IB Reward Plan
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 1,
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'background.neutral'
                    }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Select Reward Plan
                      </Typography>
                      <Box sx={{ minWidth: 120 }}>
                        <Select
                          fullWidth
                          value={selectedRewardId}
                          onChange={(e) => handleChangeIBReward(e.target.value)}
                          disabled={isLoading}
                          sx={{
                            bgcolor: 'background.paper',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'divider'
                            }
                          }}
                        >
                          {ibRewards.map((reward) => (
                            <MenuItem key={reward.id} value={reward.id}>
                              {reward.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
            <CustomerIBLevel1Dialog
              open={isEditDialogOpen}
              onClose={handleCloseEditDialog}
              onGetClient={onGetClient}
              clientId={customerInfo?.id}
            />
          </Grid>
        );
      case 'positions':
        return <CustomerPosition customerId={customerInfo?.id} isIB={true} />;
      case 'rewards':
        return <CustomerTransaction customerId={customerInfo?.id} customerInfo={customerInfo} isIB={true} />;
      case 'customers':
        return <CustomerIBCustomers customerId={customerInfo?.id} isIB={true} />;
      default:
        return null;
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        height: 'fit-content',
        overflow: 'hidden',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
        }
      }}
    >
      <CardContent 
        sx={{ 
          p: sidebar.smUp ? 3 : 2,
          height: 'fit-content'
        }}
      >
        <Box
          component="main"
          sx={{
            minHeight: { xs: 600, sm: 700, md: 880 },
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: (theme) => `0 0 24px 0 ${alpha(theme.palette.neutral[900], 0.08)}`,
            flex: "1 1 auto",
            position: "relative",
            overflow: 'hidden'
          }}
        >
          <Box
            ref={rootRef}
            sx={{ display: "flex" }}
          >
            <CustomerIBSidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              onClose={sidebar.handleClose}
              open={sidebar.open}
              company={company}
            />
            <MailContainer 
              open={sidebar.open}
              sx={{ 
                transition: 'margin 0.3s ease-in-out',
                width: '100%',
                backgroundColor: 'background.default'
              }}
            >
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2,
                    justifyContent: 'space-between',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper'
                  }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <IconButton
                        onClick={sidebar.handleToggle}
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08)
                          }
                        }}
                      >
                        <Iconify icon="lucide:menu" width={24} height={24} />
                      </IconButton>
                      <Typography 
                        variant={sidebar.smUp ? "h5" : "h6"}
                        sx={{ fontWeight: 600 }}
                      >
                        {getTabTitle()}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
                <Box sx={{ p: sidebar.smUp ? 3 : 2, backgroundColor: 'background.paper' }}>
                  {renderContent()}
                </Box>
            </MailContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
