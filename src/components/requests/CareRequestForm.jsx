import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

export default function CareRequestForm({
  idPrefix,
  animalName,
  draft,
  onScheduleChange,
  onNeedsSuppliesChange,
  onReset,
}) {
  const nameId = `${idPrefix}-name`
  const scheduleId = `${idPrefix}-schedule`
  const noticeId = `${idPrefix}-notice`

  return (
    <form
      aria-label="Чернетка заявки на догляд"
      aria-describedby={noticeId}
      onSubmit={(event) => event.preventDefault()}
    >
      <p id={noticeId}>
        Зміни не зберігаються. Чернетка скидається при виході зі сторінки,
        зміні тварини чи запису або перезавантаженні. Надсилання ще
        недоступне.
      </p>

      <FormField id={nameId} label="Тварина">
        <input
          id={nameId}
          name="animalName"
          value={animalName}
          readOnly
        />
      </FormField>

      <FormField
        id={scheduleId}
        label="Бажаний графік догляду"
        hint="Опишіть, коли й як часто ви можете піклуватися про тварину."
      >
        <textarea
          id={scheduleId}
          name="schedule"
          rows={3}
          value={draft.schedule}
          onChange={(event) => onScheduleChange(event.target.value)}
          aria-describedby={`${scheduleId}-hint`}
        />
      </FormField>

      <label className="checkbox-field">
        <input
          name="needsSupplies"
          type="checkbox"
          checked={draft.needsSupplies}
          onChange={(event) => onNeedsSuppliesChange(event.target.checked)}
        />
        Потрібна допомога з кормом чи ліками
      </label>

      <div className="form-actions">
        <AppButton variant="secondary" onClick={onReset}>
          Очистити поля
        </AppButton>
        <AppButton disabled>Надсилання буде доступне пізніше</AppButton>
      </div>
    </form>
  )
}
