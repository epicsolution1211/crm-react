import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import toast from "react-hot-toast"
import { paths } from "src/paths";

import { DeleteModal } from 'src/components/customize/delete-modal';
import { paymentTypeApi } from 'src/api/payment_audit/payment_type';
import { useRouter } from "src/hooks/use-router";

export const PaymentManagement = ({ paymentType }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const onDelete = async () => {
    try {
      await paymentTypeApi.deletePaymentType(paymentType?.id);
      toast("Payment type successfully deleted!");
      setTimeout(() => router.push(paths.dashboard.paymentAudit.paymentType.index), 1000)
    } catch (error) {
      console.error('error: ', error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Payment Types Management" />
        <CardContent sx={{ pt: 2, px: 4, display: 'flex', justifyContent: 'end' }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setModalOpen(true)}
          >
            Delete Payment Types
          </Button>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onDelete={() => onDelete()}
        title={'Delete Payment Types'}
        description={'Are you sure you want to delete this Payment Types?'}
      />
    </>
  );
};
