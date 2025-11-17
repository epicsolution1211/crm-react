import * as Yup from "yup";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useFormik } from "formik";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Unstable_Grid2";

import { settingsApi } from "src/api/settings";
import { useMounted } from "src/hooks/use-mounted";
import { chatApi } from "src/api/chat";
import { useDebounce } from "src/hooks/use-debounce";
import { Scrollbar } from "src/components/scrollbar";
import { ChipSet } from "src/components/customize/chipset";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

const validationSchema = Yup.object({
  subject: Yup.string().max(255).required("Subject is required"),
  priority: Yup.string().required("Priority is required"),
  note: Yup.string(),
});

const getInitialValues = () => {
  return {
    subject: "",
    priority: "1",
    note: "",
  };
};

const useMembers = () => {
  const isMounted = useMounted();
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [search, setSearch] = useState("*");
  const query = useDebounce(search, 500);

  const handleMembersSearch = useCallback((event) => {
    setSearch(event?.target?.value || "*");
  }, []);

  const handleMembersGet = useCallback(async () => {
    const members = await settingsApi.getMembers([], query, {});

    if (isMounted()) {
      setMembers(members?.accounts);
    }
  }, [query]);

  const handleMemberSelect = useCallback(
    (id) => {
      if (selectedMembers?.includes(id)) {
        setSelectedMembers(selectedMembers.filter((m) => m !== id));
      } else {
        setSelectedMembers(selectedMembers.concat(id));
      }
    },
    [selectedMembers]
  );

  useEffect(() => {
    handleMembersGet();
  }, [query]);

  return {
    members,
    selectedMembers,
    setSelectedMembers,
    handleMemberSelect,
    handleMembersSearch,
  };
};

export const ChatCreateConversationDialog = (props) => {
  const isMounted = useMounted();
  const { open, onClose, onCreateConversation, handleTicketsGet } = props;
  const {
    members,
    selectedMembers,
    setSelectedMembers,
    handleMemberSelect,
    handleMembersSearch,
  } = useMembers();
  const [isLoading, setIsLoading] = useState(false);

  const handleMembersInvite = useCallback(
    async (ticket) => {
      if (!selectedMembers.length) return;

      for (let id of selectedMembers) {
        await chatApi.inviteMemberToChat({
          account_id: id,
          conversation_id: ticket?.conversation_id,
        });
      }
    },
    [selectedMembers]
  );

  const memberChip = useMemo(
    () =>
      selectedMembers?.map((value) => {
        const memberNames = members?.map((item) => ({
          name: item?.first_name ? `${item?.first_name} ${item?.last_name}` : item?.email,
          id: item?.id,
          email: item?.email,
        }));
        return {
          displayValue: memberNames?.find((item) => value === item?.id)?.name,
          value: value,
          label: "Member",
        };
      }),
    [members, selectedMembers]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(),
    validateOnBlur: false,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        setIsLoading(true);
        if (isMounted()) {
          const { ticket } = await onCreateConversation({
            subject: values.subject,
            priority: values.priority,
            note: values.note,
          });
          handleMembersInvite(ticket);
          setIsLoading(false);
          setTimeout(() => handleTicketsGet(), 1000);
          onClose();
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  useEffect(() => {
    formik.resetForm();
    setSelectedMembers([]);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">Create conversation</Typography>
          </Stack>

          <Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Subject
                      </Typography>
                      <TextField
                        autoFocus
                        error={
                          !!(formik.touched.subject && formik.errors.subject)
                        }
                        fullWidth
                        helperText={
                          formik.touched.subject && formik.errors.subject
                        }
                        label="Subject"
                        name="subject"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.subject}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={6}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Priority
                      </Typography>
                      <Select
                        value={formik.values.priority}
                        onChange={formik.handleChange}
                        name="priority"
                        helperText={
                          formik.touched.priority && formik.errors.priority
                        }
                        onBlur={formik.handleBlur}
                      >
                        <MenuItem value="2">Low</MenuItem>
                        <MenuItem value="1">Normal</MenuItem>
                        <MenuItem value="3">High</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>
                    Note
                  </Typography>
                  <TextField
                    error={!!(formik.touched.note && formik.errors.note)}
                    fullWidth
                    helperText={formik.touched.note && formik.errors.note}
                    label="Note"
                    name="note"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.note}
                    multiline
                  />
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>
                    Members
                  </Typography>
                  <Box component="form" sx={{ flexGrow: 1 }}>
                    <OutlinedInput
                      defaultValue=""
                      fullWidth
                      placeholder="Search by member name"
                      onChange={handleMembersSearch}
                      startAdornment={
                        <InputAdornment position="start">
                          <Iconify icon="lucide:search" color="text.secondary" width={24} />
                        </InputAdornment>
                      }
                    />
                  </Box>
                  {selectedMembers?.length ? (
                    <>
                      <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ py: 2 }}
                      >
                        <ChipSet
                          chips={memberChip}
                          handleRemoveChip={(value) =>
                            handleMemberSelect(value)
                          }
                        />
                      </Stack>
                    </>
                  ) : null}
                  <Scrollbar sx={{ maxHeight: 230, width: 1 }}>
                    <Table>
                      {members?.map((member) => (
                        <TableRow
                          fullWidth
                          hover
                          selected={selectedMembers?.includes(member.id)}
                          key={member.id}
                          sx={{ cursor: "pointer", width: 1 }}
                          onClick={() => handleMemberSelect(member.id)}
                        >
                          <TableCell sx={{ border: 0, py: 1 }}>
                            <Stack
                              alignItems="center"
                              direction="row"
                              spacing={2}
                            >
                              <Avatar
                                src={member.avatar ? member.avatar?.includes('http') ? member.avatar : `${getAPIUrl()}/${member.avatar}` : ""}
                                alt="member avatar"
                              />
                              <div>
                                <Typography variant="subtitle2">
                                  {member?.first_name ? `${member?.first_name} ${member?.last_name}` : member?.email}
                                </Typography>
                              </div>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Table>
                  </Scrollbar>
                </Stack>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    pb: 3,
                    px: 3,
                  }}
                >
                  <Button color="inherit" sx={{ mr: 2 }} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "success.main",
                      "&:hover": {
                        backgroundColor: "success.dark",
                      },
                    }}
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                  >
                    Create
                  </Button>
                </Box>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
