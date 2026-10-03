import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import useCareRequests from '../hooks/useCareRequests.js'
import useDeleteCareRequest from '../hooks/useDeleteCareRequest.js'
import NotFoundPage from './NotFoundPage.jsx'

export default function CareRequestDetailsPage({ items }) {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { requests } = useCareRequests()
  const deleteWithConfirmation = useDeleteCareRequest(items)
  const [error, setError] = useState('')
  const request = requests.find((entry) => entry.id === requestId)

  if (!request) return <NotFoundPage title="Заявку не знайдено" />
  const item = items.find((entry) => entry.id === request.animalId)

  function handleDelete() {
    setError('')
    const result = deleteWithConfirmation(request)
    if (result.ok) navigate('/requests', { replace: true })
    else if (!result.cancelled) setError(result.message)
  }

  return (
    <>
      <PageHeading title={`Заявка ${request.id}`} />
      {error && <p role="alert">{error}</p>}
      <dl>
        <dt>Тварина</dt>
        <dd>{item?.name ?? 'Тварина відсутня в реєстрі'}</dd>
        <dt>Графік догляду</dt>
        <dd>{request.schedule}</dd>
        <dt>Візитів на тиждень</dt>
        <dd>{request.visitsPerWeek}</dd>
        <dt>Корм чи ліки</dt>
        <dd>{request.needsSupplies ? 'Потрібні' : 'Не потрібні'}</dd>
      </dl>
      <p>Збережена заявка не є підтвердженням опіки над твариною.</p>
      <p>
        <Link to={`/requests/${encodeURIComponent(request.id)}/edit`}>
          Редагувати заявку
        </Link>
      </p>
      <AppButton variant="secondary" onClick={handleDelete}>
        Видалити заявку
      </AppButton>
      <p><Link to="/requests">До всіх заявок</Link></p>
    </>
  )
}
