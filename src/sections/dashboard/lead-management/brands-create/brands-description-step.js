import { useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { QuillEditor } from "src/components/quill-editor";

export const BrandDescriptionStep = ({ onBack, onNext, ...other }) => {

  const { handleSubmit, control } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    onNext(data);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} {...other}>
        <Box>
          <Typography variant="h6">Add some description</Typography>
        </Box>
        <Controller
          name="note"
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
            loading={isLoading}
            variant="contained"
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            type="submit"
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

BrandDescriptionStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
