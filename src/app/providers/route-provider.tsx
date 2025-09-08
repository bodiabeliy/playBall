import { SchedulePage } from '../../pages/schedule'
import { SignUpPage } from '../../pages/sign-up'
import { LoginPage } from '../../pages/login'
import { ForgotPasswordPage } from '../../pages/forgot-password'
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
  getCourtsRoute,
  getPricingRoute,
} from '../../shared/types/routes'
import { Route, Routes } from 'react-router'
import { CodeConfirmationPage } from '../../pages/code-confirmation'
import { useSelector } from 'react-redux'
import PrivatePageWrapper from '../../shared/components/privatePage/RequireAuth'
import { RecoveryPasswordPage } from '../../pages/recovery-password'
import { isAuth, isUserAuthSelector } from './reducers/UserSlice'
import CourtsPage from '../../pages/courts'
import { useEffect } from 'react'
import { useAppDispatch } from './store-helpers'
import { areTokensValid, clearTokens } from '../../shared/utils/tokenUtils'
import PricingPage from '../../pages/pricing'

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
    element: <DesktopPage />,
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
        <DesktopPage />
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
    element: <CourtsPage />,
    path: getCourtsRoute(),
  },
    {
    element: <PricingPage />,
    path: getPricingRoute(),
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

  console.log('isAuthorization', isAuthorization)

  useEffect(() => {
    const { isValid, hasRefreshToken } = areTokensValid()
    
    if (isValid && hasRefreshToken) {
      dispatch(isAuth(true))
    } else {
      // Clear invalid tokens and logout
      clearTokens()
      dispatch(isAuth(false))
    }
  }, [dispatch])

  // Handle logout when tokens are cleared from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === 'token' || e.key === 'refresh') && !e.newValue) {
        // Token was removed, check if we still have valid tokens
        const { isValid } = areTokensValid()
        if (!isValid) {
          dispatch(isAuth(false))
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [dispatch])

  return (
    <Routes>
      {isAuthorization
        ? authorizedRoutes.map((route) => <Route key={route.path} element={route.element} path={route.path} />)
        : unAuthorizedRoutes.map((route) => <Route key={route.path} element={route.element} path={route.path} />)}
    </Routes>
  )
}
