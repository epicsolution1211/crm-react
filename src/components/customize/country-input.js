import React from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { countries } from '../../utils/constant';
import { Controller } from 'react-hook-form';

const CountryInput = ({ name, label, control, defaultCountry = {
  code: '',
  label: '',
  phone: '',
  suggested: '',
}, ...restProps }) => {

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <Autocomplete
            options={countries}
            autoHighlight
            value={countries?.find((item) => (item?.code === value)) ??
              defaultCountry}
            onChange={(event, value) => onChange(value?.code)}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box component="li"
                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                {...props}>
                <img
                  loading="lazy"
                  width="20"
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  alt=""
                />
                {option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                inputProps={{
                  ...params.inputProps,
                }}
                error={!!error?.message}
                helperText={error?.message}
              />
            )}
            {...restProps}
          />
        );
      }}
    />
  )
}

export default CountryInput
