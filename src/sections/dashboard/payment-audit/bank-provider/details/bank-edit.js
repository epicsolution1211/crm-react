import { useMemo, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { SelectMenu } from "src/components/customize/select-menu";
import { paths } from "src/paths";
import { paymentTypeApi } from "src/api/payment_audit/payment_type";
import { useRouter } from "src/hooks/use-router";
import { CurrencyModal } from "../../currency/currency-modal";
import { bankProviderApi } from "src/api/payment_audit/bank_provider";

const feeType = [
  { label: "INCOMING", value: "INCOMING" },
  { label: "OUTGOING", value: "OUTGOING" },
];

export const BankEdit = ({ feeId }) => {
  const router = useRouter();
  const [rate, setRate] = useState({});

  const [openModal, setOpenModal] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const currencies = useSelector((state) => state.currency.currencies);
  const currencyList = useMemo(
    () => currencies?.map((item) => ({ value: item?.id, label: item?.name })),
    [currencies]
  );
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const { control, setValue, handleSubmit, register } = useForm();

  const currency_ids = useWatch({ control, name: "currency_ids" });

  const currentChip = useMemo(() => {
    const newChips = currency_ids?.map((selected) => {
      const chip = currencyList?.find((item) => selected == item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
      };
    });
    if (!currency_ids) {
      setValue("currency_ids", []);
    }
    return newChips;
  }, [currency_ids]);

  const handleRemoveChip = (value) => {
    const newStatus = [...currency_ids].filter((item) => item !== value);
    setValue("currency_ids", newStatus);
  };

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const onSubmit = async (data) => {
    setIsLoading(true);
    data.start_date = `${format(startDate, "yyyy-MM-dd")} ${format(
      startTime,
      "HH:mm:ss"
    )}`;
    data.end_date = `${format(endDate, "yyyy-MM-dd")} ${format(
      endTime,
      "HH:mm:ss"
    )}`;
    data.bank_id = params?.providerId;
    try {
      await bankProviderApi.updateRate(feeId, data);
      toast("Bank provider fee successfully created!");
      setIsLoading(false);
      setTimeout(
        () =>
          router.push(
            `${paths.dashboard.paymentAudit.bankProvider.index}/${
              params?.providerId
            }?fee=${true}`
          ),
        1000
      );
    } catch (error) {
      setIsLoading(false);
      toast(error?.response?.data?.message ?? error?.message);
    }
  };

  const getPaymentType = async () => {
    try {
      const res = await paymentTypeApi.getPaymentTypes();
      setPaymentTypes(
        res?.payment_types?.map((item) => ({
          value: item?.name,
          label: item?.name,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getBankProviderFee = async () => {
    try {
      const res = await bankProviderApi.getRate(feeId);
      setRate(res?.rate);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    setValue("payment_type_id", rate?.audit_payment_type);
    setValue("fee_type", rate?.fee_type);
    setValue(
      "currency_ids",
      rate?.currencies?.map((item) => item?.id)
    );
    setValue("rate", rate?.rate);
    setValue("min_charge", rate?.min_charge);
    setValue("flat_fee", rate?.flat_fee);
    setStartDate(new Date(rate?.start_date?.split(".")[0]));
    setStartTime(new Date(rate?.start_date?.split(".")[0]));
    setEndDate(new Date(rate?.end_date?.split(".")[0]));
    setEndTime(new Date(rate?.end_date?.split(".")[0]));
  }, [rate]);

  useEffect(() => {
    getPaymentType();
  }, []);

  useEffect(() => {
    getBankProviderFee();
  }, [feeId]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title="Details" />
          <CardContent>
            <Stack direction="column" spacing={3}>
              <Stack>
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid xs={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1">
                          Payment Type
                        </Typography>
                        <Stack alignItems="flex-start">
                          <SelectMenu
                            control={control}
                            name="payment_type_id"
                            list={paymentTypes}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid xs={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1">Type</Typography>
                        <Stack alignItems="flex-start">
                          <SelectMenu
                            control={control}
                            name="fee_type"
                            list={feeType}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid xs={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1">Currency</Typography>
                        <Stack alignItems="flex-start">
                          <MultiSelectMenu
                            isCurrency
                            control={control}
                            name="currency_ids"
                            openModal={() => setOpenModal(true)}
                            list={currencyList}
                          />
                          {currentChip?.length > 0 && (
                            <Stack
                              alignItems="center"
                              direction="row"
                              flexWrap="wrap"
                              gap={1}
                              sx={{ px: 2, mt: 2 }}
                            >
                              <ChipSet
                                chips={currentChip}
                                handleRemoveChip={handleRemoveChip}
                              />
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid xs={6}>
                      <Stack spacing={3}>
                        <Typography variant="subtitle1" px={1}>
                          Rate
                        </Typography>
                        <TextField
                          hiddenLabel
                          type="number"
                          {...register("rate")}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={6}>
                      <Stack spacing={3}>
                        <Typography variant="subtitle1" px={1}>
                          Minimum Charge
                        </Typography>
                        <TextField
                          hiddenLabel
                          type="number"
                          {...register("min_charge")}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={6}>
                      <Stack spacing={3}>
                        <Typography variant="subtitle1" px={1}>
                          Flat Fee
                        </Typography>
                        <TextField
                          hiddenLabel
                          type="number"
                          {...register("flat_fee")}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1">Start date</Typography>
                        <DatePicker
                          format="yyyy-MM-dd"
                          hiddenLabel
                          label="Start Date"
                          value={startDate}
                          onChange={(val) => setStartDate(val)}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1">Start time</Typography>
                        <TimePicker
                          label="Start time"
                          format="h:mm:ss a"
                          views={["hours", "minutes", "seconds"]}
                          value={startTime}
                          onChange={(val) => setStartTime(val)}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1">End date</Typography>
                        <DatePicker
                          format="yyyy-MM-dd"
                          label="End date"
                          value={endDate}
                          onChange={(val) => setEndDate(val)}
                        />
                      </Stack>
                    </Grid>
                    <Grid xs={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1">End time</Typography>
                        <TimePicker
                          format="h:mm:ss a"
                          views={["hours", "minutes", "seconds"]}
                          label="End time"
                          value={endTime}
                          onChange={(val) => setEndTime(val)}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Stack>
            </Stack>
            <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
              <Button disabled={isLoading} variant="contained" type="submit">
                Update
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </form>
      <CurrencyModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};
