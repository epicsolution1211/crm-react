import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';

import { currencyOption } from 'src/utils/constant';

export const PaymentDetailContent = ({ paymentPlans, isHover = false }) => {
  return (
    <Stack 
      sx={{ 
        boxShadow: 2, 
        border: isHover? '1px dashed' : 'none', 
        borderColor: 'primary.dark', 
        borderRadius: 0.5, 
        bgcolor: 'background.paper' 
      }}
    >
      {isHover && <Typography variant="subtitle2" sx={{ textAlign: 'center', py: 1 }}>Payment Plans</Typography>}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { label: 'Level' },
                { label: 'Type' },
                { label: 'Amount', align: 'right' }
              ].map((cell) => (
                <TableCell 
                  key={cell.label}
                  sx={{ padding: isHover ? 1 : 'auto' }}
                  align={cell.align}
                >
                  <Typography sx={{ fontSize: isHover ? 12 : 14, fontWeight: 600 }}>
                    {cell.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((level) => {
              const planType = paymentPlans[`payment_plan_l${level}`];
              const amount = paymentPlans[`payment_amount_l${level}`];
              const currency = paymentPlans[`payment_currency_l${level}`];
              if (!planType && !amount) return null;
              return (
                <TableRow key={level}>
                  <TableCell sx={{ padding: isHover ? 1 : 'auto' }}>
                    <Typography sx={{ fontSize: isHover ? 12 : 14, fontWeight: 500 }}>{level}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: isHover ? 1 : 'auto', textTransform: 'capitalize' }}>
                    <Typography sx={{ fontSize: isHover ? 12 : 14, fontWeight: 500 }}>{planType || '-'}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: isHover ? 1 : 'auto' }} align="right">
                    <Typography sx={{ fontSize: isHover ? 12 : 14, fontWeight: 500 }}> 
                      {(planType == 'fixed' && currency) && `${currencyOption?.find((option) => option.value == currency)?.symbol}` }
                      {amount}
                      {planType == 'percentage' && '%'}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export const PaymentPlansDialog = ({ open, onClose, paymentPlans }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle my={1} mx={0.5}>Payment Plans</DialogTitle>
      <DialogContent>
        <PaymentDetailContent paymentPlans={paymentPlans} />
      </DialogContent>
      <DialogActions sx={{ mr: 2, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
