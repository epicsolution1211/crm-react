import { useCallback, useEffect, useState, useMemo, Fragment } from "react";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Logo } from "src/components/logos/logo";
import { Seo } from "src/components/seo";
import { TwoFactorModal } from "./two-factor-modal";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSettings } from "src/hooks/use-settings";
import { updateBaseURL } from "src/utils/request";

const Page = () => {
  const router = useRouter();
  const { companies, signIn, signOut } = useAuth();
  const settings = useSettings();

  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [companyWithOtp, setCompanyWithOtp] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  usePageView();

  // Group companies by server_code
  const groupedCompanies = useMemo(() => {
    if (!companies) return {};
    
    return companies.reduce((acc, company) => {
      const serverCode = company?.server_code || "Default";
      if (!acc[serverCode]) acc[serverCode] = [];
      acc[serverCode].push(company);
      return acc;
    }, {});
  }, [companies]);

  const selectCompany = useCallback(async (company, account) => {
    try {
      if (company?.company?.otp_enabled || account?.otp_enabled) {
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
      }

      let redirect = '#';
      const lastPage = localStorage.getItem("last_page");

      if (account?.affiliate) {
        if (account?.aff_acc_leads) {
          redirect = paths.dashboard.lead.status.index;
        } else if (account?.aff_acc_affiliates) {
          redirect = paths.dashboard.lead.affiliate.index;
        } else if (account?.aff_acc_brands) {
          redirect = paths.dashboard.lead.brands.index;
        } else if (account?.aff_acc_inject) {
          redirect = paths.dashboard.lead.injection.index;
        } else if (account?.aff_acc_offers) {
          redirect = paths.dashboard.lead.offers.index;
        } else {
          await signOut();
          router.push(paths.auth.jwt.login);
          return;
        }

        router.push(redirect);
        return;
      }

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

      if (lastPage) redirect = lastPage;

      if (!company?.company?.otp_enabled && !account?.otp_enabled) {
        router.push(redirect);
      }
    } catch (error) {
      console.error("Error in selectCompany:", error);
    }
  }, []);

  const getAvatarUrl = (tenant) => {
    const serverUrl = tenant?.server_url;
    const cleanServerUrl = serverUrl?.endsWith('/api') ? serverUrl.slice(0, -4) : serverUrl;
    return tenant?.company?.avatar ? `${cleanServerUrl}/${tenant?.company?.avatar}` : "";
  };

  useEffect(() => {
    if (companies === undefined) {
      toast.error("There is no company for this account!");
      setTimeout(() => {
        router.push(paths.auth.jwt.login);
      }, 1000);
    }
  }, [companies]);

  return (
    <>
      <Seo title="Company select" />
      <div>
        <Card elevation={16}>
          <CardHeader sx={{ pb: 0 }} title="Select company" />
          <CardContent>
            <Table sx={{ minWidth: 300 }}>
              <TableBody>
                {Object.entries(groupedCompanies)?.map(([serverCode, serverCompanies]) => (
                  <Fragment key={`server-group-${serverCode}`}>
                    {/* Server Header */}
                    <TableRow>
                      <TableCell colSpan={1} sx={{ py: 1, px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            {serverCode}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.disabled"
                          >
                            {serverCompanies.length} {serverCompanies.length !== 1 ? 'companies' : 'company'}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    
                    {/* Companies for this server */}
                    {serverCompanies.map((company, index) => {
                      const { company: companyObj, account } = company;
                      return (
                        <TableRow
                          hover
                          key={companyObj.id}
                          sx={{ cursor: "pointer" }}
                          onClick={() => selectCompany(company, account)}
                        >
                          <TableCell sx={{ pl: 2, py: 1, borderBottom: index === serverCompanies.length - 1 ? 'none' : '1px dashed', borderColor: 'divider' }}>
                            <Stack
                              alignItems="center"
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Stack direction="row" alignItems="center" spacing={2}>
                                {companyObj.avatar ? (
                                  <Box
                                    sx={{
                                      alignItems: "center",
                                      backgroundColor: "neutral.50",
                                      backgroundImage: `url(${companyObj.avatar ? `${getAvatarUrl(company)}` : ""})`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      borderRadius: 1,
                                      display: "flex",
                                      height: 50,
                                      width: 50,
                                      justifyContent: "center",
                                      overflow: "hidden",
                                    }}
                                  />
                                ) : (
                                  <Stack
                                    sx={{
                                      height: 50,
                                      width: 50,
                                    }}
                                    justifyContent="center"
                                    alignItems="center"
                                  >
                                    <SvgIcon sx={{ height: 50, width: 50 }}>
                                      <Logo color={settings?.colorPreset} />
                                    </SvgIcon>
                                  </Stack>
                                )}
                                <div>
                                  <Typography variant="subtitle2">
                                    {companyObj.name}
                                  </Typography>
                                </div>
                              </Stack>
                              {companyObj?.otp_enabled || account?.otp_enabled ? (
                                <Stack>
                                  <Typography variant="h6" color="green">2FA</Typography>
                                </Stack>
                              ) : null}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <TwoFactorModal
        companyId={companyWithOtp}
        companyInfo={companyInfo}
        open={openOtpModal}
        onClose={() => {
          setOpenOtpModal(false);
          setCompanyWithOtp(null);
        }}
      />
    </>
  );
};

export default Page;
