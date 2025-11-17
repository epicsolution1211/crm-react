import { useMemo } from "react";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { useSettings } from "src/hooks/use-settings";

import { useAffiliateSections, useSections } from "./config";
import { HorizontalLayout } from "./horizontal-layout";
import { VerticalLayout } from "./vertical-layout";
import { useAuth } from "src/hooks/use-auth";
import { tokens } from "src/locales/tokens";

export const Layout = withAuthGuard((props) => {
  const settings = useSettings();
  const sections = useSections();
  const affiliateSections = useAffiliateSections();
  const { user, company } = useAuth();

  const { t } = useTranslation();

  const affiliateSectionsWithAccess = useMemo(() => {
    if (user) {
      const filteredData = affiliateSections?.map((item) => {
        const filteredItems = item.items.filter((subItem) => {
          if (subItem.title === t(tokens.nav.customers)) {
            return user?.acc?.acc_v_client === undefined && !user?.affiliate ? true : user?.acc?.acc_v_client && !user?.affiliate;
          } else if (subItem.title === t(tokens.nav.agents)) {
            return user?.acc?.acc_v_agents;
          } else if (subItem.title === t(tokens.nav.internalChat)) {
            return false;
          } else if (subItem.title === t(tokens.nav.supportChats)) {
            return user?.acc?.acc_v_support_chats === undefined ? true : user?.acc?.acc_v_support_chats;
          } else if (subItem.title === t(tokens.nav.analytics)) {
            return user?.acc?.acc_v_emails === undefined ? true : user?.acc?.acc_v_emails;
          } else if (subItem.title === t(tokens.nav.leads)) {
            return user?.acc?.acc_v_lead_management === undefined ? true : user?.acc?.acc_v_lead_management;
          } else if (subItem.title === t(tokens.nav.risk)) {
            return user?.acc?.acc_v_risk_management === undefined && !user?.affiliate ? true : user?.acc?.acc_v_risk_management && !user?.affiliate;
          } else if (subItem.title === t(tokens.nav.payment)) {
            return false;
          } else if (subItem.title === "Article") {
            return false;
          } else if (subItem.title === t(tokens.nav.settings)) {
            return false;
          } else if (subItem.title === t(tokens.nav.integration)) {
            return false;
          } else if (subItem.title === t(tokens.nav.overview)) {
            return false;
          } else if (subItem.title === "Leads") {
            return user?.aff_acc_leads;
          } else if (subItem.title === t(tokens.nav.affiliate)) {
            return user?.aff_acc_affiliates;
          } else if (subItem.title === t(tokens.nav.brands)) {
            return user?.aff_acc_brands;
          } else if (subItem.title === t(tokens.nav.injection)) {
            return user?.aff_acc_inject;
          } else if (subItem.title === t(tokens.nav.offers)) {
            return user?.aff_acc_offers;
          } else if (subItem.title === "Wallets") {
            return false;
          } else if (subItem.title === t(tokens.nav.reports)) {
            return false;
          } else if (subItem.title === t(tokens.nav.logs)) {
            return false;
          } else if (subItem.title === "Calendar") {
            return user?.acc?.acc_v_calendar === undefined ? true : user?.acc?.acc_v_calendar;
          } else if (subItem.title === "Analytics") {
            return false;
          } else if (subItem.title === t(tokens.nav.article)) {
            return false;
          } else if (subItem.title === "Leaderboard") {
            return user?.acc?.acc_v_leaderboard === undefined ? true : user?.acc?.acc_v_leaderboard;
          }

          return true; // Keep other items
        });

        return {
          items: filteredItems,
        };
      });

      return filteredData;
    }
  }, [sections, user]);

  const sectionsWithAccess = useMemo(() => {
    if (user) {
      const filteredData = sections?.map((item) => {
        const filteredItems = item.items.filter((subItem) => {

          if (subItem.title === t(tokens.nav.lead)) {
            subItem.items = subItem?.items?.filter(subSubItem => {
              if (subSubItem.title === t(tokens.nav.leads)) {
                return user?.acc?.acc_v_lm_leads === undefined ? true : user?.acc?.acc_v_lm_leads;
              } else if (subSubItem.title === t(tokens.nav.affiliate)) {
                return user?.acc?.acc_v_lm_aff === undefined ? true : user?.acc?.acc_v_lm_aff;
              } else if (subSubItem.title === t(tokens.nav.brands)) {
                return user?.acc?.acc_v_lm_brand === undefined ? true : user?.acc?.acc_v_lm_brand;
              } else if (subSubItem.title === t(tokens.nav.injection)) {
                return user?.acc?.acc_v_lm_list === undefined ? true : user?.acc?.acc_v_lm_list;
              } else if (subSubItem.title === t(tokens.nav.offers)) {
                return user?.acc?.acc_v_lm_offer === undefined ? true : user?.acc?.acc_v_lm_offer;
              }
              return true; // Keep other items
            })
          }

          if (subItem.title === t(tokens.nav.risk)) {
            subItem.items = subItem?.items?.filter(subSubItem => {
              if (subSubItem.title === t(tokens.nav.positions)) {
                return company?.company_type === 2 ? false : (user?.acc?.acc_v_risk_position === undefined ? true : user?.acc?.acc_v_risk_position);
              } else if (subSubItem.title === t(tokens.nav.transactions)) {
                return user?.acc?.acc_v_risk_transactions === undefined ? true : user?.acc?.acc_v_risk_transactions;
              } 
              else if (subSubItem.title === t(tokens.nav.walletTransactions)) {
                return company?.company_wallet_system === false ? false : (user?.acc?.acc_v_risk_wallet_transactions === undefined ? false : user?.acc?.acc_v_risk_wallet_transactions);
              } else if (subSubItem.title === t(tokens.nav.bets)) {
                return company?.company_type === 2 && user?.acc?.acc_v_risk_bets !== false ? true : false;
              }
              return true; // Keep other items
            })
          }

          if (subItem.title === t(tokens.nav.complianceRegulationAudit)) {
            subItem.items = subItem?.items?.filter(subSubItem => {
              if (subSubItem.title === t(tokens.nav.compliance)) {
                return user?.acc?.acc_v_audit_compliance === undefined ? true : user?.acc?.acc_v_audit_compliance;
              } else if (subSubItem.title === t(tokens.nav.agentReport)) {
                return user?.acc?.acc_v_audit_agent_report === undefined ? true : user?.acc?.acc_v_audit_agent_report;
              } else if (subSubItem.title === t(tokens.nav.clientReport)) {
                return user?.acc?.acc_v_audit_client_report === undefined ? true : user?.acc?.acc_v_audit_client_report;
              } else if (subSubItem.title === t(tokens.nav.regulartoryReport)) {
                return user?.acc?.acc_v_audit_regulatory_report === undefined ? true : user?.acc?.acc_v_audit_regulatory_report;
              } 
              return true; 
            })
          }

          if (subItem.title === t(tokens.nav.payment)) {
            subItem.items = subItem?.items?.filter(subSubItem => {
              if (subSubItem.title === t(tokens.nav.merchant)) {
                return user?.acc?.acc_v_audit_merchant === undefined ? true : user?.acc?.acc_v_audit_merchant;
              } else if (subSubItem.title === t(tokens.nav.bankProvider)) {
                return user?.acc?.acc_v_audit_bank === undefined ? true : user?.acc?.acc_v_audit_bank;
              } else if (subSubItem.title === t(tokens.nav.paymentType)) {
                return user?.acc?.acc_v_audit_payment_type === undefined ? true : user?.acc?.acc_v_audit_payment_type;
              } else if (subSubItem.title === t(tokens.nav.validationRules)) {
                return user?.acc?.acc_v_audit_tasks === undefined ? true : user?.acc?.acc_v_audit_tasks;
              } else if (subSubItem.title === t(tokens.nav.dataEntry)) {
                return user?.acc?.acc_v_audit_data === undefined ? true : user?.acc?.acc_v_audit_data;
              }
              return true; // Keep other items
            })
          }

          if (subItem.title === t(tokens.nav.ib)) {
            subItem.items = subItem?.items?.filter(subSubItem => {
              if (subSubItem.title === t(tokens.nav.ibs)) {
                return user?.acc?.acc_v_ib_list === undefined ? true : user?.acc?.acc_v_ib_list;
              } else if (subSubItem.title === t(tokens.nav.ibRequests)) {
                return user?.acc?.acc_v_ib_requests === undefined ? true : user?.acc?.acc_v_ib_requests;
              } else if (subSubItem.title === t(tokens.nav.ibRewards)) {
                return user?.acc?.acc_v_ib_rewards === undefined ? true : user?.acc?.acc_v_ib_rewards;
              }
              return true; // Keep other items
            })
          }

          if (subItem.title === t(tokens.nav.reports)) {
            subItem.items = subItem?.items?.filter(subSubItem => {
              if (subSubItem.title === t(tokens.nav.agentsSecurity)) {
                return user?.acc?.acc_v_reports_agents_security === undefined ? true : user?.acc?.acc_v_reports_agents_security;
              } else if (subSubItem.title === t(tokens.nav.clientsSecurity)) {
                return user?.acc?.acc_v_reports_clients_security === undefined ? true : user?.acc?.acc_v_reports_clients_security;
              } else if (subSubItem.title === t(tokens.nav.agentPerformance)) {
                return user?.acc?.acc_v_reports_agent_performance === undefined ? true : user?.acc?.acc_v_reports_agent_performance;
              } else if (subSubItem.title === t(tokens.nav.metabase)) {
                return user?.acc?.acc_v_reports_metabase === undefined ? true : user?.acc?.acc_v_reports_metabase;
              } else if (subSubItem.title === t(tokens.nav.affiliatePerformance)) {
                return user?.acc?.acc_v_reports_affiliate_performance === undefined ? true : user?.acc?.acc_v_reports_affiliate_performance;
              } else if (subSubItem.title === t(tokens.nav.deskPerformance)) {
                return user?.acc?.acc_v_reports_desk_performance === undefined ? true : user?.acc?.acc_v_reports_desk_performance;
              } else if (subSubItem.title === t(tokens.nav.powerBi)) {
                return user?.acc?.acc_v_reports_power_bi === undefined ? true : user?.acc?.acc_v_reports_power_bi;
              }
            })
          }

          if (subItem.title === t(tokens.nav.customers)) {
            return user?.acc?.acc_v_client === undefined ? true : user?.acc?.acc_v_client;
          } else if (subItem.title === t(tokens.nav.agents)) {
            return user?.acc?.acc_v_agents === undefined ? true : user?.acc?.acc_v_agents;
          } else if (subItem.title === t(tokens.nav.internalChat)) {
            return user?.acc?.acc_v_chat === undefined ? true : user?.acc?.acc_v_chat;
          } else if (subItem.title === t(tokens.nav.supportChats)) {
            return user?.acc?.acc_v_support_chats === undefined ? true : user?.acc?.acc_v_support_chats;
          } else if (subItem.title === t(tokens.nav.emails)) {
            return user?.acc?.acc_v_emails === undefined ? true : user?.acc?.acc_v_emails;
          } else if (subItem.title === t(tokens.nav.lead)) {
            return user?.acc?.acc_v_lead_management === undefined ? true : user?.acc?.acc_v_lead_management;
          } else if (subItem.title === t(tokens.nav.risk)) {
            return user?.acc?.acc_v_risk_management === undefined ? true : user?.acc?.acc_v_risk_management;
          } else if (subItem.title === t(tokens.nav.payment)) {
            return user?.acc?.acc_v_payment_audit === undefined ? true : user?.acc?.acc_v_payment_audit;
          } else if (subItem.title === t(tokens.nav.article)) {
            return user?.acc?.acc_v_article === undefined ? true : user?.acc?.acc_v_article;
          } else if (subItem.title === t(tokens.nav.settings)) {
            return user?.acc?.acc_v_settings === undefined && !user?.affiliate ? true : user?.acc?.acc_v_settings && !user?.affiliate;
          } else if (subItem.title === t(tokens.nav.integration)) {
            return user?.acc?.acc_v_integration === undefined && !user?.affiliate ? false : user?.acc?.acc_v_integration && !user?.affiliate;
          } else if (subItem.title === t(tokens.nav.overview)) {
            return user?.acc?.acc_v_overview === undefined ? true : user?.acc?.acc_v_overview;
          } else if (subItem.title === t(tokens.nav.wallets)) {
            return user?.acc?.acc_v_wallet === undefined ? true : user?.acc?.acc_v_wallet;
          } else if (subItem.title === t(tokens.nav.reports)) {
            return user?.acc?.acc_v_reports === undefined ? true : user?.acc?.acc_v_reports;
          } else if (subItem.title === t(tokens.nav.submittedForms)) {
            return user?.acc?.acc_v_submitted_forms === undefined ? true : user?.acc?.acc_v_submitted_forms;
          } else if (subItem.title === t(tokens.nav.logs)) {
            return user?.acc?.acc_v_logs === undefined ? false : user?.acc?.acc_v_logs;
          } else if (subItem.title === t(tokens.nav.calendar)) {
            return user?.acc?.acc_v_calendar === undefined ? true : user?.acc?.acc_v_calendar;
          } else if (subItem.title === t(tokens.nav.leaderboard)) {
            return user?.acc?.acc_v_leaderboard === undefined ? true : user?.acc?.acc_v_leaderboard
          } else if (subItem.title === t(tokens.nav.complianceRegulationAudit)) {
            return user?.acc?.acc_v_audit_compliance_regulation === undefined ? false : user?.acc?.acc_v_audit_compliance_regulation;
          } else if (subItem.title === t(tokens.nav.ib)) {
            return user?.acc?.acc_v_ib_room === undefined ? false : user?.acc?.acc_v_ib_room;
          } else if (subItem.title === t(tokens.nav.aiQuestions)) {
            return user?.acc?.acc_v_ai_questions === undefined ? false : user?.acc?.acc_v_ai_questions;
          } else if (subItem.title === t(tokens.nav.tasks)) {
            return user?.acc?.acc_v_tasks === undefined ? true : user?.acc?.acc_v_tasks;
          } else if (subItem.title === t(tokens.nav.tickets)) {
            return user?.acc?.acc_v_tickets === undefined ? true : user?.acc?.acc_v_tickets;
          }
          return true; // Keep other items
        });

        return {
          items: filteredItems,
        };
      });

      return filteredData;
    }
  }, [sections, user]);

  if (!sectionsWithAccess || !affiliateSectionsWithAccess || !user) return null;

  if (settings.layout === "horizontal") {
    return (
      <HorizontalLayout
        sections={
          user?.affiliate ? affiliateSectionsWithAccess : sectionsWithAccess
        }
        navColor={settings.navColor}
        {...props}
      />
    );
  }

  return (
    <VerticalLayout
      sections={
        user?.affiliate ? affiliateSectionsWithAccess : sectionsWithAccess
      }
      navColor={settings.navColor}
      {...props}
    />
  );
});

Layout.propTypes = {
  children: PropTypes.node,
};
