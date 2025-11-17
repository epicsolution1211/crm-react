import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

import { GuestGuard } from 'src/guards/guest-guard';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';


const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/jwt/register'));
const Companies = lazy(() => import('src/pages/auth/jwt/companies'));
const EmailVerification = lazy(() => import('src/pages/auth/jwt/email-verification'));
const ForgotPassword = lazy(() => import('src/pages/auth/jwt/forgot-password'));
const PasswordRecovery = lazy(() => import('src/pages/auth/jwt/password-recovery'));

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <GuestGuard>
        <AuthLayout>
          <Outlet />
        </AuthLayout>
      </GuestGuard>
    ),
    children: [
      {
        path: 'login',
        element: <JwtLoginPage />
      },
      {
        path: 'register',
        element: <JwtRegisterPage />
      },
      {
        path: 'companies',
        element: <Companies />
      },
      {
        path: 'email-verification',
        element: <EmailVerification />
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />
      },
      {
        path: 'password-recovery',
        element: <PasswordRecovery />
      }
    ]
  }
];
