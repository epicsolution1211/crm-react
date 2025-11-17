import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CustomerListTable } from "src/sections/dashboard/ib/ibs/index";
import { LabelsDialog } from "src/components/labels-dialog";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";
import { customersApi } from "src/api/customers";
import { paths } from "src/paths";
import { slice } from "src/slices/customers";
import { thunks } from "src/thunks/customers";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { useSelection } from "src/hooks/use-selection";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Iconify } from "src/components/iconify";
import { userApi } from "src/api/user";

const Page = () => {
  usePageView();
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [isSelectAllLoading, setIsSelectAllLoading] = useState(false);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const customersState = useSelector((state) => state.customers);

  useEffect(() => {
    if (user?.acc?.acc_v_ib_list === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  const [modalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState("");

  const clientIds = useSelector((state) => state.customers.ibsIds);
  const customersSelection = useSelection(clientIds ?? [], (message) => {
    toast.error(message);
  });
  const filters = useSelector((state) => state.customers.iBsFilters);
  const updateFilters = (data) => dispatch(thunks.setIBsFilters(data));
  const reduxCustom = useSelector((state) => state.customers.customIBsFilter);

  const [columnSorting, setColumnSorting] = useState(null);
  const [pinnedFields, setPinnedFields] = useState([]);

  const [customFilters, setCustomFilters] = useState(reduxCustom);
  const [customFilterLoading, setCustomFilterLoading] = useState(true);

  const [onlineCount, setOnlineCount] = useState(undefined);
  const query = useDebounce(text, 300);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const deselectedRef = useRef([]);

  const linkSearchParam = new URLSearchParams();

  const sendCustomFilterData = useMemo(() => {
    if (customFilters) {
      const resultArray = [];
      customFilters?.forEach((item) => {
        if (item?.filter) {
          resultArray.push({
            custom_id: item?.custom_id,
            filter: item?.filter,
          })
        }
      });
      return resultArray;
    }
    return [];
  }, [customFilters]);

  linkSearchParam.set("filter", JSON.stringify(filters));
  linkSearchParam.set("customFilters", JSON.stringify(sendCustomFilterData));

  const selectAllCustomers = () => {
    customersSelection.handleSelectAll();
  }

  const handleSortReset = async () => {
    const accountId = localStorage.getItem("account_id");
    setColumnSorting({});
    const updateSetting = {
      ...columnSettings,
      iBsSorting: {},
    };
    await userApi.updateUser(accountId, {
      column_setting: JSON.stringify(updateSetting),
    });
    await refreshUser();
  }

  const getCustomerData = async (isOnline, selectAll = false) => {
    try {
      dispatch(
        slice.actions.setIBsCurrentPage(
          filters?.currentPage ? filters?.currentPage + 1 : 1
        )
      );
      const params = {
        is_ib_approved : true,
        page: filters?.currentPage ? filters?.currentPage + 1 : 1,
        per_page: filters?.perPage ? filters?.perPage : 10,
        q: query?.length > 0 ? query : null,
        client_ids: filters?.ids ? [filters?.ids] : undefined,
        non_client_ids: filters?.non_ids ? [filters?.non_ids] : undefined,
        ...filters,
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

      if (
        filters?.first_assigned_agent_name &&
        filters?.first_assigned_agent_name?.length > 0
      ) {
        params.first_assigned_agent_id = filters?.first_assigned_agent_name;
      }
      if (
        filters?.second_assigned_agent_name &&
        filters?.second_assigned_agent_name?.length > 0
      ) {
        params.second_assigned_agent_id = filters?.second_assigned_agent_name;
      }
      if (
        filters?.third_assigned_agent_name &&
        filters?.third_assigned_agent_name?.length > 0
      ) {
        params.third_assigned_agent_id = filters?.third_assigned_agent_name;
      }
      if (
        filters?.first_caller_name &&
        filters?.first_caller_name?.length > 0
      ) {
        params.first_call_by = filters?.first_caller_name;
      }
      if (
        filters?.second_caller_name &&
        filters?.second_caller_name?.length > 0
      ) {
        params.second_call_by = filters?.second_caller_name;
      }
      if (
        filters?.third_caller_name &&
        filters?.third_caller_name?.length > 0
      ) {
        params.third_call_by = filters?.third_caller_name;
      }
      if (filters?.frd_owner_name && filters?.frd_owner_name?.length > 0) {
        params.frd_owner_id = filters?.frd_owner_name;
      }

      if (params?.online?.length > 1) {
        delete params?.online;
      }
      if (params?.online?.length === 1 && filters?.online[0] === "true") {
        params.online = "true";
      }
      if (params?.online?.length === 1 && filters?.online[0] === "false") {
        params.online = "false";
      }

      if (params?.is_active_ib?.length > 1) {
        delete params?.online;
      }
      if (params?.is_active_ib?.length === 1 && filters?.is_active_ib[0] === "true") {
        params.is_active_ib = "true";
      }
      if (params?.is_active_ib?.length === 1 && filters?.is_active_ib[0] === "false") {
        params.is_active_ib = "false";
      }

      if (columnSorting) {
        params.sorting = columnSorting;
      }
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

      const cached = searchParams.get("cached") || false;
      if (cached) {
        router.push(paths.dashboard.customers.index);
      }
      if (selectAll) {
        setIsSelectAllLoading(true);
        params.select_all = true;
        delete params.page;
        delete params.per_page;
        
        const nonClientIds = deselectedRef.current;
        if (nonClientIds.length > 0) {
          params.non_client_ids = nonClientIds;
        }
        
        const response = await customersApi.getCustomers(params);
        const ids = response.clients.map((client) => parseInt(client._id))
        customersSelection.handleSetSelectItems(ids);
        setIsSelectAllLoading(false);
        await dispatch(slice.actions.setCustomerIds(ids));

      }
      else if (isOnline) {
        params.online = "true";
        params.per_page = 1;
        delete params?.page;
        const customers = await customersApi.getCustomers(params);
        setOnlineCount(customers?.total_count);
      } else {
        setIsLoading(true);
        await dispatch(thunks.getIBs(params)).unwrap();
        setIsLoading(false);
      }
    } catch (error) {
      if (error?.response?.status === 500) {
        handleSortReset();
      }
      
      setIsLoading(false);
      setIsSelectAllLoading(false);
      console.error("error: ", error);
    }
  };

  const handleSelectedLabelsGetForSelectAll = useCallback(
    async () => {
      const requestData = {
        select_all: true
      };
      
      const nonClientIds = deselectedRef.current;
      if (nonClientIds.length > 0) {
        requestData.non_client_ids = nonClientIds;
      }
      
      try {
        const { labels } = await customersApi.getCustomersLabels(requestData);
        setSelectedLabels(
          labels
            ?.filter((label) => label.check_status)
            ?.map((label) => label?.label?.id + "")
        );
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    },
    []
  );

  const handleSelectedLabelsGetForIndividual = useCallback(
    async (id) => {
      const requestData = {
        client_ids: id ? [id] : customersSelection.selected
      };
      
      try {
        const { labels } = await customersApi.getCustomersLabels(requestData);
        setSelectedLabels(
          labels
            ?.filter((label) => label.check_status)
            ?.map((label) => label?.label?.id + "")
        );
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    },
    [customersSelection.selected]
  );

  const handleSelectedLabelsGet = useCallback(
    async (id) => {
      if (customersSelection.selectAll) {
        await handleSelectedLabelsGetForSelectAll();
      } else {
        await handleSelectedLabelsGetForIndividual(id);
      }
    },
    [customersSelection.selectAll, handleSelectedLabelsGetForSelectAll, handleSelectedLabelsGetForIndividual]
  );

  const handleSelectedLabelsChange = useCallback(
    async (
      labels,
      filters = {},
      selected = [],
      selectAll = false,
      id = null
    ) => {
      setSelectedLabels(labels);

      const addedLabels = labels.filter((l) => !selectedLabels.includes(l));
      const removedLabels = selectedLabels.filter((l) => !labels.includes(l));

      const requestData = {
        ...filters,
        q: query?.length > 0 ? query : null,
      };

      if (selectAll) {
        requestData["select_all"] = true;
        
        if (customersSelection.perPage && customersSelection.perPage > 0) {
          requestData.per_page = customersSelection.perPage;
        }
        
        const nonClientIds = deselectedRef.current;
        if (nonClientIds.length > 0) {
          requestData.non_client_ids = nonClientIds;
        }
      } else {
        requestData["client_ids"] = id ? [id] : selected;
      }

      if (addedLabels?.length) {
        requestData["add_label_ids"] = addedLabels;
      }

      if (removedLabels?.length) {
        requestData["remove_label_ids"] = removedLabels;
      }

      try {
        await customersApi.assignCustomerLabel(requestData);
        setTimeout(() => {
          getCustomerData();
        }, 2000);
        toast("Customer labels successfully updated!");
      } catch (error) {
        console.error("Error updating labels:", error);
        toast.error("Failed to update customer labels");
      }
    },
    [selectedLabels, getCustomerData]
  );

  const columnSettings = useMemo(() => {
    if (customersState?.iBs?.column_setting) {
      return JSON.parse(customersState?.iBs?.column_setting);
    }
  }, [customersState?.iBs?.column_setting]);

  useEffect(() => {
    if (user?.column_setting) {
      setColumnSorting(JSON.parse(user?.column_setting)?.iBsSorting);
      setPinnedFields(JSON.parse(user?.column_setting)?.pinnedFields);
    }
  }, [user]);

  useEffect(()=> {
    updateFilters({ currentPage: 0 });
  }, [query]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getCustomerData(true);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [
    filters,
    query,
    customFilters,
    customFilterLoading,
    columnSorting,
  ]);

  useEffect(() => {
    if (!customFilterLoading) {
      getCustomerData();
    }
  }, [
    filters,
    query,
    customFilters,
    customFilterLoading,
    columnSorting,
  ]);

  useEffect(() => {
    dispatch(slice.actions.setIBsCustomFilter(customFilters));
  }, [customFilters]);

  useEffect(() => {
    dispatch(slice.actions.setIBsSorting(columnSorting));
  }, [columnSorting])

  useEffect(() => {
    localStorage.setItem("customer", JSON.stringify(customersState));
  }, [customersState]);

  useEffect(() => {
    deselectedRef.current = customersSelection.deselected;
  }, [customersSelection.deselected]);

  useEffect(() => {
    const fetchLabels = async () => {
      if (customersSelection.selectAll) {
        await handleSelectedLabelsGetForSelectAll();
      } else {
        setSelectedLabels([]);
      }
    };
    
    fetchLabels();
  }, [customersSelection.selectAll, customersSelection.deselected, handleSelectedLabelsGetForSelectAll]);

  useEffect(() => {
    const fetchLabels = async () => {
      if (!customersSelection.selectAll && customersSelection.selected.length > 0) {
        await handleSelectedLabelsGetForIndividual();
      }
    };
    
    fetchLabels();
  }, [customersSelection.selected, handleSelectedLabelsGetForIndividual]);

  const [isBulkDeleteLoading, setIsBulkDeleteLoading] = useState(false);

  const handleDeleteCustomers = async () => {
    setIsBulkDeleteLoading(true);
    try {
      const params = {
        page: filters?.currentPage ? filters?.currentPage + 1 : 1,
        per_page: filters?.perPage ? filters?.perPage : 10,
        q: query?.length > 0 ? query : null,
        ...filters,
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

      if (
        filters?.first_assigned_agent_name &&
        filters?.first_assigned_agent_name?.length > 0
      ) {
        params.first_assigned_agent_id = filters?.first_assigned_agent_name;
      }
      if (
        filters?.second_assigned_agent_name &&
        filters?.second_assigned_agent_name?.length > 0
      ) {
        params.second_assigned_agent_id = filters?.second_assigned_agent_name;
      }
      if (
        filters?.third_assigned_agent_name &&
        filters?.third_assigned_agent_name?.length > 0
      ) {
        params.third_assigned_agent_id = filters?.third_assigned_agent_name;
      }
      if (
        filters?.first_caller_name &&
        filters?.first_caller_name?.length > 0
      ) {
        params.first_call_by = filters?.first_caller_name;
      }
      if (
        filters?.second_caller_name &&
        filters?.second_caller_name?.length > 0
      ) {
        params.second_call_by = filters?.second_caller_name;
      }
      if (
        filters?.third_caller_name &&
        filters?.third_caller_name?.length > 0
      ) {
        params.third_call_by = filters?.third_caller_name;
      }
      if (filters?.frd_owner_name && filters?.frd_owner_name?.length > 0) {
        params.frd_owner_id = filters?.frd_owner_name;
      }
      if (filters?.online?.length === 1 && filters?.online[0] === "true") {
        params.online = "true";
      }
      if (filters?.online?.length === 1 && filters?.online[0] === "false") {
        params.online = "false";
      }
      if (customersSelection.selectAll) {
        params["select_all"] = true;
        
        if (customersSelection.perPage && customersSelection.perPage > 0) {
          params.per_page = customersSelection.perPage;
        }
        
        const nonClientIds = deselectedRef.current;
        if (nonClientIds.length > 0) {
          params.non_client_ids = nonClientIds;
        }
      } else {
        params["client_ids"] = customersSelection.selected;
      }
      if (columnSorting) {
        params.sorting = columnSorting;
      }
      const customFiltersData = customFilters
        ?.filter(
          (filter) =>
            filter?.filter &&
            (filter?.filter?.query?.length || filter?.filter?.non_query?.length)
        )
        ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

      await customersApi.deleteCustomers(params);
      setTimeout(async () => {
        await getCustomerData();
      }, 2000);
      toast.success("Selected customers successfully removed!");
    } catch (error) {
      console.error("error: ", error);
    }
    setIsBulkDeleteLoading(false);
  };

  const handleSortByOnline = async () => {
    const accountId = localStorage.getItem("account_id");
    if (columnSettings) {
      const updateSetting = columnSorting?.["Online"] === undefined ? {
        ...columnSettings,
        iBsSorting: {
          Online: false,
        },
      } : {
        ...columnSettings,
        iBsSorting: {}
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTimeout(() => {
        refreshUser();
      }, 1500);
      if (columnSorting?.["Online"] === false) setColumnSorting({});
      else setColumnSorting({
        Online: false,
      });
    } else {
      const updatedTableSettings = columnSorting?.["Online"] === undefined ? {
        ...columnSettings,
        iBsSorting: {
          Online: false,
        },
      } : {
        ...columnSettings,
        iBsSorting: {}
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updatedTableSettings),
      });
      setTimeout(() => {
        refreshUser();
      }, 1500);
      if (columnSorting?.["Online"] === false) setColumnSorting({});
      else setColumnSorting({
        Online: false,
      });
    }
  }

  return (
    <>
      <Seo title={`Dashboard : IB List`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2, overflow: "hidden" }}
      >
        <Container 
          maxWidth="xxl"
          sx={{ px: { xs: 2, sm: 3 } }}
        >
          <Stack spacing={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
              spacing={2}
              sx={{ flexWrap: "wrap" }}
            >
              <Stack spacing={1} direction="row" alignItems="flex-end" sx={{ flexWrap: "wrap" }}>
                <Typography variant="h4">IB List</Typography>
                {onlineCount === undefined && isLoading ? (
                  <Skeleton sx={{ width: 60, height: 30 }} />
                ) : onlineCount === undefined ? (
                  <Skeleton sx={{ width: 60, height: 30 }} />
                ) : (
                  <Stack
                    direction="row"
                    gap={0.5}
                    alignItems="center"
                    pt={1}
                    pl={1}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor:
                          onlineCount === 0 ? "error.main" : "success.main",
                        borderRadius: 50,
                      }}
                    ></Box>
                    <Typography whiteSpace='nowrap'>{`${onlineCount ?? 0} online`}</Typography>
                    <Tooltip title="Sort by online">
                      <IconButton onClick={handleSortByOnline}>
                        <Iconify icon="line-md:arrows-vertical" width={20} sx={{ color: columnSorting?.["Online"] === false ? 'primary.main' : '' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                )}
              </Stack>
            </Stack>
            <PayWallLayout>
              <Card sx={{ overflow: "hidden" }}>
                <CustomerListTable
                  count={customersState?.iBs?.total_count}
                  handleLabelsDialogOpen={() => setModalOpen(true)}
                  handleSelectedLabelsChange={handleSelectedLabelsChange}
                  handleSelectedLabelsGet={handleSelectedLabelsGet}
                  isLoading={isLoading}
                  onDeselectAll={customersSelection.handleDeselectAll}
                  onDeselectOne={customersSelection.handleDeselectOne}
                  onDeselectPage={customersSelection.handleDeSelectPage}
                  onGetData={getCustomerData}
                  onSelectAll={selectAllCustomers}
                  onSelectOne={customersSelection.handleSelectOne}
                  onSelectPage={customersSelection.handleSelectPage}
                  onSetCustomFilters={setCustomFilters}
                  customFilters={customFilters}
                  query={query}
                  selectAll={customersSelection.selectAll}
                  selected={customersSelection.selected}
                  selectedLabels={selectedLabels}
                  setCustomFilterLoading={setCustomFilterLoading}
                  setText={setText}
                  tableData={customersState?.iBs?.clients}
                  columnSetting={customersState?.iBs?.column_setting}
                  text={text}
                  onSortingSet={setColumnSorting}
                  onPinnedFieldsSet={setPinnedFields}
                  sortingState={columnSorting}
                  pinnedFields={pinnedFields}
                  onDeleteCustomers={handleDeleteCustomers}
                  isBulkDeleteLoading={isBulkDeleteLoading}
                  isSelectAllLoading={isSelectAllLoading}
                  deselected={deselectedRef.current}
                  perPage={customersSelection.perPage}
                  setPerPage={customersSelection.setPerPage}
                />
              </Card>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>

      {modalOpen &&
        <LabelsDialog
          title="Edit Label"
          open={modalOpen ?? false}
          onClose={() => setModalOpen(false)}
        />
      }
    </>
  );
};

export default Page;
