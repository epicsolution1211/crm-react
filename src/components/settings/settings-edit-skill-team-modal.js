import * as Yup from "yup";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "../scrollbar";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "src/hooks/use-debounce";
import { settingsApi } from "src/api/settings";
import { thunks } from "src/thunks/settings";
import { getAPIUrl } from "src/config";

const validationSchema = Yup.object({
  name: Yup.string().max(255).required("Name is required"),
});

export const SettingsEditSkillTeamModal = ({ open, onClose, handleUpdateSkillTeam, skillTeam }) => {
  const dispatch = useDispatch();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({resolver : yupResolver(validationSchema)});

  const handleSkillSubmit = async (data) => {
    try {
      await handleUpdateSkillTeam(data.name);
    } catch (error) {
      toast.error(err?.response?.data?.message ?? err?.message);
    } finally {
      onClose();
    }
  }

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  const query = useDebounce(search, 300);

  useEffect(() => {
    const account_ids = [];
    skillTeam?.accounts &&
    skillTeam.accounts.forEach((acc) => {
      account_ids.push(acc.id);
    });
    
    const getMembers = async () => {
      const q = query ? query : "*";
      const members = await settingsApi.getMembers([], q, {}, account_ids);
      setMembers(members?.accounts);
    };
    
    if(account_ids?.length>0) {
      getMembers();
    } else {
      setMembers([]);
    }
    
    if(skillTeam) {
      setValue('name', skillTeam?.name??"")
    }
  }, [skillTeam, query]);

  const handleRemoveMember = useCallback(
    async (id) => {
      await settingsApi.updateSkillTeam({
        non_account_ids: [id],
        id: skillTeam.id,
      });
      toast.success("Member successfully removed from skill team!");
      dispatch(thunks.getSkillTeams());
      onClose();
    },
    [dispatch, skillTeam, onClose]
  );

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
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
    >
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
          "& .simplebar-scrollbar:before": {
            background: "var(--nav-scrollbar-color)",
          },
        }}
      >
        <Stack
          sx={{
            display: "flex",
            alignItems: "center",
            p: 3,
          }}
        >
          <form
            onSubmit={handleSubmit(handleSkillSubmit)}
            style={{ width: "100%" }}
          >
            <Stack spacing={5}>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Update Skill Team
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                sx={{ mt: 4 }}
              >
                <TextField
                  label="Name"
                  type="text"
                  autoFocus
                  error={!!errors?.name?.message}
                  helperText={errors?.name?.message}
                  fullWidth
                  InputLabelProps={{shrink:true}}
                  {...register('name')}
                />

                <Button
                  variant="contained"
                  type="submit"
                >
                  Update
                </Button>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  Members
                </Typography>

                <Stack spacing={1}>
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
                    onChange={(e) => setSearch(e?.target?.value)}
                    placeholder="Search members..."
                    value={search}
                  />
                  {members &&
                    members.map((member) => (
                      <Stack key={member.id} direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                        <TableRow>
                          <TableCell sx={{ border: "none" }}>
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
                        <IconButton onClick={() => handleRemoveMember(member?.id)}>
                          <Iconify icon="iconoir:xmark" width={26}/>
                        </IconButton>
                      </Stack>
                    ))}
                </Stack>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};
