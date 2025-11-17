import * as Yup from "yup";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useFormik } from "formik";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { ChipSet } from "src/components/customize/chipset";
import { Scrollbar } from "src/components/scrollbar";
import { chatApi } from "src/api/chat";
import { settingsApi } from "src/api/settings";
import { useDebounce } from "src/hooks/use-debounce";
import { useMounted } from "src/hooks/use-mounted";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

const validationSchema = Yup.object({
  name: Yup.string().max(255).required("Name is required"),
});

const getInitialValues = () => {
  return {
    name: "",
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
  const { open, onClose, onCreateConversation, handleChatsGet } = props;
  const {
    members,
    selectedMembers,
    setSelectedMembers,
    handleMemberSelect,
    handleMembersSearch,
  } = useMembers();
  const [isLoading, setIsLoading] = useState(false);

  const handleMembersInvite = useCallback(
    async (conversation) => {
      if (!selectedMembers.length) return;

      for (let id of selectedMembers) {
        await chatApi.inviteMemberToChat({
          account_id: id,
          conversation_id: conversation?.id,
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
          const { conversation } = await onCreateConversation({
            name: values.name,
          });
          handleMembersInvite(conversation?.conversation);
          setTimeout(() => {
            handleChatsGet();
            setIsLoading(false);
          }, 1000);
          onClose();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);

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
              <Stack spacing={3}>
                <Stack spacing={2}>
                  <Typography variant="h7" px={1}>
                    Name
                  </Typography>
                  <TextField
                    autoFocus
                    error={!!(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    label="Name"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.name}
                  />
                </Stack>
                <Stack spacing={2}>
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
                  <Scrollbar sx={{ maxHeight: 220, width: 1 }}>
                    <Table>
                      {members?.map((member) => (
                        <TableRow
                          hover
                          selected={selectedMembers?.includes(member.id)}
                          key={member.id}
                          sx={{ cursor: "pointer", py: 2 }}
                          onClick={() => handleMemberSelect(member.id)}
                        >
                          <TableCell sx={{ border: 0 }}>
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
