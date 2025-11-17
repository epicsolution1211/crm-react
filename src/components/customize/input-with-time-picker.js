import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Controller } from 'react-hook-form';
import { format } from 'date-fns';

const InputWithTimePicker = ({ name, control, disabled, onlyTime = false, defaultNull = false }) => {

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TimePicker views={['hours', 'minutes']}
          format="HH:mm"
          sx={{ py: 0, my: 1, height: 35, px: '8px', mb: 1 }}
          disableIgnoringDatePartForTimeValidation
          value={value ? new Date(value) : defaultNull ? null : new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0, 0)}
          disabled={disabled}
          onChange={(val) => {
            if (val) {
              if (onlyTime) {
                onChange(format(new Date(val), 'HH:mm'));
              } else {
                onChange(format(new Date(val), 'yyyy-MM-dd HH:mm'));
              }
            }
          }}
          slotProps={{
            textField: {
              hiddenLabel: true
            },
          }} />
      )}
    />
  );
}
export default InputWithTimePicker


