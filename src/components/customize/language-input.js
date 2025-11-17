import React from 'react'
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { languages } from 'src/utils/constant';

const LanguageInput = ({ name, control }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }}) => (
        <Autocomplete
          options={languages}
          value={languages?.find((item) => (item?.code === value)) ?? { name: '', code: '' }}
          onChange={(event, value) => onChange(value?.code)}
          autoHighlight
          getOptionLabel={(option) => option.name?.split(" - ")[0]}
          renderOption={(props, option) => (
            <Box component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}>
              {option.name?.split(" - ")[0]}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Language"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />)}
    />
  )
}

export default LanguageInput