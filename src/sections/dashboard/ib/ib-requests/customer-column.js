import { useEffect, useMemo, useRef, useState } from "react";
import { differenceInMinutes } from "date-fns";
import { useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

import { AffiliateFilter } from "./filters/affiliate-filter";
import { AgentFilter } from "./filters/agent-filter";
import { Autodial } from "./widget/autodial";
import { BrandFilter } from "./filters/brand-filter";
import { ChatState } from "./filters/chat-state";
import { CountryFilter } from "./filters/country-filter";
import { DeskFilter } from "./filters/desk-filter";
import { EmailFilter } from "./filters/email-filter";
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { FilterInput } from "src/components/customize/filter-input";
import { FirstAffiliate } from "./filters/first-affiliate";
import { FirstAgent } from "./filters/first-agent";
import { FirstCaller } from "./filters/first-caller";
import { FrdOwner } from "./filters/frd-owner";
import { FtdOwnerFilter } from "./filters/ftd-owner-filter";
import { LabelFilter } from "./filters/label-filter";
import { LastAgent } from "./filters/last-agent";
import { OnlineFilter } from "./filters/online-filter";
import { PhoneFilter } from "./filters/phone-filter";
import { SecondAgent } from "./filters/second-agent";
import { SecondCaller } from "./filters/second-caller";
import { SeverityPill } from "src/components/severity-pill";
import { TeamFilter } from "./filters/team-filter";
import { ThirdAgent } from "./filters/third-agent";
import { ThirdCaller } from "./filters/third-caller";
import { countries } from "src/utils/constant";
import { getAPIUrl } from "src/config";
import { paths } from "src/paths";
import { slice } from "src/slices/customers";
import { thunks } from "src/thunks/customers";
import { useAuth } from "src/hooks/use-auth";
import { useTimezone } from "src/hooks/use-timezone";
import { useGetCustomerLabels, useGetCustomerAgents, useGetCustomerWallets } from "src/api-swr/customer";
import { Iconify } from "src/components/iconify";
import { settingsApi } from "src/api/settings";
import { customersApi } from "src/api/customers";
import { statuses } from "../../customer/constants";
import { IBApprovedFilter } from "./filters/ib-approved-filter";
import { TradingAccountFilter } from './filters/trading-account-filter';
import { KycIdStatusFilter } from './filters/kyc-id-status-filter';
import { KycBillingStatusFilter } from './filters/kyc-billing-status-filter';
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { QuickActionWidget } from "src/sections/dashboard/customer/customer-list-table/widget/quick-action";
import { defaultQuickIconRule } from "src/components/table-settings-modal";

export const handleSendLastBeat = async (type, id) => {
  try {
    const accountId = localStorage.getItem("account_id");
    await settingsApi.updateMember(accountId, {
      last_beat: true,
      trigger: type,
      client_id: id,
    });
  } catch (error) {
    console.error("error: ", error);
  }
}

const EmailRender = ({row, user}) => {
  const [emailHidden, setEmailHidden] = useState(false);

  useEffect(() => {
    if (user?.acc?.acc_h_client_email) setEmailHidden(true);
  }, [user]);

  const handleCopyEmail = () => {
    if (row?.emails?.length > 0) {
      const emailText = row.emails.slice(0, 2).join(", ");
      copyToClipboard(emailText);
    }
  };

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      gap={1}
      sx={{
        '&:hover .copy-email-icon': {
          opacity: 1,
          visibility: 'visible'
        }
      }}
    >
      <Typography sx={{ whiteSpace: "nowrap" }}>
        {!emailHidden ? (row?.emails?.length> 0? row?.emails
          ?.slice(0, 2)
          ?.map((item) => item)
          ?.join(", ") : 'No email'): "*****************" }
      </Typography>
      {!emailHidden && row?.emails?.length > 0 && (
        <IconButton 
          onClick={handleCopyEmail}
          className="copy-email-icon"
          sx={{ 
            color: 'text.secondary',
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.2s ease-in-out',
            '&:hover': { 
              color: 'primary.main'
            }
          }}
          size="small"
        >
          <Iconify icon="mdi:content-copy" width={16} />
        </IconButton>
      )}
      {user?.acc?.acc_h_client_email ? (
        <IconButton 
          onClick={() => {
            setEmailHidden(!emailHidden);
            handleSendLastBeat("email", row.id);
          }}
          sx={{ '&:hover': { color: 'primary.main' }, color: 'text.secondary' }}
        >
          <Iconify
            icon={!emailHidden ? 'fluent:eye-32-filled' : 'ri:eye-close-line'}
          />
        </IconButton>
      ) : null}
    </Stack>
  )
}

const PhoneRender = ({row, user}) => {
  const [phoneHidden, setPhoneHidden] = useState(false);

  useEffect(() => {
    if (user?.acc?.acc_h_client_phone) setPhoneHidden(true);
  }, [user]);

  const handleCopyPhone = () => {
    if (row?.phone_numbers?.length > 0) {
      const phoneText = row.phone_numbers.join(", ");
      copyToClipboard(phoneText);
    }
  };

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      gap={1}
      sx={{
        '&:hover .copy-phone-icon': {
          opacity: 1,
          visibility: 'visible'
        }
      }}
    >
      {!phoneHidden ? (row?.phone_numbers?.length> 0 ? row?.phone_numbers?.map((item, index) => (
        <Typography key={index}>{item}</Typography>
      )): <Typography>No phone</Typography>): <Typography>**************</Typography>}
      {!phoneHidden && row?.phone_numbers?.length > 0 && (
        <IconButton 
          onClick={handleCopyPhone}
          className="copy-phone-icon"
          sx={{ 
            color: 'text.secondary',
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.2s ease-in-out',
            '&:hover': { 
              color: 'primary.main'
            }
          }}
          size="small"
        >
          <Iconify icon="mdi:content-copy" width={16} />
        </IconButton>
      )}
      {user?.acc?.acc_h_client_phone ? (
        <IconButton 
          onClick={() => {
            setPhoneHidden(!phoneHidden);
            handleSendLastBeat("phone", row.id);
          }}
          sx={{ '&:hover': { color: 'primary.main' }, color: 'text.secondary' }}
        >
          <Iconify
            icon={!phoneHidden ? 'fluent:eye-32-filled' : 'ri:eye-close-line'}
          />
        </IconButton>
      ) : null}
    </Stack>
  )
}

