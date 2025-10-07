import { describe, it, expect, beforeEach, vi } from 'vitest'
import { weatherTool } from '../weather-tool'

// Mock fetch globally
global.fetch = vi.fn() as any

describe('weatherTool', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should successfully fetch weather data', async () => {
        const mockGeocodingResponse = {
            results: [
                {
                    latitude: 40.7128,
                    longitude: -74.006,
                    name: 'New York',
                },
            ],
        }

        const mockWeatherResponse = {
            current: {
                time: '2024-01-01T12:00',
                temperature_2m: 20.5,
                apparent_temperature: 22.1,
                relative_humidity_2m: 65,
                wind_speed_10m: 5.2,
                wind_gusts_10m: 8.5,
                weather_code: 1,
            },
        }

        ;(global.fetch as any)
            .mockResolvedValueOnce({
                json: () => Promise.resolve(mockGeocodingResponse),
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve(mockWeatherResponse),
            })

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({ temperatureUnit: 'celsius' }),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    end: vi.fn(),
                }),
            },
        } as any

        const result = await weatherTool.execute({
            context: { location: 'New York' },
            runtimeContext: mockRuntimeContext,
            tracingContext: mockTracingContext,
        })

        expect(result).toEqual({
            temperature: 20.5,
            feelsLike: 22.1,
            humidity: 65,
            windSpeed: 5.2,
            windGust: 8.5,
            conditions: 'Mainly clear',
            location: 'New York',
            unit: '°C',
        })

        expect(global.fetch).toHaveBeenCalledTimes(2)
        expect(
            mockTracingContext.currentSpan.createChildSpan
        ).toHaveBeenCalledWith({
            type: expect.any(String),
            name: 'weather-tool',
            input: { location: 'New York', temperatureUnit: 'celsius' },
        })
    })

    it('should handle location not found', async () => {
        const mockGeocodingResponse = { results: [] }

        ;(global.fetch as any).mockResolvedValueOnce({
            json: () => Promise.resolve(mockGeocodingResponse),
        })

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({ temperatureUnit: 'fahrenheit' }),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    end: vi.fn(),
                }),
            },
        } as any

        await expect(
            weatherTool.execute({
                context: { location: 'NonExistentCity' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })
        ).rejects.toThrow("Location 'NonExistentCity' not found")
    })

    it('should handle API errors', async () => {
        ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({ temperatureUnit: 'celsius' }),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    end: vi.fn(),
                }),
            },
        } as any

        await expect(
            weatherTool.execute({
                context: { location: 'New York' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })
        ).rejects.toThrow('Network error')
    })

    it('should use fahrenheit when specified', async () => {
        const mockGeocodingResponse = {
            results: [
                {
                    latitude: 40.7128,
                    longitude: -74.006,
                    name: 'New York',
                },
            ],
        }

        const mockWeatherResponse = {
            current: {
                time: '2024-01-01T12:00',
                temperature_2m: 68,
                apparent_temperature: 70,
                relative_humidity_2m: 65,
                wind_speed_10m: 5.2,
                wind_gusts_10m: 8.5,
                weather_code: 1,
            },
        }

        ;(global.fetch as any)
            .mockResolvedValueOnce({
                json: () => Promise.resolve(mockGeocodingResponse),
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve(mockWeatherResponse),
            })

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({ temperatureUnit: 'fahrenheit' }),
        } as any

        const result = await weatherTool.execute({
            context: { location: 'New York' },
            runtimeContext: mockRuntimeContext,
            tracingContext: undefined,
        })

        expect(result.unit).toBe('°F')
        expect(result.temperature).toBe(68)
    })

    it('should handle tracing context errors', async () => {
        const mockGeocodingResponse = {
            results: [
                {
                    latitude: 40.7128,
                    longitude: -74.006,
                    name: 'New York',
                },
            ],
        }

        const mockWeatherResponse = {
            current: {
                time: '2024-01-01T12:00',
                temperature_2m: 20.5,
                apparent_temperature: 22.1,
                relative_humidity_2m: 65,
                wind_speed_10m: 5.2,
                wind_gusts_10m: 8.5,
                weather_code: 1,
            },
        }

        ;(global.fetch as any)
            .mockResolvedValueOnce({
                json: () => Promise.resolve(mockGeocodingResponse),
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve(mockWeatherResponse),
            })

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({ temperatureUnit: 'celsius' }),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    end: vi.fn(),
                }),
            },
        } as any

        // Test with tracing context that has no currentSpan
        const result = await weatherTool.execute({
            context: { location: 'New York' },
            runtimeContext: mockRuntimeContext,
            tracingContext: {},
        } as any)

        expect(result.location).toBe('New York')
    })
})
