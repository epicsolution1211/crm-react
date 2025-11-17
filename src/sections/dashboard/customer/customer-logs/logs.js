import { useCallback, useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { LogsSidebar } from "./logs-sidebar";
import { Scrollbar } from "src/components/scrollbar";
import { settingsApi } from "src/api/settings";
import { LogsTable } from "./logs-table";
import { useDebounce } from "src/hooks/use-debounce";
import { MailContainer } from "../../mail/mail-container";
import { useAuth } from "src/hooks/use-auth";
import { useGetCustomerAgents } from "src/api-swr/customer";
import { authApi } from "src/api/auth";
import { Iconify } from "src/components/iconify";
import { useTimezone } from "src/hooks/use-timezone";

const useSidebar = () => {
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

const labels = [
  { id: "Client", name: "Client" },
  { id: "ClientComment", name: "Comments" },
  { id: "TTransaction", name: "Transactions" },
  { id: "Position", name: "Positions" },
  { id: "Calls", name: "Calls" },
  { id: "Bet", name: "Bets" },
];

const FIELDS = [
  "transaction",
  "leverage",
  "l_spread_on",
  "opened_amount",
  "comment",
  "l_spread",
  "sl",
  "agent",
  "FTD",
  "created_at",
  "opened_at",
  "amount",
  "trade_amount",
  "position_id",
  "password",
  "Brand_Status",
  "Broker_Name",
  "label_id",
  "desk",
  "freeze_trading",
  "desk_id",
  "full_name",
  "first_name",
  "phone_number",
  "email",
  "closed_at",
  "tp",
  "IP",
  "ClientAccount",
  "kyc_id_status",
  "kyc_billing_status",
  "status",
  "last_name",
];

export const Logs = (props) => {
  const { customerId } = props;
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const [isShowAll, setIsShowAll] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("");
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(100);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [field, setField] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [id, setId] = useState(null);
  const [createdAtStart, setCreatedAtStart] = useState(null);
  const [createdAtEnd, setCreatedAtEnd] = useState(null);
  const [text, setText] = useState(null);
  const [before, setBefore] = useState(null);
  const [after, setAfter] = useState(null);
  const query = useDebounce(text);
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();
  const { agentList } = useGetCustomerAgents({ desk_ids: user?.desk_ids, per_page: 10000, non_account_ids: [], q : "*"});

  useEffect(() => {
    if (currentMenu === "") {
      setCurrentMenu("Client");
    }
    setCurrentPage(0);
  }, [currentMenu]);

  const getLogs = async (itemType = "Client") => {
    setIsLoading(true);
    try {
      setLogs([]);
      const request = {
        q: query?.length > 0 ? query : null,
        item_type: itemType,
        page: currentPage + 1,
        per_page: perPage,
        nested: { client_id: customerId },
        created_at_start: createdAtStart,
        created_at_end: createdAtEnd,
        id,
        before,
        after
      };

      if (accountId) {
        request["who_type"] = "Account";
        request["who_id"] = accountId;
      }

      if (field) {
        request["field"] = field;
      }
      const res = await settingsApi.getHistory(request);
      setLogs(res?.history);
      setCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentMenu) {
      getLogs(currentMenu);
    }
  }, [currentMenu, perPage, currentPage, customerId, accountId, createdAtEnd, createdAtStart, query, field, id, before, after]);

  const dateChipVal = (val) => {
    if (val) {
      return toLocalTime(val);
    } else return "";
  }

  const accountChipVal = (val) => {
    if (val) {
      return agentList?.find(agent => agent?.value == val)?.label;
    }

    return "n/a";
  }

  const userId = localStorage.getItem("account_id");

  const [rule, setRule] = useState([]);
  const [tableSetting, setTableSetting] = useState({});
  
  const getTableSetting = async () => {
    try {
      const { account } = await authApi.me({ accountId: userId });
      if (account?.column_setting) {
        setTableSetting(JSON.parse(account?.column_setting));
        setRule(JSON.parse(account?.column_setting)?.customerLogsTable ?? []);
      } 
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    getTableSetting();
  }, [])

  return (
    <Card>
      <CardContent>
        <Box
          component="main"
          sx={{
            backgroundColor: "background.paper",
            flex: "1 1 auto",
            position: "relative",
          }}
        >
          <Box
            ref={rootRef}
            sx={{
              minHeight: 600,
              display: "flex",
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
            }}
          >
            <LogsSidebar
              container={rootRef.current}
              currentLabelId={"currentLabelId"}
              labels={labels}
              currentMenu={currentMenu}
              setCurrentMenu={(val) => {
                setCurrentMenu(val);
                setAccountId(null);
                setId(null);
                setCreatedAtEnd(null);
                setCreatedAtStart(null);
                setBefore(null);
                setAfter(null);
                setIsShowAll(false);
              }}
              onClose={sidebar.handleClose}
              open={sidebar.open}
            />
            <MailContainer open={sidebar.open}>
              <Scrollbar sx={{ height: 1 }}>
                <Box>
                  <IconButton
                    sx={{ mb: 1, ml: 1 }}
                    onClick={sidebar.handleToggle}
                  >
                    <Iconify icon="lucide:menu" width={24} height={24} />
                  </IconButton>
                  <Divider />
                </Box>
                <Stack px={2} pt={4} spacing={3}>
                  <Typography variant="h5">
                    {labels.find((l) => l?.id === currentMenu)?.name} Logs
                  </Typography>

                  {field || accountId || createdAtEnd || createdAtStart || id || before || after ? (
                    <Stack
                      alignItems="center"
                      direction="row"
                      flexWrap="wrap"
                      gap={1}
                    >
                      {field ? (
                        <Chip
                          label={`Field: ${field}`}
                          onDelete={() => setField(null)}
                        />
                      ) : null}
                      {accountId ? (
                        <Chip
                          label={`Account name: ${accountChipVal(accountId)}`}
                          onDelete={() => setAccountId(null)}
                        />
                      ) : null}
                      {createdAtStart ? (
                        <Chip
                          label={`Updated At Start: ${dateChipVal(createdAtStart)}`}
                          onDelete={() => setCreatedAtStart(null)}
                        />
                      ) : null}
                      {createdAtEnd ? (
                        <Chip
                          label={`Updated At End: ${dateChipVal(createdAtEnd)}`}
                          onDelete={() => setCreatedAtEnd(null)}
                        />
                      ) : null}
                      {id ? (
                        <Chip
                          label={`id: ${id}`}
                          onDelete={() => setId(null)}
                        />
                      ) : null}
                      {before ? (
                        <Chip
                          label={`Before: ${before}`}
                          onDelete={() => setBefore(null)}
                        />
                      ) : null}
                      {after ? (
                        <Chip
                          label={`After: ${after}`}
                          onDelete={() => setAfter(null)}
                        />
                      ) : null}
                    </Stack>
                  ) : null}

                  <LogsTable
                    currentPage={currentPage}
                    perPage={perPage}
                    logs={logs}
                    count={count}
                    setCurrentPage={setCurrentPage}
                    setPerPage={setPerPage}
                    isLoading={isLoading}
                    onSetAccountId={setAccountId}
                    accountId={accountId}
                    setId={setId}
                    text={text}
                    setText={setText}
                    setBefore={setBefore}
                    setAfter={setAfter}
                    isShowAll={isShowAll}
                    setIsShowAll={setIsShowAll}
                    field={field}
                    onSetField={setField}
                    fieldList={FIELDS}
                    agentList={agentList}
                    onSetCreatedAtEnd={setCreatedAtEnd}
                    onSetCreatedAtStart={setCreatedAtStart}
                    createdAtEnd={createdAtEnd}
                    createdAtStart={createdAtStart}

                    // Table Setting
                    tableSetting={tableSetting}
                    rule={rule}
                    setRule={setRule}
                    setTableSetting={setTableSetting}
                  />
                </Stack>
              </Scrollbar>
            </MailContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
