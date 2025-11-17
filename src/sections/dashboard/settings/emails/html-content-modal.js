import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/system/Unstable_Grid/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material/styles';

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { brandsApi } from "src/api/lead-management/brand";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { useMemo, useState } from "react";
import { useSettings } from "src/hooks/use-settings";

const validationSchema = yup.object({ html_content: yup.string().required("Email content is required")});

export const HtmlContentModal = ({ open, onClose, onGetBrand, brandId, emailTarget, brand }) => {
  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);

  const theme = useTheme();
  
  const { register, reset, formState: { errors, isSubmitting }, control, handleSubmit } = useForm({ resolver: yupResolver(validationSchema) });

  const [ params, setParams ] = useState([]);

  const currentAutoEmail = useMemo(()=> {
    const currentValue = brand?.auto_emails_list?.[emailTarget];
    const defaultValue = brand?.default_mailers?.[emailTarget];
    reset({
      subject: currentValue?.subject ?? "",
      html_content: currentValue?.html ?? "",
    });
    setParams(currentValue?.params);
    return { currentValue,  defaultValue }
  }, [brand, emailTarget]);

  const emailContent = useWatch(({ control, name: 'html_content'}));

  const hanldeReset = () => {
    reset({
      subject: currentAutoEmail?.defaultValue?.subject ?? "",
      html_content: currentAutoEmail?.defaultValue?.html ?? "",
    });
    setParams(currentAutoEmail?.defaultValue?.params);
  };

  const onSubmit = async (data) => {
    try {
      const originBrand = {
        email_temp_bonus: brand?.email_temp_bonus,
        email_temp_bonus_subject: brand?.email_temp_bonus_subject,
        email_temp_deposit: brand?.email_temp_deposit,
        email_temp_deposit_subject: brand?.email_temp_deposit_subject,
        email_temp_kyc: brand?.email_temp_kyc,
        email_temp_kyc_subject: brand?.email_temp_kyc_subject,
        email_temp_pass_rec: brand?.email_temp_pass_rec,
        email_temp_pass_rec_subject: brand?.email_temp_pass_rec_subject,
        email_temp_signup: brand?.email_temp_signup,
        email_temp_signup_subject: brand?.email_temp_signup_subject,
        email_temp_wd: brand?.email_temp_wd,
        email_temp_wd_subject: brand?.email_temp_wd_subject,
      }
      const request= {
        ...originBrand,
        [`${emailTarget}_subject`]: data?.subject,
        [`${emailTarget}`]: data?.html_content,
      };
      await brandsApi.updateInternalBrand(brandId, request);
      await onGetBrand();
      toast.success("Automated email successfully updated!");
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
      throw new Error(error);
    }
  };

  const highlightPlaceholders = (html) => {
    return html?.replace(/(>[^<]*)({{(.*?)}})([^<]*<)/g, (match) => {
      return match?.replace(/{{(.*?)}}/g, `<span style="background-color: ${theme.palette.primary.light}; color: ${theme.palette.primary.main}; padding: 2px 4px; border-radius: 3px; font-weight: bold;">{{$1}}</span>`);
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth PaperProps={{ sx: { maxWidth: 1200 } }}>
      <Container sx={{ py: 3 }}>
        <Stack spacing={3}>
          <IconButton sx={{ position: "absolute", top: 10, right: 10 }} onClick={onClose}>
            <Iconify icon="iconoir:xmark" />
          </IconButton>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container p={2} px={1} spacing={2}>
              <Grid sx={{ display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'start', gap: 1}} xs={6}>
                <Typography variant="subtitle2" px={1}>Subject</Typography>
                <Stack alignItems="center" justifyContent="center" spacing={3} width={1}>
                  <TextField
                    hiddenLabel
                    name="subject"
                    {...register("subject")}
                    error={!!errors?.subject?.message}
                    helperText={errors?.subject?.message}
                    sx={{ width: 1 }}
                  />
                </Stack>
                <Typography variant="subtitle2" px={1} pt={1}>HTML Content</Typography>
                <Stack alignItems="center" justifyContent="center" spacing={3} width={1}>
                  <TextField
                    hiddenLabel
                    name="html_content"
                    {...register("html_content")}
                    error={!!errors?.html_content?.message}
                    helperText={errors?.html_content?.message}
                    multiline
                    sx={{
                      width: 1,
                      "& textarea": {
                        scrollbarWidth: "thin", 
                        scrollbarColor: settings.paletteMode == "dark"? "#070910 transparent" :"#808080 transparent", 
                        "&::-webkit-scrollbar": {
                          width: "8px", 
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "green",
                          borderRadius: "4px",
                        },
                      },
                    }}
                    rows={12}
                  />
                </Stack>
              </Grid>
              <Grid sx={{ height: 1, display: 'flex', flexDirection:'column', alignItems: 'start', gap: 1}} xs={6}>
                <Typography px={1}>Preview</Typography>
                <Paper
                  sx={{
                    ...cssVars,
                    backgroundColor:
                      settings.paletteMode == "dark"
                        ? "var(--nav-bg)"
                        : "background.default",
                    pl: 1.5,
                    pr: 1,
                    py: 1.5,
                    height: 1,
                    width: 1,
                    boxShadow: 1,
                  }}
                >
                  <Scrollbar sx={{ pr:1.4, height: { md: "405px", xs: "auto" }}}>
                    <Stack
                      sx={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        '& p': {
                          margin: '0 0 6px 0',
                          fontSize: 13.5,
                        },
                        '& li': {
                          margin: '0 0 6px 0',
                          fontSize: 13.5,
                        }
                      }}
                      className="email-template-content"
                      dangerouslySetInnerHTML={{
                        __html: highlightPlaceholders(emailContent),
                      }}
                    />
                </Scrollbar>
              </Paper>
              </Grid>
            </Grid>
            <Grid container sx={{ width: 1, flexDirection: 'row', flexWrap: 'wrap', px: 2, pb: 1 }}>
              {params?.map((param)=> (
                <Grid xs={4} sx={{ display: "flex", flexDirection: "row", alignItems: "center", pr: 0, gap: 1 }}>
                  <Stack direction="row" gap={1}>
                    <Typography variant="subtitle2" minWidth={120}>{param?.replace(/_/g, " ")?.replace(/\b\w/g, (char) => char?.toUpperCase())}:</Typography>
                    <Typography variant="subtitle2">{`{{${param}}}`}</Typography>
                  </Stack>
                  <Tooltip title="Copy">
                    <IconButton edge="end" onClick={() => copyToClipboard(`{{${param}}}`)}>
                      <Iconify width={20} icon="mdi:content-copy" color="primary.main" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" justifyContent="flex-end" gap={2} px={2}>
              <Button variant="outlined" onClick={()=> hanldeReset()}>Reset</Button>
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">Save</LoadingButton>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Dialog>
  );
};
