import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as zlib from 'zlib'
import { pipeline } from 'stream/promises'

// Mock external dependencies BEFORE importing the module
vi.mock('fs/promises')
vi.mock('path')
vi.mock('zlib')
vi.mock('stream/promises')
vi.mock('fs', () => ({
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
}))
vi.mock('../config/logger', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    },
}))

// Mock process.cwd BEFORE importing the module
const originalCwd = process.cwd
process.cwd = vi.fn().mockReturnValue('/home/sam/mastra-governed-rag')

// Mock path.join BEFORE importing the module
vi.mock('path', () => ({
    resolve: vi.fn(),
    join: vi.fn((...args: string[]) => {
        if (
            args[0] === '/home/sam/mastra-governed-rag' &&
            args[1] === 'docs/data'
        ) {
            return '/home/sam/mastra-governed-rag/docs/data'
        }
        return args.join('/')
    }),
    dirname: vi.fn(),
    basename: vi.fn(),
    relative: vi.fn(),
}))

// Now import the module
import {
    readDataFileTool,
    writeDataFileTool,
    deleteDataFileTool,
    listDataDirTool,
    copyDataFileTool,
    moveDataFileTool,
    searchDataFilesTool,
    getDataFileInfoTool,
    createDataDirTool,
    removeDataDirTool,
    archiveDataTool,
    backupDataTool,
} from '../data-file-manager'

const mockFs = fs as any
const mockPath = path as any
const mockZlib = zlib as any
const mockPipeline = pipeline as any

