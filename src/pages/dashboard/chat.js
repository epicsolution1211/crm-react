import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Iconify } from 'src/components/iconify';
import { ChatBlank } from "src/sections/dashboard/chat/chat-blank";
import { ChatComposer } from "src/sections/dashboard/chat/chat-composer";
import { ChatContainer } from "src/sections/dashboard/chat/chat-container";
import { ChatCreateConversationDialog } from "src/sections/dashboard/chat/chat-create-conversation-dialog";
import { ChatSidebar } from "src/sections/dashboard/chat/chat-sidebar";
import { ChatThread } from "src/sections/dashboard/chat/chat-thread";
import { Scrollbar } from "src/components/scrollbar";
import { Seo } from "src/components/seo";
import { customerFieldsApi } from "src/api/customer-fields/index";
import { customersApi } from "src/api/customers";
import { getAPIUrl } from "src/config";
import { paths } from "src/paths";
import { thunks } from "src/thunks/client_chat";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { useSettings } from "src/hooks/use-settings";

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

const usePreviousTickets = (customerId = "") => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.client_chat.tickets);
  const resetTickets = () => dispatch(thunks.resetChat());

  const handleTicketsGet = () => {
    dispatch(thunks.getClientChat({ client_ids: [customerId] }));
  };

  return {
    tickets,
    handleTicketsGet,
    resetTickets,
  };
};

const Page = () => {
  const router = useRouter();
  const rootRef = useRef(null);
  const settings = useSettings();
  const searchParams = useSearchParams();
  const customerId = searchParams?.get("customer");
  const compose = searchParams.get("compose") === "true";
  const threadKey = searchParams.get("conversationId") || undefined;
  const sidebar = useSidebar();
  const { tickets, handleTicketsGet, resetTickets } = usePreviousTickets(
    searchParams?.get("customer")
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [customer, setCustomer] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const { user } = useAuth();

  const handleDialogOpen = useCallback(() => setCreateDialogOpen(true), []);

  const handleDialogClose = useCallback(() => setCreateDialogOpen(false), []);

  const handleConversationCreate = useCallback(
    async (data) => {
      const request = {
        ...data,
        client_ids: [searchParams?.get("customer")],
        account_id: user?.id + "",
      };
      const response = await customersApi.createTicket(request);
      handleTicketsGet();
      toast.success("Conversation successfully created!");
      return response;
    },
    [searchParams, user]
  );

  const handleCloseChat = useCallback(() => {
    const returnTo = searchParams.get("returnTo") || "";

    if (returnTo === "list") {
      router.push(paths.dashboard.customers.index);
    } else if (returnTo === "detail") {
      router.push(
        paths.dashboard.customers.details.replace(
          ":customerId",
          searchParams?.get("customer")
        )
      );
    } else if (returnTo === "agents") {
      router.push(paths.dashboard.agents);
    }
  }, [router, searchParams]);

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

  usePageView();

  useEffect(() => {
    resetTickets();
    // handleTicketsGet();
  }, []);

  useEffect(() => {
    const savedParams = localStorage.getItem('chatSearchParams');
    const returnTo = searchParams.get('returnTo');
    
    if (!customerId && savedParams && returnTo !== 'list') {
      try {
        const params = JSON.parse(savedParams);
        const newUrl = new URL(window.location.href);
        
        if (params.customer) {
          newUrl.searchParams.set('customer', params.customer);
        }
        if (params.conversationId) {
          newUrl.searchParams.set('conversationId', params.conversationId);
        }
        if (params.compose) {
          newUrl.searchParams.set('compose', params.compose);
        }
        if (params.returnTo) {
          newUrl.searchParams.set('returnTo', params.returnTo);
        }
        
        router.replace(newUrl.pathname + newUrl.search);
        return;
      } catch (error) {
        localStorage.removeItem('chatSearchParams');
      }
    }
    
    if (customerId) {
      getCustomer();
      getCustomerFields();
    }
  }, [customerId, router, searchParams]);

  useEffect(() => {
    if (customerId || threadKey || compose) {
      const paramsToSave = {
        customer: customerId,
        conversationId: threadKey,
        compose: compose ? 'true' : 'false',
        returnTo: searchParams.get('returnTo')
      };
      localStorage.setItem('chatSearchParams', JSON.stringify(paramsToSave));
    }
  }, [customerId, threadKey, compose, searchParams]);

  const view = threadKey ? "conversation" : compose ? "compose" : "blank";

  return (
    <>
      <Seo title="Chat" />
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
              xs: "calc(100vh - 85px)",
              md:
                settings?.layout === "horizontal"
                  ? "calc(100vh - 140px)"
                  : "calc(100vh - 75px)",
            },
          }}
        >
          <ChatSidebar
            container={rootRef.current}
            onClose={sidebar.handleClose}
            open={sidebar.open}
            customerId={searchParams?.get("customer") || ""}
            chats={tickets?.tickets}
            onOpenCreateDialog={handleDialogOpen}
            clientChat
          />
          <ChatContainer open={sidebar.open}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ p: 2 }}
            >
              <IconButton onClick={sidebar.handleToggle}>
                <Iconify icon="gg:menu" />
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

              {searchParams?.get("customer") ? (
                <Tooltip title="Close Chat">
                  <IconButton onClick={handleCloseChat}>
                    <Iconify icon="gravity-ui:xmark" />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}

            </Stack>
            <Divider />
            {view === "conversation" && (
              <ChatThread
                threadKey={threadKey}
                handleTicketsGet={handleTicketsGet}
                tickets={tickets?.tickets}
                customer={customer}
              />
            )}
            {view === "compose" && <ChatComposer />}
            {view === "blank" && <ChatBlank />}
          </ChatContainer>
        </Stack>

        <ChatCreateConversationDialog
          open={createDialogOpen}
          onClose={handleDialogClose}
          onCreateConversation={handleConversationCreate}
          handleTicketsGet={handleTicketsGet}
        />
      </Box>
    </>
  );
};

export default Page;
