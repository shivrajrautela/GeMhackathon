import React from 'react';
import { useRouter } from './lib/router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  const { page, navigate } = useRouter();

  return (
    <>
      {page === 'landing' && <LandingPage navigate={navigate} />}
      {page === 'login' && <LoginPage navigate={navigate} />}
      {page === 'dashboard' && <DashboardPage navigate={navigate} />}
    </>
  );
}
