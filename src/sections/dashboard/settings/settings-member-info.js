import { useRef, useState, useCallback, useEffect } from "react"
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system/colorManipulator";

import { settingsApi } from "src/api/settings";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

const validationSchema = yup.object({
  first_name: yup.string().required('First name is required filed!'),
  last_name: yup.string().required('Last name is required filed!'),
  email: yup.string().email().required("Email is required!"),
})

export const SettingsMemberInfo = ({ member, setPreviewAvatar, onGetMember }) => {
  const avatarRef = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [isPending, setIsPending] = useState(false);

  const { handleSubmit, register, setValue, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    setIsPending(true);
    try {
      const formData = new FormData();
      if (avatar) {
        formData.append("avatar", avatar);
      }
      formData.append("account_id", member?.id);
      formData.append("first_name", data?.first_name);
      formData.append("last_name", data?.last_name);
      if (data?.email && (member?.email !== data?.email)) formData.append("email", data?.email);
      await settingsApi.updateMember(member?.id, formData);
      await onGetMember();
      toast.success("Member info successfully updated!");
      setPreviewAvatar(avatarPreview);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setIsPending(false);
  };

  useEffect(() => {
    if (member) {
      setValue('first_name', member?.first_name);
      setValue('last_name', member?.last_name);
      setValue('email', member?.email);
      setAvatarPreview(member?.avatar);
    }
  }, [member])

  const handleAvatarAttach = useCallback(() => {
    avatarRef?.current?.click();
  }, []);

  const handleChangeAvatar = useCallback(async (event) => {
    const file = event?.target?.files[0];
    const imageUrl = URL.createObjectURL(file);
    setAvatar(file);
    setAvatarPreview(imageUrl);
  }, []);


  return (
    <Card
      sx={{
        '&.MuiCard-root': {
          boxShadow: 'none',
        }
      }}>
      <CardHeader title="Member Info" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Stack alignItems="center" direction="row" spacing={2}>
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
                    <Iconify icon="famicons:camera-outline" width={24} />
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
          <Stack sx={{ display: 'flex', gap: 2, flexDirection: 'row', width: 1, pt: 4 }}>
            <TextField
              InputLabelProps={{
                shrink: true
              }}
              error={!!errors?.first_name?.message}
              sx={{ width: 1 }}
              helperText={errors?.first_name?.message}
              label="First Name"
              {...register('first_name')} />
            <TextField
              InputLabelProps={{
                shrink: true
              }}
              helperText={errors?.last_name?.message}
              error={!!errors?.last_name?.message}
              sx={{ width: 1 }}
              label="Last Name"
              {...register('last_name')}
            />
          </Stack>
          <Stack sx={{ display: 'flex', gap: 2, flexDirection: 'row', width: 1, pt: 4 }}>
            <TextField
              InputLabelProps={{
                shrink: true
              }}
              error={!!errors?.email?.message}
              sx={{ width: 1 }}
              helperText={errors?.email?.message}
              label="Email"
              {...register('email')} />
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end", p: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{ width: 100 }}
            loading={isPending}
            disabled={isPending}
          >
            Update
          </LoadingButton>
        </CardActions>
      </form>
    </Card>
  );
};
