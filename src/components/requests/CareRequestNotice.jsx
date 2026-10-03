import useCareRequests from '../../hooks/useCareRequests.js'
import AppButton from '../ui/AppButton.jsx'

export default function CareRequestNotice() {
  const { notice, dismissNotice } = useCareRequests()

  return (
    <div className="operation-notice">
      <p role="status">{notice}</p>
      {notice && (
        <AppButton variant="secondary" onClick={dismissNotice}>
          Закрити повідомлення
        </AppButton>
      )}
    </div>
  )
}
