import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Markdown from "react-markdown";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";

import { Iconify } from 'src/components/iconify';
import { codeStyle } from "src/utils/code-style";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "src/hooks/use-auth";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { phoneRegExp } from "src/utils/constant";
import CustomSwitch from "src/components/customize/custom-switch";

const validationSchema = Yup.object({
  country_name: Yup.string().required("Country name is required field"),
  description: Yup.string().required("Description is required field"),
  phone: Yup.string()
    .matches(phoneRegExp, {
      message: "Phone must be a valid phone number",
      excludeEmptyString: true,
    })
    .required("Phone is required field"),
  email: Yup.string().email().required("Email is required field"),
  first_name: Yup.string().required("First name is required field"),
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

const FieldItem = ({ item, control, register, watchFields }) => (
  <Stack key={item?.name} sx={{ flexDirection: { md: 'row', xs: 'column' }, alignItems: {md: 'center', xs: 'start'}}} gap={2}>
    <CustomSwitch control={control} name={item.active} />
    <TextField
      disabled={!watchFields[item.active]}
      name={item?.name}
      error={!!item?.error}
      helperText={item?.error}
      placeholder={item.placeholder}
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
              gap={1}
            >
              <Typography>
                {item.name}{" "}
                {item.required && <span style={{ color: "#F04438" }}>*</span>}
              </Typography>
              <IconButton
                size="small"
                onClick={() => copyToClipboard(watchFields[item.name])}
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
      {...register(item.name)}
    />
  </Stack>
);

const AffiliateIntegration = ({ affiliate, leadCustomFields }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { company } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [link, setLink] = useState("");
  const [leadJson, setLeadJson] = useState("");

  const watchFields = watch();

  const paramList = [
    {
      name: "country_name",
      placeholder: "FR",
      required: true,
      error: errors?.country_name?.message,
      active: "aff_l_country_name",
    },
    {
      name: "description",
      placeholder: "Sample description",
      required: true,
      error: errors?.description?.message,
      active: "aff_l_description",
    },
    {
      name: "phone",
      placeholder: "+44123456",
      required: true,
      error: errors?.phone?.message,
      active: "aff_l_phone",
    },
    {
      name: "email",
      placeholder: "example@gmail.com",
      required: true,
      error: errors?.email?.message,
      active: "aff_l_email",
    },
    {
      name: "first_name",
      placeholder: "John",
      required: true,
      error: errors?.first_name?.message,
      active: "aff_l_first_name",
    },
    {
      name: "last_name",
      placeholder: "Doe",
      active: "aff_l_last_name",
    },
    {
      name: "deposit",
      placeholder: "100",
      active: "aff_l_deposit",
    },
    {
      name: "ftd_amount",
      placeholder: "2000",
      active: "aff_l_ftd_amount",
    },
    {
      name: "registration_date",
      placeholder: "2000",
      active: "aff_l_registration_date",
    },
    {
      name: "ip_address",
      placeholder: "10.10.10.10",
      active: "aff_l_ip_address",
    },
    {
      name: "note",
      placeholder: "Sample note",
      active: "aff_l_note",
    },
    {
      name: "brand_status",
      placeholder: "Enabled",
      active: "aff_l_brand_status",
    },
    {
      name: "brand_name",
      placeholder: "Brand name",
      active: "aff_l_brand_name",
    },
    {
      name: "language",
      placeholder: "EN",
      active: "aff_l_language",
    },
  ];

  const onSubmit = async (data) => {
    const formData = {};
    const req = {};
    paramList.forEach((field) => {
      formData[field.name] = {
        value: data[field.name],
        active: data[field.active],
        enabled: field.active,
      };
    });
    if (leadCustomFields.length > 0) {
      leadCustomFields.forEach((field) => {
        formData[`lc_${field.friendly_name?.replace(/\s+/g, "_")}`] = {
          value: data[`lc_${field.friendly_name?.replace(/\s+/g, "_")}`],
          active: data[field.active],
          enabled: field.active,
        };
      });
    }
    Object.entries(formData)?.forEach(([key, value]) => {
      if (value.active) {
        req[key] = value.value ?? "";
        req[value.enabled] = true;
      }
    });

    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://${company?.api_url}/api/lead_management/api/affiliates`,
        req,
        {
          headers: {
            Authorization: affiliate?.api_key,
          },
        }
      );
      const json = JSON.stringify(response.data, null, 2);
      setLeadJson("```json\n" + json + "\n```");
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.error("error: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams();
    paramList?.forEach((item) => {
      if (watchFields[item.active] && watchFields[item.name]?.length > 0) {
        urlSearchParams.set(item.name, watchFields[item.name]);
      }
    });
    if (leadCustomFields?.length > 0) {
      leadCustomFields?.forEach((item) => {
        if (
          watchFields[item.active] &&
          (watchFields[item?.friendly_name?.replace(/\s+/g, "_")]?.length > 0 ||
            watchFields[item?.friendly_name?.replace(/\s+/g, "_")] === true)
        ) {
          urlSearchParams.set(
            item?.friendly_name?.replace(/\s+/g, "_"),
            watchFields[item?.friendly_name?.replace(/\s+/g, "_")]?.toString()
          );
        }
      });
    }
    setLink(urlSearchParams.toString());
  }, [watchFields]);

  useEffect(() => {
    paramList?.forEach((item) => setValue(item.active, true));
    if (leadCustomFields?.length) {
      leadCustomFields?.forEach((item) => setValue(item.active, true));
    }
  }, [leadCustomFields]);

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Stack
            sx={{ flexDirection: { md: "row", xs: "column" }, alignItems: { md: "center", xs: "start" }, gap: 2}}
            justifyContent="space-between"
          >
            <Typography variant="h5">Connecting to API</Typography>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="material-symbols:content-copy-outline" sx={{ '&:hover': { color: 'primary.main' }}}/>}
              onClick={() =>
                copyToClipboard(
                  "https://documenter.getpostman.com/view/2128257/2s9YR9ZsqF#50a3e36a-7238-443e-8b11-b90db59591fe"
                )
              }
            >
              Copy integration documentation to clipboard
            </Button>
          </Stack>

          <Stack spacing={4} sx={{ mt: 4 }}>
            <Stack
              sx={{ 
                flexDirection: { md: 'row', xs: 'column'}, 
                gap: 2,
                alignContent: { md: 'center', xs: 'start' } 
              }} 
            >
              <Chip
                label="POST"
                color="success"
              />
              <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                https://{company?.api_url ?? "DOMAIN_URL"}
                /api/lead_management/api/affiliates
              <IconButton
                onClick={() =>
                  copyToClipboard(
                    `https://${company?.api_url ?? "DOMAIN_URL"
                    }/api/lead_management/api/affiliates`
                  )
                }
                sx={{ '&:hover': { color: 'primary.main' }}}
              >
                <Iconify color='primary.main' icon="material-symbols:content-copy-outline" />
              </IconButton>
              </Typography>
            </Stack>

            <Stack>
              <Typography variant="subtitle1">
                Send live traffic to CRM.
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={1}>
                <Stack 
                  direction="row"
                  sx={{ 
                    flexDirection: { md: 'row', xs: 'column'},
                    alignItems: { md: 'center', xs: 'start' }, 
                    gap: 1
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Token:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                    {affiliate?.api_key}
                    <IconButton
                      color="primary"
                      onClick={() => copyToClipboard(affiliate?.api_key)}
                      sx={{ '&:hover': { color: 'primary.main' }}}
                    >
                      <Iconify icon="material-symbols:content-copy-outline" />
                    </IconButton>
                  </Typography>
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
              <Grid container spacing={3} mt={1}>
                <Grid xs={12} md={6}>
                  <Stack direction="row" sx={{ pl: { md: 25, xs: 0 } }}>
                    <Typography variant="h5" sx={{ py: 3 }}>
                      Lead Params
                    </Typography>
                  </Stack>
                  <Stack spacing={2}>
                    {paramList?.map((item) => (
                      <FieldItem
                        key={item.name}
                        item={item}
                        watchFields={watchFields}
                        control={control}
                        register={register}
                      />
                    ))}
                  </Stack>
                </Grid>
                <Grid xs={12} md={6}>
                  <Stack direction="row" sx={{ pl: { md: 19, xs: 0 } }}>
                    <Typography variant="h5" sx={{ py: 3 }}>
                      Lead Custom Field Params
                    </Typography>
                  </Stack>
                  <Stack spacing={2}></Stack>
                  <Stack spacing={2}>
                    {leadCustomFields?.map((field, index) => {
                      const setting = JSON.parse(field?.setting);
                      return (
                        <Stack key={index}>
                          {setting?.length && (
                            <Stack
                              key={field?.id}
                              sx={{ 
                                maxWidth: "450px", 
                                flexDirection: { md: 'row', xs: 'column' },
                                alignItems: { md: 'center', xs: 'start' },
                                gap: 1,
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={2}
                              >
                                <CustomSwitch
                                  control={control}
                                  name={field?.active}
                                />
                                <Typography>{field?.value}</Typography>
                              </Stack>
                              <Controller
                                name={field?.friendly_name.replace(/\s+/g, "_")}
                                control={control}
                                render={({
                                  field: { value, onChange },
                                }) => (
                                  <Select
                                    // value={field.field_value ?? ""}
                                    sx={{ width: "215px" }}
                                    value={value ?? ""}
                                    onChange={(event) =>
                                      onChange(event?.target?.value)
                                    }
                                  >
                                    <MenuItem value={""}>
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                      >
                                        <Typography>{"None"}</Typography>
                                      </Stack>
                                    </MenuItem>
                                    {setting?.map((s) => (
                                      <MenuItem key={s?.id} value={s?.option}>
                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                          spacing={1}
                                        >
                                          <Box
                                            sx={{
                                              backgroundColor: s?.color ?? 'primary.main',
                                              maxWidth: 1,
                                              height: 1,
                                              padding: 1,
                                              borderRadius: 20,
                                            }}
                                          ></Box>
                                          <Typography>{s?.option}</Typography>
                                        </Stack>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                              />
                            </Stack>
                          )}
                          {!setting?.length &&
                            field?.field_type === "boolean" && (
                              <Stack
                                key={field?.id}
                                sx={{ 
                                  maxWidth: "450px", 
                                  flexDirection: { md: 'row', xs: 'column' },
                                  alignItems: { md: 'center', xs: 'start' },
                                  gap: 1,
                                }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  gap={2}
                                >
                                  <CustomSwitch
                                    control={control}
                                    name={field?.active}
                                  />
                                  <Typography>
                                    {field?.value}
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction="row"
                                  justifyContent="center"
                                  width={240}
                                >
                                  <CustomSwitch
                                    control={control}
                                    name={field?.friendly_name.replace(
                                      /\s+/g,
                                      "_"
                                    )}
                                  />
                                </Stack>
                              </Stack>
                            )}
                          {!setting?.length &&
                            field?.field_type !== "boolean" && (
                              <Stack
                                key={field?.id}
                                sx={{ 
                                  maxWidth: "450px", 
                                  flexDirection: { md: 'row', xs: 'column' },
                                  alignItems: { md: 'center', xs: 'start' },
                                  gap: 2,
                                }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  gap={2}
                                >
                                  <CustomSwitch
                                    control={control}
                                    name={field?.active}
                                  />
                                  <Typography>
                                    {field?.value}
                                  </Typography>
                                </Stack>
                                <OutlinedInput
                                  sx={{ maxWidth: { md: "215px", xs: 1 }, minWidth: { md: 'auto', xs: 1 } }}
                                  placeholder={field?.friendly_name}
                                  {...register(
                                    field?.friendly_name.replace(/\s+/g, "_")
                                  )}
                                />
                              </Stack>
                            )}
                        </Stack>
                      );
                    })}
                  </Stack>
                </Grid>
              </Grid>
              <Stack
                spacing={3}
                border={1}
                borderRadius={1}
                sx={{ p: 3, mt: 8 }}
              >
                <Stack
                  sx={{ 
                    flexDirection: { md: 'row', xs: 'column' },
                    alignItems: { md: 'center', xs: 'start' },
                    gap: 1,
                    justifyContent: 'space-between'
                  }}
                >
                  <Stack 
                    sx={{ 
                      flexDirection: { md: 'row', xs: 'column' },
                      alignItems: { md: 'center', xs: 'start' },
                      gap: 0.5
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ wordBreak: "break-all", width: { md: 500, xs : 1 } }}
                    >
                      https://{company?.api_url ?? "DOMAIN_URL"}
                      /api/lead_management/api/affiliates
                      {link ? `?${link}` : ""}
                      <IconButton
                        onClick={() =>
                          copyToClipboard(
                            `https://${company?.api_url ?? "DOMAIN_URL"
                            }/api/lead_management/api/affiliates${link ? `?${link}` : ""
                            }`
                          )
                        }
                        color="primary"
                      >
                        <Iconify icon="material-symbols:content-copy-outline" />
                      </IconButton>
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="ph:share-fat-bold" width={20}/>}
                    type="submit"
                    disabled={!company?.api_url || isLoading}
                    sx={{ width: { md: 'auto', xs: 1 }}}
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
    </Stack>
  );
};

export default AffiliateIntegration;
