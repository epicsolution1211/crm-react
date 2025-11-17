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

import { copyToClipboard } from "../../../utils/copy-to-clipboard";
import { settingsApi } from "../../../api/settings";
import { useAuth } from "src/hooks/use-auth";

export const SettingInstallArticle = () => {
  const { company } = useAuth();

  const [domain, setDomain] = useState({
    domain: ""
  });
  const [tempText, setTempText] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const [myDomain, setMyDomain] = useState("domain.octolit.com");

  const getArticleDomainInfo = async () => {
    try {
      const res = await settingsApi.getArticleDomain();
      setDomain(res.domain);
      setTempText(res.domain.domain)
    } catch (error) {
      console.error('error: ', error);
    }
  };
  const updateDomain = async () => {
    try {
      if (tempText.length) {
        const res = await settingsApi.updateDomainInfo({ domain: tempText });
        setDomain(res.domain);
        setTempText(res.domain.domain);
      }
      toast("Domain successfully updated!");
    } catch (error) {
      console.error('error: ', error);
    }
  }

  const handleDeleteDomain = async () => {
    try {
      const res = await settingsApi.deleteDomain();
      setDomain(res.domain);
    } catch (error) {
      console.error('error: ', error);
    }
    setTempText("");
  }

  const verificationDomain = async () => {
    try {
      await settingsApi.verificationDomain();
    } catch (error) {
      toast(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    getArticleDomainInfo();
  }, [])

  useEffect(() => {
    setTempText(domain?.domain);
    if (domain?.length) {
      setMyDomain(`${domain?.domain}.octolit.com`)
    } else {
      setMyDomain(`domain.octolit.com`)
    }
  }, [domain])

  if (!company) {
    return null;
  }

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
        >Help Center website installation</Typography>
        <Stack
          direction="row"
          gap={2}
        >
          <Typography>Support article links:</Typography>
          <Typography
            variant="h6"
          ></Typography>
        </Stack>
        <Stack
          sx={{
            flexDirection: { xs: "column", md: "row", lg: "row", xl: "row", sm: "row" },
            alignItems: { xs: "flex-start", md: "center", lg: "center", xl: "center", sm: "center" }
          }}
          gap={2}
          alignItems="center"
        >
          <Typography>Internal link:</Typography>
          <Typography
            variant="h6"
          >{window.location.origin}/public/{company?.id}/articles</Typography>
          <IconButton
            edge="end"
            onClick={() => copyToClipboard(`${window.location.origin}/public/${company?.id}/articles`)
            }
          >
            <ContentCopyIcon
              color="success"
              fontSize="small"
            />
          </IconButton>
        </Stack>
        <Stack
          direction="row"
          gap={2}
          alignItems="center">
          <Typography>Custom subdomain:</Typography>
          <OutlinedInput
            size="small"
            onFocus={() => {
              setIsEdit(true);
              setTempText(domain?.domain)
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
                onClick={() => setTempText(domain?.domain)}
              >
                <ReplayIcon
                  color="warning"
                  fontSize="small" />
              </IconButton>
            </>}
            {!!domain?.domain?.length && !isEdit &&
              <IconButton
                edge="end"
                onClick={() => handleDeleteDomain()}
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
              Check Verification
            </Typography>
          </Stack>
          <Stack
            direction="row"
            gap={2}
            sx={{
              flexDirection: { xs: "column", md: "row", lg: "row", xl: "row", sm: "row" },
              alignItems: { xs: "flex-start", md: "center", lg: "center", xl: "center", sm: "center" }
            }}
            >
            <Typography>1. add this CNAME record for your domain (for example help.YOURDOMAIN.com) in your DNS records to:</Typography>
            <Typography
              variant="h6">{myDomain}
            </Typography>
            <IconButton
              edge="end"
              onClick={() => copyToClipboard(myDomain)}
            >
              <ContentCopyIcon
                color="success"
                fontSize="small" />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            gap={2}
            sx={{
              flexDirection: { xs: "column", md: "row", lg: "row", xl: "row", sm: "row" },
              alignItems: { xs: "flex-start", md: "center", lg: "center", xl: "center", sm: "center" }
            }}
            >
            <Typography>2. add this CNAME record with WWW for your domain (for example www.help.YOURDOMAIN.com) in your DNS records to:</Typography>
            <Typography variant="h6">{myDomain}</Typography>
            <IconButton
              edge="end"
              onClick={() => copyToClipboard(myDomain)}
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
            <Typography sx={{ color: "red" }}>Not verified</Typography>
            <Button
              variant="outlined"
              onClick={() => verificationDomain()}
              size="small">Check Verification</Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
};
