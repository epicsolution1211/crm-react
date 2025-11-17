import React, { useEffect } from 'react'
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useForm, Controller, useWatch } from 'react-hook-form'

import { QuillEditor } from 'src/components/quill-editor';
import { recordApi } from 'src/api/payment_audit/record';
import { useDebounce } from 'src/hooks/use-debounce';

const RecordNote = ({ recordId }) => {
  const { control, setValue } = useForm();

  const note = useWatch({ control, name: 'description' })
  const updatedNote = useDebounce(note, 300);

  const updateRecord = async () => {
    try {
      await recordApi.updateRecord(recordId, { 'description': updatedNote });
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    if (updatedNote) {
      updateRecord();
    }
  }, [updatedNote])

  const getRecord = async () => {
    try {
      const res = await recordApi.getRecord(recordId);
      setValue('description', res?.record?.description);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    getRecord();
  }, [recordId]);

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
                <Typography variant="h5">Record Note</Typography>
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
                />
              )}
            />
          </CardContent>
        </Card>
      </Stack>
    </form>
  )
}

export default RecordNote