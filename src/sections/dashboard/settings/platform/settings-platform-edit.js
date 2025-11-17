import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import {useCallback, useEffect, useState} from "react";
import { settingsApi } from "src/api/settings";

export const SettingsPlatformEdit = (props) => {
  const { company, ...other } = props;
  const [functionSettings, setFunctionSettings] = useState({
    agent_delete_self_message: false,
    agent_delete_message: false,
    agent_edit_client_data: false,
    limit_ticket: false,
    agent_view_client_email: false,
    agent_view_client_phone: false,
  });

  useEffect(() => {
    if (company) {
      setFunctionSettings({
        agent_delete_self_message: company.agent_delete_self_message,
        agent_delete_message: company.agent_delete_message,
        agent_edit_client_data: company.agent_edit_client_data,
        limit_ticket: company.limit_ticket,
        agent_view_client_email: company.agent_view_client_email,
        agent_view_client_phone: company.agent_view_client_phone,
      });
    }
  }, [company]);

  const handleChangeFunctionSetting = useCallback(async (settingName) => {
    setFunctionSettings({
      ...functionSettings,
      [settingName]: !functionSettings[settingName],
    });

    await settingsApi.updateCompany({ id: company.id, data: {[settingName]: !functionSettings[settingName] }});
    toast("Function setting successfully updated");
  }, [functionSettings, setFunctionSettings]);

  return (
    <form
      {...other}>
      <Stack spacing={3}>
        <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Messages Edit and Delete action</Typography>
          <Stack
            spacing={3}
            sx={{ mt: 3 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                >
                  User can delete his message
                </Typography>
              </Stack>
              <Switch
                checked={functionSettings.agent_delete_self_message}
                color="primary"
                edge="start"
                name="isVerified"
                onChange={() => handleChangeFunctionSetting("agent_delete_self_message")}
                value={functionSettings.agent_delete_self_message}
              />
            </Stack>

            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                >
                  User can delete other users messages
                </Typography>
              </Stack>
              <Switch
                checked={functionSettings.agent_delete_message}
                color="primary"
                edge="start"
                name="isVerified"
                onChange={() => handleChangeFunctionSetting("agent_delete_message")}
                value={functionSettings.agent_delete_message}
              />
            </Stack>
          </Stack>
      </Stack>

        <Divider />

        <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Client's phone and email</Typography>
          <Stack
            spacing={3}
            sx={{ mt: 3 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                >
                  Agents can view client emails in client profile
                </Typography>
              </Stack>
              <Switch
                checked={functionSettings.agent_view_client_email}
                color="primary"
                edge="start"
                name="isVerified"
                onChange={() => handleChangeFunctionSetting("agent_view_client_email")}
                value={functionSettings.agent_view_client_email}
              />
            </Stack>

            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                >
                  Agents can view client phone numbers in client profile
                </Typography>
              </Stack>
              <Switch
                checked={functionSettings.agent_view_client_phone}
                color="primary"
                edge="start"
                name="isVerified"
                onChange={() => handleChangeFunctionSetting("agent_view_client_phone")}
                value={functionSettings.agent_view_client_phone}
              />
            </Stack>

            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                >
                  Agent can edit client custom data
                </Typography>
              </Stack>
              <Switch
                checked={functionSettings.agent_edit_client_data}
                color="primary"
                edge="start"
                name="isVerified"
                onChange={() => handleChangeFunctionSetting("agent_edit_client_data")}
                value={functionSettings.agent_edit_client_data}
              />
            </Stack>
          </Stack>
      </Stack>

      </Stack>
    </form>
  );
};

SettingsPlatformEdit.propTypes = {
  company: PropTypes.object.isRequired
};
