import { useState } from "react";
import toast from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { OfferProgress } from "./offer-progress";
import { getAPIUrl } from "src/config";
import { Scrollbar } from "src/components/scrollbar";
import { clientDashboardApi } from "src/api/client-dashboard";
import { DeleteModal } from "src/components/customize/delete-modal";
import { useTimezone } from "src/hooks/use-timezone";

export const IcoOfferModal = ({ offer, open, onClose, onGetOffers, onOfferEdit }) => {
  const { toLocalTime } = useTimezone();
  
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleIcoOfferDelete = async () => {
    try {
      await clientDashboardApi.deleteIcoOffer(offer?.id);
      toast.success("ICO Offer successfully deleted!");
      setDeleteOpen(true);

      setTimeout(() => {
        onGetOffers();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm">
        <Stack p={{xs: 2, md: 4}} spacing={2}>            
          <Stack
            pt={4}
            width={1}
            spacing={2}
            direction={{xs: 'column', md: 'row'}}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" gap={3}>
              <Avatar
                src={offer ? offer?.file?.includes('http') ? offer?.file : `${getAPIUrl()}/${offer?.file}` : ""}
                sx={{ width: 100, height: 100 }} />
              <Stack gap={1} alignItems="flex-end" justifyContent="center">
                <Typography variant="h4">{offer?.token_name}</Typography>
                <Typography variant="h6">{offer?.token_symbol}</Typography>
              </Stack>
            </Stack>
            <Stack alignItems="center" width={{xs: 1, md:'unset'}} justifyContent={{xs: 'space-between', md: 'flex-end'}} direction={{xs: 'row', md: 'column'}} spacing={2}>
              <Button variant="contained" sx={{ width: 75, height: 30 }} onClick={() => onOfferEdit(offer)}>Edit</Button>
              <Button variant="contained" color="error" sx={{ width: 75, height: 30 }} onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ pt: 2 }}
          >
            <Typography variant="h6">
              {toLocalTime(offer?.presale_start_date)}
            </Typography>
            <Typography variant="h5" mb={2}>Presale date:</Typography>
            <Typography variant="h6">
              {toLocalTime(offer?.presale_end_date)}
            </Typography>
          </Stack>

          <OfferProgress
            startDate={new Date(offer?.presale_start_date)}
            endDate={new Date(offer?.presale_end_date)}
          />

          <Divider sx={{ pt: 1}} />

          <Typography variant="h5" py={2}>Information:</Typography>

          <Scrollbar sx={{ maxHeight: {xs: 'none', md: 450}, pr: 2 }}>
            <Stack spacing={3} sx={{ pt: 2 }} divider={<Divider />}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Token name:</Typography>
                <Typography variant="h6">{offer?.token_name}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Token symbol:</Typography>
                <Typography variant="h6">{offer?.token_symbol}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Token decimals:</Typography>
                <Typography variant="h6">{offer?.token_decimals}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Token address:</Typography>
                <Typography variant="h6">{offer?.token_address}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Token supply:</Typography>
                <Typography variant="h6">{offer?.token_total_supply ?? "N/A"}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Tokens for presale:</Typography>
                <Typography variant="h6">{offer?.token_for_presale ?? "N/A"}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Tokens for liquidity:</Typography>
                <Typography variant="h6">{offer?.token_for_liquidity ?? "N/A"}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Hard cap:</Typography>
                <Typography variant="h6">{offer?.hard_cap ?? "N/A"}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Presale start time:</Typography>
                <Typography variant="h6">{toLocalTime(offer?.presale_start_date)}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Presale end time:</Typography>
                <Typography variant="h6">{toLocalTime(offer?.presale_end_date)}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Listing on:</Typography>
                <Typography variant="h6">{toLocalTime(offer?.listing_on)}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Presale price:</Typography>
                <Typography variant="h6">${offer?.presale_price ?? "N/A"}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Listing price:</Typography>
                <Typography variant="h6">${offer?.listing_price ?? "N/A"}</Typography>
              </Stack>
            </Stack>
          </Scrollbar>
        </Stack>
      </Container>

      <DeleteModal
        isOpen={deleteOpen}
        setIsOpen={() => setDeleteOpen(false)}
        onDelete={handleIcoOfferDelete}
        title={"Delete ICO Offer"}
        description={"Are you sure you want to delete this ICO Offer?"}
      />
    </Dialog>
  );
};
