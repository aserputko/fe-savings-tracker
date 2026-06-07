import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '.'

describe('Button', () => {
  it('GIVEN default props WHEN rendered THEN displays children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('GIVEN onClick handler WHEN button is clicked THEN handler is called once', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('GIVEN disabled prop WHEN rendered THEN button is disabled', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('GIVEN disabled prop WHEN button is clicked THEN onClick is not called', async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('GIVEN leftIcon prop WHEN rendered THEN icon image with correct alt is shown', () => {
    render(<Button leftIcon="dollar">Pay</Button>)
    expect(screen.getByRole('img', { name: 'dollar' })).toBeInTheDocument()
  })

  it('GIVEN rightIcon prop WHEN rendered THEN icon image with correct alt is shown', () => {
    render(<Button rightIcon="arrow-down">Open</Button>)
    expect(screen.getByRole('img', { name: 'arrow-down' })).toBeInTheDocument()
  })

  it('GIVEN primary variant with leftIcon WHEN rendered THEN icon has invert class', () => {
    render(<Button variant="primary" leftIcon="dollar">Pay</Button>)
    expect(screen.getByRole('img', { name: 'dollar' })).toHaveClass('invert')
  })

  it('GIVEN secondary variant with leftIcon WHEN rendered THEN icon does not have invert class', () => {
    render(<Button variant="secondary" leftIcon="dollar">Pay</Button>)
    expect(screen.getByRole('img', { name: 'dollar' })).not.toHaveClass('invert')
  })

  it('GIVEN asChild prop with anchor element WHEN rendered THEN renders as anchor', () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>
    )
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })
})
