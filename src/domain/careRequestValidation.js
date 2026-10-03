export function validateCareRequest(input, items) {
  const errors = {}
  const schedule = typeof input.schedule === 'string'
    ? input.schedule.trim()
    : ''
  const visitsText = String(input.visitsPerWeek ?? '').trim()
  const visitsPerWeek = Number(visitsText)

  if (!items.some((item) => item.id === input.animalId)) {
    errors.animalId = 'Виберіть наявну тварину з реєстру.'
  }

  if (schedule.length === 0) {
    errors.schedule = 'Укажіть бажаний графік догляду.'
  } else if (schedule.length < 10 || schedule.length > 500) {
    errors.schedule = 'Графік має містити від 10 до 500 символів без крайніх пробілів.'
  }

  if (visitsText === '') {
    errors.visitsPerWeek = 'Укажіть кількість візитів на тиждень.'
  } else if (
    !Number.isInteger(visitsPerWeek)
    || visitsPerWeek < 1
    || visitsPerWeek > 7
  ) {
    errors.visitsPerWeek = 'Кількість візитів має бути цілим числом від 1 до 7.'
  }

  if (typeof input.needsSupplies !== 'boolean') {
    errors.needsSupplies = 'Ознака потреби в матеріалах має бути логічним значенням.'
  } else if (!errors.visitsPerWeek && visitsPerWeek > 4 && !input.needsSupplies) {
    errors.needsSupplies = 'Для понад 4 візитів на тиждень позначте потребу в кормі чи ліках.'
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    errors: {},
    value: {
      animalId: input.animalId,
      schedule,
      visitsPerWeek,
      needsSupplies: input.needsSupplies,
    },
  }
}
