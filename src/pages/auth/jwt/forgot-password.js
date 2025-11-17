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
import { Iconify } from 'src/components/iconify';

const initialValues = {
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
});

const Page = () => {
  const [isSent, setIsSent] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (data) => {
      try {
        await authApi.sendRecoveryEmail(data);
        setIsSent(true);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  return (
    <>
      <Seo title="Forgot Password" />
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
          <Typography variant="h5">Forgot password</Typography>
        </Stack>
        {isSent ? (
          <Typography variant="h6">
            We've sent a link with instructions on your email
          </Typography>
        ) : (
          <form noValidate onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              error={!!(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
            />
            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              Send reset link
            </Button>
          </form>
        )}
      </div>
    </>
  );
};

export default Page;
