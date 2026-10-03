import { useState } from 'react'
import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import CareRequestFilters from '../components/requests/CareRequestFilters.jsx'
import CareRequestTable from '../components/requests/CareRequestTable.jsx'
import useCareRequests from '../hooks/useCareRequests.js'
import useCareRequestFilters from '../hooks/useCareRequestFilters.js'
import useDeleteCareRequest from '../hooks/useDeleteCareRequest.js'

export default function RequestsPage({ items }) {
  const { requests } = useCareRequests()
  const filters = useCareRequestFilters(requests, items)
  const deleteWithConfirmation = useDeleteCareRequest(items)
  const [error, setError] = useState('')

  function handleDelete(request) {
    setError('')
    const result = deleteWithConfirmation(request)
    if (!result.ok && !result.cancelled) setError(result.message)
  }

  return (
    <>
      <PageHeading title="Заявки на догляд" />
      <p><Link to="/requests/new">Створити заявку</Link></p>
      <CareRequestFilters
        query={filters.query}
        supplies={filters.supplies}
        sort={filters.sort}
        onQueryChange={filters.setQuery}
        onSuppliesChange={filters.setSupplies}
        onSortChange={filters.setSort}
        onReset={filters.resetFilters}
      />
      <p>Показано: {filters.visibleRequests.length} із {requests.length}</p>
      {error && <p role="alert">{error}</p>}
      {requests.length === 0 ? (
        <EmptyState title="Заявок ще немає.">
          <p><Link to="/animals">Виберіть тварину для першої заявки</Link></p>
        </EmptyState>
      ) : filters.visibleRequests.length === 0 ? (
        <EmptyState title="За цими умовами нічого не знайдено.">
          <AppButton variant="secondary" onClick={filters.resetFilters}>
            Показати всі заявки
          </AppButton>
        </EmptyState>
      ) : (
        <CareRequestTable
          requests={filters.visibleRequests}
          items={items}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}
