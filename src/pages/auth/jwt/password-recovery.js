import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { toast } from "react-hot-toast";
import { authApi } from "src/api/auth";
import { useSearchParams } from "src/hooks/use-search-params";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from 'src/components/iconify';

const initialValues = {
  password: "",
  passwordConfirm: "",
};

const validationSchema = Yup.object({
  password: Yup.string().min(6).max(255).required("Password is required"),
  passwordConfirm: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [disabledButton, setDisabledButton] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (data) => {
      try {
        setDisabledButton(true);
        await authApi.recoverPassword(
          { password: data?.password },
          params.get("token")
        );
        toast.success("Password successfully updated!");
        setDisabledButton(false);
        router.push(paths.auth.jwt.login);
      } catch (error) {
        setDisabledButton(false);
        toast.error(error?.response?.data?.message);
      }
    },
  });

  return (
    <>
      <Seo title="Password recovery" />
      <div>
        <Box sx={{ mb: 4 }}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={paths.dashboard.index}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Dashboard</Typography>
          </Link>
        </Box>
        <Stack sx={{ mb: 4 }} spacing={1}>
          <Typography variant="h5">Password recovery</Typography>
        </Stack>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              autoFocus
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
            />
            <TextField
              autoFocus
              error={
                !!(
                  formik.touched.passwordConfirm &&
                  formik.errors.passwordConfirm
                )
              }
              fullWidth
              helperText={
                formik.touched.passwordConfirm && formik.errors.passwordConfirm
              }
              label="Password Confirm"
              name="passwordConfirm"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.passwordConfirm}
            />
          </Stack>
          <Button
            disabled={disabledButton}
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            type="submit"
            variant="contained"
          >
            Confirm
          </Button>
        </form>
      </div>
    </>
  );
};

export default Page;
