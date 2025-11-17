import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSWRConfig } from "swr";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAuth } from "src/hooks/use-auth";
import { usePopover } from "src/hooks/use-popover";
import { useRouter } from "src/hooks/use-router";
import { useSettings } from "src/hooks/use-settings";
import { Iconify } from 'src/components/iconify';
import { TenantPopover } from "./tenant-popover";
import { TwoFactorModalCreds } from "src/pages/auth/jwt/two-factor-modal-creds";
import { paths } from "src/paths";
import { thunks } from "src/thunks/company";
import { thunks as customerThunk } from "src/thunks/customers";
import { updateBaseURL } from "src/utils/request";

export const TenantSwitch = ({ isTop, ...props }) => {
  const dispatch = useDispatch();
  const companyId = localStorage.getItem("company_id");
  const settings = useSettings();
  const popover = usePopover();
  const router = useRouter();
  const companyName = useSelector((state) => state.companies.name);
  const { signIn, initialize } = useAuth();
  const { cache } = useSWRConfig();
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [companyWithOtp, setCompanyWithOtp] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    dispatch(thunks.getCompany(companyId));
  }, [dispatch]);

  const companies = localStorage.getItem("tenants")
    ? JSON.parse(localStorage.getItem("tenants"))
    : null;

  const handleSwitchCompany = async (company) => {
    const { account } = company;
    if ((company?.company?.otp_enabled || account?.otp_enabled) && !company?.token) {
      setCompanyInfo(company);
      setCompanyWithOtp(company?.company?.id);
      setOpenOtpModal(true);
    } else {
      const currentServerUrl = localStorage.getItem("server_url");
      const companyServerUrl = company?.server_url;
      if (currentServerUrl !== companyServerUrl) {
        localStorage.setItem("server_url", companyServerUrl);
        updateBaseURL(companyServerUrl);
      }
      await signIn(company);
      cache.clear();
      setTimeout(() => {
        initialize();
        dispatch(customerThunk.resetAll());
      }, 1000);
    }

    let redirect = '#';

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
    } else if (account?.acc?.acc_v_audit_payment_type === true || undefined) {
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
    } else {
      redirect = paths.dashboard.index;
    }

    if ((!company?.company?.otp_enabled && !account?.otp_enabled) || company?.otp_used === true) {
      router.push(redirect);
    }
  };

  return (
    <>
      <Stack alignItems="center" direction="row" justifyContent="space-between" width={1} spacing={2} {...props}>
        <Box
          sx={{
            display: {
              xs: settings?.layout === "horizontal" && isTop ? "none" : "block",
              md: "block",
            },
          }}
          gap={1}
        >
          <Typography
            color="inherit"
            sx={{
              py: 0,
            }}
          >
            {companyName}
          </Typography>
        </Box>
        {companies ? (
          <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
            <Iconify icon="fluent:chevron-down-16-regular" width={18} sx={{ color: 'text.disabled' , '&:hover': { color: 'text.secondary', bgcolor: 'action.hover' } }} />
          </IconButton>
        ) : null}
      </Stack>
      {companies ? (
        <TenantPopover
          anchorEl={popover.anchorRef.current}
          switchCompany={handleSwitchCompany}
          onClose={popover.handleClose}
          open={popover.open}
        />
      ) : null}

      <TwoFactorModalCreds
        companyId={companyWithOtp}
        companyInfo={companyInfo}
        open={openOtpModal}
        onClose={() => {
          setOpenOtpModal(false);
          setCompanyWithOtp(null);
        }}
        withReload
      />
    </>
  );
};
