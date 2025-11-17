import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This is a wrapper over `react-router/useNavigate` hook.
 * We use this to help us maintain consistency between CRA and Next.js
 */
export const useRouter = () => {
  const navigate = useNavigate();

  return useMemo(() => {
    return {
      back: () => navigate(-1),
      doubleBack: () => navigate(-2),
      forward: () => navigate(1),
      refresh: () => navigate(0),
      push: (href) => {
        navigate(href);
        if (!href.includes("/auth")) {
          localStorage.setItem("last_page", href);
        }
      },
      replace: (href) => navigate(href, { replace: true }),
      prefetch: () => { }
    };
  }, [navigate]);
};
