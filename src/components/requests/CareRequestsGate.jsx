import useCareRequests from '../../hooks/useCareRequests.js'
import AppButton from '../ui/AppButton.jsx'

export default function CareRequestsGate({ children }) {
  const { status, error, reload } = useCareRequests()

  if (status === 'loading') {
    return (
      <section aria-busy="true" aria-label="Заявки">
        <p role="status">Завантаження заявок…</p>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section aria-label="Помилка завантаження">
        <p role="alert">{error}</p>
        <AppButton onClick={() => void reload()}>Спробувати ще раз</AppButton>
      </section>
    )
  }

  return children
}
