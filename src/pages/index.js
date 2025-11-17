import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { HomePage } from "src/sections/home/home-page";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { thunks } from "src/thunks/company";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from 'src/hooks/use-search-params';

import { authApi } from "../api/auth";
import { useAuth } from "src/hooks/use-auth";

const Page = () => {
  usePageView();
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = localStorage.getItem("company_id");
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { signOut } = useAuth();

  const ref = searchParams.get("ref") ?? "";

  useEffect(() => {
    if (ref) {
      localStorage.setItem("ref", ref);
    }
  }, [searchParams]);

  const getCompany = () => dispatch(thunks.getCompany(companyId));
  const accountId = localStorage.getItem("account_id");
  const token = localStorage.getItem("token");

  const checkoutUser = async () => {
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
      } else if (user?.acc?.acc_v_agents === true || undefined) {
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
      }
      router.replace(redirect);
    }
  }

  useEffect(() => {
    const allowedDomains = ["octolit.com", "octolit.link", "localhost"];
    const hostname = window?.location?.hostname;

    if (token) {
      checkoutUser();
    }

    if (!allowedDomains.includes(hostname)) {
      router.push(paths.auth.jwt.login);
    }
  }, [router]);

  useEffect(() => {
    if (state === "faq") {
      const element = document.getElementById(state);
      element.scrollIntoView({ behavior: "smooth" });
    }
    if (state === "home") {
      const element = document.getElementById(state);
      element.scrollIntoView({ behavior: "instant" });
    }
  }, [state]);

  useEffect(() => {
    if (companyId) {
      getCompany();
    }
  }, [companyId]);

  return (
    <>
      <Seo />
      <main>
        <HomePage />
      </main>
    </>
  );
};

export default Page;
