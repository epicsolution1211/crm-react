import { useEffect, useRef } from 'react';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/system/colorManipulator';

import { SelectMenu } from 'src/components/customize/select-menu';
import { timezoneList } from 'src/utils/functions';
import { userApi } from 'src/api/user';
import { getAPIUrl } from 'src/config';
import { Iconify } from 'src/components/iconify';

const validationSchema = yup.object({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
})

export const AccountGeneralSettings = ({ user, getUser }) => {
  const inputRef = useRef();
  const accountId = localStorage.getItem("account_id");

  const handleChange = async (event) => {
    if (event?.target?.files) {

      const formData = new FormData();
      formData.append('avatar', event?.target?.files[0]);
      await userApi.updateUser(accountId, formData);
      getUser();
      toast.success(`Avatar successfully updated!`);
    }
    event.target.value = null;
  };

  const { register, setValue, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });
  const { control: timeControl, setValue: timeSetValue, handleSubmit: timeHandleSubmit } = useForm();

  const onBasicSubmit = async (data) => {
    try {
      await userApi.updateUser(accountId, data);
      getUser();
      toast.success(`Name successfully updated!`);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const timeSubmit = async (data) => {
    try {
      await userApi.updateTimezone(data);
      getUser();
      toast.success(`Timezone successfully updated!`);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    if (user) {
      setValue('first_name', user?.first_name);
      setValue('last_name', user?.last_name);
      setValue('email', user?.email);
      timeSetValue('timezone', user?.timezone);
    }
  }, [user]);

  return (
    <Stack
      spacing={4}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">
                Basic details
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <form onSubmit={handleSubmit(onBasicSubmit)}>
                <Stack spacing={3}>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                  >
                    <Box
                      sx={{
                        borderColor: 'neutral.300',
                        borderRadius: '50%',
                        borderStyle: 'dashed',
                        borderWidth: 1,
                        p: '4px'
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: '50%',
                          height: '100%',
                          width: '100%',
                          position: 'relative'
                        }}
                      >
                        <Button
                          onClick={() => inputRef?.current?.click()}
                          sx={{
                            alignItems: 'center',
                            backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                            borderRadius: '50%',
                            color: 'common.white',
                            cursor: 'pointer',
                            display: 'flex',
                            height: '100%',
                            justifyContent: 'center',
                            left: 0,
                            opacity: 0,
                            position: 'absolute',
                            top: 0,
                            width: '100%',
                            zIndex: 1,
                            '&:hover': {
                              opacity: 1
                            }
                          }}
                        >
                          <Stack
                            alignItems="center"
                            direction="row"
                            spacing={1}
                          >
                            <input
                              ref={inputRef}
                              id="btn-upload2"
                              type="file"
                              onChange={(event) => handleChange(event)}
                              hidden />
                            <Iconify icon="famicons:camera-outline" width={24} />
                            <Typography
                              color="inherit"
                              variant="subtitle2"
                              sx={{ fontWeight: 700 }}
                            >
                              Select
                            </Typography>
                          </Stack>
                        </Button>
                        <Avatar
                          src={user?.avatar ? `${getAPIUrl()}/${user?.avatar}` : ""}
                          sx={{
                            height: 100,
                            width: 100
                          }}
                        >
                          <Iconify icon="mingcute:user-1-line" width={50} />
                        </Avatar>
                      </Box>
                    </Box>
                  </Stack>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                  >
                    <TextField
                      label="First Name"
                      InputLabelProps={{ shrink: true }}
                      {...register('first_name')}
                      error={!!errors?.first_name?.message}
                      helperText={errors?.first_name?.message}
                      sx={{ flexGrow: 1 }}
                    />
                  </Stack>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                  >
                    <TextField
                      label="Last Name"
                      InputLabelProps={{ shrink: true }}
                      {...register('last_name')}
                      error={!!errors?.last_name?.message}
                      helperText={errors?.last_name?.message}
                      sx={{ flexGrow: 1 }}
                    />
                  </Stack>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                  >
                    <TextField
                      disabled
                      InputLabelProps={{ shrink: true }}
                      label="Email Address"
                      {...register('email')}
                      required
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed'
                        }
                      }}
                    />
                  </Stack>
                  <Stack
                    direction='row'
                    justifyContent='end'
                  >
                    <Button
                      type='submit'
                      variant='outlined'
                    >
                      Update
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">
                Time zone
              </Typography>
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={8}
            >
              <Stack
                divider={<Divider />}
                spacing={3}
              >
                <form onSubmit={timeHandleSubmit(timeSubmit)}>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography variant="subtitle1">
                        Select your time zone
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        Allowing users to select their preferred time zone in the user interface ensures accurate and personalized time representation throughout the application.
                      </Typography>
                    </Stack>
                    <Stack
                      sx={{ width: 1 }}
                      spacing={2}>
                      <SelectMenu
                        control={timeControl}
                        label="Time zone"
                        name="timezone"
                        list={timezoneList}
                      />

                      <Stack
                        direction='row'
                        justifyContent='end'>
                        <Button
                          type='submit'
                          variant='outlined'
                        >Update
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </form>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
