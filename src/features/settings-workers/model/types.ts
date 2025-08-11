export interface Worker {
  name: string
  email: string
  branch: string
  role: string
  apiId: string
  color: string
}

export interface WorkerFormData {
  firstName: string
  lastName: string
  middleName: string
  email: string
  phone: string
  role: string
  branch: string
  rate1: string
  rate2: string
  color: string
}

export interface Role {
  value: string
}

export interface Permission {
  label: string
  values: boolean[]
}

export interface WorkersTableState {
  page: number
  rowsPerPage: number
  searchQuery: string
  totalRows: number
}

export interface WorkersManagementState {
  activeTab: number
  editingWorker: Worker | null
  openInfo: boolean
  openRoleDialog: boolean
  roles: Role[]
}

export interface Brance {
  name: string
  usersCount: number
  address: string
  id: string
}
