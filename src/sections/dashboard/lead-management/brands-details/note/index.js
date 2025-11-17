import React, { useEffect } from 'react'
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useForm, Controller, useWatch } from 'react-hook-form'

import { QuillEditor } from 'src/components/quill-editor';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuth } from 'src/hooks/use-auth';


const BrandNote = ({ brand, updateBrand }) => {
  const { control, setValue } = useForm();
  const { user } = useAuth();

  const note = useWatch({ control, name: 'note' }, true);
  const updatedNote = useDebounce(note, 300);

  useEffect(() => {
    setValue('note', brand?.note);
  }, []);

  useEffect(() => {
    if (updatedNote) {
      updateBrand(brand?.id, { 'note': updatedNote }, true)
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
                <Typography variant="h5">Brand Note</Typography>
              </Stack>
            </Stack>
            <Controller
              name='note'
              control={control}
              render={({ field: { onChange, value } }) => (
                <QuillEditor
                  placeholder="Write something"
                  sx={{ height: 350, my: 3 }}
                  value={value}
                  onChange={onChange}
                  readOnly={!user?.acc?.acc_e_lm_brand && user?.acc?.acc_e_lm_brand !== undefined}
                />
              )}
            />
          </CardContent>
        </Card>
      </Stack>
    </form>
  )
}

export default BrandNote