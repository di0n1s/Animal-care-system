import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

export default function AnimalFilters({
  query,
  onlyNeedsCare,
  onQueryChange,
  onOnlyNeedsCareChange,
  onReset,
}) {
  return (
    <div className="catalog-filters">
      <FormField id="catalog-query" label="Пошук за іменем">
        <input
          id="catalog-query"
          type="search"
          name="query"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </FormField>
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={onlyNeedsCare}
          onChange={(event) => onOnlyNeedsCareChange(event.target.checked)}
        />
        Лише ті, що потребують допомоги
      </label>
      <AppButton variant="secondary" onClick={onReset}>
        Скинути фільтри
      </AppButton>
    </div>
  )
}
