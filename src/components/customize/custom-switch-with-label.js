import React from 'react'
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { Controller } from 'react-hook-form';

const CustomSwitchWithLabelInfo = ({ label, control, name, info, disabled = false, onSwitchChange, fieldValues, justifyContent = 'center' }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value = false } }) => (
      <Stack
        direction='column'
        alignItems='flex-start'
        justifyContent={justifyContent}
      >
        <Stack direction="row" spacing={0.5}>
          <Typography variant="subtitle1" px={1}>
            {label ?? ""}
          </Typography>
          <Tooltip
            title={<Typography variant="subtitle2">
              {info ?? ""}
            </Typography>}
          >
            <InfoOutlined sx={{ cursor: "pointer", color: "#2993f0" }} />
          </Tooltip>
        </Stack>
        <Switch disabled={disabled} checked={value ?? false}
          onChange={(event) => {
            onSwitchChange({...fieldValues, [name]: event?.target?.checked}),
            onChange(event?.target?.checked);
          }}
        />
      </Stack>
    )} />
)

export default CustomSwitchWithLabelInfo