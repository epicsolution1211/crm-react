import { useCallback, useEffect, useMemo, useState, useReducer, lazy, Suspense, memo, useRef } from "react";
import { differenceInMinutes } from "date-fns";
import { toast } from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import isEqual from "lodash.isequal";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { ChatPhoneNumberSelect } from "src/sections/dashboard/chat/chat-phone-number-select";
import { ChatReminder } from "src/sections/dashboard/chat/chat-reminder";
import { CompanyLabelPanel } from "src/sections/dashboard/customer/customer-company-label";
import { CustomerBasicDetails } from "src/sections/dashboard/customer/customer-basic-details";
import { CustomerCustomFields } from "src/sections/dashboard/customer/customer-custom-fields";
import { CustomerDataManagement } from "src/sections/dashboard/customer/customer-data-management";
import { CustomerDesk } from "src/sections/dashboard/customer/customer-desk";
import { CustomerInsight } from "src/sections/dashboard/customer/customer-insight";
import { QuickActionDetail } from "src/sections/dashboard/customer/quick-action-detail";

// Memoized components to prevent unnecessary re-renders
const MemoizedCustomerBasicDetails = memo(CustomerBasicDetails);
const MemoizedCompanyLabelPanel = memo(CompanyLabelPanel);
const MemoizedCustomerDesk = memo(CustomerDesk);
const MemoizedCustomerInsight = memo(CustomerInsight);
const MemoizedCustomerCustomFields = memo(CustomerCustomFields);
const MemoizedQuickActionDetail = memo(QuickActionDetail);
const MemoizedCustomerDataManagement = memo(CustomerDataManagement);
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { countries } from "src/utils/constant";
import { customersApi } from "src/api/customers";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { usePopover } from "src/hooks/use-popover";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { useTwilio } from "src/hooks/use-twilio";
import { customerFieldsApi } from "src/api/customer-fields";
import { commentsApi } from "src/api/comments";
import { thunks } from "src/thunks/customers";
import { slice } from "src/slices/customers";
import { getAPIUrl } from "src/config";
import { settingsApi } from "src/api/settings";
import { defaultColumn } from "src/sections/dashboard/customer/customer-info-modal";
import { baseCustomerDetailTabs } from "src/sections/dashboard/customer/customer-order-tabs";
import { Iconify } from 'src/components/iconify';
import { useCallProfiles } from 'src/hooks/call-system/useCallProfiles';
import { CustomerAISummary } from 'src/sections/dashboard/customer/customer-ai-summary';
import { useTimezone } from "src/hooks/use-timezone";

// Lazy load dialog components to prevent unnecessary rendering and API calls
const BulkUpdateFields = lazy(() => import("src/sections/dashboard/customer/bulk-update-fields").then(module => ({ default: module.BulkUpdateFields })));
const CustomerInfoModal = lazy(() => import("src/sections/dashboard/customer/customer-info-modal").then(module => ({ default: module.CustomerInfoModal })));
const CustomerOrderTabs = lazy(() => import("src/sections/dashboard/customer/customer-order-tabs").then(module => ({ default: module.CustomerOrderTabs })));
const CustomerAssignFormDialog = lazy(() => import("src/sections/dashboard/customer/customer-assign-form-dialog").then(module => ({ default: module.CustomerAssignFormDialog })));
const CustomerCreateComment = lazy(() => import("src/sections/dashboard/customer/customer-create-comment").then(module => ({ default: module.CustomerCreateComment })));

// Loading fallback component
const TabLoadingFallback = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: '200px',
    p: 3 
  }}>
    <CircularProgress />
  </Box>
);

// Lazy load heavy tab components
const CustomerAnalytics = lazy(() => import("src/sections/dashboard/customer/customer-analytics").then(module => ({ default: module.CustomerAnalytics })));
const CustomerCommentsTab = lazy(() => import("src/sections/dashboard/customer/customer-comments-tab").then(module => ({ default: module.CustomerCommentsTab })));
const CustomerLeadSource = lazy(() => import("src/sections/dashboard/customer/customer-lead-source").then(module => ({ default: module.CustomerLeadSource })));
const CustomerIB = lazy(() => import("src/sections/dashboard/customer/customer-ib").then(module => ({ default: module.CustomerIB })));
const CustomerNote = lazy(() => import("src/sections/dashboard/customer/customer-note").then(module => ({ default: module.CustomerNote })));
const CustomerPosition = lazy(() => import("src/sections/dashboard/customer/customer-position").then(module => ({ default: module.CustomerPosition })));
const CustomerTransaction = lazy(() => import("src/sections/dashboard/customer/customer-transaction").then(module => ({ default: module.CustomerTransaction })));
const CustomerWallets = lazy(() => import("src/sections/dashboard/customer/customer-wallets").then(module => ({ default: module.CustomerWallets })));
const CustomerTraderSettings = lazy(() => import("src/sections/dashboard/customer/customer-trader-settings").then(module => ({ default: module.CustomerTraderSettings })));
const CustomerPosts = lazy(() => import("src/sections/dashboard/customer/customer-posts").then(module => ({ default: module.CustomerPosts })));
const CustomerKyc = lazy(() => import("src/sections/dashboard/customer/customer-kyc").then(module => ({ default: module.CustomerKyc })));
const CustomerLogs = lazy(() => import("src/sections/dashboard/customer/customer-logs/logs").then(module => ({ default: module.Logs })));
const CustomerIcoContracts = lazy(() => import("src/sections/dashboard/customer/customer-ico-contracts").then(module => ({ default: module.CustomerIcoContracts })));
const CustomerSavingAccounts = lazy(() => import("src/sections/dashboard/customer/customer-saving-accounts").then(module => ({ default: module.CustomerSavingAccounts })));
const CustomerForms = lazy(() => import("src/sections/dashboard/customer/customer-forms").then(module => ({ default: module.CustomerForms })));
const CustomerPspLinks = lazy(() => import("src/sections/dashboard/customer/customer-psp-links").then(module => ({ default: module.CustomerPspLinks })));
const CustomerAnnouncements = lazy(() => import("src/sections/dashboard/customer/customer-announcements").then(module => ({ default: module.CustomerAnnouncements })));
const CustomerSecurityReport = lazy(() => import("src/sections/dashboard/customer/customer-security-report").then(module => ({ default: module.CustomerSecurityReport })));
const CustomerCalls = lazy(() => import("src/sections/dashboard/customer/customer-calls").then(module => ({ default: module.CustomerCalls })));
const CustomerBets = lazy(() => import("src/sections/dashboard/customer/customer-bets").then(module => ({ default: module.CustomerBets })));

