import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useSettings } from "src/hooks/use-settings";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { toast } from "react-hot-toast";

import CustomSwitch from "../../../customize/custom-switch";
import { settingsApi } from "src/api/settings";
import { useDebounce } from "src/hooks/use-debounce";
import { Iconify } from "../../../iconify";

const leverageList = [
  { label: "Fixed", value: 1 },
  { label: "Up to", value: 2 },
];

const spreadOnList = [
  { label: "Buy", value: 1 },
  { label: "Sell", value: 2 },
  { label: "Both", value: 3 },
];

const swapRateTypeList = [
  { label: "Numeric", value: 1 },
  { label: "Percentage", value: 2 },
];

const SpreadItem = ({ item }) => {
  const settings = useSettings();
  const { register, control, reset, setValue } = useForm();
  const [loading, setIsLoading] = useState(false);
  const isReady = useDebounce(loading, 800);

  const isActive = useWatch({ control, name: "enabled" });

  const calculate = (margin, leverage, value, spread) => {
    let result =
      Number(margin) * Number(leverage) * Number(spread);
    if (result < 0) {
      result = `${result.toFixed(2)}`;
    } else if (result === 0) {
      result = 0;
    } else {
      result = `+${result.toFixed(2)}`;
    }
    return result;
  };

  const handleLeverageTypeUpdate = async (
    spread,
    leverage_amount,
    leverage_type,
    spread_on,
    enabled,
    swapShort,
    swapLong,
    manualSwap,
    contractSizeMultiplier,
    lotSize,
    commission,
    // swapType,
    swapRateType
  ) => {
    try {
      const formData = new FormData();
      if (enabled) {
        formData.append("spreadId", item?.id);
        formData.append("spread", parseFloat(spread));
        formData.append(
          "leverage_amount",
          leverage_amount > 0 ? parseFloat(leverage_amount) : 0
        );
        formData.append("leverage_type", leverage_type);
        formData.append("spread_on", spread_on);
        formData.append("enabled", enabled);
        if (swapShort) formData.append("swap", swapShort);
        if (swapLong) formData.append("swap_long", swapLong);
        if (manualSwap) formData.append("manual_swap", manualSwap);
        if (contractSizeMultiplier)
          formData.append("contract_size_multiplier", contractSizeMultiplier);
        if (lotSize) formData.append("lot_size", lotSize);
        if (commission) formData.append("commission", commission);
        // if (swapType) formData.append("swap_type", swapType);
        if (swapRateType) formData.append("swap_rate_type", swapRateType);
      } else {
        formData.append("spreadId", item?.id);
        formData.append("enabled", enabled);
      }

      await settingsApi.updateSpread(item?.id, formData);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const margin = useWatch({ control, name: "margin" });
  const leverage = useWatch({ control, name: "leverage" });
  const value = item?.current_value;
  const spreadValue = useWatch({ control, name: "spread" });
  const leverageValue = useWatch({ control, name: "leverage_amount" });
  // const swapType = useWatch({ control, name: "swap_type" });
  const commisionValue = useWatch({ control, name: "commission" });
  const lotSizeValue = useWatch({ control, name: "lot_size" });
  const swapShortValue = useWatch({ control, name: "swap_short" });
  const swapLongValue = useWatch({ control, name: "swap_long" });
  const manualSwapValue = useWatch({ control, name: "manual_swap" });
  const contractSizeMultiplierValue = useWatch({
    control,
    name: "contract_size_multiplier",
  });
  const swapRateType = useWatch({ control, name: "swap_rate_type" });

  const spread = useDebounce(spreadValue, 500);
  const swapShort = useDebounce(swapShortValue, 500);
  const swapLong = useDebounce(swapLongValue, 500);
  const manualSwap = useDebounce(manualSwapValue, 500);
  const contractSizeMultiplier = useDebounce(contractSizeMultiplierValue, 500);
  const lotSize = useDebounce(lotSizeValue, 500);
  const commission = useDebounce(commisionValue, 500);
  const leverage_amount = useDebounce(leverageValue, 500);
  const leverage_type = useWatch({ control, name: "leverage_type" });
  const spread_on = useWatch({ control, name: "spread_on" });
  const enabled = useWatch({ control, name: "enabled" });

  useEffect(() => {
    reset(item);
    if (item?.swap) setValue("swap_short", item?.swap);
    setValue("margin", 1);
    setValue("leverage", 1);
    setIsLoading(true);
  }, [item]);

  useEffect(() => {
    if (isReady) {
      handleLeverageTypeUpdate(
        spread,
        leverage_amount,
        leverage_type,
        spread_on,
        enabled,
        swapShort,
        swapLong,
        manualSwap,
        contractSizeMultiplier,
        lotSize,
        commission,
        // swapType,
        swapRateType
      );
    }
  }, [
    spread,
    leverage_amount,
    leverage_type,
    spread_on,
    enabled,
    swapShort,
    swapLong,
    manualSwap,
    contractSizeMultiplier,
    lotSize,
    commission,
    // swapType,
    swapRateType,
  ]);

  useEffect(() => {
    if (isReady) {
      toast(`Spread successfully updated.`);
    }
  }, [spread]);

  useEffect(() => {
    if (isReady) {
      toast(`Leverage amount successfully updated.`);
    }
  }, [leverage_amount]);

  useEffect(() => {
    if (isReady) {
      toast(`Leverage type successfully updated.`);
    }
  }, [leverage_type]);

  useEffect(() => {
    if (isReady) {
      toast(`Spread on successfully updated.`);
    }
  }, [spread_on]);

  useEffect(() => {
    if (isReady) {
      toast(`Enabled successfully updated.`);
    }
  }, [enabled]);

  useEffect(() => {
    if (isReady) {
      toast(`Swap short successfully updated.`);
    }
  }, [swapShort]);

  useEffect(() => {
    if (isReady) {
      toast(`Swap long successfully updated.`);
    }
  }, [swapLong]);

  useEffect(() => {
    if (isReady) {
      toast(`Manual swap successfully updated.`);
    }
  }, [manualSwap]);

  useEffect(() => {
    if (isReady) {
      toast(`Contract size multiplier successfully updated.`);
    }
  }, [contractSizeMultiplier]);

  useEffect(() => {
    if (isReady) {
      toast(`Lot size successfully updated.`);
    }
  }, [lotSize]);

  useEffect(() => {
    if (isReady) {
      toast(`Commission successfully updated.`);
    }
  }, [commission]);

  // useEffect(() => {
  //   if (isReady) {
  //     toast(`Swap type successfully updated.`);
  //   }
  // }, [swapType]);

  useEffect(() => {
    if (isReady) {
      toast(`Swap rate type successfully updated.`);
    }
  }, [swapRateType]);

  return (
    <TableRow hover>
      <TableCell align="left">
        <CustomSwitch control={control} name="enabled" />
      </TableCell>
      <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
        {`${item?.base_currency_symbol}-${item?.currency_symbol}`}
      </TableCell>
      <TableCell align="left">
        <Controller
          name="swap_rate_type"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              disabled={!isActive}
              size="small"
              value={value ?? ""}
              onChange={(event) => onChange(event?.target?.value)}
              sx={{ minWidth: 125 }}
            >
              {swapRateTypeList?.map((item) => (
                <MenuItem key={item?.value} value={item?.value}>
                  {item?.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </TableCell>
      <TableCell align="left">
        <OutlinedInput
          disabled={!isActive}
          type="number"
          {...register("swap_short")}
          size="small"
          sx={{ minWidth: 115 }}
        />
      </TableCell>
      <TableCell align="left">
        <OutlinedInput
          disabled={!isActive}
          type="number"
          {...register("swap_long")}
          size="small"
          sx={{ minWidth: 115 }}
        />
      </TableCell>
      <TableCell align="left">
        <OutlinedInput
          disabled={!isActive}
          type="number"
          {...register("commission")}
          size="small"
          sx={{ minWidth: 60 }}
        />
      </TableCell>
      <TableCell align="left">
        <OutlinedInput
          disabled={!isActive}
          type="number"
          {...register("manual_swap")}
          size="small"
          sx={{ minWidth: 60 }}
        />
      </TableCell>
      {/* <TableCell align="left">
        <Controller
          name="swap_type"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              disabled={!isActive}
              size="small"
              value={value ?? ""}
              onChange={(event) => onChange(event?.target?.value)}
              sx={{ minWidth: 180 }}
            >
              {swapTypeList?.map((item) => (
                <MenuItem key={item?.value} value={item?.value}>
                  {item?.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </TableCell> */}
      <TableCell align="left">
        <OutlinedInput
          disabled={!isActive}
          type="number"
          {...register("lot_size")}
          size="small"
          sx={{ minWidth: 130 }}
        />
      </TableCell>
      <TableCell align="left">
        <OutlinedInput
          disabled={!isActive}
          type="number"
          {...register("contract_size_multiplier")}
          size="small"
          sx={{ minWidth: 60 }}
        />
      </TableCell>
      <TableCell align="left">
        <Stack direction="row" gap={2}>
          <Controller
            name="leverage_type"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                disabled={!isActive}
                size="small"
                value={value ?? ""}
                onChange={(event) => onChange(event?.target?.value)}
              >
                {leverageList?.map((item) => (
                  <MenuItem key={item?.value} value={item?.value}>
                    {item?.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name="leverage_amount"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <OutlinedInput
                disabled={!isActive}
                id="leverage_amount"
                size="small"
                onChange={(e) => {
                  let val = parseInt(e?.target?.value, 10);

                  if (val < 0) val = 0;

                  onChange(val);
                }}
                value={value}
                type="number"
                inputProps={{ min: "1", step: "1" }}
                sx={{ minWidth: 100 }}
              />
            )}
            rules={{
              validate: (value) =>
                parseInt(value, 10) > 0 || "Please enter a positive integer",
            }}
          />
        </Stack>
      </TableCell>
      <TableCell align="left">
        <Controller
          name="spread_on"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              disabled={!isActive}
              size="small"
              value={value ?? ""}
              onChange={(event) => onChange(event?.target?.value)}
            >
              {spreadOnList?.map((item) => (
                <MenuItem key={item?.value} value={item?.value}>
                  {item?.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </TableCell>
      <TableCell align="left" sx={{minWidth: 150}}>
        <OutlinedInput
          disabled={!isActive}
          type="number"
          {...register("spread")}
          size="small"
        />
      </TableCell>
      <TableCell align="left">
        <Typography>{item?.current_value?.toFixed(7)}</Typography>
      </TableCell>
      <TableCell align="left" sx={{ backgroundColor:  settings.paletteMode == "dark" ? '#1c2536': 'background.default', border: '1px solid', borderColor: settings.paletteMode == "dark" ? '#111927' : '#9b9393'}}>
        <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <Iconify icon="ion:calculator-outline" sx={{ flex: 'none', width: 22, color: 'info.main'}} />
          <OutlinedInput
            size="small"
            type="number"
            sx={{ minWidth: 80 }}
            disabled={!isActive}
            {...register("margin")}
          />
        </Stack>
      </TableCell>
      <TableCell align="left" sx={{ backgroundColor: settings.paletteMode == "dark" ? '#1c2536': 'background.default' , border: '1px solid', borderColor: settings.paletteMode == "dark" ? '#111927' : '#9b9393'}}>
        <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <Iconify icon="ion:calculator-outline" sx={{ flex: 'none', width: 22, color: 'info.main'}}/>
          <OutlinedInput
            size="small"
            type="number"
            sx={{ minWidth: 80 }}
            disabled={!isActive}
            {...register("leverage")}
          />
        </Stack>
      </TableCell>
      <TableCell align="left" sx={{ backgroundColor:  settings.paletteMode == "dark" ? '#1c2536': 'background.default', border: '1px solid', borderColor: settings.paletteMode == "dark" ? '#111927' : '#9b9393'}}>
        <Typography
          sx={{
            color:
              calculate(margin, leverage, value, spreadValue) > 0
                ? "success.main"
                : "error.main",
          }}
        >
          {calculate(margin, leverage, value, spreadValue)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default SpreadItem;
