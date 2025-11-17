import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { usePageView } from "src/hooks/use-page-view";
import { useSelector } from "react-redux";

import { DealingTable } from "src/sections/dashboard/dealing/dealing-table";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { PositionLabelsDialog } from "src/components/position-labels-dialog";
import { Seo } from "src/components/seo";
import { riskApi } from "src/api/risk";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { thunks } from "src/thunks/dealing";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { useMounted } from "src/hooks/use-mounted";
import { useRouter } from "src/hooks/use-router";
import { useSelection } from "src/hooks/use-selection";

const useTeams = () => {
  const [teamList, setTeamList] = useState([]);

  const getTeamsInfo = async () => {
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
    getTeamsInfo();
  }, []);

  return teamList;
};

const useTickers = () => {
  const [tickerList, setTickerList] = useState([]);

  const getTickersInfo = async () => {
    try {
      const res = await settingsApi.getTickers();
      setTickerList(
        res?.tickers?.map((ticker) => ({
          label: ticker?.base_currency_symbol + " - " + ticker?.currency_symbol,
          value: ticker?.id,
        }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTickersInfo();
  }, []);

  return tickerList;
};

const useDealingLabels = (handlePositionsGet) => {
  const isMounted = useMounted();
  const [selectedLabels, setSelectedLabels] = useState([]);

  const handleSelectedLabelsGet = useCallback(async (selected, selectAll) => {
    const requestData = {
    };

    if (selectAll) {
      requestData["select_all"] = true;
    }

    if (selected && selected.length > 0) {
      requestData["position_ids"] = selected;
    }

    const { labels } = await riskApi.getPositionLabels(requestData);

    if (isMounted()) {
      setSelectedLabels(
        labels
          ?.filter((label) => label.check_status)
          .map((label) => label?.label?.id + "")
      );
    }
  }, [isMounted]);

  const handleSelectedLabelsChange = useCallback(
    async (labels, selected, selectAll, perPage) => {
      setSelectedLabels(labels);

      const addedLabels = labels.filter((l) => !selectedLabels.includes(l));
      const removedLabels = selectedLabels.filter((l) => !labels.includes(l));

      const requestData = {
      };

      if (selectAll) {
        requestData["select_all"] = true;
      }

      if (selected && selected.length > 0) {
        requestData["position_ids"] = selected;
      }
      if (perPage && perPage > 0) {
        requestData["per_page"] = perPage;
      }

      if (addedLabels?.length) {
        requestData["add_label_ids"] = addedLabels;
      }

      if (removedLabels?.length) {
        requestData["remove_label_ids"] = removedLabels;
      }

      await riskApi.assignPositionLabels(requestData);
      setTimeout(() => handlePositionsGet(), 1500);
      toast("Position labels successfully updated!");
    },
    [selectedLabels]
  );

  return {
    handleSelectedLabelsGet,
    handleSelectedLabelsChange,
    selectedLabels,
    setSelectedLabels,
  };
};

const Page = () => {
  usePageView();
  const [labelList, setLabelList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const teams = useTeams();
  const tickers = useTickers();
  const dispatch = useDispatch();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_risk_position === false || user?.acc?.acc_v_risk_management === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  const dealingState = useSelector((state) => state.dealing);

  const query = useDebounce(text, 500);
  const [modalOpen, setModalOpen] = useState(false);

  const dealingIds = useSelector((state) => state.dealing.dealingIds);
  const dealingSelection = useSelection(dealingIds ?? [], (message) => {
    toast.error(message);
  });
  const filters = useSelector((state) => state.dealing.dealingFilters);
  const updateFilters = (data) => dispatch(thunks.setFilters(data));

  const getDealInformation = async () => {
    let request = {
      page: filters?.currentPage + 1,
      per_page: filters?.perPage,
      q: query?.length > 0 ? query : null,
      market: filters?.marketValue,
      label_ids: filters?.labels,
      non_label_ids: filters?.non_labels,
      ...filters,
    };
    delete request.marketValue;
    delete request.labels;
    delete request.non_labels;
    delete request.currentPage;
    delete request.perPage;
    if (filters?.status?.includes("0")) {
      request.pending = 1;
    }
    if (filters?.status?.includes("1")) {
      request.active = 1;
    }
    if (filters?.status?.includes("2")) {
      request.closed = 1;
    }
    delete request.status;
    if (filters?.direction?.includes("0")) {
      request.buy = 1;
    }
    if (filters?.direction?.includes("1")) {
      request.sell = 1;
    }
    delete request.direction;
    try {
      await dispatch(thunks.getDealing(request));
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const { selectedLabels, handleSelectedLabelsChange, handleSelectedLabelsGet, setSelectedLabels } = useDealingLabels(
    getDealInformation
  );

  useEffect(() => {
    const fetchLabels = async () => {
      if (dealingSelection.selectAll) {
        await handleSelectedLabelsGet([], dealingSelection.selectAll, dealingSelection?.perPage);
      } else {
        setSelectedLabels([]);
      }
    };
    
    fetchLabels();
  }, [dealingSelection.selectAll, dealingSelection.deselected, handleSelectedLabelsGet]);

  useEffect(() => {
    const fetchLabels = async () => {
      if (!dealingSelection.selectAll && dealingSelection.selected.length > 0) {
        await handleSelectedLabelsGet(dealingSelection.selected, dealingSelection.selectAll, dealingSelection?.perPage);
      }
    };
    
    fetchLabels();
  }, [dealingSelection.selected, handleSelectedLabelsGet]);

  const getLabels = async () => {
    try {
      const res = await riskApi.getPositionLabels();
      const labelList = res?.labels
        ?.map(({ label }) => ({
          label: label?.name,
          value: label?.id?.toString(),
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setLabelList(labelList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    const riskPositionsPerPage = localStorage.getItem("riskPositionsPerPage");

    if (riskPositionsPerPage) {
      updateFilters({ perPage: riskPositionsPerPage });
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const intervalId = setInterval(() => {
        getDealInformation();
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  const getDealing = async () => {
    setIsLoading(true);
    try {
      await getDealInformation();
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getDealing();
  }, [query, filters]);

  useEffect(() => {
    getLabels();
  }, []);

  return (
    <>
      <Seo title={`Dashboard: Positions`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 2, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Positions</Typography>
              </Stack>
            </Stack>
            <PayWallLayout>
              <Card>
                <DealingTable
                  isLoading={isLoading}
                  count={dealingState?.dealInfo?.total_count}
                  onPageChange={(index) =>
                    updateFilters({ currentPage: index })
                  }
                  page={filters?.currentPage}
                  onRowsPerPageChange={(event) => {
                    updateFilters({ perPage: event?.target?.value });
                    localStorage.setItem("riskPositionsPerPage", event?.target?.value);
                  }}
                  rowsPerPage={filters?.perPage}
                  tableData={dealingState?.dealInfo?.positions ?? []}
                  nonLabels={filters?.non_labels}
                  setNonLabels={(val) => updateFilters({ non_labels: val })}
                  status={filters?.status}
                  setStatus={(val) => updateFilters({ status: val })}
                  handleLabelsDialogOpen={() => setModalOpen(true)}
                  direction={filters?.direction}
                  setDirection={(val) => updateFilters({ direction: val })}
                  marketValue={filters?.marketValue}
                  setMarketValue={(val) => updateFilters({ marketValue: val })}
                  labels={filters?.labels}
                  setLabels={(val) => updateFilters({ labels: val })}
                  labelList={labelList}
                  tickerId={filters?.ticker_id}
                  setTickerId={(val) => updateFilters({ ticker_id: val })}
                  tickerList={tickers}
                  text={filters?.text}
                  setText={(val) => setText(val)}
                  selected={dealingSelection?.selected}
                  onSelectAll={dealingSelection.handleSelectAll}
                  onSelectOne={dealingSelection.handleSelectOne}
                  onSelectPage={dealingSelection.handleSelectPage}
                  onDeselectPage={dealingSelection.handleDeSelectPage}
                  onDeselectAll={dealingSelection.handleDeselectAll}
                  onDeselectOne={dealingSelection.handleDeselectOne}
                  selectAll={dealingSelection.selectAll}
                  handleSelectedLabelsChange={(labels) => {
                    const selected = dealingSelection.selectAll ? [] : dealingSelection.selected;
                    handleSelectedLabelsChange(labels, selected, dealingSelection?.selectAll, dealingSelection?.perPage);
                  }}
                  selectedLabels={selectedLabels}
                  getDealInformation={getDealInformation}
                  getDealing={getDealing}
                  perPage={dealingSelection.perPage}
                  setPerPage={dealingSelection.setPerPage}
                />
              </Card>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>

      <PositionLabelsDialog
        title="Edit Label"
        teams={teams}
        open={modalOpen ?? false}
        onClose={() => setModalOpen(false)}
        onGetLabels={getLabels}
      />
    </>
  );
};

export default Page;
