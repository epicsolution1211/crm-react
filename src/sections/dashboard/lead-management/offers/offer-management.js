
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { offersApi } from "src/api/lead-management/offers";

import { DeleteModal } from "src/components/customize/delete-modal";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";

export const OfferManagement = ({ offerId }) => {
  const router = useRouter();
  const [openModal, setModalOpen] = useState(false);

  const handleOfferDelete = async () => {
    try {
      await offersApi.deleteOffer(offerId);
      toast.success("Offer successfully delete!");

      setTimeout(() => {
        router.push(paths.dashboard.lead.offers.index);
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader title="Offer Management" />
      <CardContent>
        <Stack alignItems="flex-end">
          <Button
            color="error"
            variant="outlined"
            sx={{ maxWidth: 150 }}
            onClick={() => setModalOpen(true)}
          >
            Delete Offer
          </Button>
        </Stack>
      </CardContent>

      <DeleteModal
        isOpen={openModal}
        setIsOpen={() => setModalOpen(false)}
        onDelete={() => handleOfferDelete()}
        title={'Delete Offer'}
        description={'Are you sure you want to delete this Offer?'}
      />
    </Card>
  );
};
