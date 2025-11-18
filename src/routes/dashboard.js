import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Layout as DashboardLayout } from "src/layouts/dashboard";
import LoadingScreen from 'src/components/loading-screen';

// Tasks
const TasksPage = lazy(() => import("src/pages/dashboard/tasks/index"));

// Tickets
const TicketsPage = lazy(() => import("src/pages/dashboard/tickets/index"));

// Overview
const IndexPage = lazy(() => import("src/pages/dashboard/index"));

// Reports
const AgentPerformancePage = lazy(() => import("src/pages/dashboard/reports/agent-performance"));
const AffiliatePerformancePage = lazy(() => import("src/pages/dashboard/reports/affiliate-performance"));
const DeskPerformancePage = lazy(() => import("src/pages/dashboard/reports/desk-performance"));
const ClientsSecurityPage = lazy(() => import("src/pages/dashboard/reports/clients-security"));
const AgentsSecurityPage = lazy(() => import("src/pages/dashboard/reports/agents-security"));
const PowerBiPage = lazy(() => import("src/pages/dashboard/reports/power-bi"));

// Article
const ArticlePostListPage = lazy(() => import("src/pages/dashboard/blog/list"));
const ArticlePostDetailPage = lazy(() => import("src/pages/dashboard/blog/detail"));
const ArticlePostCreatePage = lazy(() => import("src/pages/dashboard/blog/create"));
const ArticlePostEditPage = lazy(() => import("src/pages/dashboard/blog/edit"));

// Customer
const CustomerListPage = lazy(() => import("src/pages/dashboard/customers/list"));
const CustomerDetailPage = lazy(() => import("src/pages/dashboard/customers/detail"));
const CustomerEditPage = lazy(() => import("src/pages/dashboard/customers/edit"));
const CustomerCreatePage = lazy(() => import("src/pages/dashboard/customers/create"));

// IB
const IBsPage = lazy(() => import("src/pages/dashboard/ib/ibs"));
const IbRequestsPage = lazy(() => import("src/pages/dashboard/ib/ib-requests"));
const IbRewardsPage = lazy(() => import("src/pages/dashboard/ib/ib-rewards/list"));
const IbRewardDetailPage = lazy(() => import("src/pages/dashboard/ib/ib-rewards/detail"));

// Other
const AccountPage = lazy(() => import("src/pages/dashboard/account"));
const CalendarPage = lazy(() => import("src/pages/dashboard/calendar"));
const ChatPage = lazy(() => import("src/pages/dashboard/chat"));
const InternalChatPage = lazy(() => import("src/pages/dashboard/internal-chat"));
const SupportChatsPage = lazy(() => import("src/pages/dashboard/support-chats"));
const EmailsPage = lazy(() => import("src/pages/dashboard/emails"));

// Settings
const SettingsPage = lazy(() => import("src/pages/dashboard/settings/settings"));
const SettingAccess = lazy(() => import("src/pages/dashboard/settings/access"));
const CallProviderPage = lazy(() => import("src/pages/dashboard/integration/provider"));
const PaymentProviderPage = lazy(() => import("src/pages/dashboard/integration/payment-provider"));
const GameProviderPage = lazy(() => import("src/pages/dashboard/integration/game-provider"));
const GameStudioDetailPage = lazy(() => import("src/pages/dashboard/integration/game-studio-detail"));
const PaymentSystemDetailPage = lazy(() => import("src/pages/dashboard/integration/payment-system-detail"));
const CallSystemDetailPage = lazy(() => import("src/pages/dashboard/integration/call-system-detail"));

//Agents
const AgentsPage = lazy(() => import("src/pages/dashboard/agents"));
const AgentsReportPage = lazy(() => import("src/pages/dashboard/agents/report"));

const RiskEditPage = lazy(() => import("src/pages/dashboard/risk-edit"));
const RiskCreatePage = lazy(() => import("src/pages/dashboard/risk-create"));

//Risk Management
const Positions = lazy(() => import("src/pages/dashboard/risk-management/positions"));
const Transactions = lazy(() => import("src/pages/dashboard/risk-management/transactions"));
const WalletTransactions = lazy(() => import("src/pages/dashboard/risk-management/wallet-transactions"));
const TransactionDetails = lazy(() => import("src/pages/dashboard/risk-management/transaction"));
const Bets = lazy(() => import("src/pages/dashboard/risk-management/bets"));
const BetDetails = lazy(() => import("src/pages/dashboard/risk-management/bet"));
const HistoryPage = lazy(() => import("src/pages/dashboard/risk-management/history"));

