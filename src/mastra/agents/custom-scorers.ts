import { createScorer } from '@mastra/core/scores'
import { googleAIFlashLite } from '../config/google'
import { z } from 'zod'

// Source Diversity Scorer - evaluates if sources come from different domains
export const sourceDiversityScorer = createScorer({
    name: 'Source Diversity',
    description: 'Evaluates if research sources come from diverse domains and avoid single-source bias',
    judge: {
        model: googleAIFlashLite,
        instructions: 'You are an expert research evaluator focused on source credibility and diversity.'
    }
})
.preprocess(({ run }) => {
    // Extract sources from the research output
    const output = run.output
    let sources: string[] = []

    if (typeof output === 'string') {
        try {
            const parsed = JSON.parse(output)
            sources = parsed.sources?.map((s: any) => s.url) || []
        } catch {
            // If not JSON, look for sources in text
            const urlRegex = /https?:\/\/[^\s]+/g
            sources = output.match(urlRegex) || []
        }
    } else if (output && typeof output === 'object' && 'sources' in output) {
        sources = output.sources?.map((s: any) => s.url) || []
    }

    return { sources }
})
.analyze(({ results }) => {
    const { sources } = results.preprocessStepResult

    if (sources.length === 0) {
        return {
            diversityScore: 0,
            uniqueDomains: 0,
            totalSources: 0,
            domainBreakdown: {},
            issues: ['No sources found']
        }
    }

    // Extract domains from URLs
    const domains = sources.map((url: string) => {
        try {
            const urlObj = new URL(url)
            return urlObj.hostname.replace('www.', '')
        } catch {
            return 'invalid'
        }
    }).filter(d => d !== 'invalid')

    const uniqueDomains = new Set(domains)
    const domainBreakdown: Record<string, number> = {}

    domains.forEach(domain => {
        domainBreakdown[domain] = (domainBreakdown[domain] || 0) + 1
    })

    // Calculate diversity score based on unique domains vs total sources
    const diversityScore = Math.min(uniqueDomains.size / Math.max(sources.length * 0.5, 1), 1)

    const issues: string[] = []
    if (uniqueDomains.size < 2) issues.push('Limited domain diversity - mostly single source')
    if (sources.length < 3) issues.push('Insufficient number of sources')
    if (Object.values(domainBreakdown).some(count => count > sources.length * 0.6)) {
        issues.push('Heavy reliance on single domain')
    }

    return {
        diversityScore,
        uniqueDomains: uniqueDomains.size,
        totalSources: sources.length,
        domainBreakdown,
        issues
    }
})
.generateScore(({ results }) => {
    return results.analyzeStepResult.diversityScore
})
.generateReason(({ results, score }) => {
    const { uniqueDomains, totalSources, domainBreakdown, issues } = results.analyzeStepResult

    let reason = `Source diversity score: ${(score * 100).toFixed(1)}%. `
    reason += `Found ${uniqueDomains} unique domains across ${totalSources} sources.`

    if (issues.length > 0) {
        reason += ` Issues: ${issues.join(', ')}.`
    } else {
        reason += ' Good source diversity achieved.'
    }

    return reason
})

