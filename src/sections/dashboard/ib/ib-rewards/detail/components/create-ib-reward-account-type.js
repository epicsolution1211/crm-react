import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import { ibsApi } from 'src/api/ibs';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Iconify } from 'src/components/iconify';
import { useInternalBrands } from 'src/hooks/custom/use-brand';
import { currencyFlagMap, PAYMENT_TYPES } from 'src/utils/constant';

export const CreateIBRewardAccountType = ({ 
  open, 
  onClose, 
  brandId, 
  onSuccess, 
  rewardId, 
  accountTypesList,
  editData = null,
  hasSymbol = false
}) => {
  const [symbols, setSymbols] = useState([]);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [showValidationError, setShowValidationError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { internalBrandsInfo : brandsInfo } = useInternalBrands();

  const currencyList = useMemo(() => {
    const currentBrand = brandsInfo?.find((brand)=> brand.id == brandId);

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
  }, [brandsInfo, brandId])

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      t_account_type_ids: [],
      symbols: [],
      lot_size: '',
    }
  });

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await ibsApi.getIBTickerNames();
        setSymbols(response?.ticker_names || []);
      } catch (error) {
        console.error('Error fetching symbols:', error);
      }
    };
    
    fetchSymbols();
  }, []);

  useEffect(() => {
    if (editData) {
      reset({
        t_account_type_ids: Array.isArray(editData.t_account_type_id) 
          ? editData.t_account_type_id
          : [editData.t_account_type_id],
        symbols: Array.isArray(editData.symbol) 
          ? editData.symbol
          : [editData.symbol],
        lot_size: editData.lot_size,
      });
      
      const existingPlans = [1, 2, 3, 4, 5]
        .map(level => {
          const type = editData[`payment_plan_l${level}`];
          const amount = editData[`payment_amount_l${level}`];
          return type && amount ? { type, amount } : null;
        })
        .filter(plan => plan !== null);
      
      setPaymentPlans(existingPlans);
    } else {
      reset({
        t_account_type_ids: [],
        symbols: [],
        lot_size: '',
      });
      setPaymentPlans([]);
    }
  }, [editData, reset]);

  const handleAddPlan = () => {
    if (paymentPlans.length < 5) {
      setPaymentPlans([...paymentPlans, { type: 'fixed', amount: '' }]);
    }
  };

  const handleRemovePlan = (index) => {
    const newPlans = paymentPlans.filter((_, i) => i !== index);
    setPaymentPlans(newPlans);
  };

  const onSubmit = async (formData) => {
    if (paymentPlans.length === 0) {
      setShowValidationError(true);
      return;
    }

    if (formData.t_account_type_ids.length === 0) {
      toast.error('Please select at least one trading account type');
      return;
    }

    if (hasSymbol && formData.symbols.length === 0) {
      toast.error('Please select at least one symbol');
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      internal_brand_id: brandId,
      ib_reward_id: rewardId,
      t_account_type_ids: formData.t_account_type_ids,
      lot_size: formData.lot_size,
    };

    if (hasSymbol) {
      payload.symbols = formData.symbols;
    }

    paymentPlans.forEach((plan, index) => {
      const level = index + 1;
      payload[`payment_plan_l${level}`] = plan.type;
      payload[`payment_amount_l${level}`] = plan.amount;
      payload[`payment_currency_l${level}`] = plan.currency;
    });

    try {
      if (editData) {
        await ibsApi.updateIBRewardAccountType(editData.id, payload);
        toast.success('Reward account type updated successfully');
      } else {
        await ibsApi.createIBRewardAccountType(payload);
        toast.success('Reward account type created successfully');
      }
      reset();
      setPaymentPlans([]);
      setShowValidationError(false);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error saving reward');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ mt: 2 }}>
        {editData ? 'Edit' : 'Create'} {hasSymbol ? 'Asset' : 'Reward Account Type'}
      </DialogTitle>
      <DialogContent>
        <Box 
          component="form" 
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
          <Controller
            name="t_account_type_ids"
            control={control}
            rules={{ required: 'Trading Account Type is required' }}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={accountTypesList}
                disableCloseOnSelect
                getOptionLabel={(option) => option?.name ?? `Account Type ${option?.id}`}
                value={accountTypesList.filter(opt => field.value.includes(opt.id))}
                onChange={(_, newValue) => field.onChange(newValue.map(item => item.id))}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Trading Account Types" 
                    fullWidth
                    error={!!errors.t_account_type_ids}
                    helperText={errors.t_account_type_ids?.message}
                  />
                )}
              />
            )}
          />

          {hasSymbol && (
            <Controller
              name="symbols"
              control={control}
              rules={{ required: 'Symbol is required' }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  disableCloseOnSelect
                  options={symbols}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params} 
                      label="Symbols" 
                      fullWidth
                      error={!!errors.symbols}
                      helperText={errors.symbols?.message}
                    />
                  )}
                />
              )}
            />
          )}

          <Controller
            name="lot_size"
            control={control}
            rules={{ 
              required: 'Lot Size is required',
              pattern: {
                value: /^[0-9]*\.?[0-9]+$/,
                message: 'Please enter a valid number'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Lot Size"
                fullWidth
                error={!!errors.lot_size}
                helperText={errors.lot_size?.message}
              />
            )}
          />

          {paymentPlans.map((plan, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" px={1}>
                Payment Plan Level {index + 1}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  select
                  label="Payment Type"
                  size="small"
                  value={plan.type}
                  onChange={(e) => {
                    const newPlans = [...paymentPlans];
                    newPlans[index].type = e.target.value;
                    setPaymentPlans(newPlans);
                  }}
                  fullWidth
                >
                  {PAYMENT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value} disabled={type.disabled}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
                {plan.type === 'fixed' && (
                  <TextField
                    select
                    fullWidth
                    name="currency"
                    label="Currency"
                    size="small"
                    value={plan.currency ?? 1}
                    onChange={(e) => {
                      const newPlans = [...paymentPlans];
                      newPlans[index].currency = e.target.value;
                      setPaymentPlans(newPlans);
                    }}
                  >
                    {currencyList?.map((currency) => (
                      <MenuItem
                        key={currency.key}
                        value={currency.key}
                      >
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Iconify
                            icon={currencyFlagMap?.[currency?.key]}
                            color={currency?.key == 0 ? 'text.disabled' : 'inherit'}
                            width={24}
                            sx={{ flexShrink: 0 }} />
                          <Typography variant="body2">
                            {currency?.name ?? ''}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                <TextField
                  type="number"
                  label="Amount"
                  InputLabelProps={{ shrink: true }}
                  value={plan.amount}
                  size="small"
                  onChange={(e) => {
                    const newPlans = [...paymentPlans];
                    newPlans[index].amount = e.target.value;
                    setPaymentPlans(newPlans);
                  }}
                  fullWidth
                />
                <IconButton sx={{ p: 0 }}>
                  <Iconify 
                    onClick={() => handleRemovePlan(index)} 
                    icon="heroicons:trash" 
                    width={26}
                    sx={{ 
                      color: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.dark' }
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddPlan}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Payment Plan
          </Button>
          
          {showValidationError && paymentPlans.length === 0 && (
            <Typography color="error" variant="caption" px={2}>
              At least one payment plan is required
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} p={2}>
          <Button variant='outlined' onClick={onClose}>Cancel</Button>
          <LoadingButton 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            loading={isSubmitting}
          >
            {editData ? 'Save Changes' : 'Create'}
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}; 