import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { alpha } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CustomSwitch from "src/components/customize/custom-switch";
import { SelectMenu } from "src/components/customize/select-menu";
import { clientDashboardApi } from "src/api/client-dashboard";
import MuiDatePicker from "src/components/customize/date-picker";
import { getAPIUrl } from "src/config";
import { Scrollbar } from "src/components/scrollbar";
import { Iconify } from 'src/components/iconify';

export const EditAccountModal = ({ account, open, onClose, onGetAccounts = () => { }, customerId, accounts = [], updateAccount = () => {} }) => {
  const fileRef = useRef(null);
  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
  } = useForm();
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (account) {
      Object.keys(account)?.forEach(key => {
        setValue(key, account?.[key]);
      });

      if (account?.file) {
        setFilePreview(account?.file);
      }
    }
  }, [account, open]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach(key => {
        formData.append(key, data?.[key]);
      });

      formData.append("active", data?.active ?? false);

      if (file) {
        formData.append("file", file);
      }

      formData.append("client_id", customerId);

      const response = await clientDashboardApi.updateClientSavingAccount(account?.id, formData);
      updateAccount(response?.client_sacing_account)

      toast.success("Client saving account successfully updated!");
      onClose();
      setTimeout(() => {
        onGetAccounts();
        reset();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleFileAttach = useCallback(() => {
    fileRef?.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event?.target?.files[0];
      const preview = URL.createObjectURL(file)
      setFile(file);
      setFilePreview(preview);
    },
    []
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack alignItems="center" sx={{ pt: 5 }}>
        <Typography variant="h5">Update Saving Account</Typography>
      </Stack>

      <Scrollbar sx={{ maxHeight: 750, px: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ p: 4 }}>
            <Grid container rowSpacing={2} columnSpacing={3}>
              <Grid item xs={6}>
                <Stack alignItems="center" direction="row" spacing={2} pb={1}>
                  <Box
                    sx={{
                      borderColor: "neutral.300",
                      borderRadius: "50%",
                      borderStyle: "dashed",
                      borderWidth: 1,
                      p: "4px",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "50%",
                        height: "100%",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <Box
                        onClick={handleFileAttach}
                        sx={{
                          alignItems: "center",
                          backgroundColor: (theme) =>
                            alpha(theme.palette.neutral[700], 0.5),
                          borderRadius: "50%",
                          color: "common.white",
                          cursor: "pointer",
                          display: "flex",
                          height: "100%",
                          justifyContent: "center",
                          left: 0,
                          opacity: 0,
                          position: "absolute",
                          top: 0,
                          width: "100%",
                          zIndex: 1,
                          "&:hover": {
                            opacity: 1,
                          },
                        }}
                      >
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <Iconify icon="famicons:camera-outline" width={24} />
                          <Typography
                            color="inherit"
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            Select
                          </Typography>
                        </Stack>
                      </Box>
                      <Avatar
                        src={filePreview ? filePreview?.includes('http') ? filePreview : `${getAPIUrl()}/${filePreview}` : ""}
                        sx={{
                          height: 95,
                          width: 95,
                        }}
                      >
                        <Iconify icon="mage:file-2" width={24} />
                      </Avatar>
                    </Box>

                    <input
                      hidden
                      ref={fileRef}
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Box>
                  <Typography variant="h6">Upload image</Typography>
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1} height={1} justifyContent='center' alignItems='center'>
                  <CustomSwitch label="Active" control={control} name="active" />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <SelectMenu
                    control={control}
                    label="Saving account"
                    name="saving_account_id"
                    list={accounts}
                  />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>Percentage</Typography>
                  <OutlinedInput
                    name="percentage"
                    placeholder="Percentage"
                    type="number"
                    {...register("percentage")}
                  />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>Interest</Typography>
                  <OutlinedInput
                    name="interest"
                    type="number"
                    placeholder="Interest"
                    {...register("interest")}
                  />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>Amount</Typography>
                  <OutlinedInput
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    {...register("amount")}
                  />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>Note</Typography>
                  <OutlinedInput
                    name="note"
                    placeholder="Note"
                    {...register("note")}
                  />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>Name</Typography>
                  <OutlinedInput
                    name="name"
                    placeholder="Name"
                    {...register("name")}
                  />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>Duration</Typography>
                  <OutlinedInput
                    name="duration"
                    placeholder="Duration"
                    {...register("duration")}
                  />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>Start Date</Typography>
                  <MuiDatePicker control={control} name="start_date" />
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography variant="h7" px={1}>End Date</Typography>
                  <MuiDatePicker control={control} name="end_date" />
                </Stack>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              type="submit"
              sx={{
                alignSelf: "flex-end",
                mt: 2,
              }}
            >
              Update
            </Button>
          </Stack>
        </form>
      </Scrollbar>
    </Dialog>
  );
};
