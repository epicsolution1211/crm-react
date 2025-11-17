import React, { useEffect } from 'react'
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useForm, Controller, useWatch } from 'react-hook-form'

import { QuillEditor } from 'src/components/quill-editor';
import { useDebounce } from '../../../../hooks/use-debounce';
import { useAuth } from 'src/hooks/use-auth';
import toast from 'react-hot-toast';


const AffiliateNote = ({ affiliate, updateAffiliate }) => {
  const { control, setValue } = useForm();
  const { user } = useAuth();

  useEffect(() => {
    setValue('aff_note', affiliate?.aff_note);
  }, []);

  const note = useWatch({ control, name: 'aff_note' })
  const updatedNote = useDebounce(note, 300);

  useEffect(() => {
    if (updatedNote) {
      updateAffiliate(affiliate?.id, { 'aff_note': updatedNote }, true)
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
                <Typography variant="h5">Affiliate Note</Typography>
              </Stack>
            </Stack>
            <Controller
              name='aff_note'
              control={control}
              render={({ field: { onChange, value } }) => (
                <QuillEditor
                  placeholder="Write something"
                  sx={{ height: 350, my: 3 }}
                  value={value}
                  onChange={onChange}
                  readOnly={!user?.acc?.acc_e_lm_aff && user?.acc?.acc_e_lm_aff !== undefined}
                />
              )}
            />
          </CardContent>
        </Card>
      </Stack>
    </form>
  )
}

export default AffiliateNote