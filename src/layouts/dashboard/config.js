import { useMemo } from "react";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import SvgIcon from "@mui/material/SvgIcon";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { Settings } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import AgentIcon from "src/icons/untitled-ui/duocolor/agent";
import BarChartSquare02Icon from "src/icons/untitled-ui/duocolor/bar-chart-square-02";
import HomeSmileIcon from "src/icons/untitled-ui/duocolor/home-smile";
import LayoutAlt02Icon from "src/icons/untitled-ui/duocolor/layout-alt-02";
import MessageChatSquareIcon from "src/icons/untitled-ui/duocolor/message-chat-square";
import Users03Icon from "src/icons/untitled-ui/duocolor/users-03";
import { Iconify } from "src/components/iconify";
import { paths } from "src/paths";
import { tokens } from "src/locales/tokens";

export const useSections = () => {
  const { t } = useTranslation();

  return useMemo(() => {
    return [
      {
        items: [
          {
            title: t(tokens.nav.tasks),
            path: paths.dashboard.tasks,
            icon: <Iconify icon="mdi:todo-auto" width={20} />,
          },
          {
            title: t(tokens.nav.tickets),
            path: paths.dashboard.tickets,
            icon: <Iconify icon="bx:task" width={20} />,
          },
          {
            title: t(tokens.nav.appDashboard),
            path: paths.dashboard.appDashboard.index,
            icon: <Iconify icon="tdesign:user-vip" width={20} />,
            items: [
              {
                title: t(tokens.nav.settings),
                path: paths.dashboard.appDashboard.settings,
              },
            ],
          },
          {
            title: t(tokens.nav.leaderboard),
            path: paths.dashboard.leaderboard,
            icon: (
              <Iconify
                icon="material-symbols-light:social-leaderboard"
                width={20}
              />
            ),
          },
          {
            title: t(tokens.nav.overview),
            path: paths.dashboard.index,
            icon: (
              <SvgIcon fontSize="small">
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          // {
          //   title: t(tokens.nav.wallets),
          //   path: paths.dashboard.wallets.index,
          //   icon: <Iconify icon="solar:wallet-linear" width={20}/>,
          // },
          // {
          //   title: t(tokens.nav.analytics),
          //   path: paths.dashboard.analytics,
          //   icon: (
          //     <SvgIcon fontSize="small">
          //       <BarChartSquare02Icon />
          //     </SvgIcon>
          //   )
          // },
          {
            title: t(tokens.nav.customers),
            path: paths.dashboard.customers.index,
            icon: (
              <SvgIcon fontSize="small">
                <Users03Icon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.ib),
            path: paths.dashboard.ib.index,
            icon: <Iconify icon="tdesign:user-vip" width={20} />,
            items: [
              {
                title: t(tokens.nav.ibs),
                path: paths.dashboard.ib.ibs,
              },
              {
                title: t(tokens.nav.ibRequests),
                path: paths.dashboard.ib.ibRequests,
              },
              {
                title: t(tokens.nav.ibRewards),
                path: paths.dashboard.ib.ibRewards.index,
              },
            ],
          },
          {
            title: t(tokens.nav.agents),
            path: paths.dashboard.agents,
            icon: <Iconify icon="ic:outline-support-agent" width={24} />,
          },
          {
            title: t(tokens.nav.internalChat),
            path: paths.dashboard.internalChat,
            icon: <Iconify icon="mdi:message-outline" width={24} height={24} />,
          },
          {
            title: t(tokens.nav.supportChats),
            path: paths.dashboard.supportChats,
            icon: <Iconify icon="fluent:person-support-16-filled" width={20} />,
          },
          {
            title: t(tokens.nav.emails),
            path: paths.dashboard.emails,
            icon: <Iconify icon="ic:outline-email" width={20} />,
          },
          {
            title: t(tokens.nav.lead),
            path: "",
            icon: (
              <SvgIcon fontSize="small">
                <BarChartSquare02Icon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.analytics),
                path: paths.dashboard.lead.analytic,
              },
              {
                title: t(tokens.nav.leads),
                path: paths.dashboard.lead.status.index,
              },
              {
                title: t(tokens.nav.affiliate),
                path: paths.dashboard.lead.affiliate.index,
              },
              {
                title: t(tokens.nav.brands),
                path: paths.dashboard.lead.brands.index,
              },
              {
                title: t(tokens.nav.injection),
                path: paths.dashboard.lead.injection.index,
              },
              {
                title: t(tokens.nav.offers),
                path: paths.dashboard.lead.offers.index,
              },
            ],
          },
          {
            title: t(tokens.nav.risk),
            path: "",
            icon: <ManageHistoryIcon fontSize="small" />,
            items: [
              {
                title: t(tokens.nav.positions),
                path: paths.dashboard.risk.positions,
              },
              {
                title: t(tokens.nav.transactions),
                path: paths.dashboard.risk.transactions,
              },
              {
                title: t(tokens.nav.walletTransactions),
                path: paths.dashboard.risk.wallet,
              },
              {
                title: t(tokens.nav.bets),
                path: paths.dashboard.risk.bets,
              },
            ],
          },
          {
            title: t(tokens.nav.complianceRegulationAudit),
            path: paths.dashboard.complianceAudit.compliance,
            icon: <Iconify icon="hugeicons:analytics-up" width={20} />,
          },
          {
            title: t(tokens.nav.logs),
            path: paths.dashboard.log,
            icon: <Iconify icon="majesticons:analytics-line" width={24} />,
          },
          {
            title: t(tokens.nav.payment),
            path: "",
            icon: (
              <SvgIcon fontSize="small">
                <VerifiedUserOutlinedIcon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.merchant),
                path: paths.dashboard.paymentAudit.merchant.index,
              },
              {
                title: t(tokens.nav.bankProvider),
                path: paths.dashboard.paymentAudit.bankProvider.index,
              },
              {
                title: t(tokens.nav.paymentType),
                path: paths.dashboard.paymentAudit.paymentType.index,
              },
              {
                title: t(tokens.nav.validationRules),
                path: paths.dashboard.paymentAudit.validationRules.index,
              },
              {
                title: t(tokens.nav.dataEntry),
                path: paths.dashboard.paymentAudit.dataEntry.index,
              },
              {
                title: t(tokens.nav.record),
                path: paths.dashboard.paymentAudit.record.index,
              },
            ],
          },
          {
            title: t(tokens.nav.calendar),
            path: paths.dashboard.calendar,
            icon: <Iconify icon="lucide:calendar" width={20} />,
          },
          {
            title: t(tokens.nav.article),
            path: paths.dashboard.article.index,
            icon: (
              <SvgIcon fontSize="small">
                <LayoutAlt02Icon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.settings),
            path: paths.dashboard.settings,
            icon: (
              <SvgIcon fontSize="small">
                <Settings />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.integration),
            path: paths.dashboard.integration.index,
            icon: (
              <Iconify
                icon="material-symbols:integration-instructions-outline"
                width={24}
              />
            ),
          },
          {
            title: t(tokens.nav.reports),
            path: "",
            icon: <Iconify icon="fa-regular:list-alt" width={18} />,
            items: [
              {
                title: t(tokens.nav.metabase),
                path: paths.dashboard.reports.metabase,
              },
              {
                title: t(tokens.nav.agentPerformance),
                path: paths.dashboard.reports.agentPerformance,
              },
              {
                title: t(tokens.nav.affiliatePerformance),
                path: paths.dashboard.reports.affiliatePerformance,
              },
              {
                title: t(tokens.nav.deskPerformance),
                path: paths.dashboard.reports.deskPerformance,
              },
              {
                title: t(tokens.nav.clientsSecurity),
                path: paths.dashboard.reports.clientsSecurity,
              },
              {
                title: t(tokens.nav.agentsSecurity),
                path: paths.dashboard.reports.agentsSecurity,
              },
              {
                title: t(tokens.nav.powerBi),
                path: paths.dashboard.reports.powerBi,
              },
            ],
          },
          {
            title: t(tokens.nav.submittedForms),
            path: paths.dashboard.submittedForms,
            icon: <Iconify icon="mdi:file-document-outline" width={24} />,
          },
          {
            title: t(tokens.nav.aiQuestions),
            path: paths.dashboard.aiQuestions,
            icon: <Iconify icon="mingcute:ai-fill" width={24} />,
          },
        ],
      },
    ];
  }, [t]);
};

