import { useState } from 'react'
import { CareRequestsContext } from '../context/CareRequestsContext.js'
import { careRequests as initialRequests } from '../data/careRequests.js'
import { validateCareRequest } from '../domain/careRequestValidation.js'

export default function CareRequestsProvider({ items, children }) {
  const [requests, setRequests] = useState(() => (
    initialRequests.map((request) => ({ ...request }))
  ))
  const [notice, setNotice] = useState('')

  function createRequest(input) {
    const validation = validateCareRequest(input, items)
    if (!validation.ok) return validation

    const record = {
      id: `req-${crypto.randomUUID()}`,
      ...validation.value,
    }
    setRequests((previous) => [...previous, record])
    setNotice('Заявку створено в поточній локальній колекції.')
    return { ok: true, record }
  }

  function updateRequest(id, input) {
    const current = requests.find((request) => request.id === id)
    if (!current) return { ok: false, message: 'Заявку для оновлення не знайдено.' }

    const validation = validateCareRequest(input, items)
    if (!validation.ok) return validation

    const record = { ...validation.value, id: current.id }
    setRequests((previous) => previous.map((request) => (
      request.id === id ? record : request
    )))
    setNotice('Зміни заявки збережено в поточній локальній колекції.')
    return { ok: true, record }
  }

  function deleteRequest(id) {
    if (!requests.some((request) => request.id === id)) {
      return { ok: false, message: 'Заявку для видалення не знайдено.' }
    }
    setRequests((previous) => previous.filter((request) => request.id !== id))
    setNotice('Заявку видалено з поточної локальної колекції.')
    return { ok: true }
  }

  function dismissNotice() {
    setNotice('')
  }

  return (
    <CareRequestsContext.Provider value={{
      requests, createRequest, updateRequest, deleteRequest,
      notice, dismissNotice,
    }}>
      {children}
    </CareRequestsContext.Provider>
  )
}
