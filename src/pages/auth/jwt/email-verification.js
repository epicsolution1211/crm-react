import * as Yup from "yup";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { paths } from "src/paths";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authApi } from "src/api/auth";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { toast } from "react-hot-toast";

const validationSchema = Yup.object({
  firstName: Yup.string().max(255).required("First name is required"),
  lastName: Yup.string().max(255).required("Last name is required"),
  password: Yup.string().max(255).required("Password is required"),
});

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [disabledButton, setDisabledButton] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset();
  }, []);

  usePageView();

  const handleVerify = async (data = {}) => {
    setDisabledButton(true);
    const token = searchParams.get("token");
    const request = {
      first_name: data?.firstName,
      last_name: data?.lastName,
      token,
    };
    if (data.password) request.password = data.password;

    const response = await authApi.verifyEmail(request);
    toast.success("Your email successfully verified!");
    setDisabledButton(false);
    if (response) {
      router.push(paths.auth.jwt.login);
    }
  };

  return (
    <>
      <Seo title="Email verification" />
      <form onSubmit={handleSubmit(handleVerify)}>
        <Card>
          <CardHeader title="Email verification" />
          <CardContent
            sx={{ display: "flex", gap: 2, flexDirection: "column" }}
          >
            <Stack spacing={1}>
              <Typography variant="h7">First name</Typography>
              <TextField
                fullWidth
                label="First name"
                name="firstName"
                error={!!errors?.firstName?.message}
                helperText={errors?.firstName?.message}
                {...register("firstName")}
                type="text"
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h7">Last name</Typography>
              <TextField
                label="Last name"
                name="lastName"
                error={!!errors?.lastName?.message}
                helperText={errors?.lastName?.message}
                {...register("lastName")}
                type="text"
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h7">Password</Typography>
              <TextField
                label="Password"
                name="password"
                error={!!errors?.password?.message}
                helperText={errors?.password?.message}
                {...register("password")}
                type="password"
              />
            </Stack>

            <Stack>
              <Button
                disabled={disabledButton}
                variant="contained"
                type="submit"
              >
                Verify
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default Page;
