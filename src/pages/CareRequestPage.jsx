import { useState } from 'react'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import CareStatusBadge from '../components/animals/CareStatusBadge.jsx'
import CareRequestForm from '../components/requests/CareRequestForm.jsx'
import CareRequestSummary from '../components/requests/CareRequestSummary.jsx'

const emptyDraft = { schedule: '', needsSupplies: false }

export default function CareRequestPage({
  title,
  item,
  initialDraft = emptyDraft,
  onCancel,
  cancelLabel = 'Вийти без збереження',
}) {
  const [draft, setDraft] = useState(() => ({ ...initialDraft }))

  function handleScheduleChange(schedule) {
    setDraft((previous) => ({ ...previous, schedule }))
  }

  function handleNeedsSuppliesChange(needsSupplies) {
    setDraft((previous) => ({ ...previous, needsSupplies }))
  }

  function handleReset() {
    setDraft({ ...emptyDraft })
  }

  return (
    <>
      <PageHeading title={title} />
      <Section id="request-editor" title="Поля та підсумок">
        <p>
          Тварина «{item.name}»:{' '}
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
      </Section>
      <AppButton variant="secondary" onClick={onCancel}>
        {cancelLabel}
      </AppButton>
    </>
  )
}
