import { useState } from 'react';
import toast from "react-hot-toast";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { DeleteModal } from 'src/components/customize/delete-modal';
import { affiliateApi } from 'src/api/lead-management/affiliate';
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";


export const AffiliateManagement = ({ affiliate }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const onDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await affiliateApi.deleteAffiliate(affiliate?.id);
      setTimeout(() => {
        toast.success("Affiliate successfully deleted!");
        router.push(paths.dashboard.lead.affiliate.index)
      }, 3000)
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message?? "Somthing went wrong!");
    }
    setTimeout(()=>setIsDeleteLoading(false), 3500);
  }

  return (
    <>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
          sx={{ pt: 4, px: 4, pb: 2 }}>
          <Typography variant="h5">Affiliate Management</Typography>
        </Stack>
        <CardContent sx={{ pt: 2, px: 4 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setModalOpen(true)}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onDelete={() => onDelete()}
        title={'Delete Affiliate'}
        description={'Are you sure you want to delete this affiliate?'}
        isLoading={isDeleteLoading}
      />
    </>
  );
};
