import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/utils/request';
import { useAuth } from 'src/hooks/use-auth';

export const useGetCompanyEmails = (params, options) => {
  const { user } = useAuth();
  
  const URL = params ? ['/company/emails', { params }] : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...options,
  });

  const memoizedValue = useMemo(
    () => {
      const filteredEmails = data?.emails?.length 
        ? data.emails.filter(email => {
            const emailAccess = user?.acc?.[`acc_v_company_email_${email?.id}`];
            return emailAccess === undefined || emailAccess;
          })
        : [];

      return {
        emails: filteredEmails,
        isLoading,
        error,
        isValidating,
        empty: !isLoading && !data?.emails?.length,
        mutate,
      };
    },
    [data, error, isLoading, isValidating, user, mutate]
  );

  return memoizedValue;
}
