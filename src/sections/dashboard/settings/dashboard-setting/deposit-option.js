import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import { ConfirmDialog } from 'src/components/confirm-dialog';
import { pspLinksApi } from 'src/api/lead-management/psp-links';
import { getAPIUrl } from "src/config";
import { PspLinkDialog } from "../trader/psp-link-dialog";

export const DepositOptions = ({ brandId }) => {
  const [pspLinks, setPspLinks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPsp, setSelectedPsp] = useState(null);

  const handleCreate = async (data) => {
    try {
      await pspLinksApi.createPspLink({ ...data, internal_brand_id: brandId });
      toast.success('PSP link created successfully');
      fetchPspLinks();
      setOpenDialog(false);
    } catch (error) {
      toast.error('Failed to create PSP link');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await pspLinksApi.updatePspLink(selectedPsp.id, { ...data, internal_brand_id: brandId });
      toast.success('PSP link updated successfully');
      fetchPspLinks();
      setOpenDialog(false);
      setSelectedPsp(null);
    } catch (error) {
      toast.error('Failed to update PSP link');
    }
  };

  const handleDelete = async () => {
    try {
      await pspLinksApi.deletePspLink(selectedPsp.id);
      toast.success('PSP link deleted successfully');
      fetchPspLinks();
      setOpenConfirm(false);
      setSelectedPsp(null);
    } catch (error) {
      toast.error('Failed to delete PSP link');
    }
  };

  const fetchPspLinks = async () => {
    try {
      const { psp_links } = await pspLinksApi.getPspLinks({ internal_brand_id: brandId });
      setPspLinks(psp_links);
    } catch (error) {
      toast.error('Failed to fetch PSP links');
    }
  };

  useEffect(() => {
    fetchPspLinks();
  }, []);

  const tableColumns = [
    {
      label: "Avatar",
      render: (psp) => (
        <Avatar
          src={
            psp?.avatar
              ? psp?.avatar.includes("http")
                ? psp?.avatar
                : `${getAPIUrl()}/${psp?.avatar}`
              : ""
          }
          alt={psp?.name}
        />
      ),
    },
    { label: "Name", render: (psp) => psp?.name },
    { label: "URL", render: (psp) => psp?.link },
    { label: "Description", render: (psp) => psp?.description },
    {
      label: "Actions",
      render: (psp) => (
        <>
          <IconButton
            onClick={() => {
              setSelectedPsp(psp);
              setOpenDialog(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setSelectedPsp(psp);
              setOpenConfirm(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Stack spacing={2} sx={{ p: { xs: 2, md: 4 }, height: 1, bgcolor: 'background.paper' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">PSP Links</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add PSP Link
        </Button>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableColumns.map((col, index) => (
                <TableCell key={index}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pspLinks.map((psp) => (
              <TableRow key={psp?.id}>
                {tableColumns.map((col, index) => (
                  <TableCell key={index}>{col.render(psp)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PspLinkDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedPsp(null);
        }}
        onSubmitFunc={selectedPsp ? handleUpdate : handleCreate}
        initialData={selectedPsp}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
          setSelectedPsp(null);
        }}
        onConfirm={handleDelete}
        title="Delete PSP Link"
        content="Are you sure you want to delete this PSP link?"
      />
    </Stack>
  );
};
