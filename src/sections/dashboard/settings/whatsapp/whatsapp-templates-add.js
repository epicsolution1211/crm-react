import { useEffect, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { Iconify } from "src/components/iconify";
import { brandsApi } from "src/api/lead-management/brand";

const validationSchema = yup.object({
  name: yup.string().required("Template name is required"),
  category: yup.string().required("Category is required"),
  language: yup.string().required("Language is required"),
  components: yup.array().min(1, "At least one component is required"),
});

const CATEGORIES = [
  { value: "UTILITY", label: "Utility" },
  { value: "MARKETING", label: "Marketing" },
  { value: "AUTHENTICATION", label: "Authentication" },
];

const LANGUAGES = [
  { value: "en_US", label: "English (US)" },
  { value: "en_GB", label: "English (UK)" },
  { value: "es_ES", label: "Spanish (Spain)" },
  { value: "es_MX", label: "Spanish (Mexico)" },
  { value: "fr_FR", label: "French (France)" },
  { value: "de_DE", label: "German (Germany)" },
  { value: "pt_BR", label: "Portuguese (Brazil)" },
  { value: "it_IT", label: "Italian (Italy)" },
];

const COMPONENT_TYPES = [
  { value: "BODY", label: "Body" },
  { value: "FOOTER", label: "Footer" },
  { value: "HEADER", label: "Header" },
];

export const EditWhatsAppTemplateModal = ({
  open,
  onClose,
  brandId,
  selectedEditInfo,
  onGetWhatsappTemplateList,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!selectedEditInfo;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      category: "UTILITY",
      language: "en_US",
      components: [{ type: "BODY", text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const templateData = {
        ...data,
        components: data.components
      };

      // Remove name from template data when editing (name shouldn't be updated)
      if (isEdit) {
        delete templateData.name;
      }

      if (isEdit) {
        await brandsApi.updateWhatsAppTemplate(
          brandId,
          selectedEditInfo.id,
          templateData
        );
        toast.success("WhatsApp template updated successfully!");
      } else {
        await brandsApi.createWhatsAppTemplate(brandId, templateData);
        toast.success("WhatsApp template created successfully!");
      }

      setTimeout(() => {
      onGetWhatsappTemplateList();
      }, 1500);
      onClose();
      reset();
    } catch (error) {
      console.error("Error saving WhatsApp template:", error);
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Failed to save WhatsApp template"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addComponent = () => {
    append({ type: "FOOTER", text: "" });
  };

  const removeComponent = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  useEffect(() => {
    if (open) {
      if (selectedEditInfo && isEdit) {
        // Reset with edit data
        reset({
          name: selectedEditInfo.name,
          category: selectedEditInfo.category,
          language: selectedEditInfo.language,
          components: selectedEditInfo.components || [{ type: "BODY", text: "" }],
        });
      } else {
        // Reset with default values for add mode
        reset({
          name: "",
          category: "UTILITY",
          language: "en_US",
          components: [{ type: "BODY", text: "" }],
        });
      }
    }
  }, [open, selectedEditInfo, isEdit, reset]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        category: "UTILITY",
        language: "en_US",
        active: true,
        components: [{ type: "BODY", text: "" }],
      });
    }
  }, [open, reset]);

  // Additional cleanup on component unmount
  useEffect(() => {
    return () => {
      reset({
        name: "",
        category: "UTILITY",
        language: "en_US",
        active: true,
        components: [{ type: "BODY", text: "" }],
      });
    };
  }, [reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit WhatsApp Template" : "Add WhatsApp Template"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("name")}
                  fullWidth
                  label="Template Name"
                  error={!!errors?.name}
                  helperText={errors?.name?.message}
                  placeholder="e.g., order_confirmation"
                  disabled={isEdit}
                  InputProps={{
                    readOnly: isEdit,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="category"
                  control={control}
                  defaultValue="UTILITY"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Category"
                      error={!!error}
                      helperText={error?.message}
                    >
                      {CATEGORIES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="language"
                  control={control}
                  defaultValue="en_US"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Language"
                      error={!!error}
                      helperText={error?.message}
                    >
                      {LANGUAGES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Components</Typography>
                <Button
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={addComponent}
                  variant="outlined"
                  size="small"
                >
                  Add Component
                </Button>
              </Stack>

              <Stack spacing={2}>
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle2">
                        Component {index + 1}
                      </Typography>
                      {fields.length > 1 && (
                        <IconButton
                          onClick={() => removeComponent(index)}
                          color="error"
                          size="small"
                        >
                          <Iconify icon="mingcute:delete-2-line" />
                        </IconButton>
                      )}
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name={`components.${index}.type`}
                          control={control}
                          defaultValue={field.type || "BODY"}
                          render={({ field: controllerField }) => (
                            <TextField
                              {...controllerField}
                              fullWidth
                              select
                              label="Type"
                              size="small"
                            >
                              {COMPONENT_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          {...register(`components.${index}.text`)}
                          fullWidth
                          label="Text"
                          multiline
                          rows={3}
                          size="small"
                          placeholder="Enter your message text"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
          >
            {isEdit ? "Update" : "Create"} Template
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
