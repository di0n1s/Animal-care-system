import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

export default function CareRequestFilters({
  query, supplies, sort,
  onQueryChange, onSuppliesChange, onSortChange, onReset,
}) {
  return (
    <div className="request-filters">
      <FormField id="requests-query" label="Пошук у заявках">
        <input
          id="requests-query"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </FormField>
      <FormField id="requests-supplies" label="Потреба в кормі чи ліках">
        <select
          id="requests-supplies"
          value={supplies}
          onChange={(event) => onSuppliesChange(event.target.value)}
        >
          <option value="all">Усі заявки</option>
          <option value="yes">Потрібні матеріали</option>
          <option value="no">Без матеріалів</option>
        </select>
      </FormField>
      <FormField id="requests-sort" label="Упорядкування">
        <select
          id="requests-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="animal">За іменем тварини</option>
          <option value="visits-asc">Спочатку менше візитів</option>
          <option value="visits-desc">Спочатку більше візитів</option>
        </select>
      </FormField>
      <AppButton variant="secondary" onClick={onReset}>Скинути умови</AppButton>
    </div>
  )
}
