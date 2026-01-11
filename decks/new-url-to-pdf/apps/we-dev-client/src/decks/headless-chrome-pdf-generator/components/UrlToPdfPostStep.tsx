import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { StepCard } from './StepCard';

interface UrlToPdfPostStepProps {
  apiKey: string;
}

type ApiResult = {
  pdf: string;
  cost: number;
  success: boolean;
} | {
  success: false;
  reason: string;
};

export const UrlToPdfPostStep: React.FC<UrlToPdfPostStepProps> = ({ apiKey }) => {
  const [url, setUrl] = useState('https://www.bing.com');
  const [fileName, setFileName] = useState('bing.pdf');
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

    const body = {
      url: url,
      fileName: fileName,
    };

    try {
      const response = await fetch('https://v2018.api2pdf.com/chrome/url', {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, reason: (err as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StepCard
      stepNumber={3}
      title="Convert URL to PDF (POST)"
      description="Provide a public URL to convert it into a PDF using a POST request."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url-post">URL</Label>
          <Input
            id="url-post"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filename-post">Output Filename</Label>
          <Input
            id="filename-post"
            placeholder="document.pdf"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
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