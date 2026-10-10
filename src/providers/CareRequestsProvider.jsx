import { useCallback, useEffect, useRef, useState } from 'react'
import { CareRequestsContext } from '../context/CareRequestsContext.js'
import { careRequestService } from '../services/careRequestService.js'
import { errorMessage } from '../services/ServiceError.js'

export default function CareRequestsProvider({ children }) {
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isMutating, setIsMutating] = useState(false)
  const activeRead = useRef(null)
  const readVersion = useRef(0)
  const mutationLock = useRef(false)
  const mounted = useRef(false)

  const read = useCallback(async () => {
    activeRead.current?.abort()
    const controller = new AbortController()
    activeRead.current = controller
    const version = ++readVersion.current

    try {
      const records = await careRequestService.getAll({ signal: controller.signal })
      if (controller.signal.aborted || version !== readVersion.current) return
      setRequests(records)
      setStatus('success')
    } catch (cause) {
      if (controller.signal.aborted || version !== readVersion.current) return
      setError(errorMessage(cause))
      setStatus('error')
    }
  }, [])

  const reload = useCallback(async () => {
    if (mutationLock.current) return
    setNotice('')
    setStatus('loading')
    setError('')
    await read()
  }, [read])

  useEffect(() => {
    mounted.current = true
    void read()
    return () => {
      mounted.current = false
      activeRead.current?.abort()
      readVersion.current += 1
    }
  }, [read])

  async function mutate(operation, apply, message) {
    if (mutationLock.current || status !== 'success') {
      return { ok: false, message: 'Дочекайтеся завершення поточної операції.' }
    }
    mutationLock.current = true
    setIsMutating(true)
    setNotice('')
    activeRead.current?.abort()
    readVersion.current += 1

    try {
      const record = await operation()
      if (mounted.current) {
        setRequests((previous) => apply(previous, record))
        setNotice(message)
      }
      return { ok: true, record }
    } catch (cause) {
      return {
        ok: false,
        message: errorMessage(cause),
        errors: cause.errors,
        code: cause.code,
      }
    } finally {
      mutationLock.current = false
      if (mounted.current) setIsMutating(false)
    }
  }

  function createRequest(input) {
    return mutate(
      () => careRequestService.create(input),
      (previous, record) => [
        ...previous.filter((entry) => entry.id !== record.id),
        record,
      ],
      'Заявку створено.',
    )
  }

  function updateRequest(id, input) {
    return mutate(
      () => careRequestService.update(id, input),
      (previous, record) => previous.map((entry) => (
        entry.id === id ? record : entry
      )),
      'Зміни заявки збережено.',
    )
  }

  function deleteRequest(id) {
    return mutate(
      () => careRequestService.delete(id),
      (previous) => previous.filter((entry) => entry.id !== id),
      'Заявку видалено.',
    )
  }

  return (
    <CareRequestsContext.Provider value={{
      requests, status, error, reload, isMutating,
      createRequest, updateRequest, deleteRequest,
      notice, dismissNotice: () => setNotice(''),
    }}>
      {children}
    </CareRequestsContext.Provider>
  )
}
