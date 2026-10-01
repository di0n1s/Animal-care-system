import { useNavigate, useParams } from 'react-router'
import CareRequestPage from './CareRequestPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function CareRequestEditPage({ requests, items }) {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const request = requests.find((entry) => entry.id === requestId)

  if (!request) {
    return (
      <NotFoundPage
        title="Заявку не знайдено"
        message="Перевірте ідентифікатор заявки в адресі."
      />
    )
  }

  const item = items.find((entry) => entry.id === request.animalId)

  if (!item) {
    return (
      <NotFoundPage
        title="Тварина заявки відсутня"
        message="Демонстраційний запис посилається на відсутню тварину."
      />
    )
  }

  return (
    <CareRequestPage
      key={`edit-${request.id}`}
      title={`Редагування заявки ${request.id}`}
      item={item}
      initialDraft={{
        schedule: request.schedule,
        needsSupplies: request.needsSupplies,
      }}
      onCancel={() => navigate('/requests')}
    />
  )
}
