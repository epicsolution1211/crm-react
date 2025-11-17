import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup.object({
  address: yup.string().required("Address is a required field"),
});

export const EditWalletModal = (props) => {
  const { open, onClose, handleUpdateWallet, wallet = {} } = props;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      address: wallet?.address,
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    handleUpdateWallet(wallet?.id, data);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    reset();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">Update Wallet Address</Typography>
          </Stack>
          <Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Wallet Address
                      </Typography>
                      <TextField
                        fullWidth
                        hiddenLabel
                        {...register("address")}
                        placeholder="Address..."
                        error={!!errors?.address?.message}
                        helperText={errors?.address?.message}
                        type="text"
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 2,
                    px: 3,
                  }}
                  gap={3}
                >
                  <Button
                    disabled={isLoading}
                    variant="contained"
                    type="submit"
                  >
                    Update
                  </Button>
                  <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
                    Cancel
                  </Button>
                </Box>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
