import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/utils/request';


export const useGetAgentDailyReport = (params, options) => {
  const URL = params ? ['/account/activity_heatmap/daily_report', { params }] : '/account/activity_heatmap/daily_report';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, { 
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options 
  });

  const memoizedValue = useMemo(
    () => ({
      dailyReport: data || [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.reports?.daily_report?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export const useGetAgentDailyReportById = (id, params, options) => {
  const URL = id ? params ? [`/account/activity_heatmap/${id}/daily_report`, { params }] : [`/account/activity_heatmap/${id}/daily_report`] : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, { 
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options 
  });

  const memoizedValue = useMemo(
    () => ({
      dailyReport: data || [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.reports?.daily_report?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
