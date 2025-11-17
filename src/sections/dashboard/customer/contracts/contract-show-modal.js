import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { DeleteModal } from "src/components/customize/delete-modal";
import toast from "react-hot-toast";
import { clientDashboardApi } from "src/api/client-dashboard";
import { OfferProgress } from "../../settings/dashboard-setting/offer-progress";
import { getAPIUrl } from "src/config";

export const ContractShowModal = ({ contract, open, onClose, onGetContracts, onContractEdit }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const getOffers = async () => {
    try {
      setIsLoading(true);
      const res = await clientDashboardApi.getIcoOffers();
      setOffers(res?.offers?.map(o => ({
        label: o?.token_name,
        value: o?.id,
      })));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  }

  useEffect(() => {
    getOffers();
  }, []);

  const handleContractDelete = async () => {
    try {
      await clientDashboardApi.deleteClientContract(contract?.id);
      toast.success("ICO Contract successfully deleted!");
      setDeleteOpen(true);

      setTimeout(() => {
        onGetContracts();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  }

  const icoOffer = useMemo(() => {
    const _icoOffer = offers?.map(offer => offer?.value === contract?.ico_offer_id);

    return _icoOffer ?? null;
  }, [contract, offers]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack sx={{ p: 4 }} spacing={2}>
        <Stack alignItems="center" justifyContent="flex-end" direction="row" spacing={2}>
          <Button variant="contained" sx={{ width: 75, height: 30 }} onClick={() => onContractEdit(contract)}>Edit</Button>
          <Button variant="contained" color="error" sx={{ width: 75, height: 30 }} onClick={() => setDeleteOpen(true)}>Delete</Button>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Avatar
            src={contract?.ico_offer?.file ? contract?.ico_offer?.file?.includes('http') ? contract?.ico_offer?.file : `${getAPIUrl()}/${contract?.ico_offer?.file}` : ""}
            sx={{ width: 100, height: 100 }} />
          <Stack alignItems="flex-end">
            <Typography variant="h4">{contract?.contract_type}</Typography>
          </Stack>
        </Stack>

        <Typography variant="h5">Contract date:</Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ pt: 2 }}
        >
          <Typography variant="h6">
            {format(new Date(contract?.contract_start_date), "dd MMM yyyy")}
          </Typography>
          <Typography variant="h6">
            {format(new Date(contract?.contract_end_date), "dd MMM yyyy")}
          </Typography>
        </Stack>

        <OfferProgress
          startDate={new Date(contract?.contract_start_date)}
          endDate={new Date(contract?.contract_end_date)}
        />

        <Divider sx={{ pt: 4 }} />

        <Typography variant="h5" sx={{ pt: 3 }}>Information:</Typography>

        <Stack spacing={3} sx={{ pt: 2 }} divider={<Divider />}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">ICO Offer:</Typography>
            <Typography variant="h6">{icoOffer?.label ?? "N/A"}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contract size:</Typography>
            <Typography variant="h6">{contract?.contract_size}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contract price:</Typography>
            <Typography variant="h6">{contract?.contract_price}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contract status:</Typography>
            <Typography variant="h6">{contract?.contract_status}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contract address:</Typography>
            <Typography variant="h6">{contract?.contract_address}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contract TXID:</Typography>
            <Typography variant="h6">{contract?.contract_txid ?? "N/A"}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contract Type:</Typography>
            <Typography variant="h6">{contract?.contract_type ?? "N/A"}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contract start time:</Typography>
            <Typography variant="h6">{format(new Date(contract?.contract_start_date), "dd MMM yyyy")}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contract end time:</Typography>
            <Typography variant="h6">{format(new Date(contract?.contract_end_date), "dd MMM yyyy")}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contract Token Amount:</Typography>
            <Typography variant="h6">${contract?.contract_token_amount ?? "N/A"}</Typography>
          </Stack>
        </Stack>

      </Stack>

      <DeleteModal
        isOpen={deleteOpen}
        setIsOpen={() => setDeleteOpen(false)}
        onDelete={handleContractDelete}
        title={"Delete ICO Contract"}
        description={"Are you sure you want to delete this ICO Contract?"}
      />
    </Dialog>
  );
};
