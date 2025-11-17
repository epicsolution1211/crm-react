import { useEffect, useState } from "react";
import * as yup from "yup";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { toast } from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Iconify } from 'src/components/iconify';
import { SelectMenu } from "src/components/customize/select-menu";
import { riskApi } from "src/api/risk";
import { settingsApi } from "src/api/settings";
import { useDebounce } from "src/hooks/use-debounce";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { useTraderAccounts } from "../customer/customer-trader-accounts";

const POSITION_TYPES = [
  { label: "BUY", value: 1 },
  { label: "SELL", value: 2 },
];

const validationSchema = yup.object().shape({
  ticker_id: yup.string().required("Ticker is required field!"),
  amount: yup.number().when("isAmount", {
    is: true,
    then: () =>
      yup
        .number()
        .transform((value) => (Number.isNaN(value) ? null : value))
        .nullable()
        .required("Amount is required!"),
    otherwise: () =>
      yup
        .number()
        .transform((value) => (Number.isNaN(value) ? null : value))
        .nullable(),
  }),
  leverage: yup.number().required("Leverage is required field!"),
  unit: yup.string().when("isAmount", {
    is: true,
    then: () => yup.string(),
    otherwise: () => yup.string().required("Unit is required field!"),
  }),
  position_type: yup.number().required("Position type is required field!"),
});

export const RiskCreate = (props) => {

  const params = useSearchParams();

  const router = useRouter();

  const { accounts } = useTraderAccounts(props?.customerId);

  const [tickers, setTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAtMarket, setIsAsMarket] = useState(false);
  const [search, setSearch] = useState("");

  const q = useDebounce(search, 500);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { isAmount: true },
  });

  const isAmount = useWatch({ control, name: "isAmount" });

  const getTickers = async (q = "") => {
    try {
      const params = {};

      if (q) params["q"] = q;

      const res = await settingsApi.getTickers(params);
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
    getTickers(q);
  }, [q]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { isAmount, set_rate, sl, tp, trading_account_id, amount, unit, ...rest } = data;
      const request = {
        ...rest,
        client_id: params?.get("customerId"),
      };
      if (isAmount) {
        request["amount"] = amount;
      } else {
        request["unit"] = unit;
      }
      if (set_rate) request["set_rate"] = set_rate;
      if (sl) request["sl"] = sl;
      if (tp) request["tp"] = tp;
      if (trading_account_id) request["trading_account_id"] = trading_account_id;
      await riskApi.createPosition(request);
      setTimeout(() => {
        router.push(props?.link);
      }, 1000);
      setIsLoading(false);
      toast.success("Position successfully created!");
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
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  Ticker
                </Typography>
                <SelectMenu
                  control={control}
                  name="ticker_id"
                  list={tickers}
                  apiSearch={search}
                  setApiSearch={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearch(e?.target?.value)
                  }}
                  isApiSearch
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
                  {isAmount ? "Amount" : "Unit"}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  {isAmount ? (
                    <TextField
                      fullWidth
                      {...register("amount")}
                      type="number"
                      label="Amount"
                      inputProps={{
                        step: 0.00000001,
                      }}
                      placeholder="Amount"
                      error={!!errors?.amount?.message}
                      helperText={errors?.amount?.message}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      {...register("unit")}
                      type="number"
                      label="Unit"
                      placeholder="Unit"
                      inputProps={{
                        step: 0.00000001,
                      }}
                      error={!!errors?.unit?.message}
                      helperText={errors?.unit?.message}
                    />
                  )}
                  <Button
                    variant="contained"
                    onClick={() => setValue("isAmount", !isAmount)}
                    sx={{ gap: 1 }}
                  >
                    <Iconify icon="ion:reload-sharp" sx={{ flexShrink: 0, flexGrow: 0 }} width={18}/>
                    <Typography>{isAmount ? "Unit" : "Amount"}</Typography>
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Leverage</Typography>
                <TextField
                  fullWidth
                  {...register("leverage")}
                  label="Leverage"
                  type="number"
                  placeholder="Leverage"
                  error={!!errors?.leverage?.message}
                  helperText={errors?.leverage?.message}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Set rate</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TextField
                    fullWidth
                    {...register("set_rate")}
                    label={isAtMarket ? "At market" : "Set rate"}
                    placeholder={isAtMarket ? "At market" : "Set rate"}
                    error={!!errors?.set_rate?.message}
                    helperText={errors?.set_rate?.message}
                    disabled={isAtMarket}
                  />
                  <Button variant="contained" sx={{ width: 175, gap: 1 }} onClick={() => setIsAsMarket(!isAtMarket)}>
                    <Iconify icon="ion:reload-sharp" sx={{ flexShrink: 0, flexGrow: 0 }} width={18}/>
                    <Typography whiteSpace='nowrap'>
                      {isAtMarket ? "Set rate" : "At market"}
                    </Typography>
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Stop loss</Typography>
                <TextField
                  fullWidth
                  {...register("sl")}
                  label="Stop loss"
                  placeholder="Stop loss"
                  error={!!errors?.sl?.message}
                  helperText={errors?.sl?.message}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Take profit</Typography>
                <TextField
                  fullWidth
                  {...register("tp")}
                  placeholder="Take profit"
                  label="Take profit"
                  error={!!errors?.tp?.message}
                  helperText={errors?.tp?.message}
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
                  Position type
                </Typography>
                <SelectMenu
                  control={control}
                  name="position_type"
                  list={POSITION_TYPES}
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
                  Trading account
                </Typography>
                <SelectMenu
                  control={control}
                  name="trading_account_id"
                  list={accounts?.length>0? accounts?.filter((account)=> !account?.main)?.map(acc => ({ label: acc?.name ?? acc?.id, value: acc?.id })): []}
                />
              </Stack>
            </Grid>
          </Grid>
          <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
            <Button disabled={isLoading} variant="contained" type="submit">
              Create
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </form>
  );
};
