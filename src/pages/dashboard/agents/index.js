import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { startOfMonth } from "date-fns";
import { useTimezone } from "src/hooks/use-timezone";

import { AgentsListTable } from "src/sections/dashboard/agents/agents-list-table";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";
import { agentsApi } from "src/api/agents";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSettings } from "src/hooks/use-settings";

const Page = () => {
  usePageView();
  const { user, company } = useAuth();
  const { toUTCTime } = useTimezone();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_agents === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  const settings = useSettings();

  const [agentsData, setAgentsData] = useState([]);
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const [filterDate, setFilterDate] = useState({
    from: startOfMonth(new Date()),
    to: new Date()?.setHours(23, 59, 59, 999),
  });
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const query = useDebounce(text, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(true);
  const [deskList, setDeskList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [status, setStatus] = useState([]);
  const [desks, setDesks] = useState([]);
  const [nonDesks, setNonDesks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);

  const filters = useMemo(() => {
    const filter = {}
    if (status.length > 0) {
      filter.status = status
    }
    if (desks.length > 0) {
      filter.desks = desks
    }
    if (nonDesks.length > 0) {
      filter.nonDesks = nonDesks
    }
    if (teams.length > 0) {
      filter.teams = teams
    }
    if (roles.length > 0) {
      filter.roles = roles
    }
    return filter;
  }, [status, desks, nonDesks, teams, roles]);

  useEffect(() => {
    const agentsPerPage = localStorage.getItem("agentsPerPage");

    if (agentsPerPage) {
      setPerPage(agentsPerPage);
    }
  }, []);

  const getDesk = async () => {
    try {
      const res = await settingsApi.getDesk();
      const deskList = res?.desks
        ?.filter((desk) => {
          if (
            user?.acc?.acc_v_client_desk === undefined ||
            user?.acc?.acc_v_client_desk
          ) {
            return true;
          } else if (
            user?.acc?.acc_v_client_self_desk === undefined ||
            user?.acc?.acc_v_client_self_desk
          ) {
            return user?.desk_ids?.includes(desk?.id);
          } else {
            return false;
          }
        })
        ?.map((desk) => ({
          label: desk?.name,
          value: desk?.id?.toString(),
          color: desk?.color ?? settings?.colorPreset,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setDeskList(deskList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getSkillTeams = async () => {
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

  const getRoles = async () => {
    try {
      const res = await settingsApi.getRoles();

      const roleInfo = res?.temp_rolls?.map((temp) => ({
        label: temp?.name,
        value: temp?.id,
      }));
      setRoleList(roleInfo);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAgentData = async () => {
    const startTime = toUTCTime(filterDate?.from);
    const endTime = toUTCTime(filterDate?.to);

    setIsPending(true);
    setIsLoading(true);
    let request = {
      start_time: startTime,
      end_time: endTime,
      page: currentPage + 1,
      per_page: perPage,
      q: query?.length > 0 ? query : null,
      team_ids: teams,
      desk_ids: desks,
      role_ids: roles,
      non_desk_ids: nonDesks,
    };
    if (status?.length === 1) {
      request.on_duty = status?.includes("true") ? true : "false";
    }
    try {
      const res = await agentsApi.getAgentsData(request);
      const agentData = res?.accounts?.map((item) => {
        if (item?.agent?.account?.id === user?.id) {
          item.agent.account.on_duty = true;
          return item;
        } else {
          return item;
        }
      });
      // if (!user?.acc?.acc_v_agent_others) {
      //   setAgentsData(
      //     agentData?.filter((agent) => agent?.agent?.account?.id === user?.id)
      //   );
      // } else 
      if (!user?.acc?.acc_v_agent_self) {
        setAgentsData(
          agentData?.filter((agent) => agent?.agent?.account?.id !== user?.id)
        );
      } else {
        setAgentsData(agentData);
      }
      setCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsPending(false);
  };

  useEffect(() => {
    getDesk();
    getSkillTeams();
    getRoles();
  }, []);

  useEffect(() => {
    if (user) {
      getAgentData();
    }
  }, [
    currentPage,
    perPage,
    query,
    filterDate,
    user,
    status,
    desks,
    nonDesks,
    teams,
    roles,
  ]);

  return (
    <>
      <Seo title={`Dashboard: Agents List`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 4, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Agents</Typography>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <DatePicker
                  disabled={company?.list_filtering}
                  format="dd/MM/yyyy"
                  label="From"
                  onChange={(val) => {
                    setFilterDate((prev) => ({
                      ...prev,
                      from: val,
                    }));
                    setCurrentPage(0);
                  }}
                  maxDate={filterDate?.to}
                  value={filterDate?.from}
                  slotProps={{ textField: { size: "small" } }}
                />
                <DatePicker
                  disabled={company?.list_filtering}
                  format="dd/MM/yyyy"
                  label="To"
                  onChange={(val) => {
                    setFilterDate((prev) => ({ ...prev, to: val?.setHours(23, 59, 59, 999) }));
                    setCurrentPage(0);
                  }}
                  minDate={filterDate?.from}
                  value={filterDate?.to}
                  slotProps={{ textField: { size: "small" } }}
                />
              </Stack>
            </Stack>
            <PayWallLayout>
              <Card>
                <AgentsListTable
                  filters={filters}
                  getAgentData={getAgentData}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  isPending={isPending}
                  count={count}
                  onPageChange={setCurrentPage}
                  page={currentPage}
                  onRowsPerPageChange={(event) => {
                    setPerPage(event?.target?.value);
                    localStorage.setItem("agentsPerPage", event?.target?.value);
                  }}
                  rowsPerPage={perPage}
                  agentsList={agentsData}
                  setStatus={(val) => {
                    setStatus(val);
                    setCurrentPage(0);
                  }}
                  status={status}
                  text={text}
                  setText={(val) => {
                    setText(val);
                    setCurrentPage(0);
                  }}
                  teamList={teamList}
                  roleList={roleList}
                  deskList={deskList}
                  desks={desks}
                  nonDesks={nonDesks}
                  roles={roles}
                  teams={teams}
                  setDesks={setDesks}
                  setRoles={setRoles}
                  setTeams={setTeams}
                  setNonDesks={setNonDesks}
                  onSetCurrentPage={setCurrentPage}
                />
              </Card>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
