import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/utils/request';

export const useGetAiQuestions = (params, options) => {
  const URL = params ? ['/account/ai_questions', { params }] : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      questions: data?.questions || [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.questions?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}
