import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { StepCard } from './StepCard';

interface UrlToPdfGetStepProps {
  apiKey: string;
}

type ApiResult = {
  pdf: string;
  cost: number;
  success: boolean;
} | {
  success: false;
  reason: string;
} | {
  success: false;
  reason: 'Unknown error';
  details: string;
};

export const UrlToPdfGetStep: React.FC<UrlToPdfGetStepProps> = ({ apiKey }) => {
  const [url, setUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setError('API Key is not configured. Please complete Step 1.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    const endpoint = new URL('https://v2018.api2pdf.com/chrome/url');
    endpoint.searchParams.append('url', url);
    endpoint.searchParams.append('apikey', apiKey);
    
    try {
      const response = await fetch(endpoint.toString(), { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json();
        setResult({ success: false, reason: errorData.reason || 'API request failed' });
      }
    } catch (err) {
      setResult({ success: false, reason: 'Unknown error', details: (err as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StepCard
      stepNumber={2}
      title="Convert URL to PDF (GET)"
      description="Provide a public URL to convert it into a PDF using a GET request."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url-get">URL</Label>
          <Input
            id="url-get"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate PDF'}
        </Button>
      </form>
      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      {result && (
        <div className="mt-4 space-y-2 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
          <h4 className="font-semibold">Result:</h4>
          {result.success ? (
            <div>
              <p className="text-sm text-green-600">Success!</p>
              <a href={result.pdf} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 underline">
                Download PDF
              </a>
              <p className="text-xs text-gray-500">Cost: ${result.cost}</p>
            </div>
          ) : (
            <p className="text-sm text-red-600">Error: {result.reason}</p>
          )}
        </div>
      )}
    </StepCard>
  );
};