// Research Completeness Scorer - evaluates if research covers multiple aspects
export const researchCompletenessScorer = createScorer({
    name: 'Research Completeness',
    description: 'Evaluates if the research comprehensively covers the topic from multiple angles',
    judge: {
        model: googleAIFlashLite,
        instructions: 'You are an expert research evaluator focused on completeness and depth of analysis.'
    }
})
.preprocess(({ run }) => {
    const output = run.output
    let learnings: any[] = []
    let summary = ''
    let data = ''

    if (typeof output === 'string') {
        try {
            const parsed = JSON.parse(output)
            learnings = parsed.learnings || []
            summary = parsed.summary || ''
            data = parsed.data || ''
        } catch {
            // Extract from text if not JSON
            summary = output
        }
    } else if (output && typeof output === 'object') {
        learnings = output.learnings || []
        summary = output.summary || ''
        data = output.data || ''
    }

    return { learnings, summary, data }
})
.analyze(({ results }) => {
    const { learnings, summary, data } = results.preprocessStepResult

    const totalContent = `${summary} ${data}`.toLowerCase()
    const learningCount = learnings.length

    // Analyze different aspects of research coverage
    const aspects = {
        hasMultiplePerspectives: /different|various|alternative|compared|versus|however|but|although/i.test(totalContent),
        hasDepth: learningCount > 3 || totalContent.length > 500,
        hasExamples: /example|instance|case|such as|for example/i.test(totalContent),
        hasContext: /background|context|history|overview|introduction/i.test(totalContent),
        hasAnalysis: /because|therefore|thus|consequently|as a result|due to/i.test(totalContent),
        hasFollowUp: learnings.some((l: any) => l.followUp && l.followUp.trim().length > 0)
    }

    const aspectsCovered = Object.values(aspects).filter(Boolean).length
    const totalAspects = Object.keys(aspects).length
    const completenessScore = aspectsCovered / totalAspects

    const strengths: string[] = []
    const weaknesses: string[] = []

    if (aspects.hasMultiplePerspectives) strengths.push('Multiple perspectives')
    else weaknesses.push('Single perspective only')

    if (aspects.hasDepth) strengths.push('Good depth')
    else weaknesses.push('Lacks depth')

    if (aspects.hasExamples) strengths.push('Includes examples')
    else weaknesses.push('Missing examples')

    if (aspects.hasContext) strengths.push('Provides context')
    else weaknesses.push('Lacks context')

    if (aspects.hasAnalysis) strengths.push('Includes analysis')
    else weaknesses.push('Missing analysis')

    if (aspects.hasFollowUp) strengths.push('Has follow-up questions')
    else weaknesses.push('No follow-up exploration')

    return {
        completenessScore,
        aspectsCovered,
        totalAspects,
        learningCount,
        contentLength: totalContent.length,
        strengths,
        weaknesses,
        aspects
    }
})
.generateScore(({ results }) => {
    return results.analyzeStepResult.completenessScore
})
.generateReason(({ results, score }) => {
    const { aspectsCovered, totalAspects, learningCount, strengths, weaknesses } = results.analyzeStepResult

    let reason = `Research completeness score: ${(score * 100).toFixed(1)}%. `
    reason += `Covered ${aspectsCovered}/${totalAspects} research aspects.`

    if (strengths.length > 0) {
        reason += ` Strengths: ${strengths.join(', ')}.`
    }

    if (weaknesses.length > 0) {
        reason += ` Areas for improvement: ${weaknesses.join(', ')}.`
    }

    return reason
})

