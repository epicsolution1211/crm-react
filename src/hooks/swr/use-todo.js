import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/utils/request';
import { toast } from "react-hot-toast";

export const useGetTodoList = (params = {}, options = {}) => {
  const searchParams = new URLSearchParams();

  // Append each param to searchParams, handling both array and single values
  // For arrays, append each item with array notation (key[]=value)
  // For single values, append directly (key=value)
  // Skip null/undefined values
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => {
          searchParams.append(`${key}[]`, item);
        });
      } else {
        searchParams.append(key, value);
      }
    }
  });

  const URL = searchParams.toString() ? `/account/todos?${searchParams.toString()}` : '/account/todos';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options,
  });

  const memoizedValue = useMemo(
    () => ({
      todos: data?.data?.todos || data?.todos || [],
      totalCount: data?.total_count || 0,
      isLoading,
      error: error?.response?.data?.message ? toast.error(error?.response?.data?.message) : error,
      isValidating,
      mutate,
      empty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
};

export const useGetTodo = (id, params = {}, options = {}) => {
  const URL = id ? `/account/todos/${id}?${new URLSearchParams(params).toString()}` : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    refreshInterval: 60000,
    ...options,
  });

  const memoizedValue = useMemo(
    () => ({
      todo: data?.data?.todo || data?.todo || null,
      isLoading,
      error,
      isValidating,
      mutate,
      empty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
};

export const useGetTodoLabels = (params = {}, options = {}) => {
  const URL = `/account/todo_labels${params ? `?${new URLSearchParams(params).toString()}` : ''}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options,
  });

  const memoizedValue = useMemo(
    () => ({
      labels: data?.data?.labels || data?.labels || [],
      totalCount: data?.data?.total_count || data?.total_count || 0,
      isLoading,
      error,
      isValidating,
      mutate,
      empty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
};

export const useGetTodoComments = (params = {}, options = {}) => {
  const URL = params?.todo_id ? `/account/todo_comments?${new URLSearchParams(params).toString()}` : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options,
  });

  const memoizedValue = useMemo(
    () => ({
      comments: data?.data?.comments || data?.comments || [],
      totalCount: data?.data?.total_count || data?.total_count || 0,
      isLoading,
      error,
      isValidating,
      mutate,
      empty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
};

export const useGetTodoAnalytics = (params = {}, options = {}) => {
  const URL = params ? `/account/todos/stage_analytics?${new URLSearchParams(params).toString()}` : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: false,
    ...options,
  });

  const memoizedValue = useMemo(
    () => ({
      analytics: data?.data?.analytics || data?.analytics || [],
      isLoading,
      error,
      isValidating,
      mutate,
      empty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
};
