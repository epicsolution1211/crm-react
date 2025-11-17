import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { Iconify } from 'src/components/iconify';
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { getAppVersion } from "src/utils/version";

const initialValues = {
  email: "",
  password: "",
  server_id: "",
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .max(255)
    .required("Email or User Name is required"),
  password: Yup.string().max(255).required("Password is required"),
  server_id: Yup.string().required("Server ID is required"),
});

const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { getCompanies } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await getCompanies(values.email, values.password, values.server_id);

        if (isMounted()) {
          router.push(paths.auth.jwt.companies);
        }
      } catch (err) {
        console.error('error: ', err);
      }
    },
  });

  useEffect(() => {
    const notAllowedDomains = ["octolit.com"];
    const hostname = window?.location?.hostname;

    if (notAllowedDomains.includes(hostname)) {
      router.push("/");
    }
  }, [router]);

  usePageView();

  return (
    <>
      <Seo title="Login" />
      <div>
        <Card elevation={16}>
          <CardContent>
            <Stack sx={{ mb: 4 }} spacing={1}>
              <Typography variant="h5">Sign in</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email or User Name"
                  name="email"
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onChange={formik.handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={()=> setShowPassword(prev=> !prev)} edge="end" color="primary">
                          <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  autoFocus
                  error={!!(formik.touched.server_id && formik.errors.server_id)}
                  fullWidth
                  helperText={formik.touched.server_id && formik.errors.server_id}
                  label="Server ID"
                  name="server_id"
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.server_id}
                />
              </Stack>
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
              >
                Log In
              </Button>
            </form>

            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.auth.jwt.forgotPassword}
              sx={{
                alignItems: "center",
                display: "inline-flex",
                mt: 1,
              }}
              underline="hover"
            >
              <Typography variant="subtitle2">Forgot password?</Typography>
            </Link>
          </CardContent>
        </Card>
        
        {/* Version Display */}
        <Typography 
          variant="caption" 
          sx={{ 
            textAlign: 'center',
            display: 'block',
            mt: 2,
            color: 'text.secondary',
            opacity: 0.7
          }}
        >
          Version {getAppVersion()}
        </Typography>
      </div>
    </>
  );
};

export default Page;
