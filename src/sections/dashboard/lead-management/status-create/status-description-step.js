import { Controller, useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { QuillEditor } from "src/components/quill-editor";
import { Iconify } from 'src/components/iconify';

export const StatusDescriptionStep = (props) => {
  const { onBack, onNext, createProcessStarted, ...other } = props;

  const { handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} {...other}>
        <Box>
          <Typography variant="h6">Add some description</Typography>
        </Box>
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value } }) => (
            <QuillEditor
              placeholder="Write something"
              sx={{ height: 300 }}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Stack alignItems="center" direction="row" spacing={2}>        
          <LoadingButton
            loading={createProcessStarted}
            color="primary"
            variant="contained"
            type='submit'
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
          >
            Finish
          </LoadingButton>
          <Button color="inherit" onClick={onBack}>
            Back
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
