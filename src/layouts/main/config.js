import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SvgIcon from "@mui/material/SvgIcon";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

import AboutUsIcon from "src/icons/untitled-ui/duocolor/about-us";
import AgentIcon from "src/icons/untitled-ui/duocolor/agent";
import BarChartSquare02Icon from "src/icons/untitled-ui/duocolor/bar-chart-square-02";
import CustomerCareIcon from "src/icons/untitled-ui/duocolor/customer-care";
import HomeIcon from "src/icons/untitled-ui/duocolor/home";
import HomeSmileIcon from "src/icons/untitled-ui/duocolor/home-smile";
import { Iconify } from 'src/components/iconify';
import LayoutAlt02Icon from "src/icons/untitled-ui/duocolor/layout-alt-02";
import LineChartUp04Icon from 'src/icons/untitled-ui/duocolor/line-chart-up-04';
import MessageChatSquareIcon from "src/icons/untitled-ui/duocolor/message-chat-square";
import ShoppingBag03 from "src/icons/untitled-ui/duocolor/shopping-bag-03";
import ShoppingCart01Icon from 'src/icons/untitled-ui/duocolor/shopping-cart-01';
import Users03Icon from "src/icons/untitled-ui/duocolor/users-03";
import { paths } from "src/paths";
import { tokens } from "src/locales/tokens";

export const useSections = () => {
  const { t } = useTranslation();

  return useMemo(() => {
    return [
      {
        items: [
          {
            title: t(tokens.nav.home),
            path: paths.index,
            icon: (
              <SvgIcon fontSize="small">
                <HomeIcon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.products),
            path: paths.home.product,
            icon: (
              <SvgIcon fontSize="small">
                <ShoppingBag03 />
              </SvgIcon>),
          },
          {
            title: t(tokens.nav.aboutUs),
            path: paths.home.aboutUs,
            icon: (
              <SvgIcon fontSize="small">
                <AboutUsIcon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.contactUs),
            path: paths.home.contactUs,
            icon: (
              <SvgIcon fontSize="small">
                <LineChartUp04Icon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.orderNow),
            path: paths.home.orderNow,
            icon: (
              <SvgIcon fontSize="small">
                <ShoppingCart01Icon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.customerCare),
            path: paths.home.customerCare,
            icon: (
              <SvgIcon fontSize="small">
                <CustomerCareIcon />
              </SvgIcon>),
          },
        ],
      },
      {
        subheader: t(tokens.nav.demo),
        items: [
          // {
          //   title: t(tokens.nav.wallets),
          //   path: paths.home.wallet,
          //   icon: <Iconify icon="solar:wallet-linear" width={26}/>,
          // },
          {
            title: t(tokens.nav.leaderboard),
            path: paths.home.leaderboard,
            icon: (
              <Iconify icon="material-symbols-light:social-leaderboard" width={20} />
            ),
          },
          {
            title: t(tokens.nav.overview),
            path: paths.home.overview,
            icon: (
              <SvgIcon fontSize="small">
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.customers),
            path: paths.home.customers,
            icon: (
              <SvgIcon fontSize="small">
                <Users03Icon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.agents),
            path: paths.home.agents,
            icon: (
              <SvgIcon fontSize="small">
                <AgentIcon />
              </SvgIcon>),
          },
          {
            title: t(tokens.nav.internalChat),
            path: paths.home.internalChat,
            icon: (
              <SvgIcon fontSize="small">
                <MessageChatSquareIcon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.supportChats),
            path: paths.home.supportChats,
            icon: (
              <Iconify icon="fluent:person-support-16-filled" width={20} />
            )
          },
          {
            title: t(tokens.nav.emails),
            path: paths.home.emails,
            icon: (
              <Iconify icon="ic:outline-email" width={20} />
            )
          },
          {
            title: t(tokens.nav.lead),
            path: '#',
            icon: (
              <SvgIcon fontSize="small">
                <BarChartSquare02Icon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.analytics),
                path: paths.home.lead.analytics,
              },
              {
                title: t(tokens.nav.leads),
                path: paths.home.lead.leads,
              },
              {
                title: t(tokens.nav.affiliate),
                path: paths.home.lead.affiliates,
              },
              {
                title: t(tokens.nav.brands),
                path: paths.home.lead.brands,
              },
              {
                title: t(tokens.nav.injection),
                path: paths.home.lead.listInjection,
              },
              {
                title: t(tokens.nav.offers),
                path: paths.home.lead.offers,
              },
            ],
          },
          {
            title: t(tokens.nav.risk),
            path: '#',
            icon: <ManageHistoryIcon fontSize="small" />,
            items: [
              {
                title: t(tokens.nav.positions),
                path: paths.home.risk.positions,
              },
              {
                title: t(tokens.nav.transactions),
                path: paths.home.risk.transactions,
              },
              {
                title: t(tokens.nav.walletTransactions),
                path: paths.home.risk.walletTransactions,
              },
            ],
          },
          {
            title: t(tokens.nav.payment),
            path: "#",
            icon: (
              <SvgIcon fontSize="small">
                <VerifiedUserOutlinedIcon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.merchant),
                path: paths.home.payment.merchant,
              },
              {
                title: t(tokens.nav.bankProvider),
                path: paths.home.payment.bank,
              },
              {
                title: t(tokens.nav.paymentType),
                path: paths.home.payment.paymentType,
              },
              {
                title: t(tokens.nav.validationRules),
                path: paths.home.payment.validationType,
              },
              {
                title: t(tokens.nav.dataEntry),
                path: paths.home.payment.dataEntry,
              },
              {
                title: t(tokens.nav.record),
                path: paths.home.payment.records,
              },
            ],
          },
          {
            title: t(tokens.nav.logs),
            path: paths.home.logs,
            icon: <Iconify icon="octicon:log-16" width={16} />,
          },
          {
            title: t(tokens.nav.calendar),
            path: paths.home.calendar,
            icon: (
              <Iconify icon="lucide:calendar" width={20} />
            )
          },
          {
            title: t(tokens.nav.article),
            path: paths.home.articles,
            icon: (
              <SvgIcon fontSize="small">
                <LayoutAlt02Icon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.reports),
            path: paths.home.reports,
            icon: (
              <Iconify icon="mingcute:bug-line" width={24}/>
            )
          },
        ],
      },
    ];
  }, [t]);
};

