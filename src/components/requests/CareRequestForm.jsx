import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

export default function CareRequestForm({
  idPrefix,
  animalName,
  draft,
  errors,
  operationError,
  onChange,
  onBlur,
  onSubmit,
  onReset,
  submitLabel,
}) {
  const scheduleId = `${idPrefix}-schedule`
  const visitsId = `${idPrefix}-visits`
  const suppliesId = `${idPrefix}-supplies`
  const hasErrors = Object.keys(errors).length > 0

  function describedBy(id, error) {
    return `${id}-hint${error ? ` ${id}-error` : ''}`
  }

  // Клік по кнопці не забирає фокус у поля: інакше onBlur показує помилку,
  // розмітка зсувається, і перший клік по кнопці губиться.
  function keepFieldFocus(event) {
    if (event.target.closest('button')) event.preventDefault()
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Форма заявки на догляд">
      <p>Тварина: {animalName}</p>
      <p>
        Збережіть зміни кнопкою нижче. Незбережене введення зникає
        при виході зі сторінки або її перезавантаженні.
      </p>
      {hasErrors && <p role="alert">Виправте позначені поля.</p>}
      {errors.animalId && <p role="alert">{errors.animalId}</p>}
      {operationError && <p role="alert">{operationError}</p>}

      <FormField
        id={scheduleId}
        label="Бажаний графік догляду (обов'язково)"
        hint="Від 10 до 500 символів без крайніх пробілів."
        error={errors.schedule}
      >
        <textarea
          id={scheduleId}
          name="schedule"
          rows={3}
          required
          value={draft.schedule}
          onChange={(event) => onChange('schedule', event.target.value)}
          onBlur={() => onBlur('schedule')}
          aria-invalid={Boolean(errors.schedule)}
          aria-describedby={describedBy(scheduleId, errors.schedule)}
        />
      </FormField>

      <FormField
        id={visitsId}
        label="Візитів на тиждень (обов'язково)"
        hint="Ціле число від 1 до 7."
        error={errors.visitsPerWeek}
      >
        <input
          id={visitsId}
          name="visitsPerWeek"
          type="number"
          min={1}
          max={7}
          step={1}
          required
          value={draft.visitsPerWeek}
          onChange={(event) => onChange('visitsPerWeek', event.target.value)}
          onBlur={() => onBlur('visitsPerWeek')}
          aria-invalid={Boolean(errors.visitsPerWeek)}
          aria-describedby={describedBy(visitsId, errors.visitsPerWeek)}
        />
      </FormField>

      <div>
        <label className="checkbox-field" htmlFor={suppliesId}>
          <input
            id={suppliesId}
            name="needsSupplies"
            type="checkbox"
            checked={draft.needsSupplies}
            onChange={(event) => onChange('needsSupplies', event.target.checked)}
            onBlur={() => onBlur('needsSupplies')}
            aria-invalid={Boolean(errors.needsSupplies)}
            aria-describedby={describedBy(suppliesId, errors.needsSupplies)}
          />
          Потрібна допомога з кормом чи ліками
        </label>
        <p id={`${suppliesId}-hint`} className="field-hint">
          Для понад 4 візитів на тиждень позначка обов'язкова.
        </p>
        {errors.needsSupplies && (
          <p id={`${suppliesId}-error`} className="field-error">
            {errors.needsSupplies}
          </p>
        )}
      </div>

      <div className="form-actions" onMouseDown={keepFieldFocus}>
        <AppButton type="submit">{submitLabel}</AppButton>
        <AppButton variant="secondary" onClick={onReset}>
          Відновити початкові поля
        </AppButton>
      </div>
    </form>
  )
}
