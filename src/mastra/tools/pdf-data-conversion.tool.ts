// Kilocode: Tool Approval
// owner: team-data
// justification: PDF parsing and markdown conversion for RAG indexing
// allowedDomains: []
// allowedDataPaths:
//  - corpus/
// sideEffects:
//  - network: false
//  - write: false
//  - sideload: pdf-parse (dynamic import required)
// inputSchema: src/mastra/schemas/tool-schemas.ts::PdfConversionInput
// outputSchema: src/mastra/schemas/tool-schemas.ts::PdfConversionOutput
// approvedBy: sam
// approvalDate: 10/18

import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { AISpanType } from '@mastra/core/ai-tracing'
import { marked } from 'marked'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import {
	logStepStart,
	logStepEnd,
	logError,
	logToolExecution,
} from '../config/logger'

// Lazy-loaded pdf-parse to avoid demo parsing errors
let pdfParse: unknown = null
let pdfParseError: Error | null = null

type PdfParseFunction = (buffer: Buffer, options?: { max?: number; version?: string }) => Promise<{
	text: string;
	numpages: number;
	metadata?: unknown;
	info?: unknown;
	producedBy?: string;
	creationDate?: unknown;
	modificationDate?: unknown;
}>;

/**
 * Safely load pdf-parse with error handling
 * Must be called at runtime, not at module load time
 */
async function getPdfParseModule(): Promise<PdfParseFunction> {
	if (pdfParse !== null) {
		return pdfParse as PdfParseFunction
	}
	if (pdfParseError) {
		throw pdfParseError
	}

	try {
		// Dynamic import to avoid parsing demo content on import
		// NOTE: Avoid importing internal paths like 'pdf-parse/lib/pdf-parse.js' which may not exist
		// Use eval to move import outside TypeScript compiler scope
		const pdfMod = await eval('import("pdf-parse")');
		pdfParse = pdfMod.default;
		return pdfParse as PdfParseFunction;
	} catch (error) {
		const err =
			error instanceof Error
				? error
				: new Error('Failed to load pdf-parse module')
		pdfParseError = err
		throw new Error(
			'pdf-parse module not available. Install with: npm install pdf-parse'
		)
	}
}

// Type definitions
export interface PdfContent {
	text: string
	numpages: number
	metadata?: Record<string, string | number | boolean>
	producedBy?: string
	creationDate?: Date
	modificationDate?: Date
	title?: string
	author?: string
	subject?: string
	keywords?: string
}

export interface MarkdownConversionResult {
	markdown: string
	frontmatter: Record<string, string | number | boolean | string[]>
	lineCount: number
	headingCount: number
	codeBlockCount: number
	linkCount: number
}

export interface TableExtractionResult {
	tableCount: number
	tables: Array<{
		index: number
		rows: string[][]
		markdown: string
	}>
}

export interface ImageExtractionResult {
	imageCount: number
	images: Array<{
		index: number
		type: string
		size?: number
	}>
}

// ============================================================================
// SUB-TOOLS (Helper Functions for Composable Processing)
// ============================================================================

/**
 * Sub-tool: Extract raw text from PDF buffer
 * Handles multi-page PDFs and complex content
 */
