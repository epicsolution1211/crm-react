import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { getAPIUrl } from "src/config";
import { settingsApi } from "src/api/settings";
import { thunks } from "src/thunks/settings";
import { useDebounce } from "src/hooks/use-debounce";
import { useDispatch } from "react-redux";

export const SettingsSkillAddMemberDrawer = (props) => {
  const dispatch = useDispatch();
  const { onClose, open = {}, skillTeam, ...other } = props;

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState({
    isLoading: false,
    memberId: null,
  });
  const [tabValue, setTabValue] = useState('skill');

  const [teamMembers, setTeamMembers] = useState([]);

  const query = useDebounce(search, 300);

  useEffect(() => {
    const non_account_ids = [];

    skillTeam?.accounts &&
      skillTeam.accounts.forEach((acc) => {
        non_account_ids.push(acc.id);
      });

    const getMembers = async () => {
      const q = query ? query : "*";
      const members = await settingsApi.getMembers(non_account_ids, q);
      setMembers(members?.accounts?.filter((a) => a?.active));
    };

    getMembers();
    setTeamMembers(skillTeam?.accounts);
  }, [skillTeam, query]);

  const filteredMembers = members?.filter(member => {
    const searchLower = search.toLowerCase();
    const fullName = `${member?.first_name} ${member?.last_name}`.toLowerCase();
    return !search || fullName.includes(searchLower);
  });

  const isMemberInSkillTeam = (memberId) => {
    return skillTeam?.accounts?.some(account => account.id === memberId);
  };

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  const onCloseDrawer = () => {
    setSearch('');
    setSelectedMembers([]);
    setTabValue('skill');
    onClose();
  };

  const handleAssignSelectedMembers = async () => {
    try {
      setLoadingStatus({
        isLoading: true,
        memberId: 'bulk',
      });
      const updatePromises = selectedMembers.map(memberId => {
        return settingsApi.updateSkillTeam({
          account_ids: [memberId],
          id: skillTeam.id,
        });
      });
      await Promise.all(updatePromises);
      setSelectedMembers([]);
      dispatch(thunks.getSkillTeams());
      toast.success('Members successfully assigned!');
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to assign members');
    } finally {
      setLoadingStatus({
        isLoading: false,
        memberId: null,
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedMembers([]);
  };

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onCloseDrawer}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
        sx: { zIndex: 1400 },
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: "100%",
          width: 440,
        },
      }}
      {...other}
    >
      <IconButton 
        color="inherit" 
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}
      >
        <Iconify icon="iconamoon:close" width={24} />
      </IconButton>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{
          px: 3,
          pt: 4,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={0.5}>
          <Typography variant="h6">{skillTeam?.name ?? 'Assign members to skill team'}</Typography>
        </Stack>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 0, mt: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label={
            <Typography>
              Team Members
            </Typography>
          } value='skill'/>
          <Tab label={
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                sx={{ whiteSpace : 'nowrap' }}
              >
                Assign Members
              </Button>
            </Stack>
          } value='assign'/>
        </Tabs>
      </Box>

      <Stack px={3} py={2}>
        <TextField
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="lucide:search" color="text.secondary" width={24} />
              </InputAdornment>
            ),
          }}
          hiddenLabel
          onChange={(e) => setSearch(e?.target?.value)}
          placeholder="Search members..."
          value={search}
        />
      </Stack>

      <Scrollbar
        sx={{
          height: tabValue === 'skill' ? "calc(100% - 240px)" : "calc(100% - 310px)",
          "& .simplebar-content": {
            height: "100%",
          },
          "& .simplebar-scrollbar:before": {
            background: "var(--nav-scrollbar-color)",
          },
        }}
      >
        <Stack spacing={0.5} sx={{ p: 3, py: 0, width: 1 }}>
          {tabValue === 'skill' ? (
            // Skill Team Members tab - no checkboxes
            teamMembers?.filter(member => (member?.first_name?.toLowerCase()?.includes(search?.toLowerCase()) || member?.last_name?.toLowerCase()?.includes(search?.toLowerCase())))?.map((member) => {
              return (
                <TableRow
                  hover
                  key={member.id}
                  sx={{ position: "relative", width: 1 }}
                >
                  <TableCell sx={{ border: "none", width: 1, px: { xs: 1, md: 2 } }}>
                    <Stack alignItems="center" direction="row" gap={1} justifyContent="flex-start">
                      <Stack alignItems="center" direction="row" gap={2}>
                        <Badge
                          badgeContent={
                            <Iconify icon={true ? "icon-park-twotone:check-one" : "ic:twotone-do-not-disturb-on"} width={16} height={16} sx={{ color: 'white', backgroundColor: 'inherit', borderRadius: '50%' }} />
                          }
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          sx={{
                            '& .MuiBadge-badge': {
                              p: 0,
                              m: 0,
                              backgroundColor: true ? 'success.main' : 'error.main',
                              border: '1px solid',
                              borderColor: true ? 'success.dark' : 'error.main',
                              maxWidth: 16,
                              minWidth: 16,
                              maxHeight: 16
                            },
                          }}
                        >
                          <Avatar
                            src={member.avatar ? member.avatar?.includes('http') ? member.avatar : `${getAPIUrl()}/${member.avatar}` : ""}
                            alt="member avatar"
                          />
                        </Badge>
                        <Typography variant="subtitle2">
                          {member?.first_name} {member?.last_name}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  {loadingStatus.isLoading && loadingStatus.memberId === member.id && (
                    <LinearProgress sx={{ width: 1, position: "absolute", bottom: 0, left: 2, right: 2 }} />
                  )}
                </TableRow>
              );
            })
          ) : (
            // Assign Members tab - with checkboxes
            filteredMembers?.filter(member => !isMemberInSkillTeam(member.id) && member?.active)?.map((member) => {
              return (
                <TableRow
                  hover
                  key={member.id}
                  sx={{ cursor: "pointer", position: "relative", width: 1 }}
                  selected={selectedMembers.includes(member.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectMember(member.id);
                  }}
                >
                  <TableCell sx={{ border: "none", width: 1, px: { xs: 1, md: 2 } }}>
                    <Stack direction='row' alignItems='center' gap={1}>
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                      />
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar
                          src={member.avatar ? member.avatar?.includes('http') ? member.avatar : `${getAPIUrl()}/${member.avatar}` : ""}
                          alt="member avatar"
                        />
                        <Typography variant="subtitle2">
                          {member?.first_name} {member?.last_name}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </Stack>
      </Scrollbar>
      {tabValue === 'assign' && 
        <Stack px={3} py={2}>
          <LoadingButton
            startIcon={
              selectedMembers.length > 0 &&
              <Iconify icon="eva:plus-fill" width={22}/>
            }
            variant="contained"
            disabled={selectedMembers.length === 0 && tabValue === 'assign' || loadingStatus.isLoading && loadingStatus.memberId === 'bulk'}
            loading={loadingStatus.isLoading && loadingStatus.memberId === 'bulk'}
            onClick={selectedMembers.length > 0 ? handleAssignSelectedMembers : undefined}
          >
            {selectedMembers.length > 0 ? `Assign (${selectedMembers.length}) ${selectedMembers.length > 1 ? 'members' : 'member'}` : 'Assign Members'}
          </LoadingButton>
        </Stack>
      }
    </Drawer>
  );
};
