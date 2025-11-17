import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { Iconify } from 'src/components/iconify';
import { customersApi } from "src/api/customers";
import { settingsApi } from "src/api/settings";
import { RouterLink } from "src/components/router-link";
import { getAPIUrl } from "src/config";
import { useSettings } from "src/hooks/use-settings";
import { paths } from "src/paths";
import { thunks } from "src/thunks/customers";

const saveCustomerFilter = (filters) =>
  localStorage.setItem("autodial_filters", JSON.stringify(filters));

const saveCustomFilter = (filters) =>
  localStorage.setItem("autodial_custom_filters", JSON.stringify(filters));

const saveCustomerSorting = (sorting) =>
  localStorage.setItem("autodial_sorting", JSON.stringify(sorting));


const getCustomerFilter = () => localStorage.getItem("autodial_filters");

const getCustomFilters = () => localStorage.getItem("autodial_custom_filters");

const getCustomerSorting = () => localStorage.getItem("autodial_sorting");

const saveCustomer = (customer) =>
  localStorage.setItem("autodial_client", JSON.stringify(customer));

const getCustomer = () => localStorage.getItem("autodial_client");

export const Autodial = () => {
  const customerFilters = useSelector(
    (state) => state.customers.customerFilters
  );

  const customFilters = useSelector(
    (state) => state.customers.customFilter
  );

  const customerSorting = useSelector(
    (state) => state.customers.sorting
  );

  const dispatch = useDispatch();

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const settings = useSettings();

  const [autodialStarted, setAutodialStarted] = useState(null);

  const [autodialClient, setAutodialClient] = useState(
    JSON.parse(getCustomer()) ?? null
  );

  const [customers, setCustomers] = useState([]);

  const [page, setPage] = useState(1);

  const [index, setIndex] = useState(
    Number(localStorage.getItem("autodial_index")) ?? 0
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [profiles, setProfiles] = useState([]);

  const startAutodial = () => {
    setAutodialStarted(true);
    dispatch(thunks.setAutodialStarted(true));
    localStorage.setItem("autodial_started", "true");
  };

  const stopAutodial = () => {
    setAutodialStarted(false);
    dispatch(thunks.setAutodialStarted(false));
    setPage(1);
    localStorage.setItem("autodial_started", "false");
  };

  const handleNextCustomer = () => {
    if (index >= customers.length) {
      getCustomers(page + 1);
      setPage((p) => p + 1);
      return;
    }

    const client = customers[index + 1];

    if (!client) {
      stopAutodial();
      return null;
    }

    dispatch(thunks.setAutodialClientId(client?.id));
    setAutodialClient(client);
    saveCustomer(client);

    setIndex((ind) => ind + 1);
    localStorage.setItem("autodial_index", index + 1);
  };

  const getCustomers = async (currentPage = 1) => {
    setIsLoading(true);
    const localStorageFilters = JSON.parse(getCustomerFilter());
    const localStorageCustom = JSON.parse(getCustomFilters());
    const localStorageSorting = getCustomerSorting() !== 'undefined' ? JSON.parse(getCustomerSorting()) : {};

    const filters = customerFilters || localStorageFilters;
    const custom = customFilters || localStorageCustom;
    const sorting = customerSorting || localStorageSorting;

    if (currentPage === 1) {
      setCustomers([]);
      setIndex(0);
    }

    const params = {
      page: currentPage,
      per_page: 200,
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
    if (filters?.first_caller_name && filters?.first_caller_name?.length > 0) {
      params.first_call_by = filters?.first_caller_name;
    }
    if (
      filters?.second_caller_name &&
      filters?.second_caller_name?.length > 0
    ) {
      params.second_call_by = filters?.second_caller_name;
    }
    if (filters?.third_caller_name && filters?.third_caller_name?.length > 0) {
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
    if (params?.online?.length > 1) {
      delete params?.online;
    }
    
    if (sorting) {
      params.sorting = sorting;
    }

    const customFiltersData = custom
        ?.filter((filter) => filter?.filter && (filter?.filter?.query?.length || filter?.filter?.non_query?.length))
        ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

    const { clients } = await customersApi.getCustomers(params);

    if (clients?.length > 0) {
      const newClients = clients.filter((c) => 
        c?.phone_numbers?.length > 0
      );
      setCustomers(prevCustomers => [...prevCustomers, ...newClients]);
    } else {
      stopAutodial();
    }

    setIsLoading(false);

    if (currentPage > 1 && customers.length > 0 && index < customers.length) {
      setIsLoading(false);
      return;
    }
  };

  const makeClientAutodial = async () => {
    try {
      if (index >= customers.length) {
        await getCustomers(page + 1);
        setPage((p) => p + 1);
        return;
      }

      const client = customers[index];

      if (!client) {
        stopAutodial();
        return null;
      }

      dispatch(thunks.setAutodialClientId(client?.id));
      setAutodialClient(client);
      saveCustomer(client);

      handleCustomerCall(client?.phone_number_ids, client?.id);

      // setIndex((ind) => ind + 1);
      localStorage.setItem("autodial_index", index + 1);
    } catch (error) {
      console.error("error", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleStartAutodial = async () => {
    saveCustomerFilter(customerFilters);
    saveCustomFilter(customFilters);
    saveCustomerSorting(customerSorting);
    startAutodial();

    if (customers?.length > 0) {
      makeClientAutodial();
    }
  };

  const getProfiles = useCallback(async () => {
    try {
      const accountId = localStorage.getItem("account_id");
      if (accountId) {
        const response = await settingsApi.getCallProfiles();
        setProfiles(response?.provider_profiles);
        return response?.provider_profiles;
      } else {
        setProfiles([]);
        return [];
      }
    } catch (error) {
      console.error('Poor Internet Connection Detected:', error);
      toast.error('Poor Internet Connection Detected');
    }
  }, []);

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  useEffect(() => {
    const handleStorageChange = () => {
      const autodial = localStorage.getItem("autodial_started") === "true";
      setAutodialStarted(autodial);
      dispatch(thunks.setAutodialStarted(autodial));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      localStorage.setItem("autodial_started", "false");
      dispatch(thunks.setAutodialStarted(false));
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  useEffect(() => {
    let interval;
    if (autodialStarted && window?.location?.pathname === "/dashboard/customers") {
      if (customers?.length === 0 && !isLoading) {
        getCustomers(page + 1);
        setPage((p) => p + 1);
      } else {
        interval = setInterval(() => {
          makeClientAutodial();
        }, 45000);
      }
    } else {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autodialStarted, customers, page, index, isLoading]);

  useEffect(() => {
    if (window?.location?.pathname === "/dashboard/customers") {
      getCustomers();
    }
  }, []);

  useEffect(() => {
    if (autodialStarted === false && window?.location?.pathname === "/dashboard/customers") {
      // Always save current Redux state to localStorage
      saveCustomerFilter(customerFilters);
      saveCustomFilter(customFilters);
      saveCustomerSorting(customerSorting);
      
      // Get customers with updated filters
      getCustomers();
      setIndex(0);
      localStorage.setItem("autodial_index", 0);
    }
  }, [autodialStarted, customerFilters, customFilters, customerSorting]);

  const handleStopAutodial = () => {
    stopAutodial();

    const localFilters = localStorage.getItem("autodial_filters");
    const localCustomFilters = localStorage.getItem("autodial_custom_filters");
    const localCustomerSorting = localStorage.getItem("autodial_sorting");
    const customerFiltersString = JSON.stringify(customerFilters);
    const customFiltersString = JSON.stringify(customFilters);
    const customerSortingString = JSON.stringify(customerSorting);

    getCustomers();

    if (
      (localFilters &&
      localFilters?.length !== customerFiltersString?.length) ||
      (localCustomFilters &&
      localCustomFilters?.length !== customFiltersString?.length) ||
      (localCustomerSorting &&
      localCustomerSorting?.length !== customerSortingString?.length)
    ) {
      saveCustomerFilter(customerFilters);
      saveCustomFilter(customFilters);
      saveCustomerSorting(customerSorting);
      getCustomers();
      setIndex(0);
      localStorage.setItem("autodial_index", 0);
    }
  };

  const handleCustomerCall = useCallback(
    async (numbers) => {
      setIsProviderLoading(true);
      try {
        const currProfiles = await getProfiles();
        const defaultProfile = currProfiles?.find((p) => p.is_default)
          ? currProfiles?.find((p) => p.default)
          : null;

        if (!defaultProfile) {
          toast.error("There are no default call profile!");
          handleStopAutodial();
          return;
        }

        handleMakeProviderCall(defaultProfile, numbers);
      } finally {
        setIsProviderLoading(false);
      }
    },
    [getProfiles]
  );

  const handleMakeProviderCall = useCallback(async (profile, numbers) => {
    try {
      const NAME_TO_ID = {
        twilio: 1,
        coperato: 2,
        voiso: 3,
        "cypbx": 4,
        squaretalk: 5,
        commpeak: 6,
        mmdsmart: 7,
        "prime_voip": 8,
        voicespin: 9,
        didglobal: 10,
      };

      await settingsApi.callRequest({
        call_system: NAME_TO_ID[profile?.provider_type],
        provider_profile_id: profile?.id,
        phone_number: numbers?.[0],
      });
      toast.success(`${profile?.name} call has started!`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  const autodialClientName = useMemo(() => {
    const name = autodialClient?.first_name
      ? autodialClient?.first_name + (autodialClient?.last_name ? " " + autodialClient?.last_name : "")
      : autodialClient?.email;

    if (name?.length > 9) {
      return name?.substring(0, 9) + "..";
    } else {
      return name;
    }
  }, [autodialClient]);

  const backgroundPresets = {
    indigo: "#6366F1",
    blue: "#2970FF",
    purple: "#9E77ED",
    green: "#16B364",
  }

  if (!autodialStarted && window?.location?.pathname !== "/dashboard/customers") {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        minWidth: autodialClient && mdUp ? "240px" : "auto",
        boxShadow: settings?.paletteMode === "light" ? "" : "inset #21304a 0px 0px 60px -12px",
        px: { md: 2, xs: 1.5 },
        py: 1,
        borderRadius: "8px",
        backgroundColor: settings?.paletteMode === "light" ? backgroundPresets[settings?.colorPreset] : "",
      }}
    >
      {autodialClient && mdUp && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ flex: 1, minWidth: 0 }}
        >
          <Tooltip
            title={
              autodialClient?.first_name
                ? autodialClient?.first_name + " " + autodialClient?.last_name
                : autodialClient?.email
            }
          >
            <Avatar
              src={autodialClient?.avatar ?
                autodialClient?.avatar?.includes("http")
                  ? autodialClient?.avatar
                  : `${getAPIUrl()}/${autodialClient?.avatar}`
                : ""}
              sx={{ width: 32, height: 32 }}
            />
          </Tooltip>
          {autodialClient ? (
            <Link
              component={RouterLink}
              href={paths.dashboard.customers.details.replace(
                ":customerId",
                autodialClient?.id
              )}
              sx={{
                fontSize: "0.875rem",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                color: "#ffffff",
                cursor: "pointer",
                flex: "1 1 auto",
                minWidth: 0,
              }}
            >
              {autodialClientName}
            </Link>
          ) : null}
        </Stack>
      )}

      {isLoading ? (
        <Skeleton height="35px" width="35px" />
      ) : (
        <Stack direction="row" spacing={1} flexShrink={0}>
          <Tooltip title={`${autodialStarted ? "Stop autodial" : "Start autodial"}`}>
            <IconButton 
              onClick={autodialStarted ? handleStopAutodial : handleStartAutodial}
              disabled={isProviderLoading}
              sx={{ 
                backgroundColor: settings?.paletteMode === "light" ? 'rgba(255, 255, 255, 0.1)' : 'background.neutral',
                '&:hover': {
                  backgroundColor: settings?.paletteMode === "light" ? 'rgba(255, 255, 255, 0.2)' : 'background.neutral',
                }
              }}
            >
              <Iconify 
                icon={autodialStarted ? "ph:phone-x-bold" : "heroicons-outline:phone"} 
                color={autodialStarted ? "error.main" : (settings?.paletteMode === "light" ? "#fff" : "success.main")} 
                width={22}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next customer">
            <IconButton 
              onClick={handleNextCustomer}
              sx={{ 
                backgroundColor: settings?.paletteMode === "light" ? 'rgba(255, 255, 255, 0.1)' : 'background.neutral',
                '&:hover': {
                  backgroundColor: settings?.paletteMode === "light" ? 'rgba(255, 255, 255, 0.2)' : 'background.neutral',
                }
              }}
            >
              <Iconify icon="heroicons-outline:arrow-right" color={settings?.paletteMode === "light" ? "#fff" : "success.main"} width={22}/>
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
};