// State management reducers for better performance
const dialogReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_DIALOG':
      return { ...state, [action.dialog]: action.value };
    case 'CLOSE_ALL':
      return Object.keys(state).reduce((acc, key) => ({ ...acc, [key]: false }), {});
    default:
      return state;
  }
};

const uiReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_TAB':
      return { ...state, currentTab: action.value };
    case 'SET_COLUMN_SORTING':
      return { ...state, columnSorting: action.value };
    case 'SET_COLUMN_SETTING':
      return { ...state, columnSetting: action.value };
    case 'SET_CLIENT_IDS':
      return { ...state, clientIds: action.value };
    case 'UPDATE_MULTIPLE':
      return { ...state, ...action.updates };
    default:
      return state;
  }
};

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CUSTOM_FIELDS':
      return { ...state, customFields: action.value };
    case 'SET_COMMENTS':
      return { ...state, comments: action.value };
    case 'SET_PINNED_FIELDS':
      return { ...state, pinnedFields: action.value };
    case 'SET_FIELDS':
      return { ...state, fields: action.value };
    case 'SET_PINED_COMMENT_INFO':
      return { ...state, pinedCommentInfo: action.value };
    case 'UPDATE_MULTIPLE':
      return { ...state, ...action.updates };
    default:
      return state;
  }
};

