import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { DeleteModal } from "src/components/customize/delete-modal";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { useTimezone } from "src/hooks/use-timezone";
import { useGetAccountEmails } from "src/hooks/swr/use-account";

import { AUTH_TYPE_OPTIONS } from "src/utils/constants";
import { CreateEmailDialog } from "./create-email-dialog";
import { EditEmailDialog } from "./edit-email-dialog";
import { SignatureEditDialog } from "./signature-edit-dialog";
import { SignatureViewDialog } from "./signature-view-dialog";
import { userApi } from "src/api/user";

export const AccountEmails = ({ member }) => {
  const { toLocalTime } = useTimezone();

  const { emails, isLoading, mutate } = useGetAccountEmails({ account_id: member?.id });

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSignatureEdit, setOpenSignatureEdit] = useState(false);
  const [openSignatureView, setOpenSignatureView] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState();
  const [emailToEdit, setEmailToEdit] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const DEFAULT_COLUMN = useMemo(() => [
    {
      id: "id",
      label: "ID",
      enabled: true,
    },
    {
      id: "email",
      label: "Email",
      enabled: true,
    },
    {
      id: "enabled",
      label: "Status",
      enabled: true,
      render: (row) => (
        <SeverityPill color={row?.enabled ? "success" : "error"}>
          {row?.enabled ? "Enabled" : "Disabled"}
        </SeverityPill>
      ),
    },
    {
      id: "smtp",
      label: "SMTP",
      enabled: true,
      render: (row) => (
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Host: {row?.smtp_host}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Port: {row?.smtp_port}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 0.5 }}>
            SSL: <Iconify icon={row?.smtp_ssl ? "icon-park-outline:check-one" : "ic:twotone-do-disturb-alt"} color={row?.smtp_ssl ? "success.main" : "error.main"} width={18} height={18}/>
          </Typography>
          <SeverityPill color={row?.smtp_enabled ? "success" : "error"} sx={{ width: "fit-content" }}>
            {row?.smtp_enabled ? "Enabled" : "Disabled"}
          </SeverityPill>
          {row?.smtp_authentication && (
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                Auth Type: {AUTH_TYPE_OPTIONS.find(option => option.value === row?.smtp_authentication)?.label}
              </Typography>
              <Iconify icon="iconoir:info" color="text.secondary" width={18} height={18}/>
            </Stack>
          )}
        </Stack>
      ),
    },
    {
      id: "imap",
      label: "IMAP",
      enabled: true,
      render: (row) => (
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Host: {row?.imap_host}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Port: {row?.imap_port}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 0.5 }}>
            SSL: <Iconify icon={row?.imap_ssl ? "icon-park-outline:check-one" : "ic:twotone-do-disturb-alt"} color={row?.imap_ssl ? "success.main" : "error.main"} width={18} height={18}/>
          </Typography>
          <SeverityPill color={row?.imap_enabled ? "success" : "error"} sx={{ width: "fit-content" }}>
            {row?.imap_enabled ? "Enabled" : "Disabled"}
          </SeverityPill>
          {row?.imap_error_message && (
            <Typography variant="body2" color="error.main">
              Error: {row?.imap_error_message}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      id: "signature",
      label: "Email Signature",
      enabled: true,
      render: (row)=>(
        row?.email_signature?.length>0?
        <Button
          startIcon={<Iconify icon="material-symbols:info-outline" />}
          onClick={()=>{
            setEmailToEdit(row);
            setOpenSignatureView(true);
          }}
          color="inherit"
        >
          Signature
        </Button>
      : null),
    },
    {
      id: "reply_to",
      label: "Reply To",
      enabled: true,
    },
    {
      id: "created_at",
      label: "Created At",
      enabled: true,
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {toLocalTime(row?.created_at)}
        </Typography>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={0.2}>
          <Tooltip title="Edit Email">
            <IconButton 
              color="primary"
              onClick={() => {
              setEmailToEdit(row);
              setOpenEditModal(true);
              }}
              size="small"
            >
              <Iconify icon="bx:edit" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Signature">
            <IconButton 
              color="info"
              onClick={() => {
              setEmailToEdit(row);
              setOpenSignatureEdit(true);
              }}
              size="small"
            >
              <Iconify icon="mi:email"/>
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton 
              color="error"
              onClick={() => {
              setEmailToDelete(row?.id);
              setOpenDeleteModal(true);
              }}
              size="small"
            >
              <Iconify icon="iconamoon:trash-light" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    },
  ], []);

  const handleDeleteEmail = async () => {
    try {
      await userApi.deleteAccountEmail(emailToDelete);
      toast.success("Email successfully deleted");
      setOpenDeleteModal(false);
      setEmailToDelete(null);
      setTimeout(() => {
        mutate();
      }, 1500);
    } catch (error) {
      setOpenDeleteModal(false);
      throw new Error(error);
    }
  }

  return (
    <Stack sx={{ p: { xs: 2, md: 3 }, minHeight:"calc(100vh - 360px)"}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5">Email Setup</Typography>
          <Tooltip title="Manage and create company email addresses here. Ensure each email is verified with your SMTP provider. Agents with the necessary access can use these company emails as the sender address for their communications.">
            <IconButton color="primary">
              <Iconify icon="material-symbols:info-outline" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Button
          startIcon={<Iconify icon="si:add-line" width={18} height={18}/>}
          variant="contained" 
          onClick={() => setOpenCreateModal(true)}
        >
          Add
        </Button>
      </Stack>
      <Stack sx={{ mt: 2 }}>
        <Stack>
          <Scrollbar sx={{ minHeight: 315 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {DEFAULT_COLUMN?.map((item) => (
                    <TableCell key={`${item.id}-header`}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.label}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton cellCount={9} rowCount={5} />
                  ) : (emails?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((email) => {
                    return (
                      <TableRow hover key={`${email.id}-email`}>
                        {DEFAULT_COLUMN
                          ?.map((column, index) => (
                            <TableCell
                              key={`${email?.id + index}-row`}
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              {column?.render
                                ? column?.render(email)
                                : email[column?.id]}
                              </TableCell>
                            ))}
                        </TableRow>
                      );
                    })
                  )}
              </TableBody>
            </Table>
            {(emails?.length === 0 && !isLoading) && <TableNoData />}
          </Scrollbar>
          <Divider />
          <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
            <PageNumberSelect 
              currentPage={currentPage} 
              totalPage={emails?.length ? Math.ceil(emails?.length/perPage) : 0}
              onUpdate={setCurrentPage}
            />
            <TablePagination
              component="div"
              labelRowsPerPage="Per page"
              count={emails?.length ?? 0}
              page={currentPage ?? 0}
              rowsPerPage={perPage ?? 5}
              onPageChange={(event, index) => setCurrentPage(index)}
              onRowsPerPageChange={(event) =>
                setPerPage(event?.target?.value)
              }
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Stack>
        </Stack>
      </Stack>

      <CreateEmailDialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onGetEmails={mutate}
        member={member}
      />

      <EditEmailDialog
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setEmailToEdit(null);
        }}
        onGetEmails={mutate}
        email={emailToEdit}
      />

      <SignatureEditDialog
        open={openSignatureEdit}
        onClose={() => {
          setOpenSignatureEdit(false);
        }}
        onGetEmails={mutate}
        email={emailToEdit}
      />

      <SignatureViewDialog
        open={openSignatureView}
        onClose={() => {
          setOpenSignatureView(false);
        }}
        email={emailToEdit}
      />

      <DeleteModal
        isOpen={openDeleteModal}
        setIsOpen={() => {
          setOpenDeleteModal(false);
          setEmailToDelete(null);
        }}
        onDelete={handleDeleteEmail}
        title={"Delete email"}
        description={"Are you sure you want to delete this email?"}
      />
    </Stack>
  );
};
