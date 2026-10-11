import { afterEach, expect, test, vi } from 'vitest'
import { createApiCareRequestService } from './apiCareRequestService.js'
import { savedRequest, validInput } from '../test/fixtures.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('відхиляє HTTP 404 замість удаваного успіху', async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 404 }))
  vi.stubGlobal('fetch', fetchMock)
  const service = createApiCareRequestService('https://example.test/api')

  await expect(service.getById('missing')).rejects.toMatchObject({
    code: 'NOT_FOUND', status: 404,
  })
  expect(fetchMock).toHaveBeenCalledWith(
    'https://example.test/api/care-requests/missing',
    expect.objectContaining({ method: 'GET' }),
  )
})

test('після DELETE 204 не намагається читати JSON', async () => {
  const response = new Response(null, { status: 204 })
  const readJson = vi.spyOn(response, 'json')
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  const service = createApiCareRequestService('https://example.test/api')

  await expect(service.delete('req-test-001')).resolves.toBeUndefined()
  expect(readJson).not.toHaveBeenCalled()
  expect(fetchMock).toHaveBeenCalledWith(
    'https://example.test/api/care-requests/req-test-001',
    expect.objectContaining({ method: 'DELETE' }),
  )
})

test('створення надсилає нормалізовані поля без id', async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(
    JSON.stringify(savedRequest),
    { status: 201, headers: { 'Content-Type': 'application/json' } },
  ))
  vi.stubGlobal('fetch', fetchMock)
  const service = createApiCareRequestService('https://example.test/api')

  const record = await service.create({ ...validInput, visitsPerWeek: '2', id: 'injected' })

  const [, options] = fetchMock.mock.calls[0]
  expect(JSON.parse(options.body)).toEqual(validInput)
  expect(record).toEqual(savedRequest)
})

test.each([
  { label: 'неправильна оболонка', body: { items: [] } },
  { label: 'тип кількості візитів', body: [{ ...savedRequest, visitsPerWeek: 'two' }] },
  { label: 'повторний id', body: [savedRequest, { ...savedRequest }] },
])('відхиляє несумісну структуру: $label', async ({ body }) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })))
  const service = createApiCareRequestService('https://example.test/api')

  await expect(service.getAll()).rejects.toMatchObject({ code: 'BAD_DATA' })
})
