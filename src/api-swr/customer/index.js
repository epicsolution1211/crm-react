import { useMemo } from "react";
import useSWR from 'swr';

import { fetcher } from 'src/utils/request';

export const useGetCustomerPhones = (q) => {
  const URL = q ? ['/company/client/phone_numbers', { params: { q } }] : '/company/client/phone_numbers';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher,
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => {
      let phoneList = [];
      
      if (data?.phone_numbers?.length > 0) {
        phoneList = data.phone_numbers.map((item) => ({ 
          label: item?.value, 
          value: item?.id 
        }));

        if (q) {
          const searchQuery = q.startsWith('+') ? q : `+${q}`;
          const alternateQuery = q.startsWith('+') ? q.slice(1) : q;
          
          const exactMatches = phoneList.filter(item => 
            item.label === searchQuery || item.label === alternateQuery
          );

          if (exactMatches.length > 0) {
            phoneList = exactMatches;
          }
        }

        phoneList = phoneList.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      }

      return {
        phoneList,
        isLoading,
        error,
        isValidating,
        empty: !isLoading && !data?.phone_numbers?.length,
      };
    },
    [error, isLoading, isValidating, data, q]
  );

  return memoizedValue;
}

export const useGetCustomerEmails = (q) => {
  const URL = q ? ['/company/client/emails', { params: { q } }] : '/company/client/emails';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher,
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      emailList: data?.emails?.length > 0 ? data?.emails?.map((item) => ({ label: item?.value, value: item?.id })) : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.emails?.length,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const useGetCustomerLabels = (params) => {
  const URL = params ? ['/client/labels/labels', { params }] : '/client/labels/labels';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      labelInfo: data?.labels?.length > 0 ? data?.labels : [],
      labelList: data?.labels?.length > 0 ? [{ label: "Empty", value: "_empty" }, ...data?.labels?.map((data) => 
        ({
          label: data?.label?.name,
          value: data?.label?.id?.toString(),
          check_status: data?.check_status,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        )] : [],
      totalCount: data?.total_count ?? 0,
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.labels?.length,
      mutate,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const useGetFormList = (params) => {
  const URL = params ? ['/company/brand_forms', { params }] : '/company/brand_forms';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      formList: data?.forms?.length > 0 ? [...data?.forms?.map((form) => 
        ({
          label: form?.name,
          value: form?.id,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        )] : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const useGetCustomerTeams = (query) => {
  const URL = query ? ['/ticket/teams/teams', { params: { query } }] : '/ticket/teams/teams';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      teamList: data?.teams?.length > 0 ? [{ label: "Empty", value: "_empty" }, ...data?.teams?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }))] : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.teams?.length,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const useGetCustomerAgents = (params) => {
  const URL = params ? ['/account/info', { params }] : '/account/info';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      agentList: data?.accounts?.length > 0 ? [{ label: "Empty", value: "_empty" }, ...data?.accounts
        ?.filter((account) => !account?.admin_hide)
        ?.map((account) => ({
          label: account?.first_name
            ? `${account?.first_name} ${account?.last_name}`
            : account?.email,
          value: account?.id?.toString(),
          avatar: account?.avatar,
        }))] : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.accounts?.length,
      mutate,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const useGetCustomerDesks = (params, user) => {
  const URL = params ? ['/client/desks', { params }] : '/client/desks';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      deskList: data?.desks?.length > 0 ? data?.desks
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
      ) : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.desks?.length,
      mutate,
    }),
    [error, isLoading, isValidating, user]
  );

  return memoizedValue;
}

export const useGetCustomerAffiliates = (params) => {
  const URL = params ? ['/lead_management/affiliates', { params }] : '/lead_management/affiliates';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      affiliateList: data?.affiliates?.length > 0 ? [{ label: "Empty", value: "_empty" }, ...data?.affiliates
        ?.map((affiliate) => ({
          label: affiliate?.full_name ?? "n/a",
          value: affiliate?.id?.toString(),
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        )] : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.affiliates?.length,
      mutate,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const useGetCustomerBrands = (params) => {
  const URL = params ? ['/company/internal_brands', { params }] : '/company/internal_brands';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher,
    { 
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      brandList: data?.internal_brands?.length > 0 ? [{ label: "Empty", value: "_empty" }, ...data?.internal_brands
        ?.map((brand) => ({
          label: brand?.company_name,
          value: brand?.id,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        )] : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.internal_brands?.length,
      mutate,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const useGetCustomerWallets = (params) => {
  const URL = params ? ['/company/wallet/wallets', { params }] : '/company/wallet/wallets';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
    revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      walletList: data?.wallets ?? [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.wallets?.length,
      mutate,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const useGetCustomerAccountTypes = (params) => {
  const URL = params ? ['/client/finance/account_types', { params }] : '/client/finance/account_types';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      accountTypeList: data?.account_types?.length > 0 ? [{ label: "Empty", value: "_empty" }, ...data?.account_types
        ?.map((accountType) => ({
          label: accountType?.name ?? "n/a",
          value: accountType?.id?.toString(),
        }))] : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.account_types?.length,
      mutate,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}