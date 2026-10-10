import { useEffect, useRef, useState } from 'react'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import CareStatusBadge from '../components/animals/CareStatusBadge.jsx'
import CareRequestForm from '../components/requests/CareRequestForm.jsx'
import CareRequestSummary from '../components/requests/CareRequestSummary.jsx'
import { validateCareRequest } from '../domain/careRequestValidation.js'

const emptyDraft = { schedule: '', visitsPerWeek: '1', needsSupplies: false }
const fieldOrder = ['schedule', 'visitsPerWeek', 'needsSupplies']

export default function CareRequestPage({
  title,
  item,
  initialDraft = emptyDraft,
  onSave,
  onCancel,
  submitLabel,
  cancelLabel = 'Вийти без збереження',
}) {
  const initialValues = {
    schedule: initialDraft.schedule,
    visitsPerWeek: String(initialDraft.visitsPerWeek),
    needsSupplies: initialDraft.needsSupplies,
  }
  const [draft, setDraft] = useState(() => ({ ...initialValues }))
  const [touched, setTouched] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [operationError, setOperationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitting = useRef(false)
  const alive = useRef(false)
  const validation = validateCareRequest({ ...draft, animalId: item.id }, [item])
  const errors = Object.fromEntries(
    Object.entries(validation.errors).filter(([field]) => (
      attempted || touched[field]
    )),
  )
  const isDirty = draft.schedule !== initialValues.schedule
    || draft.visitsPerWeek !== initialValues.visitsPerWeek
    || draft.needsSupplies !== initialValues.needsSupplies

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  function handleChange(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }))
    setOperationError('')
  }

  function handleBlur(field) {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting.current) return
    setAttempted(true)
    setOperationError('')
    if (!validation.ok) {
      const firstField = fieldOrder.find((field) => validation.errors[field])
      if (firstField) event.currentTarget.elements.namedItem(firstField)?.focus()
      return
    }

    submitting.current = true
    setIsSubmitting(true)
    try {
      const result = await onSave(validation.value)
      if (!result.ok && alive.current) {
        setOperationError(
          result.errors
            ? Object.values(result.errors).join(' ')
            : result.message || 'Не вдалося зберегти заявку.',
        )
      }
    } catch {
      if (alive.current) setOperationError('Не вдалося завершити збереження.')
    } finally {
      submitting.current = false
      if (alive.current) setIsSubmitting(false)
    }
  }

  function handleReset() {
    if (submitting.current) return
    if (!isDirty) return
    if (!window.confirm('Відкинути введені зміни та відновити початкові поля?')) {
      return
    }
    setDraft({ ...initialValues })
    setTouched({})
    setAttempted(false)
    setOperationError('')
  }

  function handleCancel() {
    if (submitting.current) return
    if (isDirty && !window.confirm('Вийти та відкинути незбережені зміни?')) return
    onCancel()
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
          errors={errors}
          operationError={operationError}
          onChange={handleChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          onReset={handleReset}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
        />
        <CareRequestSummary animalName={item.name} draft={draft} />
      </Section>
      <AppButton variant="secondary" disabled={isSubmitting} onClick={handleCancel}>
        {cancelLabel}
      </AppButton>
    </>
  )
}
