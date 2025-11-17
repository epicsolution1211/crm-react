import { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { QuillEditor } from 'src/components/quill-editor';

export const DescriptionStep = ({ onBack, onNext, isPending, data }) => {

  const { handleSubmit, control, reset } = useForm();

  const description = useWatch({ control, name: 'description' });

  const onSubmit = (data) => {
    onNext(data);
  };

  const handleBack = () => {
    const formData = { description }
    onBack(formData);
  };

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing={3}>
        <Box>
          <Typography variant="h6">
            Add some description
          </Typography>
        </Box>
        <Controller
          name='description'
          control={control}
          render={({ field: { onChange, value } }) => (
            <QuillEditor
              placeholder="Write something"
              sx={{ height: 300 }}
              value={value}
              onChange={onChange} />
          )}
        />
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <LoadingButton
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            sx={{ width: 110 }}
            type='submit'
            variant="contained"
            loading={isPending}
            disabled={isPending}
          >
            Finish
          </LoadingButton>
          <Button
            color="inherit"
            onClick={() => handleBack()}
          >
            Back
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
