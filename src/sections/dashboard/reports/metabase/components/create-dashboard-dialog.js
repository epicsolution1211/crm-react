import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';

import { useGetMetabaseTemplates } from 'src/hooks/swr/use-metabase';
import { Iconify } from 'src/components/iconify';

const createValidationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  template_id: yup.string().optional(),
});

const TemplateCardSkeleton = () => (
  <Card sx={{ 
    border: '1px dashed',
    borderRadius: 1.5,
    borderColor: 'divider',
  }}>
    <CardContent sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 1, 
      height: 1,
      p: 2
    }}>
      <Skeleton variant="text" width="70%" height={24} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
    </CardContent>
  </Card>
);

const EmptyTemplatesPlaceholder = () => (
  <Stack
    spacing={2}
    alignItems="center"
    justifyContent="center"
    sx={{ 
      py: 5,
      px: 3,
      minHeight: { xs: 'auto', sm: 300 },
      borderRadius: 1.5,
      border: '1px dashed',
      borderColor: 'divider',
      width: 1,
      bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.100' : 'background.neutral'
    }}
  >
    <Iconify 
      icon="solar:documents-broken" 
      width={48} 
      height={48}
      sx={{ color: 'text.secondary' }}
    />
    <Stack spacing={0.5} sx={{ textAlign: 'center' }}>
      <Typography variant="h6">No Templates Found</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Start by creating a dashboard without a template.
      </Typography>
    </Stack>
  </Stack>
);

export const CreateDashboardDialog = ({ open, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateType, setTemplateType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(createValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      template_id: '',
    },
  });

  const { templates, isLoading: isLoadingTemplates } = useGetMetabaseTemplates({ filter_type: templateType });

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedTemplate(null);
      setTemplateType('all');
      setSearchQuery('');
      reset({
        title: '',
        description: '',
        template_id: '',
      });
    }
  }, [open, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const submitData = { ...data };
      if (selectedTemplate?.id) {
        submitData.template_id = selectedTemplate.id;
      }
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Prefill form values from selected template
    if (template?.title) {
      setValue('title', template.title);
    }
    if (template?.description) {
      setValue('description', template.description);
    }
    setStep(2);
  };

  const handleSkipTemplate = () => {
    setSelectedTemplate(null);
    // Clear form values when skipping template
    setValue('title', '');
    setValue('description', '');
    setStep(2);
  };

  const filteredTemplates = templates?.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      {step === 1 ? (
        <>
          <DialogTitle>
            <Stack direction="column" spacing={2}>
              <Typography variant="h5">Choose Template</Typography>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="uil:search" width={24} color="text.secondary"/>
                    </InputAdornment>
                  ),
                  endAdornment:
                    searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery('')}
                          edge="end"
                          color='primary'
                        >
                          <Iconify icon="iconamoon:close-duotone" width={24} />
                        </IconButton>
                      </InputAdornment>
                    )
                }}
              />
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ position: 'relative' }}>
            <Stack spacing={2}>
              <Tabs
                value={templateType}
                onChange={(e, newValue) => setTemplateType(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, left: 0, right: 0, backgroundColor: 'background.paper', zIndex: 1300 }}
              >
                <Tab label="All" value="all" />
                <Tab label="System" value="system" />
                <Tab label="Public" value="public" />
                <Tab label="Private" value="private" />
                <Tab label="My Templates" value="my_templates" />
              </Tabs>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 2,
                pt: 2 
              }}>
                {isLoadingTemplates ? (
                  <>
                    {[...Array(6)].map((_, index) => (
                      <TemplateCardSkeleton key={index} />
                    ))}
                  </>
                ) : !filteredTemplates?.length ? (
                  <Box sx={{ gridColumn: '1/-1' }}>
                    <EmptyTemplatesPlaceholder searchQuery={searchQuery} />
                  </Box>
                ) : (
                  filteredTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      sx={{ 
                        border: '1px dashed',
                        borderRadius: 1.5,
                        borderColor: 'divider',
                      }} >
                      <CardActionArea 
                        onClick={() => handleTemplateSelect(template)} 
                        sx={{ height: 1 }}>
                        <CardContent 
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 1, 
                            alignItems: 'stretch', 
                            justifyContent: 'flex-start', 
                            height: 1,
                          }}>
                          <Typography variant="h6">{template?.title ?? ""}</Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {template?.description ?? ""}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ))
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
            <Link
              component="button"
              variant="body2"
              onClick={handleSkipTemplate}
              sx={{ textDecoration: 'none' }}
            >
              Skip template
            </Link>
            <Button onClick={onClose}>Cancel</Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>
            <Typography variant="h5">
              Create Dashboard
            </Typography>
          </DialogTitle>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <DialogContent>
              <Stack spacing={3}>
                {selectedTemplate && (
                  <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 0 }}>
                    <Iconify icon="lucide:info" width={24} height={24} sx={{ color: 'text.primary' }} />
                    <Box>
                      <Typography variant="body1">
                        {selectedTemplate.title}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {selectedTemplate.description}
                      </Typography>
                    </Box>
                  </Stack> 
                )}
                <TextField
                  fullWidth
                  label="Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  {...register('title')}
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  {...register('description')}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setStep(1)}>Back</Button>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Create
              </LoadingButton>
            </DialogActions>
          </form>
        </>
      )}
    </Dialog>
  );
}; 