async function extractPdfText(
	pdfBuffer: Buffer,
	options: {
		maxPages?: number
		skipImages?: boolean
	} = {}
): Promise<PdfContent> {
	const MAX_PAGES_DEFAULT = 1000
	const maxPages = options.maxPages ?? MAX_PAGES_DEFAULT

	try {
		const pdfModule = await getPdfParseModule()
		// pdfModule may be a function (default export) – call as any
		const data = await (pdfModule)(pdfBuffer, {
			max: maxPages,
			version: 'v2.0.550',
		})
		const pdfData = data as {
			text: string;
			numpages: number;
			metadata?: { getAll?: () => unknown };
			info?: unknown;
			producedBy?: string;
			creationDate?: unknown;
			modificationDate?: unknown;
		};

		logStepStart('pdf-text-extraction', {
			pages: data.numpages,
			textLength: data.text?.length ?? 0,
		})

		// Robust metadata extraction: prefer metadata.getAll() when available, otherwise fallback to data.info
		const rawMeta =
			pdfData?.metadata && typeof pdfData.metadata.getAll === 'function'
				? pdfData.metadata.getAll()
				: pdfData?.info ?? {}

		return {
			text: data.text ?? '',
			numpages: data.numpages ?? 1,
			metadata: rawMeta as Record<string, string | number | boolean>,
			producedBy: data.producedBy ?? (rawMeta as Record<string, unknown>)?.Producer as string,
			creationDate: (data.creationDate as Date | undefined) ?? (rawMeta as Record<string, unknown>)?.CreationDate as Date,
			modificationDate: (data.modificationDate as Date | undefined) ?? (rawMeta as Record<string, unknown>)?.ModDate as Date,
			title: (rawMeta as Record<string, unknown>)?.Title as string ?? (rawMeta as Record<string, unknown>)?.title as string,
			author: (rawMeta as Record<string, unknown>)?.Author as string ?? (rawMeta as Record<string, unknown>)?.author as string,
			subject: (rawMeta as Record<string, unknown>)?.Subject as string ?? (rawMeta as Record<string, unknown>)?.subject as string,
			keywords: (rawMeta as Record<string, unknown>)?.Keywords as string ?? (rawMeta as Record<string, unknown>)?.keywords as string,
		}
	} catch (error) {
		logError('pdf-text-extraction', error, {
			bufferSize: pdfBuffer.length,
		})
		throw error
	}
}

/**
 * Sub-tool: Extract and structure PDF metadata
 * Returns document information useful for markdown frontmatter
 */
async function extractPdfMetadata(pdfContent: PdfContent): Promise<{
	title: string
	author: string
	subject: string
	keywords: string[]
	pageCount: number
	extractedAt: string
	contentPreview: string
}> {
	const metadata = {
		title: pdfContent.title ?? 'Untitled Document',
		author: pdfContent.author ?? 'Unknown Author',
		subject: pdfContent.subject ?? '',
		keywords: (pdfContent.keywords ?? '')
			.split(',')
			.map((k: string) => k.trim())
			.filter((k: string) => k.length > 0),
		pageCount: pdfContent.numpages,
		extractedAt: new Date().toISOString(),
		contentPreview: pdfContent.text.substring(0, 200).trim(),
	}

	logStepStart('pdf-metadata-extraction', metadata)
	return metadata
}

/**
 * Sub-tool: Normalize and clean PDF text
 * Removes artifacts and improves markdown conversion
 */
function normalizePdfText(rawText: string): string {
	return (
		rawText
			// Remove excessive whitespace while preserving structure
			.replace(/\f/g, '\n\n') // Form feeds to double newlines
			.replace(/\r\n/g, '\n') // Normalize line endings
			.replace(/\n\n\n+/g, '\n\n') // Multiple newlines to double
			.replace(/\t/g, '  ') // Tabs to spaces
			// Remove common PDF artifacts
			.replace(/©\s*/g, '© ')
			.replace(/®\s*/g, '® ')
			// Clean up hyphenated words (often broken across pages)
			.replace(/(\w+)-\n(\w+)/g, '$1$2')
			// Improve spacing around punctuation
			.replace(/\s+([.,!?;:])/g, '$1')
			.trim()
	)
}

/**
 * Sub-tool: Convert normalized text to markdown format
 * Applies markdown formatting and structure
 */
