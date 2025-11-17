import React, { useEffect } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useForm, Controller, useWatch } from 'react-hook-form'

import { QuillEditor } from 'src/components/quill-editor';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuth } from 'src/hooks/use-auth';
import toast from 'react-hot-toast';


const InjectionNote = ({ injection, updateInjection }) => {
  const { control, setValue } = useForm();
  const { user } = useAuth();

  const description = useWatch({ control, name: 'description' })
  const updatedNote = useDebounce(description, 300);

  useEffect(() => {
    setValue('description', injection?.description);
  }, []);

  useEffect(() => {
    if (updatedNote) {
      updateInjection(injection?.id, { 'description': updatedNote });
      setTimeout(() => {
        toast.success("Note updated successfully");
      }, 1000);
    }
  }, [updatedNote])

  return (
    <form>
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">Injection Note</Typography>
              </Stack>
            </Stack>
            <Controller
              name='description'
              control={control}
              render={({ field: { onChange, value } }) => (
                <QuillEditor
                  placeholder="Write something"
                  sx={{ height: 350, my: 3 }}
                  value={value}
                  onChange={onChange}
                  readOnly={!user?.acc?.acc_e_lm_list && user?.acc?.acc_e_lm_list !== undefined}
                />
              )}
            />
          </CardContent>
        </Card>
      </Stack>
    </form>
  )
}

export default InjectionNote