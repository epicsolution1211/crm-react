import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuth } from "src/hooks/use-auth";

const validationSchema = yup.object({
  full_name: yup.string().required("Name is required field."),
  email: yup.string().email("Email must be a valid email."),
  // phone_number: yup.string().matches(phoneRegExp, 'Phone must be a valid phone number.')
});

export const AffiliateBasic = ({ affiliate, updateAffiliate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    updateAffiliate(affiliate?.id, data);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (affiliate) {
      ["full_name", "email", "phone_number", "telegram"].forEach((item) => {
        setValue(item, affiliate[item]);
      });
    }
  }, [affiliate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Box
          sx={{
            maxWidth: "md",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
            sx={{ pt: 4, px: 3, pb: 2 }}
          >
            <Typography variant="h5">Affiliate Basic</Typography>
          </Stack>
          <Stack sx={{ px: 3 }}>
            <Typography variant="subtitle2" sx={{ p: 1 }}>
              Name
            </Typography>
            <TextField
              hiddenLabel
              error={!!errors?.name?.message}
              helperText={errors?.name?.message}
              {...register("full_name")}
            />
          </Stack>
          <Stack sx={{ px: 3 }}>
            <Typography variant="subtitle2" sx={{ p: 1 }}>
              Email
            </Typography>
            <TextField
              hiddenLabel
              error={!!errors?.email?.message}
              helperText={errors?.email?.message}
              {...register("email")}
            />
          </Stack>
          <Stack sx={{ px: 3 }}>
            <Typography variant="subtitle2" sx={{ p: 1 }}>
              Phone
            </Typography>
            <TextField
              hiddenLabel
              error={!!errors?.phone_number?.message}
              helperText={errors?.phone_number?.message}
              {...register("phone_number")}
            />
          </Stack>
          <Stack sx={{ px: 3 }}>
            <Typography variant="subtitle2" sx={{ p: 1 }}>
              Telegram
            </Typography>
            <TextField hiddenLabel {...register("telegram")} />
          </Stack>
          <CardActions sx={{ display: "flex", justifyContent: "end", p: 2 }}>
            <Button
              disabled={isLoading || !user?.acc?.acc_e_lm_aff}
              variant="outlined"
              type="submit"
            >
              Update
            </Button>
          </CardActions>
        </Box>
      </Card>
    </form>
  );
};
