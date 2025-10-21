import type React from 'react'
import type { FinancialStateData } from './state'

import { useFinancialState } from './state'
import { useFinancialMentions } from './mentions'
import { useFinancialContext } from './context'

/**
 * Financial Cedar Hooks
 *
 * Orchestrates all Cedar-OS functionality for financial domain:
 * - State management (useFinancialState)
 * - Context subscription (useFinancialContext)
 * - Mention providers (useFinancialMentions)
 *
 * This hook encapsulates all Cedar integrations in a single import.
 */
export function useCedarFinancial(
    financialState: FinancialStateData,
    setFinancialState: React.Dispatch<React.SetStateAction<FinancialStateData>>
) {
    useFinancialState(financialState, setFinancialState)
    useFinancialMentions()
    useFinancialContext()
}
