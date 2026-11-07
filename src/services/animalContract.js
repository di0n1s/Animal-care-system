import { ServiceError } from './ServiceError.js'

export function toAnimal(value) {
  const valid = value !== null
    && typeof value === 'object'
    && typeof value.id === 'string' && value.id.trim() !== ''
    && typeof value.name === 'string' && value.name.trim() !== ''
    && typeof value.species === 'string'
    && typeof value.area === 'string'
    && typeof value.needsCare === 'boolean'
    && typeof value.description === 'string'

  if (!valid) {
    throw new ServiceError('Джерело повернуло некоректний запис тварини.', {
      code: 'BAD_DATA',
    })
  }

  return {
    id: value.id,
    name: value.name.trim(),
    species: value.species,
    area: value.area,
    needsCare: value.needsCare,
    description: value.description,
  }
}

export function toAnimalList(value) {
  if (!Array.isArray(value)) {
    throw new ServiceError('Джерело повернуло некоректний список тварин.', {
      code: 'BAD_DATA',
    })
  }

  const animals = value.map(toAnimal)
  if (new Set(animals.map((animal) => animal.id)).size !== animals.length) {
    throw new ServiceError('Джерело повернуло повторні ідентифікатори тварин.', {
      code: 'BAD_DATA',
    })
  }
  return animals
}
