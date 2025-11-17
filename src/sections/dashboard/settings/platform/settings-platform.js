import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ContentCopy } from "@mui/icons-material";

import { Logo } from "src/components/logos/logo";
import { MailContainer } from "../../mail/mail-container";
import { Scrollbar } from "src/components/scrollbar";
import { SettingsPlatformIp } from "./settings-platform-ip";
import { SettingsPlatformLogout } from "./settings-platform-logout";
import { SettingsPlatformOtp } from "./settings-platform-otp";
import { SettingsPlatformSidebar } from "./settings-platform-sidebar";
import { TableModal } from "src/components/table-settings-modal";
import { TransactionTypeSettings } from "./transaction-type-settings";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { customerFieldsApi } from "src/api/customer-fields";
import { getAPIUrl } from "src/config";
import { settingsApi } from "src/api/settings";
import { thunks } from "src/thunks/company";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { useSettings } from "src/hooks/use-settings";
import { Iconify } from "src/components/iconify";
import { getAssetPath } from "src/utils/asset-path";

const useCompanyToken = () => {
  const isMounted = useMounted();
  const [token, setToken] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  const handleCompanyTokenGet = useCallback(async () => {
    setTokenLoading(true);
    try {
      const response = await settingsApi.getCompanyToken();

      if (isMounted()) {
        setToken(response);
      }
    } catch (err) {
      console.error(err);
    }
    setTokenLoading(false);
  }, [isMounted]);

  useEffect(() => {
    handleCompanyTokenGet();
  }, []);

  return { companyToken:token, tokenLoading };
};

