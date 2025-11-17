import { useEffect, useState } from "react";
import QRCode from 'react-qr-code';

import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { Iconify } from 'src/components/iconify';
import { settingsApi } from "src/api/settings";
import { copyToClipboard } from "src/utils/copy-to-clipboard";

export const SettingsMemberOtp = ({ member, onGetMember }) => {
  const [otpEnabled, setOtpEnabled] = useState(false);

  useEffect(() => {
    setOtpEnabled(member?.otp_enabled);
  }, [member]);

  const handleChangeOtp = async () => {
    try {
      await settingsApi.updateMember(member?.id, {
        otp_enabled: !otpEnabled,
        account_id: member?.id,
      });
      setOtpEnabled(!otpEnabled);
      await onGetMember();
      toast.success("2FA status has successfully changed!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Stack>
      <CardHeader title="Activate 2-step verification via Authenticator app" />
      <CardContent sx={{ pt: 0 }}>
        <Stack alignItems="start" sx={{ pt: 3, pb: 5, maxWidth:250 }}>
          <Stack direction='column' gap={2}>
            <Stack direction="row" justifyContent="start" alignItems="center" spacing={1} width={1}>
              <Typography>Status:</Typography>
              <Switch checked={otpEnabled} onChange={handleChangeOtp} />
            </Stack>
            <Typography variant="body1" textAlign="start" color="text.secondary">
              - Scan QR code
            </Typography>
            <Stack 
              sx={{ 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}>
              <QRCode level="Q" fgColor="#070910" size={250} value={member?.otp_secret_key ?? ""} />
            </Stack>
          </Stack>
          <Stack sx={{ position: 'relative'}} width={1} my={3} p={1}>
            <Divider />
            <Stack 
              sx={{ 
                position: 'absolute',
                width: 1,
                display: 'flex',
                flexDirection: 'row',    
                justifyContent: 'center',
                top: -5
              }}
            >
              <Typography px={2} sx={{ backgroundColor: "background.paper"}}>or</Typography>
            </Stack>
          </Stack>
          <Typography variant="body1" textAlign="start" color="text.secondary">
            - Manual enter the code
          </Typography>
          <Stack direction="row" justifyContent="start" alignItems="center" gap={1}>
            <Typography variant="body1">
              {member?.otp_secret_key}
            </Typography>
            <IconButton
              color="primary" 
              onClick={() => copyToClipboard(member?.otp_secret_key??"")}
            >
              <Iconify icon="ph:copy" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Stack>
  );
};
