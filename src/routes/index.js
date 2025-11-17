import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Layout as MarketingLayout } from "src/layouts/marketing";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { MainLayout } from "../layouts/main";
import Error401Page from "src/pages/401";
import Error500Page from "src/pages/500";
import Terms from "src/pages/terms";
import MiniChat from "src/pages/minichat";
import Articles from "src/pages/articles";
import Article from "src/pages/article";
import Offers from "src/pages/offers-public";
import Offer from "src/pages/offer-public";

// Routes
import { authRoutes } from "./auth";
import { authDemoRoutes } from "./auth-demo";
import { dashboardRoutes } from "./dashboard";

// Landing Pages
import HomePage from "src/pages";
// import WalletPage from "src/pages/landing/wallets";
import CustomerPage from "src/pages/landing/customers";
import CustomerDetailPage from "src/pages/landing/customer-details";
import AgentsPage from "src/pages/landing/agents";
import AnalyticsPage from "src/pages/landing/lead/analytics";
import LeadPage from "src/pages/landing/lead/lead";
import AffiliatePage from "src/pages/landing/lead/affiliate";
import BrandPage from "src/pages/landing/lead/brand";
import InjectionPage from "src/pages/landing/lead/injection";
import OffersPage from "src/pages/landing/lead/offers";
import PositionsPage from "src/pages/landing/risk/positions";
import TransactionsPage from "src/pages/landing/risk/transactions";
import WalletTransactionsPage from "src/pages/landing/risk/wallet-transaction";
import MerchantPage from "src/pages/landing/payment-audit/merchant";
import BankPage from "src/pages/landing/payment-audit/bank-provider";
import PaymentPage from "src/pages/landing/payment-audit/payment-types";
import ValidationPage from "src/pages/landing/payment-audit/validation-rules";
import DataEntryPage from "src/pages/landing/payment-audit/data-entry";
import RecordPage from "src/pages/landing/payment-audit/record";
import ContactUsPage from "src/pages/landing/contact-us";
import OrderNowPage from "src/pages/landing/order-now";
import CustomerCarePage from "src/pages/landing/customer-care";
import AboutUsPage from "src/pages/landing/about-us";
import ProductsPage from "src/pages/landing/products";
import PrivatePolicyPage from "src/pages/landing/private-policy";
import CookiePolicyPage from "src/pages/landing/cookie-policy";
import ProductDetailPage from "src/pages/landing/product-details";
import ArticlesPage from "src/pages/landing/article";
import InternalChatPage from "src/pages/landing/chat";
import LogsPage from "src/pages/landing/logs";
import LeaderboardPage from "src/pages/landing/leaderboard/index"
import IndexPage from "src/pages/landing/index"
import CalendarPage from "src/pages/landing/calendar"
import EmailsPage from "src/pages/landing/emails"
import SupportChatsPage from "src/pages/landing/support-chats"
import ReportsPage from "src/pages/landing/reports"