// Summary Quality Scorer - evaluates if summary adequately captures key findings
export const summaryQualityScorer = createScorer({
    name: 'Summary Quality',
    description: 'Evaluates if the research summary adequately captures key findings and insights',
    judge: {
        model: googleAIFlashLite,
        instructions: 'You are an expert evaluator of research summaries and executive summaries.'
    }
})
.preprocess(({ run }) => {
    const output = run.output
    let summary = ''
    let learnings: any[] = []
    let data = ''

    if (typeof output === 'string') {
        try {
            const parsed = JSON.parse(output)
            summary = parsed.summary || ''
            learnings = parsed.learnings || []
            data = parsed.data || ''
        } catch {
            summary = output
        }
    } else if (output && typeof output === 'object') {
        summary = output.summary || ''
        learnings = output.learnings || []
        data = output.data || ''
    }

    return { summary, learnings, data }
})
.analyze(({ results }) => {
    const { summary, learnings, data } = results.preprocessStepResult

    if (!summary || summary.trim().length === 0) {
        return {
            qualityScore: 0,
            summaryLength: 0,
            keyInsights: 0,
            totalLearnings: 0,
            insightCoverage: 0,
            issues: ['No summary provided']
        }
    }

    const summaryLower = summary.toLowerCase()
    const dataLower = data.toLowerCase()

    // Check if summary captures key learnings
    const keyInsights = learnings.filter((learning: any) => {
        const insight = (learning.insight || '').toLowerCase()
        return insight.length > 10 && summaryLower.includes(insight.slice(0, 20))
    }).length

    const insightCoverage = learnings.length > 0 ? keyInsights / learnings.length : 0

    // Evaluate summary characteristics
    const characteristics = {
        concise: summary.length < 300, // Reasonable length
        comprehensive: insightCoverage > 0.5,
        clear: !/^(the|a|an|it|this|that|these|those)\s/i.test(summary), // Doesn't start with articles
        actionable: /recommend|conclude|suggest|find|discover/i.test(summaryLower),
        structured: summary.includes('\n') || /[•\-*]/.test(summary) || /\d+\./.test(summary)
    }

    const characteristicsMet = Object.values(characteristics).filter(Boolean).length
    const totalCharacteristics = Object.keys(characteristics).length

    let qualityScore = (insightCoverage * 0.6) + (characteristicsMet / totalCharacteristics * 0.4)

    const issues: string[] = []
    if (summary.length > 500) issues.push('Too verbose')
    if (summary.length < 50) issues.push('Too brief')
    if (insightCoverage < 0.3) issues.push('Missing key insights')
    if (!characteristics.clear) issues.push('Unclear or poorly structured')

    return {
        qualityScore,
        summaryLength: summary.length,
        keyInsights,
        totalLearnings: learnings.length,
        insightCoverage,
        characteristics,
        issues
    }
})
.generateScore(({ results }) => {
    return results.analyzeStepResult.qualityScore
})
.generateReason(({ results, score }) => {
    const { summaryLength, keyInsights, totalLearnings, insightCoverage, issues } = results.analyzeStepResult

    let reason = `Summary quality score: ${(score * 100).toFixed(1)}%. `
    reason += `Summary length: ${summaryLength} chars. `
    reason += `Captured ${keyInsights}/${totalLearnings} key insights (${(insightCoverage * 100).toFixed(1)}% coverage).`

    if (issues.length > 0) {
        reason += ` Issues: ${issues.join(', ')}.`
    } else {
        reason += ' Well-structured summary with good insight coverage.'
    }

    return reason
})

