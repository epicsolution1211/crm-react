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

export const ValidationRuleManagement = ({ ruleId, taskId }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const onDelete = async () => {
    try {
      await validationRuleApi.deleteValidationRule(ruleId);
      toast("Validation rule successfully deleted!");
      setTimeout(() => router.push(`${paths.dashboard.paymentAudit.validationRules.index}/${taskId}?tab=rules`), 1000)
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
            Delete Validation Rule
          </Button>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onDelete={() => onDelete()}
        title={'Delete Validation Rule'}
        description={'Are you sure you want to delete this Validation Rule?'}
      />
    </>
  );
};
