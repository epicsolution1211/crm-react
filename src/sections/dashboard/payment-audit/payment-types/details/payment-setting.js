import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { useAuth } from 'src/hooks/use-auth';

export const PaymentSetting = ({ paymentType, updatePaymentType }) => {
  const { user } = useAuth();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(paymentType?.active)
  }, [paymentType])

  return (
    <Card>
      <CardHeader title="Setting" />
      <Stack
        spacing={5}
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ pt: 3, pb: 5, px: 6 }}>
        <Stack
          direction='column'
          gap={1}>
          <Typography>Active:</Typography>
          <Typography
            variant='subtitle2'
            sx={{ color: '#6c737f', opacity: 82 }}>Deactivating Payment Types will mark new entries as Invalid</Typography>
        </Stack>
        <Switch
          disabled={!user?.acc?.acc_e_audit_payment_type}
          checked={active}
          onChange={(event) => {
            setActive(event?.target?.checked);
            updatePaymentType(paymentType?.id, { active: event?.target?.checked })
          }}
        />
      </Stack>
    </Card>
  );
};
