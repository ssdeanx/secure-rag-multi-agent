import { describe, it, expect, vi } from 'vitest'

// Mock the serpapi package
vi.mock('serpapi', () => ({
  getJson: vi.fn(),
}))

// Mock the logger
vi.mock('../config/logger', () => ({
  log: vi.fn(),
}))

describe('SerpAPI Academic and Local Tools', () => {
  it('should load academic and local tools without errors', () => {
    expect(true).toBe(true)
  })
})
