import { animals } from '../data/animals.js'
import { validateCareRequest } from '../domain/careRequestValidation.js'
import { ServiceError } from './ServiceError.js'

export function toCareRequestInput(input) {
  const result = validateCareRequest(input, animals)
  if (!result.ok) {
    throw new ServiceError('Перевірте поля заявки.', {
      code: 'VALIDATION',
      errors: result.errors,
    })
  }
  return result.value
}

export function toCareRequest(value) {
  const valid = value !== null
    && typeof value === 'object'
    && typeof value.id === 'string'
    && value.id.length > 0
    && typeof value.animalId === 'string'
    && typeof value.schedule === 'string'
    && Number.isInteger(value.visitsPerWeek)
    && typeof value.needsSupplies === 'boolean'

  if (!valid) {
    throw new ServiceError('Джерело повернуло некоректний запис заявки.', {
      code: 'BAD_DATA',
    })
  }

  return {
    id: value.id,
    animalId: value.animalId,
    schedule: value.schedule,
    visitsPerWeek: value.visitsPerWeek,
    needsSupplies: value.needsSupplies,
  }
}

export function toCareRequestList(value) {
  if (!Array.isArray(value)) {
    throw new ServiceError('Джерело повернуло некоректний список.', {
      code: 'BAD_DATA',
    })
  }
  const records = value.map(toCareRequest)
  if (new Set(records.map((record) => record.id)).size !== records.length) {
    throw new ServiceError('Джерело повернуло повторні ідентифікатори.', {
      code: 'BAD_DATA',
    })
  }
  return records
}
