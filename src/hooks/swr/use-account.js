import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/utils/request';
import { useAuth } from 'src/hooks/use-auth';

export const useGetAccountEmails = (params, options) => {
  const { user } = useAuth();
  
  const URL = params ? ['/account/email_configs', { params }] : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options,
  });

  const memoizedValue = useMemo(
    () => {
      return {
        emails: data?.email_configs || [],
        isLoading,
        error,
        isValidating,
        empty: !isLoading && !data?.email_configs?.length,
        mutate,
      };
    },
    [data, error, isLoading, isValidating, user, mutate]
  );

  return memoizedValue;
}
