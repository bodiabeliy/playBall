import { MOCK_BRANCES } from '../model'

export interface BranchesApiResponse {
  brances: typeof MOCK_BRANCES
  total: number
}

export interface CreateBranchRequest {
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

export interface UpdateBranchRequest extends CreateBranchRequest {
  apiId: string
}

export class BranchesApi {
  static async getBranches(
    page: number = 0,
    rowsPerPage: number = 10,
    searchQuery: string = ''
  ): Promise<BranchesApiResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredBrances = MOCK_BRANCES

    if (searchQuery) {
      filteredBrances = MOCK_BRANCES.filter(
        (brance) =>
          brance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brance.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    const total = filteredBrances.length
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const brances = filteredBrances.slice(startIndex, endIndex)

    return { brances, total }
  }

  static async createBranch(data: CreateBranchRequest): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('Creating branch:', data)
  }

  static async updateBranch(data: UpdateBranchRequest): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('Updating branch:', data)
  }

  static async deleteBranch(apiId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    console.log('Deleting branch:', apiId)
  }
}
