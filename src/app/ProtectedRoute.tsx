import { Navigate, Outlet } from 'react-router-dom';

import { isTokenValid } from '../features/auth/lib/token';

export function ProtectedRoute() {
  return isTokenValid() ? <Outlet /> : <Navigate to="/login" replace />;
}
