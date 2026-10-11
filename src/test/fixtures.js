import { animals } from '../data/animals.js'

export const testItem = animals.find((item) => item.id === 'an-001')

export const validInput = {
  animalId: 'an-001',
  schedule: 'Щовихідних зранку годувати кицьку.',
  visitsPerWeek: 2,
  needsSupplies: true,
}

export const savedRequest = {
  ...validInput,
  id: 'req-test-001',
}
