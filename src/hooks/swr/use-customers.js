import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/utils/request';

export const useGetCustomers = (params, options) => {
  const URL = params ? ['/client/clients', { params }] : '/client/clients';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      customers: data?.clients || [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.clients?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}

export const useGetTransactions = (params, options) => {
  const URL = params ? ['/client/finance/transactions', { params }] : '/client/finance/transactions';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      transactions: data?.transactions || [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.transactions?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}


export const useGetCustomerAnalytics = (id, params, options) => {
  const URL = id ? [`/client/client_analytics/${id}`, { params }] : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      analytics: data?.analytics || {},
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.analytics,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}
