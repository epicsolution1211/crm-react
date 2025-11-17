import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useAuth } from "src/hooks/use-auth";

const validationSchema = yup.object({
  name: yup.string().required("Name is required field."),
});

export const BankBasic = ({ bankProvider, updateBankProvider }) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    updateBankProvider(bankProvider?.id, data);
  };

  useEffect(() => {
    setValue("name", bankProvider?.name);
    setValue("bic", bankProvider?.bic);
  }, [bankProvider]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Box
          sx={{
            maxWidth: "md",
          }}
        >
          <CardHeader title="Bank Provider" />
          <Stack direction="column" justifyContent="space-between">
            <Stack sx={{ px: 3 }}>
              <Typography variant="subtitle2" sx={{ p: 1 }}>
                Name
              </Typography>
              <TextField
                hiddenLabel
                error={!!errors?.name?.message}
                helperText={errors?.name?.message}
                {...register("name")}
              />
            </Stack>
            <Stack sx={{ px: 3 }}>
              <Typography variant="subtitle2" sx={{ p: 1 }}>
                BIC
              </Typography>
              <TextField
                hiddenLabel
                error={!!errors?.bic?.message}
                helperText={errors?.bic?.message}
                {...register("bic")}
              />
            </Stack>
            <CardActions
              sx={{ display: "flex", justifyContent: "end", p: 3, pb: 5 }}
            >
              <Button variant="outlined" type="submit" disabled={!user?.acc?.acc_e_audit_bank}>
                Update
              </Button>
            </CardActions>
          </Stack>
        </Box>
      </Card>
    </form>
  );
};
