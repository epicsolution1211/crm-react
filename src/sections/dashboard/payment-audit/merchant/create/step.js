import { useState, useMemo, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";

import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { CurrencyModal } from "../../currency/currency-modal";
import { SelectMenu } from "src/components/customize/select-menu";
import { merchantApi } from "src/api/payment_audit/merchant_api";
import { paths } from "src/paths";
import { paymentTypeApi } from "src/api/payment_audit/payment_type";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { Iconify } from 'src/components/iconify';

const feeType = [
  { label: "INCOMING", value: "INCOMING" },
  { label: "OUTGOING", value: "OUTGOING" },
];

export const FeeStep = () => {
  const [openModal, setOpenModal] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const currencies = useSelector((state) => state.currency.currencies);
  const currencyList = useMemo(
    () => currencies?.map((item) => ({ value: item?.id, label: item?.name })),
    [currencies]
  );

  const router = useRouter();
  const searchParams = useSearchParams();
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
    data.start_date = `${format(startDate, "yyyy-MM-dd")} ${format(
      startTime,
      "HH:mm:ss"
    )}`;
    data.end_date = `${format(endDate, "yyyy-MM-dd")} ${format(
      endTime,
      "HH:mm:ss"
    )}`;
    data.merchant_id = searchParams.get("merchantId");
    try {
      await merchantApi.createRate(data);
      toast("Merchant fee successfully created!");
      setTimeout(
        () =>
          router.push(
            `${paths.dashboard.paymentAudit.merchant.index}/${searchParams.get(
              "merchantId"
            )}?fee=${true}`
          ),
        1000
      );
    } catch (error) {
      toast(error?.response?.data?.message ?? error?.message);
    }
  };

  const getPaymentType = async () => {
    try {
      const res = await paymentTypeApi.getPaymentTypes();
      setPaymentTypes(
        res?.payment_types?.map((item) => ({
          value: item?.id,
          label: item?.name,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getPaymentType();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Stack spacing={3}>
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
                        <Typography variant="h7" px={1}>
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
                          value={startDate ? new Date(startDate) : new Date()}
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
                          value={startTime ? new Date(startTime) : new Date()}
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
                          value={endDate ? new Date(endDate) : new Date()}
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
                          value={endTime ? new Date(endTime) : new Date()}
                          onChange={(val) => setEndTime(val)}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack alignItems="center" direction="row" sx={{ mt: 5 }} spacing={2}>
            <Button
              endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
              type="submit"
              variant="contained"
            >
              Complete
            </Button>
          </Stack>
        </Stack>
      </form>
      <CurrencyModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};
