import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import toast from "react-hot-toast"

import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { DeleteModal } from 'src/components/customize/delete-modal';
import { validationRuleApi } from 'src/api/payment_audit/validation_rule';

export const ValidationManagement = ({ validationTask }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const onDelete = async () => {
    try {
      await validationRuleApi.deleteValidationTasks(validationTask?.id);
      toast("Validation task successfully deleted!");
      setTimeout(() => router.push(paths.dashboard.paymentAudit.validationRules.index), 1000)
    } catch (error) {
      console.error('error: ', error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Management" />
        <CardContent sx={{ pt: 2, px: 4, display: 'flex', justifyContent: 'end' }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setModalOpen(true)}
          >
            Delete Validation Task
          </Button>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onDelete={() => onDelete()}
        title={'Delete Validation Task'}
        description={'Are you sure you want to delete this Validation Task?'}
      />
    </>
  );
};
