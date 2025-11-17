import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { ibsApi } from 'src/api/ibs';
import { Iconify } from 'src/components/iconify';
import { settingsApi } from 'src/api/settings';
import { Scrollbar } from 'src/components/scrollbar';
import { DeleteModal } from 'src/components/customize/delete-modal';
import { PaymentDetailContent, PaymentPlansDialog } from './components/payment-plan-dialog';
import { CreateIBRewardAccountType } from './components/create-ib-reward-account-type';

export const IBRewardsAccountType = ({ brandId, rewardId, hasSymbol = false }) => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountTypesList, setAccountTypesList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    accountTypeId: null
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccountTypes = async () => {
    setIsLoading(true);
    try {
      const response = await ibsApi.getIBRewardAccountTypes({ ib_reward_id: rewardId, symbol: hasSymbol ? "true" : "false" });
      setAccountTypes(response?.accounts || []);
    } catch (error) {
      console.error('Error fetching account types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountTypesList = async () => {
    try {
      const res = await settingsApi.getAccountType({
        internal_brand_id: brandId,
      });
      setAccountTypesList(res?.account_types || []);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (brandId) {
      fetchAccountTypes();
      getAccountTypesList();
    }
  }, [brandId]);

  const getAccountTypeName = (accountTypeId) => {
    const accountType = accountTypesList.find(type => type.id === accountTypeId);
    return accountType?.name || 'N/A';
  };

  const hasPaymentPlans = (type) => {
    return type.payment_plan_l1 || type.payment_plan_l2 || 
          type.payment_plan_l3 || type.payment_plan_l4 || 
          type.payment_plan_l5;
  };

  const getActivePaymentPlansCount = (type) => {
    return [1, 2, 3, 4, 5].filter(level => 
      type[`payment_plan_l${level}`] && type[`payment_amount_l${level}`]
    ).length;
  };

  const handleEdit = (accountType) => {
    setEditData(accountType);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditData(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({
      open: true,
      accountTypeId: id
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await ibsApi.deleteIBRewardAccountType(deleteConfirmation.accountTypeId);
      fetchAccountTypes();
    } catch (error) {
      console.error('Error deleting account type:', error);
    } finally {
      setDeleteConfirmation({
        open: false,
        accountTypeId: null
      });
      setIsDeleting(false);
    }
  };

  return (
    <Stack sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        mb: 3 
      }}>
        <Button
          variant="contained"
          onClick={() => setIsDialogOpen(true)}
        >
          Create {hasSymbol ? 'New Asset' : 'Account Type'}
        </Button>
      </Box>

      {accountTypes.length > 0 ? (
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          maxHeight: '75vh',
        }}>
          <Scrollbar sx={{ maxHeight: '75vh' }}>
            <Box sx={{ minHeight: 100 }}>
              <Table sx={{ 
                minWidth: 800,
                '& th, & td': {
                  whiteSpace: 'nowrap'
                }
              }}>
                <TableHead>
                  <TableRow>
                    {[
                      { label: 'Trading Account Type' },
                      { label: 'Symbol' },
                      { label: 'Lot Size' },
                      { label: 'Payment Plans' },
                      { label: 'Actions' }
                    ].filter(cell => hasSymbol ? true : cell.label !== 'Symbol').map((cell) => (
                      <TableCell key={cell.label} sx={{ whiteSpace: 'nowrap' }}>
                        {cell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{getAccountTypeName(type.t_account_type_id)}</TableCell>
                      {hasSymbol && <TableCell>{type.symbol}</TableCell>}
                      <TableCell>{type.lot_size}</TableCell>
                      <TableCell>
                        {hasPaymentPlans(type) ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2">
                              {getActivePaymentPlansCount(type)} level(s)
                            </Typography>
                            <Tooltip arrow title={(<PaymentDetailContent paymentPlans={type} isHover/>)}>
                              <IconButton 
                                size="small"
                                onClick={() => setSelectedPaymentPlan(type)}
                                sx={{ color: 'primary.main' }}
                              >
                                <Iconify icon="material-symbols:info-outline" width={24} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No plans
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(type)} color="primary">
                              <Iconify icon="mage:edit" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDeleteClick(type.id)} color="error">
                              <Iconify icon="heroicons:trash" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right' }}>
            Showing {accountTypes.length} account types
          </Typography>
        </Box>
      ) : (
        (!isLoading && accountTypes?.length === 0) ? (
          <Box sx={{ 
            textAlign: 'center',
            mt: 15
          }}>
            <Typography variant="h6" gutterBottom>
              {hasSymbol ? 'Creating rewards based on assets' : 'Creating rewards based on account type'}
            </Typography>
            <Typography color="textSecondary">
              Note: specifying rewards per assets will overwrite this settings
            </Typography>
          </Box>
        ) : (
          brandId ? (
            <Stack
              direction="row"
              alignItems="center" 
              justifyContent="center"
              minHeight={300}
            >
              <CircularProgress
                size={50}
                sx={{ alignSelf: "center", justifySelf: "center" }}
              />
            </Stack>
          ) : null
        )
      )}

      <PaymentPlansDialog
        open={Boolean(selectedPaymentPlan)}
        onClose={() => setSelectedPaymentPlan(null)}
        paymentPlans={selectedPaymentPlan || {}}
      />

      <CreateIBRewardAccountType
        open={isDialogOpen}
        onClose={handleCloseDialog}
        brandId={brandId}
        onSuccess={fetchAccountTypes}
        rewardId={rewardId}
        accountTypesList={accountTypesList}
        editData={editData}
        hasSymbol={hasSymbol}
      />

      <DeleteModal
        isOpen={deleteConfirmation.open}
        setIsOpen={() => setDeleteConfirmation({ open: false, accountTypeId: null })}
        onDelete={handleDeleteConfirm}
        isLoading={isDeleting}
        title={'Delete Asset'}
        description={'Are you sure you want to delete this asset?'}
      />
    </Stack>
  );
};
