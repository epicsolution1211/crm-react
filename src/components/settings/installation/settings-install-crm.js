import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import ReplayIcon from '@mui/icons-material/Replay';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { settingsApi } from "src/api/settings";
import { copyToClipboard } from "src/utils/copy-to-clipboard";

export const SettingInstallCRM = () => {

  const [crmDomain, setCrmDomain] = useState({
    domain: ""
  });

  const [tempText, setTempText] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const getCrmDomain = async () => {
    try {
      const res = await settingsApi.getArticleCrmDomain();
      setCrmDomain(res?.crm_domain);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const updateDomain = async () => {
    try {
      if (tempText.length) {
        const res = await settingsApi.updateCrmDomain({ domain: tempText });
        setCrmDomain(res?.crm_domain);
        toast("Domain successfully updated!");
      }
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const deleteDomain = async () => {
    try {
      const res = await settingsApi.deleteCrmDomain();
      setCrmDomain(res?.crm_domain);
      toast("Domain successfully deleted!");
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const checkVerification = async () => {
    try {
      await settingsApi.verificationCrmDomain();
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    getCrmDomain();
  }, []);

  useEffect(() => {
    setTempText(crmDomain?.domain);
  }, [crmDomain]);

  return (
    <Stack
      spacing={3}
    >
      <Stack
        spacing={4}
        sx={{ p: 2 }}
      >
        <Typography
          variant="h6"
        >White-label CRM (login page) installation</Typography>
        <Stack
          direction="row"
          gap={2}
          alignItems="center">
          <Typography>Custom subdomain:</Typography>
          <OutlinedInput
            size="small"
            onFocus={() => {
              setIsEdit(true);
              setTempText(crmDomain?.domain);
            }}
            onBlur={() => {
              setIsEdit(false);
            }}
            value={tempText ?? ""}
            onChange={(event) => setTempText(event?.target?.value)}
            placeholder="subdomain name..." />
          <Stack direction="row"
            gap={1}>
            {!!tempText?.length && <>
              <IconButton
                edge="end"
                onClick={() => updateDomain()}
              >
                <CheckIcon
                  color="success"
                  fontSize="small" />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => setTempText(crmDomain?.domain)}
              >
                <ReplayIcon
                  color="warning"
                  fontSize="small" />
              </IconButton>
            </>}
            {!!crmDomain?.domain?.length && !isEdit &&
              <IconButton
                edge="end"
                onClick={() => deleteDomain()}
              >
                <DeleteOutlineIcon
                  color="error"
                  fontSize="small" />
              </IconButton>}
          </Stack>
        </Stack>
        <Stack
          sx={{ mt: 3 }}
          spacing={3}>
          <Stack
            spacing={1}>
            <Typography
              gutterBottom
              variant="h6"
            >
              Verification
            </Typography>
          </Stack>
          <Stack
            direction="row"
            gap={2}
            alignItems="center">
            <Typography>1. add this CNAME record for your domain (for example CRM.YOURDOMAIN.com) in your DNS records to:</Typography>
            <Typography
              variant="h6">
            </Typography>
            <IconButton
              edge="end"
              onClick={() => copyToClipboard('')}
            >
              <ContentCopyIcon
                color="success"
                fontSize="small" />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            gap={2}
            alignItems="center">
            <Typography>2. add this CNAME record with WWW for your domain (for example www.CRM.YOURDOMAIN.com) in your DNS records to:</Typography>
            <Typography variant="h6"></Typography>
            <IconButton
              edge="end"
              onClick={() => copyToClipboard('')}
            >
              <ContentCopyIcon
                color="success"
                fontSize="small" />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            gap={2}
            alignItems="center">
            <Typography>Verification Status:</Typography>
            <Typography sx={{ color: "blue" }}>In progress</Typography>
            <Button
              variant="outlined"
              onClick={() => checkVerification()}
              size="small">Check Verification</Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
};
