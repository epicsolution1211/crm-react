import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { toast } from "react-hot-toast";

import { ChatBlank } from "src/sections/dashboard/chat/chat-blank";
import { ChatComposer } from "src/sections/dashboard/chat/chat-composer";
import { ChatContainer } from "src/sections/dashboard/chat/chat-container";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { thunks as agentThunk } from "src/thunks/contact_list";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { useSettings } from 'src/hooks/use-settings';
import { chatApi } from "src/api/chat";
import { ChatSidebar } from "src/sections/dashboard/support-chats/chat-sidebar";
import { ChatThread } from "src/sections/dashboard/support-chats/chat-thread";
import { customersApi } from "src/api/customers";
import { customerFieldsApi } from "src/api/customer-fields";
import { Scrollbar } from "src/components/scrollbar";
import { Iconify } from "src/components/iconify";
import { getAPIUrl } from "src/config";

const useSidebar = () => {
  const searchParams = useSearchParams();
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
  }, [mdUp]);

  const handeParamsUpdate = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    }
  }, [mdUp]);

  useEffect(() => {
    handeParamsUpdate();
  }, [searchParams]);

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
  };
};

const useSupportChats = () => {
  const [supportChats, setSupportChats] = useState([]);

  const handleChatsGet = async () => {
    try {
      const { conversations } = await chatApi.getSupportChats();
      setSupportChats(conversations);
    } catch (error) {
      console.error("error: ", error);
    }
  }

  useEffect(() => {
    handleChatsGet();
  }, []);

  return {
    supportChats, handleChatsGet
  };
};

const Page = () => {
  const settings = useSettings();
  const dispatch = useDispatch();
  const rootRef = useRef(null);
  const searchParams = useSearchParams();
  const compose = searchParams.get("compose") === "true";
  const threadKey = searchParams.get("conversationId") || undefined;
  const customerId = searchParams?.get("customer");
  const sidebar = useSidebar();
  // eslint-disable-next-line no-unused-vars
  const { supportChats: chats, handleChatsGet } = useSupportChats();
  const { user } = useAuth();
  const [customer, setCustomer] = useState();
  const [customFields, setCustomFields] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_support_chats === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  const getCustomer = async () => {
    try {
      const res = await customersApi.getCustomerInfo(
        searchParams?.get("customer")
      );
      setCustomer(res?.client);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getCustomerFields = async () => {
    try {
      const res = await customerFieldsApi.getCustomerFields();
      setCustomFields(res?.client_fields);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleConversationCreate = useCallback(
    async (data) => {
      const request = {
        ...data,
        client_ids: [searchParams?.get("customer")],
        account_id: user?.id + "",
      };
      const response = await customersApi.createTicket(request);
      handleChatsGet();
      toast("Conversation successfully created!");
      return response;
    },
    [searchParams, user]
  );

  useEffect(() => {
    return () => {
      dispatch(agentThunk.resetList());
    }
  }, []);

  useEffect(() => {
    if (customerId) {
      getCustomer();
      getCustomerFields();
    }
    return () => {
      dispatch(agentThunk.resetList());
    };
  }, [customerId]);

  usePageView();

  const view = threadKey ? "conversation" : compose ? "compose" : "blank";

  return (
    <>
      <Seo title={`Support Chats`} />
      <Divider />
      <Box
        component="main"
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Stack
          ref={rootRef}
          sx={{
            display: "flex",
            flexDirection: "row",
            height: {
              xs: 'calc(100vh - 100px)',
              md: settings?.layout === 'horizontal' ? 'calc(100vh - 140px)' : 'calc(100vh - 80px)'
            }
          }}
        >
          <ChatSidebar
            container={rootRef.current}
            onClose={sidebar.handleClose}
            open={sidebar.open}
            // chats={chats}
          />
          <ChatContainer open={sidebar.open}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ p: 2 }}
            >
              <IconButton onClick={sidebar.handleToggle}>
                <Iconify icon="lucide:menu" width={24} height={24} />
              </IconButton>

              {customer?.client?
              <Stack direction='row' gap={0.5} alignItems='center'>
                {searchParams.get("customer") && (
                  <Tooltip
                    title={
                      <Scrollbar sx={{maxHeight:500, minWidth:300}}>
                        <Stack spacing={2} sx={{ p: 2 }}>
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
                              {customer?.emails?.map((email) => (
                                <Typography sx={{ fontSize: 12 }} key={email?.id}>
                                  {email?.value}
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
                              {customer?.phone_numbers?.map((numbers) => (
                                <Typography sx={{ fontSize: 12 }} key={numbers?.id}>
                                  {numbers?.value}
                                </Typography>
                              ))}
                            </Stack>
                          </Stack>

                          {customer?.client_comments?.length ? (
                            <Stack>
                              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                                Comments:
                              </Typography>
                              <Stack spacing={1} sx={{ mt: 1 }}>
                                {customer?.client_comments?.map((comment) => (
                                  <Stack
                                    key={comment?.id}
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                  >
                                    <Typography
                                      variant={"subtitle2"}
                                      sx={{ fontSize: 11 }}
                                    >
                                      {format(
                                        new Date(comment?.created_at),
                                        "dd MMM yyyy HH:mm"
                                      )}
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

                          <Stack>
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                              Custom data:
                            </Typography>
                            <Stack spacing={1} sx={{ mt: 1 }}>
                              {customFields?.map((field) => (
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  key={field?.id}
                                >
                                  <Typography sx={{ fontSize: 12 }}>
                                    {field?.friendly_name}:
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: 12, fontWeight: 600 }}
                                  >
                                    {customer?.client_fields?.[field?.id] ?? "N/A"}
                                  </Typography>
                                </Stack>
                              ))}
                            </Stack>
                          </Stack>
                        </Stack>
                      </Scrollbar>
                    }
                  >
                    <Stack 
                      direction="row" 
                      alignItems="center" 
                      spacing={1} 
                      pl={0.5}
                      sx={{ cursor:'pointer' }}
                      >
                      <Avatar
                        src={customer?.client?.avatar ? customer?.client?.avatar?.includes('http') ? customer?.client?.avatar : `${getAPIUrl()}/${customer?.client?.avatar}` : ""}
                        width={28}
                        height={28}
                      />
                      <Typography>{customer?.client?.full_name}</Typography>
                      <Iconify icon={`circle-flags:${customer?.client?.country?.toLowerCase()}`} width={24} />
                    </Stack>
                  </Tooltip>
                )}
                <IconButton
                  sx={{ '&:hover': { color: 'primary.main' }, color:'text.primary'}} 
                  onClick={()=> router.push(`${paths.dashboard.customers.index}/${searchParams.get("customer")}`)}
                >
                  <Iconify icon="carbon:arrow-right" />
                </IconButton>
              </Stack>
              :
              null}
              <Stack></Stack>
            </Stack>
            <Divider />
            {view === "conversation" && (
              <ChatThread
                threadKey={threadKey} />
            )}
            {view === "compose" && <ChatComposer />}
            {view === "blank" && <ChatBlank />}
          </ChatContainer>
        </Stack>
      </Box>
    </>
  );
};

export default Page;
