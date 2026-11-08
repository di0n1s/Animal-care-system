import { mockCareRequestService } from './mockCareRequestService.js'
import { createApiCareRequestService } from './apiCareRequestService.js'
import { firebaseCareRequestService } from './firebaseCareRequestService.js'

const defaultSource = import.meta.env.MODE !== 'test' && import.meta.env.VITE_FIREBASE_PROJECT_ID
  ? 'firebase'
  : 'mock'
const source = import.meta.env.MODE === 'test'
  ? 'mock'
  : (import.meta.env.VITE_DATA_SOURCE ?? defaultSource)

function selectService() {
  if (source === 'mock') return mockCareRequestService
  if (source === 'firebase') return firebaseCareRequestService
  if (source === 'api') {
    return createApiCareRequestService(import.meta.env.VITE_API_BASE_URL)
  }
  throw new Error(`Unsupported data source: ${source}`)
}

export const careRequestService = selectService()
