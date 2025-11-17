import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";


import { useMemo, useState } from "react";
import { DeleteModal } from "src/components/customize/delete-modal";
import toast from "react-hot-toast";
import { clientDashboardApi } from "src/api/client-dashboard";
import { SeverityPill } from "src/components/severity-pill";
import { getAPIUrl } from "src/config";

export const SavingAccountModal = ({ account, open, onClose, onGetAccounts, onAccountEdit, tickers = [] }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleAccountDelete = async () => {
    try {
      await clientDashboardApi.deleteSavingAccount(account?.id);
      toast.success("Saving account successfully deleted!");
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

  const ticker = useMemo(() => {
    const _ticker = tickers?.find(t => t?.value === account?.ticker_id);

    return _ticker ?? null;
  }, [tickers, account]);

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
            src={account?.file ? account?.file?.includes('http') ? account?.file : `${getAPIUrl()}/${account?.file}` : ""}
            sx={{ width: 100, height: 100 }} />
          <Stack alignItems="flex-end">
            <Typography variant="h4">{account?.name}</Typography>
          </Stack>
        </Stack>

        <Typography variant="h5" sx={{ pt: 3 }}>Information:</Typography>

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
            <Typography variant="h6">Ticker:</Typography>
            <Typography variant="h6">{ticker?.label}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Note:</Typography>
            <Typography variant="h6">{account?.note}</Typography>
          </Stack>
        </Stack>

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
