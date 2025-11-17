import * as yup from "yup";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Iconify } from "src/components/iconify";
import { ChatEmailTemplates } from "../chat/chat-email-templates";
import { QuillEditor } from "src/components/quill-editor";
import { chatApi } from "src/api/chat";
import { customersApi } from "src/api/customers";
import { useAuth } from "src/hooks/use-auth";
import { SelectMenu } from "src/components/customize/select-menu";
import { useGetCompanyEmails } from "src/hooks/swr/use-company";
import { useGetAccountEmails } from "src/hooks/swr/use-account";

const validationSchema = yup.object({
  subject: yup.string().required("Subject is a required field"),
  content: yup
    .string()
    .required("Description is a required field")
    .test("no-html-only", "Description is a required field", (value) => {
      return (
        value === "" || !/^\s*<[^>]+>(\s*<[^>]+>\s*)*<\/[^>]+>\s*$/.test(value)
      );
    }),
});

const useCustomerInfo = (customerId) => {
  const [emailConversactionId, setEmailConversationId] = useState(undefined);

  const hanldeCustomerInfo = async () => {
    try {
      const res = await customersApi.getCustomerInfo(customerId);
      setEmailConversationId(res?.client?.email_conversation_id ?? "");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (customerId) {
      hanldeCustomerInfo();
    }
  }, [customerId]);

  return { emailConversactionId };
};

