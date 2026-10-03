import { useContext } from 'react'
import { CareRequestsContext } from '../context/CareRequestsContext.js'

export default function useCareRequests() {
  const context = useContext(CareRequestsContext)

  if (context === null) {
    throw new Error('useCareRequests must be used within CareRequestsProvider')
  }

  return context
}