// Leaderboard
const Leaderboard = lazy(() => import("src/pages/dashboard/leaderboard/index"));

//Lead Management
const LeadAnalytics = lazy(() => import("src/pages/dashboard/lead-management/analytics"));

const LeadStatus = lazy(() => import("src/pages/dashboard/lead-management/status/status"));
const LeadStatusCreatePage = lazy(() => import("src/pages/dashboard/lead-management/status/status-create"));
const LeadStatusDetailPage = lazy(() => import("src/pages/dashboard/lead-management/status/detail"));

const Affiliate = lazy(() => import("src/pages/dashboard/lead-management/affiliate/affiliate"));
const AffiliateCreatePage = lazy(() => import("src/pages/dashboard/lead-management/affiliate/affiliate-create"));
const AffiliateDetailPage = lazy(() => import("src/pages/dashboard/lead-management/affiliate/detail"));

const Brands = lazy(() => import("src/pages/dashboard/lead-management/brands/brands"));
const BrandsCreatePage = lazy(() => import("src/pages/dashboard/lead-management/brands/brands-create"));
const BrandsDetailPage = lazy(() => import("src/pages/dashboard/lead-management/brands/detail"));

const Injection = lazy(() => import("src/pages/dashboard/lead-management/injection/injection"));
const InjectionCreatePage = lazy(() => import("src/pages/dashboard/lead-management/injection/injection-create"));
const InjectionDetailPage = lazy(() => import("src/pages/dashboard/lead-management/injection/detail"));
const Offers = lazy(() => import("src/pages/dashboard/lead-management/offers/offers"));
const OfferEdit = lazy(() => import("src/pages/dashboard/lead-management/offers/offer-update"));
const OfferCreate = lazy(() => import("src/pages/dashboard/lead-management/offers/offer-create"));

// Wallet Page 
const WalletsListPage = lazy(() => import("src/pages/dashboard/wallets/list"));
const WalletsDetailPage = lazy(() => import("src/pages/dashboard/wallets/detail"));

//Payment Audit
const Merchant = lazy(() => import("src/pages/dashboard/payment-audit/merchant"));
const MerchantFeeCreate = lazy(() => import("src/pages/dashboard/payment-audit/merchant/create"));
const MerchantDetails = lazy(() => import("src/pages/dashboard/payment-audit/merchant/detail"));
const MerchantEditPage = lazy(() => import("src/pages/dashboard/payment-audit/merchant/edit"));

const BankProvider = lazy(() => import("src/pages/dashboard/payment-audit/bank-provider"));
const BankProviderDetails = lazy(() => import("src/pages/dashboard/payment-audit/bank-provider/detail"));
const BankProviderFeeCreate = lazy(() => import("src/pages/dashboard/payment-audit/bank-provider/create"));
const BankProviderEditPage = lazy(() => import("src/pages/dashboard/payment-audit/bank-provider/edit"));

const PaymentTypes = lazy(() => import("src/pages/dashboard/payment-audit/payment-types"));
const PaymentDetails = lazy(() => import("src/pages/dashboard/payment-audit/payment-types/detail"));

const ValidationRules = lazy(() => import("src/pages/dashboard/payment-audit/validation-rules"));
const ValidationRuleCreate = lazy(() => import("src/pages/dashboard/payment-audit/validation-rules/create"));
const ValidationRulesDetails = lazy(() => import("src/pages/dashboard/payment-audit/validation-rules/detail"));
const ValidationEditPage = lazy(() => import("src/pages/dashboard/payment-audit/validation-rules/edit"));

const DataEntry = lazy(() => import("src/pages/dashboard/payment-audit/data-entry"));
const DataEntryCreate = lazy(() => import("src/pages/dashboard/payment-audit/data-entry/create"));
const DataEntryDetailsPage = lazy(() => import("src/pages/dashboard/payment-audit/data-entry/detail"));

const Alert = lazy(() => import("src/pages/dashboard/payment-audit/record"));
const RecordCreate = lazy(() => import("src/pages/dashboard/payment-audit/record/create"));
const AlertDetailsPage = lazy(() => import("src/pages/dashboard/payment-audit/record/detail"));

const RoleEditPage = lazy(() => import("src/pages/dashboard/role-edit"));
const RoleCreatePage = lazy(() => import("src/pages/dashboard/role-create"));

// LOGS
const LogsPage = lazy(() => import("src/pages/dashboard/log/list"));

// Compliance
const CompliancePage = lazy(() => import("src/pages/dashboard/compliance-regulation-audit/compliance/index"));

