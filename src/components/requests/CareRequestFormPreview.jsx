import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

export default function CareRequestFormPreview({ idPrefix, animalName }) {
  const nameId = `${idPrefix}-name`
  const scheduleId = `${idPrefix}-schedule`
  const noticeId = `${idPrefix}-notice`

  return (
    <form
      aria-label="Макет заявки на догляд"
      aria-describedby={noticeId}
      onSubmit={(event) => event.preventDefault()}
    >
      <p id={noticeId}>
        Це макет для перевірки структури полів. Дані не зберігаються.
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
          defaultValue=""
          aria-describedby={`${scheduleId}-hint`}
        />
      </FormField>

      <div className="form-actions">
        <AppButton type="reset" variant="secondary">
          Очистити текст
        </AppButton>
        <AppButton disabled>Надсилання буде доступне пізніше</AppButton>
      </div>
    </form>
  )
}
