import { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileDown, LoaderCircle, CheckCircle2 } from 'lucide-react';

type ApiResult = {
  pdf: string;
  mbIn: number;
  mbOut: number;
  cost: number;
  success: boolean;
  reason?: string;
};

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);

  const handleApiCall = async (endpointSuffix: string, body: object) => {
    if (!apiKey) {
      setError('API Key is required. Please enter it in the configuration section.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(endpointSuffix);

    try {
      // Using the exact URLs from the registry definition
      const url = `https://v2018.api2pdf.com/chrome/${endpointSuffix}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
        },
        body: JSON.stringify({ 
          ...body, 
          inlinePdf: true,
          options: {} 
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.reason || `API Error: ${response.statusText}`);
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(null);
    }
  };

  const handleHtmlSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const html = formData.get('html') as string;
    const fileName = formData.get('fileName') as string;
    handleApiCall('html', { html, fileName });
  };

  const handleUrlSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    const fileName = formData.get('fileName') as string;
    handleApiCall('url', { url, fileName });
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Api2Pdf Headless Chrome</h1>
          <p className="text-muted-foreground">Generate PDFs from raw HTML or public URLs using Headless Chrome.</p>
        </header>

        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              API Configuration
            </CardTitle>
            <CardDescription>Enter your Api2Pdf API key to authenticate requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Api2Pdf key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Keys are never stored and only used for this session.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* HTML to PDF Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>HTML to PDF</CardTitle>
              <CardDescription>Convert raw HTML string to PDF.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <form onSubmit={handleHtmlSubmit} className="space-y-4 h-full flex flex-col">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="html">HTML Content</Label>
                  <Textarea 
                    id="html" 
                    name="html" 
                    className="min-h-[150px] font-mono text-xs"
                    defaultValue="<h1>Hello World</h1><p>Generated via Api2Pdf</p>" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="htmlFileName">Filename</Label>
                  <Input id="htmlFileName" name="fileName" defaultValue="document.pdf" />
                </div>
                <Button type="submit" className="w-full" disabled={loading === 'html'}>
                  {loading === 'html' && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  Convert HTML
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* URL to PDF Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>URL to PDF</CardTitle>
              <CardDescription>Convert any public website to PDF.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <form onSubmit={handleUrlSubmit} className="space-y-4 h-full flex flex-col">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="url">Website URL</Label>
                  <Input 
                    id="url" 
                    name="url" 
                    type="url" 
                    placeholder="https://example.com"
                    defaultValue="https://en.wikipedia.org/wiki/PDF" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urlFileName">Filename</Label>
                  <Input id="urlFileName" name="fileName" defaultValue="website.pdf" />
                </div>
                <div className="flex-1"></div>
                <Button type="submit" className="w-full" disabled={loading === 'url'}>
                  {loading === 'url' && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  Convert URL
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <Card className="bg-muted/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Conversion Successful</CardTitle>
              <CardDescription>Your PDF is ready for download.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-background p-3 rounded border">
                  <span className="text-muted-foreground block text-xs">Cost</span>
                  <span className="font-mono font-bold">${result.cost.toFixed(6)}</span>
                </div>
                <div className="bg-background p-3 rounded border">
                  <span className="text-muted-foreground block text-xs">Size</span>
                  <span className="font-mono font-bold">{(result.mbOut * 1024).toFixed(1)} KB</span>
                </div>
                <div className="bg-background p-3 rounded border">
                  <span className="text-muted-foreground block text-xs">Bandwidth</span>
                  <span className="font-mono font-bold">{result.mbIn.toFixed(4)} MB</span>
                </div>
              </div>
              
              <div className="pt-2">
                <a href={result.pdf} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button className="w-full gap-2">
                    <FileDown className="h-5 w-5" />
                    Download PDF
                  </Button>
                </a>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Link expires in 24 hours
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}