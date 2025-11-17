import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as Yup from "yup";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import { phoneRegExp } from "src/utils/constant";
import { Iconify } from 'src/components/iconify';
import { codeStyle } from "src/utils/code-style";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "src/hooks/use-auth";
import { toast } from "react-hot-toast";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import axios from "axios";
import { BrandWebhook } from "./brand-webhook";

const validationSchema = Yup.object({
  status: Yup.string().required("Status is required field"),
  phone: Yup.string()
    .matches(phoneRegExp, {
      message: "Phone must be a valid phone number",
      excludeEmptyString: true,
    })
    .required("Phone is required field"),
});

const Code = (props) => {
  const { inline, className, children, ...other } = props;

  const language = /language-(\w+)/.exec(className || "");

  return !inline && language ? (
    <SyntaxHighlighter
      children={String(children).replace(/\n$/, "")}
      language={language[1]}
      PreTag="div"
      style={codeStyle}
      {...other}
    />
  ) : (
    <code className={className} {...other}>
      {children}
    </code>
  );
};

const BrandIntegration = ({ brand, leadCustomFields }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { company } = useAuth();

  const [link, setLink] = useState("");
  const [leadJson, setLeadJson] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://${company?.api_url}/api/lead_management/api/brand`,
        data,
        {
          headers: {
            Authorization: brand?.token,
          },
        }
      );
      const json = JSON.stringify(response.data, null, 2);
      setIsLoading(false);
      setLeadJson("```json\n" + json + "\n```");
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const phone = useWatch({ control, name: "phone" });
  const status = useWatch({ control, name: "status" });

  useEffect(() => {
    const urlSearchParams = new URLSearchParams();

    if (phone) {
      urlSearchParams.set("phone", phone);
    }

    if (status) {
      urlSearchParams.set("status", status);
    }

    setLink(urlSearchParams.toString());
  }, [status, phone]);

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Connecting to API</Typography>
            {/* <Button
              variant="outlined"
              startIcon={<Iconify icon="mage:share" />}
            >
              Share
            </Button> */}
          </Stack>

          <Stack spacing={4} sx={{ mt: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label="POST"
                sx={{ background: "#15B529", color: "#ffffff" }}
              />
              <Typography variant="subtitle1">
                https://{company?.api_url ?? "DOMAIN_URL"}
                /api/lead_management/api/brand
              </Typography>
              <IconButton
                onClick={() =>
                  copyToClipboard(
                    `https://${company?.api_url ?? "DOMAIN_URL"
                    }/api/lead_management/api/brand`
                  )
                }
                sx={{ '&:hover': { color: 'primary.main' }}}
              >
                <Iconify icon="material-symbols:content-copy-outline" />
              </IconButton>
            </Stack>

            <Stack>
              <Typography variant="subtitle1">
                Send live traffic to CRM.
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Token:
                </Typography>
                <Typography variant="subtitle1">{brand?.token}</Typography>
                <IconButton 
                  onClick={() => copyToClipboard(brand?.token)}
                  sx={{ '&:hover': { color: 'primary.main' }}}
                >
                  <Iconify icon="material-symbols:content-copy-outline" />
                </IconButton>
              </Stack>

              <Typography
                variant="subtitle2"
                sx={{ opacity: ".6", maxWidth: "550px" }}
              >
                To use your authorization token, initiate a POST request and
                include it in the request header under the "authorization"
                field. This token authenticates your request, ensuring secure
                access. It's essential to safeguard this token to prevent
                unauthorized access.
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="row" spacing={1}>
                <Stack spacing={2}>
                  <TextField
                    placeholder="+44123456"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            paddingX: 1,
                            backgroundColor: "action.hover",
                            height: 1,
                            maxHeight: 50,
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            width={150}
                          >
                            <Typography>
                              phone <span style={{ color: "#F04438" }}>*</span>
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(phone)}
                              sx={{ '&:hover': { color: 'primary.main' }}}
                            >
                              <Iconify icon="material-symbols:content-copy-outline" />
                            </IconButton>
                          </Stack>
                        </InputAdornment>
                      ),
                      sx: {
                        paddingLeft: 0,
                        height: 50,
                        width: 1,
                        overflow: "hidden",
                      },
                    }}
                    variant="outlined"
                    error={!!errors?.phone?.message}
                    helperText={errors?.phone?.message}
                    {...register("phone")}
                  />

                  <TextField
                    placeholder="sample status"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            paddingX: 1,
                            backgroundColor: "action.hover",
                            height: 1,
                            maxHeight: 50,
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            width={150}
                          >
                            <Typography>
                              status <span style={{ color: "#F04438" }}>*</span>
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(status)}
                              sx={{ '&:hover': { color: 'primary.main' }}}
                            >
                              <Iconify icon="material-symbols:content-copy-outline" />
                            </IconButton>
                          </Stack>
                        </InputAdornment>
                      ),
                      sx: {
                        paddingLeft: 0,
                        height: 50,
                        width: 1,
                        overflow: "hidden",
                      },
                    }}
                    variant="outlined"
                    error={!!errors?.status?.message}
                    helperText={errors?.status?.message}
                    {...register("status")}
                  />
                </Stack>
              </Stack>

              <Stack
                spacing={3}
                border={1}
                borderRadius={1}
                sx={{ p: 3, mt: 6 }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{ wordWrap: "break-word", width: 450 }}
                    >
                      https://{company?.api_url ?? "DOMAIN_URL"}
                      /api/lead_management/api/brand{link ? `?${link}` : ""}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        copyToClipboard(
                          `https://${company?.api_url ?? "DOMAIN_URL"
                          }/api/lead_management/api/brand${link ? `?${link}` : ""
                          }`
                        )
                      }
                      sx={{ '&:hover': { color: 'primary.main' }}}
                    >
                      <Iconify icon="material-symbols:content-copy-outline" />
                    </IconButton>
                  </Stack>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="ph:share-fat-bold" width={20}/>}
                    type="submit"
                    disabled={!company?.api_url || isLoading}
                  >
                    Run Query
                  </Button>
                </Stack>

                {leadJson && (
                  <>
                    <Stack>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Result:
                      </Typography>
                    </Stack>

                    <Stack>
                      <Markdown
                        children={leadJson}
                        components={{ code: Code }}
                      ></Markdown>
                    </Stack>
                  </>
                )}
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>

      <BrandWebhook brand={brand} leadCustomFields={leadCustomFields} />
    </Stack>
  );
};

export default BrandIntegration;