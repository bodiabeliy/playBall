import { MOCK_WORKERS } from '../model'

export interface WorkersApiResponse {
  workers: typeof MOCK_WORKERS
  total: number
}

export interface CreateWorkerRequest {
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

export interface UpdateWorkerRequest extends CreateWorkerRequest {
  apiId: string
}

export class WorkersApi {
  static async getWorkers(
    page: number = 0,
    rowsPerPage: number = 10,
    searchQuery: string = ''
  ): Promise<WorkersApiResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredWorkers = MOCK_WORKERS

    if (searchQuery) {
      filteredWorkers = MOCK_WORKERS.filter(
        (worker) =>
          worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    const total = filteredWorkers.length
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const workers = filteredWorkers.slice(startIndex, endIndex)

    return { workers, total }
  }

  static async createWorker(data: CreateWorkerRequest): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('Creating worker:', data)
  }

  static async updateWorker(data: UpdateWorkerRequest): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('Updating worker:', data)
  }

  static async deleteWorker(apiId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    console.log('Deleting worker:', apiId)
  }
}
