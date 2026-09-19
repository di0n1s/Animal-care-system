export default function CareStatusBadge({ needsCare }) {
  const label = needsCare ? 'Потребує допомоги' : 'Уже під опікою'
  const className = needsCare ? 'status needs-care' : 'status'
  return <span className={className}>{label}</span>
}
