import { useEffect } from 'react';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const validationSchema = yup.object({
  name: yup.string().required("Team name is required")
})

export const SettingsAddSkillTeamModal = ({ open, onClose, handleAddSkillTeam }) => {
  const { register, handleSubmit, reset, formState:{ errors } } = useForm({resolver:yupResolver(validationSchema)});

  const onSubmitSkillTeam = async (data) => {
    try {
      await handleAddSkillTeam(data.name);
      onClose();
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    reset();
  }, [open])
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <Container maxWidth="sm">
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 3
          }}
        >
          <form onSubmit={handleSubmit(onSubmitSkillTeam)}>
            <Stack spacing={3}>
              <Typography py={2} textAlign="center" variant="h5">Create Skill Team</Typography>
              <Stack spacing={3}>
                <TextField
                  InputLabelProps={{ shrink:true }}
                  autoFocus
                  fullWidth
                  label="Team Name"
                  type="text"
                  helperText={errors?.name?.message??""}
                  error={!!errors?.name?.message}
                  {...register('name')}
                />
              </Stack>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  pb: 3,
                  px: 3,
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                >
                  Create
                </Button>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Dialog>
  )
};
