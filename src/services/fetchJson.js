import { ServiceError } from './ServiceError.js'

export async function fetchJson(url, { signal } = {}) {
  let response
  try {
    response = await fetch(url, {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ServiceError('Не вдалося зв’язатися із джерелом даних.', {
      code: 'NETWORK',
    })
  }

  if (!response.ok) {
    throw new ServiceError(
      response.status === 404
        ? 'Файл даних не знайдено.'
        : 'Джерело даних тимчасово недоступне.',
      { code: response.status === 404 ? 'NOT_FOUND' : 'HTTP', status: response.status },
    )
  }

  try {
    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ServiceError('Джерело повернуло відповідь не у форматі JSON.', {
      code: 'BAD_DATA',
    })
  }
}
