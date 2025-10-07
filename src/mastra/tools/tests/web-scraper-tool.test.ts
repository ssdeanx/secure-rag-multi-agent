import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RuntimeContext } from '@mastra/core/runtime-context'
import type { TracingContext } from '@mastra/core/ai-tracing'
import type { Stats } from 'fs'

// Mock Node.js modules that logger depends on
vi.mock('node:fs', () => ({
    existsSync: vi.fn(() => true),
    mkdirSync: vi.fn(),
}))

vi.mock('node:path', () => ({
    join: vi.fn((...args: string[]) => args.join('/')),
    resolve: vi.fn((...args: string[]) => args.join('/')),
    dirname: vi.fn(
        (path: string) => path.split('/').slice(0, -1).join('/') ?? '.'
    ),
    basename: vi.fn((path: string) => path.split('/').pop() ?? ''),
    extname: vi.fn((path: string) => {
        const parts = path.split('.')
        return parts.length > 1 ? '.' + parts.pop() : ''
    }),
    relative: vi.fn((from: string, to: string) => {
        // Simple relative path calculation
        if (from === to) {
            return '.'
        }
        const fromParts = from.split('/')
        const toParts = to.split('/')
        let commonLength = 0
        for (let i = 0; i < Math.min(fromParts.length, toParts.length); i++) {
            if (fromParts[i] === toParts[i]) {
                commonLength++
            } else {
                break
            }
        }
        const upLevels = fromParts.length - commonLength
        const downParts = toParts.slice(commonLength)
        return '../'.repeat(upLevels) + downParts.join('/')
    }),
}))

// Mock process.cwd to prevent logger initialization issues
process.cwd = vi.fn(() => '/tmp/test')

// Helper function to create mock tracing context
const createMockTracingContext = (): TracingContext => {
    // Keep a minimal mock that satisfies the TracingContext shape used by the tools
    // Use unknown casts to avoid strict type exhaustiveness in tests
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockSpan: any = {
        createChildSpan: vi.fn(),
        end: vi.fn(),
        error: vi.fn(),
        addEvent: vi.fn(),
        recordException: vi.fn(),
        setStatus: vi.fn(),
        spanContext: vi.fn(),
        tracer: vi.fn(),
        resource: vi.fn(),
        instrumentationScope: vi.fn(),
        duration: vi.fn(),
        ended: false,
        startTime: new Date(),
        endTime: new Date(),
        attributes: {},
        events: [],
        links: [],
        kind: 'internal',
        name: 'test-span',
        update: vi.fn(),
        createEventSpan: vi.fn(),
        isRootSpan: false,
        isValid: true,
        parentSpanId: undefined,
        spanId: 'test-span-id',
        traceId: 'test-trace-id',
        status: { code: 0 },
    }

    return { currentSpan: mockSpan } as unknown as TracingContext
}

vi.mock('crawlee', () => {
    class MockCheerioCrawler {
        _parseHTML = vi.fn()
        _parseHtmlToDom = vi.fn()
        _runRequestHandler = vi.fn()
        config = {}
        router = null
        requestHandler = null
        errorHandler = null
        failedRequestHandler = null
        options: Record<string, unknown>

        constructor(options: Record<string, unknown> = {}) {
            this.options = options
        }

        async run() {
            // Mock successful run
            return undefined
        }
    }

    const MockRequest = vi.fn().mockImplementation((url: string) => ({
        url,
        method: 'GET',
        headers: {},
        payload: null,
        userData: {},
    }))

    return {
        CheerioCrawler: MockCheerioCrawler,
        Request: MockRequest,
    }
})

vi.mock('node:fs/promises', () => ({
    mkdir: vi.fn(),
    open: vi.fn(),
    access: vi.fn(),
    readdir: vi.fn(() => [
        { name: 'file1.md', isFile: () => true, isDirectory: () => false },
        { name: 'file2.md', isFile: () => true, isDirectory: () => false },
        { name: 'dir1', isFile: () => false, isDirectory: () => true },
    ]),
    stat: vi.fn().mockResolvedValue({
        isFile: () => true,
        isDirectory: () => false,
        size: 1024,
        mtime: new Date(),
        atime: new Date(),
        ctime: new Date(),
        birthtime: new Date(),
    } as Stats),
}))

