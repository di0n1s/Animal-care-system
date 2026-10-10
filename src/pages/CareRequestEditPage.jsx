import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import useCareRequests from '../hooks/useCareRequests.js'
import CareRequestPage from './CareRequestPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function CareRequestEditPage({ items }) {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { requests, updateRequest } = useCareRequests()
  const pageAlive = useRef(false)
  const activeId = useRef(requestId)

  useEffect(() => {
    pageAlive.current = true
    return () => { pageAlive.current = false }
  }, [])

  useEffect(() => {
    activeId.current = requestId
    return () => { activeId.current = null }
  }, [requestId])

  const request = requests.find((entry) => entry.id === requestId)

  if (!request) return <NotFoundPage title="Заявку для редагування не знайдено" />

  const item = items.find((entry) => entry.id === request.animalId)
  if (!item) return <NotFoundPage title="Тварина заявки відсутня" />

  async function handleSave(input) {
    const result = await updateRequest(request.id, input)
    if (result.ok && pageAlive.current && activeId.current === request.id) {
      navigate(`/requests/${encodeURIComponent(result.record.id)}`, {
        replace: true,
      })
    }
    return result
  }

  return (
    <CareRequestPage
      key={`edit-${request.id}`}
      title={`Редагування заявки ${request.id}`}
      item={item}
      initialDraft={{
        schedule: request.schedule,
        visitsPerWeek: request.visitsPerWeek,
        needsSupplies: request.needsSupplies,
      }}
      onSave={handleSave}
      submitLabel="Зберегти зміни"
      onCancel={() => navigate(`/requests/${encodeURIComponent(request.id)}`)}
    />
  )
}