export const CustomerCreateQuickEmail = ({ open, onClose, quickEmailInfo }) => {
  const { emailConversactionId } = useCustomerInfo(quickEmailInfo?.customerId);
  const [openEmailTemplates, setOpenEmailTemplates] = useState(false);
  const [isHtml, setIsHtml] = useState(false);

  const { user, company } = useAuth();

  const { emails } = useGetCompanyEmails({ company_id: company?.id });
  const { emails: accountEmails } = useGetAccountEmails({ account_id: user?.account_id });

  const emailsList = useMemo(() => [
    ...emails?.map(email => ({ ...email, type: 'Company' })),
    ...accountEmails?.map(email => ({ ...email, type: 'Account' }))
  ], [emails, accountEmails]);

  const {
    control,
    register,
    setValue,
    clearErrors,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const content = watch("content");

  const onSubmit = async (data) => {
    try {
      const request = {
        subject: data?.subject,
        description: data?.content,
        send_email: true,
        conversation_id: emailConversactionId,
        sender_email: data?.sender_email,
      };

      await chatApi.sendMessage(request);

      toast.success("Email successfully sent!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong!"
      );
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    reset({
      subject: "",
      content: "",
      sender_email: "",
    });
    setIsHtml(false);
  }, [open]);

  useEffect(() => {
    setTimeout(() => {
      setValue("sender_email", user?.email);
    }, 1000);
  }, [user, open]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <Container
          maxWidth="sm"
          sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 5 } }}
        >
          <Stack spacing={4}>
            <Typography
              fontSize={22}
              fontWeight={600}
              sx={{ textAlign: "center" }}
            >
              Send Quick Email
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Stack sx={{ pb: "0.5px" }} spacing={1}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle1" px={1}>
                      Sender
                    </Typography>
                  </Stack>
                  <SelectMenu
                    control={control}
                    list={emailsList?.map(email => ({ value: email?.email, label: email?.email, type: email?.type }))}
                    name="sender_email"
                    isSenderEmail
                  />
                </Stack>
                <Stack sx={{ pb: "0.5px" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle1" px={1}>
                      Subject
                    </Typography>
                    <Tooltip title="Select from templates">
                      <IconButton
                        sx={{
                          color: "primary.main",
                        }}
                        onClick={() => setOpenEmailTemplates(true)}
                      >
                        <Iconify
                          icon="fluent:mail-template-24-regular"
                          width={24}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <TextField
                    fullWidth
                    name="subject"
                    type="text"
                    hiddenLabel
                    error={!!errors?.subject?.message}
                    helperText={errors?.subject?.message}
                    placeholder="Write a subject"
                    {...register("subject")}
                  />
                </Stack>
                <Stack
                  sx={{
                    width: 1,
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1" px={1}>
                    Content
                  </Typography>
                  {isHtml ? (
                    <Box
                      sx={{
                        width: 1,
                        minHeight: 250,
                        border: "solid 2px",
                        borderColor: errors?.content?.message?.length > 0 ? "error.main" : "divider",
                        borderRadius: 1,
                        overflow: "hidden",
                        "&:focus-within": {
                          borderColor: errors?.content?.message?.length > 0 ? "error.main" : "primary.main",
                        },
                      }}
                    >
                      <iframe
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <meta charset="utf-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1">
                              <style>
                                body {
                                  margin: 0;
                                  padding: 16px;
                                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                  font-size: 14px;
                                  line-height: 1.5;
                                  color: #333;
                                  background: white;
                                }
                                * {
                                  box-sizing: border-box;
                                }
                                p {
                                  margin: 0 0 8px 0;
                                }
                                ul, ol {
                                  margin: 0 0 8px 0;
                                  padding-left: 20px;
                                }
                                li {
                                  margin: 0 0 4px 0;
                                }
                                h1, h2, h3, h4, h5, h6 {
                                  margin: 0 0 12px 0;
                                  font-weight: 600;
                                }
                                table {
                                  border-collapse: collapse;
                                  width: 100%;
                                  margin: 0 0 8px 0;
                                }
                                th, td {
                                  border: 1px solid #ddd;
                                  padding: 8px;
                                  text-align: left;
                                }
                                th {
                                  background-color: #f5f5f5;
                                  font-weight: 600;
                                }
                                img {
                                  max-width: 100%;
                                  height: auto;
                                }
                              </style>
                            </head>
                            <body>${content || ""}</body>
                          </html>
                        `}
                        style={{
                          width: "100%",
                          height: "100%",
                          minHeight: "250px",
                          border: "none",
                          outline: "none",
                        }}
                        title="Email content preview"
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        "& .quill": {
                          transition:
                            "border-color 0.15s ease, border-width 0.15s ease",
                          borderColor:
                            errors?.content?.message?.length > 0
                              ? "error.main"
                              : "auto",
                          borderWidth: errors?.content?.message?.length > 0 ? 2 : 2,
                          "&:focus-within": {
                            borderWidth: 2,
                            borderColor:
                              errors?.content?.message?.length > 0
                                ? "error.main"
                                : "primary.main",
                          },
                        },
                      }}
                    >
                      <Controller
                        control={control}
                        name="content"
                        render={({ field: { value, onChange } }) => (
                          <QuillEditor
                            className="mail-template"
                            value={value}
                            onChange={onChange}
                            placeholder="Write a text content"
                            sx={[
                              { height: 250, width: 1, transition: 0.3 },
                              !!errors?.content?.message && {
                                border: "solid 4px",
                                borderColor: "error.main",
                              },
                            ]}
                          />
                        )}
                      />
                    </Box>
                  )}
                  {!!errors?.content?.message && (
                    <FormHelperText
                      sx={{ px: 2, mt: -1 }}
                      error={!!errors?.content?.message}
                    >
                      {errors?.content?.message}
                    </FormHelperText>
                  )}
                </Stack>
                <Stack
                  gap={2}
                  sx={{
                    width: { md: 1, xs: 1 },
                    px: { md: 0, xs: 12 },
                    flexDirection: "row",
                    justifyContent: { md: "flex-end", xs: "center" },
                  }}
                >
                  <LoadingButton
                    loading={isSubmitting}
                    disabled={!emailConversactionId}
                    variant="contained"
                    type="submit"
                    sx={{
                      width: 100,
                    }}
                  >
                    Send
                  </LoadingButton>
                  <Button
                    variant="outlined"
                    sx={{ width: 100 }}
                    onClick={() => onClose()}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Container>
      </Dialog>
      <ChatEmailTemplates
        open={openEmailTemplates}
        onClose={() => setOpenEmailTemplates(false)}
        brandId={quickEmailInfo?.brandId}
        onApplyTemplate={(info) => {
          setValue("subject", info?.subject);
          setValue("content", info?.description);
          setIsHtml(info?.isHtml || false);
          clearErrors();
        }}
      />
    </>
  );
};
