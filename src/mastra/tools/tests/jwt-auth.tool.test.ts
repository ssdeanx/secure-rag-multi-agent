import { describe, it, expect, beforeEach, vi } from 'vitest'
import { jwtAuthTool } from '../jwt-auth.tool'
import { AuthenticationService } from '../../services/AuthenticationService'

// Mock dependencies
vi.mock('../../services/AuthenticationService')
vi.mock('../../config/logger')

const mockAuthenticationService = vi.mocked(AuthenticationService)

describe('jwtAuthTool', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should successfully verify JWT and return claims', async () => {
        const mockJwt = 'valid.jwt.token'
        const mockClaims = {
            sub: 'user123',
            roles: ['employee', 'viewer'],
            tenant: 'acme',
            stepUp: false,
            exp: 1234567890,
            iat: 1234567800,
        }

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue(mockJwt),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    end: vi.fn(),
                }),
            },
        } as any

        mockAuthenticationService.verifyJWT.mockResolvedValue(mockClaims)

        const result = await jwtAuthTool.execute({
            context: {},
            runtimeContext: mockRuntimeContext,
            tracingContext: mockTracingContext,
        })

        expect(result).toEqual(mockClaims)
        expect(mockAuthenticationService.verifyJWT).toHaveBeenCalledWith(
            mockJwt
        )
        expect(
            mockTracingContext.currentSpan.createChildSpan
        ).toHaveBeenCalledWith({
            type: expect.any(String),
            name: 'jwt-auth-tool',
            input: { hasJwt: true },
        })
    })

    it('should throw error when JWT not found in runtime context', async () => {
        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue(undefined),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    error: vi.fn(),
                }),
            },
        } as any

        await expect(
            jwtAuthTool.execute({
                context: {},
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })
        ).rejects.toThrow('JWT not found in runtime context')

        expect(
            mockTracingContext.currentSpan.createChildSpan
        ).toHaveBeenCalledWith({
            type: expect.any(String),
            name: 'jwt-auth-tool',
            input: { hasJwt: false },
        })
    })

    it('should handle JWT verification errors', async () => {
        const mockJwt = 'invalid.jwt.token'
        const mockError = new Error('Invalid JWT signature')

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue(mockJwt),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    error: vi.fn(),
                }),
            },
        } as any

        mockAuthenticationService.verifyJWT.mockRejectedValue(mockError)

        await expect(
            jwtAuthTool.execute({
                context: {},
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })
        ).rejects.toThrow('JWT verification failed: Unknown error')

        expect(mockAuthenticationService.verifyJWT).toHaveBeenCalledWith(
            mockJwt
        )
    })

    it('should handle tracing context without current span', async () => {
        const mockJwt = 'valid.jwt.token'
        const mockClaims = {
            sub: 'user123',
            roles: ['employee'],
            tenant: 'acme',
        }

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue(mockJwt),
        } as any

        mockAuthenticationService.verifyJWT.mockResolvedValue(mockClaims)

        const result = await jwtAuthTool.execute({
            context: {},
            runtimeContext: mockRuntimeContext,
            tracingContext: undefined,
        })

        expect(result).toEqual(mockClaims)
        expect(mockAuthenticationService.verifyJWT).toHaveBeenCalledWith(
            mockJwt
        )
    })
})
