import { useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import useAnimalSelection from '../hooks/useAnimalSelection.js'
import useCareRequests from '../hooks/useCareRequests.js'
import CareRequestPage from './CareRequestPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function CareRequestCreatePage({ items }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { selectedId, clearSelection } = useAnimalSelection()
  const { createRequest } = useCareRequests()
  const animalId = searchParams.get('animalId')
  const pageAlive = useRef(false)

  useEffect(() => {
    pageAlive.current = true
    return () => { pageAlive.current = false }
  }, [])

  if (animalId === null) {
    const lastSelectionSearch = selectedId
      ? `?${new URLSearchParams({ animalId: selectedId })}`
      : null

    return (
      <>
        <PageHeading title="Нова заявка" />
        <EmptyState title="Спочатку виберіть тварину.">
          <p><Link to="/animals">Відкрити реєстр тварин</Link></p>
          {lastSelectionSearch && (
            <p>
              <Link to={lastSelectionSearch}>Використати останній вибір</Link>
            </p>
          )}
        </EmptyState>
      </>
    )
  }

  const item = items.find((entry) => entry.id === animalId)

  if (!item) {
    return (
      <NotFoundPage
        title="Неможливо підготувати заявку"
        message="Тварина з параметра animalId відсутня в реєстрі."
      />
    )
  }

  async function handleSave(input) {
    const result = await createRequest(input)
    if (result.ok && pageAlive.current) {
      navigate(`/requests/${encodeURIComponent(result.record.id)}`, {
        replace: true,
      })
    }
    return result
  }

  function handleCancel() {
    clearSelection()
    navigate('/animals', { replace: true })
  }

  return (
    <CareRequestPage
      key={`new-${item.id}`}
      title="Нова заявка"
      item={item}
      onSave={handleSave}
      submitLabel="Створити заявку"
      onCancel={handleCancel}
      cancelLabel="Скасувати чернетку й очистити вибір"
    />
  )
}
