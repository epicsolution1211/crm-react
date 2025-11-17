import { useEffect } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { ibsApi } from "src/api/ibs";
import MuiDatePicker from "src/components/customize/date-picker";
import CustomSwitch from "src/components/customize/custom-switch";
import { useTimezone } from "src/hooks/use-timezone";

const validationSchema = yup.object({
  name: yup.string().required("IB Name is a required field"),
});

export const IBRewardsEditModal = ({ open, onClose, brandId, reward = undefined, handleGetIbRewards }) => {
  const { toUTCTime } = useTimezone();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { start_date, end_date, ...newData } = data;
      const startUtcDate = toUTCTime(start_date);
      const endUtcDate = toUTCTime(end_date);

      const request = {
        ...newData,
      };

      if (startUtcDate) {
        request["start_date"] = startUtcDate;
      }
      if (endUtcDate) {
        request["end_date"] = endUtcDate;
      }
      request["internal_brand_id"] = brandId;

      if(reward) {
        await ibsApi.updateIbReward(reward.id, request);
      } else {
        await ibsApi.createIbReward(request);
      }

      if (reward) {
        handleGetIbRewards({
          ...reward,
          ...request
        });
      } else {
        handleGetIbRewards();
      }


      onClose();
      toast.success(reward ? 'IB Reward updated successfully' : 'IB Reward created successfully');
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    }
  };


  useEffect(() => {
    reset({
      name: reward ? reward.name : '',
      description: reward ? reward.description : '',
      start_date: reward ? reward.start_date : new Date(),
      end_date: reward ? reward.end_date : new Date(),
      default: reward ? reward.default : false,
      enabled: reward ? reward.enabled : true,
      auto_transaction: reward ? reward.auto_transaction : false,
    });
  }, [open, reward]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">{reward ? "Update IB Rewards" : "Create IB Rewards"}</Typography>
          </Stack>
          <Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        IB Name
                      </Typography>
                      <TextField
                        fullWidth
                        hiddenLabel
                        {...register("name")}
                        placeholder="IB Name"
                        error={!!errors?.name?.message}
                        helperText={errors?.name?.message}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Description
                      </Typography>
                      <TextField
                        fullWidth
                        hiddenLabel
                        {...register("description")}
                        placeholder="Description"
                      />
                    </Stack>
                  </Grid>
                  <Grid
                    xs={6}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Typography paddingLeft={1}>Start Date</Typography>
                    <MuiDatePicker
                      control={control}
                      setValue={setValue}
                      name="start_date"
                      label="Start Date"
                      defaultNull
                    />
                  </Grid>
                  <Grid
                    xs={6}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Typography paddingLeft={1}>End Date</Typography>
                    <MuiDatePicker
                      control={control}
                      setValue={setValue}
                      name="end_date"
                      label="End Date"
                      defaultNull
                    />
                  </Grid>
                  <Grid xs={12} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 2 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                    >
                      <Typography>Default: </Typography>
                      <CustomSwitch control={control} name="default" />
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                    >
                      <Typography>Enabled: </Typography>
                      <CustomSwitch control={control} name="enabled" />
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                    >
                      <Typography>Auto Transaction Approval: </Typography>
                      <CustomSwitch control={control} name="auto_transaction" />
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
                  <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                    {reward ? "Update" : "Create"}
                  </LoadingButton>
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
