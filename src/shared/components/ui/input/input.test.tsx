import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from '.'

describe('Input', () => {
  it('GIVEN default props WHEN rendered THEN input element is present', () => {
    render(<Input placeholder="Enter value" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('GIVEN label prop WHEN rendered THEN label text is visible', () => {
    render(<Input label="Amount" />)
    expect(screen.getByText('Amount')).toBeVisible()
  })

  it('GIVEN no label prop WHEN rendered THEN no label element is present', () => {
    const { container } = render(<Input placeholder="Enter" />)
    expect(container.querySelector('label')).toBeNull()
  })

  it('GIVEN required prop with label WHEN rendered THEN asterisk indicator is shown', () => {
    render(<Input label="Amount" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('GIVEN placeholder prop WHEN rendered THEN placeholder is set on input', () => {
    render(<Input placeholder="e.g. 2000" />)
    expect(screen.getByPlaceholderText('e.g. 2000')).toBeInTheDocument()
  })

  it('GIVEN leftIcon prop WHEN rendered THEN icon image with correct alt is shown', () => {
    render(<Input leftIcon="dollar" />)
    expect(screen.getByRole('img', { name: 'dollar' })).toBeInTheDocument()
  })

  it('GIVEN no leftIcon prop WHEN rendered THEN no icon image is shown', () => {
    render(<Input placeholder="Enter" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('GIVEN errorText prop WHEN rendered THEN error message is visible', () => {
    render(<Input errorText="This field is required" />)
    expect(screen.getByText('This field is required')).toBeVisible()
  })

  it('GIVEN errorText prop WHEN rendered THEN error icon is shown', () => {
    render(<Input errorText="Error" />)
    expect(screen.getByRole('img', { name: 'error' })).toBeInTheDocument()
  })

  it('GIVEN disabled prop WHEN rendered THEN input element is disabled', () => {
    render(<Input disabled label="Amount" />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('GIVEN disabled prop WHEN rendered THEN outer container has opacity-50 class', () => {
    const { container } = render(<Input disabled />)
    expect(container.firstChild).toHaveClass('opacity-50')
  })

  it('GIVEN input WHEN user types THEN input value is updated', async () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'hello')
    expect(input).toHaveValue('hello')
  })

  it('GIVEN onChange handler WHEN user types THEN handler is called', async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'hi')
    expect(onChange).toHaveBeenCalled()
  })
})
