import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function RequestsPage({ requests, items }) {
  return (
    <>
      <PageHeading title="Заявки на догляд" />
      <p>Нижче наведено локальні демонстраційні записи.</p>
      {requests.length === 0 ? (
        <EmptyState title="Заявок ще немає.">
          <p><Link to="new">Підготувати нову заявку</Link></p>
        </EmptyState>
      ) : (
        <div className="table-scroll">
          <table className="requests-table">
            <caption>Заявки для перевірки навігації</caption>
            <thead>
              <tr>
                <th scope="col">Тварина</th>
                <th scope="col">Графік догляду</th>
                <th scope="col">Дія</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const item = items.find((entry) => (
                  entry.id === request.animalId
                ))

                return (
                  <tr key={request.id}>
                    <td>{item?.name ?? 'Тварина відсутня в реєстрі'}</td>
                    <td>{request.schedule}</td>
                    <td>
                      <Link to={`${encodeURIComponent(request.id)}/edit`}>
                        Редагувати {request.id}
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
