import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import { Iconify } from 'src/components/iconify';
import { authApi } from "src/api/auth";

export const SettingsMemberEditPassword = (props) => {
  const {
    handleSubmit,
    register,
  } = useForm();
  const [hiddenPassword, setHiddenPassword] = useState(true);

  const onSubmit = async (data) => {
    try {
      await authApi.updatePassword({
        account_id: props?.member?.id,
        password: data?.password,
      });
      toast.success("Password successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <Card
      sx={{
        '&.MuiCard-root': {
          boxShadow: 'none',
        }
      }}>
      <CardHeader title="Update password" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Stack spacing={2} sx={{ width: "300px" }}>
            <Typography>Set new password:</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TextField
                label="New password"
                name="password"
                type={hiddenPassword ? "password" : "text"}
                {...register("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setHiddenPassword(!hiddenPassword)}
                        sx={{ '&:hover': { color: 'primary.main' }, color: 'text.disabled' }}
                      >
                        <Iconify icon={!hiddenPassword ? 'fluent:eye-32-filled' : 'fluent:eye-off-16-filled'}/>
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ minWidth: 300 }}
              />
            </Stack>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end", p: 3 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};
