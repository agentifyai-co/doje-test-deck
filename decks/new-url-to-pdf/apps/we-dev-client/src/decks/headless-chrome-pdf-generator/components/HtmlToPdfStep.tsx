import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StepCard } from './StepCard';
import { Label } from '@/components/ui/label';

interface HtmlToPdfStepProps {
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

const defaultHtml = `
<!DOCTYPE html>
<html>
<head>
<title>My Test Document</title>
</head>
<body>

<h1>Hello World!</h1>
<p>This is a test PDF from raw HTML.</p>

</body>
</html>
`.trim();

export const HtmlToPdfStep: React.FC<HtmlToPdfStepProps> = ({ apiKey }) => {
  const [html, setHtml] = useState(defaultHtml);
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
      html: html,
    };

    try {
      const response = await fetch('https://v2018.api2pdf.com/chrome/html', {
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
      stepNumber={4}
      title="Convert HTML to PDF (POST)"
      description="Provide raw HTML content to convert it into a PDF."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="html-content">HTML Content</Label>
          <textarea
            id="html-content"
            className="flex min-h-[150px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
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