import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSWRConfig } from "swr";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { Iconify } from "src/components/iconify";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SideNavSection } from "./side-nav-section";
import { TenantPopover } from "../tenant-switch/tenant-popover";
import { TwoFactorModalCreds } from "src/pages/auth/jwt/two-factor-modal-creds";
import { getAPIUrl } from "src/config";
import { getAppVersion } from "src/utils/version";
import { paths } from "src/paths";
import { thunks as customerThunk } from "src/thunks/customers";
import { thunks } from "src/thunks/company";
import { useAuth } from "src/hooks/use-auth";
import { usePathname } from "src/hooks/use-pathname";
import { usePopover } from "src/hooks/use-popover";
import { useRouter } from "src/hooks/use-router";
import { useSettings } from "src/hooks/use-settings";
import { updateBaseURL } from "src/utils/request";

const SIDE_NAV_WIDTH = 280;

export const useCssVars = (color) => {
  const theme = useTheme();

  return useMemo(() => {
    switch (color) {
      case "blend-in":
        if (theme.palette.mode === "dark") {
          return {
            "--nav-bg": theme.palette.background.default,
            "--nav-color": theme.palette.neutral[100],
            "--nav-border-color": theme.palette.neutral[700],
            "--nav-logo-border": theme.palette.neutral[700],
            "--nav-section-title-color": theme.palette.neutral[400],
            "--nav-item-color": theme.palette.neutral[400],
            "--nav-item-hover-bg": "rgba(255, 255, 255, 0.04)",
            "--nav-item-active-bg": "rgba(255, 255, 255, 0.04)",
            "--nav-item-active-color": theme.palette.text.primary,
            "--nav-item-disabled-color": theme.palette.neutral[600],
            "--nav-item-icon-color": theme.palette.neutral[500],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[700],
            "--nav-item-chevron-color": theme.palette.neutral[700],
            "--nav-scrollbar-color": theme.palette.neutral[400],
          };
        } else {
          return {
            "--nav-bg": theme.palette.background.default,
            "--nav-color": theme.palette.text.primary,
            "--nav-border-color": theme.palette.neutral[100],
            "--nav-logo-border": theme.palette.neutral[100],
            "--nav-section-title-color": theme.palette.neutral[400],
            "--nav-item-color": theme.palette.text.secondary,
            "--nav-item-hover-bg": theme.palette.action.hover,
            "--nav-item-active-bg": theme.palette.action.selected,
            "--nav-item-active-color": theme.palette.text.primary,
            "--nav-item-disabled-color": theme.palette.neutral[400],
            "--nav-item-icon-color": theme.palette.neutral[400],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[400],
            "--nav-item-chevron-color": theme.palette.neutral[400],
            "--nav-scrollbar-color": theme.palette.neutral[900],
          };
        }

      case "discreet":
        if (theme.palette.mode === "dark") {
          return {
            "--nav-bg": theme.palette.neutral[900],
            "--nav-color": theme.palette.neutral[100],
            "--nav-border-color": theme.palette.neutral[700],
            "--nav-logo-border": theme.palette.neutral[700],
            "--nav-section-title-color": theme.palette.neutral[400],
            "--nav-item-color": theme.palette.neutral[400],
            "--nav-item-hover-bg": "rgba(255, 255, 255, 0.04)",
            "--nav-item-active-bg": "rgba(255, 255, 255, 0.04)",
            "--nav-item-active-color": theme.palette.text.primary,
            "--nav-item-disabled-color": theme.palette.neutral[600],
            "--nav-item-icon-color": theme.palette.neutral[500],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[700],
            "--nav-item-chevron-color": theme.palette.neutral[700],
            "--nav-scrollbar-color": theme.palette.neutral[400],
          };
        } else {
          return {
            "--nav-bg": theme.palette.neutral[50],
            "--nav-color": theme.palette.text.primary,
            "--nav-border-color": theme.palette.divider,
            "--nav-logo-border": theme.palette.neutral[200],
            "--nav-section-title-color": theme.palette.neutral[500],
            "--nav-item-color": theme.palette.neutral[500],
            "--nav-item-hover-bg": theme.palette.action.hover,
            "--nav-item-active-bg": theme.palette.action.selected,
            "--nav-item-active-color": theme.palette.text.primary,
            "--nav-item-disabled-color": theme.palette.neutral[400],
            "--nav-item-icon-color": theme.palette.neutral[400],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[400],
            "--nav-item-chevron-color": theme.palette.neutral[400],
            "--nav-scrollbar-color": theme.palette.neutral[900],
          };
        }

      case "evident":
        if (theme.palette.mode === "dark") {
          return {
            "--nav-bg": theme.palette.neutral[800],
            "--nav-color": theme.palette.common.white,
            "--nav-border-color": "transparent",
            "--nav-logo-border": theme.palette.neutral[700],
            "--nav-section-title-color": theme.palette.neutral[400],
            "--nav-item-color": theme.palette.neutral[400],
            "--nav-item-hover-bg": "rgba(255, 255, 255, 0.04)",
            "--nav-item-active-bg": "rgba(255, 255, 255, 0.04)",
            "--nav-item-active-color": theme.palette.common.white,
            "--nav-item-disabled-color": theme.palette.neutral[500],
            "--nav-item-icon-color": theme.palette.neutral[400],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[500],
            "--nav-item-chevron-color": theme.palette.neutral[600],
            "--nav-scrollbar-color": theme.palette.neutral[400],
          };
        } else {
          return {
            "--nav-bg": theme.palette.neutral[800],
            "--nav-color": theme.palette.common.white,
            "--nav-border-color": "transparent",
            "--nav-logo-border": theme.palette.neutral[700],
            "--nav-section-title-color": theme.palette.neutral[400],
            "--nav-item-color": theme.palette.neutral[400],
            "--nav-item-hover-bg": "rgba(255, 255, 255, 0.04)",
            "--nav-item-active-bg": "rgba(255, 255, 255, 0.04)",
            "--nav-item-active-color": theme.palette.common.white,
            "--nav-item-disabled-color": theme.palette.neutral[500],
            "--nav-item-icon-color": theme.palette.neutral[400],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[500],
            "--nav-item-chevron-color": theme.palette.neutral[600],
            "--nav-scrollbar-color": theme.palette.neutral[400],
          };
        }

      default:
        return {};
    }
  }, [theme, color]);
};

