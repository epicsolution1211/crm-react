import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useState } from "react";
import { DeleteModal } from "src/components/customize/delete-modal";
import toast from "react-hot-toast";
import { clientDashboardApi } from "src/api/client-dashboard";
import { SeverityPill } from "src/components/severity-pill";
import { format } from "date-fns";

import { Scrollbar } from "src/components/scrollbar";
import { getAPIUrl } from "src/config";

export const AccountShowModal = ({ account, open, onClose, onGetAccounts, onAccountEdit }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleAccountDelete = async () => {
    try {
      await clientDashboardApi.deleteClientSavingAccount(account?.id);
      toast.success("Client saving account successfully deleted!");
      setDeleteOpen(true);

      setTimeout(() => {
        onGetAccounts();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack sx={{ p: 4 }} spacing={2}>
        <Stack alignItems="center" justifyContent="flex-end" direction="row" spacing={2}>
          <Button variant="contained" sx={{ width: 75, height: 30 }} onClick={() => onAccountEdit(account)}>Edit</Button>
          <Button variant="contained" color="error" sx={{ width: 75, height: 30 }} onClick={() => setDeleteOpen(true)}>Delete</Button>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Avatar
            src={account?.file_url ? account?.file_url?.includes('http') ? account?.file_url : `${getAPIUrl()}/${account?.file_url}` : ""}
            sx={{ width: 100, height: 100 }} />
          <Stack alignItems="flex-end">
            <Typography variant="h4">{account?.name}</Typography>
          </Stack>
        </Stack>

        <Typography variant="h5" sx={{ pt: 3, px: 2, pb: 1 }}>Information:</Typography>

        <Scrollbar sx={{ maxHeight: 500, px: 2 }}>
          <Stack spacing={3} sx={{ pt: 2 }} divider={<Divider />}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Status:</Typography>
              {account?.active ? (
                <SeverityPill color="success">Active</SeverityPill>
              ) : (
                <SeverityPill color="error">Inactive</SeverityPill>
              )}
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Saving account:</Typography>
              <Typography variant="h6">{account?.saving_account?.name}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Percentage:</Typography>
              <Typography variant="h6">{account?.percentage}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Interest:</Typography>
              <Typography variant="h6">{account?.interest}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Amount:</Typography>
              <Typography variant="h6">{account?.amount}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Start date:</Typography>
              <Typography variant="h6">{format(new Date(account?.start_date), "dd MMM yyyy")}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">End date:</Typography>
              <Typography variant="h6">{format(new Date(account?.end_date), "dd MMM yyyy")}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Duration:</Typography>
              <Typography variant="h6">{account?.duration ?? "N/A"}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Note:</Typography>
              <Typography variant="h6">{account?.note}</Typography>
            </Stack>
          </Stack>
        </Scrollbar>

      </Stack>

      <DeleteModal
        isOpen={deleteOpen}
        setIsOpen={() => setDeleteOpen(false)}
        onDelete={handleAccountDelete}
        title={"Delete Saving Account"}
        description={"Are you sure you want to delete this Saving Account?"}
      />
    </Dialog>
  );
};
