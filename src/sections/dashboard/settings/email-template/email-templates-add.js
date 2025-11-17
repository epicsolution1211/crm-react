import * as yup from "yup";
import toast from "react-hot-toast";
import { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import FormHelperText from "@mui/material/FormHelperText";
import { SelectMenu } from "src/components/customize/select-menu";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { QuillEditor } from "src/components/quill-editor";
import { emailTemplateApi } from "src/api/emailTemplate";

export const EditEmailTemplateModal = ({
  open,
  onClose,
  brandId,
  updateEmailTemplates,
  selectedEditInfo,
}) => {
  const editorTypes = [
    {
      label: 'Text Editor',
      value: 'text'
    },
    {
      label: 'HTML',
      value: 'html'
    }
  ];
  let editorType = 'text';

  const validationSchema = useMemo(() => {
    let templateValidation;
    if (selectedEditInfo) {
      templateValidation = yup.object({
        subject: yup.string().required("Subject is a required field"),
        content: editorType == 'text' 
        ? yup
          .string()
          .required("Description is a required field")
          .test("no-html-only", "Description is a required field", (value) => {
            return (
              value === "" ||
              !/^\s*<[^>]+>(\s*<[^>]+>\s*)*<\/[^>]+>\s*$/.test(value)
            );
          })
        : yup.string().required("HTML content is a required field")
      });
    } else {
      templateValidation = yup.object({
        name: yup.string().required("Name is a required field"),
        subject: yup.string().required("Subject is a required field"),
        content: editorType == 'text' 
        ? yup
          .string()
          .required("Description is a required field")
          .test("no-html-only", "Description is a required field", (value) => {
            return (
              value === "" ||
              !/^\s*<[^>]+>(\s*<[^>]+>\s*)*<\/[^>]+>\s*$/.test(value)
            );
          })
        : yup.string().required("HTML content is a required field")
      });
    }
    return templateValidation;
  }, [selectedEditInfo]);
  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ 
    resolver: yupResolver(validationSchema)
  });
  editorType = useWatch({ control, name: "editor_type", defaultValue: "text" });

  const onTemplateSubmit = async (data) => {
    try {
      if (!selectedEditInfo) {
        const newData = { 
          ...data, 
          internal_brand_id: brandId 
        };
        const result = await emailTemplateApi.createEmailTemplate(newData);
        updateEmailTemplates(result, false);
      } else {
        const newData = {
          subject: data.subject,
          editor_type: data.editor_type,
          content: data.content
        };
        const result = await emailTemplateApi.updateEmailTemplate(
          selectedEditInfo.id,
          newData
        );

        updateEmailTemplates(result, true);
      }

      toast.success(
        `Template successfully ${selectedEditInfo ? "updated" : "created"}!`
      );
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
    if (selectedEditInfo) {
      reset({
        name: selectedEditInfo?.id,
        subject: selectedEditInfo?.subject,
        content: selectedEditInfo?.content,
      });
    } else {
      reset({
        name: "",
        subject: "",
        content: "",
      });
    }
  }, [open, selectedEditInfo]);

  useEffect(() => {
    if (open) {
      setValue("editor_type", selectedEditInfo?.editor_type || editorTypes[0]?.value);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 },  px: { xs: 2, md: 5} }}>
        <Stack spacing={4}>
          <Typography
            fontSize={22}
            fontWeight={600}
            sx={{ textAlign: 'center' }}
          >
            {selectedEditInfo
              ? "Update Email Templates"
              : "Add Email Templates"}
          </Typography>
          <form onSubmit={handleSubmit(onTemplateSubmit)}>
            <Stack
              spacing={2}
            >
              {selectedEditInfo ? null : (
                <Stack spacing={1}>
                  <Typography variant="subtitle1" px={1}>
                    Name
                  </Typography>
                  <TextField
                    hiddenLabel
                    fullWidth
                    autoFocus
                    error={!!errors?.name?.message}
                    helperText={errors?.name?.message}
                    name="name"
                    type="text"
                    {...register("name")}
                  />
                </Stack>
              )}
              <Stack spacing={1}>
                <Typography variant="subtitle1" px={1}>
                  Subject
                </Typography>
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
              <SelectMenu
                control={control}
                label="Editor Type"
                name="editor_type"
                list={editorTypes}
              />
              {
                editorType === 'text'
                ?
                <Stack
                  sx={{
                    width: 1,
                    "& .quill": {
                      transition:
                        "border-color 0.15s ease, border-width 0.15s ease",
                      borderColor:
                        errors?.content?.message?.length > 0
                          ? "error.main"
                          : "#2d3748",
                      borderWidth: 
                        errors?.content?.message?.length > 0
                          ? 3
                          : 1,
                      "&:focus-within": {
                        borderWidth: 3,
                        borderColor:
                          errors?.content?.message?.length > 0
                            ? "error.main"
                            : "primary.main",
                      },
                    },
                    gap: 1
                  }}
                >
                  <Typography variant="subtitle1" px={1}>
                    Text Content
                  </Typography>
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
                          { height: 250, width: 1, transition: .3 },
                          !!errors?.content?.message && {
                            border: "solid 4px",
                            borderColor: "error.main"                   
                          }
                        ]}
                      />
                    )}
                  />
                  {!!errors?.content?.message && (
                    <FormHelperText
                      sx={{ px: 2, mt: -1 }}
                      error={!!errors?.content?.message}
                    >
                      {errors?.content?.message}
                    </FormHelperText>
                  )}
                </Stack>
                :
                <Stack spacing={1}>
                  <Typography variant="subtitle1" px={1}>
                    HTML Content
                  </Typography>
                  <TextField
                    fullWidth
                    name="content"
                    type="text"
                    multiline
                    hiddenLabel
                    rows={8}
                    error={!!errors?.content?.message}
                    helperText={errors?.content?.message}
                    placeholder="Write a html conent"
                    {...register("content")}
                  />
                </Stack>
              }
              <Stack
                gap={2}
                sx={{ 
                  width: { md: 1, xs: 1 },
                  px: { md: 0, xs: 12 },
                  flexDirection: 'row',
                  justifyContent: { md: 'flex-end', xs: 'center'}   
                }}
              >
                <LoadingButton
                  loading={isSubmitting}
                  variant="contained"
                  type="submit"
                  sx={{ 
                    width: 100,
                  }}
                >
                  {selectedEditInfo ? "Update" : "Add"}
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
  );
};