// Task Completion Scorer - evaluates if agent completed assigned tasks
export const taskCompletionScorer = createScorer({
    name: 'Task Completion',
    description: 'Evaluates if the agent successfully completed its assigned tasks and objectives',
    judge: {
        model: googleAIFlashLite,
        instructions: 'You are an expert evaluator of task completion and goal achievement.'
    }
})
.preprocess(({ run }) => {
    const output = run.output
    const input = run.input

    let outputText = ''
    let inputText = ''

    if (typeof output === 'string') {
        outputText = output
    } else if (output && typeof output === 'object') {
        outputText = JSON.stringify(output)
    }

    if (Array.isArray(input)) {
        inputText = input.map(msg => msg.content).join(' ')
    } else if (typeof input === 'string') {
        inputText = input
    }

    return { outputText, inputText }
})
.analyze(({ results }) => {
    const { outputText, inputText } = results.preprocessStepResult

    // Check for task completion indicators
    const completionIndicators = {
        hasActionableOutput: outputText.length > 50,
        addressesInput: inputText.length > 0 && outputText.toLowerCase().includes(inputText.toLowerCase().slice(0, 20)),
        hasStructuredResponse: /\n|•|-|\d+\./.test(outputText),
        providesValue: !/^(sorry|i can't|unable to|error)/i.test(outputText.trim()),
        isComprehensive: outputText.split(' ').length > 20
    }

    const indicatorsMet = Object.values(completionIndicators).filter(Boolean).length
    const totalIndicators = Object.keys(completionIndicators).length
    const completionScore = indicatorsMet / totalIndicators

    const strengths: string[] = []
    const weaknesses: string[] = []

    if (completionIndicators.hasActionableOutput) strengths.push('Provides substantial output')
    else weaknesses.push('Output too brief or empty')

    if (completionIndicators.addressesInput) strengths.push('Addresses user input')
    else weaknesses.push('Does not address user request')

    if (completionIndicators.hasStructuredResponse) strengths.push('Well-structured response')
    else weaknesses.push('Unstructured response')

    if (completionIndicators.providesValue) strengths.push('Provides value')
    else weaknesses.push('Does not provide useful information')

    if (completionIndicators.isComprehensive) strengths.push('Comprehensive response')
    else weaknesses.push('Response lacks depth')

    return {
        completionScore,
        indicatorsMet,
        totalIndicators,
        outputLength: outputText.length,
        wordCount: outputText.split(' ').length,
        strengths,
        weaknesses,
        completionIndicators
    }
})
.generateScore(({ results }) => {
    return results.analyzeStepResult.completionScore
})
.generateReason(({ results, score }) => {
    const { indicatorsMet, totalIndicators, strengths, weaknesses } = results.analyzeStepResult

    let reason = `Task completion score: ${(score * 100).toFixed(1)}%. `
    reason += `Met ${indicatorsMet}/${totalIndicators} completion criteria.`

    if (strengths.length > 0) {
        reason += ` Strengths: ${strengths.join(', ')}.`
    }

    if (weaknesses.length > 0) {
        reason += ` Areas for improvement: ${weaknesses.join(', ')}.`
    }

    return reason
})

// Response Quality Scorer - evaluates overall quality of agent responses
export const responseQualityScorer = createScorer({
    name: 'Response Quality',
    description: 'Evaluates the overall quality, clarity, and usefulness of agent responses',
    judge: {
        model: googleAIFlashLite,
        instructions: 'You are an expert evaluator of communication quality and response effectiveness.'
    }
})
.preprocess(({ run }) => {
    const output = run.output
    let responseText = ''

    if (typeof output === 'string') {
        responseText = output
    } else if (output && typeof output === 'object') {
        responseText = JSON.stringify(output)
    }

    return { responseText }
})
.analyze(({ results }) => {
    const { responseText } = results.preprocessStepResult

    if (!responseText || responseText.trim().length === 0) {
        return {
            qualityScore: 0,
            clarity: 0,
            usefulness: 0,
            engagement: 0,
            issues: ['No response provided']
        }
    }

    // Evaluate different quality aspects
    const qualityMetrics = {
        clarity: !/(confusing|vague|unclear|ambiguous)/i.test(responseText) && responseText.length > 20,
        usefulness: /help|provide|explain|show|demonstrate|solution/i.test(responseText.toLowerCase()),
        engagement: /[?!.]/.test(responseText) && !responseText.endsWith('.'),
        professionalism: !/(stupid|dumb|idiot|terrible|awful)/i.test(responseText),
        completeness: responseText.split(' ').length > 15 && !responseText.endsWith('...'),
        structure: /\n|•|-|\d+\./.test(responseText) || responseText.includes('?')
    }

    const metricsMet = Object.values(qualityMetrics).filter(Boolean).length
    const totalMetrics = Object.keys(qualityMetrics).length
    const qualityScore = metricsMet / totalMetrics

    const issues: string[] = []
    if (!qualityMetrics.clarity) issues.push('Unclear or confusing response')
    if (!qualityMetrics.usefulness) issues.push('Does not provide useful information')
    if (!qualityMetrics.engagement) issues.push('Lacks engagement or proper punctuation')
    if (!qualityMetrics.professionalism) issues.push('Unprofessional language')
    if (!qualityMetrics.completeness) issues.push('Incomplete response')
    if (!qualityMetrics.structure) issues.push('Poorly structured')

    return {
        qualityScore,
        metricsMet,
        totalMetrics,
        responseLength: responseText.length,
        wordCount: responseText.split(' ').length,
        qualityMetrics,
        issues
    }
})
.generateScore(({ results }) => {
    return results.analyzeStepResult.qualityScore
})
.generateReason(({ results, score }) => {
    const { metricsMet, totalMetrics, issues } = results.analyzeStepResult

    let reason = `Response quality score: ${(score * 100).toFixed(1)}%. `
    reason += `Met ${metricsMet}/${totalMetrics} quality criteria.`

    if (issues.length > 0) {
        reason += ` Issues: ${issues.join(', ')}.`
    } else {
        reason += ' High-quality, well-structured response.'
    }

    return reason
})

// Creativity Scorer - evaluates creative and innovative aspects of responses
export const creativityScorer = createScorer({
    name: 'Creativity',
    description: 'Evaluates the creativity, originality, and innovative thinking in agent responses',
    judge: {
        model: googleAIFlashLite,
        instructions: 'You are an expert evaluator of creativity and innovative thinking.'
    }
})
.preprocess(({ run }) => {
    const output = run.output
    let responseText = ''

    if (typeof output === 'string') {
        responseText = output
    } else if (output && typeof output === 'object') {
        responseText = JSON.stringify(output)
    }

    return { responseText }
})
.analyze(({ results }) => {
    const { responseText } = results.preprocessStepResult

    if (!responseText || responseText.trim().length === 0) {
        return {
            creativityScore: 0,
            originality: 0,
            innovation: 0,
            uniqueness: 0,
            issues: ['No response to evaluate']
        }
    }

    // Evaluate creative aspects
    const creativityIndicators = {
        usesMetaphors: /(like|as|similar to|metaphor|analogy)/i.test(responseText),
        novelApproaches: /(innovative|creative|unique|novel|fresh|different)/i.test(responseText.toLowerCase()),
        multiplePerspectives: /(however|but|alternatively|on the other hand|another way)/i.test(responseText.toLowerCase()),
        imaginativeLanguage: /(imagine|picture|envision|dream|fantasy|vision)/i.test(responseText.toLowerCase()),
        unconventionalIdeas: /(unconventional|outside the box|think differently|break from tradition)/i.test(responseText.toLowerCase())
    }

    const indicatorsMet = Object.values(creativityIndicators).filter(Boolean).length
    const totalIndicators = Object.keys(creativityIndicators).length
    const creativityScore = indicatorsMet / totalIndicators

    const strengths: string[] = []
    const weaknesses: string[] = []

    if (creativityIndicators.usesMetaphors) strengths.push('Uses metaphors and analogies')
    else weaknesses.push('Lacks metaphorical thinking')

    if (creativityIndicators.novelApproaches) strengths.push('Presents novel approaches')
    else weaknesses.push('Conventional thinking only')

    if (creativityIndicators.multiplePerspectives) strengths.push('Considers multiple perspectives')
    else weaknesses.push('Single perspective only')

    if (creativityIndicators.imaginativeLanguage) strengths.push('Imaginative language')
    else weaknesses.push('Literal language only')

    if (creativityIndicators.unconventionalIdeas) strengths.push('Unconventional ideas')
    else weaknesses.push('Traditional approaches only')

    return {
        creativityScore,
        indicatorsMet,
        totalIndicators,
        responseLength: responseText.length,
        strengths,
        weaknesses,
        creativityIndicators
    }
})
.generateScore(({ results }) => {
    return results.analyzeStepResult.creativityScore
})
.generateReason(({ results, score }) => {
    const { indicatorsMet, totalIndicators, strengths = [], weaknesses = [] } = results.analyzeStepResult

    let reason = `Creativity score: ${(score * 100).toFixed(1)}%. `
    reason += `Met ${indicatorsMet}/${totalIndicators} creativity indicators.`

    if (strengths.length > 0) {
        reason += ` Creative elements: ${strengths.join(', ')}.`
    }

    if (weaknesses.length > 0) {
        reason += ` Areas for more creativity: ${weaknesses.join(', ')}.`
    }

    return reason
})