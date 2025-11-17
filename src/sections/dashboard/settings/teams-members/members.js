import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { SettingsBulkMembers } from "src/components/settings/settings-bulk-members";
import { SettingsInviteMember } from "src/components/settings/settings-invite-member";
import { SettingsMembersTable } from "./settings-members-table";
import { thunks } from "src/thunks/settings";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";

export const Members = ({ isLoading, itemsWithName = [] }) => {
  const { user } = useAuth();
  const members = useSelector((state) => state.settings.members);
  const dispatch = useDispatch();

  const [openInviteMember, setOpenInviteMember] = useState(false);
  const [openBulkMember, setOpenBulkMember] = useState(false);
  const [searchMembers, setSearchMembers] = useState("");
  const [membersPage, setMembersPage] = useState(0);
  const [membersRowsPerPage, setMembersRowsPerPage] = useState(10);

  const debouncedMembersSearchValue = useDebounce(searchMembers, 500);

  useEffect(() => {
    const storageVal = localStorage.getItem("setting_members_perpage");
    if (storageVal) setMembersRowsPerPage(storageVal);
    else {
      setMembersRowsPerPage(5);
      localStorage.setItem("setting_members_perpage", 5);
    }
  }, []);

  useEffect(() => {
    if (debouncedMembersSearchValue) {
      dispatch(
        thunks.getMembers([], debouncedMembersSearchValue, {
          page: membersPage + 1,
          per_page: membersRowsPerPage,
        })
      );
    } else {
      dispatch(
        thunks.getMembers([], "*", {
          page: membersPage + 1,
          per_page: membersRowsPerPage,
        })
      );
    }
  }, [debouncedMembersSearchValue, dispatch, membersPage, membersRowsPerPage]);

  const handleInviteMemberOpen = () => setOpenInviteMember(true);

  const handleInviteMemberClose = () => setOpenInviteMember(false);

  const handleMembersSearch = useCallback(
    (e) => {
      setSearchMembers(e.target.value);
    },
    [setSearchMembers]
  );

  const handleMemberInviteCallback = async () => {
    try {
      handleInviteMemberClose();
      dispatch(
        thunks.getMembers([], debouncedMembersSearchValue || "*", {
          page: membersPage + 1,
          per_page: membersRowsPerPage,
        })
      );
      toast.success("Member successfully invited!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card>
      <CardHeader title={<Typography variant="h5">Members</Typography>} />
      <CardContent>
        <Grid container spacing={3} sx={{ pl: 2.5 }}>
          <Grid xs={12} md={12} sx={{ mt: 4 }}>
            <Stack spacing={3}>
              <Stack
                justifyContent="space-between"
                sx={{
                  flexDirection: { md: "row" },
                  gap: { md: 4, xs: 2 },
                  "@media (max-width: 1350px)": {
                    flexDirection: "column",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify
                    icon="material-symbols:info-outline"
                    size={13}
                    sx={{ flex: "none" }}
                  />
                  <Stack>
                    <Typography
                      color="text.primary"
                      fontSize={13}
                      fontWeight={600}
                    >
                      Members Info:
                    </Typography>
                    <Typography color="text.primary" fontSize={13}>
                      Members are users with access to the CRM and system. They
                      can be added with: <br />
                      a) An email where credentials are
                      automatically sent. <br />
                      b) Manual credentials sharing by
                      disabling the email option and sharing the email and
                      password directly. <br /> 
                      It is recommended to first create role
                      templates to define and assign roles, especially for desks
                      or teams that share mutual leads.
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ flexDirection: { md: "row", xs: "column" }, gap: 2 }}
                >
                  {user?.acc?.acc_e_client_bulk_invite === undefined ||
                  user?.acc?.acc_e_client_bulk_invite ? (
                    <Button
                      sx={{
                        whiteSpace: "nowrap",
                        width: { md: "auto", xs: 1 },
                      }}
                      startIcon={<Iconify icon="lucide:plus" width={24} />}
                      variant="contained"
                      onClick={() => setOpenBulkMember(true)}
                    >
                      Add Bulk Users
                    </Button>
                  ) : null}
                  {user?.acc?.acc_e_add_agent === undefined ||
                  user?.acc?.acc_e_add_agent ? (
                    <Button
                      startIcon={<Iconify icon="lucide:plus" width={24} />}
                      sx={{
                        whiteSpace: "nowrap",
                        width: { md: "auto", xs: 1 },
                      }}
                      variant="contained"
                      onClick={handleInviteMemberOpen}
                    >
                      Invite member
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="lucide:search" color="text.secondary" width={24} />
                    </InputAdornment>
                  ),
                }}
                label="Search"
                onChange={handleMembersSearch}
                placeholder="Search members..."
                value={searchMembers}
              />
              <SettingsMembersTable
                isLoading={isLoading}
                count={members?.total_count}
                items={itemsWithName}
                page={membersPage}
                onPageChange={(page) => setMembersPage(page)}
                onRowsPerPageChange={(event) => {
                  localStorage.setItem(
                    "setting_members_perpage",
                    event?.target?.value
                  );
                  setMembersRowsPerPage(event?.target?.value);
                }}
                rowsPerPage={membersRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      <SettingsInviteMember
        open={openInviteMember}
        onClose={handleInviteMemberClose}
        onInviteMemberCallback={handleMemberInviteCallback}
      />

      <SettingsBulkMembers
        open={openBulkMember}
        onClose={() => setOpenBulkMember(false)}
      />
    </Card>
  );
};