export const routes = [
  {
    element: (
      <Outlet />
    ),
    children: [
      {
        index: true,
        element:
          <MainLayout>
            <HomePage />
          </MainLayout>,
      },
      {
        path: "products",
        element:
          <MainLayout>
            <ProductsPage />
          </MainLayout>,
      },
      {
        path: "products/:productId",
        element:
          <MainLayout>
            <ProductDetailPage />
          </MainLayout>,
      },
      {
        path: "about_us",
        element:
          <MainLayout>
            <AboutUsPage />
          </MainLayout>,
      },
      {
        path: "contact_us",
        element:
          <MainLayout>
            <ContactUsPage />
          </MainLayout>,
      },
      {
        path: "customer_care",
        element:
          <MainLayout>
            <CustomerCarePage />
          </MainLayout>,
      },
      {
        path: "order_now",
        element:
          <MainLayout>
            <OrderNowPage />
          </MainLayout>,
      },
      {
        path: "support-chats",
        element:
          <MainLayout>
            <SupportChatsPage />
          </MainLayout>,
      },
      {
        path: "emails",
        element:
          <MainLayout>
            <EmailsPage />
          </MainLayout>,
      },
      {
        path: "calendar",
        element:
          <MainLayout>
            <CalendarPage />
          </MainLayout>,
      },
      {
        path: "reports",
        element:
          <MainLayout>
            <ReportsPage />
          </MainLayout>,
      },
      {
        path: "private_policy",
        element:
          <MainLayout>
            <PrivatePolicyPage />
          </MainLayout>,
      },
      {
        path: "cookie_policy",
        element:
          <MainLayout>
            <CookiePolicyPage />
          </MainLayout>,
      },
      // {
      //   path: "wallets",
      //   element:
      //     <MainLayout>
      //       <WalletPage />
      //     </MainLayout>,
      // },
      {
        path: "leaderboard",
        element:
          <MainLayout>
            <LeaderboardPage />
          </MainLayout>,
      },
      {
        path: "overview",
        element:
          <MainLayout>
            <IndexPage />
          </MainLayout>,
      },
      {
        path: "customers",
        element:
          <MainLayout>
            <CustomerPage />
          </MainLayout>,
      },
      {
        path: "customers/:customerId",
        element:
          <MainLayout>
            <CustomerDetailPage />
          </MainLayout>,
      },
      {
        path: "agents",
        element:
          <MainLayout>
            <AgentsPage />
          </MainLayout>,
      },
      {
        path: "articles",
        element:
          <MainLayout>
            <ArticlesPage />
          </MainLayout>,
      },
      {
        path: "internal-chat",
        element:
          <MainLayout>
            <InternalChatPage />
          </MainLayout>,
      },
      {
        path: "lead",
        element:
          <MainLayout>
            <Outlet />
          </MainLayout>,
        children: [
          {
            path: 'analytics',
            element: <AnalyticsPage />,
          },
          {
            path: 'leads',
            element: <LeadPage />,
          },
          {
            path: 'affiliates',
            element: <AffiliatePage />,
          },
          {
            path: 'brands',
            element: <BrandPage />,
          },
          {
            path: 'list-injection',
            element: <InjectionPage />,
          },
          {
            path: 'offers',
            element: <OffersPage />,
          },
        ]
      },
      {
        path: "risk",
        element:
          <MainLayout>
            <Outlet />
          </MainLayout>,
        children: [
          {
            path: 'positions',
            element: <PositionsPage />,
          },
          {
            path: 'transactions',
            element: <TransactionsPage />,
          },
          {
            path: 'wallet-transactions',
            element: <WalletTransactionsPage />,
          },
        ]
      },
      {
        path: "payment-audit",
        element:
          <MainLayout>
            <Outlet />
          </MainLayout>,
        children: [
          {
            path: 'merchant',
            element: <MerchantPage />,
          },
          {
            path: 'bank',
            element: <BankPage />,
          },
          {
            path: 'payment-type',
            element: <PaymentPage />,
          },
          {
            path: 'validation-type',
            element: <ValidationPage />,
          },
          {
            path: 'data-entry',
            element: <DataEntryPage />,
          },
          {
            path: 'records',
            element: <RecordPage />,
          },
        ]
      },
      {
        path: "logs",
        element:
          <MainLayout>
            <LogsPage />
          </MainLayout>,
      },
      {
        path: "terms",
        element:
          <MarketingLayout>
            <Terms />
          </MarketingLayout>
      },
    ],
  },
  {
    path: "minichat",
    element: <MiniChat />,
  },
  {
    path: "public/:companyId/articles",
    element: <Articles />,
  },
  {
    path: "offers",
    element: <Offers />,
  },
  {
    path: "offers/:offerId",
    element: <Offer />,
  },
  {
    path: "public/:companyId/articles/:articleId",
    element: <Article />,
  },
  ...authRoutes,
  ...authDemoRoutes,
  ...dashboardRoutes,
  {
    path: "401",
    element: <Error401Page />,
  },
  {
    path: "404",
    element: (
      <DashboardLayout>
        <Suspense>
          <IndexPage />
        </Suspense>
      </DashboardLayout>),
  },
  {
    path: "500",
    element: <Error500Page />,
  },
  {
    path: "*",
    element: (
      <DashboardLayout>
        <Suspense>
          <IndexPage />
        </Suspense>
      </DashboardLayout>),
  },
];
