import { SchedulePage } from '../../pages/schedule'
import { SignUpPage } from '../../pages/sign-up'
import { LoginPage } from '../../pages/login'
import { ForgotPasswordPage } from '../../pages/forgot-password'
import { ClubSettingsPage } from '../../widgets'
import { LostConsultationPage } from '../../pages/lost-consultation'

import { LeadsPage } from '../../pages/customers/customers'
import { LeadInfoPage } from '../../pages/customers/customer-info'

import { OverdueServicesPage } from '../../pages/overdue-services'
import { PatientsPage } from '../../pages/patients'
import { PatientDetailsPage } from '../../pages/patient-details'
import { PatientEditPage } from '../../pages/patient-edit'
import { DesktopPage } from '../../pages/desktop'
import { CreateClubPage } from '../../pages/create-clinic'
import SettingsPage from '../../pages/settings'
import { ChatPage } from '../../pages/chat'
import { FinancialManagementPage } from '../../pages/financial-management'

import {
  getForgotPasswordRoute,
  getHomeRoute,
  getLoginRoute,
  getBookingeRoute,
  getSettingsRoute,
  getSignUpRoute,
  getClubSettingsRoute,
  getLostConsultationRoute,
  getOverdueServicesRoute,
  getPatientsRoute,
  getPatientDetailsRoute,
  getPatientEditRoute,
  getCreateClubRoute,
  getChatRoute,
  getCustomersRoute,
  getCustomerInfoRoute,
  getFinancialManagementRoute,
  getConfirmationPage,
  getRecoveryPasswordRoute,
} from '../../shared/types/routes'
import { Route, Routes } from 'react-router'
import { CodeConfirmationPage } from '../../pages/code-confirmation'
import { useSelector } from 'react-redux'
import { isAuth, isUserAuthSelector } from './reducers/UserSlice'
import { useEffect } from 'react'
import { useAppDispatch } from './store-helpers'
import PrivatePageWrapper from '../../shared/components/privatePage/RequireAuth'
import { token } from '../../shared/utils/localStorage'
import { RecoveryPasswordPage } from '../../pages/recovery-password'

const unAuthorizedRoutes = [
  {
    element: <SignUpPage />,
    path: getSignUpRoute(),
  },
  {
    element: <CodeConfirmationPage />,
    path: getConfirmationPage(),
  },
  {
    element: <LoginPage />,
    path: getLoginRoute(),
  },
  {
    element: (
      <PrivatePageWrapper>
        <DesktopPage />
      </PrivatePageWrapper>
    ),
    path: getHomeRoute(),
  },
  {
    element: <ForgotPasswordPage />,
    path: getForgotPasswordRoute(),
  },
  {
    element: <RecoveryPasswordPage />,
    path: getRecoveryPasswordRoute(),
  },
  {
    element: (
      <PrivatePageWrapper>
        <LoginPage />
      </PrivatePageWrapper>
    ),
    path: '*',
  },
]

const authorizedRoutes = [
  {
    element: <DesktopPage />,
    path: getHomeRoute(),
  },
  {
    element: <SchedulePage />,
    path: getBookingeRoute(),
  },
  {
    element: <SettingsPage />,
    path: getSettingsRoute(),
  },
  {
    element: <ClubSettingsPage />,
    path: getClubSettingsRoute(),
  },
  {
    element: <LostConsultationPage />,
    path: getLostConsultationRoute(),
  },
  {
    element: <OverdueServicesPage />,
    path: getOverdueServicesRoute(),
  },
  {
    element: <PatientsPage />,
    path: getPatientsRoute(),
  },
  {
    element: <PatientDetailsPage />,
    path: getPatientDetailsRoute(':id'),
  },
  {
    element: <PatientEditPage />,
    path: getPatientEditRoute(':id'),
  },
  {
    element: <CreateClubPage />,
    path: getCreateClubRoute(),
  },
  {
    element: <ChatPage />,
    path: getChatRoute(),
  },
  {
    element: <FinancialManagementPage />,
    path: getFinancialManagementRoute(),
  },
  {
    element: <LeadsPage />,
    path: getCustomersRoute(),
  },
  {
    element: <LeadInfoPage />,
    path: getCustomerInfoRoute(':id'),
  },
]

export function RouteProvider() {
  const isAuthorization = useSelector(isUserAuthSelector)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (token) {
      dispatch(isAuth(true))
    }
  }, [dispatch, isAuthorization, token])

  // If not authorized and not already on login, redirect to login

  return (
    <Routes>
      {isAuthorization || token
        ? authorizedRoutes.map((route) => <Route key={route.path} element={route.element} path={route.path} />)
        : unAuthorizedRoutes.map((route) => <Route key={route.path} element={route.element} path={route.path} />)}
    </Routes>
  )
}
