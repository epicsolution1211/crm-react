import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import toast from "react-hot-toast"
import { paths } from "src/paths";

import { useRouter } from "src/hooks/use-router";
import { DeleteModal } from 'src/components/customize/delete-modal';
import { riskApi } from 'src/api/risk';

export const PositionDelete = ({ dealing }) => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await riskApi.deletePosition(dealing?.id);
      toast.success("Position successfully deleted!");
      setTimeout(() => {
        router.push(paths.dashboard.risk.positions);
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error('error: ', error);
    }
  };

  const handleClosePosition = async () => {
    try {
      const request = {
        closed: true,
        client_id: dealing?.client_id,
      };
      await riskApi.updateSingleDealing(dealing?.id, request);
      setTimeout(() => {
        toast.success("Position was successfully closed!");
        setCloseModalOpen(false);
        router.push(paths.dashboard.risk.positions);
      }, 1000);
    } catch (error) {
      setCloseModalOpen(false);
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Position Management" />
        <CardContent sx={{ pt: 0 }}>
          <Stack
            direction='row'
            justifyContent='end'
            gap={2}
          >
            <Button
              color="warning"
              variant="outlined"
              onClick={() => setCloseModalOpen(true)}
            >
              Close Position
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete Position
            </Button>
          </Stack>
        </CardContent>
      </Card>
      
      <DeleteModal
        isOpen={closeModalOpen}
        setIsOpen={setCloseModalOpen}
        onDelete={handleClosePosition}
        title="Close position"
        description="Are you sure you want to close this position?"
        buttonTitle="Close"
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={handleDelete}
        title="Delete position"
        description="Are you sure you want to delete this position?"
      />
    </>
  );
};
