import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import { useAuth } from "src/hooks/use-auth";
import { useGetCustomerLabels } from "src/api-swr/customer";
import { announcementsApi } from "src/api/announcements";
import { AnnouncementDialog } from './announcement-dialog';
import { ChatWithAIDrawer } from './chat-with-ai-drawer';
import { CreateTaskDialog } from "src/sections/dashboard/todo/todo-create-dialog";
import { Iconify } from 'src/components/iconify';
import { ClientComments } from "../../client-comments";
import { MultiSelect } from "src/components/multi-select";
import { Scrollbar } from "src/components/scrollbar";
import { customersApi } from "src/api/customers";
import { useTimezone } from "src/hooks/use-timezone";

const POSSIBLE_EMPTY_NOTE = [
  "<p> </p>",
  "<p></p>",
  "<p>  </p>",
];

export const QuickActionWidget = ({
    data,
    rule, 
    defaultRule, 
    emails,
    phoneNumbers,
    customFilters,
    fields,
    onGetData = () => {}, 
    handleReminder, 
    handleSelectedLabelsGet = () => {}, 
    handleLabelsDialogOpen, 
    handleCustomerCall, 
    handleOpenCustomerChat, 
    setCommentClientId,
    setMessageId,
    setQuickEmailInfo,
    setCustomerToEditFields,
    assignCustomerForms,
    iconSetting,
    traderDisabled = false,
    handleTraderLogin = () => {},
    handleDashboardLogin = () => {},
    isDetail = false,
  }) => {
  const [selectedId, setSelectedId]= useState(undefined);
  const filters = useSelector((state) => state.customers.customerFilters);

  const { labelList } = useGetCustomerLabels();
  const { labelList: selectedList, mutate } = useGetCustomerLabels({client_ids: selectedId ? [selectedId] : []});

  const checkedLabelIds= useMemo(()=> {
      const ids = selectedList?.filter((label) => label.check_status)?.map((label) => label?.value + "");
      return ids;
  }, [selectedList]);

  const { user, company } = useAuth();
  const { toLocalTime } = useTimezone();

  const prevIconSetting = useRef([]);
  const [iconSettings, setIconSettings] = useState([]);

  const [openAnnouncementDialog, setOpenAnnouncementDialog] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const [isOpenChatWithAIDrawer, setIsOpenChatWithAIDrawer] = useState(false);
  const [isOpenCreateTaskDialog, setIsOpenCreateTaskDialog] = useState(false);
  const [isOpenCreateTicketDialog, setIsOpenCreateTicketDialog] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const handleClickIcon = (id, target) => {
    if (iconSettings?.length && iconSettings?.some((item) => item?.id === id)) {
      const existIndex = iconSettings?.findIndex((item) => item?.id === id);
      const result = [...iconSettings];
      result[existIndex].target = target;
      localStorage.setItem("iconSetting", JSON.stringify(result));
      setIconSettings(result);
    } else {
      const result = [...iconSettings, { id, target }];
      localStorage.setItem("iconSetting", JSON.stringify(result));
      setIconSettings((prev) => [...prev, { id, target }]);
    }
  };

  const handleSelectedLabelsChange = async (labels, filters = {}, id = null) => {
      const addedLabels = labels.filter((l) => !checkedLabelIds.includes(l));
      const removedLabels = checkedLabelIds.filter((l) => !labels.includes(l));

      const requestData = {
        ...filters,
      };

      requestData["client_ids"] = [id];

      if (addedLabels?.length) {
        requestData["add_label_ids"] = addedLabels;
      }

      if (removedLabels?.length) {
        requestData["remove_label_ids"] = removedLabels;
      }

      await customersApi.assignCustomerLabel(requestData);
      setTimeout(() => {
        onGetData();
      }, 1500);
      mutate();
      toast("Customer labels successfully updated!");
    };

  const target = useMemo(()=> {
    if(iconSetting?.length > 0) {
      return iconSettings?.find((item) => item?.id == data?.id)?.target ?? "";
    }
  }, [iconSettings]);

  useEffect(() => {
    if (JSON.stringify(prevIconSetting.current) !== JSON.stringify(iconSetting)) {
      setIconSettings(iconSetting);
      prevIconSetting.current = iconSetting;
    }
  }, [iconSetting]);

  useEffect(() => {
    if (openAnnouncementDialog) {
      announcementsApi.getAnnouncements()
        .then((response) => {
          setAnnouncements(response?.announcements || []);
        })
        .catch((error) => {
          console.error('Failed to fetch announcements:', error);
          toast.error('Failed to load announcements');
        });
    }
  }, [openAnnouncementDialog]);

  const handleAssignAnnouncement = async (announcementId) => {
    try {
      const request = {
        client_ids: [data?.id],
        announcement_id: announcementId,
      };

      const params = {
        ...filters,
      };

      delete params?.non_ids;
      delete params?.ids;
      delete params?.perPage;
      delete params?.currentPage;

      const customFiltersData = customFilters
          ?.filter(
            (filter) =>
              filter?.filter &&
              (
                (filter?.filter?.field_type === "text" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "multi_choice_radio" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "multi_choice" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "boolean" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "number" && (filter?.filter?.query?.gt || filter?.filter?.query?.lt))
              )
          )
          ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

      await announcementsApi.assignAnnouncement(params, request);
      toast.success('Announcement assigned successfully');
      setOpenAnnouncementDialog(false);
    } catch (error) {
      console.error('Failed to assign announcement:', error);
      toast.error('Failed to assign announcement');
    }
  };

  const handleAssignLabel = (data) => {
    handleClickIcon(data?.id, "label");
    setSelectedId(data?.id);
    handleSelectedLabelsGet(data?.id);
  }

  const debouncedAssignLabel = debounce(handleAssignLabel, 500, { maxWait: 1000 });

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ maxHeight: isDetail ? 165: 30, overflow:'hidden', flexWrap: isDetail ?'wrap': 'nowrap' }}>
        {(user?.acc?.acc_v_client_login_trader === undefined ||
          user?.acc?.acc_v_client_login_trader) && isDetail && rule?.trader && company?.company_type !== 2 ? (
            <Tooltip title="Login to Trader">
              <IconButton
                onClick={() => {
                  handleClickIcon(data?.id, "trader");
                  handleTraderLogin();
                }}
                sx={{ 
                  color: target === "trader" ? "success.main" : "text.disabled",
                  '&:hover': { color: target === "trader"? 'success.dark' : 'primary.main' }
                }}
                disabled={!traderDisabled}
              >
                <Iconify icon="f7:chart-bar-square" width={ isDetail ? 40 : 28 }/>
              </IconButton>
            </Tooltip>
          ) : null}

        {(user?.acc?.acc_v_client_login_dashboard === undefined ||
          user?.acc?.acc_v_client_login_dashboard) && isDetail && rule?.dashboard ? (
            <Tooltip title="Login to Dashboard">
              <IconButton
                onClick={() => {
                  handleClickIcon(data?.id, "dashboard");
                  handleDashboardLogin();
                }}
                sx={{ 
                  color: target === "dashboard" ? "success.main" : "text.disabled",
                  '&:hover': { color: target === "dashboard"? 'success.dark' : 'primary.main' }
                }}
                disabled={!traderDisabled}
              >
                <Iconify icon="tabler:device-analytics" width={ isDetail ? 40 : 28 }/>
              </IconButton>
            </Tooltip>
          ) : null}

        {rule?.info ? (
          <Tooltip
            title={
              <Scrollbar sx={{ maxHeight: 450, minWidth: 300 }}>
                <Stack spacing={2} p={2}>
                  <Stack
                    justifyContent="space-between"
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                      Emails:
                    </Typography>
                    <Stack spacing={1}>
                      {!emails?.length && "N/A"}
                      {emails?.map((email, index) => (
                        <Typography sx={{ fontSize: 12 }} key={index}>
                          {email}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>

                  <Stack
                    justifyContent="space-between"
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                      Phone numbers:
                    </Typography>
                    <Stack spacing={1}>
                      {!phoneNumbers?.length && "N/A"}
                      {phoneNumbers?.map((numbers, index) => (
                        <Typography sx={{ fontSize: 12 }} key={index}>
                          {numbers}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>

                  {data?.client_comments?.length ? (
                    <Stack>
                      <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                        Comments:
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {data?.client_comments?.map((comment, index) => (
                          <Stack
                            key={comment?.id + index}
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Typography
                              variant={"subtitle2"}
                              sx={{ fontSize: 11 }}
                            >
                              {comment?.created_at ? toLocalTime(comment?.created_at) : ""}
                            </Typography>
                            <Typography
                              variant={"subtitle2"}
                              sx={{ fontSize: 11 }}
                            >
                              {comment?.account_name}:{" "}
                            </Typography>
                            <Typography
                              variant={"subtitle2"}
                              sx={{ fontSize: 11 }}
                            >
                              {comment?.comment}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  ) : null}

                  {data?.client_fields &&
                    Object.keys(data?.client_fields)?.length ? (
                    <Stack>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        Custom data:
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {fields?.map((field, index) => (
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            key={field?.id + index}
                          >
                            <Typography sx={{ fontSize: 12 }}>
                              {field?.label}:
                            </Typography>
                            <Typography
                              sx={{ fontSize: 12, fontWeight: 600 }}
                            >
                              {data?.client_fields?.[field?.custom_id]}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  ) : null}
                </Stack>
              </Scrollbar>
            }
          >
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "info");
              }}
              sx={{ 
                color: target === "info" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "info"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="jam:info" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}

        {rule?.reminder ? (
          <Tooltip title="Reminder">
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "reminder");
                handleReminder(data?.id);
              }}
              sx={{ 
                color: target === "reminder" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "reminder"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="line-md:calendar" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}
        
        {rule?.label ? (
          <MultiSelect
            withSearch
            withEdit
            noPadding
            withIcon
            editLabel="Edit customer labels"
            labelIcon={
              <Tooltip title="Assign label">
                <Iconify 
                  icon="mynaui:label" 
                  onClick={() => debouncedAssignLabel(data)}
                  sx={{ 
                    color: target === "label" ? "success.main" : "text.disabled",
                    '&:hover': { color: target === "label"? 'success.dark' : 'primary.main' }
                  }}
                  width={isDetail ? 36 : 30}
                />
              </Tooltip>
            }
            options={labelList?.filter((item) => item?.value !== "_empty")}
            onChange={(value) => handleSelectedLabelsChange(value, filters, data?.id)
            }
            onEditClick={handleLabelsDialogOpen}
            value={checkedLabelIds}
          />
        ) : null}

        {rule?.field ? (
          <Tooltip title="Update custom fields">
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "field");
                setCustomerToEditFields(data?.id);
              }}
              sx={{ 
                color: target === "field" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "field"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="carbon:gui-management" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}

        {rule?.phone ? (
          <>
            {phoneNumbers?.length ? (
              <Tooltip title={
                <Stack alignItems="center" spacing={1}>
                  <Typography fontSize={11} fontWeight={600}>Call customer</Typography>
                  <Typography fontSize={11} fontWeight={600}>Total Called: {data?.total_called ?? 0}</Typography>
                </Stack>
              }>
                <IconButton
                  onClick={() => {
                    handleClickIcon(data?.id, "call");
                    if(isDetail) {
                      handleCustomerCall(data?.phone_number_ids, data?.id, data?.cached_call_conversation_id);
                    } else {
                      handleCustomerCall(data?.phone_number_ids, data?.id, data?.call_conversation_id);
                    }
                  }}
                  sx={{ 
                    color: target === "call" ? "success.main" : "text.disabled",
                    '&:hover': { color: target === "call"? 'success.dark' : 'primary.main' }
                    }}
                >
                  <Iconify icon="line-md:phone-call" width={ isDetail ? 40 : 28 }/>
                </IconButton>
              </Tooltip>
            ) : null}
          </>
        ) : null}

        {rule?.chat ? (
          <Tooltip title="Open chat">
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "chat");
                handleOpenCustomerChat(data?.id);
              }}
              sx={{ 
                color: target === "chat" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "chat"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="fluent:people-chat-16-regular" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}

        {(rule?.chat_with_ai || rule?.chat_with_ai == undefined && defaultRule?.chat_with_ai) ? (
          <Tooltip title="Chat with AI">
            <IconButton
              sx={{ 
                color: target === "chat_with_ai" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "chat_with_ai"? 'success.dark' : 'primary.main' }
                }}
              onClick={() => {
                handleClickIcon(data?.id, "chat_with_ai");
                setCurrentCustomer(data);
                setIsOpenChatWithAIDrawer(true);
              }}
            >
              <Iconify icon="ri:chat-smile-ai-fill" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}

        {(rule?.sms === undefined || rule?.sms) ? (
          <Tooltip color="primary" title={data?.sms_messages?.length > 0 &&
            <Stack spacing={1} sx={{ p: 1.5 }}>
              {data?.sms_messages?.map(message => (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ fontSize: 12 }} variant="subtitle2">{format(new Date(message?.created_at), "dd MMM yyyy HH:mm")}</Typography>
                    <Typography sx={{ fontSize: 12 }} variant="subtitle2">{message?.account?.first_name} {message?.account?.last_name}: </Typography>
                    <Typography sx={{ fontSize: 12 }} variant="subtitle2">{message?.description}</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {message?.sms ? (
                        <Tooltip title="SMS">
                          <Iconify icon="fa-solid:sms" width={13} color="success.main" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Note">
                          <Iconify icon="mage:note-with-text" width={13} color="success.main" />
                        </Tooltip>
                      )}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          }>
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "sms");
                if(isDetail) {
                  setMessageId(data?.cached_sms_conversation_id );
                } else {
                  setMessageId(data?.sms_conversation_id);
                }
              }}
              sx={{ 
                color: target === "sms" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "sms"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="fa-solid:sms" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}

        {(rule?.email === undefined || rule?.email) ? (
          <Tooltip color="primary" title="Send quick email">
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "email");
                setQuickEmailInfo({ customerId: data?.id, brandId: data?.internal_brand_id });
              }}
              sx={{ 
                color: target === "email" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "email"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="line-md:email-arrow-right" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}

        {rule?.note && !POSSIBLE_EMPTY_NOTE.includes(data?.note) ? (
          <>
            {data?.note && (
              <Tooltip
                title={
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: data?.note,
                    }}
                  ></Box>
                }
              >
                <IconButton
                  onClick={() => {
                    handleClickIcon(data?.id, "copy");
                  }}
                  sx={{ 
                    color: target === "copy" ? "success.main" : "text.disabled",
                    '&:hover': { color: target === "copy"? 'success.dark' : 'primary.main' }
                    }}
                >
                  <Iconify icon="mage:note-with-text" width={ isDetail ? 40 : 28 }/>
                </IconButton>
              </Tooltip>
            )}
          </>
        ) : null}

        {rule?.comment ? (
          <Tooltip
            title={<ClientComments comments={data?.client_comments} />}
          >
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "comment");
                setCommentClientId(data?.id);
              }}
              sx={{ 
                color: target === "comment" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "comment"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="uil:comment-edit" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}

        {(rule?.add_task || rule?.add_task == undefined) ? (
          <Tooltip title="Add task">
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "add_task");
                setCurrentCustomer(data);
                setIsOpenCreateTaskDialog(true);
              }}
              sx={{ 
                color: target === "add_task" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "add_task"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="material-symbols:add-task" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}

        {(rule?.add_ticket || rule?.add_ticket == undefined) ? (
          <Tooltip title="Add ticket">
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "add_ticket");
                setCurrentCustomer(data);
                setIsOpenCreateTicketDialog(true);
              }}
              sx={{ 
                color: target === "add_ticket" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "add_ticket"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="bx:task" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ) : null}

        {(rule?.summary) || (rule?.summary == undefined && defaultRule?.summary) ? (
          <Tooltip
            title={data?.call_summery?
              <Stack>
                <Typography fontSize={14}>
                  {data?.call_summery??""}
                </Typography>
              </Stack>
              : "No call summery found"
            }
          >
            <Stack sx={{ cursor: 'pointer'}}>
              <IconButton
                onClick={() => {
                  handleClickIcon(data?.id, "summary");
                }}
                disabled={!data?.call_summery}
                sx={{ 
                  px: 0,
                  color: target === "summary" ? "success.main" : "text.disabled",
                  '&:hover': { color: target === "summary"? 'success.dark' : 'primary.main' }
                  }}
              >
                <Iconify icon="healthicons:artificial-intelligence" width={ isDetail ? 40 : 28 } sx={{px: 0}} />
              </IconButton>
            </Stack>
          </Tooltip>
        ) : null}
        
        {(rule?.status_history === undefined || rule?.status_history) ? (
          <Tooltip color="primary" title={data?.brand_status_array?.length > 0 ?
            <Stack spacing={1} sx={{ p: 1.5 }}>
              {data?.brand_status_array?.map(status => (
                <Stack direction="row" alignItems="center" spacing={3}>
                  {status?.account_name && (
                    <Stack>
                      <Typography sx={{ fontSize: 13 }} fontWeight={600}>Agent</Typography>
                      <Typography sx={{ fontSize: 12 }} variant="subtitle2">{status?.account_name}</Typography>
                    </Stack>
                  )}
                  <Stack>
                    <Typography sx={{ fontSize: 13 }} fontWeight={600}>Status</Typography>
                    <Typography sx={{ fontSize: 12 }} variant="subtitle2">{status?.value}</Typography>
                  </Stack>
                  <Stack>
                    <Typography sx={{ fontSize: 13 }} fontWeight={600}>Created</Typography>
                    <Typography sx={{ fontSize: 12 }} variant="subtitle2">{format(new Date(status?.created_at), "dd MMM yyyy HH:mm")}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          : 'No status history found'}>
            <Stack sx={{ cursor: 'pointer'}}>
              <IconButton
                disabled={data?.brand_status_array == null || data?.brand_status_array == undefined || data?.brand_status_array == 0}
                onClick={() => {
                  handleClickIcon(data?.id, "status_history");
                }}
                sx={{ 
                  color: target === "status_history" ? "success.main" : "text.disabled",
                  '&:hover': { color: target === "status_history"? 'success.dark' : 'primary.main' }
                  }}
              >
                <Iconify icon="material-symbols:history" width={ isDetail ? 40 : 28 }/>
              </IconButton>
            </Stack>
          </Tooltip>
        ) : null}
        
        {(rule?.assign_form === undefined || rule?.assign_form) ? (
          <Tooltip color="primary" title="Assign form">
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "assign_form");
                assignCustomerForms(data?.id);
              }}
              sx={{ 
                color: target === "assign_form" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "assign_form"? 'success.dark' : 'primary.main' }
                }}
            >
              <Iconify icon="clarity:form-line" width={ isDetail ? 40 : 28 }/>
            </IconButton>
          </Tooltip>
        ): null}

        {(rule?.assign_announcement === undefined || rule?.assign_announcement) && 
          (user?.acc?.acc_e_setting_announcements === undefined || user?.acc?.acc_e_setting_announcements) ? (
          <Tooltip title="Assign Announcement">
            <IconButton
              onClick={() => {
                handleClickIcon(data?.id, "announcement");
                setOpenAnnouncementDialog(true);
              }}
              sx={{ 
                color: target === "announcement" ? "success.main" : "text.disabled",
                '&:hover': { color: target === "announcement"? 'success.dark' : 'primary.main' }
              }}
            >
              <Iconify icon="mdi:announcement-outline" width={isDetail ? 40 : 28}/>
            </IconButton>
          </Tooltip>
        ) : null}
      </Stack>

      <AnnouncementDialog
        open={openAnnouncementDialog}
        onClose={() => setOpenAnnouncementDialog(false)}
        announcements={announcements}
        onAssign={handleAssignAnnouncement}
      />

      {isOpenChatWithAIDrawer && (
        <ChatWithAIDrawer
          open={isOpenChatWithAIDrawer}
          onClose={() => {
            setIsOpenChatWithAIDrawer(false);
            setCurrentCustomer(null);
          }}
          customer={currentCustomer}
        />
      )}

      {(isOpenCreateTaskDialog || isOpenCreateTicketDialog) && (
        <CreateTaskDialog
          open={isOpenCreateTaskDialog || isOpenCreateTicketDialog}
          onClose={() => {
            setIsOpenCreateTaskDialog(false);
            setIsOpenCreateTicketDialog(false);
            setCurrentCustomer(null);
          }}
          isTicket={isOpenCreateTicketDialog}
          customer={currentCustomer}
        />
      )}
    </>
  )
}
