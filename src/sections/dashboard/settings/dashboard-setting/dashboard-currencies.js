import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";

import { Iconify } from 'src/components/iconify';
import { brandsApi } from "src/api/lead-management/brand";

export const currencyFlagMap = {
  1: 'circle-flags:us',
  2: 'circle-flags:european-union', 
  3: 'circle-flags:uk',
  4: 'circle-flags:ca',
  5: 'circle-flags:au',
  6: 'circle-flags:ae',
  7: 'circle-flags:in'
};

const CurrencyItem = ({ currency, control, onSwitchChange, fieldValues, isLoading }) => {
  return (
    <Controller
      name={currency?.name ?? ""}
      control={control}
      render={({ field: { onChange, value = false } }) => (
        <Stack
          direction='column'
          alignItems='flex-start'
          justifyContent='center'
        >
          <Stack direction="row" justifyContent='space-between' alignItems='center' minWidth={200} minHeight={38}>
            <Tooltip title={currency?.description}>
              <Stack px={1} direction='row' alignItems='center' gap={1}>
                <Iconify icon={currencyFlagMap?.[currency?.key]} />
                {currency?.name ?? ""} ({currency?.symbol ?? ""})
              </Stack>
            </Tooltip>
            {isLoading ? (
              <Skeleton variant="circular" height={30} width={30} />
            ) : (
              <Tooltip title={value ? `Disable ${currency?.description}` : `Enable ${currency?.description}`}>
                <Switch checked={value ?? false}
                onChange={(event) => {
                  onSwitchChange({ ...fieldValues, [currency?.name]: event?.target?.checked }),
                    onChange(event?.target?.checked);
                } } />
              </Tooltip>
            )}
          </Stack>
        </Stack>
      )} />
  );
}

export const DashboardCurrencies = ({ brandId, brand, getBrands, isLoading = false }) => {
  const { watch, control, setValue, reset } = useForm();
  
  const availableCurrencies = useMemo(() => {
    return brand?.available_currencies ? Object.values(brand.available_currencies) : [];
  }, [brand?.available_currencies]);

  const enabledCurrencies = useMemo(() => {
    return brand?.enabled_currencies ? JSON.parse(brand.enabled_currencies)?.map((currency) => parseInt(currency)) : null;
  }, [brand?.enabled_currencies]);

  const handleCurrencyUpdate = async (data) => {
    const currencyKeys = availableCurrencies
      .filter((currency) => data[currency.name] === true)
      .map((currency) => currency.key);
    try {
      const request = {
        enabled_currencies: JSON.stringify(currencyKeys),
      };
      await brandsApi.updateInternalBrand(brandId, request);
      toast.success("Currencies successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if(enabledCurrencies) {
      availableCurrencies.forEach((currency) => {
        if(enabledCurrencies.includes(currency.key)) {
          setValue(currency.name, true);
        } else {
          setValue(currency.name, false);
        }
      });
    } else {
      availableCurrencies.forEach((currency) => {
        setValue(currency.name, currency.default ?? false);
      });
    }
  }, [enabledCurrencies, availableCurrencies])

  useEffect(() => {
    reset();
    getBrands();
    
    return () => {
      getBrands();
    }
  }, [])

  const fields = watch();
  return (
    <Stack direction="column" justifyContent='flex-end' width={1} p={3} gap={4}>
      <Typography variant="h6" px={1.5}>Currency Settings</Typography>
      <Stack direction="column" justifyContent='flex-start' gap={2} width={1}>
        {availableCurrencies.map((currency) => (
          <CurrencyItem
            key={currency?.key}
            currency={currency}
            fieldValues={fields}
            sidebarWatch control={control}
            isLoading={isLoading}
            onSwitchChange={(data) => handleCurrencyUpdate(data)} />
        ))}
      </Stack>
    </Stack>
  );
};
