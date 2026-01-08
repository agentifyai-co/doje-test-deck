import { useState } from 'react';
import { FileText, Plus, Trash2, Loader2, AlertCircle, CheckCircle2, Key } from 'lucide-react';

interface MergeResponse {
  pdf: string;
  mbIn: number;
  mbOut: number;
  cost: number;
  success: boolean;
  reason?: string;
}

export default function PdfMerger() {
  const [apiKey, setApiKey] = useState('');
  const [urls, setUrls] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MergeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 2) {
      const newUrls = [...urls];
      newUrls.splice(index, 1);
      setUrls(newUrls);
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleMerge = async () => {
    if (!apiKey) {
      setError('Please enter your Api2Pdf Authorization Key');
      return;
    }

    const validUrls = urls.filter(u => u.trim() !== '');
    if (validUrls.length < 2) {
      setError('Please provide at least 2 valid PDF URLs to merge');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://v2018.api2pdf.com/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey
        },
        body: JSON.stringify({
          urls: validUrls
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.reason || 'Failed to merge PDFs');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">PDF Merger Utility</h1>
          <p className="text-slate-600">Combine multiple PDF documents into a single file using Api2Pdf</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-500" />
              Configuration
            </h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Api2Pdf Authorization Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <p className="mt-2 text-xs text-slate-500">
              Required for authentication. Your key is never stored.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Source Documents</h2>
            <button
              onClick={addUrlField}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add URL
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="https://example.com/document.pdf"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                {urls.length > 2 && (
                  <button
                    onClick={() => removeUrlField(index)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove URL"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <button
              onClick={handleMerge}
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Merging Documents...
                </>
              ) : (
                "Merge PDFs"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Merge Failed</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {result && result.success && (
          <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
            <div className="p-6 bg-green-50 border-b border-green-100 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Merge Successful!</h3>
                <p className="text-sm text-green-700">Your document is ready for download</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Cost</div>
                  <div className="text-lg font-mono text-slate-900">${result.cost.toFixed(4)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Input Size</div>
                  <div className="text-lg font-mono text-slate-900">{result.mbIn.toFixed(2)} MB</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Output Size</div>
                  <div className="text-lg font-mono text-slate-900">{result.mbOut.toFixed(2)} MB</div>
                </div>
              </div>

              <a
                href={result.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white text-center font-semibold rounded-lg shadow-sm transition-colors"
              >
                Download Merged PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}