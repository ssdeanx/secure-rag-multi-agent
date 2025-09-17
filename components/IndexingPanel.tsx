'use client';

import { Database, Loader, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useState, useCallback, Dispatch, SetStateAction } from 'react';

interface IndexingPanelProps {
  jwt: string;
}

interface IndexingResult {
  success: boolean;
  indexed: number;
  failed: number;
  documents: Array<{
    docId: string;
    status: string;
    chunks?: number;
    error?: string;
  }>;
}

export default function IndexingPanel({ jwt }: IndexingPanelProps) {
  const [isIndexing, setIsIndexing] = useState(false);
  const [result, setResult] = useState<IndexingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIndex = useCallback(async () => {
    setIsIndexing(true);
    setResult(null);
    setError(null);

    try {
      const response: Response = await fetch('/api/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start indexing');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsIndexing(false);
    }
  }, []);

  return (
    <div className="glass-effect rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Database className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold">Document Indexing</h3>
            <p className="text-sm text-gray-400">Index corpus documents for RAG</p>
          </div>
        </div>
        
        <button
          onClick={handleIndex}
          disabled={isIndexing}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          {isIndexing ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Indexing...</span>
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              <span>Start Indexing</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-300">Error: {error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">Indexing completed</span>
            </div>
            <div className="text-sm text-green-300">
              {result.indexed} indexed, {result.failed} failed
            </div>
          </div>

          {result.documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Document Results:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {result.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-800/50 rounded text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      {doc.status === 'success' ? (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-400" />
                      )}
                      <span className="text-gray-300">{doc.docId}</span>
                    </div>
                    <div className="text-gray-400">
                      {doc.status === 'success' && doc.chunks ? (
                        `${doc.chunks} chunks`
                      ) : doc.error ? (
                        <span className="text-red-400" title={doc.error}>
                          Failed
                        </span>
                      ) : (
                        doc.status
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-400">
            <p>This will index all documents in the corpus folder with appropriate security classifications:</p>
            <ul className="mt-1 ml-4 list-disc">
              <li>HR/Confidential files: Admin access only</li>
              <li>Finance/Policy files: Manager+ access</li>
              <li>Other files: All employee access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}