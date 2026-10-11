import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CareRequestPage from './CareRequestPage.jsx'
import { testItem, validInput, savedRequest } from '../test/fixtures.js'
import { deferred } from '../test/deferred.js'

function renderEditor(onSave) {
  return render(
    <CareRequestPage
      title="Нова заявка"
      item={testItem}
      onSave={onSave}
      onCancel={vi.fn()}
      submitLabel="Створити заявку"
    />,
  )
}

async function fillValidForm(user) {
  const schedule = screen.getByRole('textbox', { name: /Бажаний графік догляду/ })
  await user.clear(schedule)
  await user.type(schedule, validInput.schedule)
  const visits = screen.getByRole('spinbutton', { name: /Візитів на тиждень/ })
  await user.clear(visits)
  await user.type(visits, '2')
  await user.click(screen.getByRole('checkbox', { name: /Потрібна допомога/ }))
}

test('не зберігає порожній графік та пояснює помилку', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  renderEditor(onSave)

  await user.click(screen.getByRole('button', { name: 'Створити заявку' }))

  const schedule = screen.getByRole('textbox', { name: /Бажаний графік догляду/ })
  expect(schedule).toHaveAttribute('aria-invalid', 'true')
  expect(schedule).toHaveFocus()
  expect(screen.getByText('Укажіть бажаний графік догляду.')).toBeInTheDocument()
  expect(onSave).not.toHaveBeenCalled()
})

test('передає нормалізовані поля й блокує повтор до відповіді', async () => {
  const user = userEvent.setup()
  const pending = deferred()
  const onSave = vi.fn().mockReturnValue(pending.promise)
  renderEditor(onSave)
  await fillValidForm(user)

  await user.click(screen.getByRole('button', { name: 'Створити заявку' }))

  const submit = screen.getByRole('button', { name: 'Збереження…' })
  expect(submit).toBeDisabled()
  expect(screen.getByRole('textbox', { name: /Бажаний графік догляду/ })).toBeDisabled()
  await user.click(submit)
  expect(onSave).toHaveBeenCalledTimes(1)
  expect(onSave).toHaveBeenCalledWith(validInput)

  await act(async () => {
    pending.resolve({ ok: true, record: savedRequest })
    await pending.promise
  })

  expect(screen.getByRole('button', { name: 'Створити заявку' })).toBeEnabled()
})

test('після відмови зберігає введення й дозволяє свідомий повтор', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
    .mockResolvedValueOnce({ ok: false, message: 'Сервіс тимчасово недоступний.' })
    .mockResolvedValueOnce({ ok: true, record: savedRequest })
  renderEditor(onSave)
  await fillValidForm(user)

  await user.click(screen.getByRole('button', { name: 'Створити заявку' }))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Сервіс тимчасово недоступний.',
  )
  expect(screen.getByRole('textbox', { name: /Бажаний графік догляду/ }))
    .toHaveValue(validInput.schedule)
  expect(screen.getByRole('spinbutton', { name: /Візитів на тиждень/ })).toHaveValue(2)
  expect(screen.getByRole('checkbox', { name: /Потрібна допомога/ })).toBeChecked()

  await user.click(screen.getByRole('button', { name: 'Створити заявку' }))

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Створити заявку' })).toBeEnabled()
  })
  expect(onSave).toHaveBeenCalledTimes(2)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
