import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';
import { useAuth } from 'src/hooks/use-auth';

export const Seo = ({ title }) => {
  const { company } = useAuth();

  const fullTitle = useMemo(() => {
    const companyName = company?.name || 'CRM';
    return title ? `${title} | ${companyName}` : companyName;
  }, [title, company?.name]);

  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
};
