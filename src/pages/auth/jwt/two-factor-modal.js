import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authApi } from "src/api/auth";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import * as yup from "yup";

const validationSchema = yup.object({
  otp_code: yup.string().required("Verification code is required!"),
});

export const TwoFactorModal = ({ open, onClose, companyId, companyInfo }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(validationSchema) });
  const { email, password, signIn } = useAuth();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      

      const companies = await authApi.getCompanies({
        company_id: companyId,
        otp_code: data?.otp_code,
        email,
        password,
      });
      const company = companies?.find(({ company }) => company?.id == companyId);
      const lastPage = localStorage.getItem("last_page");
      const existingCompanies = localStorage.getItem("tenants") ? JSON.parse(localStorage.getItem("tenants")) : [];
      
      const modifiedCompanies = companies?.map(c => {
        if (c?.company?.id === companyId) {
          return {
            ...c,
            otp_used: true,
            server_url: companyInfo?.server_url,
            server_code: companyInfo?.server_code,
          }
        } else {
          return {
            ...c,
            server_url: companyInfo?.server_url,
            server_code: companyInfo?.server_code,
          };
        }
      })

      const allCompanies = [...modifiedCompanies, ...existingCompanies];
      const dispatchCompanies = allCompanies.filter((company, index, self) =>
        index === self.findIndex(
          c => c.server_code === company.server_code && c.company.id === company.company.id
        )
      );

      if (modifiedCompanies?.length > 0) {
        localStorage.setItem("tenants", JSON.stringify(dispatchCompanies));
      }
      if (company) {
        await signIn(company);
        if (lastPage) {
          router.push(lastPage);
        } else {
          router.push(paths.dashboard.index);
        }
      }
      onClose();
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Container maxWidth="sm">
        <Stack p={7} spacing={5}>
          <Typography variant="h5">Send verification code</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack alignItems="center" spacing={5}>
              <TextField
                fullWidth
                autoFocus
                error={!!errors?.otp_code?.message}
                helperText={errors?.otp_code?.message}
                label="Verification code"
                name="otp_code"
                type="text"
                {...register("otp_code")}
              />

              <Button type="submit" variant="contained">
                Send
              </Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Dialog>
  );
};
