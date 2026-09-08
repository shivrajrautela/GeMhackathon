import React from 'react';

type Page = 'landing' | 'login' | 'dashboard';

interface RouterProps {
  children: (navigate: (page: Page) => void, currentPage: Page) => React.ReactNode;
}

export type { Page };

export function useRouter() {
  const [page, setPage] = React.useState<Page>(() => {
    const hash = window.location.hash.replace('#', '') as Page;
    return ['landing', 'login', 'dashboard'].includes(hash) ? hash : 'landing';
  });

  const navigate = (newPage: Page) => {
    window.location.hash = newPage;
    setPage(newPage);
  };

  React.useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      if (['landing', 'login', 'dashboard'].includes(hash)) {
        setPage(hash);
      }
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return { page, navigate };
}
