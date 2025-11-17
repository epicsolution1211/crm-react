import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import OutlinedInput from "@mui/material/OutlinedInput";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";

import { useAuth } from "src/hooks/use-auth";
import { settingsApi } from "src/api/settings";
import { detectCalendlyLink } from "src/utils/detect-calendly-link";
import { phoneRegExp } from "src/utils/constant";
import PhoneInput from "src/components/customize/phone-input";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

const validationSchema = yup.object({
  ai_phone_number: yup
    .string()
    .matches(phoneRegExp, "Must be a valid phone number"),
});

export const SettingsMiniChatAI = () => {
  const { company: companyAuthObj } = useAuth();
  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [enabled, setEnabled] = useState(false);
  const [appointmentEnabled, setAppointmentEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState("");
  const [aiAvatar, setAiAvatar] = useState("");
  const [aiName, setAiName] = useState("");
  const [aiPersonality, setAiPersonality] = useState("");
  const [clientText, setClientText] = useState("");
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const handleCompanyGet = async () => {
      const company = await settingsApi.getCompany(companyAuthObj?.id);
      setCompany(company);
    }

    if (companyAuthObj?.id) handleCompanyGet();
  }, [companyAuthObj]);

  useEffect(() => {
    if (company) {
      setAiAvatar(company?.ai_avatar ?? "");
      setAiName(company?.ai_name ?? "");
      setAiPersonality(company?.ai_personality ?? "");
      setEnabled(company?.ai_chat ?? false);
      setAppointmentEnabled(company?.ai_appointment_enabled ?? false);
      setCalendlyLink(company?.ai_calendly ?? "");
      setSmsEnabled(company?.ai_appointment_sms ?? false);
      setClientText(
        company?.ai_client_text ??
        "Please wait, i will check if there is available person now to join the chat."
      );
      setValue("ai_phone_number", company?.ai_phone_number);
    }
  }, [company]);

  const aiAvatarRef = useRef(null);

  const handleAiAvatarAttach = useCallback(() => {
    aiAvatarRef?.current?.click();
  }, []);

  const handleChangeAiAvatar = useCallback(
    async (event) => {
      const file = event?.target?.files[0];
      const formData = new FormData();
      formData.append("ai_avatar", file);
      const companyObj = await settingsApi.updateCompanyAiAvatar(
        company?.id,
        formData
      );
      setAiAvatar(companyObj?.ai_avatar);
      toast.success("AI avatar successfully updated!");
    },
    [company]
  );

  const handleAiNameUpdate = useCallback(async () => {
    try {
      const params = {
        id: company?.id,
        data: {
          ai_name: aiName,
          ai_personality: aiPersonality,
        },
      };
      await settingsApi.updateCompany(params);
      toast.success("AI name and personality successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [company, aiName, aiPersonality]);

  const handleCalendlyLinkUpdate = useCallback(async () => {
    try {
      const isCalendlyLink = detectCalendlyLink(calendlyLink);

      if (!isCalendlyLink) {
        toast.error("Incorrect Calendly link!");
        return;
      }

      const params = {
        id: company?.id,
        data: {
          ai_calendly: calendlyLink,
        },
      };
      await settingsApi.updateCompany(params);
      toast.success("AI Calendly link successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [company, calendlyLink]);

  const handleEnabledChange = useCallback(async () => {
    try {
      const params = {
        id: company?.id,
        data: {
          ai_chat: !enabled,
        },
      };
      setEnabled(!enabled);
      await settingsApi.updateCompany(params);
      toast.success("AI enabled status successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [enabled, company]);

  const handleAppointmentEnabledChange = useCallback(async () => {
    try {
      const params = {
        id: company?.id,
        data: {
          ai_appointment_enabled: !appointmentEnabled,
        },
      };
      setAppointmentEnabled(!appointmentEnabled);
      await settingsApi.updateCompany(params);
      toast.success("AI Appointment status successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [company, appointmentEnabled]);

  const handleAppointmentSmsEnabledChange = useCallback(async () => {
    try {
      const params = {
        id: company?.id,
        data: {
          ai_appointment_sms: !smsEnabled,
        },
      };
      setSmsEnabled(!smsEnabled);
      await settingsApi.updateCompany(params);
      toast.success("AI Appointment SMS status successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [company, smsEnabled]);

  const handleAiPhoneNumberUpdate = useCallback(
    async (data) => {
      try {
        const params = {
          id: company?.id,
          data: {
            ai_phone_number: data?.ai_phone_number,
          },
        };
        await settingsApi.updateCompany(params);
        toast.success("AI Phone Number successfully updated!");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },
    [company]
  );

  const handleClientTextUpdate = useCallback(async () => {
    try {
      if (!clientText) {
        toast.error("Client text should not be empty!");
        return;
      }

      const params = {
        id: company?.id,
        data: {
          ai_client_text: clientText,
        },
      };
      await settingsApi.updateCompany(params);
      toast.success("Client text successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [company, clientText]);

  return (
    <Stack spacing={3}>
      <Stack
        spacing={4}
        sx={{ p: 2 }}>
        <Typography variant="h6">
          Enable AI in your chats to answer clients base on your articles
        </Typography>
        <Stack
          spacing={3}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Stack spacing={1}>
            <Typography
              gutterBottom
              variant="subtitle1">
              AI Status
            </Typography>
          </Stack>
          <Switch
            checked={enabled}
            color="primary"
            edge="start"
            name="welcome_message"
            onChange={handleEnabledChange}
            value={enabled}
          />
        </Stack>

        <Divider />

        <Typography variant="h6">Update AI Avatar and Name</Typography>

        <Stack
          alignItems="center"
          direction="row"
          spacing={2}>
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
                onClick={handleAiAvatarAttach}
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
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}>
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
                src={aiAvatar ? aiAvatar?.includes('http') ? aiAvatar : `${getAPIUrl()}/${aiAvatar}` : ""}
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
              ref={aiAvatarRef}
              type="file"
              onChange={handleChangeAiAvatar}
            />
          </Box>
          <Typography variant="h6">Change AI avatar</Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems='end'
          justifyContent='space-between'
          spacing={2}>
          <Stack
            gap={2}
            direction='column'
            width={1}>
            <TextField
              name="ai_name"
              value={aiName}
              onChange={(event) => setAiName(event?.target?.value)}
              label="AI Name"
            />
            <TextField
              multiline
              name="ai_personality "
              value={aiPersonality}
              onChange={(event) => setAiPersonality(event?.target?.value)}
              label="Personality"
            />
          </Stack>
          <Stack>
            <Button
              variant="contained"
              onClick={handleAiNameUpdate}>
              Update
            </Button>
          </Stack>
        </Stack>

        <Divider />

        <Typography variant="h6">Update AI Appointment</Typography>

        <Stack
          spacing={3}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Stack spacing={1}>
            <Typography gutterBottom
              variant="subtitle1">
              AI Appointment Status
            </Typography>
          </Stack>
          <Switch
            checked={appointmentEnabled}
            color="primary"
            edge="start"
            name="welcome_message"
            onChange={handleAppointmentEnabledChange}
            value={appointmentEnabled}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle1">Calendly Link</Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}>
            <TextField
              fullWidth
              name="calendly"
              value={calendlyLink}
              onChange={(event) => setCalendlyLink(event?.target?.value)}
              label="AI Calendly link"
            />
            <Button
              variant="contained"
              onClick={handleCalendlyLinkUpdate}>
              Update
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Typography
            variant="h6">SMS user before appointment</Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary">
            Send SMS to user before sending appointment link
          </Typography>
        </Stack>

        <Stack
          spacing={3}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Stack spacing={1}>
            <Typography
              gutterBottom
              variant="subtitle1">
              AI Appointment SMS Status
            </Typography>
          </Stack>
          <Switch
            checked={smsEnabled}
            color="primary"
            edge="start"
            name="welcome_message"
            onChange={handleAppointmentSmsEnabledChange}
            value={smsEnabled}
          />
        </Stack>

        <form onSubmit={handleSubmit(handleAiPhoneNumberUpdate)}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Phone Number</Typography>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center">
              <PhoneInput
                control={control}
                name="ai_phone_number"
                label="Phone number"
                defaultValue={company?.ai_phone_number ?? ""}
              />
              <Button
                variant="contained"
                type="submit">
                Update
              </Button>
            </Stack>
          </Stack>
        </form>

        <Stack
          spacing={1}>
          <Typography
            variant="subtitle1">Client text</Typography>
          <Stack
            spacing={3}
            direction="row"
            alignItems="center">
            <OutlinedInput
              fullWidth
              multiline
              placeholder="Client text"
              value={clientText}
              onChange={(event) => setClientText(event?.target?.value)}
            />
            <Button
              variant="contained"
              onClick={handleClientTextUpdate}>
              Update
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