export const useCompany = () => {
  const isMounted = useMounted();
  const [company, setCompany] = useState(null);

  const handleCompanyGet = useCallback(async () => {
    try {
      const companyId = localStorage.getItem("company_id");
      const response = await settingsApi.getCompany(companyId);

      if (isMounted()) {
        setCompany(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  const updateCompany = (data) =>{
    setCompany(data);
  } 

  useEffect(() => {
    handleCompanyGet();
  }, []);

  return { company, handleCompanyGet, updateCompany };
};

const useSidebar = () => {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = useState(mdUp);

  const handleScreenResize = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [mdUp]);

  useEffect(() => {
    handleScreenResize();
  }, [mdUp, handleScreenResize]);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleToggle,
    handleClose,
    open,
    smUp,
    mdUp
  };
};

const SECTION_PADDING = { xs: 2, sm: 3 };
const CARD_HEADER_PADDING = { px: SECTION_PADDING, pt: SECTION_PADDING, pb: 2 };
const CARD_CONTENT_PADDING = { px: SECTION_PADDING, pb: SECTION_PADDING };

export const SettingsPlatform = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const dispatch = useDispatch();
  const { company, handleCompanyGet, updateCompany } = useCompany();
  const settings = useSettings();
  const { user, refreshUser, updateCompany: updateCompanyAuth } = useAuth();
  const { companyToken, tokenLoading } = useCompanyToken();
  const companyAvatar = useSelector((state) => state.companies.avatar);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploadFile, setUploadFile] = useState();
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableSetting, setTableSetting] = useState({});
  const [customFilters, setCustomFilters] = useState([]);
  const [pinnedFields, setPinnedFields] = useState([]);
  const [autoFtd, setAutoFtd] = useState(false);
  const [autoFtdAmount, setAutoFtdAmount] = useState(false);
  const [assignConfirmation, setAssignConfirmation] = useState(false);
  const [currentTab, setCurrentTab] = useState("general");

  const DEFAULT_COLUMN = [
    {
      id: "id",
      label: "ID",
      enabled: true,
    },
    {
      id: "first_name",
      label: "First Name",
      enabled: false,
    },
    {
      id: "last_name",
      label: "Last Name",
      enabled: false,
    },
    user?.acc?.acc_v_client_name && {
      id: "name",
      label: "Name",
      enabled: true,
    },
    user?.acc?.acc_v_client_email && {
      id: "email",
      label: "Email",
      enabled: true,
    },
    user?.acc?.acc_v_client_phone && {
      id: "phone",
      label: "Phone",
      enabled: true,
    },
    {
      id: "country",
      label: "Country",
      enabled: false,
    },
    {
      id: "call_chat",
      label: "Quick Action",
      enabled: true,
      subEnabled: {
        info: true,
        reminder: true,
        label: true,
        phone: true,
        note: true,
        field: true,
        chat: true,
        comment: true,
        sms: true,
        email: true,
        summary: true,
        status_history: true,
        add_task: true,
        add_ticket: true,
        chat_with_ai: true,
        assign_form: true,
        assign_announcement: true,
      },
    },
    {
      id: "desk_id",
      label: "Desk",
      enabled: true,
    },
    {
      id: "first_affiliate_id ",
      label: "First Affiliate",
      enabled: false,
    },
    {
      id: "affiliate_id",
      label: "Affiliate",
      enabled: true,
    },
    user?.acc?.acc_v_client_internal_brand === undefined ||
    (user?.acc?.acc_v_client_internal_brand && {
      id: "internal_brand_id",
      label: "Internal Brand",
      enabled: true,
    }),
    {
      id: "labels",
      label: "Labels",
      enabled: true,
    },
    {
      id: "status",
      label: "Chats state",
      enabled: false,
    },
    {
      id: "balance",
      label: "Balance",
      enabled: true,
    },
    {
      id: "agent",
      label: "Agent",
      enabled: true,
    },
    {
      id: "team",
      label: "Team",
      enabled: true,
    },
    {
      id: "online",
      label: "Online",
    },
    {
      id: "last_online",
      label: "Last Online",
      enabled: true,
    },
    (user?.acc?.acc_v_last_login === undefined ||
      user?.acc?.acc_v_last_login) && {
      id: "last_login",
      label: "Last Login",
      enabled: true,
    },
    {
      id: "last_lead_date",
      label: "Last Lead Date",
      enabled: true,
    },
    {
      id: "local_time",
      label: "Local Time",
      enabled: true,
    },
    {
      id: "created_at",
      label: "Created At",
      enabled: true,
    },
    {
      id: "last_assigned_agent_at",
      label: "Last Agent",
      enabled: true,
    },
    {
      id: "last_comunication",
      label: "Last Communication At",
      enabled: false,
    },
    {
      id: "last_assigned_team_at",
      label: "Last Team",
      enabled: true,
    },
    {
      id: "last_assigned_desk_at",
      label: "Last Desk",
      enabled: true,
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
    },
    {
      id: "ftd_date",
      label: "FTD Date",
      enabled: false,
    },
    {
      id: "first_lead_campaign",
      enabled: true,
      label: "First Lead Campaign",
    },
    {
      id: "first_lead_description",
      enabled: true,
      label: "First Lead Description",
    },
    {
      id: "last_lead_campaign",
      enabled: true,
      label: "Last Lead Campaign",
    },
    (user?.acc?.acc_v_last_trade_at === undefined ||
      user?.acc?.acc_v_last_trade_at) && {
      id: "last_trade_at",
      enabled: true,
      label: "Last Trade At",
    },
    (user?.acc?.acc_v_open_pnl === undefined || user?.acc?.acc_v_open_pnl) && {
      id: "acc_v_open_pnl",
      enabled: true,
      label: "Open PNL",
    },
    (user?.acc?.acc_v_close_pnl === undefined || user?.acc?.acc_v_close_pnl) && {
      id: "acc_v_close_pnl",
      enabled: true,
      label: "Close PNL",
    },
    ...(company?.company_wallet_system ? [
      {
        id: "tron_wallet",
        label: "Tron Wallet",
        enabled: false,
      },
      {
        id: "ethereum_wallet",
        label: "Ethereum Wallet",
        enabled: false,
      },
      {
        id: "bitcoin_wallet",
        label: "Bitcoin Wallet",
        enabled: false,
      },
    ] : []),
    {
      id: "first_deposit",
      label: "First Deposit",
      enabled: false,
    },
    {
      id: "first_deposit_date",
      label: "First Deposit Date",
      enabled: false,
    },
    {
      id: "second_deposit",
      label: "Second Deposit",
      enabled: false,
    },
    {
      id: "second_deposit_date",
      label: "Second Deposit Date",
      enabled: false,
    },
    {
      id: "third_deposit",
      label: "Third Deposit",
      enabled: false,
    },
    {
      id: "third_deposit_date",
      label: "Third Deposit Date",
      enabled: false,
    },
    {
      id: "total_deposit",
      label: "Total Deposit",
      enabled: false,
    },
    user?.acc?.acc_v_client_first_desk_name && {
      id: "first_desk_name",
      label: "First Desk Name",
      enabled: false,
    },
    user?.acc?.acc_v_client_second_desk_name && {
      id: "second_desk_name",
      label: "Second Desk Name",
      enabled: false,
    },
    user?.acc?.acc_v_client_third_desk_name && {
      id: "third_desk_name",
      label: "Third Desk Name",
      enabled: false,
    },

    user?.acc?.acc_v_client_first_assigned_agent && {
      id: "first_assigned_agent_id",
      label: "First Assigned Agent ID",
      enabled: false,
    },
    user?.acc?.acc_v_client_first_assigned_agent && {
      id: "first_assigned_agent_name",
      label: "First Assigned Agent Name",
      enabled: false,
    },
    user?.acc?.acc_v_client_first_assigned_agent && {
      id: "first_assigned_agent_at",
      label: "First Assigned Agent At",
      enabled: false,
    },

    user?.acc?.acc_v_client_second_assigned_agent && {
      id: "second_assigned_agent_id",
      label: "Second Assigned Agent ID",
      enabled: false,
    },
    user?.acc?.acc_v_client_second_assigned_agent && {
      id: "second_assigned_agent_name",
      label: "Second Assigned Agent Name",
      enabled: false,
    },
    user?.acc?.acc_v_client_second_assigned_agent && {
      id: "second_assigned_agent_at",
      label: "Second Assigned Agent At",
      enabled: false,
    },

    user?.acc?.acc_v_client_third_assigned_agent && {
      id: "third_assigned_agent_id",
      label: "Third Assigned Agent ID",
      enabled: false,
    },
    user?.acc?.acc_v_client_third_assigned_agent && {
      id: "third_assigned_agent_name",
      label: "Third Assigned Agent Name",
      enabled: false,
    },
    user?.acc?.acc_v_client_third_assigned_agent && {
      id: "third_assigned_agent_at",
      label: "Third Assigned Agent At",
      enabled: false,
    },

    user?.acc?.acc_v_client_last_assigned_agent && {
      id: "last_assigned_agent_id",
      label: "Last Assigned Agent ID",
      enabled: false,
    },
    user?.acc?.acc_v_client_last_assigned_agent && {
      id: "last_assigned_agent_name",
      label: "Last Assigned Agent Name",
      enabled: false,
    },
    user?.acc?.acc_v_client_last_assigned_agent && {
      id: "last_assigned_agent_at",
      label: "Last Assigned Agent At",
      enabled: false,
    },

    user?.acc?.acc_v_client_first_call && {
      id: "first_call_at",
      label: "First Call At",
      enabled: false,
    },
    user?.acc?.acc_v_client_first_call && {
      id: "first_call_by",
      label: "First Call By",
      enabled: false,
    },
    user?.acc?.acc_v_client_first_call && {
      id: "first_caller_name",
      label: "First Caller Name",
      enabled: false,
    },

    user?.acc?.acc_v_client_second_call && {
      id: "second_call_at",
      label: "Second Call At",
      enabled: false,
    },
    user?.acc?.acc_v_client_second_call && {
      id: "second_call_by",
      label: "Second Call By",
      enabled: false,
    },
    user?.acc?.acc_v_client_second_call && {
      id: "second_caller_name",
      label: "Second Caller Name",
      enabled: false,
    },

    user?.acc?.acc_v_client_third_call && {
      id: "third_call_at",
      label: "Third Call At",
      enabled: false,
    },
    user?.acc?.acc_v_client_third_call && {
      id: "third_call_by",
      label: "Third Call By",
      enabled: false,
    },
    user?.acc?.acc_v_client_third_call && {
      id: "third_caller_name",
      label: "Third Caller Name",
      enabled: false,
    },

    user?.acc?.acc_v_client_frd_owner && {
      id: "frd_owner_id",
      label: "FRD Owner ID",
      enabled: false,
    },
    user?.acc?.acc_v_client_frd_owner && {
      id: "frd_owner_name",
      label: "FRD Owner Name",
      enabled: false,
    },
    user?.acc?.acc_v_client_frd_owner && {
      id: "frd_date",
      label: "FRD Date",
      enabled: false,
    },
    user?.acc?.acc_v_client_frd_owner && {
      id: "frd_amount",
      label: "FRD Amount",
      enabled: false,
    },
  ];

  const [defaultColumn, setDefaultColumn] = useState(DEFAULT_COLUMN);
  const [rule, setRule] = useState([]);

  const handleUpdateCompany = async () => {
    try {
      await settingsApi.updateCompany({ id: company?.id, data: { name } });
      dispatch(thunks.setCurrentCompanyName(name));
      toast("Company name successfully updated!");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getTableSetting = async () => {
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      const companyId = localStorage.getItem("company_id");
      const response = await settingsApi.getCompany(companyId);
      if (response?.column_setting) {
        setTableSetting(JSON.parse(response?.column_setting));
        setRule(JSON.parse(response?.column_setting)?.clientTable ?? []);
      } else if (localTableSetting) {
        const { company } = await settingsApi.updateCompany({
          id: companyId,
          column_setting: localTableSetting,
        });
        if (company?.column_setting) {
          setTableSetting(JSON.parse(company?.column_setting));
          setRule(JSON.parse(company?.column_setting)?.clientTable ?? []);
        }
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getCustomerFields = async () => {
    try {
      const res = await customerFieldsApi.getCustomerFields();
      if (res?.client_fields?.length) {
        setCustomFilters(
          res?.client_fields?.map((field) => {
            const accessKey = `acc_custom_v_${field?.value}`;
            const viewAccess = user?.acc && user?.acc[accessKey];

            if (viewAccess === undefined || viewAccess) {
              return {
                id: field?.value,
                label: field?.friendly_name,
                enabled: true,
                custom: true,
                custom_id: field?.id,
                setting: field?.setting,
                filter: null,
                field_type: field?.field_type,
              };
            }
          })
        );
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getCustomerFields();
    getTableSetting();
    setAvatar(companyAvatar ?? "");
  }, []);

  useEffect(() => {
    if (company?.column_setting) {
      setPinnedFields(JSON.parse(company?.column_setting)?.pinnedFields);
    }
  }, [company]);

  useEffect(() => {
    if (customFilters?.length) {
      setDefaultColumn(() => [...DEFAULT_COLUMN, ...customFilters]);
    } else {
      setDefaultColumn([...DEFAULT_COLUMN]);
    }
  }, [customFilters, rule, user]);

  useEffect(() => {
    if (!tableSetting?.clientTable && customFilters?.length) {
      const updateSetting = {
        ...tableSetting,
        clientTable: [...DEFAULT_COLUMN, ...customFilters],
      };
      setRule(updateSetting?.clientTable);
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else if (!tableSetting?.clientTable) {
      const updateSetting = {
        ...tableSetting,
        clientTable: [...DEFAULT_COLUMN],
      };
      setRule(updateSetting?.clientTable);
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    }
  }, [customFilters, tableSetting]);

  const handleChange = (event) => {
    if (event?.target?.files) {
      setUploadFile(event?.target?.files[0]);
      if (event?.target?.files[0]) {
        setAvatar(URL.createObjectURL(event?.target?.files[0]));
      }
    }
    event.target.value = null;
  };

  const handleUpdate = async () => {
    try {
      if (uploadFile) {
        const formData = new FormData();
        formData.append("avatar", uploadFile);
        const res = await settingsApi.updateCompany({
          id: company?.id,
          data: formData,
        });
        const avatar = res?.avatar;
        const localCompany = localStorage.getItem("tenants")
          ? JSON.parse(localStorage.getItem("tenants"))
          : null;

        const updatedCompany = localCompany?.map((item) => {
          if (item?.company?.id == user?.company_id) {
            return {
              ...item,
              company: {
                ...item?.company,
                avatar,
              },
            };
          } else return item;
        });

        if (updatedCompany?.length > 0) {
          localStorage.setItem("tenants", JSON.stringify(updatedCompany));
        }

        dispatch(thunks.setCurrentCompanyAvatar(avatar));
        toast.success(`Company avatar successfully updated!`);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    setName(company?.name);
    setAutoFtd(company?.auto_ftd);
    setAutoFtdAmount(company?.auto_ftd_amount);
    setAssignConfirmation(company?.assign_confirmation);
  }, [company]);

  useEffect(() => {
    if (uploadFile) {
      setAvatar(URL.createObjectURL(uploadFile));
    }
  }, [uploadFile]);

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = defaultColumn
        ?.filter((column) => {
          return column;
        })
        ?.map((item) => ({
          ...item,
          enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled
            ? true
            : item?.enabled
              ? true
              : false,
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
  }, [rule, defaultColumn]);

  const handleUpdateRule = async (rule, sortingState, pinned, type) => {
    try {
      setRule(rule);

      if (tableSetting) {
        const updateSetting = {
          ...tableSetting,
          clientTable: rule,
          pinnedFields: pinned,
        };
        const request = {
          column_setting: JSON.stringify(updateSetting),
        };
        if (type === "default") {
          request["column_setting_default"] = true;
        } else if (type === "existing") {
          request["column_setting_reset"] = true;
        }
        await settingsApi.updateCompany({
          id: company?.id,
          data: request,
        });
        setTableSetting(updateSetting);
        toast.success("Column settings successfully updated!");
      }
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateAutoFtd = async () => {
    try {
      const newAutoFtdState = !autoFtd;
      setAutoFtd(newAutoFtdState);
      await settingsApi.updateCompany({
        id: company?.id,
        data: { auto_ftd: newAutoFtdState },
      });
      toast.success("Auto FTD successfully updated!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateAutoFtdAmount = async () => {
    try {
      const newAutoFtdAmountState = !autoFtdAmount;
      setAutoFtdAmount(newAutoFtdAmountState);
      await settingsApi.updateCompany({
        id: company?.id,
        data: { auto_ftd_amount: newAutoFtdAmountState },
      });
      toast.success("Auto FTD Amount successfully updated!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };
  
  const handleUpdateAssignConfirmation = async () => {
    try {
      const newAssignConfirmationState = !assignConfirmation;
      setAssignConfirmation(newAssignConfirmationState);
      const res = await settingsApi.updateCompany({
        id: company?.id,
        data: { assign_confirmation : newAssignConfirmationState },
      });
      updateCompanyAuth(res);
      updateCompany(res);
      toast.success("Assign Confirmation successfully updated!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case "general": return "General";
      case "ip": return "IP Whitelist";
      case "2fa": return "Two-Factor Auth";
      case "logout": return "Auto Logout";
      default: return "General";
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "general":
        return (
          <Stack spacing={4}>
            <Card>
              <Box sx={CARD_HEADER_PADDING}>
                <Typography variant="h5" color="text.primary">
                  Function Settings
                </Typography>
              </Box>
              <Divider />
              <CardContent sx={CARD_CONTENT_PADDING}>
                <Stack spacing={4}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      color="text.primary"
                      sx={{ mb: 3 }}
                    >
                      Company Name and Avatar
                    </Typography>
                    
                    <Stack spacing={4}>
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          color="text.secondary"
                          sx={{ mb: 1.5 }}
                        >
                          Company Name
                        </Typography>
                        <Stack 
                          direction="row" 
                          spacing={2} 
                          alignItems="center"
                        >
                          <TextField
                            fullWidth
                            hiddenLabel
                            size="small"
                            placeholder="Enter company name"
                            value={name}
                            onChange={(event) => setName(event?.target?.value)}
                            sx={{ maxWidth: 400 }}
                          />
                          <Button
                            onClick={handleUpdateCompany}
                            variant="contained"
                            sx={{ minWidth: 100 }}
                          >
                            Update
                          </Button>
                        </Stack>
                      </Box>

                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          color="text.secondary"
                          sx={{ mb: 1.5 }}
                        >
                          Company Avatar
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 1,
                              overflow: "hidden",
                              bgcolor: "background.neutral",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {avatar ? (
                              <img
                                src={avatar?.includes("http") 
                                  ? avatar 
                                  : `${getAPIUrl()}/${avatar}`
                                }
                                alt="Company logo"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover"
                                }}
                              />
                            ) : user?.affiliate ? (
                              <img 
                                src={getAssetPath("/assets/logos/logo-link.svg")} 
                                width={60} 
                                height={60}
                              />
                            ) : (
                              <SvgIcon sx={{ width: 40, height: 40 }}>
                                <Logo color={settings?.colorPreset} />
                              </SvgIcon>
                            )}
                          </Box>
                          <Stack direction="row" spacing={2}>
                            <Button 
                              variant="outlined" 
                              component="label"
                              sx={{ minWidth: 100 }}
                            >
                              Upload
                              <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleChange}
                                hidden
                              />
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleUpdate}
                              sx={{ minWidth: 100 }}
                            >
                              Update
                            </Button>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  <Box>
                    <Typography 
                      variant="h6" 
                      color="text.primary"
                      sx={{ mb: 2 }}
                    >
                      Server IP Address
                    </Typography>
                    {tokenLoading ? (
                      <Skeleton sx={{ height: 40, maxWidth: 400 }} />
                    ) : (
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center"
                        sx={{
                          bgcolor: 'background.neutral',
                          borderRadius: 1,
                          p: 1.5,
                          maxWidth: 400
                        }}
                      >
                        <code style={{ fontSize: 14, flexGrow: 1 }}>
                          {company?.server_ip ?? "n/a"}
                        </code>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(company?.server_ip)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'primary.lighter' }
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Stack>
                    )}
                  </Box>

                  <Box>
                    <Typography 
                      variant="h6" 
                      color="text.primary"
                      sx={{ mb: 2 }}
                    >
                      API Token
                    </Typography>
                    {tokenLoading ? (
                      <Skeleton sx={{ height: 40, maxWidth: 400 }} />
                    ) : (
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center"
                        sx={{
                          bgcolor: 'background.neutral',
                          borderRadius: 1,
                          p: 1.5,
                          maxWidth: 400
                        }}
                      >
                        <code style={{ fontSize: 14, flexGrow: 1 }}>
                          {companyToken}
                        </code>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(companyToken)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'primary.lighter' }
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Stack>
                    )}
                  </Box>

                  <Box>
                    <Stack spacing={3}>
                      <Box>
                        <Stack 
                          direction="row" 
                          spacing={2} 
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="h6" color="text.primary">
                            Auto FTD on First Deposit
                          </Typography>
                          <Switch 
                            checked={autoFtd} 
                            onChange={handleUpdateAutoFtd}
                            sx={{ ml: 'auto' }}
                          />
                        </Stack>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ maxWidth: 600 }}
                        >
                          Automatically enables FTD Custom Field when first deposit is made
                        </Typography>
                      </Box>

                      <Box>
                        <Stack 
                          direction="row" 
                          spacing={2} 
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="h6" color="text.primary">
                            Auto FTD Amount on First Deposit
                          </Typography>
                          <Switch 
                            checked={autoFtdAmount} 
                            onChange={handleUpdateAutoFtdAmount}
                            sx={{ ml: 'auto' }}
                          />
                        </Stack>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ maxWidth: 600 }}
                        >
                          Automatically sets FTD amount when first deposit is recorded
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Stack 
                          direction="row" 
                          spacing={2} 
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="h6" color="text.primary">
                            Assign Confirmation
                          </Typography>
                          <Switch 
                            checked={assignConfirmation} 
                            onChange={handleUpdateAssignConfirmation}
                            sx={{ ml: 'auto' }}
                          />
                        </Stack>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ maxWidth: 600 }}
                        >
                          Shows a confirmation dialog when assigning clients to agents, teams, or desks.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <TransactionTypeSettings
              company={company}
              refreshUser={refreshUser}
            />

            <Card>
              <Box sx={CARD_HEADER_PADDING}>
                <Typography variant="h5" color="text.primary">
                  Customer Table Settings
                </Typography>
              </Box>
              <Divider />
              <CardContent sx={CARD_CONTENT_PADDING}>
                <Button
                  onClick={() => setTableModalOpen(true)}
                  variant="contained"
                  sx={{ minWidth: 200 }}
                >
                  Configure Table
                </Button>
              </CardContent>
            </Card>
          </Stack>
        );
      case "ip":
        return <SettingsPlatformIp />;
      case "2fa":
        return <SettingsPlatformOtp company={company} />;
      case "logout":
        return (
          <SettingsPlatformLogout
            company={company}
            handleCompanyGet={handleCompanyGet}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: sidebar.smUp ? 2 : 1 }}>
        <Box
          component="main"
          sx={{
            minHeight: { xs: 600, sm: 700, md: 880 },
            backgroundColor: "background.paper",
            flex: "1 1 auto",
            position: "relative",
          }}
        >
          <Box
            ref={rootRef}
            sx={{
              bottom: 0,
              display: "flex",
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
            }}
          >
            <SettingsPlatformSidebar
              container={rootRef.current}
              currentTab={currentTab}
              setCurrentTab={(tab) => {
                setCurrentTab(tab);
                if (!sidebar.mdUp) {
                  sidebar.handleClose();
                }
              }}
              onClose={sidebar.handleClose}
              open={sidebar.open}
              isMobile={!sidebar.smUp}
            />
            <MailContainer 
              open={sidebar.open}
              sx={{ 
                transition: 'margin 0.3s ease-in-out',
                width: '100%'
              }}
            >
              <Scrollbar sx={{ height: 1 }}>
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1, 
                    ml: 1,
                    mr: 1,
                    justifyContent: 'space-between'
                  }}>
                    <IconButton
                      onClick={sidebar.handleToggle}
                      sx={{ 
                        display: 'flex',
                        p: sidebar.smUp ? 1 : 0.5
                      }}
                    >
                      <Iconify icon="lucide:menu" width={24} height={24} />
                    </IconButton>
                    {!sidebar.open && (
                      <Typography 
                        variant={sidebar.smUp ? "h6" : "subtitle1"}
                        sx={{ fontWeight: 'medium' }}
                      >
                        {getTabTitle()}
                      </Typography>
                    )}
                  </Box>
                  <Divider />
                </Box>
                <Stack p={sidebar.smUp ? 2 : 1}>
                  {renderContent()}
                </Stack>
              </Scrollbar>
            </MailContainer>
          </Box>
        </Box>

        <TableModal
          open={tableModalOpen}
          variant="customer"
          onClose={() => setTableModalOpen(false)}
          tableColumn={tableColumn}
          defaultColumn={[...defaultColumn]}
          updateRule={handleUpdateRule}
          sorting={{}}
          pinnedFields={pinnedFields}
          onPinnedFieldsSet={setPinnedFields}
          isPlatform
        />
      </CardContent>
    </Card>
  );
};
