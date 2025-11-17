import { useState, useEffect } from 'react'
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
import { SupportEmailTable } from "./support-email.table";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { settingsApi } from "src/api/settings";

export const SettingInstallSupportEmail = () => {
  const companyId = localStorage.getItem("company_id");

  const [company, setCompany] = useState();

  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [tempText, setTempText] = useState("");

  const getCompanyInfo = async () => {
    try {
      const res = await settingsApi.getCompanyData(companyId);
      setCompany(res.company);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const getTeams = async () => {
    try {
      const res = await settingsApi.getTeamsData(companyId);
      setTeams(res.teams)
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const getMembers = async () => {
    try {
      const res = await settingsApi.getMembers();
      setMembers(res?.accounts);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const updateCompanyEmail = async () => {
    try {
      if (tempText.length) {
        await settingsApi.updateCompanyEmail({ email_domain: tempText });
        getCompanyInfo();
        toast(company?.email_domain?.length ? "Email successfully updated!" : "Email successfully created!");
      }
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const deleteEmailDomain = async () => {
    try {
      await settingsApi.updateCompanyEmail({ email_domain: "" });
      getCompanyInfo();
      toast("Email successfully deleted!");
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    setTempText(company?.email_domain)
  }, [company])

  useEffect(() => {
    getCompanyInfo();
    getTeams();
    getMembers();
  }, [])


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
        >Generated email for your company:</Typography>
        <Stack
          direction="row"
          gap={2}
          alignItems="center">
          <Typography>Send email in CRM:</Typography>
          <OutlinedInput
            size="small"
            onFocus={() => {
              setIsEdit(true);
            }}
            onBlur={() => {
              setIsEdit(false);
            }}
            value={tempText ?? ""}
            onChange={(event) => setTempText(event?.target?.value)}
            placeholder="Email" />
          <Stack direction="row"
            gap={1}>
            {!!tempText?.length && <>
              <IconButton
                edge="end"
                onClick={() => updateCompanyEmail()}
              >
                <CheckIcon
                  color="success"
                  fontSize="small" />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => setTempText(company?.email_domain)}
              >
                <ReplayIcon
                  color="warning"
                  fontSize="small" />
              </IconButton>
            </>}
            {!!company?.email_domain?.length && !isEdit &&
              <IconButton
                edge="end"
                onClick={() => deleteEmailDomain()}
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
            <Typography>1. add this TEXT record for your domain in your DNS records:</Typography>
            <Typography
              variant="h6">{company?.token}
            </Typography>
            <IconButton
              edge="end"
              onClick={() => copyToClipboard(company?.token)}
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
            <Typography sx={{ color: company?.email_domain_verified ? "green" : company?.email_domain_requested ? "blue" : "red" }}>{company?.email_domain_verified
              ? "Verified" : company?.email_domain_requested ? "In Progress" : "Not Verified"}</Typography>
            <Button
              variant="outlined"
              size="small">Check Verification</Button>
          </Stack>
          <Stack
            direction="row"
            gap={2}
            alignItems="center">
            <Typography>2. Receive email in CRM:</Typography>
            <Typography variant="h6"></Typography>
          </Stack>
          <Typography>Please change this text with the relevant text here.</Typography>
        </Stack>
        <SupportEmailTable
          company={company}
          members={members}
          teams={teams} />
      </Stack>
    </Stack>
  )
};
