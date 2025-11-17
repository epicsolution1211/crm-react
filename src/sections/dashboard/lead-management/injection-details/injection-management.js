import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import LoadingButton from '@mui/lab/LoadingButton';

import { DeleteModal } from "src/components/customize/delete-modal";

export const InjectionManagement = ({ onDeleteInjection, isLoading }) => {
  const [openModal, setModalOpen] = useState(false);

  const handleDelete = () => {
    setModalOpen(false);
    onDeleteInjection();
  }

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader title="Injection Management" />
      <CardContent>
        <Stack alignItems="flex-end">
          <LoadingButton
            color="error"
            variant="outlined"
            sx={{ maxWidth: 150 }}
            onClick={() => setModalOpen(true)}
            loading={isLoading}
            disabled={isLoading}
          >
            Delete Injection
          </LoadingButton>
        </Stack>
      </CardContent>

      <DeleteModal
        isOpen={openModal}
        setIsOpen={() => setModalOpen(false)}
        onDelete={handleDelete}
        title={"Delete Injection"}
        description={"Are you sure you want to delete this Injection?"}
      />
    </Card>
  );
};
