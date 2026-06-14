import { DashboardPage } from '@/pages/DashboardPage';
import { GoalDetailsPage } from '@/pages/GoalDetailsPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to='/login' replace /> },
  {
    element: <AuthRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/goals/:id', element: <GoalDetailsPage /> },
    ],
  },
]);