export const useAffiliateSections = () => {
  const { t } = useTranslation();

  return useMemo(() => {
    return [
      {
        items: [
          {
            title: t(tokens.nav.overview),
            path: paths.dashboard.index,
            icon: (
              <SvgIcon fontSize="small">
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          // {
          //   title: t(tokens.nav.wallets),
          //   path: paths.dashboard.wallets.index,
          //   icon: <Iconify icon="solar:wallet-linear" width={20}/>,
          // },
          // {
          //   title: t(tokens.nav.analytics),
          //   path: paths.dashboard.analytics,
          //   icon: (
          //     <SvgIcon fontSize="small">
          //       <BarChartSquare02Icon />
          //     </SvgIcon>
          //   )
          // },
          {
            title: t(tokens.nav.customers),
            path: paths.dashboard.customers.index,
            icon: (
              <SvgIcon fontSize="small">
                <Users03Icon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.agents),
            path: paths.dashboard.agents,
            icon: (
              <SvgIcon fontSize="small">
                <AgentIcon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.internalChat),
            path: paths.dashboard.internalChat,
            icon: (
              <SvgIcon fontSize="small">
                <MessageChatSquareIcon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.supportChats),
            path: paths.dashboard.supportChats,
            icon: <Iconify icon="fluent:person-support-16-filled" width={16} />,
          },
          {
            title: t(tokens.nav.analytics),
            path: paths.dashboard.lead.analytic,
            icon: (
              <SvgIcon fontSize="small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
                </svg>
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.leads),
            path: paths.dashboard.lead.status.index,
            icon: (
              <SvgIcon fontSize="small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 384 512"
                >
                  <path d="M384 64c0-35.3-28.7-64-64-64H64C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64l0-384zM128 192a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM80 356.6c0-37.9 30.7-68.6 68.6-68.6h86.9c37.9 0 68.6 30.7 68.6 68.6c0 15.1-12.3 27.4-27.4 27.4H107.4C92.3 384 80 371.7 80 356.6z" />
                </svg>
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.affiliate),
            path: paths.dashboard.lead.affiliate.index,
            icon: (
              <SvgIcon fontSize="small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 640 512"
                >
                  <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
                </svg>
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.brands),
            path: paths.dashboard.lead.brands.index,
            icon: (
              <SvgIcon fontSize="small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 0c-35.3 0-64 28.7-64 64v64H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256 448c35.3 0 64-28.7 64-64V192 64c0-35.3-28.7-64-64-64H256zM64 304c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V304zm208 16c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272zm112-16V272c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H400c-8.8 0-16-7.2-16-16zM80 192h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V208c0-8.8 7.2-16 16-16zM256 80c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V80zM400 64h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H400c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16zM256 208V176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16zm144 16c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H400z" />
                </svg>
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.injection),
            path: paths.dashboard.lead.injection.index,
            icon: (
              <SvgIcon fontSize="small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM96 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm32-128a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM96 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm96-248c-13.3 0-24 10.7-24 24s10.7 24 24 24H352c13.3 0 24-10.7 24-24s-10.7-24-24-24H192zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H352c13.3 0 24-10.7 24-24s-10.7-24-24-24H192zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H352c13.3 0 24-10.7 24-24s-10.7-24-24-24H192z" />
                </svg>
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.offers),
            path: paths.dashboard.lead.offers.index,
            icon: (
              <SvgIcon fontSize="small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM96 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm32-128a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM96 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm96-248c-13.3 0-24 10.7-24 24s10.7 24 24 24H352c13.3 0 24-10.7 24-24s-10.7-24-24-24H192zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H352c13.3 0 24-10.7 24-24s-10.7-24-24-24H192zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H352c13.3 0 24-10.7 24-24s-10.7-24-24-24H192z" />
                </svg>
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.risk),
            path: "",
            icon: <ManageHistoryIcon fontSize="small" />,
            items: [
              {
                title: t(tokens.nav.positions),
                path: paths.dashboard.risk.positions,
              },
              {
                title: t(tokens.nav.transactions),
                path: paths.dashboard.risk.transactions,
              },
              {
                title: t(tokens.nav.walletTransactions),
                path: paths.dashboard.risk.wallet,
              },
            ],
          },
          {
            title: t(tokens.nav.payment),
            path: "",
            icon: (
              <SvgIcon fontSize="small">
                <VerifiedUserOutlinedIcon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.merchant),
                path: paths.dashboard.paymentAudit.merchant.index,
              },
              {
                title: t(tokens.nav.bankProvider),
                path: paths.dashboard.paymentAudit.bankProvider.index,
              },
              {
                title: t(tokens.nav.paymentType),
                path: paths.dashboard.paymentAudit.paymentType.index,
              },
              {
                title: t(tokens.nav.validationRules),
                path: paths.dashboard.paymentAudit.validationRules.index,
              },
              {
                title: t(tokens.nav.dataEntry),
                path: paths.dashboard.paymentAudit.dataEntry.index,
              },
              {
                title: t(tokens.nav.record),
                path: paths.dashboard.paymentAudit.record.index,
              },
            ],
          },
          {
            title: t(tokens.nav.article),
            path: paths.dashboard.article.index,
            icon: (
              <SvgIcon fontSize="small">
                <LayoutAlt02Icon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.settings),
            path: paths.dashboard.settings,
            icon: (
              <SvgIcon fontSize="small">
                <Settings />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.reports),
            path: paths.dashboard.reports,
            icon: <Iconify icon="mingcute:bug-line" width={24} />,
          },
          {
            title: t(tokens.nav.logs),
            path: paths.dashboard.log,
            icon: <Iconify icon="octicon:log-16" width={24} />,
          },
        ],
      },
    ];
  }, [t]);
};
