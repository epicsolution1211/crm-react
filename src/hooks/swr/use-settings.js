import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/utils/request';

export const useGetReminders = (params = {}, options = {}) => {
  const URL = params ? ['/account/reminders/dashboard_data', { params }] : '/account/reminders/dashboard_data';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      refreshInterval: () => isValidating ? 0 : 5000,
      dedupingInterval: 5000,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      reminders: data?.reminders?.length > 0 ? data?.reminders : [],
      notifications: data?.notifications?.length > 0 ? data?.notifications : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}

export const useGetMembers = (params = {}, options = {}) => {
  const URL = params ? ['/account/info', { params }] : '/account/info';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      members: data?.accounts?.length > 0 ? data?.accounts : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.accounts?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}

export const useGetTeams = (params = {}, options = {}) => {
  const URL = params ? ['/ticket/teams/teams', { params }] : '/ticket/teams/teams';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      teams: data?.teams?.length > 0 ? data?.teams?.map(team => ({ ...team?.team })) : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.teams?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}

export const useGetDesks = (params = {}, options = {}) => {
  const URL = params ? ['/client/desks', { params }] : '/client/desks';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      desks: data?.desks?.length > 0 ? data?.desks : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.desks?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}
