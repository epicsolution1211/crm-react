import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Unstable_Grid2";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import { userApi } from "src/api/user";
import { toast } from "react-hot-toast";
import { paths } from "src/paths";
import { RouterLink } from "src/components/router-link";

const validationSchema = yup.object({
  full_name: yup.string().required("Full name is required"),
  contact_details: yup.string().required("Contact details is required"),
  message: yup.string().required("Message is required"),
  service: yup.string().required("Service is required"),
  server_ip: yup.string().required("Serve Ip is required"),
});

export const CustomerCareForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    try {
      await userApi.contactUs({ ...data, form_type: "customer_care" });
      toast.success("Form successfully sent!");
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} sm={12}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              Full Name
            </FormLabel>
            <OutlinedInput
              name="full_name"
              error={!!errors?.full_name?.message}
              {...register("full_name")}
            />
            <FormHelperText sx={{ color: "red" }}>
              {errors?.full_name?.message}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid xs={12} sm={12}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              Contact Detail
            </FormLabel>
            <OutlinedInput
              name="contact_details"
              error={!!errors?.contact_details?.message}
              {...register("contact_details")}
            />
            <FormHelperText sx={{ color: "red" }}>
              {errors?.contact_details?.message}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              Service
            </FormLabel>
            <OutlinedInput
              name="contact_details"
              error={!!errors?.service?.message}
              {...register("service")}
            />
            <FormHelperText sx={{ color: "red" }}>
              {errors?.service?.message}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              Server Ip
            </FormLabel>
            <OutlinedInput
              name="server_ip"
              error={!!errors?.server_ip?.message}
              {...register("server_ip")}
            />
            <FormHelperText sx={{ color: "red" }}>
              {errors?.server_ip?.message}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid xs={12}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              Message *
            </FormLabel>
            <OutlinedInput
              fullWidth
              name="message"
              multiline
              rows={6}
              error={!!errors?.message?.message}
              {...register("message")}
            />
            <FormHelperText sx={{ color: "red" }}>
              {errors?.message?.message}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
        }}
      >
        <Button fullWidth size="large" variant="contained" type="submit">
          Submit your order
        </Button>
      </Box>
      <Typography color="text.secondary" sx={{ mt: 3 }} variant="body2">
        By submitting this, you agree to the{" "}
        <Link
          component={RouterLink}
          color="text.primary"
          href={paths.home.privatePolicy}
          underline="always"
          variant="subtitle2"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          component={RouterLink}
          color="text.primary"
          href={paths.home.cookiePolicy}
          underline="always"
          variant="subtitle2"
        >
          Cookie Policy
        </Link>
        .
      </Typography>
    </form>
  );
};
