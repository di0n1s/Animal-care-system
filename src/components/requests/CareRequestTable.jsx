import { Link } from 'react-router'
import AppButton from '../ui/AppButton.jsx'

export default function CareRequestTable({ requests, items, onDelete }) {
  return (
    <div className="table-scroll">
      <table className="requests-table">
        <caption>Заявки поточної локальної колекції</caption>
        <thead>
          <tr>
            <th scope="col">Тварина і графік</th>
            <th scope="col">Візитів на тиждень</th>
            <th scope="col">Корм чи ліки</th>
            <th scope="col">Дії</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const item = items.find((entry) => entry.id === request.animalId)
            const path = `/requests/${encodeURIComponent(request.id)}`
            return (
              <tr key={request.id}>
                <td>
                  <strong>{item?.name ?? 'Тварина відсутня'}</strong>
                  <p>{request.schedule}</p>
                </td>
                <td>{request.visitsPerWeek}</td>
                <td>{request.needsSupplies ? 'Так' : 'Ні'}</td>
                <td>
                  <p><Link to={path}>Переглянути</Link></p>
                  <p><Link to={`${path}/edit`}>Редагувати</Link></p>
                  <AppButton variant="secondary" onClick={() => onDelete(request)}>
                    Видалити
                  </AppButton>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
