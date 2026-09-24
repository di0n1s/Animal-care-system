import { useEffect, useState } from 'react'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import CareStatusBadge from '../components/animals/CareStatusBadge.jsx'
import CareRequestForm from '../components/requests/CareRequestForm.jsx'
import CareRequestSummary from '../components/requests/CareRequestSummary.jsx'

function createEmptyDraft() {
  return { schedule: '', needsSupplies: false }
}

export default function CareRequestPage({ item, onClearSelection }) {
  const [draft, setDraft] = useState(createEmptyDraft)
  const title = item ? `Лапки кампусу: ${item.name}` : 'Система контролю та опіки тварин'

  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    return () => {
      document.title = previousTitle
    }
  }, [title])

  function handleScheduleChange(schedule) {
    setDraft((previous) => ({ ...previous, schedule }))
  }

  function handleNeedsSuppliesChange(needsSupplies) {
    setDraft((previous) => ({ ...previous, needsSupplies }))
  }

  function handleReset() {
    setDraft(createEmptyDraft())
  }

  if (!item) {
    return (
      <Section id="request" title="Підготовка заявки на догляд">
        <EmptyState title="Тварину ще не вибрано.">
          <p><a href="#catalog">Виберіть тварину в реєстрі</a></p>
        </EmptyState>
      </Section>
    )
  }

  return (
    <Section id="request" title="Підготовка заявки на догляд">
      <p>
        Обрано «{item.name}»:{' '}
        <CareStatusBadge needsCare={item.needsCare} />
      </p>
      <CareRequestForm
        idPrefix="care-request-draft"
        animalName={item.name}
        draft={draft}
        onScheduleChange={handleScheduleChange}
        onNeedsSuppliesChange={handleNeedsSuppliesChange}
        onReset={handleReset}
      />
      <CareRequestSummary animalName={item.name} draft={draft} />
      <AppButton variant="secondary" onClick={onClearSelection}>
        Скасувати вибір і очистити чернетку
      </AppButton>
    </Section>
  )
}
