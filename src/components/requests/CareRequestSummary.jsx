export default function CareRequestSummary({ animalName, draft }) {
  const schedule = draft.schedule.trim()

  return (
    <aside aria-labelledby="care-request-summary-title">
      <h3 id="care-request-summary-title">Поточна чернетка</h3>
      <dl>
        <dt>Тварина</dt>
        <dd>{animalName}</dd>
        <dt>Графік догляду</dt>
        <dd>{schedule || 'Ще не вказано'}</dd>
        <dt>Додаткові матеріали</dt>
        <dd>{draft.needsSupplies ? 'Потрібні' : 'Не потрібні'}</dd>
      </dl>
      <p>Цей підсумок не підтверджує опіку.</p>
    </aside>
  )
}
