import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { QuillEditor } from 'src/components/quill-editor';
import { Iconify } from 'src/components/iconify';

export const CustomerDescriptionStep = (props) => {
  
  const { onBack, onNext, description, isPending, ...other } = props;
  const [content, setContent] = useState(description);

  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  const handleFinish = useCallback(() => {
    onNext(content);
  }, [content, onNext]);

  useEffect(() => {
    setContent(description);
  }, [description])

  return (
    <Stack
      spacing={3}
      {...other}>
      <div>
        <Typography variant="h6">
          Add some description
        </Typography>
      </div>
      <QuillEditor
        onChange={handleContentChange}
        placeholder="Write something"
        sx={{ height: 400 }}
        value={content}
      />
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Button
          color="inherit"
          onClick={() => {onBack(content)}}
        >
          Back
        </Button>
        <LoadingButton
          sx={{minWidth: 110}}
          endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
          disabled={isPending}
          onClick={isPending ? null : handleFinish}
          variant="contained"
          loading={isPending}
        >
          Finish
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

CustomerDescriptionStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  description: PropTypes.string,
};
