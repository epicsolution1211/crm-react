import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Box,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { QuillEditor } from 'src/components/quill-editor';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { getAPIUrl } from "src/config";

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  expired_at: yup.date().required('Expiration date is required'),
  settings: yup.object().shape({
    link: yup.string().url('Must be a valid URL').nullable(),
    link_text: yup.string().nullable(),
    link_color: yup.string().nullable(),
    fullscreen_image: yup.boolean().nullable(),
  }).nullable(),
}).required();

export const AddAnnouncementDialog = (props) => {
  const { open, onClose, onSubmit, brandId, announcement = null } = props;
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const isEditMode = !!announcement;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      expired_at: null,
      settings: {
        link: '',
        link_text: '',
        link_color: '',
        fullscreen_image: false
      }
    }
  });

  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title || '',
        description: announcement.description || '',
        expired_at: announcement.expired_at ? new Date(announcement.expired_at) : null,
        settings: announcement.settings ? JSON.parse(announcement.settings) : {
          link: '',
          link_text: '',
          link_color: '',
          fullscreen_image: false
        }
      });

      setExistingImageUrl(announcement.image ? announcement.image?.includes('http') ? announcement.image : `${getAPIUrl()}/${announcement.image}` : "");
    } else {
      setExistingImageUrl(null);
    }
  }, [announcement, reset]);

  const handleImageChange = useCallback((file) => {
    setImage(file);
  }, []);

  const handleImageRemove = useCallback(() => {
    setImage(null);
    setExistingImageUrl(null);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.[0]) {
      handleImageChange(acceptedFiles[0]);
    }
  }, [handleImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const renderUploadContent = () => {
    if (image || existingImageUrl) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={image ? URL.createObjectURL(image) : existingImageUrl}
              alt="Preview"
              style={{
                width: 40,
                height: 40,
                objectFit: 'cover',
                borderRadius: 4
              }}
            />
            <Typography variant="body2">
              {image ? image.name : 'Current image'}
            </Typography>
          </Box>
          <Button
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleImageRemove();
            }}
          >
            Remove
          </Button>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 1,
          bgcolor: isDragActive ? 'primary.lighter' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.lighter'
          }
        }}
      >
        <CloudUploadIcon
          sx={{
            fontSize: 40,
            color: isDragActive ? 'primary.main' : 'text.secondary',
            mb: 1
          }}
        />
        <Typography
          variant="body1"
          sx={{
            color: isDragActive ? 'primary.main' : 'text.secondary',
            textAlign: 'center'
          }}
        >
          {isDragActive
            ? 'Drop the image here'
            : 'Drag and drop image here, or click to select'}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            mt: 1
          }}
        >
          Supported formats: PNG, JPG, JPEG, GIF
        </Typography>
      </Box>
    );
  };

  const onFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('expired_at', data.expired_at.toISOString());
      formData.append('internal_brand_id', brandId);
      formData.append('settings', JSON.stringify(data.settings));
      
      if (image) {
        formData.append('image', image);
      }

      if (isEditMode) {
        await onSubmit(announcement.id, formData);
      } else {
        await onSubmit(formData);
      }
      
      reset();
      setImage(null);
      setExistingImageUrl(null);
      onClose();
    } catch (err) {
      console.error('Error saving announcement:', err);
    }
  };

  const handleClose = () => {
    reset({
      title: '',
      description: '',
      expired_at: null,
      settings: {
        link: '',
        link_text: '',
        link_color: '',
        fullscreen_image: false
      }
    });
    setImage(null);
    setExistingImageUrl(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{isEditMode ? 'Edit Announcement' : 'Add New Announcement'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Title"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />

          <div>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1 }}
            >
              Description
            </Typography>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box sx={{ position: 'relative' }}>
                  <QuillEditor
                    onChange={onChange}
                    value={value}
                    sx={{ 
                      height: 200,
                      ...(errors.description && {
                        border: '1px solid #d32f2f',
                        borderRadius: 1
                      })
                    }}
                  />
                  {errors.description && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ 
                        display: 'block',
                        mt: 1,
                        pl: 1.75
                      }}
                    >
                      {errors.description.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
          </div>

          <Controller
            name="expired_at"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Expiration Date"
                value={value}
                onChange={onChange}
                slotProps={{
                  textField: {
                    error: !!errors.expired_at,
                    helperText: errors.expired_at?.message,
                    fullWidth: true
                  }
                }}
              />
            )}
          />

          <div>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1 }}
            >
              Image (optional)
            </Typography>
            <Box {...getRootProps()}>
              <input {...getInputProps()} />
              {renderUploadContent()}
            </Box>
            <Controller
              name="settings.fullscreen_image"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Fullscreen image"
                  sx={{ mt: 1 }}
                />
              )}
            />
          </div>

          <div>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1 }}
            >
              Link Settings (Optional)
            </Typography>
            <Stack spacing={2}>
              <Controller
                name="settings.link"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Link URL"
                    error={!!errors.settings?.link}
                    helperText={errors.settings?.link?.message}
                    placeholder="https://example.com"
                  />
                )}
              />

              <Controller
                name="settings.link_text"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Link Text"
                    error={!!errors.settings?.link_text}
                    helperText={errors.settings?.link_text?.message}
                    placeholder="Click here"
                  />
                )}
              />

              <Controller
                name="settings.link_color"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Link Color"
                    error={!!errors.settings?.link_color}
                    helperText={errors.settings?.link_color?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <input
                            type="color"
                            value={field.value || '#000000'}
                            onChange={(e) => field.onChange(e.target.value)}
                            style={{
                              width: '30px',
                              height: '30px',
                              padding: 0,
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Stack>
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          variant="contained"
          onClick={handleSubmit(onFormSubmit)}
          disabled={isSubmitting}
        >
          {isEditMode ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddAnnouncementDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  brandId: PropTypes.string.isRequired,
  announcement: PropTypes.object
}; 