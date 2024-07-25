import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Loader from '@components/Loader/Loader.tsx';

const App = lazy(() => import('./App'));
const NotFound = lazy(() => import('@components/NotFound/NotFound.tsx'));

const routeConfig = [
  { path: '/', component: <App />, key: 'home' },
  { path: '*', component: <NotFound />, key: 'notFound' },
];

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loader isLoading={true} error={null} />}>
      <Routes>
        {routeConfig.map((route) => (
          <Route path={route.path} element={route.component} key={route.key} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
