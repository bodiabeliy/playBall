const ROUTES = {
  SIGN_UP: '/sign-up',
  CODE_CONFIRMATION: '/code-confirmation',
  LOGIN: '/login',
  HOME: '/',
  BOOKING: '/booking',
  FORGOT_PASSWORD: '/forgot-password',
  RECOVERY_PASSWORD: '/recovery-password',
  SETTINGS: '/settings',
  CLINIC_SETTINGS: '/clinic-settings',
  PATIENTS: '/patients',
  PATIENT_DETAILS: '/patients/:id',
  PATIENT_EDIT: '/patients/:id/edit',
  LOST_CONSULTATION: '/lost-consultation',
  OVERDUE_SERVICES: '/overdue-services',
  CREATE_CLINIC: '/create-clinic',
  DESKTOP: '/desktop',
  CHAT: '/chat',
  FINANCIAL_MANAGEMENT: '/financial-management',

  LEADS: '/leads',
  LEAD_INFO: '/leads/:id',
}

export const getSignUpRoute = () => ROUTES.SIGN_UP
export const getConfirmationPage = () => ROUTES.CODE_CONFIRMATION
export const getLoginRoute = () => ROUTES.LOGIN
export const getHomeRoute = () => ROUTES.HOME
export const getBookingeRoute = () => ROUTES.BOOKING
export const getForgotPasswordRoute = () => ROUTES.FORGOT_PASSWORD
export const getRecoveryPasswordRoute = () => ROUTES.RECOVERY_PASSWORD
export const getSettingsRoute = () => ROUTES.SETTINGS
export const getClinicSettingsRoute = () => ROUTES.CLINIC_SETTINGS
export const getPatientsRoute = () => ROUTES.PATIENTS
export const getPatientDetailsRoute = (id: string) => ROUTES.PATIENT_DETAILS.replace(':id', id)
export const getPatientEditRoute = (id: string) => ROUTES.PATIENT_EDIT.replace(':id', id)
export const getLostConsultationRoute = () => ROUTES.LOST_CONSULTATION
export const getOverdueServicesRoute = () => ROUTES.OVERDUE_SERVICES
export const getCreateClinicRoute = () => ROUTES.CREATE_CLINIC
export const getDesktopRoute = () => ROUTES.DESKTOP
export const getChatRoute = () => ROUTES.CHAT
export const getFinancialManagementRoute = () => ROUTES.FINANCIAL_MANAGEMENT
export const getLeadsRoute = () => ROUTES.LEADS
export const getLeadInfoRoute = (id: string) => ROUTES.LEAD_INFO.replace(':id', id)
