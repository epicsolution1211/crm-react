import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import toast from "react-hot-toast"
import { useParams } from 'react-router';

import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { DeleteModal } from 'src/components/customize/delete-modal';
import { merchantApi } from 'src/api/payment_audit/merchant_api';

export const MerchantFeeManagement = ({ feeId, }) => {
  const router = useRouter();
  const params = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const onDelete = async () => {
    try {
      await merchantApi.deleteRate(feeId);
      toast("Merchant fee successfully deleted!");
      setTimeout(() => router.push(`${paths.dashboard.paymentAudit.merchant.index}/${params?.merchantId}?fee=${true}`), 1000);
    } catch (error) {
      toast(error?.response?.data?.message ?? error?.message)
      console.error('error: ', error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Merchant Fee Management" />
        <CardContent sx={{ pt: 2, px: 4, display: 'flex', justifyContent: 'end' }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setModalOpen(true)}
          >
            Delete Fee
          </Button>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onDelete={() => onDelete()}
        title={'Delete Fee'}
        description={'Are you sure you want to delete this Fee?'}
      />
    </>
  );
};
