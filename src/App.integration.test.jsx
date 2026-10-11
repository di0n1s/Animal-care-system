import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import App from './App.jsx'
import { careRequestService } from './services/careRequestService.js'
import { ServiceError } from './services/ServiceError.js'
import { savedRequest, validInput } from './test/fixtures.js'
import { deferred } from './test/deferred.js'

vi.mock('./services/careRequestService.js', () => ({
  careRequestService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

beforeEach(() => {
  for (const method of Object.values(careRequestService)) method.mockReset()
  careRequestService.getAll.mockResolvedValue([{ ...savedRequest }])
  careRequestService.getById.mockResolvedValue({ ...savedRequest })
  careRequestService.create.mockImplementation(async (input) => ({
    ...input, id: 'req-created',
  }))
  careRequestService.update.mockImplementation(async (id, input) => ({ ...input, id }))
  careRequestService.delete.mockResolvedValue(undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function LocationProbe() {
  const location = useLocation()
  return <output data-testid="location">{location.pathname}{location.search}</output>
}

function renderApp(path = '/requests') {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  )
  return user
}

test('показує завантаження до отримання колекції', async () => {
  const pending = deferred()
  careRequestService.getAll.mockReturnValueOnce(pending.promise)
  renderApp()

  expect(screen.getByText('Завантаження заявок…')).toBeInTheDocument()
  expect(screen.queryByText(savedRequest.schedule)).not.toBeInTheDocument()
  expect(screen.queryByText(/Заявок ще немає/)).not.toBeInTheDocument()

  await act(async () => {
    pending.resolve([savedRequest])
    await pending.promise
  })

  expect(await screen.findByText(savedRequest.schedule)).toBeInTheDocument()
  expect(screen.queryByText('Завантаження заявок…')).not.toBeInTheDocument()
})

test('після відмови читання повторно завантажує дані', async () => {
  careRequestService.getAll
    .mockRejectedValueOnce(new ServiceError('Навчальна відмова читання.'))
    .mockResolvedValueOnce([savedRequest])
  const user = renderApp()

  expect(await screen.findByRole('alert')).toHaveTextContent('Навчальна відмова читання.')
  expect(screen.queryByText(savedRequest.schedule)).not.toBeInTheDocument()
  expect(screen.queryByText(/Заявок ще немає/)).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Спробувати ще раз' }))

  expect(await screen.findByText(savedRequest.schedule)).toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('успішний порожній список має окреме пояснення', async () => {
  careRequestService.getAll.mockResolvedValueOnce([])
  renderApp()

  expect(await screen.findByText(/Заявок ще немає/)).toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.queryByRole('table')).not.toBeInTheDocument()
})

test.each([
  ['/requests/req-test-001', 'Заявка req-test-001'],
  ['/requests/req-test-001/edit', 'Редагування заявки req-test-001'],
  ['/requests/req-missing', 'Заявку не знайдено'],
  ['/requests/new?animalId=an-missing', 'Неможливо підготувати заявку'],
  ['/unknown-page', '404: сторінку не знайдено'],
])('адреса %s відкриває відповідний екран', async (path, title) => {
  renderApp(path)

  expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument()
})

test('URL фільтра не змінює джерело заявок', async () => {
  renderApp('/requests?q=немає_такого_збігу&supplies=all&sort=visits-asc')

  expect(await screen.findByText('За цими умовами нічого не знайдено.'))
    .toBeInTheDocument()
  expect(screen.queryByRole('table')).not.toBeInTheDocument()
  expect(careRequestService.delete).not.toHaveBeenCalled()
})

test('некоректна форма не викликає створення', async () => {
  const user = renderApp('/requests/new?animalId=an-001')

  await user.click(await screen.findByRole('button', { name: 'Створити заявку' }))

  expect(screen.getByText('Укажіть бажаний графік догляду.')).toBeInTheDocument()
  expect(careRequestService.create).not.toHaveBeenCalled()
  expect(screen.getByTestId('location')).toHaveTextContent('/requests/new')
})

test('створює заявку та відкриває її підтверджені деталі', async () => {
  careRequestService.getAll.mockResolvedValueOnce([])
  const user = renderApp('/requests/new?animalId=an-001')

  const schedule = await screen.findByRole('textbox', { name: /Бажаний графік догляду/ })
  await user.type(schedule, validInput.schedule)
  const visits = screen.getByRole('spinbutton', { name: /Візитів на тиждень/ })
  await user.clear(visits)
  await user.type(visits, '2')
  await user.click(screen.getByRole('checkbox', { name: /Потрібна допомога/ }))
  await user.click(screen.getByRole('button', { name: 'Створити заявку' }))

  expect(await screen.findByRole('heading', { name: 'Заявка req-created' }))
    .toBeInTheDocument()
  expect(screen.getByTestId('location')).toHaveTextContent('/requests/req-created')
  expect(screen.getByText(validInput.schedule)).toBeInTheDocument()
  expect(careRequestService.create).toHaveBeenCalledTimes(1)
  expect(careRequestService.create).toHaveBeenCalledWith(validInput)
  expect(screen.queryByRole('form', { name: 'Форма заявки на догляд' }))
    .not.toBeInTheDocument()
})

test('редагує заявку: той самий id, нові поля в деталях', async () => {
  const user = renderApp('/requests/req-test-001/edit')

  const schedule = await screen.findByRole('textbox', { name: /Бажаний графік догляду/ })
  expect(schedule).toHaveValue(savedRequest.schedule)
  await user.clear(schedule)
  await user.type(schedule, 'Оновлений графік: двічі на тиждень увечері.')
  await user.click(screen.getByRole('button', { name: 'Зберегти зміни' }))

  expect(await screen.findByRole('heading', { name: 'Заявка req-test-001' }))
    .toBeInTheDocument()
  expect(careRequestService.update).toHaveBeenCalledWith('req-test-001', {
    ...validInput,
    schedule: 'Оновлений графік: двічі на тиждень увечері.',
  })
  expect(screen.getByText('Оновлений графік: двічі на тиждень увечері.'))
    .toBeInTheDocument()
  expect(screen.getByTestId('location')).toHaveTextContent('/requests/req-test-001')
})

test('скасування діалогу не викликає видалення', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(false)
  const user = renderApp('/requests/req-test-001')
  await screen.findByRole('heading', { name: 'Заявка req-test-001' })

  await user.click(screen.getByRole('button', { name: 'Видалити заявку' }))

  expect(careRequestService.delete).not.toHaveBeenCalled()
  expect(screen.getByRole('heading', { name: 'Заявка req-test-001' }))
    .toBeInTheDocument()
})

test('відмова видалення залишає запис і поточну адресу', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  careRequestService.delete.mockRejectedValueOnce(
    new ServiceError('Не вдалося видалити заявку.'),
  )
  const user = renderApp('/requests/req-test-001')
  await screen.findByRole('heading', { name: 'Заявка req-test-001' })

  await user.click(screen.getByRole('button', { name: 'Видалити заявку' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('Не вдалося видалити заявку.')
  expect(screen.getByText(savedRequest.schedule)).toBeInTheDocument()
  expect(screen.getByTestId('location')).toHaveTextContent('/requests/req-test-001')
  expect(careRequestService.delete).toHaveBeenCalledWith(savedRequest.id)
})

test('підтверджене видалення прибирає саме потрібний запис зі списку', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  careRequestService.getAll.mockResolvedValue([
    { ...savedRequest },
    { ...savedRequest, id: 'req-test-002', schedule: 'Інший запис для перевірки.' },
  ])
  const user = renderApp('/requests')
  const table = await screen.findByRole('table')
  const firstRow = within(table).getByText(savedRequest.schedule).closest('tr')

  await user.click(within(firstRow).getByRole('button', { name: 'Видалити' }))

  expect(await screen.findByText('Заявку видалено.')).toBeInTheDocument()
  expect(careRequestService.delete).toHaveBeenCalledWith('req-test-001')
  expect(screen.queryByText(savedRequest.schedule)).not.toBeInTheDocument()
  expect(screen.getByText('Інший запис для перевірки.')).toBeInTheDocument()
})

test('помилка повторного читання не показує застаріле повідомлення про успіх', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  const user = renderApp('/requests')
  await screen.findByRole('table')
  await user.click(screen.getByRole('button', { name: 'Видалити' }))
  expect(await screen.findByText('Заявку видалено.')).toBeInTheDocument()

  careRequestService.getAll.mockRejectedValueOnce(
    new ServiceError('Навчальна відмова читання.'),
  )
  await user.click(screen.getByRole('button', { name: 'Оновити дані' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('Навчальна відмова читання.')
  expect(screen.queryByText('Заявку видалено.')).not.toBeInTheDocument()
})

test('під час видалення дії блокуються нативно, а не лише візуально', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  const pending = deferred()
  careRequestService.delete.mockReturnValueOnce(pending.promise)
  const user = renderApp('/requests')
  await screen.findByRole('table')

  await user.click(screen.getByRole('button', { name: 'Видалити' }))

  expect(screen.getByRole('button', { name: 'Видалити' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Оновити дані' })).toBeDisabled()
  expect(careRequestService.delete).toHaveBeenCalledTimes(1)

  await act(async () => {
    pending.resolve(undefined)
    await pending.promise
  })

  expect(await screen.findByText(/Заявок ще немає/)).toBeInTheDocument()
})

test('після редагування список показує нові поля, а не застарілий рядок', async () => {
  const user = renderApp('/requests/req-test-001/edit')
  const schedule = await screen.findByRole('textbox', { name: /Бажаний графік догляду/ })
  await user.clear(schedule)
  await user.type(schedule, 'Оновлений графік: двічі на тиждень увечері.')
  await user.click(screen.getByRole('button', { name: 'Зберегти зміни' }))
  await screen.findByRole('heading', { name: 'Заявка req-test-001' })

  await user.click(screen.getByRole('link', { name: 'До всіх заявок' }))

  const table = await screen.findByRole('table')
  expect(within(table).getByText('Оновлений графік: двічі на тиждень увечері.'))
    .toBeInTheDocument()
  expect(within(table).queryByText(savedRequest.schedule)).not.toBeInTheDocument()
})