// 'node:path' was mocked earlier; avoid re-mocking plain 'path'

// Import after mocks
import { JSDOM } from 'jsdom'
import { CheerioCrawler } from 'crawlee'
import * as fs from 'fs/promises'
import {
    HtmlProcessor,
    ValidationUtils,
    ScrapingError,
    webScraperTool,
    batchWebScraperTool,
    siteMapExtractorTool,
    linkExtractorTool,
    htmlToMarkdownTool,
    listScrapedContentTool,
    contentCleanerTool,
} from '../web-scraper-tool'

describe('Web Scraper Tool Tests', () => {
    let mockJSDOM: ReturnType<typeof vi.mocked<typeof JSDOM>>
    let mockCheerioCrawler: ReturnType<typeof vi.mocked<typeof CheerioCrawler>>
    let mockFs: {
        mkdir: ReturnType<typeof vi.mocked<typeof fs.mkdir>>
        open: ReturnType<typeof vi.mocked<typeof fs.open>>
        access: ReturnType<typeof vi.mocked<typeof fs.access>>
        readdir: ReturnType<typeof vi.mocked<typeof fs.readdir>>
        stat: ReturnType<typeof vi.mocked<typeof fs.stat>>
    }

    beforeEach(() => {
        // Get mocked modules
        mockJSDOM = vi.mocked(JSDOM)
        mockCheerioCrawler = vi.mocked(CheerioCrawler)
        mockFs = {
            mkdir: vi.mocked(fs.mkdir),
            open: vi.mocked(fs.open),
            access: vi.mocked(fs.access),
            readdir: vi.mocked(fs.readdir),
            stat: vi.mocked(fs.stat),
        }

        // Reset all mocks
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    describe('HtmlProcessor', () => {
        describe('sanitizeHtml', () => {
            it('should sanitize HTML by removing script and style tags', () => {
                const html =
                    '<html><head><script>alert("xss")</script><style>body{color:red}</style></head><body><h1>Hello</h1></body></html>'
                const result = HtmlProcessor.sanitizeHtml(html)
                expect(result).toBe(
                    '<html><head></head><body><h1>Hello</h1></body></html>'
                )
            })

            it('should handle empty HTML', () => {
                const result = HtmlProcessor.sanitizeHtml('')
                expect(result).toBe('<html><head></head><body></body></html>')
            })

            it('should handle HTML with only script tags', () => {
                const html = '<script>malicious code</script>'
                const result = HtmlProcessor.sanitizeHtml(html)
                expect(result).toBe('<html><head></head><body></body></html>')
            })

            it('should handle JSDOM errors gracefully', () => {
                mockJSDOM.mockImplementationOnce(() => {
                    throw new Error('JSDOM error')
                })

                const html = '<p>Test</p>'
                const result = HtmlProcessor.sanitizeHtml(html)
                expect(result).toBe(
                    '<html><head></head><body><p>Test</p></body></html>'
                )
            })
        })

        describe('extractTextContent', () => {
            it('should extract text content from HTML', () => {
                const html = '<html><body><h1>Hello World</h1></body></html>'
                const result = HtmlProcessor.extractTextContent(html)
                expect(result).toBe('Hello World')
                expect(mockJSDOM).toHaveBeenCalledWith(html)
            })

            it('should handle empty HTML', () => {
                const result = HtmlProcessor.extractTextContent('')
                expect(result).toBe('')
            })

            it('should handle HTML parsing errors', () => {
                mockJSDOM.mockImplementation(() => {
                    throw new Error('Parse error')
                })

                const html = '<invalid html>'
                expect(() => HtmlProcessor.extractTextContent(html)).toThrow(
                    ScrapingError
                )
            })
        })

        describe('htmlToMarkdown', () => {
            it('should convert HTML to markdown', () => {
                const html =
                    '<html><body><h1>Hello World</h1><p>This is a paragraph</p></body></html>'
                const result = HtmlProcessor.htmlToMarkdown(html)
                expect(result).toContain('# Hello World')
                expect(result).toContain('This is a paragraph')
            })

            it('should handle empty HTML', () => {
                const result = HtmlProcessor.htmlToMarkdown('')
                expect(result).toBe('')
            })

            it('should handle conversion errors', () => {
                mockJSDOM.mockImplementation(() => {
                    throw new Error('Conversion error')
                })

                const html = '<p>Test</p>'
                expect(() => HtmlProcessor.htmlToMarkdown(html)).toThrow(
                    ScrapingError
                )
            })
        })

        describe('sanitizeMarkdown', () => {
            it('should sanitize markdown by removing dangerous HTML', () => {
                const markdown =
                    '# Title\n\n<script>alert("xss")</script>\n\nContent'
                const result = HtmlProcessor.sanitizeMarkdown(markdown)
                expect(result).not.toContain('<script>')
                expect(result).toContain('# Title')
                expect(result).toContain('Content')
            })
        })
    })

    describe('ValidationUtils', () => {
        describe('validateUrl', () => {
            it('should validate valid URLs', () => {
                expect(() =>
                    ValidationUtils.validateUrl('https://example.com')
                ).not.toThrow()
                expect(() =>
                    ValidationUtils.validateUrl('http://example.com')
                ).not.toThrow()
            })

            it('should reject invalid URLs', () => {
                expect(() => ValidationUtils.validateUrl('not-a-url')).toThrow(
                    ScrapingError
                )
                expect(() => ValidationUtils.validateUrl('')).toThrow(
                    ScrapingError
                )
                expect(() =>
                    ValidationUtils.validateUrl('ftp://example.com')
                ).toThrow(ScrapingError)
            })
        })

        describe('sanitizeFileName', () => {
            it('should sanitize filenames by removing invalid characters', () => {
                expect(ValidationUtils.sanitizeFileName('file<name>.txt')).toBe(
                    'filename.txt'
                )
                expect(ValidationUtils.sanitizeFileName('file:name?.txt')).toBe(
                    'filename.txt'
                )
                expect(ValidationUtils.sanitizeFileName('file"name*.txt')).toBe(
                    'filename.txt'
                )
            })

            it('should handle empty filenames', () => {
                expect(ValidationUtils.sanitizeFileName('')).toBe('untitled')
            })

            it('should handle filenames with only invalid characters', () => {
                expect(ValidationUtils.sanitizeFileName('<>:"|?*')).toBe(
                    'untitled'
                )
            })
        })

        describe('validateFilePath', () => {
            it('should validate file paths within intended directory', () => {
                expect(() =>
                    ValidationUtils.validateFilePath(
                        '/safe/path/file.txt',
                        '/safe/path'
                    )
                ).not.toThrow()
            })

            it('should reject file paths outside intended directory', () => {
                expect(() =>
                    ValidationUtils.validateFilePath(
                        '/unsafe/path/file.txt',
                        '/safe/path'
                    )
                ).toThrow(ScrapingError)
            })
        })
    })

    describe('ScrapingError', () => {
        it('should create error with message', () => {
            const error = new ScrapingError('Test error', 'TEST_CODE')
            expect(error.message).toContain('Test error')
            expect(error.name).toBe('ScrapingError')
            expect(error.code).toBe('TEST_CODE')
        })

        it('should create error with message and additional details', () => {
            const error = new ScrapingError(
                'Test error',
                'TEST_CODE',
                400,
                'http://example.com'
            )
            expect(error.message).toContain('Test error')
            expect(error.code).toBe('TEST_CODE')
            expect(error.statusCode).toBe(400)
            expect(error.url).toBe('http://example.com')
        })
    })

    describe('webScraperTool', () => {
        it('should scrape a webpage and return content', async () => {
            // The CheerioCrawler is mocked at module level
            const result = await webScraperTool.execute({
                context: { url: 'https://example.com' },
                runtimeContext: new RuntimeContext(),
                tracingContext: createMockTracingContext(),
            })

            expect(result).toHaveProperty('extractedData')
            expect(result).toHaveProperty('url')
            expect(result.url).toBe('https://example.com')
            expect(result.status).toBe('success')
            expect(mockCheerioCrawler).toHaveBeenCalled()
        })

        it('should handle scraping errors', async () => {
            await expect(
                webScraperTool.execute({
                    context: { url: 'https://example.com' },
                    runtimeContext: new RuntimeContext(),
                    tracingContext: createMockTracingContext(),
                })
            ).rejects.toThrow(ScrapingError)
        })

        it('should validate URL before scraping', async () => {
            await expect(
                webScraperTool.execute({
                    context: { url: 'invalid-url' },
                    runtimeContext: new RuntimeContext(),
                    tracingContext: createMockTracingContext(),
                })
            ).rejects.toThrow(ScrapingError)
        })
    })

    describe('htmlToMarkdownTool', () => {
        it('should convert HTML to markdown successfully', async () => {
            const result = await htmlToMarkdownTool.execute({
                context: { html: '<h1>Title</h1><p>Content</p>' },
                runtimeContext: new RuntimeContext(),
                tracingContext: createMockTracingContext(),
            })

            expect(result).toHaveProperty('markdown')
            expect(result.markdown).toContain('# Title')
            expect(result.markdown).toContain('Content')
        })

        it('should handle conversion errors', async () => {
            mockJSDOM.mockImplementationOnce(() => {
                throw new Error('Conversion failed')
            })

            await expect(
                htmlToMarkdownTool.execute({
                    context: { html: '<p>Test</p>' },
                    runtimeContext: new RuntimeContext(),
                    tracingContext: createMockTracingContext(),
                })
            ).rejects.toThrow()
        })
    })

    describe('batchWebScraperTool', () => {
        it('should scrape multiple URLs', async () => {
            const result = await batchWebScraperTool.execute({
                context: {
                    urls: ['https://example.com', 'https://example.org'],
                },
                runtimeContext: new RuntimeContext(),
                tracingContext: createMockTracingContext(),
            })

            expect(result).toHaveProperty('results')
            expect(result.results).toHaveLength(2)
            expect(result.totalProcessed).toBe(2)
            expect(result.successful).toBe(2)
            expect(result.failed).toBe(0)
        })

        it('should handle invalid URLs in batch', async () => {
            const result = await batchWebScraperTool.execute({
                context: { urls: ['https://example.com', 'invalid-url'] },
                runtimeContext: new RuntimeContext(),
                tracingContext: createMockTracingContext(),
            })

            expect(result.results).toHaveLength(1)
            expect(result.totalProcessed).toBe(1)
            expect(result.successful).toBe(1)
            expect(result.failed).toBe(1)
        })
    })

    describe('siteMapExtractorTool', () => {
        it('should extract site map from URL', async () => {
            const result = await siteMapExtractorTool.execute({
                context: { url: 'https://example.com' },
                runtimeContext: new RuntimeContext(),
                tracingContext: createMockTracingContext(),
            })

            expect(result).toHaveProperty('pages')
            expect(result.baseUrl).toBe('https://example.com')
            expect(result.totalPages).toBeGreaterThanOrEqual(1)
        })
    })

    describe('linkExtractorTool', () => {
        it('should extract links from HTML', async () => {
            const result = await linkExtractorTool.execute({
                context: { url: 'https://example.com' },
                runtimeContext: new RuntimeContext(),
                tracingContext: createMockTracingContext(),
            })

            expect(result).toHaveProperty('links')
            expect(result.summary.total).toBeGreaterThanOrEqual(2)
        })
    })

    describe('listScrapedContentTool', () => {
        it('should list scraped content files', async () => {
            mockFs.stat.mockResolvedValue({
                size: 100,
                mtime: new Date(),
                birthtime: new Date(),
                isFile: () => true,
                isDirectory: () => false,
                isBlockDevice: () => false,
                isCharacterDevice: () => false,
                isSymbolicLink: () => false,
                isFIFO: () => false,
                isSocket: () => false,
                dev: 0,
                ino: 0,
                mode: 0,
                nlink: 0,
                uid: 0,
                gid: 0,
                rdev: 0,
                blksize: 0,
                blocks: 0,
                atime: new Date(),
                ctime: new Date(),
            } as Stats)

            const result = await listScrapedContentTool.execute({
                context: {},
                runtimeContext: new RuntimeContext(),
                tracingContext: createMockTracingContext(),
            })

            expect(result).toHaveProperty('files')
            expect(result.totalFiles).toBe(2)
        })
    })

    describe('contentCleanerTool', () => {
        it('should clean HTML content', async () => {
            const result = await contentCleanerTool.execute({
                context: { html: '<script>evil</script><p>Clean content</p>' },
                runtimeContext: new RuntimeContext(),
                tracingContext: createMockTracingContext(),
            })

            expect(result).toHaveProperty('cleanedHtml')
            expect(result.reductionPercent).toBeGreaterThan(0)
        })
    })
})
