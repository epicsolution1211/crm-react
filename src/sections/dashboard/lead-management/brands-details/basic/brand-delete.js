import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import toast from "react-hot-toast"
import { paths } from "src/paths";

import { useRouter } from "src/hooks/use-router";
import { DeleteModal } from '../../../../../components/customize/delete-modal';
import { brandsApi } from '../../../../../api/lead-management/brand';

export const BrandManagement = ({ brand }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const onDelete = async () => {
    try {
      await brandsApi.deleteBrand(brand?.id);
      toast("Brand successfully deleted!");
      setTimeout(router.push(paths.dashboard.lead.brands.index), 3000);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Brand Management" />
        <CardContent sx={{ pt: 0 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setModalOpen(true)}
          >
            Delete Brand
          </Button>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onDelete={() => onDelete()}
        title={'Delete Brand'}
        description={'Are you sure you want to delete this brand?'}
      />
    </>
  );
};
