import React from 'react'
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';

const CustomSwitch = ({ label, control, name, disabled = false, justifyContent = 'center', labelPosition = 'left' }) => {

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value = false } }) => (
        <Stack
          alignItems='center'
          justifyContent={justifyContent}
          sx={{
            flexDirection: labelPosition === 'left' ? 'row' : 'row-reverse',
          }}
        >
          {label && 
          <Typography
            variant='subtitle2'
            sx={{
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Typography>
          }
          <Switch disabled={disabled} checked={value ?? false}
            onChange={(event) => onChange(event?.target?.checked)} />
        </Stack>
      )} />
  )
}

export default CustomSwitch