import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import toast from "react-hot-toast"

import { DeleteModal } from 'src/components/customize/delete-modal';
import { paths } from "src/paths";
import { recordApi } from 'src/api/payment_audit/record';
import { useRouter } from "src/hooks/use-router";

export const RecordManagement = ({ recordId }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const onDelete = async () => {
    try {
      await recordApi.deleteRecord(recordId);
      toast("Record successfully deleted!");
      setTimeout(() => {
        router.push(paths.dashboard.paymentAudit.record.index);
      }, 1000);
    } catch (error) {
      toast(error?.response?.data?.message ?? error?.message)
      console.error('error: ', error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Record Management" />
        <CardContent sx={{ pt: 2, px: 4, display: 'flex', justifyContent: 'end' }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setModalOpen(true)}
          >
            Delete Record
          </Button>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onDelete={() => onDelete()}
        title={'Delete Record'}
        description={'Are you sure you want to delete this Record?'}
      />
    </>
  );
};
