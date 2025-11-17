import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import { useGetCompanyNumbers } from "../customer/customer-otp-phones";

export const ChatSmsInput = (props) => {
  const {
    body,
    disabled,
    handleChange,
    handleEnter,
    senderPhone,
    setSenderPhone,
  } = props;
  const { numbers, coperatoDefault } = useGetCompanyNumbers();

  return (
    <Stack spacing={1} alignItems="center" sx={{ width: 1 }}>
      {coperatoDefault ? (
        <FormControl sx={{ width: 1 }}>
          <InputLabel id="sender-sms-label">Send from</InputLabel>
          <Select
          id="sender-sms"
          labelId="sender-sms-label"
          value={senderPhone}
          onChange={(event) => setSenderPhone(event?.target?.value)}
          sx={{ width: 1 }}
          label="Send from"
          size="small"
        >
          {numbers?.map(number => ({ label: number, value: number }))?.map((number) => (
            <MenuItem key={number?.value} value={number?.value}>
              {number?.label}
            </MenuItem>
          ))}
          </Select>
        </FormControl>
      ) : null}

      <OutlinedInput
        disabled={disabled}
        fullWidth
        multiline
        onChange={handleChange}
        onKeyDown={handleEnter}
        placeholder="Leave a message"
        size="small"
        value={body}
      />
    </Stack>
  );
};
