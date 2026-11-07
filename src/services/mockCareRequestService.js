import { ServiceError } from './ServiceError.js'
import { animalService } from './animalService.js'
import { fetchJson } from './fetchJson.js'
import { toCareRequestInput, toCareRequestList } from './careRequestContract.js'

const storageKey = 'animal-care.care-requests.v1'
const seedUrl = `${import.meta.env.BASE_URL}mock-api/care-requests.json`
const failures = new Set()

export function failNextMockRequest(operation) {
  failures.add(operation)
}

function pause(signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }, 600)

    function abort() {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      reject(new DOMException('Aborted', 'AbortError'))
    }

    signal?.addEventListener('abort', abort, { once: true })
  })
}

async function before(operation, signal) {
  await pause(signal)
  if (failures.delete(operation)) {
    throw new ServiceError('Навчальна відмова сервісу. Повторіть дію.', {
      code: 'MOCK_FAILURE',
    })
  }
}

async function read(signal) {
  let raw
  try {
    raw = localStorage.getItem(storageKey)
  } catch {
    throw new ServiceError('Не вдалося прочитати локальні дані.', {
      code: 'STORAGE_READ',
    })
  }

  if (raw === null) {
    return toCareRequestList(await fetchJson(seedUrl, { signal }))
  }

  try {
    return toCareRequestList(JSON.parse(raw))
  } catch (error) {
    if (error instanceof ServiceError) throw error
    throw new ServiceError('Не вдалося прочитати локальні дані.', {
      code: 'STORAGE_READ',
    })
  }
}

function write(records) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(records))
  } catch {
    throw new ServiceError('Не вдалося зберегти локальні дані.', {
      code: 'STORAGE_WRITE',
    })
  }
}

function findRecord(records, id) {
  const record = records.find((entry) => entry.id === id)
  if (!record) {
    throw new ServiceError('Заявку не знайдено.', { code: 'NOT_FOUND' })
  }
  return record
}

export const mockCareRequestService = {
  async getAll({ signal } = {}) {
    await before('getAll', signal)
    return read(signal)
  },

  async getById(id, { signal } = {}) {
    await before('getById', signal)
    return findRecord(await read(signal), id)
  },

  async create(input) {
    const value = toCareRequestInput(input, await animalService.getAll())
    await before('create')
    const records = await read()
    const record = { ...value, id: `req-${crypto.randomUUID()}` }
    write([...records, record])
    return { ...record }
  },

  async update(id, input) {
    const value = toCareRequestInput(input, await animalService.getAll())
    await before('update')
    const records = await read()
    findRecord(records, id)
    const record = { ...value, id }
    write(records.map((entry) => (entry.id === id ? record : entry)))
    return { ...record }
  },

  async delete(id) {
    await before('delete')
    const records = await read()
    findRecord(records, id)
    write(records.filter((entry) => entry.id !== id))
  },
}
