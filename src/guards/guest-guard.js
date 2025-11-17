import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import { authApi } from 'src/api/auth';

export const GuestGuard = (props) => {
  const { children } = props;
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const check = useCallback(async () => {
    if (isAuthenticated) {
      const accountId = localStorage.getItem("account_id");
      const { account: user } = await authApi.me({ accountId });

      if (user) {
        let redirect = '#';

        if (user?.affiliate) {
          if (user?.aff_acc_leads) {
            redirect = paths.dashboard.lead.status.index;
          } else if (user?.aff_acc_affiliates) {
            redirect = paths.dashboard.lead.affiliate.index;
          } else if (user?.aff_acc_brands) {
            redirect = paths.dashboard.lead.brands.index;
          } else if (user?.aff_acc_inject) {
            redirect = paths.dashboard.lead.injection.index;
          } else if (user?.aff_acc_offers) {
            redirect = paths.dashboard.lead.offers.index;
          } else {
            await signOut();
            router.replace(paths.auth.jwt.login);
            return;
          }
    
          router.replace(redirect);
          return;
        }

        if (user?.acc?.acc_v_overview === true || undefined) {
          redirect = paths.dashboard.index;
        } else if (user?.acc?.acc_v_client === true || undefined) {
          redirect = paths.dashboard.customers.index;
        }  else if (user?.acc?.acc_v_agents === true || undefined) {
          redirect = paths.dashboard.agents;
        } else if (user?.acc?.acc_v_chat === true || undefined) {
          redirect = paths.dashboard.internalChat;
        } else if (user?.acc?.acc_v_lm_leads === true || undefined) {
          redirect = paths.dashboard.lead.status.index;
        } else if (user?.acc?.acc_v_lm_aff === true || undefined) {
          redirect = paths.dashboard.lead.affiliate.index;
        } else if (user?.acc?.acc_v_lm_brand === true || undefined) {
          redirect = paths.dashboard.lead.brands.index;
        } else if (user?.acc_v_lm_list === true || undefined) {
          redirect = paths.dashboard.lead.injection.index;
        } else if (user?.acc?.acc_v_lm_offer === true || undefined) {
          redirect = paths.dashboard.lead.offers.index;
        } else if (user?.acc?.acc_v_risk_management === true || undefined) {
          redirect = paths.dashboard.risk.positions.index;
        } else if (user?.acc?.acc_v_logs === true || undefined) {
          redirect = paths.dashboard.log;
        } else if (user?.acc?.acc_v_audit_merchant === true || undefined) {
          redirect = paths.dashboard.paymentAudit.merchant.index;
        } else if (user?.acc?.acc_v_audit_bank === true || undefined) {
          redirect = paths.dashboard.paymentAudit.bankProvider.index;
        } else if (user?.acc?.acc_v_audit_payment_type === true || undefined) {
          redirect = paths.dashboard.paymentAudit.paymentType.index;
        } else if (user?.acc?.acc_v_audit_tasks === true || undefined) {
          redirect = paths.dashboard.paymentAudit.validationRules.index;
        } else if (user?.acc?.acc_v_audit_data === true || undefined) {
          redirect = paths.dashboard.paymentAudit.dataEntry.index;
        } else if (user?.acc?.acc_v_article === true || undefined) {
          redirect = paths.dashboard.article.index;
        } else if (user?.acc?.acc_v_settings === true || undefined) {
          redirect = paths.dashboard.settings;
        } else if (user?.acc?.acc_v_reports === true || undefined) {
          redirect = paths.dashboard.reports;
        } else if (user?.acc?.acc_v_audit_compliance === true) {
          redirect = paths.dashboard.complianceAudit.compliance;
        } else if (user?.acc?.acc_v_audit_agent_report === true) {
          redirect = paths.dashboard.complianceAudit.acc_v_audit_agent_report;
        } else if (user?.acc?.acc_v_audit_client_report === true) {
          redirect = paths.dashboard.complianceAudit.acc_v_audit_client_report;
        } else if (user?.acc?.acc_v_audit_regulatory_report === true) {
          redirect = paths.dashboard.complianceAudit.acc_v_audit_regulatory_report;
        } else {
          redirect = paths.dashboard.index;
        }
        router.replace(redirect);
      }
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router]);

  // Only check on mount, this allows us to redirect the user manually when auth state changes
  useEffect(() => {
    check();
  },

    []);

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // not authenticated / authorized.

  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};
