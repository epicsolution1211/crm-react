import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';

import { DeleteModal } from 'src/components/customize/delete-modal';
import { paths } from 'src/paths';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from "src/hooks/use-router";
import { userApi } from 'src/api/user';

const validationSchema = yup.object({
  password: yup.string().required('Password was a required field'),
  confirm_password: yup.string().oneOf([yup.ref("password")], "Password is not matched").required('Confirm password is a required field'),
})

export const AccountSecuritySettings = () => {
  const router = useRouter();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });

  const [isModal, setIsModal] = useState(false);
  const [isLogoutModalOpen, setOpenLogoutModal] = useState(false);

  const onSubmit = async (data) => {
    delete data.confirm_password;
    try {
      await userApi.updatePassword(data);
      toast.success('Password successfully updated!')
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const logoutAll = async () => {
    try {
      // await authApi.logoutAllSessions();
      // signOut();
      router.push(paths.auth.jwt.login);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  const deleteAccount = async () => {
    try {
      await userApi.deleteAccount();
      toast("Account successfully deleted!");
      setTimeout(router.push('/'), 3000);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  return (
    <>
      <Stack spacing={4}>
        {user?.acc?.acc_e_password !== false && (
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                      Change password
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    sm={12}
                    md={8}
                    spacing={2}
                  >
                    <Stack
                      direction='row'
                      justifyContent='space-between'>
                      <Stack
                        spacing={2}
                        sx={{ width: 1 }}>
                        <TextField
                          label="Password"
                          type="password"
                          {...register('password')}
                          fullWidth
                          error={!!errors?.password?.message}
                          helperText={errors?.password?.message}
                          sx={{
                            width: 1,
                            flexGrow: 1,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderStyle: 'dotted'
                            }
                          }}
                        />
                        <TextField
                          label="Confirm Password"
                          type="password"
                          {...register('confirm_password')}
                          error={!!errors?.confirm_password?.message}
                          helperText={errors?.confirm_password?.message}
                          sx={{
                            width: 1,
                          }}
                        />
                      </Stack>
                    </Stack>
                    <Stack
                      mt={2}
                      px={2}
                      direction='row'
                      justifyContent='end'>
                      <Button
                        type='submit'
                        variant='contained'>Update
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </form>
          </Card>
        )}
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
                  Delete Account
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack
                  alignItems="flex-start"
                  spacing={3}
                >
                  <Typography variant="subtitle1">
                    Delete your account and all of your source data. This is irreversible.
                  </Typography>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => setIsModal(true)}
                    disabled={!user?.acc?.acc_e_self_delete}
                  >
                    Delete account
                  </Button>
                </Stack>
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
                  Log out from all sessions
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack
                  alignItems="flex-start"
                  spacing={3}
                >
                  <Typography variant="subtitle1">
                    This will log you out from all browser sessions.
                  </Typography>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => setOpenLogoutModal(true)}
                  >
                    Log Out
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
      <DeleteModal
        isOpen={isModal}
        setIsOpen={() => setIsModal(false)}
        onDelete={() => deleteAccount()}
        title={'Delete Account'}
        description={'Are you sure you want to delete your Account?'}
      />

      <DeleteModal
        isOpen={isLogoutModalOpen}
        setIsOpen={() => setOpenLogoutModal(false)}
        onDelete={() => logoutAll()}
        title={'Log out from all sessions'}
        description={'Are you sure you want to logout from all sessions?'}
      />
    </>
  );
};