export const useGetCustomerColumns = ({
  rule,
  filters,
  setRule,
  onGetData,
  customFilters,
  columnSettings,
  handleReminder,
  handleSelectedLabelsGet,
  handleLabelsDialogOpen,
  handleCustomerCall,
  handleOpenCustomerChat,
  setCommentClientId,
  setMessageId,
  setQuickEmailInfo,
  setCustomerToEditFields,
  assignCustomerForms,
  onDeselectAll,
}) => {
  const navigate = useNavigate();
  const localIconSetting = localStorage.getItem("iconSetting");
  const iconSetting = localIconSetting ? JSON.parse(localIconSetting) : [];

  const { user, company } = useAuth();
  const { toLocalTime } = useTimezone();

  const dispatch = useDispatch();
  const searchParam = new URLSearchParams();
  const { agentList } = useGetCustomerAgents({ per_page: 10000, non_account_ids: [], q: "*" });
  const { labelInfo } = useGetCustomerLabels();
  const { walletList: wallets } = useGetCustomerWallets({ company_id: company?.id });

  // const filters = useSelector((state) => state.customers.customerFilters);
  const updateFilters = (data) => {
    data.currentPage = 0;
    onDeselectAll();
    dispatch(thunks.setIBRequestsFilters(data));
  };

  const handleClick = (id) => {
    if (customFilters?.length !== 0) {
      dispatch(slice.actions.setIBsRequestsCustomFilter(customFilters));
    }
    navigate(`${paths.dashboard.customers.index}/${id}?${searchParam?.toString()}`, { state: { prevRouter: "ib-requests" } });
  };

  const handleChangeIBStatus = async (id, isApprove) => {
    try {
      const request = {
        id: id,
      };
      if(isApprove) {
        request.approve_ib_request = true;
      } else {
        request.reject_ib_request = true;
      }
      
      await customersApi.updateCustomer(request);
      setTimeout(async () =>  {
        await onGetData()
      }, 500);

      toast.success("IB is approved successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const DEFAULT_COLUMN = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      render: (row) => {
        const isOneMinuteAgo = (dateTime) => {
          const now = new Date();
          const ago = differenceInMinutes(now, new Date(dateTime));
          return ago <= 1;
        };
        const isOnline = row?.last_online
          ? isOneMinuteAgo(row?.last_online)
          : false;
        return isOnline ? (
          <Badge variant="dot" color="success">
            <Stack
              color="text.primary"
              onClick={()=> handleClick(row?.id)}
              sx={{
                alignItems: "center",
                display: "inline-flex",
                ":hover": { 
                  color: "primary.main", 
                  cursor: "pointer",
                  textDecoration: "underline"
                },
              }}
              underline="hover"
              gap={1}
            >
              {row?.id}
            </Stack>
          </Badge>
        ) : (
          <Stack
            color="text.primary"
            onClick={()=> handleClick(row?.id)}
            sx={{
              ":hover": { 
                color: "primary.main", 
                cursor: "pointer",
                textDecoration: "underline"
              },
            }}
            underline="hover"
            gap={1}
          >
            {row?.id}
          </Stack>
        );
      },
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="ID"
          placeholder="ID..."
          filter={filters?.ids}
          setFilter={(val) => {
            updateFilters({ ids: val });
          }}
          isExclude
          isSelected={filters?.ids}
          setExcludeFilter={(val) => {
            updateFilters({ non_ids: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_name && {
      id: "name",
      label: "Full Name",
      enabled: true,
      width: 180,
      headerRender: () => (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: "600",
            whiteSpace: "nowrap",
          }}
        >
          Name
        </Typography>
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center">
          <Stack
            color="text.primary"
            onClick={()=> handleClick(row?.id)}
            sx={{
              alignItems: "center",
              display: "inline-flex",
              flexDirection: 'row',
              ":hover": { 
                color: "primary.main", 
                cursor: "pointer",
                textDecoration: "underline",
              },
            }}
            underline="hover"
            gap={1}
          >
            <Iconify
              icon={`circle-flags:${row?.country?.toLowerCase()}`}
              width={24}
            />
            <Typography sx={{ whiteSpace: "nowrap" }}>
              {row?.full_name}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      id: "first_name",
      label: "First Name",
      enabled: false,
      render: (row) => (
        <Stack direction="row" alignItems="center">
          <Stack
            color="text.primary"
            onClick={()=> handleClick(row?.id)}
            sx={{
              alignItems: "center",
              display: "inline-flex",
              ":hover": { 
                color: "primary.main", 
                cursor: "pointer",
                textDecoration: "underline"
              },
            }}
            underline="hover"
            gap={1}
          >
            <Typography sx={{ whiteSpace: "nowrap" }}>
              {row?.first_name}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      id: "last_name",
      label: "Last Name",
      enabled: false,
      render: (row) => (
        <Stack direction="row" alignItems="center">
          <Stack
            color="text.primary"
            onClick={()=> handleClick(row?.id)}
            sx={{
              alignItems: "center",
              display: "inline-flex",
              ":hover": { 
                color: "primary.main", 
                cursor: "pointer",
                textDecoration: "underline"
              },
            }}
            underline="hover"
            gap={1}
          >
            <Typography sx={{ whiteSpace: "nowrap" }}>
              {row?.last_name}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    (user?.acc?.acc_v_client_internal_brand === undefined ||
      user?.acc?.acc_v_client_internal_brand) && {
      id: "internal_brand_id",
      label: "Internal Brand",
      enabled: true,
      headerRender: () => (
        <BrandFilter updateFilters={updateFilters} />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>{row?.internal_brand_name}</Typography>
        </Stack>
      ),
    },
    {
      id: "approved_ib",
      label: "Approved IB",
      enabled: true,
      headerRender: () => (
        <IBApprovedFilter updateFilters={updateFilters} />
      ),
      render: (row) => {
        return (
          <Stack direction="row">
            {row?.is_ib_approved ? (
              <Button
                variant='outlined'
                sx={{ p: 0 }}
                onClick={() => handleChangeIBStatus(row.id, false)}
                color='error'
              >
                Reject
              </Button>
            ) : (
              <Button
                variant='outlined'
                sx={{ p: 0 }}
                onClick={() => handleChangeIBStatus(row.id, true)}
                color='success'
              >
                Approve
              </Button>
            )}
          </Stack>
        );
      }
    },
    {
      id: "autodial",
      label: "Autodial",
      enabled: false,
      sortingDisabled: true,
      render: (row) => (
        <Autodial row={row} />
      ),
      headerRender: () => (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Autodial
        </Typography>
      ),
    },
    user?.acc?.acc_v_client_email && {
      id: "email",
      label: "Email",
      width: 200,
      enabled: false,
      render: (row) => (
        <EmailRender row={row} user={user}/>
      ),
      headerRender: () => (
        <EmailFilter updateFilters={updateFilters} />
      ),
    },
    user?.acc?.acc_v_client_phone && {
      id: "phone",
      label: "Phone",
      enabled: false,
      render: (row) => (
        <PhoneRender row={row} user={user}/>
      ),
      headerRender: () => (
        <PhoneFilter updateFilters={updateFilters} />
      ),
    },
    {
      id: "country",
      label: "Country",
      enabled: false,
      headerRender: () => (
        <CountryFilter updateFilters={updateFilters} />
      ),
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify
            icon={`circle-flags:${row?.country?.toLowerCase()}`}
            width={24}
          />
          <Typography variant="subtitle2">
            {countries.find((c) => c.code === row?.country)?.label}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "call_chat",
      label: "Quick Action",
      width: 200,
      enabled: false,
      subSetting: true,
      hasSort: false,
      subEnabled: defaultQuickIconRule,
      render: (row, fields, rule) => {
        const emails = row.emails.slice(0, 2);
        const phoneNumbers = row.phone_numbers.slice(0, 2);
        const currentRule = rule?.find((item) => item?.id === "call_chat")?.subEnabled;

        return (
          <QuickActionWidget
            data={row}
            fields={fields}
            rule={currentRule}
            customFilters={customFilters}
            defaultRule={defaultQuickIconRule}
            emails={emails}
            phoneNumbers={phoneNumbers}
            handleReminder={handleReminder}
            handleSelectedLabelsGet={handleSelectedLabelsGet}
            handleLabelsDialogOpen={handleLabelsDialogOpen}
            handleCustomerCall={handleCustomerCall}
            handleOpenCustomerChat={handleOpenCustomerChat}
            setCommentClientId={setCommentClientId}
            setMessageId={setMessageId}
            setQuickEmailInfo={setQuickEmailInfo}
            setCustomerToEditFields={setCustomerToEditFields}
            assignCustomerForms={assignCustomerForms}
            onGetData={onGetData}
            iconSetting={iconSetting}
          />
        );
      },
    },
    {
      id: "desk_id",
      label: "Desk",
      enabled: false,
      headerRender: () => (
        <DeskFilter updateFilters={updateFilters} />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {row?.desk_color ? (
            <Box
              sx={{
                backgroundColor: row?.desk_color,
                maxWidth: 1,
                height: 1,
                padding: 1,
                borderRadius: 20,
              }}
            ></Box>
          ) : null}
          <Typography>{row?.desk_name}</Typography>
        </Stack>
      ),
    },
    {
      id: "first_affiliate_id ",
      label: "First Affiliate",
      enabled: false,
      headerRender: () => (
        <FirstAffiliate updateFilters={updateFilters} />
      ),
      render: (row) => (
        <Stack gap={1} direction="row">
          <Typography>{row?.first_affiliate_name}</Typography>
        </Stack>
      ),
    },
    {
      id: "affiliate_id",
      label: "Affiliate",
      enabled: false,
      headerRender: () => (
        <AffiliateFilter updateFilters={updateFilters} />
      ),
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.affiliate_names?.map((item, index) => (
            <Chip key={item + index} label={item} size="small" color="primary" />
          ))}
        </Stack>
      ),
    },
    {
      id: "labels",
      label: "Labels",
      enabled: false,
      sortingDisabled: true,
      headerRender: () => (
        <LabelFilter handleLabelsDialogOpen={handleLabelsDialogOpen} updateFilters={updateFilters} />
      ),
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.client_labels?.map((item, index) => (
            <Chip
              key={item?.id + index}
              label={item.name}
              size="small"
              color="primary"
              sx={{
                backgroundColor:
                  labelInfo?.find(({ label }) => item.name === label?.name)
                    ?.label?.color ?? "",
                mr: 1,
              }}
            />
          ))}
        </Stack>
      ),
    },
    {
      id: "trading_account",
      label: "Trading Accounts",
      enabled: false,
      headerRender: () => (
        <TradingAccountFilter updateFilters={updateFilters} />
      ),
      render: (row) => (
        <Stack gap={1} direction="row">
          {row?.trading_account_names?.map((item, index) => (
            <Chip
              key={item + index}
              label={item}
              size="small"
              color="primary"
            />
          ))}
        </Stack>
      ),
    },
    {
      id: "status",
      label: "Chats state",
      enabled: false,
      headerRender: () => (
        <ChatState updateFilters={updateFilters} />
      ),
      render: (row) => (
        <SeverityPill
          color={
            row?.status === 1
              ? "success"
              : row?.status === 2
                ? "warning"
                : "error"
          }
        >
          {statuses[row?.status]}
        </SeverityPill>
      ),
    },
    {
      id: "balance",
      label: "Balance",
      enabled: false,
      render: (row, customFilters, rule, exchange) => {
        const currencyOption = [
          {
            value: 1,
            key: 'usd',
            icon: 'circle-flags:us',
          },
          {
            value: 2,
            key: 'eur',
            icon: 'circle-flags:european-union',
          },
          {
            value: 3,
            key: 'gpb',
            icon: 'circle-flags:uk',
          },
          {
            value: 4,
            key: 'cad',
            icon: 'circle-flags:ca',
          },
          {
            value: 5,
            key: 'aud',
            icon: 'circle-flags:au',
          },
        ];
        return (
          row?.balance || row?.balance === 0?
          <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
              <Iconify icon='circle-flags:us' width={24} />
              <Typography sx={{ whiteSpace: "nowrap" }}>
                {row?.balance || row?.balance === 0 ? row?.balance?.toFixed(2) : ""}
              </Typography>
            </Stack>
            {!!user.currency && user.currency !==1 && exchange?
              <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Iconify icon={currencyOption.find((item)=> item.value===user.currency).icon} width={24} />
                <Typography sx={{ whiteSpace: "nowrap" }}>
                  {row?.balance || row?.balance === 0 ? (row?.balance * exchange[currencyOption.find(item=> item.value===user.currency).key])?.toFixed(2) : ""}
                </Typography>
              </Stack>:
            null
            }
          </Stack>
        : null);
      },
    },
    {
      id: "agent",
      label: "Agent",
      enabled: false,
      headerRender: () => {
        return (
          <AgentFilter updateFilters={updateFilters} />
        );
      },
      render: (row) => {
        const agents = agentList?.filter((item) => row?.agent_ids?.includes(parseInt(item.value)));
        return (
          <Stack sx={{ p: 0 }} direction="row" gap={2}>
            {agents?.map((item, index) => (
              <Stack key={item + index} direction="row" alignItems="center" gap={1}>
                <Avatar
                  src={item?.avatar ? (item?.avatar?.includes("http")
                    ? item?.avatar
                    : `${getAPIUrl()}/${item?.avatar}`) : ""}
                  sx={{ width: 30, height: 30 }} />
                <Typography sx={{ whiteSpace: "nowrap" }}>
                  {item.label}
                </Typography>
                <Tooltip title="View Heatmap">
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigate(paths.dashboard.agentsReport.replace(":agentId", item.value), { state: { agent: item } });
                    }}
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "primary.main",
                    }}}
                  >
                    <Iconify icon="icon-park-outline:sales-report" width={22}/>
                  </IconButton>
                </Tooltip>
              </Stack>
            ))}
          </Stack>
        );
      },
    },
    {
      id: "team",
      label: "Team",
      enabled: false,
      headerRender: () => {
        return (
          <TeamFilter updateFilters={updateFilters} />
        );
      },
      render: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }}>
          {row?.client_teams?.map((item) => item?.name)?.join(", ")}
        </Typography>
      ),
    },
    {
      id: "online",
      label: "Online",
      enabled: false,
      headerRender: () => (
        <OnlineFilter updateFilters={updateFilters} />
      ),
      render: (row) => {
        const isOneMinuteAgo = (dateTime) => {
          const now = new Date();
          const ago = differenceInMinutes(now, new Date(dateTime));
          return ago <= 1;
        };
        const isOnline = row?.last_online
          ? isOneMinuteAgo(row?.last_online)
          : false;
        return (
          <Stack direction="row">
            {isOnline ? (
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            ) : (
              <RemoveCircleOutline fontSize="small" color="error" />
            )}
          </Stack>
        );
      },
    },
    {
      id: "last_online",
      label: "Last Online",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="LAST ONLINE"
          isRange
          subLabel1="Last Online Start"
          subLabel2="Last Online End"
          filter={filters?.last_online_start}
          setFilter={(val) => {
            updateFilters({ last_online_start: val });
          }}
          filter2={filters?.last_online_end}
          setFilter2={(val) => {
            updateFilters({ last_online_end: val });
          }}
        />
      ),
      render: (row) => {
        return (
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {toLocalTime(row?.last_online)}
          </Typography>
        );
      },
    },
    (user?.acc?.acc_v_last_login === undefined ||
      user?.acc?.acc_v_last_login) && {
      id: "last_login",
      label: "Last Login",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="LAST LOGIN"
          isRange
          subLabel1="Last Login Start"
          subLabel2="Last Login End"
          filter={filters?.last_login_start}
          setFilter={(val) => {
            updateFilters({ last_login_start: val });
          }}
          filter2={filters?.last_login_end}
          setFilter2={(val) => {
            updateFilters({ last_login_end: val });
          }}
        />
      ),
      render: (row) => {
        return (
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {toLocalTime(row?.last_login)}
          </Typography>
        );
      },
    },
    {
      id: "last_lead_date",
      label: "Last Lead Date",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="LAST LEAD DATE"
          isRange
          subLabel1="Last Lead Date Start"
          subLabel2="Last Lead Date End"
          filter={filters?.last_lead_date_start}
          setFilter={(val) => {
            updateFilters({ last_lead_date_start: val });
          }}
          filter2={filters?.last_lead_date_end}
          setFilter2={(val) => {
            updateFilters({ last_lead_date_end: val });
          }}
        />
      ),
      render: (row) => {
        return (
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {toLocalTime(row?.last_lead_date)}
          </Typography>
        );
      },
    },
    {
      id: "local_time",
      label: "Local Time",
      enabled: false,
      hasSort: false
    },
    {
      id: "created_at",
      label: "Created At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="CREATED AT"
          isRange
          subLabel1="Created Start"
          subLabel2="Created End"
          filter={filters?.created_at_start}
          setFilter={(val) => {
            updateFilters({ created_at_start: val });
          }}
          filter2={filters?.created_at_end}
          setFilter2={(val) => {
            updateFilters({ created_at_end: val });
          }}
        />
      ),
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {toLocalTime(row?.created_at)}
        </Typography>
      ),
    },
    {
      id: "last_communication",
      label: "Last Communication",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="LAST COMMUNICATION AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.last_communication_at_start}
          setFilter={(val) => {
            updateFilters({ last_communication_at_start: val });
          }}
          filter2={filters?.last_communication_at_end}
          setFilter2={(val) => {
            updateFilters({ last_communication_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.last_communication);
      },
    },
    {
      id: "last_assigned_team_at",
      label: "Last Team",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="LAST ASSIGNED TEAM AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.last_assigned_team_at_start}
          setFilter={(val) => {
            updateFilters({ last_assigned_team_at_start: val });
          }}
          filter2={filters?.last_assigned_team_at_end}
          setFilter2={(val) => {
            updateFilters({ last_assigned_team_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.last_assigned_team_at);
      },
    },
    {
      id: "last_assigned_desk_at",
      label: "Last Desk",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="LAST ASSIGNED DESK AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.last_assigned_desk_at_start}
          setFilter={(val) => {
            updateFilters({ last_assigned_desk_at_start: val });
          }}
          filter2={filters?.last_assigned_desk_at_end}
          setFilter2={(val) => {
            updateFilters({ last_assigned_desk_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.last_assigned_desk_at);
      },
    },
    {
      id: "ftd_amount",
      label: "FTD Amount",
      enabled: false,
    },
    {
      id: "ftd_owner_name",
      label: "FTD Owner",
      enabled: false,
      headerRender: () => (
        <FtdOwnerFilter updateFilters={updateFilters} />
      ),
    },
    {
      id: "ftd_date",
      label: "FTD Date",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="FTD DATE"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.ftd_date_start}
          setFilter={(val) => {
            updateFilters({ ftd_date_start: val });
          }}
          filter2={filters?.ftd_date_end}
          setFilter2={(val) => {
            updateFilters({ ftd_date_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.ftd_date);
      },
    },
    {
      id: "first_lead_campaign",
      enabled: false,
      label: "First Lead Campaign",
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="FIRST LEAD CAMPAIGN"
          placeholder="First lead campaign..."
          filter={filters?.first_lead_campaign}
          setFilter={(val) => {
            updateFilters({ first_lead_campaign: val });
          }}
        />
      ),
    },
    {
      id: "first_lead_description",
      enabled: false,
      label: "First Lead Description",
    },
    {
      id: "last_lead_campaign",
      enabled: false,
      label: "Last Lead Campaign",
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="LAST LEAD CAMPAIGN"
          placeholder="Last lead campaign..."
          filter={filters?.last_lead_campaign}
          setFilter={(val) => {
            updateFilters({ last_lead_campaign: val });
          }}
        />
      ),
    },
    (user?.acc?.acc_v_last_trade_at === undefined ||
      user?.acc?.acc_v_last_trade_at) && {
      id: "last_trade_at",
      label: "Last Trade At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="LAST TRADE AT"
          isRange
          subLabel1="Last Trade Start"
          subLabel2="Last Trade End"
          filter={filters?.last_trade_at_start}
          setFilter={(val) => {
            updateFilters({ last_trade_at_start: val });
          }}
          filter2={filters?.last_trade_at_end}
          setFilter2={(val) => {
            updateFilters({ last_trade_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return row?.last_trade_at ? (
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {toLocalTime(row?.last_trade_at)}
          </Typography>
        ) : null;
      },
    },
    (user?.acc?.acc_v_open_pnl === undefined || user?.acc?.acc_v_open_pnl) && {
      id: "open_pnl",
      label: "Open PNL",
      enabled: false,
      hasSort: false,
      render: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }}>
          {row?.open_pnl || row?.open_pnl === 0
            ? row?.open_pnl?.toFixed(2)
            : ""}
        </Typography>
      ),
    },
    (user?.acc?.acc_v_close_pnl === undefined || user?.acc?.acc_v_open_pnl) && {
      id: "close_pnl",
      label: "Close PNL",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="CLOSE PNL"
          type="number"
          placeholder="Min close pnl ..."
          filter={filters?.close_pnl}
          setFilter={(val) => {
            updateFilters({ close_pnl: val });
          }}
          isRange
          placeholder2="Max close pnl ..."
          filter2={filters?.lte_close_pnl}
          setFilter2={(val) => {
            updateFilters({ lte_close_pnl: val });
          }}
        />
      ),
      render: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }}>
          {row?.close_pnl}
        </Typography>
      ),
    },
    (company?.company_wallet_system && user?.acc?.acc_v_active_wallets &&
      wallets?.find((w) => w?.name === "Tron")?.enabled === true) ||
      (company?.company_wallet_system && user?.acc?.acc_v_inactive_wallets &&
        wallets?.find((w) => w?.name === "Tron")?.enabled === false)
      ? {
        id: "tron_wallet",
        label: "Tron Wallet",
        enabled: false,
        headerRender: () => (
          <FilterInput
            label="TRON WALLET"
            type="text"
            placeholder="Tron wallet address..."
            filter={filters?.tron_wallet}
            setFilter={(val) => {
              updateFilters({ tron_wallet: val });
            }}
          />
        ),
      }
      : null,
    (company?.company_wallet_system && user?.acc?.acc_v_active_wallets &&
      wallets?.find((w) => w?.name === "Ethereum")?.enabled === true) ||
      (company?.company_wallet_system && user?.acc?.acc_v_inactive_wallets &&
        wallets?.find((w) => w?.name === "Ethereum")?.enabled === false)
      ? {
        id: "ethereum_wallet",
        label: "Ethereum Wallet",
        enabled: false,
        headerRender: () => (
          <FilterInput
            label="ETHEREUM WALLET"
            type="text"
            placeholder="Ethereum wallet address..."
            filter={filters?.ethereum_wallet}
            setFilter={(val) => {
              updateFilters({ ethereum_wallet: val });
            }}
          />
        ),
      }
      : null,
    (company?.company_wallet_system && user?.acc?.acc_v_active_wallets &&
      wallets?.find((w) => w?.name === "Bitcoin")?.enabled === true) ||
      (company?.company_wallet_system && user?.acc?.acc_v_inactive_wallets &&
        wallets?.find((w) => w?.name === "Bitcoin")?.enabled === false)
      ? {
        id: "bitcoin_wallet",
        label: "Bitcoin Wallet",
        enabled: false,
        headerRender: () => (
          <FilterInput
            label="BITCOIN WALLET"
            type="text"
            placeholder="Bitcoin wallet address..."
            filter={filters?.bitcoin_wallet}
            setFilter={(val) => {
              updateFilters({ bitcoin_wallet: val });
            }}
          />
        ),
      }
      : null,
    (user?.acc?.acc_v_client_deposit_count === undefined || user?.acc?.acc_v_client_deposit_count) && {
      id: "deposit_count",
      label: "Deposit Count", 
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="DEPOSIT COUNT"
          type="number"
          placeholder="Min deposit count..."
          filter={filters?.deposit_count}
          setFilter={(val) => {
            updateFilters({ deposit_count: val });
          } }
          isRange
          placeholder2="Max deposit count..."
          filter2={filters?.lte_deposit_count}
          setFilter2={(val) => {
            updateFilters({ lte_deposit_count: val });
          } } />
      ),
    },
    user?.acc?.acc_v_client_first_deposit && {
      id: "first_deposit",
      label: "First Deposit",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="FIRST DEPOSIT"
          type="number"
          placeholder="Min first deposit..."
          filter={filters?.first_deposit}
          setFilter={(val) => {
            updateFilters({ first_deposit: val });
          }}
          isRange
          placeholder2="Max first deposit..."
          filter2={filters?.lte_first_deposit}
          setFilter2={(val) => {
            updateFilters({ lte_first_deposit: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_first_deposit && {
      id: "first_deposit_date",
      label: "First Deposit Date",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="FIRST DEPOSIT DATE"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.first_deposit_date_start}
          setFilter={(val) => {
            updateFilters({ first_deposit_date_start: val });
          }}
          filter2={filters?.first_deposit_date_end}
          setFilter2={(val) => {
            updateFilters({ first_deposit_date_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.first_deposit_date);
      },
    },
    user?.acc?.acc_v_client_second_deposit && {
      id: "second_deposit",
      label: "Second Deposit",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="SECOND DEPOSIT"
          type="number"
          placeholder="Min second deposit..."
          filter={filters?.second_deposit}
          setFilter={(val) => {
            updateFilters({ second_deposit: val });
          }}
          isRange
          placeholder2="Max second deposit..."
          filter2={filters?.lte_second_deposit}
          setFilter2={(val) => {
            updateFilters({ lte_second_deposit: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_second_deposit && {
      id: "second_deposit_date",
      label: "Second Deposit Date",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="SECOND DEPOSIT DATE"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.second_deposit_date_start}
          setFilter={(val) => {
            updateFilters({ second_deposit_date_start: val });
          }}
          filter2={filters?.second_deposit_date_end}
          setFilter2={(val) => {
            updateFilters({ second_deposit_date_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.second_deposit_date);
      },
    },
    user?.acc?.acc_v_client_third_deposit && {
      id: "third_deposit",
      label: "Third Deposit",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="THIRD DEPOSIT"
          type="number"
          placeholder="Min third deposit..."
          filter={filters?.third_deposit}
          setFilter={(val) => {
            updateFilters({ third_deposit: val });
          }}
          isRange
          placeholder2="Max third deposit..."
          filter2={filters?.lte_third_deposit}
          setFilter2={(val) => {
            updateFilters({ lte_third_deposit: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_third_deposit && {
      id: "third_deposit_date",
      label: "Third Deposit Date",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="THIRD DEPOSIT DATE"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.third_deposit_date_start}
          setFilter={(val) => {
            updateFilters({ third_deposit_date_start: val });
          }}
          filter2={filters?.third_deposit_date_end}
          setFilter2={(val) => {
            updateFilters({ third_deposit_date_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.third_deposit_date);
      },
    },
    user?.acc?.acc_v_client_last_deposit && {
      id: "last_deposit",
      label: "Last Deposit",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="Last Deposit"
          type="number"
          placeholder="Min last deposit..."
          filter={filters?.last_deposit}
          setFilter={(val) => {
            updateFilters({ last_deposit: val });
          }}
          isRange
          placeholder2="Max last deposit..."
          filter2={filters?.lte_last_deposit}
          setFilter2={(val) => {
            updateFilters({ lte_last_deposit: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_last_deposit && {
      id: "last_deposit_date",
      label: "Last Deposit Date",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="Last Deposit Date"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.last_deposit_date_start}
          setFilter={(val) => {
            updateFilters({ last_deposit_date_start: val });
          }}
          filter2={filters?.last_deposit_date_end}
          setFilter2={(val) => {
            updateFilters({ last_deposit_date_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.last_deposit_date);
      },
    },
    {
      id: "total_deposit",
      label: "Total Deposit",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="TOTAL DEPOSIT"
          type="number"
          placeholder="Min total deposit..."
          filter={filters?.total_deposit}
          setFilter={(val) => {
            updateFilters({ total_deposit: val });
          }}
          isRange
          placeholder2="Max total deposit..."
          filter2={filters?.lte_total_deposit}
          setFilter2={(val) => {
            updateFilters({ lte_total_deposit: val });
          }}
        />
      ),
    },
    (user?.acc?.acc_v_client_avg_deposit === undefined || user?.acc?.acc_v_client_avg_deposit) && {
      id: "avg_deposit",
      label: "Average Deposit", 
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="AVERAGE DEPOSIT"
          type="number"
          placeholder="Min average deposit..."
          filter={filters?.avg_deposit}
          setFilter={(val) => {
            updateFilters({ avg_deposit: val });
          } }
          isRange
          placeholder2="Max average deposit..."
          filter2={filters?.lte_avg_deposit}
          setFilter2={(val) => {
            updateFilters({ lte_avg_deposit: val });
          }} 
        />
      ),
    },
    (user?.acc?.acc_v_client_net_deposit === undefined || user?.acc?.acc_v_client_net_deposit )&& {
      id: "net_deposit",
      label: "Net Deposit",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="NET DEPOSIT"
          type="number"
          placeholder="Min net deposit..."
          filter={filters?.net_deposit  }
          setFilter={(val) => {
            updateFilters({ net_deposit : val });
          }}
          isRange
          placeholder2="Max net deposit..."
          filter2={filters?.lte_net_deposit}
          setFilter2={(val) => {
            updateFilters({ lte_net_deposit: val });
          }}
        />
      ),
    },
    (user?.acc?.acc_v_client_net_financial === undefined || user?.acc?.acc_v_client_net_financial) && {
      id: "net_financial",
      label: "Net Financial",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="NET FINANCIAL"
          type="number"
          placeholder="Min net financial..."
          filter={filters?.net_financial  }
          setFilter={(val) => {
            updateFilters({ net_financial : val });
          }}
          isRange
          placeholder2="Max net financial..."
          filter2={filters?.lte_net_financial}
          setFilter2={(val) => {
            updateFilters({ lte_net_financial: val });
          }}
        />
      ),
    },
    (user?.acc?.acc_v_client_total_withdrawal === undefined || user?.acc?.acc_v_client_total_withdrawal) && {
      id: "total_withdrawal",
      label: "Total Withdrawal",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="TOTAL WITHDRAWAL"
          type="number"
          placeholder="Min total withdrawal..."
          filter={filters?.total_withdrawal}
          setFilter={(val) => {
            updateFilters({ total_withdrawal: val });
          }}
          isRange
          placeholder2="Max total withdrawal..."
          filter2={filters?.lte_total_withdrawal}
          setFilter2={(val) => {
            updateFilters({ lte_total_withdrawal: val });
          }}
        />
      ),
    },
    (user?.acc?.acc_v_client_last_withdrawal === undefined || user?.acc?.acc_v_client_last_withdrawal) && {
      id: "last_withdrawal",
      label: "Last Withdrawal",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="Last Withdrawal"
          type="number"
          placeholder="Min last withdrawal..."
          filter={filters?.last_withdrawal}
          setFilter={(val) => {
            updateFilters({ last_withdrawal: val });
          }}
          isRange
          placeholder2="Max last withdrawal..."
          filter2={filters?.lte_last_withdrawal}
          setFilter2={(val) => {
            updateFilters({ lte_last_withdrawal: val });
          }}
        />
      ),
    },
    (user?.acc?.acc_v_client_last_withdrawal_date === undefined || user?.acc?.acc_v_client_last_withdrawal_date) && {
      id: "last_withdrawal_date",
      label: "Last Withdrawal Date",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="Last Withdrawal Date"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.last_withdrawal_date_start}
          setFilter={(val) => {
            updateFilters({ last_withdrawal_date_start: val });
          }}
          filter2={filters?.last_withdrawal_date_end}
          setFilter2={(val) => {
            updateFilters({ last_withdrawal_date_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.last_withdrawal_date);
      },
    },
    (user?.acc?.acc_v_client_withdrawal_count === undefined || user?.acc?.acc_v_client_withdrawal_count) && {
      id: "withdrawal_count",
      label: "Withdrawal Count", 
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="WITHDRAWAL COUNT"
          type="number"
          placeholder="Min withdrawal count..."
          filter={filters?.withdrawal_count}
          setFilter={(val) => {
            updateFilters({ withdrawal_count: val });
          } }
          isRange
          placeholder2="Max withdrawal count..."
          filter2={filters?.lte_withdrawal_count}
          setFilter2={(val) => {
            updateFilters({ lte_withdrawal_count: val });
          }} 
        />
      ),
    },
    (user?.acc?.acc_v_client_total_bet_amount === undefined || user?.acc?.acc_v_client_total_bet_amount) && company?.company_type === 2 && {
      id: "total_bet_amount",
      label: "Total Bet Amount", 
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="TOTAL BET AMOUNT"
          type="number"
          placeholder="Min total bet amount..."
          filter={filters?.total_bet_amount}
          setFilter={(val) => {
            updateFilters({ total_bet_amount: val });
          } }
          isRange
          placeholder2="Max total bet amount..."
          filter2={filters?.lte_total_bet_amount}
          setFilter2={(val) => {
            updateFilters({ lte_total_bet_amount: val });
          }} 
        />
      ),
    },
    (user?.acc?.acc_v_client_total_win_amount === undefined || user?.acc?.acc_v_client_total_win_amount) && company?.company_type === 2 && {
      id: "total_win_amount",
      label: "Total Win Amount", 
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="TOTAL WIN AMOUNT"
          type="number"
          placeholder="Min total win amount..."
          filter={filters?.total_win_amount}
          setFilter={(val) => {
            updateFilters({ total_win_amount: val });
          } }
          isRange
          placeholder2="Max total win amount..."
          filter2={filters?.lte_total_win_amount}
          setFilter2={(val) => {
            updateFilters({ lte_total_win_amount: val });
          }} 
        />
      ),
    },
    (user?.acc?.acc_v_client_win_rate === undefined || user?.acc?.acc_v_client_win_rate) && company?.company_type === 2 && {
      id: "win_rate",
      label: "Win Rate", 
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="WIN RATE"
          type="number"
          placeholder="Min win rate..."
          filter={filters?.win_rate}
          setFilter={(val) => {
            updateFilters({ win_rate: val });
          } }
          isRange
          placeholder2="Max win rate..."
          filter2={filters?.lte_win_rate}
          setFilter2={(val) => {
            updateFilters({ lte_win_rate: val });
          }} 
        />
      ),
    },
    (user?.acc?.acc_v_client_avg_bet_amount === undefined || user?.acc?.acc_v_client_avg_bet_amount) && company?.company_type === 2 && {
      id: "avg_bet_amount",
      label: "Average Bet Amount", 
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="AVERAGE BET AMOUNT"
          type="number"
          placeholder="Min average bet amount..."
          filter={filters?.avg_bet_amount}
          setFilter={(val) => {
            updateFilters({ avg_bet_amount: val });
          } }
          isRange
          placeholder2="Max average bet amount..."
          filter2={filters?.lte_avg_bet_amount}
          setFilter2={(val) => {
            updateFilters({ lte_avg_bet_amount: val });
          }} 
        />
      ),
    },
    (user?.acc?.acc_v_client_bet_count === undefined || user?.acc?.acc_v_client_bet_count) && company?.company_type === 2 && {
      id: "bet_count",
      label: "Bet Count", 
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="BET COUNT"
          type="number"
          placeholder="Min bet count..."
          filter={filters?.bet_count}
          setFilter={(val) => {
            updateFilters({ bet_count: val });
          } }
          isRange
          placeholder2="Max bet count..."
          filter2={filters?.lte_bet_count}
          setFilter2={(val) => {
            updateFilters({ lte_bet_count: val });
          }} 
        />
      ),
    },
    (user?.acc?.acc_v_client_ggr === undefined || user?.acc?.acc_v_client_ggr) && company?.company_type === 2 && {
      id: "ggr",
      label: "GGR", 
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="GGR"
          type="number"
          placeholder="Min ggr..."
          filter={filters?.ggr}
          setFilter={(val) => {
            updateFilters({ ggr: val });
          } }
          isRange
          placeholder2="Max ggr..."
          filter2={filters?.lte_ggr}
          setFilter2={(val) => {
            updateFilters({ lte_ggr: val });
          }} 
        />
      ),
    },
    {
      id: "kyc_id_status",
      label: "KYC ID Status",
      enabled: true,
      headerRender: () => (
        <KycIdStatusFilter updateFilters={updateFilters} />
      ),
    },
    {
      id: "kyc_billing_status",
      label: "KYC Billing Status",
      enabled: true,
      headerRender: () => (
        <KycBillingStatusFilter updateFilters={updateFilters} />
      ),
    },
    user?.acc?.acc_v_client_first_desk_name && {
      id: "first_desk_name",
      label: "First Desk Name",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="First Desk Name"
          placeholder="First desk name..."
          filter={filters?.first_desk_name}
          setFilter={(val) => {
            updateFilters({ first_desk_name: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_second_desk_name && {
      id: "second_desk_name",
      label: "Second Desk Name",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="Second Desk Name"
          placeholder="Second desk name..."
          filter={filters?.second_desk_name}
          setFilter={(val) => {
            updateFilters({ second_desk_name: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_third_desk_name && {
      id: "third_desk_name",
      label: "Third Desk Name",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="Third Desk Name"
          placeholder="Third desk name..."
          filter={filters?.third_desk_name}
          setFilter={(val) => {
            updateFilters({ third_desk_name: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_first_assigned_agent && {
      id: "first_assigned_agent_id",
      label: "First Assigned Agent ID",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="First Assigned Agent ID"
          placeholder="ID..."
          filter={filters?.first_assigned_agent_id}
          setFilter={(val) => {
            updateFilters({ first_assigned_agent_id: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_first_assigned_agent && {
      id: "first_assigned_agent_name",
      label: "First Assigned Agent Name",
      enabled: false,
      headerRender: () => (
        <FirstAgent />
      ),
    },
    user?.acc?.acc_v_client_first_assigned_agent && {
      id: "first_assigned_agent_at",
      label: "First Assigned Agent At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="FIRST ASSIGNED AGENT AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.first_assigned_agent_at_start}
          setFilter={(val) => {
            updateFilters({ first_assigned_agent_at_start: val });
          }}
          filter2={filters?.first_assigned_agent_at_end}
          setFilter2={(val) => {
            updateFilters({ first_assigned_agent_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.first_assigned_agent_at);
      },
    },

    user?.acc?.acc_v_client_second_assigned_agent && {
      id: "second_assigned_agent_id",
      label: "Second Assigned Agent ID",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="Second Assigned Agent ID"
          placeholder="ID..."
          filter={filters?.second_assigned_agent_id}
          setFilter={(val) => {
            updateFilters({ second_assigned_agent_id: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_second_assigned_agent && {
      id: "second_assigned_agent_name",
      label: "Second Assigned Agent Name",
      enabled: false,
      headerRender: () => (
        <SecondAgent updateFilters={updateFilters} />
      ),
    },
    user?.acc?.acc_v_client_second_assigned_agent && {
      id: "second_assigned_agent_at",
      label: "Second Assigned Agent At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="SECOND ASSIGNED AGENT AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.second_assigned_agent_at_start}
          setFilter={(val) => {
            updateFilters({ second_assigned_agent_at_start: val });
          }}
          filter2={filters?.second_assigned_agent_at_end}
          setFilter2={(val) => {
            updateFilters({ second_assigned_agent_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.second_assigned_agent_at);
      },
    },

    user?.acc?.acc_v_client_third_assigned_agent && {
      id: "third_assigned_agent_id",
      label: "Third Assigned Agent ID",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="Third Assigned Agent ID"
          placeholder="ID..."
          filter={filters?.third_assigned_agent_id}
          setFilter={(val) => {
            updateFilters({ third_assigned_agent_id: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_third_assigned_agent && {
      id: "third_assigned_agent_name",
      label: "Third Assigned Agent Name",
      enabled: false,
      headerRender: () => (
        <ThirdAgent updateFilters={updateFilters} />
      ),
    },
    user?.acc?.acc_v_client_second_assigned_agent && {
      id: "third_assigned_agent_at",
      label: "Third Assigned Agent At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="THIRD ASSIGNED AGENT AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.third_assigned_agent_at_start}
          setFilter={(val) => {
            updateFilters({ third_assigned_agent_at_start: val });
          }}
          filter2={filters?.third_assigned_agent_at_end}
          setFilter2={(val) => {
            updateFilters({ third_assigned_agent_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.third_assigned_agent_at);
      },
    },
    user?.acc?.acc_v_client_last_assigned_agent && {
      id: "last_assigned_agent_id",
      label: "Last Assigned Agent ID",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="last Assigned Agent ID"
          placeholder="ID..."
          filter={filters?.last_assigned_agent_id}
          setFilter={(val) => {
            updateFilters({ last_assigned_agent_id: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_last_assigned_agent && {
      id: "last_assigned_agent_name",
      label: "Last Assigned Agent Name",
      enabled: false,
      headerRender: () => (
        <LastAgent updateFilters={updateFilters} />
      ),
    },
    user?.acc?.acc_v_client_last_assigned_agent && {
      id: "last_assigned_agent_at",
      label: "Last Assigned Agent At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="LAST ASSIGNED AGENT AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.last_assigned_agent_at_start}
          setFilter={(val) => {
            updateFilters({ last_assigned_agent_at_start: val });
          }}
          filter2={filters?.last_assigned_agent_at_end}
          setFilter2={(val) => {
            updateFilters({ last_assigned_agent_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.last_assigned_agent_at);
      },
    },
    user?.acc?.acc_v_client_first_call && {
      id: "first_call_at",
      label: "First Call At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="FIRST CALL AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.first_call_at_start}
          setFilter={(val) => {
            updateFilters({ first_call_at_start: val });
          }}
          filter2={filters?.first_call_at_end}
          setFilter2={(val) => {
            updateFilters({ first_call_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.first_call_at);
      },
    },
    user?.acc?.acc_v_client_first_call && {
      id: "first_call_by",
      label: "First Call By",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="First Call By"
          placeholder="First Call By..."
          filter={filters?.first_call_by}
          setFilter={(val) => {
            updateFilters({ first_call_by: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_first_call && {
      id: "first_caller_name",
      label: "First Caller Name",
      enabled: false,
      headerRender: () => (
        <FirstCaller updateFilters={updateFilters} />
      ),
    },

    user?.acc?.acc_v_client_second_call && {
      id: "second_call_at",
      label: "Second Call At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="SECOND CALL AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.second_call_at_start}
          setFilter={(val) => {
            updateFilters({ second_call_at_start: val });
          }}
          filter2={filters?.second_call_at_end}
          setFilter2={(val) => {
            updateFilters({ second_call_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.second_call_at);
      },
    },
    user?.acc?.acc_v_client_second_call && {
      id: "second_call_by",
      label: "Second Call By",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="Second Call By"
          placeholder="Second Call By..."
          filter={filters?.second_call_by}
          setFilter={(val) => {
            updateFilters({ second_call_by: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_second_call && {
      id: "second_caller_name",
      label: "Second Caller Name",
      enabled: false,
      headerRender: () => (
        <SecondCaller updateFilters={updateFilters} />
      ),
    },

    user?.acc?.acc_v_client_third_call && {
      id: "third_call_at",
      label: "Third Call At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="THIRD CALL AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.third_call_at_start}
          setFilter={(val) => {
            updateFilters({ third_call_at_start: val });
          }}
          filter2={filters?.third_call_at_end}
          setFilter2={(val) => {
            updateFilters({ third_call_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.third_call_at);
      },
    },
    user?.acc?.acc_v_client_third_call && {
      id: "third_call_by",
      label: "Third Call By",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="Third Call By"
          placeholder="Third Call By..."
          filter={filters?.third_call_by}
          setFilter={(val) => {
            updateFilters({ third_call_by: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_third_call && {
      id: "third_caller_name",
      label: "Third Caller Name",
      enabled: false,
      headerRender: () => (
        <ThirdCaller updateFilters={updateFilters} />
      ),
    },

    user?.acc?.acc_v_client_frd_owner && {
      id: "frd_owner_id",
      label: "FRD Owner ID",
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="FRD Owner ID"
          placeholder="ID..."
          filter={filters?.frd_owner_id}
          setFilter={(val) => {
            updateFilters({ frd_owner_id: val });
          }}
        />
      ),
    },
    user?.acc?.acc_v_client_frd_owner && {
      id: "frd_owner_name",
      label: "FRD Owner Name",
      enabled: false,
      headerRender: () => (
        <FrdOwner updateFilters={updateFilters} />
      ),
    },
    user?.acc?.acc_v_client_frd_owner && {
      id: "frd_date",
      label: "FRD Date",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="FRD DATE"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.frd_date_start}
          setFilter={(val) => {
            updateFilters({ frd_date_start: val });
          }}
          filter2={filters?.frd_date_end}
          setFilter2={(val) => {
            updateFilters({ frd_date_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.frd_date);
      },
    },
    user?.acc?.acc_v_client_frd_owner && {
      id: "frd_amount",
      label: "FRD Amount",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="FRD AMOUNT"
          type="number"
          placeholder="Min amount..."
          filter={filters?.frd_amount}
          setFilter={(val) => {
            updateFilters({ frd_amount: val });
          }}
          isRange
          placeholder2="Max amount..."
          filter2={filters?.lte_frd_amount}
          setFilter2={(val) => {
            updateFilters({ lte_frd_amount: val });
          }}
        />
      ),
    },
    (user?.acc?.acc_v_total_called === undefined || user?.acc?.acc_v_total_called) && {
      id: "total_called",
      label: "Total Called",
      enabled: false,
      headerRender: () => (
        <FilterInput
          label="TOTAL CALLED"
          type="number"
          placeholder="Min total called ..."
          filter={filters?.total_called}
          setFilter={(val) => {
            updateFilters({ total_called: val });
          }}
          isRange
          placeholder2="Max total called ..."
          filter2={filters?.lte_total_called}
          setFilter2={(val) => {
            updateFilters({ lte_total_called: val });
          }}
        />
      ),
      render: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }}>
          {row?.total_called}
        </Typography>
      ),
    },
    (user?.acc?.acc_v_total_brand_status === undefined || user?.acc?.acc_v_total_brand_status) && {
      id: "total_brand_status",
      label: "Total Brand Status",
      enabled: false,
    },
    (user?.acc?.acc_v_reaction_time === undefined || user?.acc?.acc_v_reaction_time) && {
      id: "reaction_time",
      label: "Reaction Time",
      enabled: false,
    },
    (user?.acc?.acc_v_first_status_changed_at === undefined || user?.acc?.acc_v_first_status_changed_at) && {
      id: "first_status_changed_at",
      label: "First Status Changed At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="FIRST STATUS CHANGED AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.first_status_changed_at_start}
          setFilter={(val) => {
            updateFilters({ first_status_changed_at_start: val });
          }}
          filter2={filters?.first_status_changed_at_end}
          setFilter2={(val) => {
            updateFilters({ first_status_changed_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.first_status_changed_at);
      },
    },
    (user?.acc?.acc_v_last_status_changed_at === undefined || user?.acc?.acc_v_last_status_changed_at) && {
      id: "last_status_changed_at",
      label: "Last Status Changed At",
      enabled: false,
      headerRender: () => (
        <FilterDateTime
          label="LAST STATUS CHANGED AT"
          isRange
          subLabel1="Start"
          subLabel2="End"
          filter={filters?.last_status_changed_at_start}
          setFilter={(val) => {
            updateFilters({ last_status_changed_at_start: val });
          }}
          filter2={filters?.last_status_changed_at_end}
          setFilter2={(val) => {
            updateFilters({ last_status_changed_at_end: val });
          }}
        />
      ),
      render: (row) => {
        return toLocalTime(row?.last_status_changed_at);
      },
    },
    (user?.acc?.acc_v_last_comment === undefined || user?.acc?.acc_v_last_comment) && {
      id: "last_comment",
      label: "Last Comment",
      enabled: false,
      render: (row) => {
        const name = row?.last_comment_by;
        const comment = row?.last_comment_text;
        
        const handleCopy = () => {
          if (name && comment) {
            copyToClipboard(comment);
          }
        };

        return (
          <Stack 
            direction="row" 
            alignItems="center" 
            gap={1}
          >
            <Stack direction="row" alignItems="center" gap={1} sx={{ whiteSpace: "nowrap", color: 'text.secondary' }}>
              {name && comment ? (
                <>
                  <Box component="span" sx={{ color: 'text.primary' }}>{name} :</Box>
                  <Tooltip
                    arrow
                    title={
                      (<Stack direction="row" alignItems="center" gap={1} sx={{ backgroundColor: (theme) => theme.palette.mode === 'light' ? 'neutral.100' : 'neutral.800',  borderRadius: 1, fontSize: 13, m: -1, p: 1, border: '1px solid', borderColor: 'divider' }}>
                        {`${comment}`}
                      </Stack>)
                    }
                  >
                    <Box component="span" sx={{ color: 'text.secondary', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>{`${comment}`}</Box>
                  </Tooltip>
                </>
              ) : (
                row?.last_comment || 'No comment'
              )}
            </Stack>
            {name && comment && (
              <IconButton 
                onClick={handleCopy}
                className="copy-icon"
                sx={{ 
                  color: 'primary.main',
                }}
              >
                <Iconify icon="mdi:content-copy" width={20} />
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      id: "equity",
      label: "Equity",
      enabled: false,
    },
    {
      id: "free_margin",
      label: "Free Margin",
      enabled: false,
    },
    {
      id: "margine_level",
      label: "Margin Level",
      enabled: false,
    },
    {
      id: "used_margin",
      label: "Used Margin",
      enabled: false,
    },
    {
      id: "closed_pl",
      label: "Closed PL",
      enabled: false,
    },
    {
      id: "credit",
      label: "Credit",
      enabled: false,
    },
  ];

  const [defaultColumn, setDefaultColumn] = useState(DEFAULT_COLUMN);

  const prevColumn = useRef();

  useEffect(() => {
    if (customFilters?.length) {
      if (JSON.stringify(prevColumn.current) !== JSON.stringify([...DEFAULT_COLUMN, ...customFilters])) {
        setDefaultColumn([...DEFAULT_COLUMN, ...customFilters]);
        prevColumn.current = [...DEFAULT_COLUMN, ...customFilters];
      }
    } else {
      if (JSON.stringify(prevColumn.current) !== JSON.stringify([...DEFAULT_COLUMN])) {
        setDefaultColumn([...DEFAULT_COLUMN]);
        prevColumn.current = [...DEFAULT_COLUMN];
      }
    }
  }, [
    wallets,
    filters,
    rule,
    customFilters,
  ]);

  useEffect(() => {
    if (!columnSettings?.iBRequestTable && customFilters?.length) {
      const updateSetting = {
        ...columnSettings,
        iBRequestTable: [...DEFAULT_COLUMN, ...customFilters],
      };
      setRule(updateSetting?.iBRequestTable);
    } else if (!columnSettings?.iBRequestTable) {
      const updateSetting = {
        ...columnSettings,
        iBRequestTable: [...DEFAULT_COLUMN],
      };
      setRule(updateSetting?.iBRequestTable);
    }
  }, [customFilters, columnSettings, filters]);


  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = defaultColumn
        ?.filter((column) => column)
        ?.map((item) => ({
          ...item,
          enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled ?? defaultColumn?.find((defaultItem) => item?.id === defaultItem?.id)?.enabled ?? true,
          order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
          subEnabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)
            ?.subEnabled,
        }))
        ?.sort((a, b) => a.order - b.order);
      return updateColumn;
    } else {
      return defaultColumn?.map((item, index) => ({
        ...item,
        order: index,
      }));
    }
  }, [
    rule,
    defaultColumn,
    filters,
  ]);

  return { tableColumn, defaultColumn };
}
