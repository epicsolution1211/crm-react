import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/utils/request';


export const useGetMetabaseDashboards = (params, options) => {
  const URL = params ? ['/report/metabase/dashboard/dashboards', { params }] : '/report/metabase/dashboard/dashboards';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, { 
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options 
  });

  const memoizedValue = useMemo(
    () => ({
      dashboards: data?.reports?.dashboards || [],
      totalCount: data?.reports?.total_count || 0,
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.reports?.dashboards?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export const useGetMetabaseDashboardById = (id, options) => {
  const URL = id ? [`/report/metabase/dashboard/dashboards/${id}`] : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      dashboard: data?.report || [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.report?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}

export const useGetMetabaseTemplates = (params, options) => {
  const URL = params ? ['/report/metabase/dashboard/templates', { params }] : '/report/metabase/dashboard/templates';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      templates: data?.reports?.templates || [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.templates?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}
