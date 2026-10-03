import useCareRequests from './useCareRequests.js'

export default function useDeleteCareRequest(items) {
  const { deleteRequest } = useCareRequests()

  return function deleteWithConfirmation(request) {
    const item = items.find((entry) => entry.id === request.animalId)
    const name = item?.name ?? request.animalId
    const confirmed = window.confirm(
      `Видалити заявку ${request.id} на догляд за «${name}»? `
      + 'Запис буде вилучено з поточної колекції. Скасування видалення не передбачено.',
    )
    if (!confirmed) return { ok: false, cancelled: true }
    return deleteRequest(request.id)
  }
}