export const useCustomer = ({ customerId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState(null);

  const getClient = async (localCustomerId) => {
    setIsLoading(true);
    try {
      const res = await customersApi.getCustomerInfo(localCustomerId ?? customerId);
      setCustomerInfo(res?.client);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const updateCustomerInfo = useCallback((data) => {
    setCustomerInfo({ ...customerInfo, ...data });
  }, [customerInfo]);

  useEffect(() => {
    getClient();
  }, [customerId]);

  return { customerInfo, getClient, isLoading, updateCustomerInfo };
};

const useCustomerLastTicket = (customerId) => {
  const isMounted = useMounted();
  const [ticket, setTicket] = useState(null);

  const handleLastTicketGet = useCallback(async () => {
    const response = await customersApi.getCustomerLastTicket({
      client_id: customerId,
    });
    if (isMounted()) setTicket(response?.ticket);
  }, [isMounted, customerId]);

  useEffect(() => {
    handleLastTicketGet();
  }, [isMounted, customerId]);

  return ticket;
};

const useTeams = () => {
  const [teamList, setTeamList] = useState([]);

  const getTeams = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      const teamInfo = res?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  return teamList;
};

const Page = () => {
  const dispatch = useDispatch();
  usePageView();
  const queryString = window.location.search;
  const urlSearch = new URLSearchParams(queryString);
  const queryFilter = JSON.parse(urlSearch.get("filter"));
  const queryCustomFilter = JSON.parse(urlSearch.get("customFilters"));

  const { state } = useLocation();

  // Consolidated state management for better performance
  const [dialogState, dispatchDialog] = useReducer(dialogReducer, {
    numbersDrawer: false,
    updateFields: false,
    assignForm: false,
    customerInfo: false,
    orderTabs: false,
    comment: false
  });

  const [uiState, dispatchUI] = useReducer(uiReducer, {
    currentTab: "details",
    columnSorting: null,
    columnSetting: null,
    clientIds: []
  });

  const [infoSettings, setCustomerInfo] = useState();
  const [orderSettings, setOrderSettings] = useState([]);
  
  const isDefaultOrderTab = useMemo(() => {
    return isEqual(orderSettings, baseCustomerDetailTabs?.map((item, index)=> ({...item, order: index})));
  }, [orderSettings, baseCustomerDetailTabs]);

  const tabList = useMemo(() => {
    if (state?.prevRouter === "ib-requests" || state?.prevRouter === "ibs") {
      const ibRoomTab = orderSettings.find((col) => col.id === "ib_room");
      const otherTabs = orderSettings.filter((col) => col.id !== "ib_room");
      dispatchUI({ type: 'SET_CURRENT_TAB', value: 'ib_room' });
      return ibRoomTab ? [ibRoomTab, ...otherTabs] : orderSettings; // Only include if found
    }
    return orderSettings;
  }, [state?.prevRouter, orderSettings]);

  const isMounted = useMounted();
  const filter = useSelector((state) => state.customers.customerFilters);
  const customFilters = useSelector((state) => state.customers.customFilter);

  const updateFilters = (data) => dispatch(thunks.setFilters(data));

  const { user, company } = useAuth();
  const { toLocalTime } = useTimezone();

  const router = useRouter();
  const { customerId } = useParams();
  const teams = useTeams();

  const nextCustomerId = useMemo(() => {
    const ind = uiState.clientIds?.findIndex((item) => item == customerId);
    return uiState.clientIds[ind + 1];
  }, [customerId, uiState.clientIds]);

  const prevCustomerId = useMemo(() => {
    const ind = uiState.clientIds?.findIndex((item) => item == customerId);
    if (ind !== 0) {
      return uiState.clientIds[ind - 1];
    }
  }, [customerId, uiState.clientIds]);

  const handleNext = useCallback(() => {
    const ind = uiState.clientIds?.findIndex((item) => item == customerId);

    if (ind == uiState.clientIds?.length - 2) {
      updateFilters({ currentPage: filter.currentPage + 1, perPage: 10 });
    }
    dispatchUI({ type: 'SET_CURRENT_TAB', value: "details" });
  }, [uiState.clientIds, customerId, filter]);

  const handleBack = useCallback(() => {
    updateFilters({ currentPage: 0 });
  }, []);

  const getCustomerData = async () => {
    try {
      const params = {
        page: filter?.currentPage ? filter?.currentPage + 1 : 1,
        per_page: filter?.perPage ? filter?.perPage : 10,
        client_ids: filter?.ids ? [filter?.ids] : undefined,
        non_client_ids: filter?.non_ids ? [filter?.non_ids] : undefined,
        ...filter,
      };
      delete params?.non_ids;
      delete params?.ids;
      delete params?.perPage;
      delete params?.currentPage;
      delete params?.first_assigned_agent_name;
      delete params?.second_assigned_agent_name;
      delete params?.third_assigned_agent_name;
      delete params?.first_caller_name;
      delete params?.second_caller_name;
      delete params?.third_caller_name;
      delete params?.frd_owner_name;

      if (params?.online?.length > 1) {
        delete params?.online;
      }
      if (params?.online?.length === 1 && filters?.online[0] === "true") {
        params.online = "true";
      }
      if (params?.online?.length === 1 && filters?.online[0] === "false") {
        params.online = "false";
      }

      if (
        filter?.first_assigned_agent_name &&
        filter?.first_assigned_agent_name?.length > 0
      ) {
        params.first_assigned_agent_id = filter?.first_assigned_agent_name;
      }
      if (
        filter?.second_assigned_agent_name &&
        filter?.second_assigned_agent_name?.length > 0
      ) {
        params.second_assigned_agent_id = filter?.second_assigned_agent_name;
      }
      if (
        filter?.third_assigned_agent_name &&
        filter?.third_assigned_agent_name?.length > 0
      ) {
        params.third_assigned_agent_id = filter?.third_assigned_agent_name;
      }
      if (filter?.first_caller_name && filter?.first_caller_name?.length > 0) {
        params.first_call_by = filter?.first_caller_name;
      }
      if (
        filter?.second_caller_name &&
        filter?.second_caller_name?.length > 0
      ) {
        params.second_call_by = filter?.second_caller_name;
      }
      if (filter?.third_caller_name && filter?.third_caller_name?.length > 0) {
        params.third_call_by = filter?.third_caller_name;
      }
      if (filter?.frd_owner_name && filter?.frd_owner_name?.length > 0) {
        params.frd_owner_id = filter?.frd_owner_name;
      }

      if (filter?.online?.length === 1 && filter?.online[0] === "true") {
        params.online = "true";
      }
      if (filter?.online?.length === 1 && filter?.online[0] === "false") {
        params.online = "false";
      }

      if (uiState.columnSorting) {
        params["sorting"] = uiState.columnSorting;
      }

      const customFiltersData = customFilters
        ?.filter(
          (filter) =>
            filter?.filter &&
            (filter?.filter?.query?.length || filter?.filter?.non_query?.length)
        )
        ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

      const cached = searchParams.get("cached") || false;
      if (cached) {
        router.push(paths.dashboard.customers.index);
      }
      const { clients, column_setting } = await customersApi.getCustomers(params);
      dispatchUI({ 
        type: 'UPDATE_MULTIPLE', 
        updates: {
          clientIds: clients?.map((client) => client?.id),
          columnSetting: column_setting
        }
      });
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const { customerInfo, getClient, isLoading, updateCustomerInfo } = useCustomer({ customerId });
  const { setCustomerId } = useTwilio();
  const { profiles } = useCallProfiles();
  const searchParams = useSearchParams();
  const ticket = useCustomerLastTicket(customerId);

  const [dataState, dispatchData] = useReducer(dataReducer, {
    customFields: [],
    comments: [],
    pinnedFields: [],
    pinedCommentInfo: undefined,
    fields: []
  });

  const reminderPopover = usePopover();

  const getComments = async () => {
    try {
      const response = await commentsApi.getComments({ client_id: customerId });
      if (isMounted()) {
        dispatchData({ type: 'SET_COMMENTS', value: response?.comments });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const ind = uiState.clientIds?.findIndex((item) => item == customerId);
    if (ind == uiState.clientIds?.length - 1) {
      // updateFilters({ currentPage: filter.currentPage + 1, perPage: 10 });
    }
  }, [customerId, uiState.clientIds]);

  // Track if initial load is complete to prevent multiple API calls during initialization
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const prevFilterRef = useRef(filter);
  const prevCustomFiltersRef = useRef(customFilters);

  useEffect(() => {
    // Only call getCustomerData if this is not the initial load or if filters have meaningfully changed
    const filterChanged = !isEqual(prevFilterRef.current, filter);
    const customFiltersChanged = !isEqual(prevCustomFiltersRef.current, customFilters);
    
    if (initialLoadComplete && (filterChanged || customFiltersChanged)) {
      getCustomerData();
    }
    
    // Update refs for next comparison
    prevFilterRef.current = filter;
    prevCustomFiltersRef.current = customFilters;
  }, [filter, customFilters, initialLoadComplete]);

  useEffect(() => {
    if (user?.acc?.acc_v_client === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  useEffect(() => {
    if (customerId) {
      getComments();
      setCustomerId(customerId);
    }
  }, [customerId]);

  useEffect(() => {
    // if (ticket) {
    //   router.push(
    //     paths.dashboard.customers.details.replace(":customerId", customerId) +
    //     `?conversationId=${ticket?.ticket?.conversation_id}&ticketId=${ticket?.ticket?.id}`
    //   );
    // }
  }, [ticket]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) dispatchUI({ type: 'SET_CURRENT_TAB', value: tab });
  }, [searchParams]);

  useEffect(() => {
    const initializeData = async () => {
      updateFilters(queryFilter);
      await getCustomerFields();
      // Call getCustomerData once during initial load
      await getCustomerData();
      // Mark initial load as complete
      setInitialLoadComplete(true);
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    if (user?.column_setting) {
      dispatchUI({ 
        type: 'SET_COLUMN_SORTING', 
        value: JSON.parse(user?.column_setting)?.customerSorting 
      });
    }
  }, [user]);
  
  useEffect(() => {
    const columnSettings = user?.column_setting
      ? JSON.parse(user?.column_setting)
      : null;
    if (columnSettings?.customerInfo) {
      setCustomerInfo(columnSettings?.customerInfo);
    } else {
      setCustomerInfo(defaultColumn);
    }

    if (columnSettings?.customerOrderTabs) {
      let filteredOrderTabs = columnSettings?.customerOrderTabs;
      let baseFilteredOrderTabs = baseCustomerDetailTabs;

      if (company?.company_type === 1) {
        filteredOrderTabs = filteredOrderTabs.filter(item => !["Bets", "Analytics"].includes(item.label));
        baseFilteredOrderTabs = baseFilteredOrderTabs.filter(item => !["Bets", "Analytics"].includes(item.label));
      }

      if (filteredOrderTabs.length !== baseFilteredOrderTabs.length) {
        filteredOrderTabs = baseFilteredOrderTabs;
      }
      setOrderSettings(filteredOrderTabs);
    } else {
      let filteredDefaultOrderTabs = baseCustomerDetailTabs;
      if (company?.company_type === 1) {
        filteredDefaultOrderTabs = filteredDefaultOrderTabs.filter(item => !["Bets", "Analytics"].includes(item.label));
      }
      setOrderSettings(filteredDefaultOrderTabs);
    }
  }, [user, company]);

  const handleTabsChange = useCallback((event, value) => {
    if (value === "details") {
      getClient(customerId);
    }
    dispatchUI({ type: 'SET_CURRENT_TAB', value });
  }, [customerId]);

  const handleOpenCustomerChat = useCallback(() => {
    if (customerId) {
      router.push(
        paths.dashboard.chat + `?customer=${customerId}&returnTo=detail`
      );
    }
  }, [customerId]);

  const handleOpenPhoneCallStarter = useCallback(() => {
    dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'numbersDrawer', value: true });
  }, []);

  const handleClosePhoneCallStarter = useCallback(() => {
    dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'numbersDrawer', value: false });
  }, []);

  const lastOnlineRecently = useMemo(() => {
    const isOneMinuteAgo = (dateTime) => {
      const now = new Date();
      const ago = differenceInMinutes(now, new Date(dateTime));
      return ago <= 1;
    };
    const isOnline = customerInfo?.client?.last_online
      ? isOneMinuteAgo(customerInfo?.client?.last_online)
      : false;
    return isOnline;
  }, [customerInfo]);

  const handleDashboardLogin = () => {
    window?.open("https://" + customerInfo?.dashboard_domain);
    getClient();
  };

  const handleTraderLogin = () => {
    if (customerInfo?.link?.includes("http://") || customerInfo?.link?.includes("https://")) {
      window?.open(customerInfo?.link);
    } else {
      window?.open("https://" + customerInfo?.link);
    }
    getClient();
  };

  const renderEditButton = () => (
    <Tooltip title="Edit Custom Field">
      <IconButton
        edge="end"
        onClick={() => handleOpenEditCustomField(rowId, fieldId)}
        size="small"
        className="custom-field-edit"
        sx={{
          display: 'none',
          color: 'primary.main'
        }}
      >
        <Iconify icon="fluent:edit-12-regular" width={24} />
      </IconButton>
    </Tooltip>
  );

  const getCustomerFields = async () => {
    try {
      const res = await customerFieldsApi.getCustomerFields();
      if (res?.client_fields?.length) {
        const customFields = res?.client_fields?.map((field) => {
          const accessKey = `acc_custom_v_${field?.value}`;
          const accessEditKey = `acc_custom_e_${field?.value}`;
          const viewAccess = user?.acc && user?.acc[accessKey];
          const editAccess = user?.acc && user?.acc[accessEditKey];

          if (viewAccess === undefined || viewAccess) {
            return {
              id: field?.value,
              label: field?.friendly_name,
              enabled: true,
              custom: true,
              editAccess: editAccess,
              custom_id: field?.id,
              setting: field?.setting,
              field_type: field?.field_type,
              filter:
                queryCustomFilter?.find(
                  (item) => item?.custom_id == field?.id
                )?.filter ?? null,
              render: (row) => {
                if (field?.field_type === "boolean") {
                  if (row?.client_fields[field?.id] === "true") {
                    return (
                      <>
                        <CheckCircleOutlineIcon
                          fontSize="small"
                          color="success"
                        />
                        {renderEditButton()}
                      </>
                    );
                  } else {
                    return renderEditButton();
                  }
                } else if (
                  field?.field_type === "multi_choice" ||
                  field?.field_type === "multi_choice_radio"
                ) {
                  const setting = field?.setting
                    ? JSON.parse(field?.setting)
                    : [];
                  const val = row?.client_fields[field?.id];
                  const color = setting.find((s) => s?.option?.trim() === val?.trim())?.color ?? 'primary.main';

                  return (
                    <>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {(color && val) ? (
                          <Box
                            sx={{
                              backgroundColor: color,
                              maxWidth: 1,
                              height: 1,
                              padding: 1,
                              borderRadius: 20,
                            }}
                          ></Box>
                        ) : null}
                        <Typography sx={{ whiteSpace: "nowrap" }}>
                          {val}
                        </Typography>
                      </Stack>
                      {renderEditButton()}
                    </>
                  );
                }
                return (
                  <>
                    <Typography>
                      {row?.client_fields[field?.id] ?? ""}
                    </Typography>
                    {renderEditButton()}
                  </>
                );
              },
            };
          } 
        });
        dispatchData({ type: 'SET_CUSTOM_FIELDS', value: customFields ?? [] });
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const onCommentSubmit = async (data) => {
    try {
      const request = {
        client_id: customerId,
        comment: data?.comment,
      };
      const { comments } = await commentsApi.createComment(request);
      dispatchData({ type: 'SET_COMMENTS', value: comments?.reverse() });
      if (comments?.[0]?.comment !== data?.comment) {
        const { comments } = await commentsApi.createComment(request);
        dispatchData({ type: 'SET_COMMENTS', value: comments?.reverse() });
      }
      setTimeout(() => {
        getComments();
      }, 2000);
      dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'comment', value: false });
      dispatchData({ type: 'SET_PINED_COMMENT_INFO', value: undefined });
      toast.success("Client comment successfully created!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.column_setting) {
      dispatchData({ 
        type: 'SET_PINNED_FIELDS', 
        value: JSON.parse(user.column_setting)?.pinnedFields ?? [] 
      });
    }
  }, [user]);

  useEffect(() => {
    dispatch(slice.actions.setCustomFilter(dataState.customFields));
    const getFields = async () => {
      try {
        if (dataState.pinnedFields && dataState.pinnedFields?.length > 0) {
          const { client_field_value } =
            await customerFieldsApi.getCustomerFieldValue({
              client_id: customerId,
            });

          const valuableFields = dataState.customFields
            ?.filter((field) => dataState.pinnedFields.includes(field?.custom_id))
            ?.map((field) => {
              const matchingValue = client_field_value?.find(
                (val) => val?.client_field_id === field?.custom_id
              );

              if (matchingValue) {
                return {
                  ...field,
                  field_value_id: matchingValue?.id,
                  field_value: matchingValue?.value,
                };
              } else {
                return field;
              }
            });
          dispatchData({ type: 'SET_FIELDS', value: valuableFields });
        }
      } catch (error) {
        console.error("error: ", error);
      }
    };

    getFields();
  }, [dataState.customFields, dataState.pinnedFields, customerId]);

  const column = useMemo(() => {
    return uiState.columnSetting;
  }, [uiState.columnSetting]);

  const columnSettings = useMemo(() => {
    if (column) {
      return JSON.parse(column);
    }
  }, [column]);

  const renderInfoSetting = (id) => {
    switch (id) {
      case "user_id":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">User ID:</Typography>
            <Chip label={customerInfo?.client?.id} size="small" />
          </Stack>
        );
      case "local_time":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Local time:</Typography>
            <Chip
              label={customerInfo?.client?.local_time ?? "n/a"}
              size="small"
            />
          </Stack>
        );
      case "last_ip":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Last IP:</Typography>
            <Chip label={customerInfo?.client?.last_ip ?? "n/a"} size="small" />
          </Stack>
        );
      case "created_at":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Created at:</Typography>
            <Chip
              label={toLocalTime(customerInfo?.client?.created_at)}
              size="small"
            />
          </Stack>
        );
      case "total_deposit":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Total deposit:</Typography>
            <Chip label={customerInfo?.total_deposit ?? "0.00"} size="small" />
          </Stack>
        );
      case "net_deposit":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Net deposit:</Typography>
            <Chip label={customerInfo?.client?.net_deposit ?? "0.00"} size="small" />
          </Stack>
        );
      case "total_withdrawal":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Total withdrawal:</Typography>
            <Chip
              label={customerInfo?.total_withdrawal ?? "0.00"}
              size="small"
            />
          </Stack>
        );
      case "balance":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Balance:</Typography>
            <Chip
              label={customerInfo?.client?.balance ?? "0.00"}
              size="small"
            />
          </Stack>
        );
      case "full_name":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Full name:</Typography>
            <Chip
              label={customerInfo?.client?.full_name ?? "n/a"}
              size="small"
            />
          </Stack>
        );
      case "email":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Email:</Typography>
            <Chip
              label={customerInfo?.emails?.[0]?.value ?? "n/a"}
              size="small"
            />
          </Stack>
        );
      case "phone_number":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Phone number:</Typography>
            <Chip
              label={customerInfo?.phone_numbers?.[0]?.value ?? "n/a"}
              size="small"
            />
          </Stack>
        );
      case "last_online":
        return (
          <>
            {customerInfo?.client?.last_online ? (
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="subtitle2">Last online:</Typography>
                <Chip
                  label={toLocalTime(customerInfo?.client?.last_online)}
                  size="small"
                />
              </Stack>
            ) : null}
          </>
        );
      case "status":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Status:</Typography>
            <Chip
              label={customerInfo?.client?.client_rank_text ?? "n/a"}
              size="small"
            />
          </Stack>
        );
      case "affiliate":
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="subtitle2">Affiliate:</Typography>
            <Chip label={customerInfo?.affiliate ?? "n/a"} size="small" />
          </Stack>
        );
    }
  };

  const renderTab = (tab) => {
    switch (tab.id) {
      case "note":
        if (
          !user?.acc?.acc_v_client_note &&
          user?.acc?.acc_v_client_note !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "analytics":
        if (
          !user?.acc?.acc_v_client_analytics &&
          user?.acc?.acc_v_client_analytics !== undefined &&
          company?.company_type === 2
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "ib_room":
        if (
          !user?.acc?.acc_v_ib_room &&
          user?.acc?.acc_v_ib_room !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "positions":
        if (
          !user?.acc?.acc_v_client_position &&
          user?.acc?.acc_v_client_position !== undefined
        )
          return null;
        if (company?.company_type === 2)
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "transactions":
        if (
          !user?.acc?.acc_v_transaction &&
          user?.acc?.acc_v_transaction !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "wallet":
        if (
          !user?.acc?.acc_v_client_wallet &&
          user?.acc?.acc_v_client_wallet !== undefined
        )
          return null;
        if (company?.company_wallet_system === false)
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "trade_settings": {
        if (
          !user?.acc?.acc_v_client_trader_settings &&
          user?.acc?.acc_v_client_trader_settings !== undefined
        )
          return null;
        const tabLabel = company?.company_type === 2 ? "Dashboard Settings" : tab.label;
        return <Tab key={tab.id} label={tabLabel} value={tab.id} />;
      }
      case "posts":
        if (
          !user?.acc?.acc_v_client_posts &&
          user?.acc?.acc_v_client_posts !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "lead_source":
        if (
          !user?.acc?.acc_v_client_lead_source &&
          user?.acc?.acc_v_client_lead_source !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "kyc":
        if (
          !user?.acc?.acc_v_client_kyc &&
          user?.acc?.acc_v_client_kyc !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "calls":
        if (
          !user?.acc?.acc_v_customer_calls &&
          user?.acc?.acc_v_customer_calls !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "bets":
        if (
          !user?.acc?.acc_v_client_bets &&
          user?.acc?.acc_v_client_bets !== undefined
        )
          return null;
          if (company?.company_type === 1)
            return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "logs":
        if (
          !user?.acc?.acc_v_client_logs &&
          user?.acc?.acc_v_client_logs !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "ico":
        if (
          !user?.acc?.acc_v_client_ico &&
          user?.acc?.acc_v_client_ico !== undefined)
          return null;
          if (company?.company_type === 2)
            return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "saving_accounts":
        if (
          !user?.acc?.acc_v_client_saving &&
          user?.acc?.acc_v_client_saving !== undefined
        )
          return null;
          if (company?.company_type === 2)
            return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "psp_links":
        if (
          !user?.acc?.acc_v_client_psp_links ||
          user?.acc?.acc_v_client_psp_links === undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "forms":
        if (
          !user?.acc?.acc_v_client_forms &&
          user?.acc?.acc_v_client_forms !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "announcements":
        if (!user?.acc?.acc_v_client_announcement && user?.acc?.acc_v_client_announcement !== undefined)
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      case "security_report":
        if (
          !user?.acc?.acc_v_client_security_report &&
          user?.acc?.acc_v_client_security_report !== undefined
        )
          return null;
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
      default:
        return <Tab key={tab.id} label={tab.label} value={tab.id} />;
    }
  };

  return (
    <>
      <Seo
        title={`Dashboard: ${customerInfo?.client?.full_name ?? ""} | ${company?.name}`}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 2, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
              >
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.customers.index + "?cached=true"}
                  onClick={handleBack}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Customers</Typography>
                </Link>
                <Stack direction="row" gap={1}>
                  <IconButton
                    disabled={!prevCustomerId}
                    onClick={() => {
                      dispatchUI({ type: 'SET_CURRENT_TAB', value: "details" });
                      router.push(
                        `${paths.dashboard.customers.index}/${prevCustomerId}`
                      )
                    }}
                  >
                    <Tooltip title={prevCustomerId ? "Previous" : ""}>
                      <Iconify icon="iconoir:skip-prev-solid" color={prevCustomerId? "primary.main": "text.disabled"} width={30}
                        sx={{ '&:hover': { color: prevCustomerId ? 'primary.dark': 'text.disabled' }}}
                      />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    disabled={!nextCustomerId}
                    onClick={() => {
                      handleNext();
                      router.push(
                        `${paths.dashboard.customers.index}/${nextCustomerId}`
                      );
                    }}
                  >
                    <Tooltip title={nextCustomerId ? "Next" : ""}>
                      <Iconify icon="iconoir:skip-next-solid" color={nextCustomerId? "primary.main": "text.disabled"} width={30}
                        sx={{ '&:hover': { color: nextCustomerId ? 'primary.dark': 'text.disabled' }}}
                      />
                    </Tooltip>
                  </IconButton>
                </Stack>
              </Stack>
              {!isLoading ? (
                <Stack
                  alignItems="flex-start"
                  direction={{xs: "column", md: "row"}}
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Stack alignItems="center" direction="row" spacing={2}>
                    {lastOnlineRecently ? (
                      <Badge variant="dot" color="success">
                        {isLoading ? (
                          <Skeleton
                            variant="text"
                            width="100%"
                            height="75px"
                            sx={{
                              width: 1,
                              height: 72,
                            }}
                          />
                        ) : (
                          <Avatar
                            src={
                              customerInfo?.client?.avatar
                                ? customerInfo?.client?.avatar?.includes("http")
                                  ? customerInfo?.client?.avatar
                                  : `${getAPIUrl()}/${customerInfo?.client?.avatar
                                  }`
                                : ""
                            }
                            sx={{
                              height: 64,
                              width: 64,
                            }}
                          />
                        )}
                      </Badge>
                    ) : (
                      <Avatar
                        src={
                          customerInfo?.client?.avatar
                            ? customerInfo?.client?.avatar?.includes("http")
                              ? customerInfo?.client?.avatar
                              : `${getAPIUrl()}/${customerInfo?.client?.avatar}`
                            : ""
                        }
                        sx={{
                          height: 64,
                          width: 64,
                        }}
                      />
                    )}

                    <Stack spacing={1}>
                      <Stack 
                        direction={{
                          xs: 'column',
                          sm: 'row'
                        }} 
                        spacing={1}
                        alignItems={{
                          xs: 'flex-start',
                          sm: 'center'
                        }}
                        flexWrap="wrap"
                      >
                        <Typography 
                          variant="h4"
                          sx={{
                            wordBreak: 'break-word',
                            maxWidth: {
                              xs: '100%',
                              sm: '400px',
                              md: '500px'
                            }
                          }}
                        >
                          {customerInfo?.client?.full_name}
                        </Typography>
                        
                        <Stack 
                          direction="row" 
                          gap={1} 
                          alignItems="center"
                        >
                          {customerInfo?.client?.country && (
                            <Iconify icon={`circle-flags:${customerInfo?.client?.country?.toLowerCase()}`} width={24} />
                          )}
                          {customerInfo?.client?.country && (
                            <Typography 
                              variant="body1"
                              sx={{
                                color: 'text.secondary'
                              }}
                            >
                              {countries.find(
                                (c) => c.code === customerInfo?.client?.country
                              )?.label}
                            </Typography>
                          )}

                          <Tooltip title="Change user info settings">
                            <IconButton onClick={() => dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'customerInfo', value: true })}>
                              <Iconify 
                                icon="fluent:person-settings-20-regular" 
                                width={24} 
                                color="primary.main"
                                sx={{ 
                                  '&:hover': { 
                                    color: 'primary.dark'
                                  }
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                      
                      {infoSettings?.map(
                        (info) => info?.enabled && renderInfoSetting(info?.id)
                      )}
                    </Stack>
                  </Stack>
                  <Stack direction="column" gap={1.5}>
                    <MemoizedQuickActionDetail 
                      data={{...customerInfo, ...customerInfo?.client}} 
                      fields={dataState.customFields} 
                      emails={customerInfo?.emails?.map((item)=> item?.value)?.slice(0, 2)}
                      phoneNumbers={customerInfo?.phone_numbers?.map((item)=> item?.value)?.slice(0, 2)}
                      setUpdateFieldsOpen={() => dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'updateFields', value: true })}
                      setAssignFormOpen={() => dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'assignForm', value: true })}
                      handleOpenCustomerChat={handleOpenCustomerChat}
                      setShowCommentModal={() => dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'comment', value: true })}
                      handleOpenPhoneCallStarter={handleOpenPhoneCallStarter}
                      traderDisabled={customerInfo?.client?.active_trader}
                      handleTraderLogin={handleTraderLogin}
                      handleDashboardLogin={handleDashboardLogin}
                    />
                    {company?.company_type === 2 && (
                      <Stack direction="row" gap={1} sx={{ alignSelf: 'flex-end' }}>
                        <Chip color="primary" size="small" label={`Balance Bonus: ${customerInfo?.client?.balance_bonus ?? 0}`} />
                        <Chip color="primary" size="small" label={`Balance Real: ${customerInfo?.client?.balance_real ?? 0}`} />
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              ) : (
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Stack alignItems="center" direction="row" spacing={2}>
                    <Skeleton
                      variant="circular"
                      sx={{ width: 64, height: 64 }}
                    />

                    <Stack spacing={1}>
                      <Stack direction="row" gap={1} alignItems="center">
                        <Skeleton variant="text" width="132px" height="40px" />
                      </Stack>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Skeleton variant="text" width="60px" />
                        <Skeleton variant="text" width="30px" />
                      </Stack>

                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Skeleton variant="text" width="80px" />
                        <Skeleton variant="text" width="100px" height="30px" />
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack alignItems="center" direction="row" spacing={3}>
                    {[...new Array(6).keys()]?.map((item)=> (
                      <Skeleton item={item} variant="circular" width="40px" height="40px" />
                    ))}
                  </Stack>
                </Stack>
              )}
              <Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    textColor="primary"
                    value={uiState.currentTab}
                    variant="scrollable"
                  >
                    {tabList?.map(
                      (tab) => tab?.enabled && renderTab(tab)
                    )}
                  </Tabs>
                  <Stack direction='row' gap={1} alignItems='center'>
                    {dataState.pinedCommentInfo ? (
                      <Tooltip title="Open comment modal">
                        <IconButton
                          sx={{ '&:hover': { color: 'info.dark' }, color: 'info.main'}}
                          onClick={() => {
                            dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'comment', value: true });
                          }}
                        >
                          <Iconify icon="iconamoon:comment-dots" width={30}/>
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <Tooltip title="Change tabs order">
                      <IconButton 
                        onClick={() => dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'orderTabs', value: true })}
                        sx={{ '&:hover': { color: 'primary.main' }}}
                        >
                        <Badge 
                          color="error" 
                          variant="dot"
                          invisible={isDefaultOrderTab}
                        >
                          <Iconify icon="solar:settings-linear"/>
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
                <Divider />
              </Stack>
            </Stack>

            {uiState.currentTab === "details" && customerInfo && (
              <Box>
                <Grid container spacing={4}>
                  <Grid xs={12}><CustomerAISummary customerId={customerId} /></Grid>
                  <Grid
                    xs={12}
                    lg={4}
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <MemoizedCustomerBasicDetails customer={customerInfo} />
                    <MemoizedCompanyLabelPanel
                      customer={customerInfo}
                      onGetClient={getClient}
                      teams={teams}
                    />
                    <Stack sx={{ display: { lg: 'block', xs: 'none' }}}>
                      {user?.acc?.acc_e_client_delete ? (
                        <MemoizedCustomerDataManagement id={customerInfo?.client?.id} />
                      ) : null}
                    </Stack>
                  </Grid>
                  <Grid
                    xs={12}
                    lg={4}
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <MemoizedCustomerDesk customerInfo={customerInfo} teams={teams} onGetClient={getClient} />
                    <MemoizedCustomerInsight
                      id={customerId}
                      customer={customerInfo}
                      currentTab={uiState.currentTab}
                    />
                  </Grid>
                  <Grid xs={12} lg={4} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <MemoizedCustomerCustomFields
                      id={customerId}
                      currentTab={uiState.currentTab}
                    />
                    <Stack sx={{ display: { lg: 'none', xs: 'block' }}}>
                      {user?.acc?.acc_e_client_delete ? (
                        <MemoizedCustomerDataManagement id={customerInfo?.client?.id} />
                      ) : null}
                      </Stack>
                  </Grid>
                </Grid>
              </Box>
            )}
            {uiState.currentTab === "analytics" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerAnalytics customerId={customerId} />
              </Suspense>
            )}
            {uiState.currentTab === "lead_source" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerLeadSource leads={customerInfo?.leads} />
              </Suspense>
            )}
            {uiState.currentTab === "ib_room" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerIB 
                  customerInfo={{...customerInfo?.client, ...customerInfo}} 
                  onGetClient={getClient}
                />
              </Suspense>
            )}
            {uiState.currentTab === "note" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerNote 
                  customerId={customerId}
                  customerInfo={customerInfo}
                  updateCustomerInfo={updateCustomerInfo}
                />
              </Suspense>
            )}
            {uiState.currentTab === "comments" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerCommentsTab
                  customerId={customerId}
                  modalOpen={dialogState.comment}
                  setModalOpen={(value) => dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'comment', value })}
                  comments={dataState.comments}
                  getComments={getComments}
                />
              </Suspense>
            )}
            {uiState.currentTab === "positions" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerPosition
                  customerId={customerId}
                  currency={customerInfo?.client?.trader_currency}
                />
              </Suspense>
            )}
            {uiState.currentTab === "transactions" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerTransaction customerId={customerId} customerInfo={customerInfo} onGetClient={getClient}/>
              </Suspense>
            )}
            {uiState.currentTab === "wallet" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerWallets customerId={customerId} />
              </Suspense>
            )}
            {uiState.currentTab === "trade_settings" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerTraderSettings
                  customerId={customerId}
                  getClient={getClient}
                  customerInfo={customerInfo}
                />
              </Suspense>
            )}
            {uiState.currentTab === "posts" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerPosts customerId={customerId} />
              </Suspense>
            )}
            {uiState.currentTab === "kyc" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerKyc
                  customer={customerInfo?.client}
                  onGetClient={getClient}
                />
              </Suspense>
            )}
            {uiState.currentTab === "logs" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerLogs customerId={customerId} />
              </Suspense>
            )}
            {uiState.currentTab === "ico" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerIcoContracts customerId={customerId} />
              </Suspense>
            )}
            {uiState.currentTab === "saving_accounts" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerSavingAccounts customerId={customerId} />
              </Suspense>
            )}
            {uiState.currentTab === "forms" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerForms customerId={customerId} customerInfo={customerInfo?.client} />
              </Suspense>
            )}
            {uiState.currentTab === "psp_links" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerPspLinks customerId={customerId} brandId={customerInfo?.client?.internal_brand_id} />
              </Suspense>
            )}
            {uiState.currentTab === "announcements" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerAnnouncements 
                  customerId={customerId} 
                  // eslint-disable-next-line no-unused-vars
                  onPreview={(announcement) => {
                  }}
                />
              </Suspense>
            )}
            {uiState.currentTab === "security_report" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerSecurityReport customerId={customerId} />
              </Suspense>
            )}
            {uiState.currentTab === "calls" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerCalls customerId={customerId} />
              </Suspense>
            )}
            {uiState.currentTab === "bets" && (
              <Suspense fallback={<TabLoadingFallback />}>
                <CustomerBets customerId={customerId} />
              </Suspense>
            )}
          </Stack>
        </Container>

        {customerInfo?.client?.id && dialogState.numbersDrawer && (
          <ChatPhoneNumberSelect
            open={dialogState.numbersDrawer}
            onClose={handleClosePhoneCallStarter}
            conversationId={customerInfo?.client?.call_conversation_id}
            profiles={profiles.filter((p) => p.enabled)}
            ticketId={ticket?.ticket?.id}
            ticket={ticket}
            customerPhoneNumbers={ticket?.client_phone_numbers}
          />
        )}

        {customerInfo?.client?.id && reminderPopover.open && (
          <ChatReminder
            open={reminderPopover.open}
            onClose={reminderPopover.handleClose}
            anchorEl={reminderPopover.anchorRef.current}
            clientId={customerId}
            ticketId={ticket?.ticket?.internal_id}
          />
        )}

        {dialogState.updateFields && (
          <Suspense fallback={null}>
            <BulkUpdateFields
              open={dialogState.updateFields}
              onClose={() => {
                dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'updateFields', value: false });
              }}
              filters={filter}
              customFilters={dataState.customFields}
              selected={[customerId]}
              customerId={customerId}
              pinedFields={dataState.pinnedFields}
              setPinedFields={(value) => dispatchData({ type: 'SET_PINNED_FIELDS', value })}
              columnSettings={columnSettings}
              query={null}
            />
          </Suspense>
        )}

        {dialogState.assignForm && (
          <Suspense fallback={null}>
            <CustomerAssignFormDialog 
              open={dialogState.assignForm}
              onClose={() => {
                dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'assignForm', value: false });
              }}
              filters={filter}
              customFilters={dataState.customFields}
              selected={[customerId]}
              customerId={customerId}
            />
          </Suspense>
        )}

        {customerId && dialogState.comment && (
          <Suspense fallback={null}>
            <CustomerCreateComment
              open={dialogState.comment}
              onClose={() => {
                dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'comment', value: false });
              }}
              onCommentCreate={onCommentSubmit}
              customerId={customerId}
              pinedCommentInfo={dataState.pinedCommentInfo}
              setPinedCommentInfo={(value) => dispatchData({ type: 'SET_PINED_COMMENT_INFO', value })}
              fields={dataState.fields}
              setFields={(value) => dispatchData({ type: 'SET_FIELDS', value })}
              onFieldsOpen={() => dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'updateFields', value: true })}
              hasPin
            />
          </Suspense>
        )}

        {dialogState.customerInfo && (
          <Suspense fallback={null}>
            <CustomerInfoModal
              open={dialogState.customerInfo}
              onClose={() => dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'customerInfo', value: false })}
              updateRule={setCustomerInfo}
            />
          </Suspense>
        )}

        {dialogState.orderTabs && (
          <Suspense fallback={null}>
            <CustomerOrderTabs
              open={dialogState.orderTabs}
              onClose={() => dispatchDialog({ type: 'TOGGLE_DIALOG', dialog: 'orderTabs', value: false })}
              updateRule={setOrderSettings}
            />
          </Suspense>
        )}
      </Box>
    </>
  );
};

export default Page;
