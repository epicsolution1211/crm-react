import { useCallback, useState } from "react";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Unstable_Grid2";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import { phoneRegExp } from "src/utils/constant";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import { userApi } from "src/api/user";
import { toast } from "react-hot-toast";
import { paths } from "src/paths";
import { RouterLink } from "src/components/router-link";

const validationSchema = yup.object({
  full_name: yup.string().required("Full name is required"),
  company_name: yup.string().required("Company name is required"),
  work_email: yup.string().email().required("Work email is required"),
  phone_number: yup
    .string()
    .matches(phoneRegExp, "Phone must be a valid phone number.")
    .required("Phone number is required"),
  message: yup.string().required("Message is required"),
});

export const ContactUsForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [companySize, setCompanySize] = useState("1-10");

  const onSubmit = useCallback(
    async (data) => {
      try {
        await userApi.contactUs({ ...data, company_size: companySize, form_type: "contact_us" });
        toast.success("Form successfully sent!");
        reset();
        setCompanySize("1-10");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },
    [companySize]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              Full Name *
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
        <Grid xs={12} sm={6}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              Company Name*
            </FormLabel>
            <OutlinedInput
              name="company_name"
              error={!!errors?.company_name?.message}
              {...register("company_name")}
            />
            <FormHelperText sx={{ color: "red" }}>
              {errors?.company_name?.message}
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
              Work Email *
            </FormLabel>
            <OutlinedInput
              name="email"
              type="email"
              error={!!errors?.work_email?.message}
              {...register("work_email")}
            />
            <FormHelperText sx={{ color: "red" }}>
              {errors?.work_email?.message}
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
              Phone Number *
            </FormLabel>
            <OutlinedInput
              name="phone_number"
              type="tel"
              error={!!errors?.phone_number?.message}
              {...register("phone_number")}
            />
            <FormHelperText sx={{ color: "red" }}>
              {errors?.phone_number?.message}
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
              Company Size
            </FormLabel>
            <Select
              fullWidth
              value={companySize}
              onChange={(event) => setCompanySize(event?.target?.value)}
            >
              <MenuItem value="1-10">1-10</MenuItem>
              <MenuItem value="11-20">11-20</MenuItem>
              <MenuItem value="21-30">21-30</MenuItem>
              <MenuItem value="31-50">31-50</MenuItem>
            </Select>
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
          Let&apos;s Talk
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
