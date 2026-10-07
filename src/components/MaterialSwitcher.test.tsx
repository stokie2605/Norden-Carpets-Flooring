import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { BookingProvider } from '../context/BookingContext'
import { materials } from '../content/site'
import { MaterialSwitcher } from './MaterialSwitcher'

function setup() {
  render(
    <BookingProvider>
      <MaterialSwitcher />
    </BookingProvider>,
  )
  return { user: userEvent.setup(), tabs: screen.getAllByRole('tab') }
}

describe('MaterialSwitcher', () => {
  it('renders one tab per material with the first selected', () => {
    const { tabs } = setup()
    expect(tabs.map((t) => t.textContent)).toEqual(materials.map((m) => m.label))
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Carpets')
  })

  it('uses a roving tabindex so only the active tab is in the tab order', () => {
    const { tabs } = setup()
    expect(tabs.filter((t) => t.tabIndex === 0)).toHaveLength(1)
  })

  it('moves between tabs with arrow, Home and End keys', async () => {
    const { user, tabs } = setup()
    await user.click(tabs[0]!)

    await user.keyboard('{ArrowRight}')
    expect(tabs[1]).toHaveFocus()
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('LVT')

    await user.keyboard('{End}')
    expect(tabs.at(-1)).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(tabs[0]).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(tabs.at(-1)).toHaveFocus()

    await user.keyboard('{Home}')
    expect(tabs[0]).toHaveFocus()
  })

  it('shows the price for the selected material', async () => {
    const { user, tabs } = setup()
    await user.click(tabs[4]!)
    expect(screen.getByRole('tabpanel')).toHaveTextContent('From £45')
  })
})