// Metabase
const MetabasePage = lazy(() => import("src/pages/dashboard/reports/metabase"));

// AI Questions
const AiQuestionsPage = lazy(() => import("src/pages/dashboard/ai-questions"));

// Submitted Forms
const SubmittedFormsPage = lazy(() => import("src/pages/dashboard/submitted-forms"));

// Integration
const IntegrationPage = lazy(() => import("src/pages/dashboard/integration"));

//app-dashboard casino 
const CasinoSettingPage = lazy(() => import("src/pages/dashboard/app-dashboard/settings"))

export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "tickets",
        element: <TicketsPage />,
      },
      {
        path: "article",
        children: [
          {
            index: true,
            element: <ArticlePostListPage />,
          },
          {
            path: "create",
            element: <ArticlePostCreatePage />,
          },
          {
            path: ":articleId",
            element: <ArticlePostDetailPage />,
          },
          {
            path: ":articleId/edit",
            element: <ArticlePostEditPage />,
          },
        ],
      },
      {
        path: "customers",
        children: [
          {
            index: true,
            element: <CustomerListPage />,
          },
          {
            path: "create",
            element: <CustomerCreatePage />,
          },
          {
            path: ":customerId",
            element: <CustomerDetailPage />,
          },
          {
            path: ":customerId/edit",
            element: <CustomerEditPage />,
          },
        ],
      },
      {
        path: "app-dashboard",
        children: [
          {
            path: "settings",
            element: <CasinoSettingPage />,
          },
          // {
          //   path: "ib-requests",
          //   element: <IbRequestsPage />,
          // },
          // {
          //   path: "ib-rewards",
          //   element: <IbRewardsPage />,
          // },
          // {
          //   path: "ib-rewards/:ibRewardId",
          //   element: <IbRewardDetailPage />,
          // },
        ],
      },
      {
        path: "ib",
        children: [
          {
            path: "ibs",
            element: <IBsPage />,
          },
          {
            path: "ib-requests",
            element: <IbRequestsPage />,
          },
          {
            path: "ib-rewards",
            element: <IbRewardsPage />,
          },
          {
            path: "ib-rewards/:ibRewardId",
            element: <IbRewardDetailPage />,
          },
        ],
      },
      {
        path: "logs",
        children: [
          {
            index: true,
            element: <LogsPage />,
          },
        ],
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "lead",
        children: [
          {
            path: "analytics",
            element: <LeadAnalytics />,
          },
          {
            path: "status",
            children: [
              {
                index: true,
                element: <LeadStatus />,
              },
              {
                path: "create",
                element: <LeadStatusCreatePage />,
              },
              {
                path: ":leadId",
                element: <LeadStatusDetailPage />,
              },
            ],
          },
          {
            path: "affiliate",
            children: [
              {
                index: true,
                element: <Affiliate />,
              },
              {
                path: "create",
                element: <AffiliateCreatePage />,
              },
              {
                path: ":affiliateId",
                element: <AffiliateDetailPage />,
              },
            ],
          },
          {
            path: "brands",
            children: [
              {
                index: true,
                element: <Brands />,
              },
              {
                path: "create",
                element: <BrandsCreatePage />,
              },
              {
                path: ":brandId",
                element: <BrandsDetailPage />,
              },
            ],
          },
          {
            path: "injection",
            children: [
              {
                index: true,
                element: <Injection />,
              },
              {
                path: "create",
                element: <InjectionCreatePage />,
              },
              {
                path: ":injectionId",
                element: <InjectionDetailPage />,
              },
            ],
          },
          {
            path: "offers",
            children: [
              {
                index: true,
                element: <Offers />,
              },
              {
                path: ":offerId",
                element: <OfferEdit />,
              },
              {
                path: "create",
                element: <OfferCreate />,
              },
            ],
          },
        ],
      },
      {
        path: "integration",
        children: [
          {
            index: true,
            element: <IntegrationPage />,
          },
          {
            path: "provider/:providerId",
            element: <CallProviderPage />,
          },
          {
            path: "payment-provider/:providerId",
            element: <PaymentProviderPage />,
          },
          {
            path: "game-provider/:providerId",
            element: <GameProviderPage />,
          },
          {
            path: "game-studios/:providerType",
            element: <GameStudioDetailPage />,
          },
          {
            path: "payment-system/:providerType",
            element: <PaymentSystemDetailPage />,
          },
          {
            path: "call-system/:providerType",
            element: <CallSystemDetailPage />,
          },
        ],
      },
      {
        path: "payment-audit",
        children: [
          {
            path: "merchant",
            children: [
              {
                index: true,
                element: <Merchant />,
              },
              {
                path: "create",
                element: <MerchantFeeCreate />,
              },
              {
                path: ":merchantId",
                element: <MerchantDetails />,
              },
              {
                path: ":merchantId/edit/:rateId",
                element: <MerchantEditPage />,
              },
            ],
          },
          {
            path: "bank-providers",
            children: [
              {
                index: true,
                element: <BankProvider />,
              },
              {
                path: ":providerId",
                element: <BankProviderDetails />,
              },
              {
                path: "create",
                element: <BankProviderFeeCreate />,
              },
              {
                path: ":providerId/edit/:rateId",
                element: <BankProviderEditPage />,
              },
            ],
          },
          {
            path: "payment-type",
            children: [
              {
                index: true,
                element: <PaymentTypes />,
              },
              {
                path: ":paymentTypeId",
                element: <PaymentDetails />,
              },
            ],
          },
          {
            path: "validation-rules",
            children: [
              {
                index: true,
                element: <ValidationRules />,
              },
              {
                path: ":taskId/create",
                element: <ValidationRuleCreate />,
              },
              {
                path: ":taskId",
                element: <ValidationRulesDetails />,
              },
              {
                path: ":taskId/edit/:ruleId",
                element: <ValidationEditPage />,
              },
            ],
          },
          {
            path: "data-entry",
            children: [
              {
                index: true,
                element: <DataEntry />,
              },
              {
                path: "create",
                element: <DataEntryCreate />,
              },
              {
                path: ":entryId",
                element: <DataEntryDetailsPage />,
              },
            ],
          },
          {
            path: "record",
            children: [
              {
                index: true,
                element: <Alert />,
              },
              {
                path: "create",
                element: <RecordCreate />,
              },
              {
                path: ":recordId",
                element: <AlertDetailsPage />,
              },
            ],
          },
        ],
      },
      {
        path: "wallets",
        children: [
          {
            index: true,
            element: <WalletsListPage />,
          },
          {
            path: ":walletId",
            element: <WalletsDetailPage />,
          },
        ],
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "settings",
        children: [
          {
            index: true,
            element: <SettingsPage />,
          },
          {
            path: ":memberId/access",
            element: <SettingAccess />,
          },
        ],
      },
      {
        path: "roles/:roleId/edit",
        element: <RoleEditPage />,
      },
      {
        path: "roles/create",
        element: <RoleCreatePage />,
      },
      {
        path: "agents",
        element: <AgentsPage />,
      },
      {
        path: "agents/report/:agentId",
        element: <AgentsReportPage />,
      },
      {
        path: "reports",
        children: [
          {
            path: "metabase",
            element: <MetabasePage />,
          },
          {
            path: "agent-performance",
            element: <AgentPerformancePage />,
          },
          {
            path: "affiliate-performance",
            element: <AffiliatePerformancePage />,
          },
          {
            path: "desk-performance",
            element: <DeskPerformancePage />,
          },
          {
            path: "clients-security",
            element: <ClientsSecurityPage />,
          },
          {
            path: "agents-security",
            element: <AgentsSecurityPage />,
          },
          {
            path: "power-bi",
            element: <PowerBiPage />,
          },
        ],
      },
      {
        path: "submitted-forms",
        element: <SubmittedFormsPage />,
      },
      {
        path: "risk-management",
        children: [
          {
            path: "positions",
            element: <Positions />,
          },
          {
            path: "transactions",
            element: <Transactions />,
          },
          {
            path: "transactions/:transactionId",
            element: <TransactionDetails />,
          },
          {
            path: "wallet-transactions",
            element: <WalletTransactions />,
          },
          {
            path: "bets",
            element: <Bets />,
          },
          {
            path: "bets/:betId",
            element: <BetDetails />,
          },
          {
            path: "history/:target/:id",
            element: <HistoryPage />,
          },
        ],
      },
      {
        path: "compliance-regulation-audit",
        children: [
          {
            path: "compliance",
            element: <CompliancePage />,
          },
        ],
      },
      {
        path: "risk-management/positions/:riskId",
        element: <RiskEditPage />,
      },
      {
        path: "risk-management/positions/create",
        element: <RiskCreatePage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "internal-chat",
        element: <InternalChatPage />,
      },
      {
        path: "support-chats",
        element: <SupportChatsPage />,
      },
      {
        path: "emails",
        element: <EmailsPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />
      },
      {
        path: "ai-questions",
        element: <AiQuestionsPage />,
      }
    ],
  },
];
