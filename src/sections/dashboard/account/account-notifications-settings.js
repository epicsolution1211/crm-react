import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { useAuth } from 'src/hooks/use-auth';
import { userApi } from 'src/api/user';
import { CurrencySetting } from './account-user-currency';
import { AccountEmailSignaureSection } from './account-email-signature';

export const AccountNotificationsSettings = () => {
  const { user, refreshUser } = useAuth();

  const handleChangeSelfRinging = async () => {
    try {
      await userApi.updateUser(user?.id, { my_ringing_tone: !selfRinging, account_id: user?.id });
      setSelfRinging(!selfRinging);
      toast.success("Calls to me notification successfully updated!");
      setTimeout(() => {
        refreshUser();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChangeTeamRinging = async () => {
    try {
      await userApi.updateUser(user?.id, { team_ringing_tone: !teamRinging, account_id: user?.id });
      setTeamRinging(!teamRinging);
      toast.success("Calls to my team ringing tone successfully updated!");
      setTimeout(() => {
        refreshUser();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const [selfRinging, setSelfRinging] = useState(false);
  const [teamRinging, setTeamRinging] = useState(false);

  useEffect(() => {
    setSelfRinging(user?.my_ringing_tone ?? false);
    setTeamRinging(user?.team_ringing_tone ?? false);
  }, [user]);

  return (
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
              Settings
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
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle1">
                    Calls to me ringing tone
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Incoming calls to me ringing tone.
                  </Typography>
                </Stack>
                <Switch checked={selfRinging} onChange={handleChangeSelfRinging} />
              </Stack>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle1">
                    Calls to my team ringing tone
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Incoming calls to my team ringing tone.
                  </Typography>
                </Stack>
                <Switch checked={teamRinging} onChange={handleChangeTeamRinging} />
              </Stack>
              <AccountEmailSignaureSection />
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <CurrencySetting currency={user.currency} refreshUser={refreshUser} userId={user.id}/>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};
