import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { customersApi } from "src/api/customers";

const currencyOption = [
  {
    value: 1,
    label: 'Dollar',
    icon: 'circle-flags:us',
  },
  {
    value: 2,
    label: 'Euro',
    icon: 'circle-flags:european-union',
  },
  {
    value: 3,
    label: 'Pound',
    icon: 'circle-flags:uk',
  },
  {
    value: 4,
    label: 'Canadian Dollar',
    icon: 'circle-flags:ca',
  },
  {
    value: 5,
    label: 'Australian Dollar',
    icon: 'circle-flags:au',
  },
];

export const AffiliateTradingAccount = ({ affiliate, updateAffiliate }) => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [affiliateTradingAccount, setAffiliateTradingAccount] = useState();

  const handleUpdateAffiliate = async (data) => {
    try {
      updateAffiliate(affiliate?.id, data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleCustomerAndAccountTypeGet = async () => {
    const accountTypesResponse = await customersApi.getAccountTypes();
    setAccountTypes(accountTypesResponse?.account_types);
  };

  useEffect(() => {
    handleCustomerAndAccountTypeGet();
  }, []);

  useEffect(() => {
    if (affiliate?.aff_trading_account_id) {
      setAffiliateTradingAccount(affiliate?.aff_trading_account_id);
    }
  }, [affiliate]);

  return (
    <>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
          sx={{ pt: 4, px: 4, pb: 2 }}
        >
          <Typography variant="h5">Trading Account</Typography>
        </Stack>
        <CardContent>
          <Stack direction="column" gap={2}>
            <Stack direction="column" spacing={1}>
              <Typography px={1} variant="subtitle1">Account type</Typography>
              <Select
                value={affiliateTradingAccount + ""}
                onChange={(event)=> handleUpdateAffiliate({ aff_trading_account_id: event?.target?.value })}
                fullWidth
              >
                {accountTypes?.map((accountType) => (
                  <MenuItem
                    key={accountType?.id}
                    value={accountType?.id}
                  >
                    {accountType?.name}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack spacing={1}>
              <Typography px={1} variant="subtitle1">Currency</Typography>
              <Select
                fullWidth
                value={affiliate?.aff_currency ?? 1}
                onChange={(event)=> handleUpdateAffiliate({ aff_currency : event?.target?.value })}
              >
                {currencyOption?.map((item) => (
                  <MenuItem
                    key={item?.value}
                    value={item?.value}
                    sx={{ display: item?.isHidden ? "none" : "" }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Iconify icon={item.icon} width={24} />
                      <Typography>{item?.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
