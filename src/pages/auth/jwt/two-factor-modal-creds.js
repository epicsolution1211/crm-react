import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authApi } from "src/api/auth";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import * as yup from "yup";
import { thunks as customerThunk } from "src/thunks/customers";
import { updateBaseURL } from "src/utils/request";

const validationSchema = yup.object({
  otp_code: yup.string().required("Verification code is required!"),
  password: yup.string().max(255).required("Password is required"),
});

export const TwoFactorModalCreds = ({
  open,
  onClose,
  companyId,
  companyInfo,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(validationSchema) });
  const { signIn, initialize, user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const currentServerUrl = localStorage.getItem("server_url");
      const companyServerUrl = companyInfo?.server_url;
      if (currentServerUrl !== companyServerUrl) {
        localStorage.setItem("server_url", companyServerUrl);
        updateBaseURL(companyServerUrl);
      }

      const companies = await authApi.getCompanies({
        company_id: companyId,
        otp_code: data?.otp_code,
        email: companyInfo?.account?.email || user?.email,
        password: data?.password,
      });

      const lastPage = localStorage.getItem("last_page");

      const company = companies?.find(
        ({ company }) => company?.id == companyId
      );

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

        const account = company?.account;

        let redirect = "#";

        if (account?.acc?.acc_v_overview === true || undefined) {
          redirect = paths.dashboard.index;
        } else if (account?.acc?.acc_v_client === true || undefined) {
          redirect = paths.dashboard.customers.index;
        } else if (account?.acc?.acc_v_agents === true || undefined) {
          redirect = paths.dashboard.agents;
        } else if (account?.acc?.acc_v_chat === true || undefined) {
          redirect = paths.dashboard.internalChat;
        } else if (account?.acc?.acc_v_lm_leads === true || undefined) {
          redirect = paths.dashboard.lead.status.index;
        } else if (account?.acc?.acc_v_lm_aff === true || undefined) {
          redirect = paths.dashboard.lead.affiliate.index;
        } else if (account?.acc?.acc_v_lm_brand === true || undefined) {
          redirect = paths.dashboard.lead.brands.index;
        } else if (account?.acc_v_lm_list === true || undefined) {
          redirect = paths.dashboard.lead.injection.index;
        } else if (account?.acc?.acc_v_lm_offer === true || undefined) {
          redirect = paths.dashboard.lead.offers.index;
        } else if (account?.acc?.acc_v_risk_management === true || undefined) {
          redirect = paths.dashboard.risk.positions;
        } else if (account?.acc?.acc_v_logs === true || undefined) {
          redirect = paths.dashboard.log;
        } else if (account?.acc?.acc_v_audit_merchant === true || undefined) {
          redirect = paths.dashboard.paymentAudit.merchant.index;
        } else if (account?.acc?.acc_v_audit_bank === true || undefined) {
          redirect = paths.dashboard.paymentAudit.bankProvider.index;
        } else if (
          account?.acc?.acc_v_audit_payment_type === true ||
          undefined
        ) {
          redirect = paths.dashboard.paymentAudit.paymentType.index;
        } else if (account?.acc?.acc_v_audit_tasks === true || undefined) {
          redirect = paths.dashboard.paymentAudit.validationRules.index;
        } else if (account?.acc?.acc_v_audit_data === true || undefined) {
          redirect = paths.dashboard.paymentAudit.dataEntry.index;
        } else if (account?.acc?.acc_v_article === true || undefined) {
          redirect = paths.dashboard.article.index;
        } else if (account?.acc?.acc_v_settings === true || undefined) {
          redirect = paths.dashboard.settings;
        } else if (account?.acc?.acc_v_reports === true || undefined) {
          redirect = paths.dashboard.reports;
        } else if (lastPage) {
          redirect = lastPage;
        } else {
          redirect = paths.dashboard.index;
        }

        router.push(redirect);
        setTimeout(() => {
          initialize();
          dispatch(customerThunk.resetAll());
        }, 1000);
        // if (withReload) window.location.reload();
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
                error={!!errors?.password?.message}
                helperText={errors?.password?.message}
                label="Password"
                name="password"
                type="password"
                {...register("password")}
              />

              <TextField
                fullWidth
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