export const SideNav = (props) => {
  const { color = "evident", sections = [] } = props;
  const pathname = usePathname();
  const cssVars = useCssVars(color);
  const companyAvatar = useSelector((state) => state.companies.avatar);
  const companyName = useSelector((state) => state.companies.name);

  const settings = useSettings();
  const popover = usePopover();

  const { user, signIn, initialize } = useAuth();
  const { cache } = useSWRConfig();

  const dispatch = useDispatch();
  const router = useRouter();

  const companyId = localStorage.getItem("company_id");
  const companies = localStorage.getItem("tenants")
    ? JSON.parse(localStorage.getItem("tenants"))
    : null;

  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [companyWithOtp, setCompanyWithOtp] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  const [isSwitchingCompany, setIsSwitchingCompany] = useState(false);

  const handleSwitchCompany = async (company) => {
    const { account } = company;
    if ((company?.company?.otp_enabled || account?.otp_enabled) && !company?.token) {
      setCompanyInfo(company);
      setCompanyWithOtp(company?.company?.id);
      setOpenOtpModal(true);
    } else {
      setIsSwitchingCompany(true);
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
        setIsSwitchingCompany(false);
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

  useEffect(() => {
    dispatch(thunks.getCompany(companyId));
  }, [dispatch]);

  return (
    <>
      <Drawer
        anchor="left"
        open={settings?.openSideNav}
        onClose={settings.handleSideNavClose}
        PaperProps={{
          sx: {
            ...cssVars,
            backgroundColor: "var(--nav-bg)",
            borderRightColor: "var(--nav-border-color)",
            borderRightStyle: "solid",
            borderRightWidth: 1,
            color: "var(--nav-color)",
            width: SIDE_NAV_WIDTH,
          },
        }}
        variant="persistent"
      >
        <Scrollbar
          sx={{
            height: "100%",
            "& .simplebar-content": {
              height: "100%",
            },
            "& .simplebar-scrollbar:before": {
              background: "var(--nav-scrollbar-color)",
            },
          }}
        >
          <Stack sx={{ height: "100%", pt: 1, position: 'relative' }}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={1.5}
              onClick={() => {
                if (companies) {
                  popover.handleOpen();
                }
              }}
              ref={popover.anchorRef}
              sx={{
                my: 3,
                m: 1,
                pl: 0.5,
                py: 0.5,
                transition: 'border-color 0.1s ease-in-out',
                '&:hover': {
                  borderColor: 'neutral.600',
                  cursor: 'pointer',
                }
              }}
            >
              <Box
                component={RouterLink}
                href={paths.index}
                sx={{
                  display: "flex",
                  height: 60,
                  width: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {companyAvatar && !isSwitchingCompany ? (
                  <img
                    src={companyAvatar ? `${getAPIUrl()}/${companyAvatar}` : ""}
                    alt="logo"
                    style={{ width: 60, height: 60, borderRadius: 6 }}
                  />
                ) : user?.affiliate ? (
                  <Stack minWidth={60}/>
                ) : (
                  <Stack minWidth={60}/>
                )}
              </Box>
              <Stack alignItems="center" direction="row" spacing={1} flexGrow={1} {...props}>
                <Box
                  sx={{
                    display: {
                      xs: settings?.layout === "horizontal" && isTop ? "none" : "block",
                      md: "block",
                      position: 'relative'
                    },
                  }}
                >
                  <Typography
                    color="inherit"
                    sx={{
                      py: 0,
                      wordBreak: 'break-all',
                      textAlign: 'center',
                    }}
                  >
                    {companyName}
                  </Typography>
                </Box>
                {companies ? (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 36,
                      right: 10,
                      '&:hover': { color: 'text.secondary', bgcolor: 'action.hover' }
                    }}
                  >
                    <Iconify icon="fluent:chevron-down-16-regular" width={18} />
                  </IconButton>
                ) : null}
              </Stack>
            </Stack>
            <Stack
              component="nav"
              spacing={2}
              sx={{
                flexGrow: 1,
                pt: 1,
                px: 2,
                pb: 6
              }}
            >
              {sections.map((section, index) => (
                <SideNavSection
                  items={section.items}
                  key={index}
                  pathname={pathname}
                  subheader={section.subheader}
                />
              ))}
            </Stack>
          </Stack>
        </Scrollbar>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            pb: 1,
            textAlign: 'center',
            color: 'var(--nav-item-color)',
            ...cssVars,
            backgroundColor: "var(--nav-bg)",
          }}
        >
          <Typography variant="caption">
            Version {getAppVersion()}
          </Typography>
        </Box>
      </Drawer>
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