describe('Data File Manager Tools', () => {
    const mockRuntimeContext = {} as any
    const mockTracingContext = {
        currentSpan: {
            createChildSpan: vi.fn().mockReturnValue({
                end: vi.fn(),
            }),
        },
    } as any

    beforeEach(() => {
        vi.clearAllMocks()

        // Setup path mocks
        mockPath.resolve.mockImplementation((...args: string[]) => {
            // Simple resolve implementation for testing
            if (args.length === 1) {
                return args[0]
            }
            // For our test case: path.resolve('/home/sam/mastra-governed-rag/docs/data', 'testfile.txt') -> '/home/sam/mastra-governed-rag/docs/data/testfile.txt'
            if (
                args[0] === '/home/sam/mastra-governed-rag/docs/data' &&
                args[1] === 'testfile.txt'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/testfile.txt'
            }
            if (
                args[0] === '/home/sam/mastra-governed-rag/docs/data' &&
                args[1] === '../outside.txt'
            ) {
                return '/home/sam/mastra-governed-rag/outside.txt'
            }
            if (
                args[0] === '/home/sam/mastra-governed-rag/docs/data' &&
                args[1] === 'subdir/testfile.txt'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/subdir/testfile.txt'
            }
            if (
                args[0] === '/home/sam/mastra-governed-rag/docs/data' &&
                args[1] === 'testdir'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/testdir'
            }
            if (
                args[0] === '/home/sam/mastra-governed-rag/docs/data' &&
                args[1] === 'docs/data'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data'
            }
            if (
                args[0] === '/home/sam/mastra-governed-rag/docs/data' &&
                args[1] === 'source.txt'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/source.txt'
            }
            if (
                args[0] === '/home/sam/mastra-governed-rag/docs/data' &&
                args[1] === 'dest.txt'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/dest.txt'
            }
            if (
                args[0] === '/home/sam/mastra-governed-rag/docs/data' &&
                args[1] === 'subdir/dest.txt'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/subdir/dest.txt'
            }
            if (
                args[0] === '/home/sam/mastra-governed-rag/docs/data' &&
                args[1] === 'archive'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/archive'
            }
            return args.join('/')
        })
        mockPath.join.mockImplementation((...args: string[]) => {
            if (
                args[0] === '/home/sam/mastra-governed-rag' &&
                args[1] === 'docs/data'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data'
            }
            return args.join('/')
        })

        // Restore process.cwd after a delay to avoid affecting other tests
        setTimeout(() => {
            process.cwd = originalCwd
        }, 0)
        mockPath.dirname.mockImplementation((p: string) => {
            if (
                p ===
                '/home/sam/mastra-governed-rag/docs/data/subdir/testfile.txt'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/subdir'
            }
            if (
                p === '/home/sam/mastra-governed-rag/docs/data/subdir/dest.txt'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/subdir'
            }
            if (
                p ===
                '/home/sam/mastra-governed-rag/docs/data/backups/testfile.txt_2025-10-06T10-41-41-029Z'
            ) {
                return '/home/sam/mastra-governed-rag/docs/data/backups'
            }
            return '/home/sam/mastra-governed-rag/docs/data'
        })
        mockPath.basename.mockImplementation((p: string) => {
            if (p === 'source.txt') {
                return 'source.txt'
            }
            if (p === '/home/sam/mastra-governed-rag/docs/data/source.txt') {
                return 'source.txt'
            }
            return 'testfile.txt'
        })
        mockPath.relative.mockImplementation((from: string, to: string) => {
            if (from === '/home/sam/mastra-governed-rag/docs/data') {
                if (
                    to === '/home/sam/mastra-governed-rag/docs/data/test1.txt'
                ) {
                    return 'test1.txt'
                }
                if (
                    to === '/home/sam/mastra-governed-rag/docs/data/test2.txt'
                ) {
                    return 'test2.txt'
                }
                if (
                    to === '/home/sam/mastra-governed-rag/docs/data/file1.txt'
                ) {
                    return 'file1.txt'
                }
                if (
                    to ===
                    '/home/sam/mastra-governed-rag/docs/data/testfile.txt'
                ) {
                    return 'testfile.txt'
                }
            }
            return 'testfile.txt'
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('readDataFileTool', () => {
        it('should read file content successfully', async () => {
            const mockContent = 'file content'
            mockFs.realpath.mockResolvedValue(
                '/home/sam/mastra-governed-rag/docs/data/testfile.txt'
            )
            mockFs.readFile.mockResolvedValue(mockContent)

            const result = await readDataFileTool.execute({
                context: { fileName: 'testfile.txt' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toBe(mockContent)
            expect(mockFs.realpath).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/testfile.txt'
            )
            expect(mockFs.readFile).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/testfile.txt',
                'utf-8'
            )
        })

        it('should throw error for path outside data directory', async () => {
            mockFs.realpath.mockResolvedValue(
                '/home/sam/mastra-governed-rag/outside.txt'
            )

            await expect(
                readDataFileTool.execute({
                    context: { fileName: '../outside.txt' },
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Access denied')
        })

        it('should handle file read errors', async () => {
            const error = new Error('File not found')
            mockFs.realpath.mockResolvedValue(
                '/home/sam/mastra-governed-rag/docs/data/testfile.txt'
            )
            mockFs.readFile.mockRejectedValue(error)

            await expect(
                readDataFileTool.execute({
                    context: { fileName: 'testfile.txt' },
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('File not found')
        })
    })

    describe('writeDataFileTool', () => {
        it('should write file content successfully', async () => {
            mockFs.realpath.mockResolvedValue(
                '/home/sam/mastra-governed-rag/docs/data/testfile.txt'
            )
            mockFs.mkdir.mockResolvedValue(undefined)
            mockFs.writeFile.mockResolvedValue(undefined)

            const result = await writeDataFileTool.execute({
                context: { fileName: 'testfile.txt', content: 'new content' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toBe('File testfile.txt written successfully.')
            expect(mockFs.writeFile).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/testfile.txt',
                'new content',
                'utf-8'
            )
        })

        it('should create directory if it does not exist', async () => {
            mockFs.realpath.mockResolvedValue(
                '/home/sam/mastra-governed-rag/docs/data/subdir/testfile.txt'
            )
            mockFs.mkdir.mockResolvedValue(undefined)
            mockFs.writeFile.mockResolvedValue(undefined)

            await writeDataFileTool.execute({
                context: {
                    fileName: 'subdir/testfile.txt',
                    content: 'content',
                },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(mockFs.mkdir).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/subdir',
                { recursive: true }
            )
        })

        it('should throw error for invalid directory path', async () => {
            mockFs.realpath.mockResolvedValue(
                '/home/sam/mastra-governed-rag/outside/testfile.txt'
            )

            await expect(
                writeDataFileTool.execute({
                    context: { fileName: '../outside.txt', content: 'content' },
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Access denied')
        })
    })

    describe('deleteDataFileTool', () => {
        it('should delete file successfully', async () => {
            mockFs.unlink.mockResolvedValue(undefined)

            const result = await deleteDataFileTool.execute({
                context: { fileName: 'testfile.txt' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toBe('File testfile.txt deleted successfully.')
            expect(mockFs.unlink).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/testfile.txt'
            )
        })

        it('should throw error for path outside data directory', async () => {
            // Path validation happens in validateDataPath
            await expect(
                deleteDataFileTool.execute({
                    context: { fileName: '../outside.txt' },
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Access denied')
        })
    })

    describe('listDataDirTool', () => {
        it('should list directory contents successfully', async () => {
            const mockContents = ['file1.txt', 'file2.txt', 'subdir']
            mockFs.readdir.mockResolvedValue(mockContents)

            const result = await listDataDirTool.execute({
                context: { dirPath: 'testdir' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual(mockContents)
            expect(mockFs.readdir).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/testdir'
            )
        })

        it('should use default path when dirPath is not provided', async () => {
            const mockContents = ['file1.txt']
            mockFs.readdir.mockResolvedValue(mockContents)

            const result = await listDataDirTool.execute({
                context: {},
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual(mockContents)
            expect(mockFs.readdir).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data'
            )
        })
    })

    describe('copyDataFileTool', () => {
        it('should copy file successfully', async () => {
            mockFs.mkdir.mockResolvedValue(undefined)
            mockFs.copyFile.mockResolvedValue(undefined)

            const result = await copyDataFileTool.execute({
                context: { sourceFile: 'source.txt', destFile: 'dest.txt' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toBe(
                'File source.txt copied to dest.txt successfully.'
            )
            expect(mockFs.copyFile).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/source.txt',
                '/home/sam/mastra-governed-rag/docs/data/dest.txt'
            )
        })

        it('should create destination directory if needed', async () => {
            mockFs.mkdir.mockResolvedValue(undefined)
            mockFs.copyFile.mockResolvedValue(undefined)

            await copyDataFileTool.execute({
                context: {
                    sourceFile: 'source.txt',
                    destFile: 'subdir/dest.txt',
                },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(mockFs.mkdir).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/subdir',
                { recursive: true }
            )
        })
    })

    describe('moveDataFileTool', () => {
        it('should move file successfully', async () => {
            mockFs.mkdir.mockResolvedValue(undefined)
            mockFs.rename.mockResolvedValue(undefined)

            const result = await moveDataFileTool.execute({
                context: { sourceFile: 'source.txt', destFile: 'dest.txt' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toBe(
                'File source.txt moved to dest.txt successfully.'
            )
            expect(mockFs.rename).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/source.txt',
                '/home/sam/mastra-governed-rag/docs/data/dest.txt'
            )
        })
    })

    describe('searchDataFilesTool', () => {
        it('should search files by name successfully', async () => {
            const mockItems = [
                {
                    name: 'test1.txt',
                    isDirectory: () => false,
                    isFile: () => true,
                },
                {
                    name: 'test2.txt',
                    isDirectory: () => false,
                    isFile: () => true,
                },
                {
                    name: 'other.txt',
                    isDirectory: () => false,
                    isFile: () => true,
                },
            ]
            mockFs.readdir.mockResolvedValue(mockItems)

            const result = await searchDataFilesTool.execute({
                context: { pattern: 'test' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual(['test1.txt', 'test2.txt'])
        })

        it('should search file content when searchContent is true', async () => {
            const mockItems = [
                {
                    name: 'file1.txt',
                    isDirectory: () => false,
                    isFile: () => true,
                },
                {
                    name: 'file2.txt',
                    isDirectory: () => false,
                    isFile: () => true,
                },
            ]
            mockFs.readdir.mockResolvedValue(mockItems)
            mockFs.readFile
                .mockResolvedValueOnce('This contains the search term')
                .mockResolvedValueOnce('This does not contain it')

            const result = await searchDataFilesTool.execute({
                context: { pattern: 'search term', searchContent: true },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual(['file1.txt'])
        })

        it('should throw error for pattern too long', async () => {
            const longPattern = 'a'.repeat(1001)

            await expect(
                searchDataFilesTool.execute({
                    context: { pattern: longPattern },
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Pattern too long')
        })
    })

    describe('getDataFileInfoTool', () => {
        it('should get file info successfully', async () => {
            const mockStats = {
                size: 1024,
                mtime: new Date('2023-01-01T00:00:00Z'),
                birthtime: new Date('2023-01-01T00:00:00Z'),
                isFile: () => true,
                isDirectory: () => false,
            }
            mockFs.realpath.mockResolvedValue(
                '/home/sam/mastra-governed-rag/docs/data/testfile.txt'
            )
            mockFs.stat.mockResolvedValue(mockStats)

            const result = await getDataFileInfoTool.execute({
                context: { fileName: 'testfile.txt' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                size: 1024,
                modified: '2023-01-01T00:00:00.000Z',
                created: '2023-01-01T00:00:00.000Z',
                isFile: true,
                isDirectory: false,
            })
        })
    })

    describe('createDataDirTool', () => {
        it('should create directory successfully', async () => {
            mockFs.mkdir.mockResolvedValue(undefined)

            const result = await createDataDirTool.execute({
                context: { dirPath: 'newdir' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toBe('Directory newdir created successfully.')
            expect(mockFs.mkdir).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/newdir',
                { recursive: true }
            )
        })
    })

    describe('removeDataDirTool', () => {
        it('should remove empty directory successfully', async () => {
            mockFs.readdir.mockResolvedValue([])
            mockFs.rmdir.mockResolvedValue(undefined)

            const result = await removeDataDirTool.execute({
                context: { dirPath: 'emptydir' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toBe('Directory emptydir removed successfully.')
            expect(mockFs.rmdir).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/emptydir'
            )
        })

        it('should throw error for non-empty directory', async () => {
            mockFs.readdir.mockResolvedValue(['file.txt'])

            await expect(
                removeDataDirTool.execute({
                    context: { dirPath: 'nonemptydir' },
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Directory nonemptydir is not empty.')
        })
    })

    describe('archiveDataTool', () => {
        it('should archive file successfully', async () => {
            const mockGzip = { pipe: vi.fn() }
            const mockSourceStream = { pipe: vi.fn() }
            const mockArchiveStream = {}

            mockZlib.createGzip.mockReturnValue(mockGzip)
            mockPipeline.mockResolvedValue(undefined)

            // Mock fs imports
            const mockCreateReadStream = vi
                .fn()
                .mockReturnValue(mockSourceStream)
            const mockCreateWriteStream = vi
                .fn()
                .mockReturnValue(mockArchiveStream)

            vi.doMock('fs', () => ({
                createReadStream: mockCreateReadStream,
                createWriteStream: mockCreateWriteStream,
            }))

            mockFs.mkdir.mockResolvedValue(undefined)

            const result = await archiveDataTool.execute({
                context: { sourcePath: 'source.txt', archiveName: 'archive' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toBe(
                'File source.txt archived to archive.gz successfully.'
            )
            expect(mockPipeline).toHaveBeenCalled()
        })
    })

    describe('backupDataTool', () => {
        it('should create backup successfully', async () => {
            mockFs.mkdir.mockResolvedValue(undefined)
            mockFs.cp.mockResolvedValue(undefined)

            const result = await backupDataTool.execute({
                context: { sourcePath: 'source.txt' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toContain('Backup created: source.txt →')
            expect(mockFs.cp).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/source.txt',
                expect.stringContaining('source.txt_'),
                { recursive: true }
            )
        })

        it('should use custom backup directory', async () => {
            mockFs.mkdir.mockResolvedValue(undefined)
            mockFs.cp.mockResolvedValue(undefined)

            await backupDataTool.execute({
                context: { sourcePath: 'source.txt', backupDir: 'mybackups' },
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(mockFs.cp).toHaveBeenCalledWith(
                '/home/sam/mastra-governed-rag/docs/data/source.txt',
                expect.stringContaining('mybackups/'),
                { recursive: true }
            )
        })
    })
})
