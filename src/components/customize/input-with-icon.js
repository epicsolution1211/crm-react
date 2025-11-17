import * as React from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';


const InputWithIcon = ({ iconComponent, name, control, disabled }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value = 0, onChange } }) => (
        <Box sx={{ '& > :not(style)': { m: 1 }, width: '100%' }} >
          <TextField
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event?.target?.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"
                  sx={{
                    paddingX: 1,
                    backgroundColor: 'action.hover',
                    height: 1,
                    maxHeight: 35
                  }}>
                  {iconComponent}
                </InputAdornment>
              ),
              sx: {
                paddingLeft: 0,
                height: 35,
                width: 1,
                overflow: 'hidden'
              }
            }}
            variant="outlined"
          />
        </Box>
      )} />
  );
}
export default InputWithIcon
