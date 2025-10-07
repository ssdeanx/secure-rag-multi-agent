import { logStepStart, logStepEnd, logError } from '../config/logger'

export interface StepExecutor<T, R> {
    (input: T): Promise<R>
}

export function withLoggingAndErrorHandling<T, R>(
    stepId: string,
    description: string
): (target: StepExecutor<T, R>) => StepExecutor<T, R> {
    return function decorator(target: StepExecutor<T, R>): StepExecutor<T, R> {
        return async function wrappedExecutor(input: T): Promise<R> {
            const startTime = Date.now()
            logStepStart(stepId, { description })

            try {
                const result = await target(input)
                logStepEnd(stepId, { success: true }, Date.now() - startTime)
                return result
            } catch (error) {
                logError(stepId, error, { input })
                throw new Error(
                    `${description} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                )
            }
        }
    }
}

export function withAgentLogging<T, R>(
    agentId: string,
    activity: string
): (target: StepExecutor<T, R>) => StepExecutor<T, R> {
    return function decorator(target: StepExecutor<T, R>): StepExecutor<T, R> {
        return async function wrappedExecutor(input: T): Promise<R> {
            const { logAgentActivity } = await import('../config/logger')
            logAgentActivity(agentId, activity, { input })
            return await target(input)
        }
    }
}

export function createStepWrapper<InputType, OutputType>(
    stepId: string,
    description: string,
    executor: StepExecutor<InputType, OutputType>
): StepExecutor<InputType, OutputType> {
    return withLoggingAndErrorHandling<InputType, OutputType>(
        stepId,
        description
    )(executor)
}
