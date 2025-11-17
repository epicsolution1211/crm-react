import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/paths';
import { ibsApi } from 'src/api/ibs';
import { Iconify } from 'src/components/iconify';
import { IBRewardsEditModal } from '../ib-rewards-edit-modal';
import { DeleteModal } from 'src/components/customize/delete-modal';

export const IBRewardsSetting = ({ rewardId }) => {
  const navigate = useNavigate();
  const [rewardSetting, setRewardSetting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleGetRewardSetting = async () => {
    setIsLoading(true);
    try {
      const res = await ibsApi.getIbRewardsById(rewardId);
      setRewardSetting(res?.reward ?? {});
    } catch (error) {
      console.error('error: ', error);
    }
    setIsLoading(false);
  }

  const handleDeleteReward = async () => {
    setIsDeleting(true);
    try {
      await ibsApi.deleteIbReward(rewardSetting?.id);
      setOpenDeleteModal(false);
      toast.success("Reward deleted successfully");
      navigate(paths.dashboard.ib.ibRewards.index);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    handleGetRewardSetting();
  }, [rewardId]);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  IB Rewards Info
                </Typography>
                <Stack direction="row" gap={1}>
                  <Tooltip title="Update">
                    <IconButton
                      onClick={() => setOpenEditModal(true)}
                      size="small" 
                      sx={{
                        '&:hover': {
                          color: 'primary.dark'
                        },
                        color: 'primary.main'
                      }}
                    >
                      <Iconify icon="mage:edit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => setOpenDeleteModal(true)}
                      size="small"
                      sx={{
                        '&:hover': {
                          color: 'error.dark'
                        },
                        color: 'error.main'
                      }}
                    >
                      <Iconify icon="heroicons:trash" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {rewardSetting?.name || '-'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Status
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: rewardSetting?.enabled ? 'success.main' : 'error.main'
                      }} />
                      <Typography variant="body1">
                        {rewardSetting?.enabled ? 'Enabled' : 'Disabled'}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {rewardSetting?.description || '-'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Auto Transaction Approval
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Iconify 
                        icon={rewardSetting?.auto_transaction ? "gg:check-o" : "fe:disabled"} 
                        width={20} 
                        color={rewardSetting?.auto_transaction ? "success.main" : "warning.main"}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Default
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Iconify 
                        icon={rewardSetting?.default ? "gg:check-o" : "fe:disabled"} 
                        width={20} 
                        color={rewardSetting?.default ? "success.main" : "warning.main"}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Start Date
                    </Typography>
                    <Typography variant="body1">
                      {rewardSetting?.start_date || '-'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      End Date
                    </Typography>
                    <Typography variant="body1">
                      {rewardSetting?.end_date || '-'} 
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <IBRewardsEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        reward={rewardSetting}
        handleGetIbRewards={(reward) => setRewardSetting(reward)}
      />

      <DeleteModal
        isOpen={openDeleteModal}
        setIsOpen={() => setOpenDeleteModal(false)}
        onDelete={() => handleDeleteReward()}
        isLoading={isDeleting}
        title={'Delete Reward'}
        description={'Are you sure you want to delete this Reward?'}
      />
    </>
  );
};
