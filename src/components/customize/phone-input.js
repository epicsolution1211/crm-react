import 'react-international-phone/style.css';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import {
  defaultCountries,
  FlagEmoji,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';
import React from 'react';
import { Controller } from 'react-hook-form';

const PhoneInput = ({ name, label, control, defaultValue = "", onSelectCountry = () => { }, ...restProps }) => {

  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'us',
      countries: defaultCountries,
      value: defaultValue,
    });

  const handleCountrySelect = (value) => {
    onSelectCountry(value);
    setCountry(value);
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => {
        return (
          <TextField
            label={label}
            color="primary"
            value={phone}
            onChange={(val) => {
              handlePhoneValueChange(val);
              onChange(val?.target?.value?.replace(/[^\d]/g, ''));
            }}
            error={!!error?.message}
            helperText={error?.message}
            type="tel"
            inputRef={inputRef}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  style={{ marginRight: '2px', marginLeft: '-8px' }}
                >
                  <Select
                    MenuProps={{
                      style: {
                        height: '300px',
                        width: '360px',
                        top: '10px',
                        left: '-34px',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                    sx={{
                      width: 'max-content',
                      fieldset: {
                        display: 'none',
                      },
                      '&.Mui-focused:has(div[aria-expanded="false"])': {
                        fieldset: {
                          display: 'block',
                        },
                      },
                      // Update default spacing
                      '.MuiSelect-select': {
                        padding: '8px',
                        paddingRight: '24px !important',
                      },
                      svg: {
                        right: 0,
                      },
                    }}
                    value={country}
                    onChange={(e) => handleCountrySelect(e.target.value)}
                    renderValue={(value) => (
                      <FlagEmoji iso2={value}
                        style={{ display: 'flex' }} />
                    )}
                  >
                    {defaultCountries.map((c) => {
                      const country = parseCountry(c);
                      return (
                        <MenuItem key={country.iso2}
                          value={country.iso2}>
                          <FlagEmoji
                            iso2={country.iso2}
                            style={{ marginRight: '8px' }} />
                          <Typography marginRight="8px">{country.name}</Typography>
                          <Typography color="gray">+{country.dialCode}</Typography>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </InputAdornment>
              ),
            }}
            {...restProps} />
        );
      }}
    />
  );
};

export default PhoneInput
