import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useForm, useWatch } from "react-hook-form";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import LoadingButton from '@mui/lab/LoadingButton';
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system";

import CustomSwitch from "src/components/customize/custom-switch";
import MuiDatePicker from "src/components/customize/date-picker";
import { Iconify } from 'src/components/iconify';
import { SelectMenu } from "src/components/customize/select-menu";
import { clientDashboardApi } from "src/api/client-dashboard";
import { getAPIUrl } from "src/config";
import { settingsApi } from "src/api/settings";

export const CustomerCreateSavingAccount = ({ open, onClose, onGetAccounts = () => { }, customerId, accounts }) => {
  const fileRef = useRef(null);
  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
  } = useForm();
  // eslint-disable-next-line no-unused-vars
  const [tickers, setTickers] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const savingAccountId = useWatch({ control, name: "saving_account_id" });
  const optionId = useWatch({ control, name: "option_id" });

  useEffect(() => {
    if (savingAccountId && accounts) {
      const _options = accounts?.find(acc => acc?.value === savingAccountId)?.options;
      if (_options?.length) {
        setOptions(JSON.parse(_options)?.map(option => ({
          value: option?.id,
          label: `${option?.period} - ${option?.percentage}%`,
          period: option?.period,
          percentage: option?.percentage,
        })));
      } else {
        setOptions([]);
      }
    }
  }, [savingAccountId, accounts]);

  useEffect(() => {
    if (optionId && options) {
      const option = options?.find(o => o?.value === optionId);

      if (option) {
        setValue("duration", option?.period);
        setValue("percentage", option?.percentage);
      } else {
        setValue("duration", "");
        setValue("percentage", "");
      }
    }
  }, [options, optionId]);

  const getTickers = async () => {
    try {
      const res = await settingsApi.getTickers();
      setTickers(
        res?.tickers?.map((ticker) => ({
          label: ticker?.name,
          value: ticker?.id,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTickers();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
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

      await clientDashboardApi.createClientSavingAccount(formData);
      toast.success("Client saving account successfully created!");
      onClose();
      setTimeout(() => {
        onGetAccounts();
        reset();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    reset();

    setValue("start_date", format(new Date(), 'yyyy-MM-dd'));
    setValue("end_date", format(new Date(), 'yyyy-MM-dd'));
  }, []);

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
      <Stack alignItems="center" sx={{ p: 5 }}>
        <Typography variant="h5">Create Saving Account</Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ p: 5, pt: 0 }}>
          <Grid container spacing={2} sx={{ px: 2 }}>
            <Grid item xs={6}>
              <Stack alignItems="center" direction="row" spacing={2}>
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
                        height: 100,
                        width: 100,
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

            <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'end', justifyContent: 'center' }}>
              <CustomSwitch label="Active" control={control} name="active" />
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

            {options?.length > 0 ? (
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <SelectMenu
                    control={control}
                    label="Option"
                    name="option_id"
                    list={options}
                  />
                </Stack>
              </Grid>
            ) : null}

            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" px={1}>Percentage</Typography>
                <OutlinedInput
                  label="Percentage"
                  name="percentage"
                  placeholder="Percentage"
                  type="number"
                  {...register("percentage")}
                />
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" px={1}>Interest</Typography>
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
                <Typography variant="subtitle1" px={1}>Amount</Typography>
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
                <Typography variant="subtitle1" px={1}>Note</Typography>
                <OutlinedInput
                  name="note"
                  placeholder="Note"
                  {...register("note")}
                />
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" px={1}>Name</Typography>
                <OutlinedInput
                  name="name"
                  placeholder="Name"
                  {...register("name")}
                />
              </Stack>
            </Grid>

            {/* <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Duration</Typography>
                <OutlinedInput
                  name="duration"
                  placeholder="Duration"
                  {...register("duration")}
                />
              </Stack>
            </Grid> */}

            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" px={1}>Start Date</Typography>
                <MuiDatePicker control={control} name="start_date" />
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" px={1}>End Date</Typography>
                <MuiDatePicker control={control} name="end_date" />
              </Stack>
            </Grid>
          </Grid>
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{
              alignSelf: "flex-end",
              mt: 4,
            }}
            loading={isLoading}
          >
            Create
          </LoadingButton>
        </Stack>
      </form>
    </Dialog>
  );
};
