import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import NotFound from '@components/NotFound/NotFound.tsx';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
