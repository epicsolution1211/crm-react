import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import { alpha } from "@mui/system/colorManipulator";

import { generateRandomPassword } from "src/utils/generate-password";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { Iconify } from 'src/components/iconify';
import MultiSelectMenu from "../customize/multi-select-menu";
import { ChipSet } from "../customize/chipset";
import { Scrollbar } from "../scrollbar";
import { SelectMenu } from "../customize/select-menu";
import { defaultTemplate } from "./constants";
import { getAPIUrl } from "src/config";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { useSettings } from "src/hooks/use-settings";
import Grid from "@mui/system/Unstable_Grid/Grid";

export const SettingsInviteMember = ({ open, onClose, onInviteMemberCallback }) => {
  const { user } = useAuth();
  const settings = useSettings();

  const avatarRef = useRef(null);

  const [sendInvite, setSetInvite] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [teamList, setTeamList] = useState([]);
  const [deskList, setDeskList] = useState([]);
  const [ips, setIps] = useState([]);
  const [roleTemplates, setRoleTemplates] = useState([]);
  const [templateList, setTemplateList] = useState([]);

  const [isPending, setIsPending]= useState(false);

  const validationSchema = useMemo(()=> {
    if(sendInvite) {
      let ipFields = {};
      ips?.forEach((ip)=> {
        ipFields = {
          ...ipFields,
          [ip.id]: Yup.string().matches(/^(?:\d{1,3}\.){3}\d{1,3}$|^([a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/, "Must be a correct IP")
        };
      })
      const validation = Yup.object({
        email: Yup.string().email("Must be a valid email").required("Email is required"),
        role_id: Yup.string().required("Role is required"),
        ...ipFields,
      });
      return validation;
    } else {
      let ipFields = {};
      ips?.forEach((ip)=> {
        ipFields = {
          ...ipFields,
          [ip.id]: Yup.string().matches(/^(?:\d{1,3}\.){3}\d{1,3}$|^([a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/, "Must be a correct IP")
        };
      })
      const validation = Yup.object({
        email: Yup.string().email("Must be a valid email").required("Email is required field!"),
        first_name: Yup.string().required("First Name is required field!"),
        last_name: Yup.string().required("Last Name is required field!"),
        role_id: Yup.string().required("Role is required field!"),
        password: Yup.string().required("Password is required field!"),
        ...ipFields,
      });
      return validation;
    }
  }, [sendInvite, ips]);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const team_ids = useWatch({ control, name: "team_ids" });
  const desk_ids = useWatch({ control, name: "desk_ids" });

  const getDesk = async () => {
    try {
      const res = await settingsApi.getDesk();
      const deskList = res?.desks
        ?.map((desk) => ({
          label: desk?.name,
          value: desk?.id?.toString(),
          color: desk?.color ?? settings?.colorPreset,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setDeskList(deskList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getRoleTemplates = async () => {
    try {
      const { temp_rolls: templates } = await settingsApi.getRoles();
      setTemplateList(templates?.map(t => ({
        label: t?.name,
        value: t?.id,
      })));
      setRoleTemplates(templates);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getSkillTeams = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");

      const teamInfo = res?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const teamChip = useMemo(() => {
    const newChips = team_ids?.map((selected) => {
      const chip = teamList?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Team",
      };
    });
    return newChips;
  }, [team_ids, teamList]);

  const deskChip = useMemo(() => {
    const newChips = desk_ids?.map((selected) => {
      const chip = deskList?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Desk",
      };
    });
    return newChips;
  }, [desk_ids, deskList]);

  const handleRemoveChip = (value, type) => {
    if (type === "team_ids") {
      const newStatus = [...team_ids].filter((item) => item !== value);
      setValue("team_ids", newStatus);
    }
    if (type === "desk_ids") {
      const newStatus = [...desk_ids].filter((item) => item !== value);
      setValue("desk_ids", newStatus);
    }
  };

  useEffect(() => {
    reset();
    setSetInvite(false);
    setAvatarPreview(null);
    getSkillTeams();
    getDesk();
    getRoleTemplates();
    setValue("password", generateRandomPassword());
  }, [onClose]);

  const handleChangeAvatar = useCallback(async (event) => {
    const file = event?.target?.files[0];
    const imageUrl = URL.createObjectURL(file);
    setAvatar(file);
    setAvatarPreview(imageUrl);
  }, []);

  const handleAvatarAttach = useCallback(() => {
    avatarRef?.current?.click();
  }, []);

  const handleAddIp = () => {
    setIps(ips?.concat([{ id: uuid(), ip: "" }]));
  };

  const handleChangeIpValue = (e, id) => {
    const val = e?.target?.value;

    setIps((prev) => {
      return prev?.map((ip) => {
        if (ip?.id === id) {
          return {
            ...ip,
            ip: val,
          };
        } else {
          return ip;
        }
      });
    });
  };

  const handleDeleteIp = (id) => {
    setIps((prev) => {
      return prev?.filter((ip) => ip?.id !== id);
    });
  };

  const onSubmit = async (data) => {
    setIsPending(true);
    try {
      const template = roleTemplates?.find(t => t?.id == data?.role_id);

      if (sendInvite) {
        const { account } = await settingsApi.inviteMember({
          email: data?.email
        });
        if (template) {
          setTimeout(async () => {
            await settingsApi.updateMember(account?.id, { role_temp_id: data?.role_id, acc: template?.acc, account_id: account?.id });
          }, 1000);

        } else {
          setTimeout(async () => {
            await settingsApi.updateMember(account?.id, { acc: defaultTemplate, account_id: account?.id });
          }, 2000);
        }
        if (data?.desk_ids) {
          setTimeout(async () => {
            await settingsApi.updateMember(account?.id, { desk_ids: data?.desk_ids, account_id: account?.id });
          }, 3000);
        }
        if (avatar) {
          const formData = new FormData();
          formData.append("avatar", avatar);
          formData.append("account_id", account?.id);
          setTimeout(async () => {
            await settingsApi.updateMember(account?.id, formData);
          }, 2000);
        }
        if (data?.team_ids) {
          data?.team_ids?.forEach(async (teamId) => {
            await settingsApi.updateSkillTeam({
              id: teamId,
              account_ids: [account?.id]
            });
          })
        }
        if (ips && ips?.length) {
          ips?.forEach(async (ip) => {
            await settingsApi.createIpAddress({
              ip_address: ip?.ip,
              account_id: account?.id,
            });
          });
        }

        setTimeout(() => {
          onInviteMemberCallback();
        }, 3000);
        onClose();
        reset();
        setAvatar(null);
        setAvatarPreview(null);
        setIps([]);
        setSetInvite(true);
        setValue("password", generateRandomPassword());
      } else {
        const { account } = await settingsApi.inviteMember({
          email: data?.email,
          password: data?.password,
          first_name: data?.first_name,
          last_name: data?.last_name,
        });
        if (template) {
          setTimeout(async () => {
            await settingsApi.updateMember(account?.id, { role_temp_id: data?.role_id, acc: template?.acc, account_id: account?.id });
          }, 1000);
        } else {
          setTimeout(async () => {
            await settingsApi.updateMember(account?.id, { acc: defaultTemplate, account_id: account?.id });
          }, 2000);
        }
        if (data?.desk_ids) {
          setTimeout(async () => {
            await settingsApi.updateMember(account?.id, { desk_ids: data?.desk_ids, account_id: account?.id });
          }, 3000);
        }
        if (avatar) {
          const formData = new FormData();
          formData.append("avatar", avatar);
          formData.append("account_id", account?.id);
          setTimeout(async () => {
            await settingsApi.updateMember(account?.id, formData);
          }, 4000);
        }
        if (data?.team_ids) {
          data?.team_ids?.forEach(async (teamId) => {
            await settingsApi.updateSkillTeam({
              id: teamId,
              account_ids: [account?.id]
            });
          })
        }
        if (ips && ips?.length) {
          ips?.forEach(async (ip) => {
            await settingsApi.createIpAddress({
              ip_address: ip?.ip,
              account_id: account?.id,
            });
          });
        }

        setTimeout(() => {
          onInviteMemberCallback();
        }, 3000);

        onClose();
        reset();
        setAvatar(null);
        setAvatarPreview(null);
        setIps([]);
        setSetInvite(true);
        setValue("password", generateRandomPassword());
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setIsPending(false);
  }

  const SubmitErrorHandler = (data) => {
    let ipFlag = true;
    Object.values(data).forEach((value)=> {
      if(value.type!=="matches") {
        toast.error(value.message);
      } else if(ipFlag) {
        toast.error("IP address is not valid");
        ipFlag= false;
      }
    })
  };

  const password = watch("password");

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm">
        <Stack
          sx={{
            display: "flex",
          }}
        >
          <form noValidate onSubmit={handleSubmit(onSubmit, SubmitErrorHandler)}>
            <Stack gap={2}>
              <Typography variant="h5" sx={{ textAlign: "center", pt: 5 }}>
                Invite member
              </Typography>
              <Scrollbar sx={{ maxHeight: { xs: 'calc(100vh - 250px)', md: 'calc(100vh - 350px)' } }}>
                <Stack direction='column' gap={2} px={1.5}>
                  <Stack alignItems="center" justifyContent="center" direction="row" spacing={2} py={1}>
                    <Box
                      sx={{
                        borderColor: "neutral.300",
                        borderRadius: "50%",
                        borderStyle: "dashed",
                        borderWidth: 1,
                        p: "4px",
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "50%",
                          height: "100%",
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <Box
                          onClick={handleAvatarAttach}
                          sx={{
                            alignItems: "center",
                            backgroundColor: (theme) =>
                              alpha(theme.palette.neutral[700], 0.5),
                            borderRadius: "50%",
                            color: "common.white",
                            cursor: "pointer",
                            display: "flex",
                            height: "100%",
                            justifyContent: "center",
                            left: 0,
                            opacity: 0,
                            position: "absolute",
                            top: 0,
                            width: "100%",
                            zIndex: 1,
                            "&:hover": {
                              opacity: 1,
                            },
                          }}
                        >
                          <Stack alignItems="center" direction="row" spacing={1}>
                            <Iconify icon="lucide:camera" width={24} />
                            <Typography
                              color="inherit"
                              variant="subtitle2"
                              sx={{ fontWeight: 700 }}
                            >
                              Select
                            </Typography>
                          </Stack>
                        </Box>
                        <Avatar
                          src={avatarPreview ? avatarPreview?.includes('http') ? avatarPreview : `${getAPIUrl()}/${avatarPreview}` : ""}
                          sx={{
                            height: 100,
                            width: 100,
                          }}
                        >
                          <Iconify icon="mage:file-2" width={24} />
                        </Avatar>
                      </Box>

                      <input
                        hidden
                        ref={avatarRef}
                        type="file"
                        onChange={handleChangeAvatar}
                      />
                    </Box>
                    <Typography variant="h6">Set avatar</Typography>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <TextField
                        label="Email"
                        name="email"
                        error={!!errors?.email?.message}
                        helperText={errors?.email?.message}
                        type="text"
                        {...register("email")}
                        fullWidth
                      />
                    </Grid>
                    <Grid xs={12} md={6} display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Typography variant="subtitle2" noWrap>Send Invitation Email:</Typography>
                      <Switch
                        checked={sendInvite}
                        onChange={() => setSetInvite(!sendInvite)}
                      />
                    </Grid>
                  </Grid>

                  {!sendInvite ? (
                    <Stack gap={2.5}>
                      <Grid container spacing={2}>
                        <Grid xs={12} md={6}>
                          <TextField
                            label="First Name"
                            name="first_name"
                            type="text"
                            sx={{ width: 1 }}
                            {...register("first_name")}
                            error={!!errors?.first_name?.message}
                            helperText={errors?.first_name?.message}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            label="Last Name"
                            name="last_name"
                            type="text"
                            sx={{ width: 1 }}
                            {...register("last_name")}
                            error={!!errors?.last_name?.message}
                            helperText={errors?.last_name?.message}
                          />
                        </Grid>
                      </Grid>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <TextField
                          label="Password"
                          name="password"
                          type="password"
                          {...register("password")}
                          sx={{ width: "100%" }}
                          error={!!errors?.password?.message}
                          helperText={errors?.password?.message}
                        />
                        <Tooltip title="Copy to clipboard">
                          <IconButton onClick={() => copyToClipboard(password)}>
                            <Iconify icon="ic:round-content-copy" width={28} sx={{'&:hover': { color: 'primary.main' }}}/>
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  ) : null}

                  <Stack>
                    <SelectMenu
                      name="role_id"
                      control={control}
                      label="Select a Role"
                      list={templateList}
                    />
                  </Stack>

                  <Stack direction="column" gap={1} sx={{ width: 1 }}>
                    <MultiSelectMenu
                      control={control}
                      label="Select Teams"
                      name="team_ids"
                      list={teamList}
                    />
                    {teamChip?.length > 0 && (
                      <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ px: 1, pt:0.5 }}
                      >
                        <ChipSet
                          chips={teamChip}
                          handleRemoveChip={(val) =>
                            handleRemoveChip(val, "team_ids")
                          }
                        />
                      </Stack>
                    )}
                  </Stack>
                  <Stack direction="column" gap={1} sx={{ width: 1 }}>
                    <MultiSelectMenu
                      control={control}
                      label="Select Desks"
                      name="desk_ids"
                      list={deskList}
                    />
                    {deskChip?.length > 0 && (
                      <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ px: 1, pt:0.5 }}
                      >
                        <ChipSet
                          chips={deskChip}
                          handleRemoveChip={(val) =>
                            handleRemoveChip(val, "desk_ids")
                          }
                        />
                      </Stack>
                    )}
                  </Stack>

                  <Stack spacing={1} pb={1}>
                    {!!ips?.length && <Typography variant="subtitle1" px={1}>Account IPs</Typography>}
                    <Stack direction='column' gap={2}>
                      {ips?.map((ip) => (
                        <Stack
                          key={ip?.id}
                          direction="row"
                          alignItems="center"
                          spacing={3}
                        >
                          <TextField
                            sx={{ width: 1 }}
                            {...register(ip.id, { onChange: (e)=> handleChangeIpValue(e, ip?.id), value: ip?.ip })}
                            label="IP"
                            error={!!errors?.[ip.id]?.message}
                            helperText={errors?.[ip.id]?.message}
                            type="text"
                            size="small"
                          />
                          <IconButton onClick={() => handleDeleteIp(ip?.id)}>
                            <Iconify icon="iconoir:xmark" width={30}/>
                          </IconButton>
                        </Stack>
                      ))}
                    </Stack>
                    <Stack>
                      {user?.acc?.acc_e_add_ip === undefined ||
                        user?.acc?.acc_e_add_ip ? (
                        <Button
                          variant="contained"
                          onClick={handleAddIp}
                        >
                          + Add IP
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                </Stack>
              </Scrollbar>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  pb: 4,
                  pt: 1,
                  px: 3,
                }}
              >
                <Button color="inherit" sx={{ mr: 2 }} onClick={onClose}>
                  Cancel
                </Button>
                <LoadingButton
                  loading={isPending}
                  variant="contained"
                  type="submit"
                  sx={{ whiteSpace : 'nowrap' }}
                >
                  Send invitation
                </LoadingButton>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Dialog>
  );
};
