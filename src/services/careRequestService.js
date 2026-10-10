import { mockCareRequestService } from './mockCareRequestService.js'
import { createApiCareRequestService } from './apiCareRequestService.js'

const source = import.meta.env.VITE_DATA_SOURCE ?? 'mock'

function selectService() {
  if (source === 'mock') return mockCareRequestService
  if (source === 'api') {
    return createApiCareRequestService(import.meta.env.VITE_API_BASE_URL)
  }
  throw new Error(`Unsupported data source: ${source}`)
}

export const careRequestService = selectService()
