import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";

import { settingsApi } from "src/api/settings";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

export const SettingsPlatformOtp = ({ company }) => {
  const [otpEnabled, setOtpEnabled] = useState(false);

  useEffect(() => {
    setOtpEnabled(company?.otp_enabled);
  }, [company]);

  const handleChangeOtp = async () => {
    try {
      await settingsApi.updateCompany({
        id: company?.id,
        data: {
          otp_enabled: !otpEnabled,
        },
      });
      setOtpEnabled(!otpEnabled);

      toast.success("2FA status has successfully changed!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card>
      <CardHeader title="2FA" />
      <CardContent sx={{ pt: 0 }}>
        <Stack direction="row" gap={2} alignItems="end" pt={3} pb={2}>
          <Stack sx={{ pl: "3px" }} width={200}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Two-factor authentication:</Typography>
              <Switch checked={otpEnabled} onChange={handleChangeOtp} />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
