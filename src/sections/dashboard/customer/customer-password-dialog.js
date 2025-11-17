import { useEffect, useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Iconify } from 'src/components/iconify';
import toast from 'react-hot-toast';
import { customersApi } from 'src/api/customers';
import { useTranslation } from 'react-i18next';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@!])[A-Za-z\d#@!]{10,16}$/;

const validationSchema = yup.object({
  main_password: yup
    .string()
    .required('Main password is required')
    .min(10, 'Password must be at least 10 characters')
    .max(16, 'Password must be at most 16 characters')
    .matches(
      passwordRegex,
      'Password must contain lowercase, uppercase, number, and special character (#,@,!)'
    ),
  investor_password: yup
    .string()
    .required('Investor password is required')
    .min(10, 'Password must be at least 10 characters')
    .max(16, 'Password must be at most 16 characters')
    .matches(
      passwordRegex,
      'Password must contain lowercase, uppercase, number, and special character (#,@,!)'
    )
});

const ValidationRule = memo(({ satisfied, text }) => (
  <Box 
    sx={{ 
      display: 'grid',
      gridTemplateColumns: '20px 1fr',
      gap: 1,
      alignItems: 'center',
      minHeight: '28px',
      overflow: 'hidden'
    }}
  >
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: 20,
      position: 'relative'
    }}>
      <Iconify
        icon="mdi:circle-outline"
        sx={{ 
          color: 'text.secondary',
          fontSize: 16,
          position: 'absolute',
          opacity: satisfied ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}
      />
      <Iconify
        icon="mdi:check-circle"
        sx={{ 
          color: 'success.main',
          fontSize: 16,
          position: 'absolute',
          opacity: satisfied ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
      />
    </Box>
    <Typography
      variant="body2"
      sx={{ 
        color: satisfied ? 'success.main' : 'text.secondary',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'color 0.2s ease-in-out'
      }}
    >
      {text}
    </Typography>
  </Box>
));

const PasswordRules = memo(({ password }) => {
  const { t } = useTranslation();
  const [validations, setValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (password !== undefined) {
      setValidations({
        length: password.length >= 10 && password.length <= 16,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[#@!]/.test(password)
      });
    }
  }, [password]);

  return (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateRows: 'repeat(5, 28px)',
        width: '100%',
        maxWidth: '300px',
        margin: '8px 0'
      }}
    >
      <ValidationRule
        satisfied={validations.length}
        text={t('10-16 characters')}
      />
      <ValidationRule
        satisfied={validations.lowercase}
        text={t('Lowercase letters (a-z)')}
      />
      <ValidationRule
        satisfied={validations.uppercase}
        text={t('Uppercase letters (A-Z)')}
      />
      <ValidationRule
        satisfied={validations.number}
        text={t('Numbers (0-9)')}
      />
      <ValidationRule
        satisfied={validations.special}
        text={t('Special characters (#@!)')}
      />
    </Box>
  );
});

export const CustomerPasswordDialog = ({ open, onClose, accountId, customerId, account }) => {
  const [showMainPassword, setShowMainPassword] = useState(false);
  const [showInvestorPassword, setShowInvestorPassword] = useState(false);
  const [isMainPasswordSaving, setIsMainPasswordSaving] = useState(false);
  const [isInvestorPasswordSaving, setIsInvestorPasswordSaving] = useState(false);

  const mainPasswordForm = useForm({
    resolver: yupResolver(yup.object({
      main_password: validationSchema.fields.main_password
    }))
  });

  const investorPasswordForm = useForm({
    resolver: yupResolver(yup.object({
      investor_password: validationSchema.fields.investor_password
    }))
  });

  const mainPassword = mainPasswordForm.watch('main_password');
  const investorPassword = investorPasswordForm.watch('investor_password');

  useEffect(() => {
    if (account) {
      mainPasswordForm.setValue('main_password', account.main_password);
      investorPasswordForm.setValue('investor_password', account.investor_password);
    }
  }, [account]);

  const handleMainPasswordSubmit = async (data) => {
    try {
      setIsMainPasswordSaving(true);
      await customersApi.updateTraderAccount(accountId, {
        main_password: data.main_password,
        client_id: customerId
      });
      toast.success('Main password updated successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update main password');
    } finally {
      setIsMainPasswordSaving(false);
    }
  };

  const handleInvestorPasswordSubmit = async (data) => {
    try {
      setIsInvestorPasswordSaving(true);
      await customersApi.updateTraderAccount(accountId, {
        investor_password: data.investor_password,
        client_id: customerId
      });
      toast.success('Investor password updated successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update investor password');
    } finally {
      setIsInvestorPasswordSaving(false);
    }
  };

  const handleClose = () => {
    mainPasswordForm.reset();
    investorPasswordForm.reset();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update Account Passwords</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Box component="form" onSubmit={mainPasswordForm.handleSubmit(handleMainPasswordSubmit)}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Main Password"
                type={showMainPassword ? 'text' : 'password'}
                {...mainPasswordForm.register('main_password')}
                error={!!mainPasswordForm.formState.errors.main_password}
                helperText={mainPasswordForm.formState.errors.main_password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowMainPassword(!showMainPassword)}
                        edge="end"
                      >
                        <Iconify icon={showMainPassword ? 'fluent:eye-off-16-filled' : 'fluent:eye-32-filled'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Box sx={{ pl: 2 }}>
                <PasswordRules password={mainPassword} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={isMainPasswordSaving || !mainPasswordForm.formState.isDirty}
                >
                  {isMainPasswordSaving ? 'Saving...' : 'Update Main Password'}
                </Button>
              </Box>
            </Stack>
          </Box>
          
          <Box component="form" onSubmit={investorPasswordForm.handleSubmit(handleInvestorPasswordSubmit)}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Investor Password"
                type={showInvestorPassword ? 'text' : 'password'}
                {...investorPasswordForm.register('investor_password')}
                error={!!investorPasswordForm.formState.errors.investor_password}
                helperText={investorPasswordForm.formState.errors.investor_password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowInvestorPassword(!showInvestorPassword)}
                        edge="end"
                      >
                        <Iconify icon={showInvestorPassword ? 'fluent:eye-off-16-filled' : 'fluent:eye-32-filled'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Box sx={{ pl: 2 }}>
                <PasswordRules password={investorPassword} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={isInvestorPasswordSaving || !investorPasswordForm.formState.isDirty}
                >
                  {isInvestorPasswordSaving ? 'Saving...' : 'Update Investor Password'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}; 