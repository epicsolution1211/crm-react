import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { Iconify } from 'src/components/iconify';
import { userApi } from 'src/api/user';

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 1,
    },
  },
};

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

export const CurrencySetting = ({currency, refreshUser, userId}) => {
  const [userCurrency, setUserCurrency] = useState(false);

  const handleUpdateCurrency = async (value) => {
    setUserCurrency(value);
    try {
      await userApi.updateUser(userId, { currency: value });
      toast.success("Currency successfully updated!");
      setTimeout(() => {
        refreshUser();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    setUserCurrency(currency)
  }, [currency])
  
  return (
    <Stack
      alignItems="flex-start"
      direction="row"
      justifyContent="space-between"
      spacing={3}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle1">
          Default Currency
        </Typography>
        <Stack sx={{width: 300}}>
          <Select
            fullWidth
            value={userCurrency}
            onChange={(event) => handleUpdateCurrency(event?.target?.value)}
            MenuProps={MenuProps}
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
  </Stack>
  )
};
