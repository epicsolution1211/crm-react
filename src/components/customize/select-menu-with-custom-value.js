import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

export const SelectMenuWithCustomValue = ({
  list = [],
  control,
  name,
  label,
  disabled = false,
  ...other
}) => {
  return (
    <Box sx={{ width: 1, display: "flex", gap: 1, flexDirection: "column" }} {...other}>
      {label && <Typography px={1}>{label}</Typography>}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <Select
              fullWidth
              disabled={disabled}
              error={!!error?.message}
              value={value ?? ""}
              onChange={(event) => onChange(event?.target?.value)}
              renderValue={(selected) => {
                const found = list.find((v) => v.value === selected);
                return found ? (found.title ?? found.label) : selected;
              }}
            >
              {list.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.title ?? item.label}
                </MenuItem>
              ))}
            </Select>
            {!!error?.message && (
              <FormHelperText sx={{ px: 2, mt: "-2px" }} error={!!error?.message}>
                {error?.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </Box>
  );
}; 