function convertToMarkdown(normalizedText: string): MarkdownConversionResult {
	let markdown = normalizedText

	// Apply heading detection (heuristic: all-caps lines, short lines after newlines)
	const lines = markdown.split('\n')
	const processedLines: string[] = []

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		const trimmed = line.trim()

		// Skip empty lines but preserve structure
		if (trimmed.length === 0) {
			processedLines.push('')
			continue
		}

		// Detect potential headings
		const prevLine = i > 0 ? lines[i - 1]?.trim() : ''
		const isLikelyHeading =
			(trimmed.length < 80 && trimmed === trimmed.toUpperCase()) ||
			(trimmed.length < 60 &&
				prevLine.length === 0 &&
				/^[A-Z]/.test(trimmed) &&
				trimmed.split(' ').length <= 5)

		if (isLikelyHeading && i > 0) {
			// Convert to markdown heading based on position heuristic
			const headingLevel = trimmed.length > 60 ? 3 : 2
			processedLines.push(`${'#'.repeat(headingLevel)} ${trimmed}`)
		} else {
			processedLines.push(line)
		}
	}

	markdown = processedLines.join('\n')

	// Count markdown elements
	const headingCount = (markdown.match(/^#+\s/gm) ?? []).length
	const codeBlockCount = (markdown.match(/```/g) ?? []).length / 2
	const linkCount = (markdown.match(/\[.*?\]\(.*?\)/g) ?? []).length
	const lineCount = markdown.split('\n').length

	logStepStart('markdown-conversion', {
		lineCount,
		headingCount,
		codeBlockCount,
		linkCount,
	})

	return {
		markdown,
		frontmatter: {
			format: 'markdown',
			convertedAt: new Date().toISOString(),
			source: 'pdf',
		},
		lineCount,
		headingCount,
		codeBlockCount,
		linkCount,
	}
}

/**
 * Sub-tool: Extract tables from text using heuristics
 * Detects tabular data and converts to markdown table format
 */
function extractTables(text: string): TableExtractionResult {
	const tables: TableExtractionResult['tables'] = []
	const lines = text.split('\n')

	// Simple heuristic: sequences of lines with consistent column separators
	let tableLines: string[] = []
	let tableStart = -1

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		const columnCount = (line.match(/\t/g) ?? []).length

		if (columnCount >= 2) {
			if (tableStart === -1) {
				tableStart = i
			}
			tableLines.push(line)
		} else {
			if (tableLines.length > 0) {
				// End of table detected
				const rows = tableLines.map((l) =>
					l.split('\t').map((cell) => cell.trim())
				)
				const markdown = convertTableToMarkdown(rows)
				tables.push({
					index: tables.length,
					rows,
					markdown,
				})
				tableLines = []
				tableStart = -1
			}
		}
	}

	// Handle final table if exists
	if (tableLines.length > 0) {
		const rows = tableLines.map((l) =>
			l.split('\t').map((cell) => cell.trim())
		)
		const markdown = convertTableToMarkdown(rows)
		tables.push({
			index: tables.length,
			rows,
			markdown,
		})
	}

	logStepStart('table-extraction', { tableCount: tables.length })

	return {
		tableCount: tables.length,
		tables,
	}
}

/**
 * Helper: Convert table rows to markdown format
 */
function convertTableToMarkdown(rows: string[][]): string {
	if (rows.length === 0) {return ''}

	const lines: string[] = []

	// Header row
	lines.push('| ' + rows[0].join(' | ') + ' |')

	// Separator row
	lines.push('| ' + rows[0].map(() => '---').join(' | ') + ' |')

	// Data rows
	for (let i = 1; i < rows.length; i++) {
		lines.push('| ' + rows[i].join(' | ') + ' |')
	}

	return lines.join('\n')
}

/**
 * Sub-tool: Extract image references
 * Detects and counts images in PDF
 */
function extractImageReferences(pdfBuffer: Buffer): ImageExtractionResult {
	// Simple heuristic: PDF structure analysis
	const bufferString = pdfBuffer.toString('latin1')

	// Count image objects in PDF structure
	const imageCount = (bufferString.match(/\/XObject/g) ?? []).length

	logStepStart('image-extraction', { imageCount })

	return {
		imageCount,
		images: Array.from({ length: imageCount }, (_, i) => ({
			index: i,
			type: 'embedded',
			size: undefined,
		})),
	}
}

// ============================================================================
// MAIN TOOL: PDF to Markdown Conversion
// ============================================================================

/**
 * Input schema for PDF to Markdown conversion
 */
const PdfToMarkdownInputSchema = z.object({
	pdfPath: z
		.string()
		.describe('File path to the PDF file (relative or absolute)'),
	maxPages: z
		.number()
		.optional()
		.default(1000)
		.describe('Maximum number of pages to extract'),
	includeMetadata: z
		.boolean()
		.optional()
		.default(true)
		.describe('Include metadata in frontmatter'),
	includeTables: z
		.boolean()
		.optional()
		.default(true)
		.describe('Extract and format tables'),
	includeImages: z
		.boolean()
		.optional()
		.default(false)
		.describe('Track image references'),
	outputFormat: z
		.enum(['markdown', 'json', 'html'])
		.optional()
		.default('markdown')
		.describe('Output format (markdown, json, or html)'),
	normalizeText: z
		.boolean()
		.optional()
		.default(true)
		.describe('Apply text normalization and cleanup'),
})

/**
 * Output schema for PDF to Markdown conversion
 */
const PdfToMarkdownOutputSchema = z.object({
	success: z.boolean(),
	format: z.string(),
	content: z.string(),
	// Fix: z.record requires a key and value schema in this Zod version
	metadata: z.record(z.string(), z.unknown()).optional(),
	statistics: z.object({
		pageCount: z.number(),
		lineCount: z.number(),
		headingCount: z.number(),
		codeBlockCount: z.number(),
		linkCount: z.number(),
		tableCount: z.number(),
		imageCount: z.number(),
		processingTimeMs: z.number(),
	}),
	warnings: z.array(z.string()).optional(),
	error: z.string().optional(),
})

export const pdfToMarkdownTool = createTool({
	id: 'pdf-to-markdown',
	description: `
PDF to Markdown Data Conversion Tool

Convert PDF files to structured markdown format with comprehensive feature extraction:

Features:
- ✅ Sideloaded PDF parsing (avoids demo content parsing errors)
- 📝 Text extraction from multi-page PDFs
- 📊 Automatic table detection and markdown formatting
- 🖼️ Image reference tracking
- 🏷️ Metadata extraction (title, author, subject, keywords)
- 🔤 Text normalization and artifact removal
- 📈 Heading and structure detection
- ⚙️ Performance monitoring with AI tracing
- 🛡️ Comprehensive error handling

Sub-tools included:
- extractPdfText: Raw text extraction
- extractPdfMetadata: Document metadata
- normalizePdfText: Text cleanup
- convertToMarkdown: Format conversion
- extractTables: Table detection
- extractImageReferences: Image counting

Perfect for RAG indexing, documentation conversion, and content processing.
  `,
	inputSchema: PdfToMarkdownInputSchema,
	outputSchema: PdfToMarkdownOutputSchema,
	execute: async ({ context, tracingContext }) => {
		const startTime = Date.now()
		logToolExecution('pdf-to-markdown', { input: context })

		// Create root tracing span
		const rootSpan = tracingContext?.currentSpan?.createChildSpan({
			type: AISpanType.LLM_CHUNK,
			name: 'pdf-to-markdown-tool',
			input: {
				pdfPath: context.pdfPath,
				maxPages: context.maxPages,
				normalization: context.normalizeText,
			},
		})

		const warnings: string[] = []

		try {
			// Validate file path
			const absolutePath = path.isAbsolute(context.pdfPath)
				? context.pdfPath
				: path.resolve(process.cwd(), context.pdfPath)

			logStepStart('pdf-file-validation', { path: absolutePath })

			// Check file exists and is readable
			const fileStats = await fs.stat(absolutePath)
			if (!fileStats.isFile()) {
				throw new Error(`Path is not a file: ${absolutePath}`)
			}

			if (!absolutePath.toLowerCase().endsWith('.pdf')) {
				warnings.push('File does not have .pdf extension')
			}

			// Size check (warn if > 50MB)
			const sizeMB = fileStats.size / (1024 * 1024)
			if (sizeMB > 50) {
				warnings.push(
					`Large PDF detected (${sizeMB.toFixed(2)}MB) - processing may be slow`
				)
			}

			// Read PDF file
			const readSpan = rootSpan?.createChildSpan({
				type: AISpanType.TOOL_CALL,
				name: 'read-pdf-file',
				input: { filePath: absolutePath, sizeBytes: fileStats.size },
			})

			const readStart = Date.now()
			const pdfBuffer = await fs.readFile(absolutePath)
			const readDuration = Date.now() - readStart

			readSpan?.end({ output: { bytesRead: pdfBuffer.length } })

			// Provide size and read duration to match logger signature (name, payload, durationMs)
			logStepEnd('pdf-file-read', { size: pdfBuffer.length }, readDuration)

			// Extract text using sideloaded pdf-parse
			const extractSpan = rootSpan?.createChildSpan({
				type: AISpanType.TOOL_CALL,
				name: 'extract-pdf-text',
				input: { maxPages: context.maxPages },
			})

			const pdfContent = await extractPdfText(pdfBuffer, {
				maxPages: context.maxPages,
			})
			extractSpan?.end({
				output: { pages: pdfContent.numpages, textLength: pdfContent.text.length },
			})

			// Extract metadata
			const metadataSpan = rootSpan?.createChildSpan({
				type: AISpanType.TOOL_CALL,
				name: 'extract-metadata',
			})

			const metadata = await extractPdfMetadata(pdfContent)
			metadataSpan?.end({ output: metadata })

			// Normalize text if requested
			let processedText = pdfContent.text
			if (context.normalizeText) {
				const normalizeSpan = rootSpan?.createChildSpan({
					type: AISpanType.TOOL_CALL,
					name: 'normalize-text',
					input: { textLength: processedText.length },
				})

				processedText = normalizePdfText(processedText)
				normalizeSpan?.end({
					output: { normalizedLength: processedText.length },
				})
			}

			// Convert to markdown
			const markdownSpan = rootSpan?.createChildSpan({
				type: AISpanType.TOOL_CALL,
				name: 'convert-to-markdown',
			})

			const markdownResult = convertToMarkdown(processedText)
			markdownSpan?.end({
				output: {
					lines: markdownResult.lineCount,
					headings: markdownResult.headingCount,
				},
			})

			// Extract tables if requested
			let tableResult: TableExtractionResult = { tableCount: 0, tables: [] }
			if (context.includeTables) {
				const tableSpan = rootSpan?.createChildSpan({
					type: AISpanType.TOOL_CALL,
					name: 'extract-tables',
				})

				tableResult = extractTables(processedText)
				tableSpan?.end({ output: { tableCount: tableResult.tableCount } })
			}

			// Extract images if requested
			let imageResult: ImageExtractionResult = { imageCount: 0, images: [] }
			if (context.includeImages) {
				const imageSpan = rootSpan?.createChildSpan({
					type: AISpanType.TOOL_CALL,
					name: 'extract-images',
				})

				imageResult = extractImageReferences(pdfBuffer)
				imageSpan?.end({ output: { imageCount: imageResult.imageCount } })
			}

			// Build final content based on format
			let finalContent = ''
			const outputMetadata: Record<string, unknown> = {}

			if (context.includeMetadata) {
				// Add YAML frontmatter
				const frontmatter = {
					title: metadata.title,
					author: metadata.author,
					subject: metadata.subject,
					keywords: metadata.keywords,
					pages: metadata.pageCount,
					source: 'pdf',
					extractedAt: metadata.extractedAt,
				}

				outputMetadata['metadata'] = metadata
				outputMetadata['frontmatter'] = frontmatter

				if (context.outputFormat === 'markdown') {
					finalContent = `---\n${Object.entries(frontmatter)
						.map(
							([k, v]) =>
								`${k}: ${typeof v === 'string' ? `"${v}"` : JSON.stringify(v)}`
						)
						.join('\n')}\n---\n\n`
				}
			}

			// Add main content based on format
			switch (context.outputFormat) {
				case 'html': {
					// Convert markdown to HTML using marked
					finalContent += await marked(markdownResult.markdown)
					break
				}
				case 'json': {
					finalContent = JSON.stringify(
						{
							format: 'json',
							metadata: outputMetadata,
							content: markdownResult.markdown,
							statistics: {
								pageCount: pdfContent.numpages,
								lineCount: markdownResult.lineCount,
								headingCount: markdownResult.headingCount,
								codeBlockCount: markdownResult.codeBlockCount,
								linkCount: markdownResult.linkCount,
								tableCount: tableResult.tableCount,
								imageCount: imageResult.imageCount,
							},
						},
						null,
						2
					)
					break
				}
				case 'markdown':
				default: {
					finalContent += markdownResult.markdown

					// Append table section if found
					if (tableResult.tableCount > 0) {
						finalContent += '\n\n## Tables\n\n'
						tableResult.tables.forEach((table) => {
							finalContent += `### Table ${table.index + 1}\n\n${table.markdown}\n\n`
						})
					}

					// Append images section if found
					if (imageResult.imageCount > 0) {
						finalContent += `\n\n## Images\n\nThis document contains ${imageResult.imageCount} embedded image(s).\n`
					}
					break
				}
			}

			const totalProcessingTime = Date.now() - startTime

			const output = {
				success: true,
				format: context.outputFormat,
				content: finalContent,
				metadata: context.includeMetadata ? outputMetadata : undefined,
				statistics: {
					pageCount: pdfContent.numpages,
					lineCount: markdownResult.lineCount,
					headingCount: markdownResult.headingCount,
					codeBlockCount: markdownResult.codeBlockCount,
					linkCount: markdownResult.linkCount,
					tableCount: tableResult.tableCount,
					imageCount: imageResult.imageCount,
					processingTimeMs: totalProcessingTime,
				},
				warnings: warnings.length > 0 ? warnings : undefined,
			}

			logStepEnd('pdf-to-markdown', output, totalProcessingTime)

			// End root tracing span
			rootSpan?.end({
				output: {
					success: true,
					pages: pdfContent.numpages,
					lines: markdownResult.lineCount,
					format: context.outputFormat,
					processingTimeMs: totalProcessingTime,
				},
			})

			return output
		} catch (error) {
			const processingTime = Date.now() - startTime
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error occurred'

			logError('pdf-to-markdown', error, {
				context,
				processingTimeMs: processingTime,
			})

			// Record error in tracing span
			rootSpan?.error({
				error: error instanceof Error ? error : new Error(errorMessage),
				metadata: {
					operation: 'pdf-to-markdown',
					pdfPath: context.pdfPath,
					processingTimeMs: processingTime,
				},
			})

			return {
				success: false,
				format: context.outputFormat || 'markdown',
				content: '',
				statistics: {
					pageCount: 0,
					lineCount: 0,
					headingCount: 0,
					codeBlockCount: 0,
					linkCount: 0,
					tableCount: 0,
					imageCount: 0,
					processingTimeMs: processingTime,
				},
				warnings:
					warnings.length > 0 ? [...warnings, errorMessage] : [errorMessage],
				error: errorMessage,
			}
		}
	},
})

// ============================================================================
// EXPORTS FOR SUB-TOOL TESTING AND COMPOSITION
// ============================================================================

export {
	extractPdfText,
	extractPdfMetadata,
	normalizePdfText,
	convertToMarkdown,
	extractTables,
	extractImageReferences,
	convertTableToMarkdown,
	getPdfParseModule,
}
