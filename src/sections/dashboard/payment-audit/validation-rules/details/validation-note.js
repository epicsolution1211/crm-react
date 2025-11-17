import React, { useEffect } from 'react'
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useForm, Controller, useWatch } from 'react-hook-form'

import { QuillEditor } from 'src/components/quill-editor';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuth } from 'src/hooks/use-auth';


const ValidationNote = ({ validationTask, updateValidationTask }) => {
  const { control, setValue } = useForm();
  const { user } = useAuth();

  useEffect(() => {
    setValue('description', validationTask?.description);
  }, []);

  const note = useWatch({ control, name: 'description' })
  const updatedNote = useDebounce(note, 300);

  useEffect(() => {
    if (updatedNote) {
      updateValidationTask(validationTask?.id, { 'description': updatedNote }, true)
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
                <Typography variant="h5">Validation Note</Typography>
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
                  readOnly={!user?.acc?.acc_e_audit_tasks && user?.acc?.acc_e_audit_tasks !== undefined}
                />
              )}
            />
          </CardContent>
        </Card>
      </Stack>
    </form>
  )
}

export default ValidationNote