import React from 'react'

import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

const MuiDatePicker = ({ name, label, control, disabled = false, defaultNull = false }) => {

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value = format(new Date(), 'yyyy-MM-dd') } }) => {
        return (
          <DatePicker
            sx={{ width: 1 }}
            format="dd/MM/yyyy"
            label={label}
            disabled={disabled}
            value={value ? new Date(value) : defaultNull ? null : new Date()}
            onChange={(val) => onChange(format(val, 'yyyy-MM-dd'))}
          />
        );
      }}
    />
  )
}

export default MuiDatePicker