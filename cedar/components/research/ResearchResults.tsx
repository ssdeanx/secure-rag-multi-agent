'use client'

import React from 'react'

interface ResearchResultsProps {
    findings: string[]
    report: string
    onExport?: () => void
}

export const ResearchResults: React.FC<ResearchResultsProps> = ({
    findings,
    report,
    onExport,
}) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Research Results</h3>
                {onExport && (
                    <button
                        onClick={onExport}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Export Report
                    </button>
                )}
            </div>

            {findings.length > 0 && (
                <div>
                    <h4 className="font-medium mb-2">Key Findings</h4>
                    <ul className="space-y-2">
                        {findings.map((finding, index) => (
                            <li key={index} className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                                {finding}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {report && (
                <div>
                    <h4 className="font-medium mb-2">Comprehensive Report</h4>
                    <div className="p-4 bg-gray-50 rounded border max-h-96 overflow-y-auto">
                        <div className="whitespace-pre-wrap text-sm">{report}</div>
                    </div>
                </div>
            )}

            {findings.length === 0 && !report && (
                <div className="text-center text-gray-500 py-8">
                    No results yet. Start a research query to see findings here.
                </div>
            )}
        </div>
    )
}
