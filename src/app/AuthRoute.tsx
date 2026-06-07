import { Navigate, Outlet } from 'react-router-dom';

import { isTokenValid } from '../features/auth/lib/token';

export function AuthRoute() {
  return isTokenValid() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
