import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/system/Unstable_Grid/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { toast } from "react-hot-toast";

import { Iconify } from 'src/components/iconify';
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { LabelsDialog } from "src/components/labels-dialog";
import { SelectMenu } from "src/components/customize/select-menu";
import { riskApi } from "src/api/risk";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { useTimezone } from "src/hooks/use-timezone";

const useTeams = () => {
  const [teamList, setTeamList] = useState([]);

  const getTeams = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      const teamInfo = res?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  return teamList;
};

export const RiskEdit = (props) => {
  const { dealing, onGetDealing } = props;
  const teams = useTeams();
  const { user } = useAuth();
  const { toUTCTime, toLocalTime, combineDate } = useTimezone();

  const [labelList, setLabelList] = useState([]);
  const [labels, setLabels] = useState([]);
  const [openLabelModal, setOpenLabelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [calculatedSpread, setCalculatedSpread] = useState("");

  const [closedDate, setClosedDate] = useState();
  const [closedTime, setClosedTime] = useState();
  const [openedDate, setOpenedDate] = useState();
  const [openedTime, setOpenedTime] = useState();
  const [createdDate, setCreatedDate] = useState();
  const [createdTime, setCreatedTime] = useState();

  const getLabels = async () => {
    try {
      const res = await riskApi.getPositionLabels();
      const labelList = res?.labels
        ?.map(({ label }) => ({ label: label?.name, value: label?.id }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setLabels(res?.labels);
      setLabelList(labelList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const {
    control,
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm();

  const amount = useWatch({ control, name: "amount" });
  const leverage = useWatch({ control, name: "leverage" });

  useEffect(() => {
    if (dealing) {

      dealing?.amount && setValue("amount", dealing?.amount);
      dealing?.swap ? setValue("swap", dealing?.swap) : setValue("swap", "");
      dealing?.swap_long ? setValue("swap_long", dealing?.swap_long) : setValue("swap_long", "");
      dealing?.manual_swap ? setValue("manual_swap", dealing?.manual_swap) : setValue("manual_swap", "");
      dealing?.opened_amount && setValue("opened_amount", dealing?.opened_amount);
      dealing?.trade_amount && setValue("trade_amount", dealing?.trade_amount);
      dealing?.l_spread && setValue("l_spread", dealing?.l_spread);
      dealing?.l_spread_on && setValue("l_spread_on", dealing?.l_spread_on);
      dealing?.set_rate && setValue("set_rate", dealing?.set_rate);
      dealing?.sl && setValue("sl", dealing?.sl);
      dealing?.tp && setValue("tp", dealing?.tp);
      dealing?.leverage && setValue("leverage", dealing?.leverage);
      !!dealing?.position_labels?.length && setValue("label_ids", dealing?.position_labels?.map((l) => l?.id));

      dealing?.closed_at && setClosedDate(new Date(toLocalTime(dealing?.closed_at)));
      dealing?.closed_at && setClosedTime(new Date(toLocalTime(dealing?.closed_at)));

      dealing?.opened_at && setOpenedDate(new Date(toLocalTime(dealing?.opened_at)));
      dealing?.opened_at && setOpenedTime(new Date(toLocalTime(dealing?.opened_at)));

      dealing?.created_at && setCreatedDate(new Date(toLocalTime(dealing?.created_at)));
      dealing?.created_at && setCreatedTime(new Date(toLocalTime(dealing?.created_at)));
    }
  }, [dealing]);

  useEffect(() => {
    getLabels();
  }, []);

  useEffect(() => {
    if (dealing?.market_price && result && amount && leverage) {
      const currentPL = dealing?.profit;
      const currentUsdSpread = Number(dealing?.l_spread) * Number(leverage) * Number(dealing?.unit);
      const actualPL = Number(currentPL) + Number(currentUsdSpread);
      const actualResult = (Number(result) - Number(actualPL)) * -1;

      const spread =
        (Number(actualResult) / (Number(leverage) * Number(dealing?.unit)));

      if (spread) setCalculatedSpread(spread?.toFixed(5));
    }
  }, [dealing, amount, leverage, result]);

  const selectedLabels = useWatch({ control, name: "label_ids" });

  const currentChip = useMemo(() => {
    const newChips = selectedLabels?.map((selected) => {
      const chip = labelList?.find((item) => selected === item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Label",
      };
    });
    if (!selectedLabels) {
      setValue("label_ids", []);
    }
    return newChips;
  }, [selectedLabels, labelList]);

  const handleRemoveChip = (value) => {
    const newStatus = [...selectedLabels].filter((item) => item !== value);
    setValue("label_ids", newStatus);
  };

  const onSubmit = async (data) => {
    const request = {
      ...data,
      client_id: dealing?.client_id,
    };

    setIsLoading(true);

    const combinedOpenedAt = combineDate(openedDate, openedTime);
    const combinedCreatedAt = combineDate(createdDate, createdTime);
    const combinedClosedAt = combineDate(closedDate, closedTime);

    if (combinedOpenedAt) {
      request.opened_at = toUTCTime(combinedOpenedAt);
    }
    if (combinedCreatedAt) {
      request.created_at = toUTCTime(combinedCreatedAt);
    }
    if (combinedClosedAt) {
      request.closed_at = toUTCTime(combinedClosedAt);
    }


    try {
      await riskApi.updateSingleDealing(dealing?.id, request);
      setTimeout(() => {
        onGetDealing();
      }, 1500);

      setIsLoading(false);
      toast.success("Position updated successfully!");
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleSpreadUpdate = async () => {
    try {
      setValue("l_spread", calculatedSpread);
      await riskApi.updateSingleDealing(dealing?.id, {
        l_spread: calculatedSpread,
        client_id: dealing?.client_id,
      });
      setResult("");
      setCalculatedSpread("");
      setTimeout(() => {
        onGetDealing();
      }, 1500);
      toast.success("Spread successfully updated!");
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="Details" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography
                  variant="subtitle1"
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
                >
                  Swap short
                  {dealing?.status === 2 ? (
                    <Tooltip title="Swap short is editable only for open positions">
                      <Iconify icon="fluent:warning-24-regular" color='warning.main'/>
                    </Tooltip>
                  ) : null}
                </Typography>
                <OutlinedInput
                  fullWidth
                  disabled={dealing?.status === 2}
                  placeholder="Swap short"
                  type="number"
                  inputProps={{
                    step: "0.001",
                  }}
                  error={!!errors?.swap?.message}
                  helperText={errors?.swap?.message}
                  {...register("swap")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography
                  variant="subtitle1"
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
                >
                  Swap long
                  {dealing?.status === 2 ? (
                    <Tooltip title="Swap long is editable only for open positions">
                      <Iconify icon="fluent:warning-24-regular" color='warning.main'/>
                    </Tooltip>
                  ) : null}
                </Typography>
                <OutlinedInput
                  fullWidth
                  disabled={dealing?.status === 2}
                  placeholder="Swap long"
                  type="number"
                  inputProps={{
                    step: "0.001",
                  }}
                  error={!!errors?.swap_long?.message}
                  helperText={errors?.swap_long?.message}
                  {...register("swap_long")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography
                  variant="subtitle1"
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
                >
                  Manual swap
                  {dealing?.status === 2 ? (
                    <Tooltip title="Manual swap is editable only for open positions">
                      <Iconify icon="fluent:warning-24-regular" color='warning.main'/>
                    </Tooltip>
                  ) : null}
                </Typography>
                <OutlinedInput
                  fullWidth
                  disabled={dealing?.status === 2}
                  placeholder="Manual swap"
                  type="number"
                  inputProps={{
                    step: "0.001",
                  }}
                  error={!!errors?.manual_swap?.message}
                  helperText={errors?.manual_swap?.message}
                  {...register("manual_swap")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  Amount
                  {dealing?.status === 2 ? (
                    <Tooltip title="Amount is editable only for open positions">
                      <Iconify icon="fluent:warning-24-regular" color='warning.main'/>
                    </Tooltip>
                  ) : null}
                </Typography>
                <OutlinedInput
                  fullWidth
                  disabled={dealing?.status === 2}
                  placeholder="Amount"
                  error={!!errors?.amount?.message}
                  helperText={errors?.amount?.message}
                  {...register("amount")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography
                  variant="subtitle1"
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
                >
                  Closed amount
                  {dealing?.status !== 2 ? (
                    <Tooltip title="Closed amount is editable only for closed positions">
                      <Iconify icon="fluent:warning-24-regular" color='warning.main'/>
                    </Tooltip>
                  ) : null}
                </Typography>
                <OutlinedInput
                  fullWidth
                  disabled={dealing?.status !== 2}
                  placeholder="Closed amount"
                  error={!!errors?.trade_amount?.message}
                  helperText={errors?.trade_amount?.message}
                  {...register("trade_amount")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Opened amount</Typography>
                <OutlinedInput
                  fullWidth
                  placeholder="Opened amount"
                  error={!!errors?.opened_amount?.message}
                  helperText={errors?.opened_amount?.message}
                  {...register("opened_amount")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Leverage</Typography>
                <OutlinedInput
                  fullWidth
                  placeholder="Leverage"
                  error={!!errors?.leverage?.message}
                  helperText={errors?.leverage?.message}
                  {...register("leverage")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Set rate</Typography>
                <OutlinedInput
                  fullWidth
                  placeholder="Set rate"
                  error={!!errors?.set_rate?.message}
                  helperText={errors?.set_rate?.message}
                  {...register("set_rate")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Stop loss</Typography>
                <OutlinedInput
                  fullWidth
                  placeholder="Stop loss"
                  error={!!errors?.sl?.message}
                  helperText={errors?.sl?.message}
                  {...register("sl")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Take profit</Typography>
                <OutlinedInput
                  fullWidth
                  placeholder="Take profit"
                  error={!!errors?.tp?.message}
                  helperText={errors?.tp?.message}
                  {...register("tp")}
                />
              </Stack>
            </Grid>
            {user?.acc?.acc_v_risk_label ? (
              <Grid xs={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1">Labels</Typography>
                  <Stack alignItems="flex-start">
                    <MultiSelectMenu
                      control={control}
                      name="label_ids"
                      isLabel
                      openModal={() => setOpenLabelModal(true)}
                      list={labelList}
                      disabled={!user?.acc?.acc_e_risk_label}
                    />
                    {currentChip?.length > 0 && (
                      <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ px: 3, mt: 2 }}
                      >
                        <ChipSet
                          chips={currentChip}
                          handleRemoveChip={
                            user?.acc?.acc_e_risk_label && handleRemoveChip
                          }
                        />
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            ) : null}

            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Spread on</Typography>
                <SelectMenu
                  control={control}
                  name="l_spread_on"
                  list={[
                    { label: "Buy", value: 1 },
                    { label: "Sell", value: 2 },
                  ]}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Spread</Typography>
                <OutlinedInput
                  fullWidth
                  placeholder="Spread"
                  error={!!errors?.l_spread?.message}
                  helperText={errors?.l_spread?.message}
                  {...register("l_spread")}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              {dealing?.market_price ? (
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">Profit/Loss</Typography>
                    <OutlinedInput
                      fullWidth
                      placeholder="Profit/Loss"
                      value={result}
                      onChange={(e) => setResult(e?.target?.value)}
                    />
                  </Stack>

                  {calculatedSpread && result ? (
                    <Stack spacing={1}>
                      <Typography>Spread is {calculatedSpread}</Typography>
                      <Button variant="contained" onClick={handleSpreadUpdate}>
                        Update spread
                      </Button>
                    </Stack>
                  ) : null}
                </Stack>
              ) : null}
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Created Date</Typography>
                <DatePicker
                  format="yyyy-MM-dd"
                  label="Created Date"
                  value={createdDate}
                  onChange={(val) => setCreatedDate(val)}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Created Time</Typography>
                <TimePicker
                  format="h:mm:ss a"
                  views={["hours", "minutes", "seconds"]}
                  label="Created Time"
                  value={createdTime}
                  onChange={(val) => {
                    setCreatedTime(new Date(val))
                  }}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Opened Date</Typography>
                <DatePicker
                  format="yyyy-MM-dd"
                  label="Opened Date"
                  value={openedDate}
                  onChange={(val) => setOpenedDate(val)}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Opened Time</Typography>
                <TimePicker
                  label="Opened Time"
                  format="h:mm:ss a"
                  views={["hours", "minutes", "seconds"]}
                  value={openedTime}
                  onChange={(val) => setOpenedTime(val)}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Closed Date</Typography>
                <DatePicker
                  format="yyyy-MM-dd"
                  label="Closed Date"
                  disabled={dealing?.status === 1}
                  value={closedDate}
                  onChange={(val) => setClosedDate(val)}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Closed Time</Typography>
                <TimePicker
                  format="h:mm:ss a"
                  views={["hours", "minutes", "seconds"]}
                  disabled={dealing?.status === 1}
                  label="Closed Time"
                  value={closedTime}
                  onChange={(val) => setClosedTime(val)}
                />
              </Stack>
            </Grid>
          </Grid>
          <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
            <Button disabled={isLoading} variant="contained" type="submit">
              Update
            </Button>
          </CardActions>
        </CardContent>
      </Card>

      <LabelsDialog
        title="Edit Label"
        labels={labels}
        teams={teams}
        open={openLabelModal}
        onClose={() => setOpenLabelModal(false)}
      />
    </form>
  );
};
